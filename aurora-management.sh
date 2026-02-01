#!/bin/bash

# ============================================================
# Aurora PostgreSQL Management Commands
# Quick reference for common operations
# ============================================================

AWS_REGION="us-east-1"
CLUSTER_ID="beauzead-aurora-postgres-prod"
DB_INSTANCE_ID="beauzead-db-instance-1"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================================
# 1. GET CLUSTER STATUS
# ============================================================
get_cluster_status() {
    echo -e "${YELLOW}Checking Cluster Status...${NC}"
    aws rds describe-db-clusters \
        --db-cluster-identifier $CLUSTER_ID \
        --region $AWS_REGION \
        --query 'DBClusters[0].[DBClusterIdentifier,Status,Engine,EngineVersion]' \
        --output table
}

# ============================================================
# 2. GET CLUSTER ENDPOINT
# ============================================================
get_endpoints() {
    echo -e "${YELLOW}Cluster Endpoints:${NC}"
    aws rds describe-db-clusters \
        --db-cluster-identifier $CLUSTER_ID \
        --region $AWS_REGION \
        --query 'DBClusters[0].[Endpoint,ReaderEndpoint,Port]' \
        --output table
}

# ============================================================
# 3. SCALE INSTANCE UP/DOWN
# ============================================================
scale_instance() {
    local new_class=$1
    if [ -z "$new_class" ]; then
        echo "Usage: scale_instance db.r5.xlarge"
        echo "Available classes: db.t3.medium, db.r5.large, db.r5.xlarge, db.r5.2xlarge"
        return
    fi
    
    echo -e "${YELLOW}Scaling instance to $new_class...${NC}"
    aws rds modify-db-instance \
        --db-instance-identifier $DB_INSTANCE_ID \
        --db-instance-class $new_class \
        --apply-immediately \
        --region $AWS_REGION
    
    echo -e "${GREEN}✓ Scaling initiated${NC}"
}

# ============================================================
# 4. CREATE MANUAL SNAPSHOT
# ============================================================
create_snapshot() {
    local snapshot_id="beauzead-snap-$(date +%Y%m%d-%H%M%S)"
    echo -e "${YELLOW}Creating snapshot: $snapshot_id${NC}"
    
    aws rds create-db-cluster-snapshot \
        --db-cluster-snapshot-identifier $snapshot_id \
        --db-cluster-identifier $CLUSTER_ID \
        --region $AWS_REGION
    
    echo -e "${GREEN}✓ Snapshot creation initiated: $snapshot_id${NC}"
}

# ============================================================
# 5. LIST SNAPSHOTS
# ============================================================
list_snapshots() {
    echo -e "${YELLOW}Available Snapshots:${NC}"
    aws rds describe-db-cluster-snapshots \
        --db-cluster-identifier $CLUSTER_ID \
        --region $AWS_REGION \
        --query 'DBClusterSnapshots[*].[DBClusterSnapshotIdentifier,SnapshotCreateTime,Status]' \
        --output table
}

# ============================================================
# 6. VIEW CLUSTER LOGS
# ============================================================
view_logs() {
    echo -e "${YELLOW}Recent PostgreSQL Logs:${NC}"
    aws logs tail "/aws/rds/cluster/$CLUSTER_ID/postgresql" \
        --follow \
        --region $AWS_REGION
}

# ============================================================
# 7. BACKUP DETAILS
# ============================================================
backup_details() {
    echo -e "${YELLOW}Backup Configuration:${NC}"
    aws rds describe-db-clusters \
        --db-cluster-identifier $CLUSTER_ID \
        --region $AWS_REGION \
        --query 'DBClusters[0].[BackupRetentionPeriod,PreferredBackupWindow,PreferredMaintenanceWindow]' \
        --output table
}

# ============================================================
# 8. ENABLE ENHANCED MONITORING
# ============================================================
enable_monitoring() {
    echo -e "${YELLOW}Enabling Enhanced Monitoring...${NC}"
    
    # Create IAM role if doesn't exist
    ROLE_ARN="arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/rds-monitoring-role"
    
    aws rds modify-db-instance \
        --db-instance-identifier $DB_INSTANCE_ID \
        --monitoring-interval 60 \
        --monitoring-role-arn $ROLE_ARN \
        --apply-immediately \
        --region $AWS_REGION
    
    echo -e "${GREEN}✓ Enhanced monitoring enabled${NC}"
}

# ============================================================
# 9. CREATE READ REPLICA IN DIFFERENT AZ
# ============================================================
create_read_replica() {
    local replica_id="$DB_INSTANCE_ID-replica-2"
    echo -e "${YELLOW}Creating Read Replica: $replica_id${NC}"
    
    aws rds create-db-instance \
        --db-instance-identifier $replica_id \
        --db-instance-class db.r5.large \
        --engine aurora-postgresql \
        --db-cluster-identifier $CLUSTER_ID \
        --publicly-accessible false \
        --region $AWS_REGION
    
    echo -e "${GREEN}✓ Read replica creation initiated${NC}"
}

# ============================================================
# 10. DELETE CLUSTER (CAUTION!)
# ============================================================
delete_cluster() {
    echo -e "${RED}⚠️  WARNING: This will delete the entire cluster!${NC}"
    read -p "Type 'DELETE' to confirm: " confirmation
    
    if [ "$confirmation" = "DELETE" ]; then
        echo -e "${RED}Deleting cluster...${NC}"
        
        # First, delete all instances
        aws rds delete-db-instance \
            --db-instance-identifier $DB_INSTANCE_ID \
            --skip-final-snapshot \
            --region $AWS_REGION
        
        # Then delete cluster
        aws rds delete-db-cluster \
            --db-cluster-identifier $CLUSTER_ID \
            --skip-final-snapshot \
            --region $AWS_REGION
        
        echo -e "${RED}✗ Cluster deletion initiated${NC}"
    else
        echo "Deletion cancelled"
    fi
}

# ============================================================
# MENU
# ============================================================
if [ -z "$1" ]; then
    echo -e "${YELLOW}Aurora PostgreSQL Management${NC}"
    echo ""
    echo "Usage: bash aurora-management.sh [command]"
    echo ""
    echo "Commands:"
    echo "  status              - Get cluster status"
    echo "  endpoints           - Get cluster endpoints"
    echo "  scale [class]       - Scale instance (e.g., db.r5.xlarge)"
    echo "  snapshot            - Create manual snapshot"
    echo "  snapshots           - List all snapshots"
    echo "  logs                - View PostgreSQL logs"
    echo "  backup              - Show backup configuration"
    echo "  monitoring          - Enable enhanced monitoring"
    echo "  replica             - Create read replica"
    echo "  delete              - Delete cluster (caution!)"
    echo ""
else
    case "$1" in
        status)
            get_cluster_status
            ;;
        endpoints)
            get_endpoints
            ;;
        scale)
            scale_instance "$2"
            ;;
        snapshot)
            create_snapshot
            ;;
        snapshots)
            list_snapshots
            ;;
        logs)
            view_logs
            ;;
        backup)
            backup_details
            ;;
        monitoring)
            enable_monitoring
            ;;
        replica)
            create_read_replica
            ;;
        delete)
            delete_cluster
            ;;
        *)
            echo "Unknown command: $1"
            ;;
    esac
fi
