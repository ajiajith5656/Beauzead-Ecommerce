# Aurora PostgreSQL Setup - Complete Summary

## 📦 Files Created

| File | Purpose |
|------|---------|
| `AURORA_POSTGRESQL_SCHEMA.sql` | Complete database schema with 16 tables, 60+ countries, indexes |
| `setup-aurora-postgres.sh` | Main setup script - creates cluster, instances, security groups |
| `aurora-management.sh` | Management commands - status, scaling, snapshots, logs |
| `import-aurora-schema.sh` | Import schema into database |
| `AURORA_SETUP_GUIDE.md` | Comprehensive setup guide with troubleshooting |
| `APPSYNC_RESOLVER_TEMPLATES.md` | Ready-to-use AppSync resolver examples |

---

## 🚀 Quick Start (Copy-Paste Commands)

### 1. Make Scripts Executable
```bash
chmod +x setup-aurora-postgres.sh aurora-management.sh import-aurora-schema.sh
```

### 2. Edit Configuration
```bash
# Update password and region
nano setup-aurora-postgres.sh
# Change: MASTER_PASSWORD="YourSecurePassword123!@#"
# Change: AWS_REGION="us-east-1"
```

### 3. Create Aurora Cluster (5-10 minutes)
```bash
./setup-aurora-postgres.sh
```

### 4. Import Database Schema
```bash
./import-aurora-schema.sh
```

### 5. Verify Connection
```bash
source beauzead-db-config.env
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM countries;"
```

---

## 📋 What Gets Created

### Aurora Cluster
- **ID:** `beauzead-aurora-postgres-prod`
- **Engine:** PostgreSQL 15.3
- **Region:** us-east-1 (configurable)
- **Encryption:** Enabled (at-rest + in-transit)

### Database Instances
1. **Primary:** `beauzead-db-instance-1` (db.r5.large)
   - 16 GB RAM
   - Production-grade
   - Multi-AZ with automatic failover

2. **Read Replica:** `beauzead-db-instance-1-replica-1`
   - Same size as primary
   - Distributes read traffic
   - Failover capable

### Network
- **Security Group:** `beauzead-db-sg`
- **Subnet Group:** `beauzead-db-subnet-group`
- **Port:** 5432 (PostgreSQL)
- **Access:** All IPs (configurable)

### Database Schema
**16 Tables:**
1. Countries (60+ entries)
2. Business Types (15 entries)
3. Categories (hierarchical)
4. Users
5. Sellers
6. KYC Documents
7. Products
8. Product Inventory
9. Orders
10. Order Items
11. Payments
12. Reviews
13. Shopping Carts
14. Wishlists
15. Notifications
16. Seller Commissions

**Indexes:** 30+ for performance optimization

### Data
- **Countries:** India, 50+ Asian countries, 27 EU countries, GCC countries, UK, USA, Canada, Brazil, Argentina
- **Business Types:** 15 categories (Electronics, Fashion, etc.)
- **Currencies:** All major world currencies

---

## 💾 Connection Details

After setup, file `beauzead-db-config.env` will contain:

```env
DB_HOST=beauzead-aurora-postgres-prod.c9akciq32.us-east-1.rds.amazonaws.com
DB_READER_HOST=beauzead-aurora-postgres-prod-ro.c9akciq32.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=beauzeaddb
DB_USER=beauzeadadmin
DB_PASSWORD=YourSecurePassword123!@#
DB_CLUSTER_ID=beauzead-aurora-postgres-prod
DB_INSTANCE_ID=beauzead-db-instance-1
DB_REGION=us-east-1

DATABASE_URL=postgresql://beauzeadadmin:YourSecurePassword123!@#@beauzead-aurora-postgres-prod.c9akciq32.us-east-1.rds.amazonaws.com:5432/beauzeaddb
DATABASE_READ_URL=postgresql://beauzeadadmin:YourSecurePassword123!@#@beauzead-aurora-postgres-prod-ro.c9akciq32.us-east-1.rds.amazonaws.com:5432/beauzeaddb
```

---

## 🎯 Management Commands

### Status & Info
```bash
./aurora-management.sh status              # Cluster status
./aurora-management.sh endpoints           # Connection endpoints
./aurora-management.sh backup              # Backup configuration
```

### Backups & Recovery
```bash
./aurora-management.sh snapshot            # Create manual snapshot
./aurora-management.sh snapshots           # List all snapshots
```

### Scaling & Performance
```bash
./aurora-management.sh scale db.r5.xlarge  # Scale up instance
./aurora-management.sh monitoring          # Enable enhanced monitoring
./aurora-management.sh logs                # View PostgreSQL logs
```

### High Availability
```bash
./aurora-management.sh replica             # Create read replica
```

### Cleanup (⚠️ Caution)
```bash
./aurora-management.sh delete              # Delete cluster
```

---

## 💰 Cost Breakdown

### Monthly Costs

**Production Setup:**
| Component | Cost |
|-----------|------|
| Primary DB Instance (db.r5.large) | $300 |
| Read Replica (db.r5.large) | $300 |
| Storage (100 GB SSD) | $25 |
| Backup Storage (35 days) | $30 |
| Data Transfer | $0 (included) |
| **TOTAL** | **~$655/month** |

**Cost Optimization Options:**
- Development (db.t3.medium): ~$50/month
- Aurora Serverless v2 (variable): ~$200-400/month
- Single instance (no replica): Save $300/month
- Reduced backup retention (7 days): Save ~$25/month

**Free Tier Eligible:**
- Yes, for first 12 months (on AWS free tier account)
- Up to 750 hours/month of db.t2.micro/db.t3.micro
- 20 GB storage
- 20 GB backups

---

## 🔐 Security Configuration

### Encryption
✅ At-rest: KMS encryption enabled
✅ In-transit: SSL/TLS enabled
✅ Backups: Encrypted

### Network Access
- **Default:** Allows all IPs on port 5432
- **Recommended:** Restrict to your application VPC/IP

### Credentials
- **Master Username:** beauzeadadmin
- **Master Password:** Custom (set in setup-aurora-postgres.sh)
- **Storage:** beauzead-db-config.env (⚠️ Add to .gitignore)

### Backup & Recovery
- **Retention:** 35 days
- **Frequency:** Continuous (RTO < 1 minute, RPO < 5 minutes)
- **Snapshots:** Create manually as needed

### Monitoring
- **CloudWatch Logs:** Enabled
- **Enhanced Monitoring:** 60 second granularity
- **Audit Logging:** PostgreSQL logs enabled

---

## 🔗 Integration with AppSync

### Step 1: Create Data Source
1. AWS Console → AppSync → APIs → Beauzead
2. Data Sources → Create Data Source
3. Name: `AuroraDatabase`
4. Type: `RDS Database`
5. Select cluster: `beauzead-aurora-postgres-prod`
6. Database: `beauzeaddb`
7. Schema: `public`

### Step 2: Configure IAM Role
```json
{
  "Effect": "Allow",
  "Action": ["rds-db:connect"],
  "Resource": "arn:aws:rds:us-east-1:ACCOUNT_ID:dbuser:RESOURCE_ID/*"
}
```

### Step 3: Create Resolvers
Use templates from `APPSYNC_RESOLVER_TEMPLATES.md`:
- List Countries
- Get Product Details
- Search Products
- Get User Orders
- Add to Cart
- etc.

### Step 4: Test Queries
```graphql
query {
  listCountries {
    country_name
    currency_code
    dialing_code
  }
}
```

---

## 📊 Schema Highlights

### Countries Table
```sql
id | country_name | country_code | currency_code | dialing_code | region
1  | India        | IND          | INR           | +91          | Asia
2  | China        | CHN          | CNY           | +86          | Asia
...
60+ countries across Asia, EU, GCC, Americas
```

### Products Table
```sql
id | seller_id | product_name | price | stock_quantity | rating | total_sold
```

### Orders Table
```sql
id | order_number | user_id | total_amount | order_status | payment_status | created_at
```

### Users Table
```sql
id | cognito_user_id | email | full_name | role | is_email_verified | created_at
```

---

## ✅ Verification Checklist

- [ ] AWS CLI installed and configured
- [ ] PostgreSQL client (psql) installed
- [ ] Scripts made executable (chmod +x)
- [ ] Password updated in setup-aurora-postgres.sh
- [ ] Aurora cluster created (status: "available")
- [ ] Primary instance healthy
- [ ] Read replica created
- [ ] Schema imported successfully
- [ ] 60+ countries in database
- [ ] All 16 tables created
- [ ] beauzead-db-config.env generated
- [ ] Connection tested: `psql -h $DB_HOST ...`
- [ ] AppSync data source created
- [ ] Sample GraphQL query executed

---

## 🆘 Troubleshooting

### Can't Connect to Database
```bash
# Check security group allows port 5432
aws ec2 describe-security-groups --group-names beauzead-db-sg

# Add your IP address to security group
aws ec2 authorize-security-group-ingress \
  --group-name beauzead-db-sg \
  --protocol tcp --port 5432 \
  --cidr YOUR_IP/32
```

### Schema Import Failed
```bash
# Check database exists
psql -h $DB_HOST -U $DB_USER -l

# Verify connection works
psql -h $DB_HOST -U $DB_USER -d beauzeaddb -c "SELECT 1"

# Check schema file
file AURORA_POSTGRESQL_SCHEMA.sql
```

### High Costs
```bash
# Scale down to smaller instance
./aurora-management.sh scale db.t3.medium

# Or use Aurora Serverless for variable workload
# Switch to db.serverless instance type
```

### Slow Queries
```bash
# Enable query logging
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME << EOF
ALTER DATABASE beauzeaddb SET log_min_duration_statement = 1000;
EOF

# View slow queries
./aurora-management.sh logs
```

---

## 📞 Support Resources

- **AWS RDS Documentation:** https://docs.aws.amazon.com/rds/
- **Aurora PostgreSQL:** https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/
- **PostgreSQL Official:** https://www.postgresql.org/docs/
- **AWS CLI Reference:** https://docs.aws.amazon.com/cli/
- **AppSync SQL Resolvers:** https://docs.aws.amazon.com/appsync/latest/devguide/resolver-context-reference.html

---

## 🎓 Learning Resources

### PostgreSQL Basics
```sql
-- Connect
psql -h host -U username -d database

-- List tables
\dt

-- Show table structure
\d table_name

-- List databases
\l

-- Basic query
SELECT * FROM countries WHERE region = 'Asia' LIMIT 10;
```

### Query Examples

**Filter Products by Price:**
```sql
SELECT product_name, price, rating 
FROM products 
WHERE price BETWEEN 100 AND 500 
ORDER BY price ASC;
```

**Get Top Sellers:**
```sql
SELECT s.business_name, COUNT(o.id) as orders, SUM(oi.total_price) as revenue
FROM sellers s
LEFT JOIN order_items oi ON s.id = oi.seller_id
LEFT JOIN orders o ON oi.order_id = o.id
GROUP BY s.id
ORDER BY revenue DESC
LIMIT 10;
```

**Join Example:**
```sql
SELECT p.product_name, s.business_name, AVG(r.rating) as avg_rating
FROM products p
JOIN sellers s ON p.seller_id = s.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, s.id;
```

---

## 🏁 Next Steps

1. ✅ **Setup Aurora PostgreSQL** (this guide)
2. ✅ **Import Database Schema** (included)
3. → **Create AppSync SQL Resolvers** (see APPSYNC_RESOLVER_TEMPLATES.md)
4. → **Build GraphQL Queries/Mutations** 
5. → **Connect React Frontend to AppSync**
6. → **Deploy to Production**
7. → **Setup Monitoring & Alerts**
8. → **Enable Auto-scaling** (optional)
9. → **Setup Global Database** (optional, for worldwide users)
10. → **Implement Read Replicas in Other Regions** (optional, for latency)

---

## 📝 Important Notes

⚠️ **Never commit beauzead-db-config.env to Git!**
```bash
echo "beauzead-db-config.env" >> .gitignore
```

⚠️ **Store credentials securely:**
```bash
# Use AWS Secrets Manager
aws secretsmanager create-secret \
  --name beauzead/aurora/credentials \
  --secret-string file://beauzead-db-config.env
```

⚠️ **Backup before major changes:**
```bash
./aurora-management.sh snapshot
```

⚠️ **Test restore process monthly**

✅ **Monitor costs regularly** in AWS Billing console

---

**Setup Complete! You're ready to deploy Beauzead E-commerce with production-grade PostgreSQL database.** 🎉

*Aurora PostgreSQL • AWS RDS • Serverless Ready • Global Scale*
