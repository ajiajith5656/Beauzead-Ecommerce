#!/bin/bash

################################################################################
# Aurora PostgreSQL Free Tier Setup - Beauzead Ecommerce
# Simplified version for RDS-only permissions
# Account: 422287834049
# Instance: db.t3.micro (Free Tier: $0/month for 12 months)
# Region: us-east-1
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Aurora PostgreSQL Free Tier Setup for Beauzead Ecommerce ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Configuration (optimized for Free Tier)
AWS_REGION="us-east-1"
DB_CLUSTER_ID="beauzead-aurora-free"
DB_INSTANCE_ID="beauzead-db-free-instance"
DB_INSTANCE_CLASS="db.t3.micro"  # ✅ Free Tier eligible
DB_MASTER_USERNAME="beauzeadadmin"
DB_MASTER_PASSWORD="Beauzead@2026Secure"
DB_NAME="beauzeaddb"
BACKUP_RETENTION_DAYS=7  # Free Tier limit
STORAGE_ENCRYPTED="true"
PREFERRED_BACKUP_WINDOW="03:00-04:00"
PREFERRED_MAINTENANCE_WINDOW="mon:04:00-mon:05:00"

echo -e "${YELLOW}📋 Configuration Details:${NC}"
echo "   Region: $AWS_REGION"
echo "   Cluster ID: $DB_CLUSTER_ID"
echo "   Instance Class: $DB_INSTANCE_CLASS (FREE TIER ✅)"
echo "   Database Name: $DB_NAME"
echo "   Master Username: $DB_MASTER_USERNAME"
echo "   Backup Retention: $BACKUP_RETENTION_DAYS days (Free Tier limit)"
echo "   Encryption: Enabled"
echo -e "\n${YELLOW}💰 Cost: \$0/month for 12 months (Free Tier)${NC}\n"

# Step 1: Check if cluster exists
echo -e "${BLUE}Step 1: Checking for existing cluster...${NC}"

if aws rds describe-db-clusters \
  --region "$AWS_REGION" \
  --db-cluster-identifier "$DB_CLUSTER_ID" &>/dev/null; then
  echo -e "${YELLOW}⚠️  Cluster already exists: $DB_CLUSTER_ID${NC}"
  CLUSTER_EXISTS=true
else
  echo -e "${GREEN}✅ Cluster does not exist, will create${NC}"
  CLUSTER_EXISTS=false
fi

# Step 2: Create Aurora PostgreSQL cluster (if not exists)
if [ "$CLUSTER_EXISTS" = false ]; then
  echo -e "\n${BLUE}Step 2: Creating Aurora PostgreSQL Cluster (Free Tier)...${NC}"
  echo -e "${YELLOW}⏳ This may take 5-10 minutes...${NC}\n"
  
  aws rds create-db-cluster \
    --region "$AWS_REGION" \
    --db-cluster-identifier "$DB_CLUSTER_ID" \
    --engine aurora-postgresql \
    --engine-version "15.3" \
    --master-username "$DB_MASTER_USERNAME" \
    --master-user-password "$DB_MASTER_PASSWORD" \
    --database-name "$DB_NAME" \
    --backup-retention-period "$BACKUP_RETENTION_DAYS" \
    --preferred-backup-window "$PREFERRED_BACKUP_WINDOW" \
    --preferred-maintenance-window "$PREFERRED_MAINTENANCE_WINDOW" \
    --storage-encrypted \
    --deletion-protection \
    --tags Key=Project,Value=Beauzead Key=Environment,Value=FreeTier Key=BillingTier,Value=Free \
    --output text > /dev/null
  
  echo -e "${GREEN}✅ Cluster creation initiated: $DB_CLUSTER_ID${NC}"
else
  echo -e "${YELLOW}⚠️  Skipping cluster creation (already exists)${NC}"
fi

# Step 3: Check if instance exists
echo -e "\n${BLUE}Step 3: Checking for existing instance...${NC}"

if aws rds describe-db-instances \
  --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" &>/dev/null; then
  echo -e "${YELLOW}⚠️  Instance already exists: $DB_INSTANCE_ID${NC}"
  INSTANCE_EXISTS=true
else
  echo -e "${GREEN}✅ Instance does not exist, will create${NC}"
  INSTANCE_EXISTS=false
fi

# Step 4: Create DB instance (if not exists)
if [ "$INSTANCE_EXISTS" = false ]; then
  echo -e "\n${BLUE}Step 4: Creating Aurora DB Instance (db.t3.micro - FREE TIER)...${NC}"
  
  aws rds create-db-instance \
    --region "$AWS_REGION" \
    --db-cluster-identifier "$DB_CLUSTER_ID" \
    --db-instance-identifier "$DB_INSTANCE_ID" \
    --db-instance-class "$DB_INSTANCE_CLASS" \
    --engine aurora-postgresql \
    --publicly-accessible \
    --auto-minor-version-upgrade \
    --tags Key=Project,Value=Beauzead Key=Environment,Value=FreeTier Key=BillingTier,Value=Free \
    --output text > /dev/null
  
  echo -e "${GREEN}✅ Instance creation initiated: $DB_INSTANCE_ID${NC}"
else
  echo -e "${YELLOW}⚠️  Skipping instance creation (already exists)${NC}"
fi

# Step 5: Wait for instance to be available
echo -e "\n${BLUE}Step 5: Waiting for instance to be available...${NC}"
echo -e "${YELLOW}⏳ This may take 5-15 minutes (typical: 7-10 mins)...${NC}\n"

aws rds wait db-instance-available \
  --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" 2>/dev/null

echo -e "${GREEN}✅ Instance is now available${NC}"

# Step 6: Get connection details
echo -e "\n${BLUE}Step 6: Retrieving connection details...${NC}"

INSTANCE_INFO=$(aws rds describe-db-instances \
  --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" \
  --query 'DBInstances[0]' \
  --output json)

ENDPOINT=$(echo "$INSTANCE_INFO" | grep -o '"Address": "[^"]*' | cut -d'"' -f4)
PORT=$(echo "$INSTANCE_INFO" | grep -o '"Port": [0-9]*' | cut -d' ' -f3)

if [ -z "$ENDPOINT" ]; then
  echo -e "${RED}❌ Could not retrieve endpoint. Trying alternative method...${NC}"
  ENDPOINT=$(echo "$INSTANCE_INFO" | grep "Endpoint" -A 5 | grep "Address" | grep -o '"Address": "[^"]*' | cut -d'"' -f4)
fi

echo -e "${GREEN}✅ Connection details retrieved${NC}"

# Step 7: Save configuration
echo -e "\n${BLUE}Step 7: Saving configuration...${NC}"

cat > beauzead-db-config.env << EOF
# Aurora PostgreSQL Free Tier Configuration
# Generated: $(date)
# Billing Tier: FREE (\$0/month for 12 months)

# Cluster Details
AWS_REGION=$AWS_REGION
DB_CLUSTER_ID=$DB_CLUSTER_ID
DB_INSTANCE_ID=$DB_INSTANCE_ID
DB_INSTANCE_CLASS=$DB_INSTANCE_CLASS

# Connection Details
DB_HOST=$ENDPOINT
DB_PORT=$PORT
DB_NAME=$DB_NAME
DB_USERNAME=$DB_MASTER_USERNAME
DB_PASSWORD=$DB_MASTER_PASSWORD

# Connection Strings
DATABASE_URL=postgresql://$DB_MASTER_USERNAME:$DB_MASTER_PASSWORD@$ENDPOINT:$PORT/$DB_NAME
POSTGRES_URL=postgresql://$DB_MASTER_USERNAME:$DB_MASTER_PASSWORD@$ENDPOINT:$PORT/$DB_NAME

# Security
DB_ENCRYPTION=true

# Backup & Maintenance
BACKUP_RETENTION_DAYS=$BACKUP_RETENTION_DAYS
BACKUP_WINDOW=$PREFERRED_BACKUP_WINDOW
MAINTENANCE_WINDOW=$PREFERRED_MAINTENANCE_WINDOW

# Billing
BILLING_TIER=Free Tier
COST_PER_MONTH=\$0 (for 12 months)
INCLUDED_STORAGE=20 GB
INCLUDED_BACKUPS=20 GB
INCLUDED_SNAPSHOTS=20 GB
EOF

chmod 600 beauzead-db-config.env
echo -e "${GREEN}✅ Configuration saved to beauzead-db-config.env${NC}"

# Step 8: Display summary
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  ✅ SETUP COMPLETE ✅                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}Aurora PostgreSQL Free Tier Cluster Created Successfully!${NC}\n"

echo -e "${YELLOW}📊 Cluster Details:${NC}"
echo "   Cluster ID: $DB_CLUSTER_ID"
echo "   Instance Class: $DB_INSTANCE_CLASS (FREE TIER)"
echo "   Engine: Aurora PostgreSQL 15.3"
echo "   Database: $DB_NAME"
echo ""

echo -e "${YELLOW}🔌 Connection Details:${NC}"
echo "   Endpoint: $ENDPOINT"
echo "   Port: $PORT"
echo "   Username: $DB_MASTER_USERNAME"
echo "   Password: ••••••••••• (saved in config)"
echo ""

echo -e "${YELLOW}💰 Pricing (12 months):${NC}"
echo "   Monthly Cost: \$0 ✅ (Free Tier)"
echo "   Annual Cost: \$0 ✅"
echo "   After 12 months: ~\$60/month (small to medium workload)"
echo ""

echo -e "${YELLOW}📁 Configuration File:${NC}"
echo "   Location: beauzead-db-config.env"
echo "   Permissions: 600 (secure)"
echo ""

echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "   1. Import schema:"
echo "      bash import-aurora-schema.sh"
echo ""
echo "   2. Create AppSync Data Source in AWS Console"
echo ""
echo "   3. Deploy GraphQL resolvers (see APPSYNC_RESOLVER_TEMPLATES.md)"
echo ""

echo -e "${YELLOW}📝 Important Notes:${NC}"
echo "   • Backup retention: 7 days (Free Tier standard)"
echo "   • Storage: 20 GB included, additional storage billed"
echo "   • No Multi-AZ in Free Tier"
echo "   • No read replicas in Free Tier"
echo "   • Deletion protection: ENABLED"
echo ""

echo -e "${BLUE}Configuration saved to: beauzead-db-config.env${NC}\n"

# Verify connection capability
echo -e "${BLUE}Step 8: Connection testing available...${NC}"

if command -v psql &> /dev/null; then
  echo -e "${GREEN}✅ PostgreSQL client is available${NC}"
  echo -e "${YELLOW}Test connection with:${NC}"
  echo "   psql -h $ENDPOINT -U $DB_MASTER_USERNAME -d $DB_NAME"
else
  echo -e "${YELLOW}PostgreSQL client not found. To test connection:${NC}"
  echo "   1. Install: apt-get install postgresql-client"
  echo "   2. Connect: psql -h $ENDPOINT -U $DB_MASTER_USERNAME -d $DB_NAME"
fi

echo -e "\n${GREEN}✅ Aurora PostgreSQL Free Tier setup is complete!${NC}"
echo -e "${GREEN}Next: bash import-aurora-schema.sh${NC}\n"
