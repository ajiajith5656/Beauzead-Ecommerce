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
      
      console.log('JWT Payload for role detection:', {
        'custom:role': payload?.['custom:role'],
        'role': payload?.role,
        'cognito:groups': payload?.['cognito:groups'],
        'phone_number': payload?.phone_number,
      });
      
      // PRIMARY: Check for explicit role in JWT
      const roleFromToken =
        (payload?.['custom:role'] as User['role'] | undefined) ||
        (payload?.role as User['role'] | undefined) ||
        (Array.isArray(payload?.['cognito:groups']) && payload?.['cognito:groups'].length > 0
          ? (payload?.['cognito:groups']?.[0] as User['role'] | undefined)
          : undefined) ||
        null;

      console.log('Resolved role from JWT:', roleFromToken);

      if (roleFromToken) {
        setAuthRole(roleFromToken);
        return roleFromToken;
      }

      // FALLBACK: If no role in JWT, check phone_number attribute to determine role
      console.log('No role found in JWT, attempting fallback role detection...');
      
      const phoneNumber = payload?.phone_number as string | undefined;
      
      if (phoneNumber) {
        console.log('phone_number exists in JWT → assigning seller role (fallback)');
        setAuthRole('seller');
        return 'seller';
      } else {
        console.log('No phone_number in JWT → assigning user role (fallback)');
        setAuthRole('user');
        return 'user';
      }
    } catch (error) {
      console.error('Failed to resolve role from session:', error);
      // Final fallback: assume user role
      console.warn('Failed to resolve role, defaulting to user role');
      setAuthRole('user');
      return 'user';
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
      // Fetch user profile using AppSync GraphQL
      const appsyncEndpoint = import.meta.env.VITE_APPSYNC_ENDPOINT;
      const apiKey = import.meta.env.VITE_APPSYNC_API_KEY;
      
      console.log('Fetching user profile for userId:', userId);
      console.log('AppSync endpoint:', appsyncEndpoint);
      
      if (!appsyncEndpoint || !apiKey) {
        console.error('AppSync configuration missing');
        return null;
      }

      const query = `
        query GetUser($id: ID!) {
          getUser(id: $id) {
            id
            email
            phone
            first_name
            last_name
            profile_type
            is_verified
          }
        }
      `;

      const response = await fetch(appsyncEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          query,
          variables: { id: userId }
        })
      });

      const result = await response.json();
      console.log('AppSync response:', result);
      
      if (result.data?.getUser) {
        const userData: User = {
          id: result.data.getUser.id,
          email: result.data.getUser.email || '',
          name: `${result.data.getUser.first_name || ''} ${result.data.getUser.last_name || ''}`.trim(),
          role: result.data.getUser.profile_type as 'user' | 'seller' | 'admin' || 'user',
        };
        
        console.log('Mapped user data:', userData);
        
        setUser(userData);
        if (userData.role) {
          setAuthRole(userData.role);
        }
        return userData;
      } else {
        console.log('No user data found in AppSync response');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  const signUp = async (email: string, password: string, role: 'user' | 'seller' | 'admin', fullName: string, currency?: string, phoneNumber?: string) => {
    try {
      const signupResult = await amplifyAuthService.signup({
        email,
        password,
        name: fullName,
        phone_number: phoneNumber, // Only passed for sellers
        role, // Pass role to service
      });

      // Call backend API to add user to group
      // This would require your backend to have an endpoint that can add users to Cognito groups
      // For now, the role will be determined from the JWT token if configured properly
      // The system will work once the backend Lambda creates the group assignment

      // Store currency preference
      if (currency) {
        localStorage.setItem(`currency_${signupResult.userId}`, currency);
      }

      return { success: true, userId: signupResult.userId, isSignUpComplete: signupResult.isSignUpComplete };
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

      // Wait for session to be established after signin
      await new Promise(resolve => setTimeout(resolve, 500));

      const authUser = await amplifyAuthService.getCurrentAuthUser();
      setCurrentAuthUser(authUser);

      const roleFromSession = await resolveRoleFromSession();
      let profile: User | null = null;

      if (authUser) {
        profile = await fetchUserProfile(authUser.username);
        console.log('Fetched user profile:', profile);
      }

      // Determine the final role and set it in state
      const finalRole = profile?.role || roleFromSession || null;
      console.log('Final role determined:', finalRole, 'from profile:', profile?.role, 'from session:', roleFromSession);
      
      if (finalRole) {
        setAuthRole(finalRole);
      }

      return {
        success: true,
        isSignedIn: result.isSignedIn,
        role: finalRole,
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
      
      // After OTP confirmation, user is automatically signed in by Cognito
      // Fetch the current auth user
      const authUser = await amplifyAuthService.getCurrentAuthUser();
      setCurrentAuthUser(authUser);

      if (authUser) {
        // Fetch user profile from DynamoDB
        await fetchUserProfile(authUser.username);
      }

      return { success: true, ...result };
    } catch (error: any) {
      console.error('Confirm signup error:', error);
      
      // Handle case where user is already confirmed
      if (error.name === 'NotAuthorizedException' || error.message?.includes('already') || error.message?.includes('CONFIRMED')) {
        return { success: false, error, alreadyConfirmed: true };
      }
      
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
