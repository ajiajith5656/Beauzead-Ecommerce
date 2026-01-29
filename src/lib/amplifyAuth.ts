import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  resetPassword, 
  confirmResetPassword, 
  confirmSignUp,
  autoSignIn,
  fetchAuthSession 
} from 'aws-amplify/auth';

export interface AuthUser {
  username: string;
  email?: string;
  attributes?: {
    email?: string;
    name?: string;
    phone_number?: string;
    [key: string]: any;
  };
}

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
  phone_number?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

class AmplifyAuthService {
  async signup(input: SignUpInput) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: input.email,
        password: input.password,
        options: {
          userAttributes: {
            email: input.email,
            name: input.name,
            phone_number: input.phone_number,
          },
          autoSignIn: true,
        },
      });

      return {
        success: true,
        userId,
        isSignUpComplete,
        nextStep,
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode,
      });

      if (isSignUpComplete) {
        await autoSignIn();
      }

      return { isSignUpComplete, nextStep };
    } catch (error: any) {
      console.error('Confirm signup error:', error);
      throw new Error(error.message || 'Failed to confirm sign up');
    }
  }

  async signin(input: SignInInput) {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: input.email,
        password: input.password,
      });

      return { isSignedIn, nextStep };
    } catch (error: any) {
      console.error('Signin error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async signout() {
    try {
      await signOut();
      return { success: true };
    } catch (error: any) {
      console.error('Signout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async getCurrentAuthUser(): Promise<AuthUser | null> {
    try {
      const user = await getCurrentUser();
      return user as AuthUser;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getAuthSession() {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error: any) {
      console.error('Get auth session error:', error);
      return null;
    }
  }

  async initiatePasswordReset(email: string) {
    try {
      const { nextStep } = await resetPassword({
        username: email,
      });
      return { nextStep };
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  async confirmPasswordReset(email: string, confirmationCode: string, newPassword: string) {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });
      return { success: true };
    } catch (error: any) {
      console.error('Confirm password reset error:', error);
      throw new Error(error.message || 'Failed to confirm password reset');
    }
  }
}

export default new AmplifyAuthService();
