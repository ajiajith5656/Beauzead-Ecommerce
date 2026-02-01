#!/bin/bash
# 🚀 COPY & PASTE THESE COMMANDS - DO NOT READ, JUST RUN

# ============================================================================
# STEP 1: CREATE AURORA WITH CLOUDFORMATION (You have CloudFormation access)
# ============================================================================

aws cloudformation create-stack \
  --stack-name beauzead-aurora-free \
  --region us-east-1 \
  --template-body '{
    "AWSTemplateFormatVersion": "2010-09-09",
    "Description": "Aurora PostgreSQL Free Tier for Beauzead",
    "Resources": {
      "AuroraCluster": {
        "Type": "AWS::RDS::DBCluster",
        "Properties": {
          "Engine": "aurora-postgresql",
          "EngineVersion": "15.3",
          "DatabaseName": "beauzeaddb",
          "MasterUsername": "beauzeadadmin",
          "MasterUserPassword": "Beauzead@2026Secure",
          "BackupRetentionPeriod": 7,
          "DBClusterIdentifier": "beauzead-aurora-free",
          "StorageEncrypted": true,
          "DeletionProtection": true,
          "Tags": [
            {"Key": "Environment", "Value": "FreeTier"},
            {"Key": "Project", "Value": "Beauzead"}
          ]
        }
      },
      "AuroraInstance": {
        "Type": "AWS::RDS::DBInstance",
        "Properties": {
          "DBClusterIdentifier": {"Ref": "AuroraCluster"},
          "DBInstanceIdentifier": "beauzead-db-free-instance",
          "DBInstanceClass": "db.t3.micro",
          "Engine": "aurora-postgresql",
          "PubliclyAccessible": true,
          "Tags": [
            {"Key": "Environment", "Value": "FreeTier"},
            {"Key": "Project", "Value": "Beauzead"}
          ]
        }
      }
    },
    "Outputs": {
      "Endpoint": {
        "Value": {"Fn::GetAtt": ["AuroraCluster", "Endpoint.Address"]}
      },
      "Port": {
        "Value": {"Fn::GetAtt": ["AuroraCluster", "Endpoint.Port"]}
      }
    }
  }' \
  --output text

echo "✅ Stack creation started. Wait 10 minutes..."
echo ""
echo "Monitor progress:"
echo "  aws cloudformation describe-stacks --stack-name beauzead-aurora-free --query 'Stacks[0].StackStatus'"
echo ""

# ============================================================================
# STEP 2: WAIT FOR COMPLETION (Run this after 10 minutes)
# ============================================================================

echo ""
echo "AFTER 10 MINUTES, RUN THIS:"
echo ""
echo "aws cloudformation describe-stacks \\"
echo "  --stack-name beauzead-aurora-free \\"
echo "  --query 'Stacks[0].Outputs' \\"
echo "  --region us-east-1"
echo ""

# ============================================================================
# STEP 3: GET ENDPOINT (This command shows you the endpoint after step 2)
# ============================================================================

echo ""
echo "When stack shows CREATE_COMPLETE, copy the Endpoint value"
echo "Then create config file:"
echo ""
echo "cat > beauzead-db-config.env << 'EOF'"
echo "AWS_REGION=us-east-1"
echo "DB_CLUSTER_ID=beauzead-aurora-free"
echo "DB_INSTANCE_ID=beauzead-db-free-instance"
echo "DB_HOST=<PASTE_YOUR_ENDPOINT_HERE>"
echo "DB_PORT=5432"
echo "DB_NAME=beauzeaddb"
echo "DB_USERNAME=beauzeadadmin"
echo "DB_PASSWORD=Beauzead@2026Secure"
echo "DATABASE_URL=postgresql://beauzeadadmin:Beauzead@2026Secure@<PASTE_YOUR_ENDPOINT_HERE>:5432/beauzeaddb"
echo "EOF"
echo ""

# ============================================================================
# STEP 4: IMPORT SCHEMA (After endpoint is in config)
# ============================================================================

echo ""
echo "Then run:"
echo "  bash import-aurora-schema.sh"
echo ""

# ============================================================================
# STEP 5: TEST CONNECTION
# ============================================================================

echo ""
echo "Finally test:"
echo "  psql -h <YOUR_ENDPOINT> -U beauzeadadmin -d beauzeaddb"
echo "  (password: Beauzead@2026Secure)"
echo ""
