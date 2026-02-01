# AWS Free Tier Eligibility - Beauzead Aurora PostgreSQL

## ✅ Check Results

Your AWS account **CAN use Free Tier** for Aurora PostgreSQL if:

1. ✅ **Account is < 12 months old**
2. ✅ **No existing RDS instances** (you have none)
3. ✅ **AWS credentials are configured** (verified)
4. ✅ **Using eligible instance type** (db.t2.micro or db.t3.micro)

---

## 🎁 AWS Free Tier Offer for Aurora PostgreSQL

| Resource | Included | Duration |
|----------|----------|----------|
| **Instance Hours** | 750 hours/month | 12 months |
| **Database Storage** | 20 GB | 12 months |
| **Backups** | 20 GB retention | 12 months |
| **Snapshots** | 20 GB | 12 months |
| **Instance Type** | db.t2.micro OR db.t3.micro | 12 months |

**750 hours = ~31 days** = You get 1 month free per month

---

## 💰 Cost Comparison

### Current Setup (db.r5.large - Production)
```
Primary Instance:        $300/month
Read Replica:            $300/month
Storage (100 GB):        $25/month
Backups (35 days):       $30/month
─────────────────────────────────
TOTAL:                   ~$655/month
```
❌ NOT eligible for Free Tier

---

### Option 1: Free Tier (db.t3.micro) ⭐ RECOMMENDED
```
Instance Hours:          $0 (750 hrs free)
20 GB Storage:           $0 (included)
Backups (7 days):        $0 (included)
─────────────────────────────────
TOTAL:                   $0/month (12 months)
THEN:                    ~$25/month (after free tier)
```
✅ Fully eligible for Free Tier
- Perfect for development/testing
- Sufficient for small applications
- Can upgrade after 12 months

---

### Option 2: Budget-Friendly (db.t3.small)
```
Free tier hours:         $0 (750 hrs free)
Beyond 750 hrs:          ~$50/month
20 GB Storage:           $0 (included)
Backups:                 $0 (included)
─────────────────────────────────
TOTAL:                   ~$50/month (all 12 months)
```
✅ Partially eligible for Free Tier
- Good performance for startup
- Still very affordable

---

## 🔧 How to Use Free Tier

### Step 1: Verify Your Account
```bash
# Check your account creation date
aws iam get-user --query 'User.CreateDate' --output text
# If < 12 months ago, you're eligible!
```

### Step 2: Modify Setup Script
Edit `setup-aurora-postgres.sh`:

**For db.t3.micro (Free Tier):**
```bash
# Line 21 - Change this:
DB_INSTANCE_CLASS="db.r5.large"
# To this:
DB_INSTANCE_CLASS="db.t3.micro"

# Line 24 - Change this:
BACKUP_RETENTION_PERIOD="35"
# To this:
BACKUP_RETENTION_PERIOD="7"

# Line 103 - Comment out read replica creation
# Comment this section or skip creation
```

**For db.t3.small (Budget Option):**
```bash
DB_INSTANCE_CLASS="db.t3.small"
BACKUP_RETENTION_PERIOD="7"
```

### Step 3: Run Setup
```bash
./setup-aurora-postgres.sh
```

---

## ⚠️ Important Free Tier Limitations

### What's NOT Free
- ❌ Read Replicas (each costs ~$300/month)
- ❌ Storage beyond 20 GB
- ❌ Backup storage beyond 20 GB
- ❌ Enhanced monitoring beyond 7 days
- ❌ Other database types (RDS MySQL, PostgreSQL, etc.)

### Free Tier Rules
- ✅ Only 1 free tier RDS instance per region
- ✅ 750 hours/month = ~24 hours/day
- ✅ 12 months from account creation
- ✅ Can't reserve instances during free tier
- ✅ No multi-AZ during free tier (single AZ)

---

## 📊 Performance Comparison

| Aspect | db.t3.micro | db.t3.small | db.r5.large |
|--------|-----------|-----------|-----------|
| **vCPU** | 2 | 2 | 2 |
| **Memory** | 1 GB | 2 GB | 16 GB |
| **Storage** | 20 GB free | 20 GB free | 100 GB |
| **Cost/Month** | $0* | ~$50* | ~$655 |
| **Use Case** | Dev/Test | Small App | Production |
| **Concurrent Users** | ~50 | ~500 | 5000+ |

*for first 12 months

---

## 🎯 Recommendations by Use Case

### 🧪 Development/Testing
**Use: db.t3.micro (Free Tier)**
- Perfect for learning AWS
- Test schema and API setup
- No cost for 12 months
- Can scale up later

**Setup:**
```bash
DB_INSTANCE_CLASS="db.t3.micro"
BACKUP_RETENTION_PERIOD="7"
# Skip read replica creation
```

---

### 🚀 Small Production Launch
**Use: db.t3.small (~$50/month)**
- Better performance than micro
- Still budget-friendly
- Supports small user base (500-1000 users)
- Can upgrade as you grow

**Setup:**
```bash
DB_INSTANCE_CLASS="db.t3.small"
BACKUP_RETENTION_PERIOD="7"
# Skip read replica for now, add later
```

---

### 🏢 Enterprise/Full Production
**Use: db.r5.large + Replica (~$655/month)**
- Production-grade reliability
- High availability with replica
- Supports thousands of concurrent users
- Full backup retention

**Setup:** Use current configuration
```bash
DB_INSTANCE_CLASS="db.r5.large"
BACKUP_RETENTION_PERIOD="35"
# Create read replica
```

---

## 📅 Timeline

### Years 1-2: Free/Budget Option
```
Month 1-12:
  db.t3.micro = $0
  Total: $0

Month 13-24:
  db.t3.small = ~$50/month
  Total: ~$600
```

### Year 3+: Scale to Production
```
Month 25+:
  db.r5.large + replica = ~$655/month
  Total ongoing: $7,860/year
```

---

## 🔍 How to Track Free Tier Usage

### In AWS Console
1. Go to: https://console.aws.amazon.com/billing/
2. Click: "Free Tier"
3. Find: Aurora PostgreSQL
4. See: Hours remaining, storage used, etc.

### Using AWS CLI
```bash
# Check RDS instances and their specs
aws rds describe-db-instances \
  --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceClass,Engine]' \
  --output table

# Check billing alerts
aws cloudwatch describe-alarms \
  --alarm-names "free-tier-usage"
```

---

## 💡 Pro Tips

### 1. Set Billing Alerts
```bash
# Enable free tier alerts to avoid surprises
aws ce create-cost-category-definition ...
```

### 2. Monitor Usage
- Check AWS console daily
- Set cost alerts for >$1/day
- Review billing monthly

### 3. Optimize Queries
- Create indexes early
- Limit data retention
- Archive old data

### 4. Plan Upgrades
- Document when free tier ends
- Budget for paid plan
- Plan capacity scaling

### 5. Backup Regularly
- Free tier has limited backups
- Use snapshots before major changes
- Export data periodically

---

## ⚡ Quick Decision Matrix

**Choose based on your needs:**

```
Are you building a startup?
├─ Yes, on budget → Use db.t3.micro (Free Tier)
├─ Yes, want performance → Use db.t3.small (~$50)
└─ No, need production → Use db.r5.large (~$655)

Do you need high availability NOW?
├─ Yes → Use db.r5.large + replica
└─ No → Use db.t3.micro/small, add replica later

Do you have < 12 month old AWS account?
├─ Yes → Eligible for Free Tier
└─ No → Use paid tier (db.r5.large recommended)

Expected users in first 6 months?
├─ < 500 → db.t3.micro sufficient
├─ 500-5000 → db.t3.small recommended
└─ > 5000 → db.r5.large + replica needed
```

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T:**
- Create multiple RDS instances (only 1 free per region)
- Use db.r5.large if eligible for free tier (wastes money)
- Forget backup retention limits (storage charges apply)
- Create read replicas during free tier period
- Enable enhanced monitoring beyond 7 days

✅ **DO:**
- Use free tier when eligible
- Monitor your usage regularly
- Plan upgrade timeline early
- Set up cost alerts
- Test scalability before going live

---

## 📞 Support

### Check Free Tier Eligibility
```bash
# Your command to check:
bash check-aws-free-tier.sh

# Manual check:
aws iam get-user --query 'User.CreateDate' --output text
```

### AWS Resources
- Free Tier Info: https://aws.amazon.com/free/
- Billing Dashboard: https://console.aws.amazon.com/billing/
- Cost Calculator: https://calculator.aws/

---

## ✅ Next Steps

### For Free Tier Users (db.t3.micro):
1. Edit `setup-aurora-postgres.sh`
2. Change: `DB_INSTANCE_CLASS="db.t3.micro"`
3. Change: `BACKUP_RETENTION_PERIOD="7"`
4. Run: `./setup-aurora-postgres.sh`
5. Cost: **$0/month for 12 months** 🎉

### For Paid Users (db.r5.large):
1. Keep current configuration
2. Run: `./setup-aurora-postgres.sh`
3. Cost: **~$655/month** (Full production setup)

---

**Your AWS Account Status: ✅ Eligible for Free Tier** (if account < 12 months old)

**Recommendation: Use db.t3.micro for development, upgrade to production tier later**

---

*Free Tier Guide - February 1, 2026*
