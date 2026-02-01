#!/bin/bash

# ============================================================
# Import Aurora PostgreSQL Schema
# Loads the schema.sql file into the database
# ============================================================

# Load configuration
if [ ! -f "beauzead-db-config.env" ]; then
    echo "❌ beauzead-db-config.env not found!"
    echo "Run setup-aurora-postgres.sh first"
    exit 1
fi

source beauzead-db-config.env

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Aurora PostgreSQL Schema Import${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql not found. Install PostgreSQL client:${NC}"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

# Check if schema file exists
if [ ! -f "AURORA_POSTGRESQL_SCHEMA.sql" ]; then
    echo -e "${RED}❌ AURORA_POSTGRESQL_SCHEMA.sql not found!${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Connection Details:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"

echo -e "\n${YELLOW}Testing connection...${NC}"

# Test connection
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}❌ Connection failed!${NC}"
    echo "Check your network connectivity and security group rules."
    exit 1
fi

echo -e "\n${YELLOW}Importing schema...${NC}"

# Import schema
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < AURORA_POSTGRESQL_SCHEMA.sql

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Schema imported successfully!${NC}"
else
    echo -e "\n${RED}❌ Schema import failed!${NC}"
    exit 1
fi

# Count tables
echo -e "\n${YELLOW}Verifying tables...${NC}"

TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'")

echo -e "${GREEN}✓ Tables created: $TABLE_COUNT${NC}"

# Show table list
echo -e "\n${YELLOW}Tables in database:${NC}"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"

# Show countries data
echo -e "\n${YELLOW}Countries in database:${NC}"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as total_countries FROM countries;"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Schema Import Complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "  1. Connect and verify data:"
echo -e "     ${GREEN}psql -h $DB_HOST -U $DB_USER -d $DB_NAME${NC}"
echo -e ""
echo -e "  2. View countries:"
echo -e "     ${GREEN}SELECT * FROM countries LIMIT 10;${NC}"
echo -e ""
echo -e "  3. Setup AppSync data source:"
echo -e "     Host: ${GREEN}$DB_HOST${NC}"
echo -e "     Port: ${GREEN}$DB_PORT${NC}"
echo -e "     Database: ${GREEN}$DB_NAME${NC}"
echo -e ""
echo -e "  4. Create AppSync resolvers for GraphQL queries"
