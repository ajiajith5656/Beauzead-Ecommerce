/**
 * Lambda Function: Calculate Seller Analytics
 * 
 * Calculates real-time analytics for a seller including:
 * - Total sales and revenue
 * - Order count and average order value
 * - Status breakdown (new, processing, shipped, delivered, cancelled)
 * - Earnings (with platform fee deducted)
 * - Conversion metrics
 * 
 * Input:
 *   - sellerId: string
 *   - period?: 'today' | 'week' | 'month' | 'all' (default: 'all')
 * 
 * Output:
 *   - totalSales: number
 *   - totalRevenue: number (in cents)
 *   - totalOrders: number
 *   - averageOrderValue: number (in cents)
 *   - netEarnings: number (after 10% platform fee)
 *   - ordersByStatus: { new, processing, shipped, delivered, cancelled, returned }
 *   - topProducts: array
 *   - salesTrend: array (if period specified)
 */

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || 'Orders';
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE_NAME || 'Products';
const PLATFORM_FEE_PERCENTAGE = 10; // 10% platform fee

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const sellerId = event.arguments.input?.sellerId || event.sellerId || event.seller_id;
  const period = event.arguments.input?.period || event.period || 'all';

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
      }
    }).promise();

    const orders = ordersResult.Items || [];

    if (orders.length === 0) {
      return {
        success: true,
        analytics: {
          totalSales: 0,
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          netEarnings: 0,
          ordersByStatus: {
            new: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
            returned: 0
          },
          topProducts: [],
          revenueByStatus: {
            delivered: 0,
            processing: 0,
            cancelled: 0
          }
        }
      };
    }

    // Filter by period if specified
    let filteredOrders = orders;
    if (period !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(now.getDate() - 30);
          break;
      }

      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate;
      });
    }

    // Calculate analytics
    let totalRevenue = 0;
    const ordersByStatus = {
      new: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0
    };
    const revenueByStatus = {
      delivered: 0,
      processing: 0,
      cancelled: 0
    };
    const productSales = {};

    filteredOrders.forEach(order => {
      const orderTotal = order.total_amount || 0;
      
      // Track by status
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;

      // Track revenue by status
      if (order.status === 'delivered') {
        revenueByStatus.delivered += orderTotal;
        totalRevenue += orderTotal;
      } else if (order.status === 'processing' || order.status === 'shipped') {
        revenueByStatus.processing += orderTotal;
        totalRevenue += orderTotal;
      } else if (order.status === 'cancelled' || order.status === 'returned') {
        revenueByStatus.cancelled += orderTotal;
      }

      // Track product sales
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productId = item.product_id;
          if (!productSales[productId]) {
            productSales[productId] = {
              productId,
              name: item.product_name,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity || 1;
          productSales[productId].revenue += item.price * (item.quantity || 1);
        });
      }
    });

    // Get top products
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate earnings with platform fee
    const grossEarnings = totalRevenue;
    const platformFee = Math.round(grossEarnings * (PLATFORM_FEE_PERCENTAGE / 100));
    const netEarnings = grossEarnings - platformFee;
    const averageOrderValue = filteredOrders.length > 0 
      ? Math.round(totalRevenue / filteredOrders.length) 
      : 0;

    return {
      success: true,
      analytics: {
        totalSales: filteredOrders.length,
        totalRevenue: grossEarnings,
        totalOrders: filteredOrders.length,
        averageOrderValue,
        netEarnings,
        platformFeeDeducted: platformFee,
        platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
        ordersByStatus,
        revenueByStatus,
        topProducts,
        period
      }
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
};
