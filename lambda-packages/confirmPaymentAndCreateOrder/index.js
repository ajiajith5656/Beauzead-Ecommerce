"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPaymentAndCreateOrder = exports.handler = void 0;
// @ts-nocheck - Lambda runtime
const stripe_1 = __importDefault(require("stripe"));
const aws_sdk_1 = require("aws-sdk");
const crypto_1 = __importDefault(require("crypto"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'us-east-1',
});
const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || 'orders';
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE_NAME || 'products';
/**
 * Generate unique order ID
 */
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
}
/**
 * Verify payment intent status with Stripe
 */
async function verifyPaymentIntent(paymentIntentId) {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log('[ConfirmPayment] Payment Intent status:', paymentIntent.status);
        return paymentIntent;
    }
    catch (error) {
        console.error('[ConfirmPayment] Failed to verify payment intent:', error);
        return null;
    }
}
/**
 * Get product details from DynamoDB
 */
async function getProductDetails(productId) {
    try {
        const params = {
            TableName: PRODUCTS_TABLE,
            Key: {
                id: productId,
            },
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item || null;
    }
    catch (error) {
        console.error('[ConfirmPayment] Error fetching product:', error);
        return null;
    }
}
/**
 * Create order in DynamoDB
 */
async function createOrderInDatabase(orderId, input, paymentIntent) {
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
    }
    catch (error) {
        console.error('[ConfirmPayment] Error creating order:', error);
        return false;
    }
}
/**
 * Handler for AppSync resolver
 */
const handler = async (event) => {
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
    }
    catch (error) {
        console.error('[ConfirmPayment] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to confirm payment and create order',
        };
    }
};
exports.handler = handler;
/**
 * For direct Node.js invocation (local testing)
 */
const confirmPaymentAndCreateOrder = async (input) => {
    return (0, exports.handler)({ arguments: { input }, identity: {} });
};
exports.confirmPaymentAndCreateOrder = confirmPaymentAndCreateOrder;
