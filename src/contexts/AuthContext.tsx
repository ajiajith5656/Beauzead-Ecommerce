import React, { createContext, useContext, useState, useEffect } from 'react';
import '../lib/amplifyConfig'; // Initialize Amplify
import amplifyAuthService, { type AuthUser } from '../lib/amplifyAuth';
import type { User } from '../types';
import logger from '../utils/logger';
import { userSignupSchema, userLoginSchema, passwordResetSchema } from '../utils/validation';

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
  signOut: () => Promise<'user' | 'seller' | 'admin' | null>;
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
      logger.error(error as Error, { context: 'JWT decode failed' });
      return null;
    }
  };

  const resolveRoleFromSession = async (): Promise<User['role'] | null> => {
    try {
      const session = await amplifyAuthService.getAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      const payload = decodeJwtPayload(idToken);
      
      logger.debug('JWT Payload for role detection:', {
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

      logger.debug('Resolved role from JWT:', roleFromToken);

      if (roleFromToken) {
        setAuthRole(roleFromToken);
        return roleFromToken;
      }

      // FALLBACK: If no role in JWT, check phone_number attribute to determine role
      logger.debug('No role found in JWT, attempting fallback role detection...');
      
      const phoneNumber = payload?.phone_number as string | undefined;
      
      if (phoneNumber) {
        logger.debug('phone_number exists in JWT → assigning seller role (fallback)');
        setAuthRole('seller');
        return 'seller';
      } else {
        logger.debug('No phone_number in JWT → assigning user role (fallback)');
        setAuthRole('user');
        return 'user';
      }
    } catch (error) {
      logger.error(error as Error, { context: 'Failed to resolve role from session' });
      // Final fallback: assume user role
      logger.warn('Failed to resolve role, defaulting to user role');
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
        logger.error(error as Error, { context: 'Error checking auth status' });
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
      
      logger.debug('Fetching user profile for userId:', userId);
      logger.debug('AppSync endpoint:', appsyncEndpoint);
      
      if (!appsyncEndpoint || !apiKey) {
        logger.error('AppSync configuration missing');
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
      logger.api('POST', appsyncEndpoint, response.status);
      
      if (result.data?.getUser) {
        const userData: User = {
          id: result.data.getUser.id,
          email: result.data.getUser.email || '',
          role: result.data.getUser.profile_type as 'user' | 'seller' | 'admin' || 'user',
          created_at: new Date().toISOString(),
        };
        
        logger.debug('Mapped user data:', userData);
        
        setUser(userData);
        if (userData.role) {
          setAuthRole(userData.role);
        }
        return userData;
      } else {
        logger.warn('No user data found in AppSync response');
      }
    } catch (error) {
      logger.error(error as Error, { context: 'Error fetching user profile' });
    }
    return null;
  };

  const signUp = async (email: string, password: string, role: 'user' | 'seller' | 'admin', fullName: string, currency?: string, phoneNumber?: string) => {
    try {
      // Validate input
      const validatedData = userSignupSchema.parse({
        email,
        password,
        fullName,
        role,
        phoneNumber,
        currency,
      });

      const signupResult = await amplifyAuthService.signup({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.fullName,
        phone_number: validatedData.phoneNumber,
        role: validatedData.role,
      });

      logger.auth('User signed up', signupResult.userId);

      // Store currency preference
      if (validatedData.currency) {
        localStorage.setItem(`currency_${signupResult.userId}`, validatedData.currency);
      }

      return { success: true, userId: signupResult.userId, isSignUpComplete: signupResult.isSignUpComplete };
    } catch (error) {
      logger.error(error as Error, { context: 'Signup error' });
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate input
      const validatedData = userLoginSchema.parse({ email, password });

      const result = await amplifyAuthService.signin({
        email: validatedData.email,
        password: validatedData.password,
      });

      // Wait for session to be established after signin
      await new Promise(resolve => setTimeout(resolve, 500));

      const authUser = await amplifyAuthService.getCurrentAuthUser();
      setCurrentAuthUser(authUser);

      const roleFromSession = await resolveRoleFromSession();
      let profile: User | null = null;

      if (authUser) {
        profile = await fetchUserProfile(authUser.username);
        logger.debug('Fetched user profile:', profile);
      }

      // Determine the final role and set it in state
      const finalRole = profile?.role || roleFromSession || null;
      logger.auth('User signed in', authUser?.username);
      logger.debug('Final role determined:', finalRole, 'from profile:', profile?.role, 'from session:', roleFromSession);
      
      if (finalRole) {
        setAuthRole(finalRole);
      }

      // Set user context for error tracking
      logger.setUser(authUser ? {
        id: authUser.username,
        email: profile?.email,
        role: finalRole || undefined,
      } : null);

      return {
        success: true,
        isSignedIn: result.isSignedIn,
        role: finalRole,
      };
    } catch (error) {
      logger.error(error as Error, { context: 'Signin error' });
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      const roleBeforeSignout = authRole;
      await amplifyAuthService.signout();
      setUser(null);
      setCurrentAuthUser(null);
      setAuthRole(null);
      
      // Clear any localStorage items
      localStorage.clear();
      sessionStorage.clear();

      // Clear user context in error tracking
      logger.setUser(null);
      logger.auth('User signed out', roleBeforeSignout || 'unknown');
      
      // Return the role for navigation purposes
      return roleBeforeSignout;
    } catch (error) {
      logger.error(error as Error, { context: 'Signout error' });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const validatedData = passwordResetSchema.parse({ email });
      const result = await amplifyAuthService.initiatePasswordReset(validatedData.email);
      logger.auth('Password reset initiated', validatedData.email);
      return { success: true, ...result };
    } catch (error) {
      logger.error(error as Error, { context: 'Password reset error' });
      return { success: false, error };
    }
  };

  const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
    try {
      await amplifyAuthService.confirmPasswordReset(email, code, newPassword);
      logger.auth('Password reset confirmed', email);
      return { success: true };
    } catch (error) {
      logger.error(error as Error, { context: 'Confirm password reset error' });
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
        logger.auth('User confirmed signup', authUser.username);
      }

      return { success: true, ...result };
    } catch (error: any) {
      logger.error(error as Error, { context: 'Confirm signup error' });
      
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
