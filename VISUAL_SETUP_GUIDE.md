# AWS Amplify Studio - Visual Setup Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Your React App                            │
│  (Beauzead E-commerce Frontend)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐  ┌────▼────┐  ┌────▼──────┐
    │ Auth    │  │ API     │  │ Storage   │
    │Service  │  │ Client  │  │ (S3)      │
    └────┬────┘  └────┬────┘  └────┬──────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
      ┌────────────────▼────────────────┐
      │    AWS Amplify (Backend)        │
      └────┬─────────┬─────────┬────────┘
           │         │         │
      ┌────▼──┐ ┌───▼──┐ ┌───▼────┐
      │Cognito│ │API GW│ │Lambda  │
      │(Auth) │ │(REST)│ │(Compute)
      └─┬──┬──┘ └───┬──┘ └───┬────┘
        │  │        │        │
      ┌─▼──▼┐  ┌───▼──┐  ┌──▼───┐
      │User │  │Data  │  │Logic │
      │Pool │  │(DB)  │  │(Code)│
      └────┘  └──────┘  └──────┘
```

## Setup Timeline

```
Start
  │
  ├─► Install Amplify CLI (1 min)
  │
  ├─► Configure AWS Credentials (2 min)
  │
  ├─► amplify init (3 min)
  │
  ├─► amplify add auth (2 min)
  │
  ├─► amplify push (5 min - deployment)
  │
  ├─► Update .env (1 min)
  │
  ├─► Test Local (npm run dev) (5 min)
  │
  ├─► amplify studio (opens in browser) (1 min)
  │
  ├─► Build API/Database (Optional, 30+ min)
  │
  ├─► amplify add hosting (Optional, 5 min)
  │
  └─► Deploy to Production (When ready)

Total Time: 25 minutes minimum
```

## File Structure After Setup

```
Beauzead-Ecommerce/
├── src/
│   ├── lib/
│   │   ├── amplifyConfig.ts      ← Cognito Config
│   │   ├── amplifyAuth.ts        ← Auth Service
│   │   ├── api.ts                ← API Client (with auth)
│   │   └── supabase.ts           ← (deprecated)
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx       ← Updated for Amplify
│   │
│   ├── components/
│   │   └── auth/
│   │       ├── AmplifyAuthComponents.tsx ← New UI
│   │       ├── Login.tsx         ← Update to use Amplify
│   │       └── Signup.tsx        ← Update to use Amplify
│   │
│   └── App.tsx                   ← Already set up ✓
│
├── .env                          ← Add AWS credentials
├── .env.local                    ← (Optional, local dev)
├── package.json                  ← Updated dependencies ✓
│
├── AMPLIFY_QUICK_START.md        ← Start here!
├── AWS_AMPLIFY_SETUP.md          ← Detailed guide
├── MIGRATION_GUIDE.md            ← What changed
├── AMPLIFY_BACKEND_EXAMPLES.md   ← Backend code
├── AMPLIFY_INTEGRATION_SUMMARY.md ← Overview
├── AMPLIFY_CHECKLIST.md          ← Task checklist
│
└── amplify/                      ← (Created after amplify init)
    ├── backend/
    │   ├── auth/
    │   ├── function/             ← Lambda functions
    │   └── api/                  ← REST API endpoints
    └── .config/
        └── project.json
```

## Data Flow

### Authentication Flow
```
User Signup
    │
    ├─► Frontend (React)
    │   └─► amplifyAuth.signup()
    │
    ├─► AWS Cognito
    │   ├─► Hash password
    │   ├─► Store in User Pool
    │   └─► Send verification email
    │
    ├─► User clicks email link/enters code
    │   └─► confirmSignUp()
    │
    ├─► Cognito confirms
    │   └─► Auto sign in (optional)
    │
    ├─► Frontend stores JWT token
    │   └─► localStorage
    │
    └─► User logged in ✓
```

### API Call Flow
```
React Component
    │
    ├─► api.get('/products')
    │
    ├─► API Client
    │   ├─► Get auth token from localStorage
    │   ├─► Add to Authorization header
    │   └─► Send request
    │
    ├─► API Gateway
    │   └─► Route to Lambda
    │
    ├─► Lambda Function
    │   ├─► Validate token (via authorizer)
    │   ├─► Query database
    │   └─► Return data
    │
    ├─► API Gateway
    │   └─► Return response with CORS headers
    │
    ├─► React Component
    │   ├─► Parse response
    │   └─► Update state
    │
    └─► UI Updates with data ✓
```

## AWS Console Navigation

### To Check Cognito Users:
```
AWS Console 
    └─► Cognito 
        └─► User Pools 
            └─► [Your Pool] 
                └─► Users and groups
                    └─► See all signed up users
```

### To Check API Gateway:
```
AWS Console 
    └─► API Gateway 
        └─► [Your API] 
            └─► Resources 
                └─► See all endpoints
```

### To Check Lambda Functions:
```
AWS Console 
    └─► Lambda 
        └─► Functions 
            └─► See all functions
                └─► View logs in CloudWatch
```

### To Check DynamoDB (if added):
```
AWS Console 
    └─► DynamoDB 
        └─► Tables 
            └─► View items
                └─► Check query capacity
```

## Amplify Studio View

```
┌─────────────────────────────────────────────┐
│  AWS Amplify Studio (Browser)               │
├─────────────────────────────────────────────┤
│                                             │
│  Sidebar:                                   │
│  ├─ 🎨 UI Components                       │
│  │   ├─ Create component                   │
│  │   ├─ Edit component                     │
│  │   └─ Build UI visually                  │
│  │                                         │
│  ├─ 📊 Data                                │
│  │   ├─ Models                             │
│  │   ├─ Create table                       │
│  │   ├─ View items                         │
│  │   └─ Query data                         │
│  │                                         │
│  ├─ 🔐 Auth                                │
│  │   ├─ User pool settings                 │
│  │   ├─ View users                         │
│  │   └─ Manage permissions                 │
│  │                                         │
│  ├─ ⚡ Functions                           │
│  │   ├─ View Lambda functions              │
│  │   ├─ Edit code                          │
│  │   └─ Test execution                     │
│  │                                         │
│  └─ 🚀 Workflows                           │
│      ├─ Create workflow                    │
│      ├─ Trigger actions                    │
│      └─ Automate tasks                     │
│                                             │
└─────────────────────────────────────────────┘
```

## Environment Variables Mapping

```
AWS Cognito                 →    .env File
───────────────────────         ─────────────────
User Pool ID               →    VITE_AWS_USER_POOL_ID
User Pool Client ID        →    VITE_AWS_USER_POOL_CLIENT_ID
Region                     →    VITE_AWS_REGION
Identity Pool ID           →    VITE_AWS_IDENTITY_POOL_ID
(optional)
```

## Command Reference Card

```
┌──────────────────────────────────────────────────┐
│  Essential Amplify Commands                      │
├──────────────────────────────────────────────────┤
│ amplify init          → Initialize project       │
│ amplify add auth      → Add authentication       │
│ amplify add api       → Add REST API             │
│ amplify add storage   → Add database             │
│ amplify push          → Deploy to AWS            │
│ amplify pull          → Pull latest changes      │
│ amplify studio        → Open visual builder      │
│ amplify status        → Check deployment status  │
│ amplify delete        → Delete all resources     │
│ amplify env add       → Add new environment      │
│ amplify env checkout  → Switch environment      │
└──────────────────────────────────────────────────┘
```

## Testing Checklist (In Order)

```
1. ✓ Run: npm run dev
   └─ Check: App loads on localhost:5173

2. ✓ Test Signup
   └─ Check: Form submits, email sent

3. ✓ Verify Email
   └─ Check: Code received in email

4. ✓ Confirm Email
   └─ Check: Code accepted

5. ✓ Test Login
   └─ Check: Token in localStorage

6. ✓ Check Token
   └─ Check: DevTools → Application → localStorage
           → amplify_* tokens visible

7. ✓ Test Logout
   └─ Check: Token removed from localStorage

8. ✓ Test API Call (if backend set up)
   └─ Check: Data returned with auth token

9. ✓ Test Password Reset
   └─ Check: Email received, new password works

10. ✓ Test Session Persistence
    └─ Check: Page refresh keeps user logged in
```

## Troubleshooting Decision Tree

```
Issue: "amplify: command not found"
├─ Solution: npm install -g @aws-amplify/cli
└─ Test: amplify --version

Issue: CORS errors
├─ Check: API Gateway CORS enabled
├─ Check: Allowed origins include localhost
└─ Solution: Re-deploy with: amplify push

Issue: Email verification not working
├─ Check: Email in spam folder
├─ Check: Cognito email settings
└─ Solution: Re-send verification code

Issue: Login fails with 401
├─ Check: Credentials correct
├─ Check: User email verified
└─ Check: AuthContext initialized

Issue: API returns 401 even with token
├─ Check: Token format in header
├─ Check: Authorization header present
├─ Check: Token not expired
└─ Check: Lambda authorizer configured

Issue: Project won't build
├─ Check: npm install completed
├─ Check: .env file has all variables
└─ Check: TypeScript errors resolved
```

## Success Checklist ✅

```
Setup Complete When:
- ✅ amplify init succeeded
- ✅ amplify add auth succeeded
- ✅ amplify push succeeded
- ✅ .env has Cognito credentials
- ✅ npm run dev starts without errors
- ✅ Signup works
- ✅ Email verification works
- ✅ Login works
- ✅ Token in localStorage
- ✅ Logout works
- ✅ Amplify Studio launches
```

## Next Steps

1. **Complete Setup** → Follow AMPLIFY_QUICK_START.md
2. **Review Docs** → Read AWS_AMPLIFY_SETUP.md
3. **Build Backend** → Use AMPLIFY_BACKEND_EXAMPLES.md
4. **Update Components** → Update Login/Signup pages
5. **Test Everything** → Follow testing checklist
6. **Deploy to Production** → Use Amplify Hosting

---

**You're all set!** Start with `amplify init` 🚀
