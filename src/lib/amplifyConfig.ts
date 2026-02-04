import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

// All sensitive values should be set via environment variables in AWS Amplify Console
// Never hardcode secrets in source code
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || '',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_APPSYNC_ENDPOINT || '',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      // SECURITY: Use Cognito User Pool authorization in production
      // API Key should only be used for public, read-only operations
      defaultAuthMode: import.meta.env.VITE_APPSYNC_API_KEY ? 'apiKey' as const : 'userPool' as const,
      // Only include API key if provided (for backward compatibility)
      ...(import.meta.env.VITE_APPSYNC_API_KEY && {
        apiKey: import.meta.env.VITE_APPSYNC_API_KEY,
      }),
    },
  },
  Storage: {
    S3: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      bucket: import.meta.env.VITE_S3_BUCKET || '',
    },
  },
};

// Validate critical configuration
if (import.meta.env.MODE === 'production') {
  const missingConfig: string[] = [];
  
  if (!import.meta.env.VITE_COGNITO_USER_POOL_ID) missingConfig.push('VITE_COGNITO_USER_POOL_ID');
  if (!import.meta.env.VITE_COGNITO_CLIENT_ID) missingConfig.push('VITE_COGNITO_CLIENT_ID');
  if (!import.meta.env.VITE_APPSYNC_ENDPOINT) missingConfig.push('VITE_APPSYNC_ENDPOINT');
  
  if (missingConfig.length > 0) {
    throw new Error(`Missing critical environment variables: ${missingConfig.join(', ')}`);
  }
  
  // Warn if using API key in production
  if (import.meta.env.VITE_APPSYNC_API_KEY) {
    console.warn('⚠️ WARNING: Using API Key for AppSync in production is not recommended. Switch to Cognito User Pool authorization.');
  }
}

// Configure Amplify
Amplify.configure(amplifyConfig);

export { signUp, signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword };
export default amplifyConfig;
