import React, { createContext, useContext, useState, useEffect } from 'react';
import '../lib/amplifyConfig'; // Initialize Amplify
import amplifyAuthService, { type AuthUser } from '../lib/amplifyAuth';
import apiClient from '../lib/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  currentAuthUser: AuthUser | null;
  authRole: User['role'] | null;
  loading: boolean;
  signUp: (email: string, password: string, role: 'user' | 'seller' | 'admin', fullName: string, currency?: string, phoneNumber?: string) => Promise<any>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; isSignedIn?: boolean; role?: User['role'] | null; error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<any>;
  confirmSignUp: (email: string, code: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentAuthUser, setCurrentAuthUser] = useState<AuthUser | null>(null);
  const [authRole, setAuthRole] = useState<User['role'] | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeJwtPayload = (token?: string | null): Record<string, any> | null => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(normalized);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode JWT payload:', error);
      return null;
    }
  };

  const resolveRoleFromSession = async (): Promise<User['role'] | null> => {
    try {
      const session = await amplifyAuthService.getAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      const payload = decodeJwtPayload(idToken);
      const roleFromToken =
        (payload?.['custom:role'] as User['role'] | undefined) ||
        (payload?.role as User['role'] | undefined) ||
        (Array.isArray(payload?.['cognito:groups'])
          ? (payload?.['cognito:groups']?.[0] as User['role'] | undefined)
          : undefined) ||
        null;

      if (roleFromToken) {
        setAuthRole(roleFromToken);
      }

      return roleFromToken;
    } catch (error) {
      console.error('Failed to resolve role from session:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check if user is already signed in
    const checkAuthStatus = async () => {
      try {
        const authUser = await amplifyAuthService.getCurrentAuthUser();
        setCurrentAuthUser(authUser);
        await resolveRoleFromSession();
        if (authUser) {
          // Fetch additional user profile from your backend
          await fetchUserProfile(authUser.username);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await apiClient.get<User>(`/users/${userId}`);
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        setUser(data);
        if (data.role) {
          setAuthRole(data.role);
        }
        return data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  const signUp = async (email: string, password: string, _role: 'user' | 'seller' | 'admin', fullName: string, currency?: string, phoneNumber?: string) => {
    try {
      const result = await amplifyAuthService.signup({
        email,
        password,
        name: fullName,
        phone_number: phoneNumber, // Only passed for sellers
      });

      // Store currency preference
      if (currency) {
        localStorage.setItem(`currency_${result.userId}`, currency);
      }

      return { success: true, userId: result.userId, isSignUpComplete: result.isSignUpComplete };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await amplifyAuthService.signin({
        email,
        password,
      });

      const authUser = await amplifyAuthService.getCurrentAuthUser();
      setCurrentAuthUser(authUser);

      const roleFromSession = await resolveRoleFromSession();
      let profile: User | null = null;

      if (authUser) {
        profile = await fetchUserProfile(authUser.username);
      }

      return {
        success: true,
        isSignedIn: result.isSignedIn,
        role: profile?.role || roleFromSession || null,
      };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await amplifyAuthService.signout();
      setUser(null);
      setCurrentAuthUser(null);
      setAuthRole(null);
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await amplifyAuthService.initiatePasswordReset(email);
      return { success: true, ...result };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error };
    }
  };

  const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
    try {
      await amplifyAuthService.confirmPasswordReset(email, code, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Confirm password reset error:', error);
      return { success: false, error };
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      const result = await amplifyAuthService.confirmSignUp(email, code);
      
      const authUser = await amplifyAuthService.getCurrentAuthUser();
      setCurrentAuthUser(authUser);

      if (authUser) {
        await fetchUserProfile(authUser.username);
      }

      return { success: true, ...result };
    } catch (error) {
      console.error('Confirm signup error:', error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    currentAuthUser,
    authRole,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    confirmPasswordReset,
    confirmSignUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
