/**
 * Stripe Webhook Handler
 * 
 * AWS Lambda function to handle Stripe Connect webhook events
 * for account status updates.
 * 
 * Deploy this as a Lambda function and configure the webhook endpoint
 * in your Stripe Dashboard: https://dashboard.stripe.com/webhooks
 * 
 * Events to subscribe to:
 * - account.updated
 * - account.application.authorized
 * - account.application.deauthorized
 * - capability.updated
 * 
 * NOTE: This file requires Node.js environment and dependencies:
 * - aws-sdk (or @aws-sdk/client-dynamodb for v3)
 * - @types/node
 * 
 * Install before deployment:
 * npm install aws-sdk @types/node
 */

// @ts-nocheck - Lambda runtime dependencies
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const SELLERS_TABLE = process.env.SELLERS_TABLE_NAME || 'sellers';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

interface LambdaEvent {
  headers: Record<string, string>;
  body: string;
}

interface LambdaResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

/**
 * Verify Stripe webhook signature
 */
const verifyStripeSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    // In production, use Stripe's SDK to verify signature
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // stripe.webhooks.constructEvent(payload, signature, secret);
    
    // For now, simple check (REPLACE WITH PROPER VERIFICATION IN PRODUCTION)
    if (!signature || !secret) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
};

/**
 * Map Stripe account status to KYC status
 */
const mapStripeStatusToKYC = (account: any): string => {
  if (account.requirements?.disabled_reason) {
    return 'restricted';
  }
  
  if (account.requirements?.currently_due?.length > 0) {
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

/**
 * Update seller in DynamoDB
 */
const updateSellerStatus = async (
  stripeAccountId: string,
  updates: Record<string, any>
): Promise<boolean> => {
  try {
    // Find seller by Stripe account ID
    const queryParams = {
      TableName: SELLERS_TABLE,
      IndexName: 'stripe_account_id-index', // Ensure this GSI exists
      KeyConditionExpression: 'stripe_account_id = :accountId',
      ExpressionAttributeValues: {
        ':accountId': stripeAccountId,
      },
    };

    const queryResult = await dynamoDB.query(queryParams).promise();

    if (!queryResult.Items || queryResult.Items.length === 0) {
      console.warn('Seller not found for Stripe account:', stripeAccountId);
      return false;
    }

    const seller = queryResult.Items[0];

    // Update seller
    const updateParams = {
      TableName: SELLERS_TABLE,
      Key: {
        id: seller.id,
      },
      UpdateExpression: 'SET #kyc = :kyc, #payouts = :payouts, #charges = :charges, #updated = :updated, #onboarding = :onboarding',
      ExpressionAttributeNames: {
        '#kyc': 'kyc_status',
        '#payouts': 'payouts_enabled',
        '#charges': 'charges_enabled',
        '#updated': 'kyc_last_update',
        '#onboarding': 'stripe_onboarding_completed',
      },
      ExpressionAttributeValues: {
        ':kyc': updates.kyc_status,
        ':payouts': updates.payouts_enabled,
        ':charges': updates.charges_enabled,
        ':updated': new Date().toISOString(),
        ':onboarding': updates.stripe_onboarding_completed,
      },
    };

    await dynamoDB.update(updateParams).promise();
    
    console.log('Seller status updated:', {
      sellerId: seller.id,
      stripeAccountId,
      kycStatus: updates.kyc_status,
    });

    return true;
  } catch (error) {
    console.error('Failed to update seller status:', error);
    return false;
  }
};

/**
 * Handle account.updated event
 */
const handleAccountUpdated = async (account: any): Promise<void> => {
  const stripeAccountId = account.id;
  
  const updates = {
    kyc_status: mapStripeStatusToKYC(account),
    payouts_enabled: account.payouts_enabled || false,
    charges_enabled: account.charges_enabled || false,
    stripe_onboarding_completed: account.details_submitted || false,
  };

  await updateSellerStatus(stripeAccountId, updates);
};

/**
 * Handle capability.updated event
 */
const handleCapabilityUpdated = async (capability: any): Promise<void> => {
  const stripeAccountId = capability.account;
  
  // Fetch full account details to get complete status
  // In production, you'd make an API call to Stripe here
  // For now, just trigger a status update based on capability status
  
  console.log('Capability updated:', {
    account: stripeAccountId,
    capability: capability.id,
    status: capability.status,
  });
  
  // Get current account details and update
  // This would require calling Stripe API
};

/**
 * Main Lambda handler
 */
export const handler = async (event: LambdaEvent): Promise<LambdaResponse> => {
  console.log('Stripe webhook received');

  try {
    // Verify signature
    const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    
    if (!verifyStripeSignature(event.body, signature, STRIPE_WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    // Parse webhook event
    const stripeEvent: StripeWebhookEvent = JSON.parse(event.body);
    
    console.log('Processing Stripe event:', {
      id: stripeEvent.id,
      type: stripeEvent.type,
    });

    // Handle different event types
    switch (stripeEvent.type) {
      case 'account.updated':
        await handleAccountUpdated(stripeEvent.data.object);
        break;

      case 'account.application.authorized':
        console.log('Account authorized:', stripeEvent.data.object.id);
        await handleAccountUpdated(stripeEvent.data.object);
        break;

      case 'account.application.deauthorized':
        console.log('Account deauthorized:', stripeEvent.data.object.id);
        // Handle deauthorization (optional)
        break;

      case 'capability.updated':
        await handleCapabilityUpdated(stripeEvent.data.object);
        break;

      default:
        console.log('Unhandled event type:', stripeEvent.type);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

export default handler;
