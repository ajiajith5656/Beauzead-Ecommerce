"use strict";
/**
 * Lambda Function: Process Seller Payout
 *
 * Processes payouts to sellers for completed orders.
 * This is a manual admin operation that:
 * 1. Calculates earnings from orders for a seller
 * 2. Deducts platform fees (configurable)
 * 3. Transfers funds via Stripe Connect to seller's bank
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Stripe API secret key
 * - ORDERS_TABLE_NAME: DynamoDB orders table name
 * - SELLERS_TABLE_NAME: DynamoDB sellers table name
 * - PLATFORM_FEE_PERCENTAGE: Platform fee percentage (default: 10)
 *
 * Input: ProcessPayoutInput
 *   - sellerId: string
 *   - startDate?: string (ISO format)
 *   - endDate?: string (ISO format)
 *   - forceAmount?: number (override calculated amount in cents)
 *
 * Output: ProcessPayoutResponse
 *   - success: boolean
 *   - payoutId?: string
 *   - amount?: number (payout amount in cents)
 *   - ordersProcessed?: number
 *   - grossEarnings?: number
 *   - platformFee?: number
 *   - netPayout?: number
 *   - error?: string
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSellerPayout = exports.handler = void 0;
// @ts-nocheck - Lambda runtime
const stripe_1 = __importDefault(require("stripe"));
const aws_sdk_1 = require("aws-sdk");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'us-east-1',
});
const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || 'orders';
const SELLERS_TABLE = process.env.SELLERS_TABLE_NAME || 'sellers';
const PLATFORM_FEE_PERCENTAGE = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '10');
/**
 * Get seller from DynamoDB
 */
async function getSellerFromDatabase(sellerId) {
    try {
        const params = {
            TableName: SELLERS_TABLE,
            Key: {
                id: sellerId,
            },
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item || null;
    }
    catch (error) {
        console.error('[ProcessPayout] Error fetching seller:', error);
        return null;
    }
}
/**
 * Get completed orders for seller within date range
 */
async function getSellerOrdersFromDatabase(sellerId, startDate, endDate) {
    try {
        // This is a simplified query - in production, you'd want a GSI on seller_id
        // For now, we'll scan and filter (not recommended for large tables)
        const params = {
            TableName: ORDERS_TABLE,
            FilterExpression: 'seller_id = :sid AND (payment_status = :ps OR #status = :os)',
            ExpressionAttributeValues: {
                ':sid': sellerId,
                ':ps': 'completed',
                ':os': 'delivered',
            },
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        };
        // Add date range filters if provided
        if (startDate || endDate) {
            let dateExpression = [];
            if (startDate) {
                dateExpression.push('created_at >= :startDate');
                params.ExpressionAttributeValues[':startDate'] = startDate;
            }
            if (endDate) {
                dateExpression.push('created_at <= :endDate');
                params.ExpressionAttributeValues[':endDate'] = endDate;
            }
            if (dateExpression.length > 0) {
                params.FilterExpression += ' AND (' + dateExpression.join(' AND ') + ')';
            }
        }
        const result = await dynamoDb.scan(params).promise();
        return result.Items || [];
    }
    catch (error) {
        console.error('[ProcessPayout] Error fetching seller orders:', error);
        return [];
    }
}
/**
 * Create payout record in DynamoDB (ledger/payout history table)
 */
async function recordPayoutInDatabase(sellerId, payoutData) {
    try {
        // You might want to create a separate PayoutHistory table for this
        // For now, we'll just update the seller record with last payout info
        const params = {
            TableName: SELLERS_TABLE,
            Key: { id: sellerId },
            UpdateExpression: 'SET last_payout_id = :lpid, last_payout_amount = :lpa, last_payout_date = :lpd, total_payouts = if_not_exists(total_payouts, :zero) + :one, updated_at = :ua',
            ExpressionAttributeValues: {
                ':lpid': payoutData.payoutId,
                ':lpa': payoutData.amount,
                ':lpd': new Date().toISOString(),
                ':zero': 0,
                ':one': 1,
                ':ua': new Date().toISOString(),
            },
        };
        await dynamoDb.update(params).promise();
        console.log('[ProcessPayout] Payout recorded for seller:', sellerId);
        return true;
    }
    catch (error) {
        console.error('[ProcessPayout] Error recording payout:', error);
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
        if (!input.sellerId) {
            return {
                success: false,
                error: 'Missing required field: sellerId',
            };
        }
        console.log('[ProcessPayout] Processing payout for seller:', input.sellerId);
        // Get seller details
        const seller = await getSellerFromDatabase(input.sellerId);
        if (!seller) {
            return {
                success: false,
                error: 'Seller not found',
            };
        }
        // Check if seller has Stripe Connect account set up
        if (!seller.stripe_account_id) {
            return {
                success: false,
                error: 'Seller does not have a Stripe Connect account set up',
            };
        }
        // Check if seller is enabled for payouts
        if (!seller.payouts_enabled) {
            return {
                success: false,
                error: 'Seller account is not enabled for payouts. Complete KYC verification first.',
            };
        }
        // If force amount is provided, use it
        if (input.forceAmount) {
            if (input.forceAmount <= 0) {
                return {
                    success: false,
                    error: 'Payout amount must be greater than 0',
                };
            }
            const platformFee = Math.round(input.forceAmount * (PLATFORM_FEE_PERCENTAGE / 100));
            const netPayout = input.forceAmount - platformFee;
            try {
                // Create payout in Stripe
                const payout = await stripe.transfers.create({
                    amount: netPayout,
                    currency: 'usd',
                    destination: seller.stripe_account_id,
                    description: `Platform payout for seller ${seller.id}`,
                    metadata: {
                        sellerId: seller.id,
                        grossAmount: input.forceAmount,
                        platformFee: platformFee,
                    },
                });
                // Record payout
                await recordPayoutInDatabase(input.sellerId, {
                    payoutId: payout.id,
                    amount: netPayout,
                    grossEarnings: input.forceAmount,
                    platformFee: platformFee,
                    ordersCount: 0,
                });
                return {
                    success: true,
                    payoutId: payout.id,
                    amount: netPayout,
                    grossEarnings: input.forceAmount,
                    platformFee: platformFee,
                    netPayout: netPayout,
                    ordersProcessed: 0,
                };
            }
            catch (stripeError) {
                return {
                    success: false,
                    error: stripeError.message || 'Failed to create payout in Stripe',
                };
            }
        }
        // Get seller's completed orders
        const orders = await getSellerOrdersFromDatabase(input.sellerId, input.startDate, input.endDate);
        if (orders.length === 0) {
            return {
                success: false,
                error: 'No completed orders found for this seller in the specified period',
            };
        }
        // Calculate gross earnings
        const grossEarnings = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        if (grossEarnings <= 0) {
            return {
                success: false,
                error: 'No earnings to payout',
            };
        }
        // Calculate fees
        const platformFee = Math.round(grossEarnings * (PLATFORM_FEE_PERCENTAGE / 100));
        const netPayout = grossEarnings - platformFee;
        // Stripe requires minimum payout amount (usually $1 = 100 cents)
        if (netPayout < 100) {
            return {
                success: false,
                error: `Payout amount ($${netPayout / 100}) is less than minimum ($1). Accumulate more orders first.`,
            };
        }
        try {
            // Create payout via Stripe Transfer
            const payout = await stripe.transfers.create({
                amount: netPayout,
                currency: 'usd',
                destination: seller.stripe_account_id,
                description: `Seller payout for ${orders.length} orders`,
                metadata: {
                    sellerId: seller.id,
                    ordersCount: orders.length,
                    grossAmount: grossEarnings,
                    platformFee: platformFee,
                },
            });
            console.log('[ProcessPayout] Payout created in Stripe:', payout.id);
            // Record payout in database
            const recorded = await recordPayoutInDatabase(input.sellerId, {
                payoutId: payout.id,
                amount: netPayout,
                grossEarnings: grossEarnings,
                platformFee: platformFee,
                ordersCount: orders.length,
            });
            if (!recorded) {
                console.warn('[ProcessPayout] Failed to record payout in DB, but Stripe transfer succeeded:', payout.id);
            }
            return {
                success: true,
                payoutId: payout.id,
                amount: netPayout,
                grossEarnings: grossEarnings,
                platformFee: platformFee,
                netPayout: netPayout,
                ordersProcessed: orders.length,
            };
        }
        catch (stripeError) {
            console.error('[ProcessPayout] Stripe API error:', stripeError);
            return {
                success: false,
                error: stripeError.message || 'Failed to create payout in Stripe',
            };
        }
    }
    catch (error) {
        console.error('[ProcessPayout] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to process payout',
        };
    }
};
exports.handler = handler;
/**
 * For direct Node.js invocation (local testing)
 */
const processSellerPayout = async (input) => {
    return (0, exports.handler)({ arguments: { input }, identity: {} });
};
exports.processSellerPayout = processSellerPayout;
