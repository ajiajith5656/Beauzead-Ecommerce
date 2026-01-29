# AWS Amplify Studio Integration Guide

This guide will help you connect your Beauzead E-commerce backend to AWS Amplify Studio.

## What's Been Done

1. ✅ Installed AWS Amplify dependencies
2. ✅ Created Amplify configuration file (`src/lib/amplifyConfig.ts`)
3. ✅ Created Amplify Auth service (`src/lib/amplifyAuth.ts`)
4. ✅ Updated AuthContext to use Amplify instead of Supabase
5. ✅ Updated `.env` file with Amplify configuration variables

## Step 1: Set Up AWS Amplify Project

### Create an AWS Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click **Create app**
3. Choose **Host web app** or connect your GitHub repository
4. Select your Git provider and authorize
5. Choose your repository and branch (main)
6. Review settings and deploy

### Deploy Your Backend

Once your app is created:

```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify CLI with your AWS credentials
amplify configure

# Initialize Amplify in your project (optional, already done)
amplify init

# Add authentication
amplify add auth

# Add API (REST or GraphQL)
amplify add api

# Deploy backend
amplify push
```

## Step 2: Set Up AWS Cognito User Pool

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito)
2. Click **Create user pool**
3. Configure:
   - **Cognito user pool sign-in options**: Email
   - **Password policy**: Standard (or custom)
   - **Multi-factor authentication**: Optional or Required
4. Configure app client:
   - **App type**: Public client
   - **Authentication flows**: ALLOW_USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH
   - **Allowed redirect URIs**: `http://localhost:5173`, `http://localhost:3000`, your production domain
5. Note your:
   - **User Pool ID**
   - **User Pool Client ID**
   - **AWS Region**

## Step 3: Set Up AWS Identity Pool (Optional)

If you need access to AWS services like S3:

1. Go to [AWS Cognito Identity Pools](https://console.aws.amazon.com/cognito-identity)
2. Click **Create new identity pool**
3. Configure trust relationships with your User Pool
4. Note your **Identity Pool ID**

## Step 4: Update Environment Variables

Update your `.env` file with values from above:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_xxxxxxxxxxxxx
VITE_AWS_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_API_ENDPOINT=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
VITE_S3_BUCKET=your-bucket-name

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
```

## Step 5: Set Up API Gateway (Optional)

For REST API:

1. Go to [AWS API Gateway Console](https://console.aws.amazon.com/apigateway)
2. Create a new REST API
3. Create resources and methods
4. Enable CORS
5. Deploy to a stage
6. Note your API endpoint

## Step 6: Update Authentication Code

Your authentication context now uses Amplify. Update your auth pages:

### Example: Login Component

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (!result.success) {
      setError(result.error?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      {error && <div>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Step 7: Set Up Backend API

Create your backend API using:

- **AWS Lambda** for serverless functions
- **API Gateway** to expose endpoints
- **DynamoDB** or **RDS** for databases
- **S3** for file storage

### Example: Backend User Creation

```python
# AWS Lambda Function (Python)
import json
import boto3

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('users')

def lambda_handler(event, context):
    user_id = event['pathParameters']['userId']
    body = json.loads(event['body'])
    
    users_table.put_item(Item={
        'userId': user_id,
        'email': body['email'],
        'role': body['role'],
        'fullName': body['fullName'],
        'approved': body.get('approved', True)
    })
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'User created'})
    }
```

## Step 8: Connect to Amplify Studio (Visual Builder)

1. Go to your Amplify app in the console
2. Click **Studio** in the sidebar
3. Click **Launch Studio**
4. In Studio, you can:
   - Build UI components visually
   - Connect to your database
   - Create workflows
   - Manage authentication flows
   - Generate code automatically

## Step 9: Update Package.json Scripts (Optional)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "amplify:push": "amplify push",
    "amplify:pull": "amplify pull",
    "amplify:delete": "amplify delete"
  }
}
```

## Step 10: Testing Locally

1. Create a test `.env.local` file with your Cognito credentials
2. Run your development server:
   ```bash
   npm run dev
   ```
3. Test authentication flows:
   - Sign up
   - Confirm email
   - Sign in
   - Password reset

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure your API Gateway has CORS enabled:
```
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Origin: *
```

### Authentication Not Working
- Check that your User Pool Client ID is correct
- Verify your redirect URIs in Cognito settings
- Ensure environment variables are loaded correctly

### API Calls Failing
- Verify API endpoint in `.env`
- Check IAM roles and policies
- Enable CloudWatch logs for debugging

## Next Steps

1. Configure seller and admin roles in Cognito
2. Set up multi-factor authentication (MFA)
3. Create backend API endpoints
4. Integrate with your database
5. Set up Stripe payments
6. Create CI/CD pipeline with Amplify

## Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Amplify Studio Docs](https://docs.amplify.aws/console/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)

## Support

For issues or questions:
1. Check AWS Amplify forums
2. Review CloudWatch logs
3. Contact AWS support
