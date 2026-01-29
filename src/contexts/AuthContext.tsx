import React, { createContext, useContext, useState, useEffect } from 'react';
import '../lib/amplifyConfig'; // Initialize Amplify
import amplifyAuthService, { type AuthUser } from '../lib/amplifyAuth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  currentAuthUser: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, role: 'user' | 'seller' | 'admin', fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<any>;
  confirmSignUp: (email: string, code: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentAuthUser, setCurrentAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const checkAuthStatus = async () => {
      try {
        const authUser = await amplifyAuthService.getCurrentAuthUser();
        setCurrentAuthUser(authUser);
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

  const fetchUserProfile = async (userId: string) => {
    try {
      // TODO: Replace with your backend API call
      // const response = await fetch(`/api/users/${userId}`);
      // const userData = await response.json();
      // setUser(userData);
      console.log('Fetching profile for user:', userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, _role: 'user' | 'seller' | 'admin', fullName: string) => {
    try {
      const result = await amplifyAuthService.signup({
        email,
        password,
        name: fullName,
      });

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

      if (authUser) {
        await fetchUserProfile(authUser.username);
      }

      return { success: true, isSignedIn: result.isSignedIn };
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
