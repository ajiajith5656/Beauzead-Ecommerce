import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_PPPmNH7HL',
      userPoolClientId: '3hk6tg9hduv7fkotlo2h99jpin',
      identityPoolId: 'us-east-1:f2d8fd71-baf1-4b52-85d4-5f22fbb3098f',
      signUpVerificationMethod: 'code' as const, // 'code' or 'link'
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: 'https://woqi3tosm5a2jnj4w6zit2mfye.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'apiKey' as const,
      apiKey: 'da2-hgvpvqv72jcj3o2sglactpt3gq',
    },
  },
  Storage: {
    S3: {
      region: 'us-east-1',
      bucket: 'beauzead-ecommerce-images-2026',
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export { signUp, signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword };
export default amplifyConfig;
