# AWS Amplify Studio Integration - Quick Start Guide

## ⚡ Quick Setup (5 Minutes)

### 1. Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

### 2. Configure AWS Credentials
```bash
amplify configure
```
This will open AWS console. Create an IAM user with `AdministratorAccess-Amplify` policy.

### 3. Initialize Amplify in Project
```bash
amplify init
```
Follow the prompts:
- Project name: `beauzead-ecommerce`
- Environment: `dev`
- Editor: Your choice
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Distribution directory: `dist`
- Build command: `npm run build`
- Start command: `npm run dev`

### 4. Add Authentication
```bash
amplify add auth
```
Choose:
- ✅ `Default configuration with Social Provider (Federation)`
- Email sign-in
- No phone number
- No additional settings needed

### 5. Add API (Optional - for backend)
```bash
amplify add api
```
Choose:
- REST API
- Create a new Lambda function
- Choose your preferred runtime

### 6. Deploy to AWS
```bash
amplify push
```

### 7. Update .env File
After deployment, Amplify auto-generates `aws-exports.js`. Update your `.env`:

```env
VITE_AWS_REGION=your-region
VITE_AWS_USER_POOL_ID=your-user-pool-id
VITE_AWS_USER_POOL_CLIENT_ID=your-client-id
VITE_AWS_IDENTITY_POOL_ID=your-identity-pool-id
VITE_API_ENDPOINT=your-api-endpoint
VITE_S3_BUCKET=your-bucket-name
```

---

## 🎨 Launch Amplify Studio (Visual Builder)

```bash
amplify studio
```

This opens the visual builder where you can:
- 🖼️ Design UI components
- 📊 Connect to database
- 🔐 Manage authentication flows
- 🚀 Build workflows
- ⚡ Generate code

---

## 🔧 Usage Examples

### Sign Up User
```tsx
import { useAuth } from './contexts/AuthContext';

export function SignUp() {
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    const result = await signUp(
      'user@example.com',
      'Password123!',
      'user',
      'John Doe'
    );
    console.log(result);
  };

  return <button onClick={handleSignUp}>Sign Up</button>;
}
```

### Sign In User
```tsx
const { signIn } = useAuth();

const result = await signIn('user@example.com', 'Password123!');
if (result.success) {
  // User logged in
}
```

### Call Backend API
```tsx
import api from './lib/api';

// GET request (auto-adds auth token)
const { data: user } = await api.get('/users/profile');

// POST request
const { data: product } = await api.post('/products', {
  name: 'New Product',
  price: 99.99
});

// PUT request
await api.put('/products/123', { price: 89.99 });

// DELETE request
await api.delete('/products/123');
```

### Check Auth Status
```tsx
import { useAuth } from './contexts/AuthContext';

export function Dashboard() {
  const { currentAuthUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentAuthUser) return <Navigate to="/login" />;

  return <div>Welcome, {currentAuthUser.username}!</div>;
}
```

---

## 📱 Using Pre-built Amplify UI

```tsx
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </Authenticator>
  );
}
```

---

## 🚀 Deploy to Amplify Hosting

### Connect GitHub Repository
```bash
amplify add hosting
```
Choose:
- `Amplify Hosting` with `Git-based deployments`

### Deploy
```bash
git add .
git commit -m "Add AWS Amplify integration"
git push origin main
```

Amplify will auto-build and deploy when you push to main branch.

---

## 🔐 Enable Multi-Factor Authentication (MFA)

```bash
amplify update auth
```

Choose:
- Enable MFA
- TOTP (Time-based One-Time Password)
- Require MFA for all users

---

## 💾 Set Up Database

### Option 1: DynamoDB (Serverless NoSQL)
```bash
amplify add storage
```
- Choose DynamoDB
- Create a table (e.g., "products")

### Option 2: RDS (Relational Database)
1. Go to AWS RDS Console
2. Create PostgreSQL database
3. Connect via Lambda functions

---

## 📦 Environment Variables

Create `.env.local` for development:
```env
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_xxxxx
VITE_AWS_USER_POOL_CLIENT_ID=xxxxx
VITE_AWS_IDENTITY_POOL_ID=us-east-1:xxxxx
VITE_API_ENDPOINT=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
VITE_S3_BUCKET=beauzead-products
```

---

## 🧪 Test Your Setup

```bash
npm run dev
```

1. Visit `http://localhost:5173`
2. Try signing up with email
3. Verify email (check spam folder)
4. Sign in
5. Check browser DevTools → Application → Local Storage for tokens

---

## 📊 Monitor in AWS Console

- **Cognito**: [Console](https://console.aws.amazon.com/cognito) → Users & Groups
- **API Gateway**: [Console](https://console.aws.amazon.com/apigateway) → APIs
- **Lambda**: [Console](https://console.aws.amazon.com/lambda) → Functions
- **CloudWatch**: [Console](https://console.aws.amazon.com/cloudwatch) → Logs

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Enable CORS on API Gateway → Actions → Enable CORS |
| Session not persisting | Check localStorage in DevTools |
| Email verification not working | Check Cognito User Pool settings → Message Customization |
| API calls failing | Verify IAM role permissions → CloudWatch logs |

---

## 📚 Resources

- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Amplify Studio](https://docs.amplify.aws/console/)
- [Cognito Docs](https://docs.aws.amazon.com/cognito/)
- [API Gateway Docs](https://docs.aws.amazon.com/apigateway/)
- [Amplify CLI Docs](https://docs.amplify.aws/cli/)

---

## 🎯 Next Steps

1. ✅ Run `amplify init` → `amplify add auth` → `amplify push`
2. ✅ Copy credentials to `.env`
3. ✅ Test signup/signin flows
4. ✅ Create Lambda backend functions
5. ✅ Add database tables
6. ✅ Deploy to Amplify Hosting
7. ✅ Set up CI/CD pipeline
8. ✅ Configure custom domain

---

**Happy building! 🚀**
