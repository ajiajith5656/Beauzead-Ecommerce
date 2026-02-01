# Aurora PostgreSQL - Quick Reference Card

## 📌 Pre-Setup Checklist
- [ ] AWS Account with permissions
- [ ] AWS CLI installed: `aws --version`
- [ ] AWS credentials configured: `aws configure`
- [ ] PostgreSQL client: `brew install postgresql` (macOS) or `apt-get install postgresql-client` (Linux)
- [ ] Bash shell available

## 🚀 3-Step Setup

### Step 1: Prepare
```bash
# Edit password
nano setup-aurora-postgres.sh
# Change line: MASTER_PASSWORD="YourSecurePassword123!@#"

# Make executable
chmod +x setup-aurora-postgres.sh aurora-management.sh import-aurora-schema.sh
```

### Step 2: Create Cluster (5-10 min wait)
```bash
./setup-aurora-postgres.sh
# Creates: cluster, instances, security group, schema file
```

### Step 3: Import Schema
```bash
./import-aurora-schema.sh
# Imports: 16 tables, indexes, 60+ countries, business types
```

## ✅ Verification
```bash
# Load config
source beauzead-db-config.env

# Test connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# List tables (in psql)
\dt

# Check countries count
SELECT COUNT(*) FROM countries;

# Exit
\q
```

---

## 📊 What Gets Created

| Item | Value |
|------|-------|
| **Cluster ID** | beauzead-aurora-postgres-prod |
| **Primary Instance** | beauzead-db-instance-1 (db.r5.large) |
| **Read Replica** | beauzead-db-instance-1-replica-1 |
| **Database Name** | beauzeaddb |
| **Engine** | Aurora PostgreSQL 15.3 |
| **Port** | 5432 |
| **Tables** | 16 |
| **Countries** | 60+ |
| **Backups** | 35-day retention |

---

## 🎛️ Management Commands

```bash
# Status
./aurora-management.sh status

# Endpoints (writer + reader)
./aurora-management.sh endpoints

# Scale instance
./aurora-management.sh scale db.r5.xlarge
./aurora-management.sh scale db.t3.medium  # Downsize to save costs

# Create snapshot
./aurora-management.sh snapshot

# List snapshots
./aurora-management.sh snapshots

# View logs
./aurora-management.sh logs

# Enable monitoring
./aurora-management.sh monitoring

# Create read replica
./aurora-management.sh replica

# DELETE CLUSTER (⚠️ caution!)
./aurora-management.sh delete
```

---

## 💰 Costs

| Instance | RAM | Cost/Month |
|----------|-----|-----------|
| db.t3.medium (dev) | 4 GB | ~$50 |
| db.r5.large (prod) | 16 GB | ~$300 |
| db.r5.xlarge (large) | 32 GB | ~$600 |

**Total Production Setup:** ~$655/month (cluster + replica + storage + backups)

---

## 🔐 Security

### Keep Secret ⚠️
```bash
# NEVER commit to git
echo "beauzead-db-config.env" >> .gitignore

# Store in AWS Secrets Manager
aws secretsmanager create-secret \
  --name beauzead/aurora/credentials \
  --secret-string file://beauzead-db-config.env
```

### Connection String Format
```
postgresql://username:password@host:5432/database
```

### From beauzead-db-config.env
```env
DB_HOST=beauzead-aurora-postgres-prod.*.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=beauzeaddb
DB_USER=beauzeadadmin
DB_PASSWORD=YourSecurePassword123!@#
```

---

## 🐘 PostgreSQL Commands

### Connect
```bash
psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

### Query Examples
```sql
-- List all tables
\dt

-- Show table structure
\d countries

-- List databases
\l

-- Count records
SELECT COUNT(*) FROM countries;

-- Show countries by region
SELECT country_name, dialing_code FROM countries 
WHERE region = 'Asia' ORDER BY country_name;

-- Show business types
SELECT * FROM business_types;

-- Exit
\q
```

---

## 🔗 AppSync Integration

### 1. Create Data Source
- Type: RDS Database
- Select cluster: beauzead-aurora-postgres-prod
- Database: beauzeaddb
- Username: beauzeadadmin

### 2. Example Resolver
**Request Template:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "SELECT * FROM countries WHERE is_active = true ORDER BY country_name"
  ]
}
```

**Response Template:**
```velocity
$utils.rds.toJsonObject($ctx.result)
```

### 3. Test Query
```graphql
query {
  listCountries {
    country_name
    currency_code
    dialing_code
    region
  }
}
```

See `APPSYNC_RESOLVER_TEMPLATES.md` for complete examples.

---

## 🐛 Quick Fixes

### Can't Connect
```bash
# Check security group
aws ec2 describe-security-groups --group-names beauzead-db-sg

# Add your IP
aws ec2 authorize-security-group-ingress \
  --group-name beauzead-db-sg \
  --protocol tcp --port 5432 \
  --cidr YOUR_IP/32
```

### High Costs
```bash
# Downsize instance
./aurora-management.sh scale db.t3.medium
```

### Slow Queries
```bash
# Check logs
./aurora-management.sh logs

# Enable query logging
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME << EOF
ALTER DATABASE beauzeaddb SET log_min_duration_statement = 1000;
EOF
```

### Schema Not Imported
```bash
# Verify database exists
psql -h $DB_HOST -U $DB_USER -l

# Retry import
./import-aurora-schema.sh
```

---

## 📁 File Reference

| File | Purpose | When to Use |
|------|---------|-----------|
| `setup-aurora-postgres.sh` | Create cluster | First time setup |
| `aurora-management.sh` | Manage cluster | Daily operations |
| `import-aurora-schema.sh` | Import schema | After cluster ready |
| `AURORA_POSTGRESQL_SCHEMA.sql` | Database schema | Backup/reference |
| `AURORA_SETUP_GUIDE.md` | Detailed guide | Full instructions |
| `APPSYNC_RESOLVER_TEMPLATES.md` | AppSync examples | GraphQL setup |
| `AURORA_COMPLETE_SETUP.md` | Summary | Overview |
| `beauzead-db-config.env` | Credentials | Connection details (generated) |

---

## 🎯 Workflow

```
1. chmod +x *.sh
   ↓
2. nano setup-aurora-postgres.sh (update password)
   ↓
3. ./setup-aurora-postgres.sh (wait 5-10 min)
   ↓
4. ./import-aurora-schema.sh
   ↓
5. psql -h $DB_HOST -U $DB_USER -d $DB_NAME
   ↓
6. SELECT COUNT(*) FROM countries;
   ↓
7. Create AppSync data source
   ↓
8. Deploy resolvers
   ↓
✅ Production Ready
```

---

## ⏱️ Timing

| Task | Time |
|------|------|
| Setup scripts | 5 min |
| Cluster creation | 5-10 min |
| Instance initialization | 3-5 min |
| Schema import | 1-2 min |
| AppSync setup | 5-10 min |
| **Total** | **20-30 min** |

---

## 📞 Help

### Get Endpoint
```bash
source beauzead-db-config.env
echo $DB_HOST
echo $DB_READER_HOST
```

### Test Connection
```bash
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1"
```

### Check Status
```bash
aws rds describe-db-clusters \
  --db-cluster-identifier beauzead-aurora-postgres-prod \
  --query 'DBClusters[0].Status'
```

### View Backups
```bash
aws rds describe-db-cluster-snapshots \
  --db-cluster-identifier beauzead-aurora-postgres-prod
```

---

## 🚨 Important

⚠️ **Update MASTER_PASSWORD** before running setup!

⚠️ **Add beauzead-db-config.env to .gitignore** before committing!

⚠️ **Create snapshots** before major changes!

⚠️ **Test restore** monthly!

✅ **Monitor costs** in AWS Billing!

---

## 🎓 Key Concepts

- **Cluster:** Logical database server (multiple instances)
- **Primary:** Handles reads + writes
- **Read Replica:** Read-only, distributes query load
- **Failover:** Automatic if primary fails
- **Encryption:** Data at-rest + in-transit
- **Backups:** Continuous, 35-day retention
- **RTO:** Recovery Time Objective (< 1 minute)
- **RPO:** Recovery Point Objective (< 5 minutes)

---

**Aurora PostgreSQL Setup Complete!** 🎉

*Production-ready, scalable, secure database for Beauzead E-commerce*
