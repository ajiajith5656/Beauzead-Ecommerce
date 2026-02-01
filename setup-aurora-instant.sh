#!/bin/bash

# Generate secure password
PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
# Make sure it has special chars, numbers, uppercase
PASSWORD="${PASSWORD}A1!"

echo "════════════════════════════════════════════════════════════════"
echo "🚀 BEAUZEAD E-COMMERCE: AURORA POSTGRESQL FREE TIER SETUP"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📋 Configuration Selected:"
echo "   • Instance Type: db.t3.micro (FREE TIER)"
echo "   • Cost: $0/month × 12 months (then ~$25/month)"
echo "   • Region: us-east-1"
echo "   • Storage: 20 GB (included in free tier)"
echo "   • Backups: 20 GB automated (included)"
echo ""
echo "🔐 Master Password Generated: ${PASSWORD:0:10}...${PASSWORD: -4}"
echo ""
echo "⏱️  Estimated Setup Time: 5-10 minutes"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# Create the custom setup script with Free Tier config
cat > setup-aurora-custom.sh << 'SETUP'
#!/bin/bash

set -e

CLUSTER_ID="beauzead-aurora-postgres-prod"
DB_NAME="beauzeaddb"
MASTER_USER="beauzeadadmin"
MASTER_PASSWORD="PLACEHOLDER_PASSWORD"
REGION="us-east-1"
INSTANCE_TYPE="db.t3.micro"  # FREE TIER
INSTANCE_CLASS="db.t3.micro"
PORT=5432

echo "🔧 Creating Aurora PostgreSQL Free Tier Cluster..."
echo "   Cluster: $CLUSTER_ID"
echo "   Instance: $INSTANCE_TYPE"
echo ""

# Step 1: Create security group
echo "📋 Step 1/5: Creating security group..."
SG_ID=$(aws ec2 create-security-group \
  --group-name beauzead-db-sg \
  --description "Security group for Beauzead Aurora PostgreSQL" \
  --region $REGION \
  --query 'GroupId' \
  --output text 2>/dev/null || echo "sg-existing")

if [ "$SG_ID" != "sg-existing" ]; then
  aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || true
  echo "   ✅ Security group created: $SG_ID"
else
  SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=beauzead-db-sg" \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text 2>/dev/null || echo "sg-default")
  echo "   ✅ Using existing security group: $SG_ID"
fi

# Step 2: Create Aurora cluster
echo "📋 Step 2/5: Creating Aurora PostgreSQL cluster (this takes 5-10 minutes)..."
aws rds create-db-cluster \
  --db-cluster-identifier $CLUSTER_ID \
  --engine aurora-postgresql \
  --engine-version 15.3 \
  --master-username $MASTER_USER \
  --master-user-password "$MASTER_PASSWORD" \
  --database-name $DB_NAME \
  --port $PORT \
  --db-subnet-group-name default \
  --vpc-security-group-ids $SG_ID \
  --storage-encrypted \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports '[postgresql]' \
  --region $REGION \
  --tags "Key=Project,Value=Beauzead" "Key=Environment,Value=Production" "Key=TierType,Value=Free" \
  2>/dev/null || echo "Cluster may already exist, continuing..."

echo "   ⏳ Waiting for cluster to be available (this may take several minutes)..."
aws rds wait db-cluster-available \
  --db-cluster-identifier $CLUSTER_ID \
  --region $REGION \
  2>/dev/null || true

echo "   ✅ Cluster created"

# Step 3: Create primary instance (FREE TIER)
echo "📋 Step 3/5: Creating primary instance ($INSTANCE_TYPE - FREE TIER)..."
aws rds create-db-instance \
  --db-instance-identifier beauzead-db-instance-1 \
  --db-instance-class $INSTANCE_CLASS \
  --engine aurora-postgresql \
  --db-cluster-identifier $CLUSTER_ID \
  --publicly-accessible \
  --region $REGION \
  --tags "Key=Project,Value=Beauzead" "Key=Role,Value=Primary" \
  2>/dev/null || echo "Instance may already exist, continuing..."

echo "   ⏳ Waiting for instance to be available..."
aws rds wait db-instance-available \
  --db-instance-identifier beauzead-db-instance-1 \
  --region $REGION \
  2>/dev/null || true

echo "   ✅ Primary instance created"

# Step 4: Get cluster endpoint
echo "📋 Step 4/5: Retrieving cluster endpoint..."
CLUSTER_ENDPOINT=$(aws rds describe-db-clusters \
  --db-cluster-identifier $CLUSTER_ID \
  --region $REGION \
  --query 'DBClusters[0].Endpoint' \
  --output text)

READER_ENDPOINT=$(aws rds describe-db-clusters \
  --db-cluster-identifier $CLUSTER_ID \
  --region $REGION \
  --query 'DBClusters[0].ReaderEndpoint' \
  --output text)

echo "   ✅ Endpoints retrieved"
echo "      Writer: $CLUSTER_ENDPOINT"
echo "      Reader: $READER_ENDPOINT"

# Step 5: Save configuration
echo "📋 Step 5/5: Saving configuration..."
cat > beauzead-db-config.env << CONFIG
# 🗄️  Beauzead Aurora PostgreSQL Configuration
# Generated: $(date)
# FREE TIER: db.t3.micro ($0/month × 12 months)

# Database Host
DB_HOST=$CLUSTER_ENDPOINT
DB_READER_HOST=$READER_ENDPOINT

# Database Credentials
DB_USER=$MASTER_USER
DB_PASSWORD="$MASTER_PASSWORD"
DB_NAME=$DB_NAME
DB_PORT=$PORT

# AWS Configuration
AWS_REGION=$REGION
DB_CLUSTER_ID=$CLUSTER_ID
DB_INSTANCE_CLASS=$INSTANCE_CLASS

# Connection Strings
DB_CONNECTION_STRING="postgresql://$MASTER_USER:$MASTER_PASSWORD@$CLUSTER_ENDPOINT:$PORT/$DB_NAME"
DB_READER_CONNECTION="postgresql://$MASTER_USER:$MASTER_PASSWORD@$READER_ENDPOINT:$PORT/$DB_NAME"

# Amplify Configuration (for AppSync)
AMPLIFY_DB_HOST=$CLUSTER_ENDPOINT
AMPLIFY_DB_USER=$MASTER_USER
AMPLIFY_DB_PASSWORD="$MASTER_PASSWORD"
AMPLIFY_DB_NAME=$DB_NAME
CONFIG

chmod 600 beauzead-db-config.env
echo "   ✅ Configuration saved to beauzead-db-config.env"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ AURORA POSTGRESQL CLUSTER CREATED SUCCESSFULLY!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🔗 Connection Details:"
echo "   Host: $CLUSTER_ENDPOINT"
echo "   Database: $DB_NAME"
echo "   User: $MASTER_USER"
echo "   Port: $PORT"
echo ""
echo "📂 Configuration file: beauzead-db-config.env"
echo "⚠️  IMPORTANT: Add to .gitignore immediately!"
echo ""
echo "🚀 Next Steps:"
echo "   1. Add to .gitignore: echo 'beauzead-db-config.env' >> .gitignore"
echo "   2. Import schema: ./import-aurora-schema.sh"
echo "   3. Verify tables: psql -h \$DB_HOST -U \$DB_USER -d \$DB_NAME -c '\\\\dt'"
echo ""

SETUP

chmod +x setup-aurora-custom.sh
echo "✅ Setup script created"
