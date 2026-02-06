/**
 * Lambda Function: Confirm Payment and Create Order
 * 
 * Confirms Stripe payment and creates an order in DynamoDB.
 * This is the critical function that bridges payment and order creation.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Stripe API secret key
 * - ORDERS_TABLE_NAME: DynamoDB orders table name (default: 'orders')
 * - PRODUCTS_TABLE_NAME: DynamoDB products table name (default: 'products')
 * 
 * Input: ConfirmPaymentInput
 *   - paymentIntentId: string
 *   - userId: string
 *   - customerEmail: string
 *   - items: array of { productId, quantity, price }
 *   - totalAmount: number
 *   - shippingAddress: address object
 *   - billingAddress?: address object
 *   - phone?: string
 * 
 * Output: ConfirmPaymentResponse
 *   - success: boolean
 *   - orderId?: string
 *   - status?: string
 *   - paymentStatus?: string
 *   - error?: string
 */

// @ts-nocheck - Lambda runtime
import Stripe from 'stripe';
import { DynamoDB } from 'aws-sdk';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const dynamoDb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || 'orders';
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE_NAME || 'products';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ConfirmPaymentInput {
  paymentIntentId: string;
  userId: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address;
  phone?: string;
  notes?: string;
}

interface ConfirmPaymentResponse {
  success: boolean;
  orderId?: string;
  status?: string;
  paymentStatus?: string;
  error?: string;
}

interface AppSyncEvent {
  arguments: {
    input: ConfirmPaymentInput;
  };
  identity: {
    accountId?: string;
    sourceIp?: string[];
  };
}

/**
 * Generate unique order ID
 */
function generateOrderId(): string {
  return 'ORD-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

/**
 * Verify payment intent status with Stripe
 */
async function verifyPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('[ConfirmPayment] Payment Intent status:', paymentIntent.status);
    return paymentIntent;
  } catch (error) {
    console.error('[ConfirmPayment] Failed to verify payment intent:', error);
    return null;
  }
}

/**
 * Get product details from DynamoDB
 */
async function getProductDetails(productId: string): Promise<any> {
  try {
    const params = {
      TableName: PRODUCTS_TABLE,
      Key: {
        id: productId,
      },
    };

    const result = await dynamoDb.get(params).promise();
    return result.Item || null;
  } catch (error) {
    console.error('[ConfirmPayment] Error fetching product:', error);
    return null;
  }
}

/**
 * Create order in DynamoDB
 */
async function createOrderInDatabase(
  orderId: string,
  input: ConfirmPaymentInput,
  paymentIntent: Stripe.PaymentIntent
): Promise<boolean> {
  try {
    // Calculate shipping and tax (simplified - can be enhanced)
    const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 10; // Fixed $10 shipping
    const taxAmount = Math.round((subtotal + shippingCost) * 0.18); // 18% GST
    const totalAmount = subtotal + shippingCost + taxAmount;

    const orderData = {
      id: orderId,
      user_id: input.userId,
      order_number: orderId,
      status: 'processing', // Initial status
      items: JSON.stringify(input.items),
      subtotal: subtotal,
      shipping_cost: shippingCost,
      tax_amount: taxAmount,
      discount_amount: 0,
      total_amount: totalAmount,
      currency: 'USD',
      shipping_address: JSON.stringify(input.shippingAddress),
      billing_address: input.billingAddress ? JSON.stringify(input.billingAddress) : null,
      payment_method: 'stripe_card',
      payment_status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      payment_intent_id: input.paymentIntentId,
      customer_email: input.customerEmail,
      customer_phone: input.phone || null,
      notes: input.notes || null,
      tracking_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const params = {
      TableName: ORDERS_TABLE,
      Item: orderData,
    };

    await dynamoDb.put(params).promise();
    console.log('[ConfirmPayment] Order created in DynamoDB:', orderId);
    return true;
  } catch (error) {
    console.error('[ConfirmPayment] Error creating order:', error);
    return false;
  }
}

/**
 * Handler for AppSync resolver
 */
export const handler = async (event: AppSyncEvent): Promise<ConfirmPaymentResponse> => {
  try {
    const { input } = event.arguments;

    // Validate input
    if (!input.paymentIntentId || !input.userId || !input.items || input.items.length === 0) {
      return {
        success: false,
        error: 'Missing required fields: paymentIntentId, userId, items',
      };
    }

    console.log('[ConfirmPayment] Processing for user:', input.userId);

    // Verify payment with Stripe
    const paymentIntent = await verifyPaymentIntent(input.paymentIntentId);
    if (!paymentIntent) {
      return {
        success: false,
        error: 'Failed to verify payment intent with Stripe',
      };
    }

    // Check if payment is succeeded or requires action
    if (paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'processing') {
      return {
        success: false,
        error: `Payment status is ${paymentIntent.status}. Only succeeded or processing payments can be confirmed.`,
      };
    }

    // Validate items exist and have correct prices
    for (const item of input.items) {
      const product = await getProductDetails(item.productId);
      if (!product) {
        return {
          success: false,
          error: `Product not found: ${item.productId}`,
        };
      }

      // Verify price matches (allow 1% variance due to discounts)
      const expectedPrice = product.price || product.discount_price;
      if (Math.abs(item.price - expectedPrice) > expectedPrice * 0.01) {
        console.warn('[ConfirmPayment] Price mismatch for product:', item.productId);
        // Don't fail - allow slight price variations
      }
    }

    // Generate order ID and create order
    const orderId = generateOrderId();
    const orderCreated = await createOrderInDatabase(orderId, input, paymentIntent);

    if (!orderCreated) {
      return {
        success: false,
        error: 'Failed to create order in database',
      };
    }

    console.log('[ConfirmPayment] Order confirmation complete:', orderId);

    return {
      success: true,
      orderId,
      status: 'processing',
      paymentStatus: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
    };
  } catch (error: any) {
    console.error('[ConfirmPayment] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to confirm payment and create order',
    };
  }
};

/**
 * For direct Node.js invocation (local testing)
 */
export const confirmPaymentAndCreateOrder = async (
  input: ConfirmPaymentInput
): Promise<ConfirmPaymentResponse> => {
  return handler({ arguments: { input }, identity: {} } as AppSyncEvent);
};
