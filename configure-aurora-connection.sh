#!/bin/bash

################################################################################
# Aurora Connection Configuration Helper
# Use this to set up beauzead-db-config.env after cluster is created
################################################################################

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Aurora Connection Configuration Helper                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if config already exists
if [ -f beauzead-db-config.env ]; then
  echo "⚠️  beauzead-db-config.env already exists"
  echo ""
  read -p "Overwrite? (y/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

echo "Please provide your Aurora cluster connection details"
echo "You can find these in: AWS Console > RDS > Databases > beauzead-aurora-free"
echo ""

# Get endpoint
read -p "Endpoint (e.g., beauzead-aurora-free.xxxxx.us-east-1.rds.amazonaws.com): " DB_HOST
if [ -z "$DB_HOST" ]; then
  echo "❌ Endpoint is required"
  exit 1
fi

# Get port (default 5432)
read -p "Port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Get username (default)
read -p "Master username [beauzeadadmin]: " DB_USERNAME
DB_USERNAME=${DB_USERNAME:-beauzeadadmin}

# Get database name (default)
read -p "Database name [beauzeaddb]: " DB_NAME
DB_NAME=${DB_NAME:-beauzeaddb}

# Get password
read -s -p "Master password: " DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
  echo "❌ Password is required"
  exit 1
fi

# Confirm password
read -s -p "Confirm password: " DB_PASSWORD_CONFIRM
echo ""
if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
  echo "❌ Passwords do not match"
  exit 1
fi

# Build connection string
DB_CONNECTION_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Create config file
cat > beauzead-db-config.env << EOF
# Aurora PostgreSQL Free Tier Configuration
# Generated: $(date)
# Billing Tier: FREE (\$0/month for 12 months)

# Cluster Details
AWS_REGION=us-east-1
DB_CLUSTER_ID=beauzead-aurora-free
DB_INSTANCE_ID=beauzead-db-free-instance
DB_INSTANCE_CLASS=db.t3.micro

# Connection Details
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD

# Connection Strings
DATABASE_URL=$DB_CONNECTION_URL
POSTGRES_URL=$DB_CONNECTION_URL

# Backup & Maintenance
BACKUP_RETENTION_DAYS=7
BACKUP_WINDOW=03:00-04:00
MAINTENANCE_WINDOW=mon:04:00-mon:05:00

# Billing
BILLING_TIER=Free Tier
COST_PER_MONTH=\$0 (for 12 months)
INCLUDED_STORAGE=20 GB
INCLUDED_BACKUPS=20 GB
INCLUDED_SNAPSHOTS=20 GB
EOF

chmod 600 beauzead-db-config.env

echo ""
echo "✅ Configuration saved to beauzead-db-config.env"
echo ""
echo "📋 Verify these details:"
echo "   Endpoint: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   Username: $DB_USERNAME"
echo ""
echo "🔒 Connection string (for reference):"
echo "   $DB_CONNECTION_URL"
echo ""
echo "✅ Next step: bash import-aurora-schema.sh"
echo ""
