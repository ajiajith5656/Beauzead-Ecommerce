# 🚀 Production Deployment Guide - Beauzead E-commerce

## ✅ Security Implementations Completed

### 1. **Logger Utility** ✓
- Created production-safe logger (`src/utils/logger.ts`)
- Replaces all `console.log/error` statements
- Integrates with Sentry for error tracking in production
- Auto-filters sensitive data before sending to monitoring

### 2. **Input Validation** ✓
- Implemented comprehensive Zod schemas (`src/utils/validation.ts`)
- Validates all user inputs (signup, login, addresses, products, etc.)
- Protects against injection attacks (SQL, NoSQL, XSS, GraphQL)
- Strong password policy enforcement (12+ chars, mixed case, numbers, special chars)

### 3. **Error Boundary** ✓
- Added React Error Boundary (`src/components/ErrorBoundary.tsx`)
- Catches and logs all JavaScript errors
- Displays user-friendly error UI
- Prevents app crashes from exposing internal errors

### 4. **Security Headers** ✓
- Configured in Vite (`vite.config.ts`)
- Added Amplify hosting headers (`public/_headers`)
- Protects against: Clickjacking, MIME sniffing, XSS, CSRF

### 5. **AppSync Auth Migration** ✓
- Updated to prefer Cognito User Pool auth over API Key
- API Key usage now triggers warning in production
- Graceful fallback for backward compatibility

### 6. **Code Splitting** ✓
- Optimized bundle size with manual chunks
- Separate vendor bundles for React, AWS, and UI libraries

---

## 🔧 Required Environment Variables

### Production Environment (AWS Amplify Console)

```bash
# AWS Configuration (REQUIRED)
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=your-cognito-pool-id
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
VITE_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id

# AWS AppSync (REQUIRED)
VITE_APPSYNC_ENDPOINT=https://your-appsync-api.appsync-api.us-east-1.amazonaws.com/graphql

# ⚠️ API Key (NOT RECOMMENDED for production)
# Only use if you haven't migrated to Cognito User Pool auth
# VITE_APPSYNC_API_KEY=your-api-key

# AWS S3 Storage
VITE_S3_BUCKET=your-s3-bucket-name

# Stripe Payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-live-key

# Sentry Error Tracking (REQUIRED for production)
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Application Settings
VITE_ENVIRONMENT=production
VITE_DOMAIN=https://www.beauzead.store
```

---

## 📋 Pre-Deployment Checklist

### AWS AppSync Configuration
- [ ] **CRITICAL**: Update AppSync to use Cognito User Pool as default auth mode
  ```
  In AWS AppSync Console:
  1. Go to your API → Settings
  2. Set "Default authorization mode" to "Amazon Cognito User Pool"
  3. Select your Cognito User Pool
  4. Remove or demote API Key to secondary auth
  ```

- [ ] Configure AppSync rate limiting:
  ```
  Burst limit: 100 requests
  Rate limit: 50 requests per second
  ```

### AWS Cognito Configuration
- [ ] Enable MFA (Multi-Factor Authentication) for admin users
- [ ] Configure password policy:
  - Minimum 12 characters
  - Require uppercase, lowercase, numbers, special characters
  - Password history: 5
  - Max age: 90 days

### AWS S3 Configuration  
- [ ] Verify S3 bucket is NOT public
- [ ] Enable versioning
- [ ] Enable server-side encryption (AES-256 or KMS)
- [ ] Configure CORS:
  ```json
  [
    {
      "AllowedOrigins": ["https://www.beauzead.store"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
  ```
- [ ] Enable access logging

### AWS CloudFront (Recommended)
- [ ] Set up CloudFront distribution
- [ ] Enable HTTPS only
- [ ] Configure custom error pages
- [ ] Enable logging

### Sentry Configuration
- [ ] Create Sentry project at https://sentry.io
- [ ] Get DSN and add to environment variables
- [ ] Set up alerts for critical errors
- [ ] Configure release tracking

### DynamoDB Security
- [ ] Enable point-in-time recovery
- [ ] Enable encryption at rest
- [ ] Set up automated backups
- [ ] Configure TTL for temporary data
- [ ] Review IAM policies (least privilege)

---

## 🛠️ Deployment Steps

### Step 1: Update AWS AppSync Authorization

**CRITICAL**: This must be done before deploying the new code!

1. **Backup Current Configuration**
   ```bash
   # Export current AppSync configuration
   aws appsync get-graphql-api --api-id YOUR_API_ID > appsync-backup.json
   ```

2. **Update AppSync Default Auth Mode**
   ```bash
   # Via AWS Console:
   AppSync → Your API → Settings → Default authorization mode → 
   Select "Amazon Cognito User Pool" → Save
   ```

3. **Update GraphQL Schema Directives**
   - Change `@aws_api_key` directives to `@aws_cognito_user_pools` 
   - Or use `@aws_auth` with both as allowed auth strategies:
   ```graphql
   type Query @aws_auth(cognito_groups: ["user", "seller", "admin"]) {
     getProduct(id: ID!): Product
   }
   ```

### Step 2: Set Environment Variables in Amplify

1. Go to AWS Amplify Console
2. Select your app → Environment variables
3. Add all variables from the list above
4. **Save** changes

### Step 3: Deploy Code

```bash
# Ensure all packages are installed
npm install

# Run type checking
npm run build

# Test locally first
npm run preview

# Commit and push to main branch
git add .
git commit -m "feat: implement production security enhancements"
git push origin main
```

Amplify will automatically deploy from your `main` branch.

### Step 4: Verify Deployment

1. **Check Security Headers**
   ```bash
   curl -I https://www.beauzead.store
   ```
   Verify presence of:
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security
   - Content-Security-Policy

2. **Test Authentication**
   - Test user signup with weak password (should be rejected)
   - Test login validation
   - Test logout from all roles

3. **Monitor Errors**
   - Check Sentry dashboard for any errors
   - Monitor AWS CloudWatch logs

4. **Performance Check**
   - Run Lighthouse audit (target: 90+ score)
   - Check bundle sizes
   - Verify CDN caching

---

## 🔐 Security Recommendations

### Immediate Actions (Post-Deployment)
1. **Rotate API Keys**: If you were using API keys, rotate them
2. **Enable AWS WAF**: Add web application firewall rules
3. **Set up AWS GuardDuty**: Enable threat detection
4. **Configure Rate Limiting**: Implement at API Gateway or AppSync level
5. **Enable CloudTrail**: For audit logging

### AWS WAF Rules to Add
```
- SQL injection protection
- XSS protection
- Rate limiting (1000 requests per 5 minutes per IP)
- Geographic blocking (if applicable)
- Bad bot protection
```

### Ongoing Security
- [ ] Weekly security scans
- [ ] Monthly dependency updates (`npm audit fix`)
- [ ] Quarterly security reviews
- [ ] Set up AWS Security Hub
- [ ] Configure AWS Config rules

---

## 📊 Monitoring Setup

### Sentry Alerts
Configure alerts for:
- Error rate > 1% of total requests
- New error types
- Performance degradation (p95 > 2s)

### AWS CloudWatch Alarms
- AppSync 4xx/5xx errors
- Cognito failed login attempts (> 10 per minute)
- S3 4xx errors
- Lambda errors and throttles

### Log Retention
- CloudWatch Logs: 30 days
- S3 Access Logs: 90 days
- Application Logs (Sentry): 90 days

---

## 🚨 Rollback Plan

If issues occur after deployment:

### Immediate Rollback (Amplify)
```bash
# Via AWS Console:
Amplify → Your App → Deployments → Previous version → Redeploy
```

### Revert AppSync Changes
```bash
# Restore from backup
aws appsync update-graphql-api --cli-input-json file://appsync-backup.json
```

### Emergency Contacts
- AWS Support: Premium Support Plan recommended
- Sentry Support: support@sentry.io
- Your DevOps team contact information

---

## ✅ Post-Deployment Verification

Run this checklist 24 hours after deployment:

- [ ] Zero critical errors in Sentry
- [ ] Authentication working for all user types
- [ ] Payments processing correctly
- [ ] No increase in 4xx/5xx errors
- [ ] Performance metrics within acceptable range
- [ ] Security headers confirmed via SSL Labs test
- [ ] All CDN caches properly invalidated

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: "Missing critical environment variables" error
- **Solution**: Verify all VITE_* variables are set in Amplify Console

**Issue**: AppSync "Unauthorized" errors
- **Solution**: Ensure Cognito User Pool is selected as default auth mode

**Issue**: Sentry not receiving errors
- **Solution**: Verify VITE_SENTRY_DSN is correct and not wrapped in quotes

**Issue**: Security headers not showing
- **Solution**: Clear CloudFront cache or wait 24h for propagation

---

## 📚 Additional Resources

- [AWS AppSync Security Best Practices](https://docs.aws.amazon.com/appsync/latest/devguide/security-best-practices.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Sentry Documentation](https://docs.sentry.io/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

---

**Deployment Date**: _To be filled after deployment_  
**Deployed By**: _Your name_  
**Version**: 2.0.0 (Security Hardened)  
**Domain**: https://www.beauzead.store
