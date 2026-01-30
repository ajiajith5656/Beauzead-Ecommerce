#!/bin/bash

# Beauzead E-commerce Amplify Backend Setup Script
# Run this script to set up Authentication, API, and Storage

echo "🚀 Setting up Amplify Backend for Beauzead E-commerce..."
echo ""

# Step 1: Add Authentication
echo "📧 Step 1/3: Adding Authentication (Cognito)..."
echo "When prompted:"
echo "  1. Choose: Default configuration"
echo "  2. Sign in method: Email"
echo "  3. Advanced settings: No, I am done."
echo ""
read -p "Press ENTER to continue..."
amplify add auth

echo ""
echo "✅ Authentication added!"
echo ""

# Step 2: Add API (GraphQL)
echo "🔌 Step 2/3: Adding API (GraphQL + DynamoDB)..."
echo "When prompted:"
echo "  1. Service: GraphQL"
echo "  2. API name: beauzeadapi"
echo "  3. Authorization: Amazon Cognito User Pool"
echo "  4. Configure additional auth: No"
echo "  5. Schema template: Single object with fields"
echo "  6. Edit schema now: No"
echo ""
read -p "Press ENTER to continue..."
amplify add api

echo ""
echo "✅ API added!"
echo ""

# Step 3: Add Storage (S3)
echo "💾 Step 3/3: Adding Storage (S3 for images/files)..."
echo "When prompted:"
echo "  1. Service: Content (Images, audio, video, etc.)"
echo "  2. Resource name: beauzeadstorage"
echo "  3. Bucket name: (accept default)"
echo "  4. Auth users access: create/update, read, delete"
echo "  5. Guest users access: read"
echo ""
read -p "Press ENTER to continue..."
amplify add storage

echo ""
echo "✅ Storage added!"
echo ""

# Step 4: Check status
echo "📊 Checking Amplify status..."
amplify status

echo ""
echo "🎉 Backend configuration complete!"
echo ""
echo "Next steps:"
echo "  1. Review the configuration above"
echo "  2. Run: amplify push"
echo "  3. This will deploy everything to AWS!"
echo ""
read -p "Do you want to deploy now? (y/n): " deploy

if [[ $deploy == "y" || $deploy == "Y" ]]; then
    echo "🚀 Deploying to AWS..."
    amplify push --yes
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Open Amplify Studio: amplify console"
else
    echo "👍 You can deploy later with: amplify push"
fi
