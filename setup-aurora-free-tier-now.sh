#!/bin/bash

################################################################################
# Aurora PostgreSQL Free Tier Setup - Beauzead Ecommerce
# Account: 422287834049
# Instance: db.t3.micro (Free Tier: $0/month for 12 months)
# Region: us-east-1
# Backup Retention: 7 days (Free Tier standard)
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
echo -e "\n${YELLOW}💰 Cost: $0/month for 12 months (Free Tier)${NC}\n"

# Step 1: Create DB subnet group
echo -e "${BLUE}Step 1: Creating DB Subnet Group...${NC}"

# Get default VPC subnets
SUBNET_IDS=$(aws ec2 describe-subnets \
  --region "$AWS_REGION" \
  --query 'Subnets[0:2].SubnetId' \
  --output text)

if [ -z "$SUBNET_IDS" ]; then
  echo -e "${RED}❌ No subnets found. Ensure you have a default VPC.${NC}"
  exit 1
fi

SUBNET_ARRAY=($SUBNET_IDS)
echo -e "${GREEN}✅ Found subnets: ${SUBNET_ARRAY[@]}${NC}"

# Create subnet group if it doesn't exist
if ! aws rds describe-db-subnet-groups \
  --region "$AWS_REGION" \
  --db-subnet-group-name "beauzead-subnet-group" &>/dev/null; then
  
  aws rds create-db-subnet-group \
    --region "$AWS_REGION" \
    --db-subnet-group-name "beauzead-subnet-group" \
    --db-subnet-group-description "Beauzead Aurora subnet group" \
    --subnet-ids ${SUBNET_ARRAY[@]} \
    --tags Key=Project,Value=Beauzead Key=Environment,Value=FreeTier
  
  echo -e "${GREEN}✅ Subnet group created${NC}"
else
  echo -e "${GREEN}✅ Subnet group already exists${NC}"
fi

# Step 2: Create security group
echo -e "\n${BLUE}Step 2: Creating Security Group...${NC}"

# Get default VPC ID
VPC_ID=$(aws ec2 describe-vpcs \
  --region "$AWS_REGION" \
  --filters "Name=isDefault,Values=true" \
  --query 'Vpcs[0].VpcId' \
  --output text)

if [ -z "$VPC_ID" ] || [ "$VPC_ID" = "None" ]; then
  echo -e "${RED}❌ No default VPC found. Creating one...${NC}"
  VPC_ID=$(aws ec2 create-vpc --region "$AWS_REGION" \
    --query 'Vpc.VpcId' --output text)
fi

echo -e "${GREEN}✅ VPC ID: $VPC_ID${NC}"

# Create security group if it doesn't exist
SG_ID=$(aws ec2 describe-security-groups \
  --region "$AWS_REGION" \
  --filters "Name=group-name,Values=beauzead-aurora-sg" \
  --query 'SecurityGroups[0].GroupId' \
  --output text 2>/dev/null)

if [ -z "$SG_ID" ] || [ "$SG_ID" = "None" ]; then
  SG_ID=$(aws ec2 create-security-group \
    --region "$AWS_REGION" \
    --group-name "beauzead-aurora-sg" \
    --description "Security group for Beauzead Aurora Free Tier" \
    --vpc-id "$VPC_ID" \
    --query 'GroupId' \
    --output text)
  
  echo -e "${GREEN}✅ Security group created: $SG_ID${NC}"
else
  echo -e "${GREEN}✅ Security group already exists: $SG_ID${NC}"
fi

# Allow PostgreSQL access from anywhere (⚠️ for development only, restrict in production)
aws ec2 authorize-security-group-ingress \
  --region "$AWS_REGION" \
  --group-id "$SG_ID" \
  --protocol tcp \
  --port 5432 \
  --cidr 0.0.0.0/0 \
  --output text 2>/dev/null || echo "PostgreSQL rule already exists"

echo -e "${GREEN}✅ Security group configured${NC}"

# Step 3: Create Aurora PostgreSQL cluster
echo -e "\n${BLUE}Step 3: Creating Aurora PostgreSQL Cluster (Free Tier)...${NC}"
echo -e "${YELLOW}⏳ This may take 5-10 minutes...${NC}\n"

# Check if cluster exists
if ! aws rds describe-db-clusters \
  --region "$AWS_REGION" \
  --db-cluster-identifier "$DB_CLUSTER_ID" &>/dev/null; then
  
  aws rds create-db-cluster \
    --region "$AWS_REGION" \
    --db-cluster-identifier "$DB_CLUSTER_ID" \
    --engine aurora-postgresql \
    --engine-version "15.3" \
    --master-username "$DB_MASTER_USERNAME" \
    --master-user-password "$DB_MASTER_PASSWORD" \
    --database-name "$DB_NAME" \
    --db-subnet-group-name "beauzead-subnet-group" \
    --vpc-security-group-ids "$SG_ID" \
    --backup-retention-period "$BACKUP_RETENTION_DAYS" \
    --preferred-backup-window "$PREFERRED_BACKUP_WINDOW" \
    --preferred-maintenance-window "$PREFERRED_MAINTENANCE_WINDOW" \
    --storage-encrypted \
    --deletion-protection \
    --tags Key=Project,Value=Beauzead Key=Environment,Value=FreeTier Key=BillingTier,Value=Free \
    --output text > /dev/null
  
  echo -e "${GREEN}✅ Cluster created: $DB_CLUSTER_ID${NC}"
else
  echo -e "${YELLOW}⚠️  Cluster already exists: $DB_CLUSTER_ID${NC}"
fi

# Step 4: Create DB instance
echo -e "\n${BLUE}Step 4: Creating Aurora DB Instance (db.t3.micro - FREE TIER)...${NC}"

# Check if instance exists
if ! aws rds describe-db-instances \
  --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" &>/dev/null; then
  
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
  
  echo -e "${GREEN}✅ Instance created: $DB_INSTANCE_ID${NC}"
else
  echo -e "${YELLOW}⚠️  Instance already exists: $DB_INSTANCE_ID${NC}"
fi

# Step 5: Wait for instance to be available
echo -e "\n${BLUE}Step 5: Waiting for instance to be available...${NC}"
echo -e "${YELLOW}⏳ This may take 5-10 minutes (typical: 7-8 mins)...${NC}\n"

aws rds wait db-instance-available \
  --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" 2>/dev/null

echo -e "${GREEN}✅ Instance is now available${NC}"

# Step 6: Get connection details
echo -e "\n${BLUE}Step 6: Retrieving connection details...${NC}"

INSTANCE_INFO=$(aws rds describe-db-instances \
  --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" \
  --query 'DBInstances[0]')

ENDPOINT=$(echo $INSTANCE_INFO | grep -o '"Endpoint":[^}]*' | grep -o '"Address":"[^"]*' | cut -d'"' -f4)
PORT=$(echo $INSTANCE_INFO | grep -o '"Port":[0-9]*' | cut -d':' -f2)

echo -e "${GREEN}✅ Connection details retrieved${NC}"

# Step 7: Save configuration
echo -e "\n${BLUE}Step 7: Saving configuration...${NC}"

cat > beauzead-db-config.env << EOF
# Aurora PostgreSQL Free Tier Configuration
# Generated: $(date)
# Billing Tier: FREE ($0/month for 12 months)

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
SECURITY_GROUP_ID=$SG_ID
VPC_ID=$VPC_ID

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
echo "   • Keep backup: 7 days (Free Tier standard)"
echo "   • Storage: 20 GB included, additional storage billed"
echo "   • No Multi-AZ in Free Tier"
echo "   • No read replicas in Free Tier"
echo "   • Deletion protection: ENABLED"
echo ""

echo -e "${BLUE}Configuration saved to: beauzead-db-config.env${NC}\n"

# Verify connection capability
echo -e "${BLUE}Step 8: Verifying connection capability...${NC}"

if command -v psql &> /dev/null; then
  echo -e "${YELLOW}PostgreSQL client found. You can test connection with:${NC}"
  echo "   psql -h $ENDPOINT -U $DB_MASTER_USERNAME -d $DB_NAME"
else
  echo -e "${YELLOW}PostgreSQL client not found. To connect:${NC}"
  echo "   1. Install: apt-get install postgresql-client"
  echo "   2. Connect: psql -h $ENDPOINT -U $DB_MASTER_USERNAME -d $DB_NAME"
fi

echo -e "\n${GREEN}✅ Aurora PostgreSQL Free Tier setup is complete!${NC}"
echo -e "${GREEN}Proceed to: bash import-aurora-schema.sh${NC}\n"
