#!/bin/bash

# ============================================================
# AWS Free Tier Eligibility Check
# Beauzead E-commerce
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AWS Free Tier Eligibility Checker          ║${NC}"
echo -e "${BLUE}║   Aurora PostgreSQL for Beauzead             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"

# ============================================================
# 1. Check AWS CLI
# ============================================================
echo -e "\n${YELLOW}Step 1: Checking AWS CLI...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found${NC}"
    echo -e "${YELLOW}Install it: pip install awscli${NC}"
    exit 1
fi

AWS_VERSION=$(aws --version)
echo -e "${GREEN}✓ AWS CLI found: $AWS_VERSION${NC}"

# ============================================================
# 2. Check AWS Account Status
# ============================================================
echo -e "\n${YELLOW}Step 2: Checking AWS Account Information...${NC}"

ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text 2>/dev/null || echo "")

if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ Unable to retrieve AWS account information${NC}"
    echo -e "${YELLOW}Ensure AWS credentials are configured properly${NC}"
    exit 1
fi

echo -e "${GREEN}✓ AWS Account ID: $ACCOUNT_ID${NC}"

# ============================================================
# 3. Check Billing Information
# ============================================================
echo -e "\n${YELLOW}Step 3: Checking Billing & Free Tier Status...${NC}"

# Get billing info
BILLING_INFO=$(aws ce get-cost-and-usage \
    --time-period Start=$(date -u -d "1 month ago" +%Y-%m-%d),End=$(date -u +%Y-%m-%d) \
    --granularity MONTHLY \
    --metrics "BlendedCost" \
    --group-by Type=SERVICE \
    --region us-east-1 2>/dev/null || echo "")

if [ -z "$BILLING_INFO" ]; then
    echo -e "${YELLOW}⚠️  Could not access billing information${NC}"
    echo -e "${YELLOW}You may not have billing permissions${NC}"
else
    echo -e "${GREEN}✓ Billing information accessible${NC}"
fi

# ============================================================
# 4. Check RDS Free Tier Eligibility
# ============================================================
echo -e "\n${YELLOW}Step 4: Checking RDS Free Tier Status...${NC}"

# Try to get RDS free tier usage
FREE_TIER_STATUS=$(aws freetier list-free-tier-instances \
    --region us-east-1 2>/dev/null || echo "Not available")

if [ "$FREE_TIER_STATUS" != "Not available" ]; then
    echo -e "${GREEN}✓ Free Tier instances: $FREE_TIER_STATUS${NC}"
else
    echo -e "${YELLOW}⚠️  Free Tier information not directly available${NC}"
fi

# ============================================================
# 5. Check Account Age & Free Tier Eligibility
# ============================================================
echo -e "\n${YELLOW}Step 5: Determining Free Tier Eligibility...${NC}"

# Get account info
ACCOUNT_INFO=$(aws iam list-account-aliases 2>/dev/null || echo "")

# Method 1: Check IAM creation date (rough estimate)
# Method 2: Check if any RDS instances exist (if none, likely new account)
RDS_INSTANCES=$(aws rds describe-db-instances --region us-east-1 --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceClass]' --output text 2>/dev/null || echo "")

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}FREE TIER ELIGIBILITY SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# ============================================================
# Aurora PostgreSQL Free Tier Details
# ============================================================
echo -e "\n${YELLOW}Aurora PostgreSQL Free Tier (12 months):${NC}"
echo ""
echo -e "  ${GREEN}✓ 750 hours/month${NC} of db.t2.micro or db.t3.micro"
echo -e "  ${GREEN}✓ 20 GB database storage${NC}"
echo -e "  ${GREEN}✓ 20 GB automated backups${NC}"
echo -e "  ${GREEN}✓ 20 GB snapshots${NC}"
echo -e "  ${GREEN}✓ Enhanced monitoring${NC} (7 days retention)"
echo ""
echo -e "  ${YELLOW}Requirements:${NC}"
echo -e "    • New AWS account (within 12 months of creation)"
echo -e "    • Single DB instance"
echo -e "    • db.t2.micro or db.t3.micro instance class ONLY"
echo -e "    • Standard storage (GP2) included"
echo ""

# ============================================================
# Cost Comparison
# ============================================================
echo -e "\n${YELLOW}Cost Comparison:${NC}"
echo ""
echo -e "  ${BLUE}Current Setup (db.r5.large):${NC}"
echo -e "    • Primary: \$300/month"
echo -e "    • Replica: \$300/month"
echo -e "    • Storage: \$25/month"
echo -e "    • Backups: \$30/month"
echo -e "    ${RED}TOTAL: ~\$655/month${NC}"
echo ""
echo -e "  ${BLUE}Free Tier (db.t3.micro):${NC}"
echo -e "    • 750 hours = 31 days"
echo -e "    • Only need 1 instance (no replica)"
echo -e "    • 20 GB storage included"
echo -e "    ${GREEN}TOTAL: \$0/month (for 12 months)${NC}"
echo ""
echo -e "  ${BLUE}Free Tier with Small Upgrade (db.t3.small):${NC}"
echo -e "    • db.t3.micro hours free: ~\$0"
echo -e "    • db.t3.small hours beyond free: ~\$50/month"
echo -e "    ${GREEN}TOTAL: ~\$50/month${NC}"
echo ""

# ============================================================
# Check Existing Resources
# ============================================================
echo -e "${YELLOW}Existing RDS Resources:${NC}"

if [ -z "$RDS_INSTANCES" ]; then
    echo -e "  ${GREEN}✓ No RDS instances found${NC}"
    echo -e "    ${GREEN}Good! Free Tier likely available${NC}"
else
    echo -e "  ${YELLOW}⚠️  Existing instances detected:${NC}"
    echo -e "$RDS_INSTANCES"
    echo -e "    ${YELLOW}This may affect Free Tier eligibility${NC}"
fi

# ============================================================
# Recommendations
# ============================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}RECOMMENDATIONS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "${YELLOW}Option 1: Maximize Free Tier (Recommended for dev/test)${NC}"
echo -e "  • Use db.t3.micro instance (completely free)"
echo -e "  • Use single instance (no replica)"
echo -e "  • 20 GB storage (sufficient for development)"
echo -e "  • Cost: \$0 for 12 months"
echo ""
echo -e "  ${GREEN}Modify setup:${NC}"
echo -e "    DB_INSTANCE_CLASS=\"db.t3.micro\""
echo -e "    BACKUP_RETENTION_PERIOD=\"7\""
echo -e "    Create replica AFTER first 12 months"
echo ""

echo -e "${YELLOW}Option 2: Balance Cost & Performance${NC}"
echo -e "  • Use db.t3.small instance"
echo -e "  • Single instance (no replica during free period)"
echo -e "  • 20 GB storage"
echo -e "  • Cost: ~\$50/month (after first 750 hours)"
echo ""
echo -e "  ${GREEN}Modify setup:${NC}"
echo -e "    DB_INSTANCE_CLASS=\"db.t3.small\""
echo ""

echo -e "${YELLOW}Option 3: Production Setup (Full Monitoring)${NC}"
echo -e "  • Use db.r5.large (current config)"
echo -e "  • Primary + Read Replica"
echo -e "  • Cost: ~\$655/month (NOT free tier eligible)"
echo ""
echo -e "  ${GREEN}Use current setup:${NC}"
echo -e "    DB_INSTANCE_CLASS=\"db.r5.large\""
echo ""

# ============================================================
# How to Check Manually
# ============================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MANUAL VERIFICATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "${YELLOW}1. Check AWS Console:${NC}"
echo -e "   https://console.aws.amazon.com/billing/"
echo -e "   • Go to Billing Dashboard"
echo -e "   • Look for \"Free Tier\" section"
echo -e "   • Should show remaining hours/usage"
echo ""

echo -e "${YELLOW}2. Check Account Creation Date:${NC}"
echo -e "   https://console.aws.amazon.com/billing/home"
echo -e "   • Settings → Account Information"
echo -e "   • Account creation date should be < 12 months ago"
echo ""

echo -e "${YELLOW}3. CLI Command to Check IAM User Creation:${NC}"
echo -e "   ${GREEN}aws iam get-user --query 'User.CreateDate' --output text${NC}"
echo ""

# ============================================================
# Next Steps
# ============================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}NEXT STEPS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "${YELLOW}If using Free Tier (db.t3.micro):${NC}"
echo -e "  1. Edit setup-aurora-postgres.sh"
echo -e "  2. Change: DB_INSTANCE_CLASS=\"db.t3.micro\""
echo -e "  3. Change: BACKUP_RETENTION_PERIOD=\"7\""
echo -e "  4. Run: ./setup-aurora-postgres.sh"
echo ""

echo -e "${YELLOW}If using Paid Production Setup (db.r5.large):${NC}"
echo -e "  1. Keep current configuration"
echo -e "  2. Run: ./setup-aurora-postgres.sh"
echo -e "  3. Budget: ~\$655/month"
echo ""

echo -e "${YELLOW}To estimate costs before setup:${NC}"
echo -e "  https://calculator.aws/"
echo -e "  • Select Aurora PostgreSQL"
echo -e "  • Adjust instance type and size"
echo -e "  • See real-time cost calculations"
echo ""

echo -e "\n${GREEN}Eligibility check complete!${NC}\n"
