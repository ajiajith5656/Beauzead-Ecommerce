#!/bin/bash

# ============================================================
# Aurora PostgreSQL Cluster Setup - Beauzead E-commerce
# Production-Ready Configuration
# ============================================================
# This script creates an Aurora PostgreSQL cluster using AWS CLI
# Run with: bash setup-aurora-postgres.sh
# ============================================================

set -e

# Configuration Variables
AWS_REGION="us-east-1"
CLUSTER_ID="beauzead-aurora-postgres-prod"
DB_INSTANCE_ID="beauzead-db-instance-1"
DB_NAME="beauzeaddb"
MASTER_USERNAME="beauzeadadmin"
MASTER_PASSWORD="YourSecurePassword123!@#"  # CHANGE THIS!
DB_INSTANCE_CLASS="db.r5.large"  # For production
STORAGE_ENCRYPTED="true"
BACKUP_RETENTION_PERIOD="35"
VPC_SECURITY_GROUP_NAME="beauzead-db-sg"
DB_SUBNET_GROUP_NAME="beauzead-db-subnet-group"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Aurora PostgreSQL Setup for Beauzead${NC}"
echo -e "${YELLOW}========================================${NC}"

# ============================================================
# 1. CREATE VPC SECURITY GROUP
# ============================================================
echo -e "\n${YELLOW}Step 1: Creating VPC Security Group...${NC}"

# Get default VPC ID
DEFAULT_VPC=$(aws ec2 describe-vpcs --region $AWS_REGION --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)

if [ -z "$DEFAULT_VPC" ] || [ "$DEFAULT_VPC" = "None" ]; then
    echo -e "${RED}❌ No default VPC found. Please create a VPC first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using Default VPC: $DEFAULT_VPC${NC}"

# Create security group
SG_ID=$(aws ec2 create-security-group \
    --group-name $VPC_SECURITY_GROUP_NAME \
    --description "Security group for Beauzead Aurora PostgreSQL" \
    --vpc-id $DEFAULT_VPC \
    --region $AWS_REGION \
    --query 'GroupId' \
    --output text 2>/dev/null || echo "sg-exists")

if [ "$SG_ID" = "sg-exists" ]; then
    echo -e "${YELLOW}⚠️  Security group already exists, getting ID...${NC}"
    SG_ID=$(aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=$VPC_SECURITY_GROUP_NAME" \
        --region $AWS_REGION \
        --query 'SecurityGroups[0].GroupId' \
        --output text)
fi

echo -e "${GREEN}✓ Security Group ID: $SG_ID${NC}"

# Add ingress rule for PostgreSQL (port 5432)
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION 2>/dev/null || echo "Rule may already exist"

echo -e "${GREEN}✓ Ingress rule added for PostgreSQL (5432)${NC}"

# ============================================================
# 2. CREATE DB SUBNET GROUP
# ============================================================
echo -e "\n${YELLOW}Step 2: Creating DB Subnet Group...${NC}"

# Get subnets from default VPC
SUBNETS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=$DEFAULT_VPC" \
    --region $AWS_REGION \
    --query 'Subnets[*].SubnetId' \
    --output text)

if [ -z "$SUBNETS" ]; then
    echo -e "${RED}❌ No subnets found in VPC.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Available Subnets: $SUBNETS${NC}"

# Create subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name $DB_SUBNET_GROUP_NAME \
    --db-subnet-group-description "Subnet group for Beauzead Aurora" \
    --subnet-ids $SUBNETS \
    --region $AWS_REGION 2>/dev/null || echo "Subnet group may already exist"

echo -e "${GREEN}✓ DB Subnet Group created: $DB_SUBNET_GROUP_NAME${NC}"

# ============================================================
# 3. CREATE AURORA POSTGRESQL CLUSTER
# ============================================================
echo -e "\n${YELLOW}Step 3: Creating Aurora PostgreSQL Cluster...${NC}"

aws rds create-db-cluster \
    --db-cluster-identifier $CLUSTER_ID \
    --engine aurora-postgresql \
    --engine-version 15.3 \
    --master-username $MASTER_USERNAME \
    --master-user-password "$MASTER_PASSWORD" \
    --database-name $DB_NAME \
    --db-subnet-group-name $DB_SUBNET_GROUP_NAME \
    --vpc-security-group-ids $SG_ID \
    --storage-encrypted $STORAGE_ENCRYPTED \
    --backup-retention-period $BACKUP_RETENTION_PERIOD \
    --preferred-backup-window "03:00-04:00" \
    --preferred-maintenance-window "mon:04:00-mon:05:00" \
    --enable-cloudwatch-logs-exports '["postgresql"]' \
    --region $AWS_REGION \
    --tags Key=Project,Value=Beauzead Key=Environment,Value=production

echo -e "${GREEN}✓ Aurora PostgreSQL Cluster created: $CLUSTER_ID${NC}"

# ============================================================
# 4. CREATE PRIMARY DATABASE INSTANCE
# ============================================================
echo -e "\n${YELLOW}Step 4: Creating Primary Database Instance...${NC}"

aws rds create-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --db-instance-class $DB_INSTANCE_CLASS \
    --engine aurora-postgresql \
    --db-cluster-identifier $CLUSTER_ID \
    --publicly-accessible false \
    --auto-minor-version-upgrade true \
    --monitoring-interval 60 \
    --monitoring-role-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/rds-monitoring-role" \
    --region $AWS_REGION \
    --tags Key=Project,Value=Beauzead Key=Environment,Value=production

echo -e "${GREEN}✓ Database Instance created: $DB_INSTANCE_ID${NC}"

# ============================================================
# 5. CREATE READ REPLICA (Optional - for production)
# ============================================================
echo -e "\n${YELLOW}Step 5: Creating Read Replica for High Availability...${NC}"

aws rds create-db-instance \
    --db-instance-identifier "$DB_INSTANCE_ID-replica-1" \
    --db-instance-class $DB_INSTANCE_CLASS \
    --engine aurora-postgresql \
    --db-cluster-identifier $CLUSTER_ID \
    --publicly-accessible false \
    --region $AWS_REGION \
    --tags Key=Project,Value=Beauzead Key=Environment,Value=production 2>/dev/null || echo "Replica creation may require cluster to be ready"

echo -e "${GREEN}✓ Read Replica creation initiated${NC}"

# ============================================================
# 6. WAIT FOR CLUSTER TO BE AVAILABLE
# ============================================================
echo -e "\n${YELLOW}Step 6: Waiting for cluster to be available...${NC}"
echo -e "${YELLOW}⏳ This may take 5-10 minutes...${NC}"

aws rds wait db-cluster-available \
    --db-cluster-identifier $CLUSTER_ID \
    --region $AWS_REGION

echo -e "${GREEN}✓ Cluster is now available!${NC}"

# ============================================================
# 7. GET CLUSTER ENDPOINT
# ============================================================
echo -e "\n${YELLOW}Step 7: Retrieving Cluster Endpoints...${NC}"

CLUSTER_ENDPOINT=$(aws rds describe-db-clusters \
    --db-cluster-identifier $CLUSTER_ID \
    --region $AWS_REGION \
    --query 'DBClusters[0].Endpoint' \
    --output text)

READER_ENDPOINT=$(aws rds describe-db-clusters \
    --db-cluster-identifier $CLUSTER_ID \
    --region $AWS_REGION \
    --query 'DBClusters[0].ReaderEndpoint' \
    --output text)

echo -e "${GREEN}✓ Writer Endpoint: $CLUSTER_ENDPOINT${NC}"
echo -e "${GREEN}✓ Reader Endpoint: $READER_ENDPOINT${NC}"

# ============================================================
# 8. SAVE CONNECTION DETAILS
# ============================================================
echo -e "\n${YELLOW}Step 8: Saving Connection Details...${NC}"

cat > beauzead-db-config.env << EOF
# Aurora PostgreSQL Connection Details
# Generated: $(date)

DB_HOST=$CLUSTER_ENDPOINT
DB_READER_HOST=$READER_ENDPOINT
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$MASTER_USERNAME
DB_PASSWORD=$MASTER_PASSWORD
DB_CLUSTER_ID=$CLUSTER_ID
DB_INSTANCE_ID=$DB_INSTANCE_ID
DB_REGION=$AWS_REGION
DB_ENGINE=aurora-postgresql
DB_VERSION=15.3

# Connection String for Applications
DATABASE_URL=postgresql://$MASTER_USERNAME:$MASTER_PASSWORD@$CLUSTER_ENDPOINT:5432/$DB_NAME

# Connection String for Read Replica
DATABASE_READ_URL=postgresql://$MASTER_USERNAME:$MASTER_PASSWORD@$READER_ENDPOINT:5432/$DB_NAME
EOF

echo -e "${GREEN}✓ Connection details saved to: beauzead-db-config.env${NC}"

# ============================================================
# 9. DISPLAY SUMMARY
# ============================================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Aurora PostgreSQL Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}Connection Details:${NC}"
echo -e "  Host (Writer):     ${GREEN}$CLUSTER_ENDPOINT${NC}"
echo -e "  Host (Reader):     ${GREEN}$READER_ENDPOINT${NC}"
echo -e "  Port:              ${GREEN}5432${NC}"
echo -e "  Database:          ${GREEN}$DB_NAME${NC}"
echo -e "  Username:          ${GREEN}$MASTER_USERNAME${NC}"
echo -e "  Password:          ${GREEN}(stored in beauzead-db-config.env)${NC}"

echo -e "\n${YELLOW}Connection String (for apps):${NC}"
echo -e "  ${GREEN}postgresql://$MASTER_USERNAME:$MASTER_PASSWORD@$CLUSTER_ENDPOINT:5432/$DB_NAME${NC}"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "  1. Connect to database:"
echo -e "     ${GREEN}psql -h $CLUSTER_ENDPOINT -U $MASTER_USERNAME -d $DB_NAME${NC}"
echo -e ""
echo -e "  2. Run schema file:"
echo -e "     ${GREEN}psql -h $CLUSTER_ENDPOINT -U $MASTER_USERNAME -d $DB_NAME < AURORA_POSTGRESQL_SCHEMA.sql${NC}"
echo -e ""
echo -e "  3. Update AppSync data sources with endpoint"
echo -e "     ${GREEN}$CLUSTER_ENDPOINT${NC}"
echo -e ""
echo -e "  4. Keep beauzead-db-config.env secure (add to .gitignore)"

echo -e "\n${YELLOW}Security Notes:${NC}"
echo -e "  ⚠️  Never commit beauzead-db-config.env to git"
echo -e "  ⚠️  Update MASTER_PASSWORD to a strong value"
echo -e "  ⚠️  Store credentials in AWS Secrets Manager for production"
echo -e "  ⚠️  Enable MFA Delete on automated backups"

echo -e "\n${YELLOW}Cost Optimization:${NC}"
echo -e "  💡 Use Aurora Serverless v2 for variable workloads"
echo -e "  💡 Scale instances based on demand"
echo -e "  💡 Enable automated backups (already enabled)"
echo -e "  💡 Use Read Replicas for read-heavy workloads"

echo ""
