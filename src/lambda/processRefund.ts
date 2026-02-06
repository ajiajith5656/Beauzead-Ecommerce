/**
 * Lambda Function: Process Refund
 * 
 * Processes refunds for orders through Stripe.
 * Admin-only operation called from order management.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Stripe API secret key
 * - ORDERS_TABLE_NAME: DynamoDB orders table name
 * 
 * Input: ProcessRefundInput
 *   - orderId: string
 *   - paymentIntentId: string
 *   - amount?: number (partial refund amount in cents)
 *   - reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'abandoned'
 *   - notes?: string
 * 
 * Output: ProcessRefundResponse
 *   - success: boolean
 *   - refundId?: string
 *   - status?: string
 *   - amount?: number
 *   - error?: string
 */

// @ts-nocheck - Lambda runtime
import Stripe from 'stripe';
import { DynamoDB } from 'aws-sdk';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const dynamoDb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || 'orders';

type RefundReason = 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'abandoned';

interface ProcessRefundInput {
  orderId: string;
  paymentIntentId: string;
  amount?: number;
  reason: RefundReason;
  notes?: string;
}

interface ProcessRefundResponse {
  success: boolean;
  refundId?: string;
  status?: string;
  amount?: number;
  error?: string;
}

interface AppSyncEvent {
  arguments: {
    input: ProcessRefundInput;
  };
  identity: {
    accountId?: string;
    userArn?: string;
  };
}

/**
 * Map reason to Stripe refund reason
 */
function mapReasonToStripe(reason: RefundReason): Stripe.RefundCreateParams.Reason {
  const reasonMap: Record<RefundReason, Stripe.RefundCreateParams.Reason> = {
    duplicate: 'duplicate',
    fraudulent: 'fraudulent',
    requested_by_customer: 'requested_by_customer',
    abandoned: 'abandoned',
  };
  return reasonMap[reason] || 'requested_by_customer';
}

/**
 * Get order from DynamoDB
 */
async function getOrderFromDatabase(orderId: string): Promise<any> {
  try {
    const params = {
      TableName: ORDERS_TABLE,
      Key: {
        id: orderId,
      },
    };

    const result = await dynamoDb.get(params).promise();
    return result.Item || null;
  } catch (error) {
    console.error('[ProcessRefund] Error fetching order:', error);
    return null;
  }
}

/**
 * Update order with refund information
 */
async function updateOrderInDatabase(orderId: string, refundId: string, amount: number): Promise<boolean> {
  try {
    const params = {
      TableName: ORDERS_TABLE,
      Key: { id: orderId },
      UpdateExpression: 'SET payment_status = :ps, refund_id = :rid, refund_amount = :ra, updated_at = :ua',
      ExpressionAttributeValues: {
        ':ps': 'refunded',
        ':rid': refundId,
        ':ra': amount,
        ':ua': new Date().toISOString(),
      },
    };

    await dynamoDb.update(params).promise();
    console.log('[ProcessRefund] Order updated with refund:', orderId);
    return true;
  } catch (error) {
    console.error('[ProcessRefund] Error updating order:', error);
    return false;
  }
}

/**
 * Handler for AppSync resolver
 */
export const handler = async (event: AppSyncEvent): Promise<ProcessRefundResponse> => {
  try {
    const { input } = event.arguments;

    // Validate input
    if (!input.orderId || !input.paymentIntentId || !input.reason) {
      return {
        success: false,
        error: 'Missing required fields: orderId, paymentIntentId, reason',
      };
    }

    console.log('[ProcessRefund] Processing refund for order:', input.orderId);

    // Get order from database
    const order = await getOrderFromDatabase(input.orderId);
    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    // Check if already refunded
    if (order.payment_status === 'refunded') {
      return {
        success: false,
        error: 'Order has already been refunded',
      };
    }

    // Verify payment intent ID matches
    if (order.payment_intent_id !== input.paymentIntentId) {
      return {
        success: false,
        error: 'Payment intent ID does not match order',
      };
    }

    // Calculate refund amount (default: full refund)
    const refundAmount = input.amount || order.total_amount;

    // Validate refund amount
    if (refundAmount <= 0) {
      return {
        success: false,
        error: 'Refund amount must be greater than 0',
      };
    }

    if (refundAmount > order.total_amount) {
      return {
        success: false,
        error: `Refund amount ($${refundAmount / 100}) exceeds order total ($${order.total_amount / 100})`,
      };
    }

    try {
      // Create refund in Stripe
      const refund = await stripe.refunds.create({
        payment_intent: input.paymentIntentId,
        amount: refundAmount,
        reason: mapReasonToStripe(input.reason),
        metadata: {
          orderId: input.orderId,
          notes: input.notes || '',
        },
      });

      console.log('[ProcessRefund] Refund created in Stripe:', refund.id, 'Status:', refund.status);

      // Update order in database
      const orderUpdated = await updateOrderInDatabase(input.orderId, refund.id, refundAmount);

      if (!orderUpdated) {
        console.warn('[ProcessRefund] Failed to update order, but refund was processed:', refund.id);
      }

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount,
      };
    } catch (stripeError: any) {
      console.error('[ProcessRefund] Stripe API error:', stripeError);
      return {
        success: false,
        error: stripeError.message || 'Failed to process refund with Stripe',
      };
    }
  } catch (error: any) {
    console.error('[ProcessRefund] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process refund',
    };
  }
};

/**
 * For direct Node.js invocation (local testing)
 */
export const processRefund = async (input: ProcessRefundInput): Promise<ProcessRefundResponse> => {
  return handler({ arguments: { input }, identity: {} } as AppSyncEvent);
};
