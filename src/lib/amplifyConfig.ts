import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
      signUpVerificationMethod: 'code' as const, // 'code' or 'link'
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
  API: {
    REST: {
      endpoint: import.meta.env.VITE_API_ENDPOINT || '',
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
