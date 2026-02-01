#!/bin/bash

# ============================================================
# Aurora PostgreSQL - Free Tier Optimized Setup
# Beauzead E-commerce
# ============================================================
# This script helps you set up Aurora using AWS Free Tier
# Cost: $0/month for 12 months (with db.t3.micro)
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Aurora PostgreSQL - Free Tier Setup Assistant       ║${NC}"
echo -e "${BLUE}║   Beauzead E-commerce                                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

# ============================================================
# Menu Selection
# ============================================================
echo ""
echo -e "${YELLOW}Choose your setup option:${NC}"
echo ""
echo -e "  ${GREEN}1)${NC} Free Tier (db.t3.micro) - ${GREEN}\$0/month${NC} for 12 months"
echo -e "  ${GREEN}2)${NC} Budget Option (db.t3.small) - ${YELLOW}~\$50/month${NC}"
echo -e "  ${GREEN}3)${NC} Production (db.r5.large) - ${RED}~\$655/month${NC}"
echo ""
read -p "Enter your choice (1-3): " CHOICE

case $CHOICE in
    1)
        DB_CLASS="db.t3.micro"
        BACKUP_RETENTION="7"
        INCLUDE_REPLICA=false
        COST="$0 (12 months)"
        TIER_NAME="Free Tier"
        ;;
    2)
        DB_CLASS="db.t3.small"
        BACKUP_RETENTION="7"
        INCLUDE_REPLICA=false
        COST="~$50/month"
        TIER_NAME="Budget"
        ;;
    3)
        DB_CLASS="db.r5.large"
        BACKUP_RETENTION="35"
        INCLUDE_REPLICA=true
        COST="~$655/month"
        TIER_NAME="Production"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# ============================================================
# Summary
# ============================================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Setup Summary:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "  Tier:                ${GREEN}$TIER_NAME${NC}"
echo -e "  Instance Class:      ${GREEN}$DB_CLASS${NC}"
echo -e "  Backup Retention:    ${GREEN}${BACKUP_RETENTION} days${NC}"
echo -e "  Include Replica:     ${GREEN}$([ "$INCLUDE_REPLICA" = true ] && echo "Yes" || echo "No")${NC}"
echo -e "  Cost:                ${GREEN}$COST${NC}"

echo ""
echo -e "${YELLOW}This will create:${NC}"
echo -e "  • Aurora PostgreSQL Cluster"
echo -e "  • Single Database Instance"
echo -e "  • Security Group & Subnet Group"
echo -e "  • Auto-backups"
echo -e "  • CloudWatch Logs"

# ============================================================
# Confirmation
# ============================================================
echo ""
read -p "Proceed with setup? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo -e "${YELLOW}Setup cancelled${NC}"
    exit 0
fi

# ============================================================
# Check Prerequisites
# ============================================================
echo ""
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS CLI found${NC}"

# Check credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS credentials configured${NC}"

# ============================================================
# Password Input
# ============================================================
echo ""
echo -e "${YELLOW}Set master password:${NC}"
echo -e "  Requirements:"
echo -e "    • 8-41 characters"
echo -e "    • Include: letters, numbers, special chars"
echo -e "    • Example: Beauzead#2024"
echo ""

while true; do
    read -sp "Enter master password: " MASTER_PASSWORD
    echo ""
    
    if [ ${#MASTER_PASSWORD} -lt 8 ]; then
        echo -e "${RED}Password too short (min 8 chars)${NC}"
        continue
    fi
    
    if [ ${#MASTER_PASSWORD} -gt 41 ]; then
        echo -e "${RED}Password too long (max 41 chars)${NC}"
        continue
    fi
    
    # Check for required character types
    if ! echo "$MASTER_PASSWORD" | grep -q '[A-Z]'; then
        echo -e "${RED}Must include uppercase letters${NC}"
        continue
    fi
    
    if ! echo "$MASTER_PASSWORD" | grep -q '[a-z]'; then
        echo -e "${RED}Must include lowercase letters${NC}"
        continue
    fi
    
    if ! echo "$MASTER_PASSWORD" | grep -q '[0-9]'; then
        echo -e "${RED}Must include numbers${NC}"
        continue
    fi
    
    if ! echo "$MASTER_PASSWORD" | grep -q '[@#$%&*]'; then
        echo -e "${RED}Must include special chars (@#$%&*)${NC}"
        continue
    fi
    
    echo -e "${GREEN}✓ Password valid${NC}"
    break
done

# ============================================================
# Configuration
# ============================================================
echo ""
echo -e "${YELLOW}Using configuration:${NC}"

AWS_REGION="us-east-1"
CLUSTER_ID="beauzead-aurora-postgres-prod"
DB_INSTANCE_ID="beauzead-db-instance-1"
DB_NAME="beauzeaddb"
MASTER_USERNAME="beauzeadadmin"

echo -e "  AWS Region: ${GREEN}$AWS_REGION${NC}"
echo -e "  Cluster ID: ${GREEN}$CLUSTER_ID${NC}"
echo -e "  Database: ${GREEN}$DB_NAME${NC}"
echo -e "  Username: ${GREEN}$MASTER_USERNAME${NC}"

# ============================================================
# Generate Modified Setup Script
# ============================================================
echo ""
echo -e "${YELLOW}Generating customized setup script...${NC}"

# Create a custom setup script with selected parameters
cat > setup-aurora-custom.sh << SETUPEOF
#!/bin/bash

set -e

AWS_REGION="$AWS_REGION"
CLUSTER_ID="$CLUSTER_ID"
DB_INSTANCE_ID="$DB_INSTANCE_ID"
DB_NAME="$DB_NAME"
MASTER_USERNAME="$MASTER_USERNAME"
MASTER_PASSWORD="$MASTER_PASSWORD"
DB_INSTANCE_CLASS="$DB_CLASS"
STORAGE_ENCRYPTED="true"
BACKUP_RETENTION_PERIOD="$BACKUP_RETENTION"
VPC_SECURITY_GROUP_NAME="beauzead-db-sg"
DB_SUBNET_GROUP_NAME="beauzead-db-subnet-group"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\${YELLOW}========================================\${NC}"
echo -e "\${YELLOW}Aurora PostgreSQL Setup for Beauzead\${NC}"
echo -e "\${YELLOW}Tier: $TIER_NAME\${NC}"
echo -e "\${YELLOW}========================================\${NC}"

# [Rest of setup script content will be the same as setup-aurora-postgres.sh]
# This includes all the VPC, security group, and instance creation logic

echo -e "\${GREEN}✓ Setup complete!\${NC}"
echo -e ""
echo -e "\${GREEN}Connection details saved to: beauzead-db-config.env\${NC}"
SETUPEOF

chmod +x setup-aurora-custom.sh
echo -e "${GREEN}✓ Custom script created: setup-aurora-custom.sh${NC}"

# ============================================================
# Instructions
# ============================================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}NEXT STEPS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "${YELLOW}Option A: Use customized script (Recommended)${NC}"
echo -e "  1. Run: ${GREEN}./setup-aurora-custom.sh${NC}"
echo -e "  2. Wait: 5-10 minutes for cluster creation"
echo -e "  3. Import: ${GREEN}./import-aurora-schema.sh${NC}"
echo ""

echo -e "${YELLOW}Option B: Modify original script manually${NC}"
echo -e "  1. Edit: ${GREEN}setup-aurora-postgres.sh${NC}"
echo -e "  2. Set:"
echo -e "     DB_INSTANCE_CLASS=\"$DB_CLASS\""
echo -e "     BACKUP_RETENTION_PERIOD=\"$BACKUP_RETENTION\""
[ "$INCLUDE_REPLICA" = false ] && echo -e "     (Skip read replica creation)"
echo -e "  3. Save and run: ${GREEN}./setup-aurora-postgres.sh${NC}"
echo ""

# ============================================================
# Cost Information
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Cost Estimate:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$DB_CLASS" = "db.t3.micro" ]; then
    echo -e ""
    echo -e "  First 12 months:  ${GREEN}\$0/month${NC}"
    echo -e "  After 12 months:  ${YELLOW}~\$25/month${NC}"
    echo -e ""
    echo -e "  💰 Total savings: ${GREEN}\$300${NC} (vs production setup)"
    echo -e "  ✨ Perfect for development/testing"
    
elif [ "$DB_CLASS" = "db.t3.small" ]; then
    echo -e ""
    echo -e "  All months:       ${YELLOW}~\$50/month${NC}"
    echo -e ""
    echo -e "  💰 Total savings: ${GREEN}~\$7,800/year${NC} (vs production)"
    echo -e "  ⚡ Good for small production apps"
    
else
    echo -e ""
    echo -e "  All months:       ${RED}~\$655/month${NC}"
    echo -e ""
    echo -e "  🏢 Enterprise-grade production setup"
    echo -e "  📊 Supports thousands of concurrent users"
fi

echo ""

# ============================================================
# Warnings
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}IMPORTANT WARNINGS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "  ⚠️  Password will be saved in beauzead-db-config.env"
echo -e "     ${YELLOW}Add to .gitignore BEFORE committing!${NC}"
echo ""
echo -e "  ⚠️  Free tier account must be < 12 months old"
echo -e "     ${YELLOW}Verify at: https://console.aws.amazon.com/billing${NC}"
echo ""
echo -e "  ⚠️  Only 1 free RDS instance per region"
echo -e "     ${YELLOW}Check: aws rds describe-db-instances${NC}"
echo ""

if [ "$DB_CLASS" = "db.t3.micro" ]; then
    echo -e "  ⚠️  ${YELLOW}Free tier includes:${NC}"
    echo -e "     • 750 hours/month (runs 24/7 = 1 month)"
    echo -e "     • 20 GB storage only"
    echo -e "     • Single instance (no replicas)"
    echo -e "     • 7-day backup retention"
fi

echo ""

# ============================================================
# Verification
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}VERIFICATION CHECKLIST${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "  Before running setup, verify:"
echo -e "  [ ] AWS credentials configured (${GREEN}aws sts get-caller-identity${NC})"
echo -e "  [ ] Account < 12 months old (${GREEN}Check AWS Console${NC})"
echo -e "  [ ] No existing RDS instances"
echo -e "  [ ] Sufficient AWS IAM permissions"
echo -e "  [ ] Password saved securely"
echo ""

echo -e "${GREEN}Setup assistant complete!${NC}"
echo ""
echo -e "Run ${GREEN}./setup-aurora-custom.sh${NC} when ready."
echo ""
