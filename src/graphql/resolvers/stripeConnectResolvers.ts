/**
 * AppSync GraphQL Resolvers for Stripe Connect KYC Operations
 * 
 * Add these resolvers to your AppSync API schema
 * 
 * NOTE: This file requires Node.js Lambda environment and dependencies:
 * - stripe (npm package)
 * - aws-sdk (or @aws-sdk/client-dynamodb for v3)
 * - @types/node
 * 
 * Install before deployment:
 * npm install stripe aws-sdk @types/node
 */

// @ts-nocheck - Lambda runtime dependencies

// ==========================================
// GRAPHQL SCHEMA
// ==========================================

/*
type Mutation {
  createStripeConnectAccount(input: CreateStripeConnectAccountInput!): StripeConnectAccountResponse
  generateStripeOnboardingLink(input: GenerateOnboardingLinkInput!): StripeOnboardingLinkResponse
  refreshStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

type Query {
  getStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

input CreateStripeConnectAccountInput {
  sellerId: String!
  email: String!
  country: String!
  businessType: String
}

input GenerateOnboardingLinkInput {
  sellerId: String!
  accountId: String!
  returnUrl: String!
  refreshUrl: String!
}

type StripeConnectAccountResponse {
  success: Boolean!
  accountId: String
  error: String
}

type StripeOnboardingLinkResponse {
  success: Boolean!
  url: String
  error: String
}

type StripeAccountStatusResponse {
  success: Boolean!
  accountId: String
  detailsSubmitted: Boolean
  chargesEnabled: Boolean
  payoutsEnabled: Boolean
  kycStatus: String
  requirementsCurrentlyDue: [String]
  disabled: Boolean
  error: String
}
*/

// ==========================================
// VTL REQUEST TEMPLATE - createStripeConnectAccount
// ==========================================

/*
File: createStripeConnectAccount-request.vtl

{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "field": "createStripeConnectAccount",
    "arguments": $util.toJson($context.arguments)
  }
}
*/

// ==========================================
// VTL RESPONSE TEMPLATE - createStripeConnectAccount
// ==========================================

/*
File: createStripeConnectAccount-response.vtl

$util.toJson($context.result)
*/

// ==========================================
// LAMBDA FUNCTION - createStripeConnectAccount
// ==========================================

import Stripe from 'stripe';
import { DynamoDB } from 'aws-sdk';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const dynamoDB = new DynamoDB.DocumentClient();
const SELLERS_TABLE = process.env.SELLERS_TABLE_NAME || 'sellers';

interface CreateAccountInput {
  sellerId: string;
  email: string;
  country: string;
  businessType?: 'individual' | 'company';
}

export const createStripeConnectAccountHandler = async (event: any) => {
  const input: CreateAccountInput = event.arguments?.input || event;

  try {
    console.log('Creating Stripe Connect account', { sellerId: input.sellerId });

    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: input.country,
      email: input.email,
      business_type: input.businessType || 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Update seller in DynamoDB
    await dynamoDB.update({
      TableName: SELLERS_TABLE,
      Key: { id: input.sellerId },
      UpdateExpression: 'SET stripe_account_id = :accountId, stripe_account_type = :type, updated_at = :now',
      ExpressionAttributeValues: {
        ':accountId': account.id,
        ':type': 'express',
        ':now': new Date().toISOString(),
      },
    }).promise();

    console.log('Stripe account created', { accountId: account.id });

    return {
      success: true,
      accountId: account.id,
    };
  } catch (error: any) {
    console.error('Failed to create Stripe account:', error);
    return {
      success: false,
      error: error.message || 'Failed to create Stripe account',
    };
  }
};

// ==========================================
// LAMBDA FUNCTION - generateStripeOnboardingLink
// ==========================================

interface GenerateOnboardingInput {
  sellerId: string;
  accountId: string;
  returnUrl: string;
  refreshUrl: string;
}

export const generateStripeOnboardingLinkHandler = async (event: any) => {
  const input: GenerateOnboardingInput = event.arguments?.input || event;

  try {
    console.log('Generating onboarding link', { accountId: input.accountId });

    // Create account link
    const accountLink = await stripe.accountLinks.create({
      account: input.accountId,
      refresh_url: input.refreshUrl,
      return_url: input.returnUrl,
      type: 'account_onboarding',
    });

    console.log('Onboarding link created', { expiresAt: accountLink.expires_at });

    return {
      success: true,
      url: accountLink.url,
    };
  } catch (error: any) {
    console.error('Failed to generate onboarding link:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate onboarding link',
    };
  }
};

// ==========================================
// LAMBDA FUNCTION - getStripeAccountStatus
// ==========================================

const mapStripeStatusToKYC = (account: Stripe.Account): string => {
  if (account.requirements?.disabled_reason) {
    return 'restricted';
  }
  
  if ((account.requirements?.currently_due || []).length > 0) {
    return 'action_required';
  }
  
  if (account.charges_enabled && account.payouts_enabled) {
    return 'verified';
  }
  
  if (account.details_submitted) {
    return 'pending';
  }
  
  return 'pending';
};

export const getStripeAccountStatusHandler = async (event: any) => {
  const accountId = event.arguments?.accountId || event.accountId;

  try {
    console.log('Fetching account status', { accountId });

    // Retrieve account from Stripe
    const account = await stripe.accounts.retrieve(accountId);

    const status = {
      success: true,
      accountId: account.id,
      detailsSubmitted: account.details_submitted || false,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      kycStatus: mapStripeStatusToKYC(account),
      requirementsCurrentlyDue: account.requirements?.currently_due || [],
      disabled: !!account.requirements?.disabled_reason,
    };

    console.log('Account status retrieved', status);

    return status;
  } catch (error: any) {
    console.error('Failed to get account status:', error);
    return {
      success: false,
      error: error.message || 'Failed to get account status',
    };
  }
};

// ==========================================
// LAMBDA FUNCTION - refreshStripeAccountStatus
// ==========================================

export const refreshStripeAccountStatusHandler = async (event: any) => {
  const accountId = event.arguments?.accountId || event.accountId;

  try {
    console.log('Refreshing account status', { accountId });

    // Get status from Stripe
    const statusResult = await getStripeAccountStatusHandler({ accountId });

    if (!statusResult.success) {
      return statusResult;
    }

    // Find seller by Stripe account ID
    const queryResult = await dynamoDB.query({
      TableName: SELLERS_TABLE,
      IndexName: 'stripe_account_id-index',
      KeyConditionExpression: 'stripe_account_id = :accountId',
      ExpressionAttributeValues: {
        ':accountId': accountId,
      },
    }).promise();

    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new Error('Seller not found');
    }

    const seller = queryResult.Items[0];

    // Update seller in DynamoDB
    await dynamoDB.update({
      TableName: SELLERS_TABLE,
      Key: { id: seller.id },
      UpdateExpression: 'SET kyc_status = :kyc, payouts_enabled = :payouts, charges_enabled = :charges, stripe_onboarding_completed = :completed, kyc_last_update = :updated',
      ExpressionAttributeValues: {
        ':kyc': statusResult.kycStatus,
        ':payouts': statusResult.payoutsEnabled,
        ':charges': statusResult.chargesEnabled,
        ':completed': statusResult.detailsSubmitted,
        ':updated': new Date().toISOString(),
      },
    }).promise();

    console.log('Seller status updated in DynamoDB');

    return statusResult;
  } catch (error: any) {
    console.error('Failed to refresh account status:', error);
    return {
      success: false,
      error: error.message || 'Failed to refresh account status',
    };
  }
};

// ==========================================
// EXPORT ALL HANDLERS
// ==========================================

export default {
  createStripeConnectAccount: createStripeConnectAccountHandler,
  generateStripeOnboardingLink: generateStripeOnboardingLinkHandler,
  getStripeAccountStatus: getStripeAccountStatusHandler,
  refreshStripeAccountStatus: refreshStripeAccountStatusHandler,
};
