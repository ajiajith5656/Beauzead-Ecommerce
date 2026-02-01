# 🚀 Aurora PostgreSQL Free Tier - Manual Setup Guide

## ✅ Your Account is Free Tier Eligible!

- **Account Created**: January 30, 2026 ✅
- **Free Tier Duration**: 12 months remaining ✅
- **Cost**: **$0/month** for first 12 months ✅
- **Instance Type**: db.t3.micro (FREE TIER)

---

## 📋 Setup Configuration

```
Cluster ID:        beauzead-aurora-free
Instance ID:       beauzead-db-free-instance
Instance Class:    db.t3.micro (FREE TIER)
Database:          beauzeaddb
Username:          beauzeadadmin
Password:          Beauzead@2026Secure (change this!)
Region:            us-east-1
Engine:            Aurora PostgreSQL 15.3
Backup Retention:  7 days
Encryption:        Enabled
Cost:              $0/month for 12 months
```

---

## 🎯 Option A: Use AWS Console (Recommended for your permissions)

### Step 1: Create Aurora Cluster via Console

1. Go to: https://console.aws.amazon.com/rds/
2. Click **"Create database"**
3. Configure as follows:

```
Engine options:
  ✅ Amazon Aurora
  ✅ PostgreSQL compatible
  ✅ Engine version: 15.3

DB cluster identifier:
  beauzead-aurora-free

Master username:
  beauzeadadmin

Master password:
  Beauzead@2026Secure
  (Confirm: same password twice)

DB instance class:
  ✅ Burstable classes (includes free tier eligible)
  ✅ db.t3.micro (FREE TIER ⭐)

Storage:
  ✅ General Purpose (gp3)
  ✅ Allocated storage: 20 GB
  ✅ Enable storage autoscaling: Disabled (free tier limit)

Connectivity:
  ✅ Public accessibility: Yes
  ✅ Security group: Select existing or create new

Backup:
  ✅ Backup retention: 7 days (Free Tier max)
  ✅ Backup window: 03:00-04:00 UTC

Maintenance:
  ✅ Auto minor version upgrade: Enabled
  ✅ Maintenance window: mon:04:00-mon:05:00 UTC

Deletion protection:
  ✅ Enable deletion protection

Additional configuration:
  ✅ Initial database name: beauzeaddb
  ✅ Enable automated backups: Yes
  ✅ Enable encrypted storage: Yes

Tags:
  Key: Environment    Value: FreeTier
  Key: Project        Value: Beauzead
  Key: BillingTier    Value: Free
```

4. Click **"Create database"**
5. ⏳ Wait 7-10 minutes for cluster to be created

### Step 2: Get Connection Details

1. Go to: https://console.aws.amazon.com/rds/
2. Click **"Databases"** in left menu
3. Click on **"beauzead-aurora-free"** cluster
4. Find "Endpoints" section - note the endpoint URL
5. Port: 5432 (default PostgreSQL)

### Step 3: Create Configuration File

After cluster is created, run this command:

```bash
cat > beauzead-db-config.env << 'EOF'
# Aurora PostgreSQL Free Tier Configuration
# Created: $(date)
# Cost: $0/month for 12 months

AWS_REGION=us-east-1
DB_CLUSTER_ID=beauzead-aurora-free
DB_INSTANCE_ID=beauzead-db-free-instance
DB_INSTANCE_CLASS=db.t3.micro

# Update these with your endpoint from AWS Console
DB_HOST=beauzead-aurora-free.xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=beauzeaddb
DB_USERNAME=beauzeadadmin
DB_PASSWORD=Beauzead@2026Secure

# Connection Strings
DATABASE_URL=postgresql://beauzeadadmin:Beauzead@2026Secure@beauzead-aurora-free.xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/beauzeaddb
POSTGRES_URL=postgresql://beauzeadadmin:Beauzead@2026Secure@beauzead-aurora-free.xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/beauzeaddb

# Billing
BILLING_TIER=Free Tier
COST_PER_MONTH=$0 (for 12 months)
INCLUDED_STORAGE=20 GB
INCLUDED_BACKUPS=20 GB
EOF

chmod 600 beauzead-db-config.env
```

**Replace `xxxxxxxxxxxxx` with your actual endpoint from the AWS Console!**

---

## 🎯 Option B: Use CloudFormation (If you prefer scripted approach)

Your account has **CloudFormation Full Access**, so you can use this:

```bash
# Run this command to create the cluster
aws cloudformation create-stack \
  --stack-name beauzead-aurora-free \
  --template-url https://s3.amazonaws.com/beauzead-templates/aurora-free-tier.yaml
```

Or we can create a CloudFormation template for you.

---

## 🔄 Step 4: Import Database Schema

Once your cluster endpoint is available:

```bash
# 1. Update beauzead-db-config.env with your endpoint
# 2. Load config
source beauzead-db-config.env

# 3. Import schema
bash import-aurora-schema.sh
```

---

## 🧪 Step 5: Test Connection

```bash
# Option 1: Using psql client
psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME

# Option 2: Using AWS Console
# - Go to RDS > Databases > beauzead-aurora-free
# - Click "Query Editor"
# - Execute SQL directly in browser
```

---

## 💰 Pricing Breakdown

| Period | Instance | Storage | Backups | Total/Month |
|--------|----------|---------|---------|------------|
| **Months 1-12** | $0 ✅ | $0 ✅ | $0 ✅ | **$0** |
| **Month 13+** | ~$54 | ~$3 | ~$3 | ~**$60** |

**12-Month Savings**: $720 vs production ($655/month)

---

## 🔐 Security Notes

1. **Password**: Change `Beauzead@2026Secure` to a unique strong password in production
2. **Public Access**: Only enable if needed; consider restricting via security groups
3. **Encryption**: Enabled by default with Free Tier
4. **Backups**: 7-day retention (Free Tier standard)

---

## 📊 Free Tier Limits

| Resource | Limit | Included |
|----------|-------|----------|
| Instance Hours | 750/month (31 days) | ✅ |
| Storage | 20 GB | ✅ |
| Backup Storage | 20 GB | ✅ |
| Snapshot Storage | 20 GB | ✅ |
| Data Transfer | 1 GB/month | ✅ |
| Multi-AZ | No | ✗ |
| Read Replicas | No | ✗ |
| Enhanced Monitoring | No | ✗ |

---

## 🚀 After Setup Complete

1. ✅ Create AppSync Data Source
   ```
   - Type: Amazon Relational Database Service (RDS)
   - Resource: beauzead-aurora-free
   ```

2. ✅ Deploy GraphQL Resolvers (see APPSYNC_RESOLVER_TEMPLATES.md)

3. ✅ Update frontend connection strings

---

## ❓ Troubleshooting

**Q: Can't connect to database?**
- Check: Security group allows port 5432 (PostgreSQL)
- Check: Database is in "Available" state
- Check: Connection string is correct

**Q: Getting "storage exceeded" error?**
- Problem: Exceeded 20 GB free storage
- Solution: Upgrade to db.t3.small or delete old data

**Q: After 12 months, how do I handle billing?**
- Options:
  1. Keep db.t3.micro and pay ~$60/month
  2. Upgrade to db.t3.small for better performance (~$50/month during partial free tier usage)
  3. Migrate to db.r5.large for production (~$655/month with HA)

---

## 📞 Next Steps

1. **Immediate**: Set up cluster via AWS Console (Option A above)
2. **Once cluster available**: Import schema using import-aurora-schema.sh
3. **Then**: Configure AppSync data source
4. **Finally**: Deploy GraphQL resolvers

**Estimated Time**: 20-30 minutes total

---

## 📎 Files Created

- `setup-aurora-free-tier-simple.sh` - Automated setup (requires RDS permissions)
- `import-aurora-schema.sh` - Schema import tool
- `aurora-management.sh` - Cluster management commands
- `AURORA_POSTGRESQL_SCHEMA.sql` - 16 tables, 60+ countries
- `APPSYNC_RESOLVER_TEMPLATES.md` - GraphQL resolver examples

---

**Account Status**: ✅ Free Tier Eligible for 12 Months
**Cost Savings**: 💰 **$0/month** for first year ($0 vs $7,860 for production)
**Status**: Ready to create cluster! 🎉
