/**
 * Lambda Function: Get Seller Wallet Transactions
 * 
 * Retrieves complete transaction history for seller wallet
 * including credits (orders), debits (fees, withdrawals), and refunds
 * 
 * Input:
 *   - sellerId: string
 *   - limit?: number (default: 50)
 *   - nextToken?: string (for pagination)
 * 
 * Output:
 *   - transactions: array of {
 *       id, type, amount, description, status, date, orderId
 *     }
 *   - nextToken?: string (if more results available)
 *   - totalTransactions: number
 */

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || 'Orders';
const PLATFORM_FEE_PERCENTAGE = 10; // 10% platform fee

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const sellerId = event.arguments.input?.sellerId || event.sellerId || event.seller_id;
  const limit = event.arguments.input?.limit || event.limit || 50;
  const nextToken = event.arguments.input?.nextToken || event.nextToken;

  if (!sellerId) {
    return {
      success: false,
      error: 'Missing required field: sellerId'
    };
  }

  try {
    // Get all orders for seller
    const ordersResult = await dynamoDb.query({
      TableName: ORDERS_TABLE,
      IndexName: 'seller_id-created_at-index',
      KeyConditionExpression: 'seller_id = :sellerId',
      ExpressionAttributeValues: {
        ':sellerId': sellerId
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit
    }).promise();

    const orders = ordersResult.Items || [];
    const transactions = [];
    let runningBalance = 0;

    orders.forEach((order, index) => {
      const orderTotal = order.total_amount || 0;
      const platformFee = Math.round(orderTotal * (PLATFORM_FEE_PERCENTAGE / 100));
      const netAmount = orderTotal - platformFee;

      // Transaction 1: Order Credit
      if (order.status === 'delivered' || order.status === 'processing' || order.status === 'shipped') {
        transactions.push({
          id: `${order.id}-credit`,
          type: 'credit',
          amount: netAmount,
          grossAmount: orderTotal,
          platformFee,
          description: `Order ${order.order_number} - ${order.status}`,
          status: order.status === 'delivered' ? 'completed' : 'pending',
          date: order.created_at,
          orderId: order.id,
          orderNumber: order.order_number,
          timestamp: new Date(order.created_at).getTime()
        });
        runningBalance += netAmount;
      }

      // Transaction 2: Refund (if cancelled/returned)
      if (order.status === 'cancelled' || order.status === 'returned') {
        transactions.push({
          id: `${order.id}-refund`,
          type: 'refund',
          amount: -orderTotal,
          description: `Order ${order.order_number} - ${order.status}`,
          status: 'completed',
          date: order.updated_at || order.created_at,
          orderId: order.id,
          orderNumber: order.order_number,
          timestamp: new Date(order.updated_at || order.created_at).getTime()
        });
        runningBalance -= orderTotal;
      }
    });

    // Sort by timestamp descending (most recent first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);

    // Calculate cumulative balance in reverse (oldest to newest) then reverse
    let cumulativeBalance = 0;
    const reversedTransactions = [...transactions].reverse();
    reversedTransactions.forEach(transaction => {
      cumulativeBalance = (cumulativeBalance || 0) + transaction.amount;
      transaction.balance = cumulativeBalance;
    });

    // Return in original order with balance
    const finalTransactions = reversedTransactions.reverse();

    return {
      success: true,
      transactions: finalTransactions,
      totalTransactions: finalTransactions.length,
      currentBalance: runningBalance,
      nextToken: ordersResult.LastEvaluatedKey ? JSON.stringify(ordersResult.LastEvaluatedKey) : null
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
};
