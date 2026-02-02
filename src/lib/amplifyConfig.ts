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
      defaultAuthMode: 'apiKey' as const,
      apiKey: import.meta.env.VITE_APPSYNC_API_KEY || '',
    },
  },
  Storage: {
    S3: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      bucket: import.meta.env.VITE_S3_BUCKET || '',
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export { signUp, signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword };
export default amplifyConfig;
