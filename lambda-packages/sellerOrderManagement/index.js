/**
 * Lambda Function: Seller Order Management
 * 
 * Handles seller order actions (accept, reject, ship, deliver)
 * Validates seller ownership before allowing updates
 * 
 * Input:
 *   - action: 'accept' | 'reject' | 'ship' | 'deliver'
 *   - orderId: string
 *   - sellerId: string
 *   - trackingNumber?: string (for ship/deliver actions)
 * 
 * Output:
 *   - success: boolean
 *   - order?: {updated order}
 *   - error?: string
 */

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || 'Orders';

// Valid status transitions
const STATUS_TRANSITIONS = {
  accept: { from: 'new', to: 'processing' },
  reject: { from: 'new', to: 'cancelled' },
  ship: { from: 'processing', to: 'shipped' },
  deliver: { from: 'shipped', to: 'delivered' }
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { action, orderId, sellerId, trackingNumber } = event.arguments.input || event;

  // Validate input
  if (!action || !orderId || !sellerId) {
    return {
      success: false,
      error: 'Missing required fields: action, orderId, sellerId'
    };
  }

  if (!STATUS_TRANSITIONS[action]) {
    return {
      success: false,
      error: `Invalid action: ${action}. Valid actions are: ${Object.keys(STATUS_TRANSITIONS).join(', ')}`
    };
  }

  try {
    // Get the order
    const result = await dynamoDb.get({
      TableName: ORDERS_TABLE,
      Key: { id: orderId }
    }).promise();

    if (!result.Item) {
      return {
        success: false,
        error: `Order not found: ${orderId}`
      };
    }

    const order = result.Item;

    // Verify seller owns this order
    if (order.seller_id !== sellerId) {
      return {
        success: false,
        error: 'Unauthorized: This order does not belong to this seller'
      };
    }

    // Validate status transition
    const transition = STATUS_TRANSITIONS[action];
    if (order.status !== transition.from) {
      return {
        success: false,
        error: `Cannot ${action} order. Current status is '${order.status}', expected '${transition.from}'`
      };
    }

    // Build update object
    const updateData = {
      status: transition.to,
      updated_at: new Date().toISOString(),
      updatedAt: new Date().getTime()
    };

    // Add tracking number if provided (for ship/deliver)
    if (trackingNumber && (action === 'ship' || action === 'deliver')) {
      updateData.tracking_number = trackingNumber;
    }

    // Update order status
    const updateResult = await dynamoDb.update({
      TableName: ORDERS_TABLE,
      Key: { id: orderId },
      UpdateExpression: 'SET #status = :status, #updated = :updated, #tracking = :tracking, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updated': 'updated_at',
        '#tracking': 'tracking_number',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':status': updateData.status,
        ':updated': updateData.updated_at,
        ':tracking': trackingNumber || order.tracking_number || '',
        ':updatedAt': updateData.updatedAt
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    return {
      success: true,
      order: updateResult.Attributes
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
};
