#!/bin/bash
# RUN THIS AFTER 10 MINUTES

echo "⏳ Waiting for Aurora cluster to be created..."
echo ""

# Check status
aws cloudformation describe-stacks \
  --stack-name beauzead-aurora-free \
  --region us-east-1 \
  --query 'Stacks[0].[StackStatus,StackName]' \
  --output text

echo ""
echo "Current status shown above. Wait until it says: CREATE_COMPLETE"
echo ""
echo "When ready, get your endpoint with:"
echo ""
echo "aws cloudformation describe-stacks --stack-name beauzead-aurora-free --region us-east-1 --query 'Stacks[0].Outputs[0].OutputValue' --output text"
