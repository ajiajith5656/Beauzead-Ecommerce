#!/bin/bash
# 🎯 SIMPLEST PATH: 3 COMMANDS TOTAL

echo "════════════════════════════════════════════════════════════"
echo "   SIMPLEST SETUP - JUST 3 COMMANDS"
echo "════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# COMMAND 1: CREATE CLUSTER (Run this now)
# ============================================================================
echo "📌 COMMAND 1 OF 3 - Copy and paste exactly:"
echo ""
echo "aws rds create-db-cluster \\"
echo "  --db-cluster-identifier beauzead-aurora-free \\"
echo "  --engine aurora-postgresql \\"
echo "  --engine-version 15.3 \\"
echo "  --master-username beauzeadadmin \\"
echo "  --master-user-password Beauzead@2026Secure \\"
echo "  --database-name beauzeaddb \\"
echo "  --backup-retention-period 7 \\"
echo "  --storage-encrypted \\"
echo "  --region us-east-1"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# COMMAND 2: CREATE INSTANCE (Run after command 1)
# ============================================================================
echo "📌 COMMAND 2 OF 3 - Run after 1-2 minutes:"
echo ""
echo "aws rds create-db-instance \\"
echo "  --db-instance-identifier beauzead-db-free-instance \\"
echo "  --db-instance-class db.t3.micro \\"
echo "  --engine aurora-postgresql \\"
echo "  --db-cluster-identifier beauzead-aurora-free \\"
echo "  --publicly-accessible \\"
echo "  --region us-east-1"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# COMMAND 3: GET ENDPOINT (Run after 10 minutes when instance is ready)
# ============================================================================
echo "📌 COMMAND 3 OF 3 - Run after 10 minutes:"
echo ""
echo "aws rds describe-db-clusters \\"
echo "  --db-cluster-identifier beauzead-aurora-free \\"
echo "  --region us-east-1 \\"
echo "  --query 'DBClusters[0].Endpoint' \\"
echo "  --output text"
echo ""
echo "This gives you the ENDPOINT (copy it)"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# COMMAND 4: CREATE CONFIG FILE (After you have endpoint from command 3)
# ============================================================================
echo "📌 COMMAND 4 - Replace ENDPOINT_HERE with your endpoint:"
echo ""
echo "cat > beauzead-db-config.env << 'EOF'"
echo "DB_HOST=ENDPOINT_HERE"
echo "DB_PORT=5432"
echo "DB_NAME=beauzeaddb"
echo "DB_USERNAME=beauzeadadmin"
echo "DB_PASSWORD=Beauzead@2026Secure"
echo "DATABASE_URL=postgresql://beauzeadadmin:Beauzead@2026Secure@ENDPOINT_HERE:5432/beauzeaddb"
echo "EOF"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# COMMAND 5: IMPORT SCHEMA
# ============================================================================
echo "📌 COMMAND 5 - After config file created:"
echo ""
echo "bash import-aurora-schema.sh"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "✅ Total time: ~15 minutes"
echo "💰 Cost: $0 (Free Tier)"
echo ""
