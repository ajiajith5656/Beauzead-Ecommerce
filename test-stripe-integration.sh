#!/bin/bash

# Stripe Connect KYC Integration Test Script
# Tests the deployed backend infrastructure

API_GATEWAY_URL="https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook"
REGION="us-east-1"

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║       Stripe Connect KYC Integration Test Suite                 ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    echo -n "Testing: $test_name... "
    
    result=$(eval "$test_command" 2>&1)
    exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        if [ -n "$expected_result" ]; then
            if echo "$result" | grep -q "$expected_result"; then
                echo -e "${GREEN}✓ PASSED${NC}"
                TESTS_PASSED=$((TESTS_PASSED + 1))
            else
                echo -e "${RED}✗ FAILED${NC}"
                echo "  Expected: $expected_result"
                echo "  Got: $result"
                TESTS_FAILED=$((TESTS_FAILED + 1))
            fi
        else
            echo -e "${GREEN}✓ PASSED${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        fi
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Error: $result"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Infrastructure Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: DynamoDB Table Exists
run_test "DynamoDB Sellers table exists" \
    "aws dynamodb describe-table --table-name Sellers --region $REGION --no-cli-pager --output json > /dev/null 2>&1" \
    ""

# Test 2: GSI Exists and ACTIVE
run_test "DynamoDB GSI stripe_account_id-index is ACTIVE" \
    "aws dynamodb describe-table --table-name Sellers --region $REGION --no-cli-pager --output json | jq -r '.Table.GlobalSecondaryIndexes[0].IndexStatus'" \
    "ACTIVE"

# Test 3: Lambda Functions Exist
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Lambda Functions Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

LAMBDA_FUNCTIONS=(
    "BeauzeadStripeWebhook"
    "BeauzeadStripeCreateAccount"
    "BeauzeadStripeOnboardingLink"
    "BeauzeadStripeGetStatus"
    "BeauzeadStripeRefreshStatus"
)

for func in "${LAMBDA_FUNCTIONS[@]}"; do
    run_test "Lambda function $func exists" \
        "aws lambda get-function --function-name $func --region $REGION --no-cli-pager > /dev/null 2>&1" \
        ""
done

# Test 4: API Gateway
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. API Gateway Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "API Gateway is reachable" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST $API_GATEWAY_URL" \
    "401"

echo -e "${YELLOW}Note: 401 is expected (webhook signature required)${NC}"

# Test 5: Check Lambda Environment Variables
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Configuration Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Stripe keys are still placeholders
WEBHOOK_VARS=$(aws lambda get-function-configuration --function-name BeauzeadStripeWebhook --region $REGION --no-cli-pager 2>/dev/null | jq -r '.Environment.Variables.STRIPE_SECRET_KEY')

if [[ "$WEBHOOK_VARS" == *"placeholder"* ]]; then
    echo -e "${YELLOW}⚠ WARNING: Stripe API keys are still placeholders${NC}"
    echo "  Run: ./update-stripe-keys.sh <your_keys>"
    TESTS_FAILED=$((TESTS_FAILED + 1))
else
    echo -e "${GREEN}✓ Stripe API keys configured${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
fi

# Test 6: IAM Role
echo ""
run_test "IAM Role exists" \
    "aws iam get-role --role-name BeauzeadStripeConnectLambdaRole --region $REGION --no-cli-pager > /dev/null 2>&1" \
    ""

# Test 7: CloudWatch Log Groups
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Logging Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "CloudWatch log group for webhook exists" \
    "aws logs describe-log-groups --log-group-name-prefix /aws/lambda/BeauzeadStripeWebhook --region $REGION --no-cli-pager > /dev/null 2>&1" \
    ""

# Summary
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                        Test Summary                              ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All infrastructure tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update Stripe API keys with ./update-stripe-keys.sh"
    echo "2. Configure webhook in Stripe Dashboard:"
    echo "   URL: $API_GATEWAY_URL"
    echo "3. Update AppSync schema (see STRIPE_DEPLOYMENT_COMPLETE.md)"
    echo "4. Test end-to-end flow from frontend"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Check the output above.${NC}"
    exit 1
fi
