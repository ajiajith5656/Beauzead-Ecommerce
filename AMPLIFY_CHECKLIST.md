# AWS Amplify Integration Checklist

## Pre-Setup Requirements
- [ ] AWS Account created
- [ ] AWS CLI installed
- [ ] IAM user with Amplify permissions
- [ ] Node.js 16+ installed
- [ ] Git configured

## Step 1: Local Setup (5 min)
- [x] AWS Amplify dependencies installed
- [x] Amplify configuration file created
- [x] Amplify auth service created
- [x] API client created
- [x] AuthContext updated
- [x] Environment variables configured
- [ ] Run `npm run dev` to test locally

## Step 2: AWS Configuration (10 min)
- [ ] Amplify CLI installed: `npm install -g @aws-amplify/cli`
- [ ] AWS credentials configured: `amplify configure`
- [ ] Create IAM user with `AdministratorAccess-Amplify` policy
- [ ] Test credentials: `aws sts get-caller-identity`

## Step 3: Initialize Amplify (5 min)
- [ ] Run `amplify init` in project root
- [ ] Choose project name: `beauzead-ecommerce`
- [ ] Choose environment: `dev`
- [ ] Choose framework: `react`
- [ ] Choose source directory: `src`
- [ ] Choose distribution directory: `dist`

## Step 4: Add Authentication (5 min)
- [ ] Run `amplify add auth`
- [ ] Choose: "Default configuration with Social Provider"
- [ ] Select: "Email" as sign-in method
- [ ] Confirm other settings

## Step 5: Deploy Backend (10 min)
- [ ] Run `amplify push`
- [ ] Review and confirm changes
- [ ] Wait for deployment to complete
- [ ] Note your Cognito credentials:
  - [ ] User Pool ID
  - [ ] User Pool Client ID
  - [ ] Region
  - [ ] Identity Pool ID (if created)

## Step 6: Update Environment Variables (5 min)
- [ ] Open `.env` file
- [ ] Update with Cognito credentials:
  ```env
  VITE_AWS_REGION=us-east-1
  VITE_AWS_USER_POOL_ID=your-user-pool-id
  VITE_AWS_USER_POOL_CLIENT_ID=your-client-id
  VITE_AWS_IDENTITY_POOL_ID=your-identity-pool-id
  ```
- [ ] Save file

## Step 7: Test Authentication (10 min)
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:5173
- [ ] Test signup with email
- [ ] Check email for verification code
- [ ] Enter verification code
- [ ] Test login
- [ ] Check localStorage for tokens (DevTools → Application)
- [ ] Test logout

## Step 8: Amplify Studio Setup (5 min)
- [ ] Run `amplify studio`
- [ ] Studio opens in browser
- [ ] Explore UI builder
- [ ] Create sample component (optional)

## Step 9: Add Backend API (15 min)
### Option A: Using Amplify
- [ ] Run `amplify add api`
- [ ] Choose "REST API"
- [ ] Choose "Create new Lambda function"
- [ ] Choose runtime
- [ ] Add resource paths (/users, /products, etc.)

### Option B: Using Lambda Console (Manual)
- [ ] Create Lambda function for user creation
- [ ] Create Lambda function for product listing
- [ ] Create API Gateway endpoints
- [ ] Test endpoints with Postman/curl

## Step 10: Deploy API (10 min)
- [ ] If using Amplify: `amplify push`
- [ ] Get API endpoint URL
- [ ] Update `.env`:
  ```env
  VITE_API_ENDPOINT=https://your-api-endpoint.com
  ```
- [ ] Test API calls from frontend

## Step 11: Update Components (Ongoing)
- [ ] Update Login component to use new auth
- [ ] Update Signup component to use new auth
- [ ] Update seller authentication pages
- [ ] Update admin authentication pages
- [ ] Test all auth flows
- [ ] Add error handling

## Step 12: Database Setup (Optional but Recommended)
### Option A: DynamoDB (Recommended)
- [ ] Run `amplify add storage`
- [ ] Choose "NoSQL Database"
- [ ] Configure tables:
  - [ ] Users table
  - [ ] Products table
  - [ ] Orders table
  - [ ] Reviews table

### Option B: RDS (PostgreSQL)
- [ ] Create RDS instance in AWS Console
- [ ] Configure security groups
- [ ] Get connection string
- [ ] Create database schema

- [ ] Deploy: `amplify push`

## Step 13: Configure API Endpoints (20 min)
- [ ] Update `VITE_API_ENDPOINT` in `.env`
- [ ] Update API client configuration
- [ ] Test API calls with auth tokens
- [ ] Verify CORS headers
- [ ] Enable CloudWatch logging

## Step 14: File Storage Setup (Optional)
- [ ] Run `amplify add storage`
- [ ] Choose "Content (Images, audio, video, etc.)"
- [ ] Configure S3 bucket
- [ ] Set public/private access rules
- [ ] Deploy: `amplify push`
- [ ] Update `.env` with bucket name:
  ```env
  VITE_S3_BUCKET=your-bucket-name
  ```

## Step 15: Multi-Factor Authentication (Optional)
- [ ] Run `amplify update auth`
- [ ] Enable MFA
- [ ] Choose TOTP or SMS
- [ ] Test MFA flow

## Step 16: Amplify Hosting Setup (Optional)
- [ ] Run `amplify add hosting`
- [ ] Choose "Amplify Hosting"
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Enable auto-deploy on git push

## Step 17: Deploy to Production (When Ready)
- [ ] Create production environment: `amplify env add`
- [ ] Push to new environment: `amplify push --environment prod`
- [ ] Configure custom domain
- [ ] Set up SSL/TLS certificate
- [ ] Configure DNS records

## Step 18: Monitoring & Logging
- [ ] Enable CloudWatch logs for Lambda
- [ ] Set up CloudWatch alarms
- [ ] Enable API Gateway logging
- [ ] Monitor Cognito user signups
- [ ] Set up email notifications

## Step 19: Security Hardening
- [ ] Enable MFA for all users
- [ ] Configure CORS restrictions
- [ ] Set up WAF rules
- [ ] Enable CloudTrail logging
- [ ] Review IAM permissions
- [ ] Configure API rate limiting

## Step 20: Testing & Optimization
- [ ] Load test API endpoints
- [ ] Test error handling
- [ ] Verify token refresh works
- [ ] Test mobile responsiveness
- [ ] Optimize Lambda cold starts
- [ ] Enable caching where appropriate

## Post-Deployment Tasks
- [ ] Set up automated backups (DynamoDB/RDS)
- [ ] Configure email templates in Cognito
- [ ] Set up custom domain
- [ ] Configure CDN for static assets
- [ ] Set up error alerts
- [ ] Document API endpoints
- [ ] Create user documentation
- [ ] Train team on Amplify Studio
- [ ] Schedule regular security audits
- [ ] Plan scaling strategy

## Troubleshooting Checklist
If something goes wrong:
- [ ] Check `.env` file for correct credentials
- [ ] Check browser console for errors
- [ ] Check CloudWatch logs for Lambda errors
- [ ] Verify Cognito User Pool settings
- [ ] Check API Gateway CORS configuration
- [ ] Verify IAM role permissions
- [ ] Clear browser cache and localStorage
- [ ] Check AWS CLI version
- [ ] Verify network connectivity
- [ ] Review AWS billing for unexpected costs

## Documentation Checklist
- [ ] Read AMPLIFY_QUICK_START.md
- [ ] Read AWS_AMPLIFY_SETUP.md
- [ ] Read MIGRATION_GUIDE.md
- [ ] Read AMPLIFY_BACKEND_EXAMPLES.md
- [ ] Bookmark AWS Amplify docs
- [ ] Bookmark Cognito docs
- [ ] Bookmark API Gateway docs
- [ ] Join AWS Amplify community
- [ ] Watch Amplify tutorials

## Success Indicators
✅ All checklist items completed
✅ Signup/login working
✅ Auth tokens in localStorage
✅ API calls returning data
✅ Lambda functions executing
✅ DynamoDB/Database storing data
✅ Frontend loading correctly
✅ No console errors
✅ CloudWatch logs clean
✅ Tests passing

---

## Quick Reference Commands

```bash
# Amplify CLI
amplify init              # Initialize Amplify
amplify add auth          # Add authentication
amplify add api           # Add REST API
amplify add storage       # Add database/storage
amplify push              # Deploy changes
amplify pull              # Pull latest changes
amplify delete            # Delete Amplify project
amplify studio            # Open Amplify Studio
amplify status            # Check deployment status
amplify env list          # List environments
amplify env checkout prod # Switch to prod environment

# Testing
npm run dev               # Start dev server
npm run build             # Build for production
npm run lint              # Run ESLint

# AWS CLI
aws sts get-caller-identity        # Verify AWS credentials
aws cognito-idp describe-user-pool # Check User Pool
aws dynamodb list-tables           # List DynamoDB tables
aws s3 ls                          # List S3 buckets
```

---

**Last Updated**: January 29, 2026
**Status**: Ready for Setup
**Estimated Time**: 2-3 hours for complete setup
