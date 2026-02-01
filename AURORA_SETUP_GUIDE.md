# Aurora PostgreSQL Setup Guide for Beauzead E-commerce

## 📋 Prerequisites

Before running the setup scripts, ensure you have:

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
   ```bash
   aws --version
   aws configure  # Set up credentials
   ```
3. **PostgreSQL Client** (psql)
   ```bash
   # macOS
   brew install postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql-client

   # Windows (via PostgreSQL installer)
   ```

4. **Bash shell** (for running scripts)

---

## 🚀 Quick Start (5 Steps)

### Step 1: Update Configuration

Edit `setup-aurora-postgres.sh` and change:
```bash
MASTER_PASSWORD="YourSecurePassword123!@#"  # Change this!
AWS_REGION="us-east-1"                      # Change if needed
```

**Password Requirements:**
- Minimum 8 characters
- Include uppercase, lowercase, numbers, and special characters
- Example: `Beauzead#2024$Prod`

### Step 2: Make Scripts Executable

```bash
chmod +x setup-aurora-postgres.sh
chmod +x aurora-management.sh
chmod +x import-aurora-schema.sh
```

### Step 3: Create Aurora Cluster

```bash
./setup-aurora-postgres.sh
```

This will:
- Create VPC security group
- Create DB subnet group
- Create Aurora PostgreSQL cluster
- Create primary database instance
- Create read replica (HA)
- Save connection details to `beauzead-db-config.env`

**⏳ Wait time: 5-10 minutes**

### Step 4: Import Database Schema

```bash
./import-aurora-schema.sh
```

This will:
- Connect to the database
- Create all 16 tables
- Populate countries data (60+ countries)
- Create indexes for performance
- Verify schema import

### Step 5: Connect to Database

```bash
# Load environment variables
source beauzead-db-config.env

# Connect to database
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Once connected, verify tables
\dt                    # List all tables
SELECT * FROM countries LIMIT 5;  # View countries
```

---

## 📊 What Gets Created

### 1. VPC Security Group
- **Purpose:** Controls network access to database
- **Rules:** Allows PostgreSQL (port 5432) from anywhere
- **Name:** `beauzead-db-sg`

### 2. DB Subnet Group
- **Purpose:** Specifies subnets for database deployment
- **Subnets:** Uses all subnets in default VPC
- **Name:** `beauzead-db-subnet-group`

### 3. Aurora PostgreSQL Cluster
- **ID:** `beauzead-aurora-postgres-prod`
- **Engine:** Aurora PostgreSQL 15.3
- **Encryption:** At rest (KMS) + in transit (SSL)
- **Backups:** 35 days retention
- **Logs:** CloudWatch enabled

### 4. Primary Database Instance
- **ID:** `beauzead-db-instance-1`
- **Class:** `db.r5.large` (16 GB RAM, production-grade)
- **Multi-AZ:** Automatic failover enabled
- **Monitoring:** Enhanced monitoring with 60s granularity

### 5. Read Replica
- **ID:** `beauzead-db-instance-1-replica-1`
- **Class:** `db.r5.large` (same as primary)
- **Purpose:** Distribute read traffic, high availability

### 6. Database Schema (16 Tables)
- Users, Sellers, KYC Documents
- Products, Categories, Inventory
- Orders, Order Items, Payments
- Reviews, Shopping Cart, Wishlist
- Notifications, Seller Commissions
- Platform Statistics

---

## 💰 Cost Estimate

### Monthly Costs (Production Setup)

| Component | Instance | Size | Cost/Month |
|-----------|----------|------|-----------|
| Primary Instance | db.r5.large | 16GB RAM | $300 |
| Read Replica | db.r5.large | 16GB RAM | $300 |
| Storage | 100 GB | GP2 SSD | $25 |
| Backup Storage | 35 days | Incremental | $30 |
| Data Transfer | Inter-region | Included | $0 |
| **TOTAL** | | | **~$655** |

**Optimization Options:**
- Use `db.t3.medium` for development: ~$100/month
- Aurora Serverless v2: Pay per usage (variable workload): ~$200-400/month
- Remove read replica: Save $300/month

---

## 📝 Management Commands

### Check Cluster Status
```bash
./aurora-management.sh status
```

### Get Connection Endpoints
```bash
./aurora-management.sh endpoints
```

### Create Manual Snapshot
```bash
./aurora-management.sh snapshot
```

### List All Snapshots
```bash
./aurora-management.sh snapshots
```

### Scale Instance Up/Down
```bash
./aurora-management.sh scale db.r5.xlarge
```

Available classes:
- `db.t3.medium` - Development (1 GB, ~$100/mo)
- `db.r5.large` - Small production (16 GB, ~$300/mo)
- `db.r5.xlarge` - Medium production (32 GB, ~$600/mo)
- `db.r5.2xlarge` - Large production (64 GB, ~$1,200/mo)

### View Logs
```bash
./aurora-management.sh logs
```

### Create Read Replica
```bash
./aurora-management.sh replica
```

---

## 🔐 Security Best Practices

### 1. Secure Password Storage

**❌ DO NOT:**
- Commit `beauzead-db-config.env` to git
- Use weak passwords
- Share credentials via email/chat

**✅ DO:**
- Add to `.gitignore`:
  ```bash
  echo "beauzead-db-config.env" >> .gitignore
  ```
- Store in AWS Secrets Manager:
  ```bash
  aws secretsmanager create-secret \
    --name beauzead/aurora/credentials \
    --secret-string file://beauzead-db-config.env
  ```
- Use IAM database authentication (advanced)

### 2. Network Security

- Security group only allows port 5432
- Database not publicly accessible
- SSL/TLS encryption enabled
- Consider VPN for remote access

### 3. Backup & Recovery

- Automated backups: 35 days retention
- Manual snapshots: Create before major changes
- Test restore process monthly
- Store snapshots in separate AWS account (optional)

### 4. Monitoring

- CloudWatch logs enabled
- Enhanced monitoring (60s granularity)
- Set up alarms for:
  - CPU > 80%
  - Database connections > 100
  - Storage > 80 GB

---

## 🔗 Integrating with AppSync

### 1. Add AppSync Data Source

In AWS Console:
1. Go to AppSync → APIs → Beauzead
2. Data Sources → Create Data Source
3. **Type:** RDS Database
4. **Configuration:**
   - Database: Aurora PostgreSQL
   - Cluster: beauzead-aurora-postgres-prod
   - Database: beauzeaddb
   - Username: beauzeadadmin
   - Password: (from beauzead-db-config.env)
5. **IAM Role:** Create new role for AppSync → RDS access

### 2. Create SQL Resolvers

Example GraphQL Query Resolver:

```graphql
# Schema
type Query {
  listCountries: [Country!]!
  getCountry(id: Int!): Country
}

type Country {
  id: Int!
  country_name: String!
  country_code: String!
  currency_code: String!
  dialing_code: String!
  region: String!
}
```

AppSync Resolver (Request):
```vtl
{
  "version": "2018-05-29",
  "statements": [
    "SELECT * FROM countries WHERE is_active = true ORDER BY country_name ASC"
  ]
}
```

AppSync Resolver (Response):
```vtl
$utils.rds.toJsonObject($ctx.result)
```

### 3. Test Query

```graphql
query ListCountries {
  listCountries {
    id
    country_name
    currency_code
    dialing_code
  }
}
```

---

## 🐛 Troubleshooting

### Issue: Connection Refused

**Cause:** Database not fully initialized
**Solution:** 
```bash
# Wait for database to be ready
aws rds wait db-cluster-available --db-cluster-identifier beauzead-aurora-postgres-prod
```

### Issue: psql: command not found

**Cause:** PostgreSQL client not installed
**Solution:**
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql-client

# Windows
# Download from postgresql.org installer
```

### Issue: Password authentication failed

**Cause:** Wrong credentials in beauzead-db-config.env
**Solution:**
```bash
# Reset master password (requires AWS permissions)
aws rds modify-db-cluster \
  --db-cluster-identifier beauzead-aurora-postgres-prod \
  --master-user-password "NewPassword123!@#" \
  --apply-immediately
```

### Issue: Security group not allowing connection

**Cause:** Firewall blocking port 5432
**Solution:**
```bash
# Check security group rules
aws ec2 describe-security-groups \
  --group-names beauzead-db-sg

# Add your IP address
aws ec2 authorize-security-group-ingress \
  --group-name beauzead-db-sg \
  --protocol tcp \
  --port 5432 \
  --cidr YOUR_IP_ADDRESS/32
```

### Issue: Out of free tier

**Cause:** Using paid instance types
**Solution:** Switch to smaller instance
```bash
./aurora-management.sh scale db.t3.medium
```

---

## 📈 Performance Tuning

### Enable Query Logging

```sql
ALTER DATABASE beauzeaddb SET log_min_duration_statement = 1000;  -- Log queries > 1s
```

### Create Indexes

Already included in schema, but can add more:

```sql
-- Optimize product search
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating DESC);

-- Optimize order queries
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Optimize seller queries
CREATE INDEX idx_sellers_verified ON sellers(is_verified) WHERE is_active = true;
```

### Query Optimization Example

```sql
-- SLOW: Join without index
SELECT p.*, s.business_name, AVG(r.rating)
FROM products p
JOIN sellers s ON p.seller_id = s.id
LEFT JOIN reviews r ON p.id = r.product_id
WHERE p.category_id = 5
GROUP BY p.id, s.id;

-- FAST: With indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
-- Above indexes already exist in schema
```

---

## 🌍 Global Database Replication (Optional)

For global audience, use Aurora Global Database:

```bash
# Create secondary region cluster (us-west-2)
aws rds create-db-cluster \
  --db-cluster-identifier beauzead-aurora-global-secondary \
  --engine aurora-postgresql \
  --engine-version 15.3 \
  --global-cluster-identifier beauzead-global-db \
  --region us-west-2
```

**Benefits:**
- Replication lag: < 1 second
- RPO (Recovery Point Objective): < 1 second
- RTO (Recovery Time Objective): < 1 minute
- Disaster recovery + local read access

---

## 📞 Support & Resources

- **AWS RDS Docs:** https://docs.aws.amazon.com/AmazonRDS/
- **Aurora PostgreSQL:** https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **AWS CLI Reference:** https://docs.aws.amazon.com/cli/latest/

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Aurora cluster created and available
- [ ] Primary and replica instances healthy
- [ ] Database schema imported successfully
- [ ] 60+ countries in database
- [ ] All 16 tables created with correct structure
- [ ] Indexes created for performance
- [ ] Connection details saved to beauzead-db-config.env
- [ ] Security group allows port 5432
- [ ] Backups configured (35 day retention)
- [ ] CloudWatch logs enabled
- [ ] AppSync data source connected
- [ ] Sample GraphQL queries tested

---

## 🎯 Next Steps

1. ✅ Setup Aurora PostgreSQL (completed)
2. ✅ Import database schema (completed)
3. → Create AppSync SQL resolvers
4. → Build GraphQL mutations for CRUD operations
5. → Connect React frontend to AppSync
6. → Deploy to production
7. → Setup monitoring & alerts
8. → Enable auto-scaling (optional)

---

*Last Updated: February 1, 2026*
