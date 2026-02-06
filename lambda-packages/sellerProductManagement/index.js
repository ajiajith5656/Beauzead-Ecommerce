/**
 * Lambda Function: Seller Product Management
 * 
 * Handles seller product operations (create, update, delete)
 * Validates seller ownership for update/delete operations
 * 
 * Input:
 *   - action: 'create' | 'update' | 'delete'
 *   - sellerId: string
 *   - product: { ...product data } (for create/update)
 *   - productId: string (for update/delete)
 * 
 * Output:
 *   - success: boolean
 *   - product?: { ...updated product }
 *   - error?: string
 */

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE_NAME || 'Products';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { action, sellerId, product, productId } = event.arguments.input || event;

  // Validate input
  if (!action || !sellerId) {
    return {
      success: false,
      error: 'Missing required fields: action, sellerId'
    };
  }

  if (!['create', 'update', 'delete'].includes(action)) {
    return {
      success: false,
      error: `Invalid action: ${action}. Valid actions are: create, update, delete`
    };
  }

  try {
    if (action === 'create') {
      // Create new product
      if (!product) {
        return {
          success: false,
          error: 'Product data required for create action'
        };
      }

      const newProduct = {
        id: uuidv4(),
        seller_id: sellerId,
        ...product,
        approval_status: 'pending', // New products require admin approval
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };

      await dynamoDb.put({
        TableName: PRODUCTS_TABLE,
        Item: newProduct
      }).promise();

      return {
        success: true,
        product: newProduct
      };

    } else if (action === 'update') {
      // Update existing product
      if (!productId || !product) {
        return {
          success: false,
          error: 'productId and product data required for update action'
        };
      }

      // Verify seller owns this product
      const getResult = await dynamoDb.get({
        TableName: PRODUCTS_TABLE,
        Key: { id: productId }
      }).promise();

      if (!getResult.Item) {
        return {
          success: false,
          error: `Product not found: ${productId}`
        };
      }

      if (getResult.Item.seller_id !== sellerId) {
        return {
          success: false,
          error: 'Unauthorized: This product does not belong to this seller'
        };
      }

      // Build update expression
      const updateData = {
        ...product,
        updated_at: new Date().toISOString(),
        updatedAt: new Date().getTime()
      };

      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.entries(updateData).forEach(([key, value]) => {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      });

      const updateResult = await dynamoDb.update({
        TableName: PRODUCTS_TABLE,
        Key: { id: productId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      }).promise();

      return {
        success: true,
        product: updateResult.Attributes
      };

    } else if (action === 'delete') {
      // Soft delete (mark as inactive)
      if (!productId) {
        return {
          success: false,
          error: 'productId required for delete action'
        };
      }

      // Verify seller owns this product
      const getResult = await dynamoDb.get({
        TableName: PRODUCTS_TABLE,
        Key: { id: productId }
      }).promise();

      if (!getResult.Item) {
        return {
          success: false,
          error: `Product not found: ${productId}`
        };
      }

      if (getResult.Item.seller_id !== sellerId) {
        return {
          success: false,
          error: 'Unauthorized: This product does not belong to this seller'
        };
      }

      // Soft delete - mark as inactive
      const deleteResult = await dynamoDb.update({
        TableName: PRODUCTS_TABLE,
        Key: { id: productId },
        UpdateExpression: 'SET is_active = :false, updated_at = :updated, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':false': false,
          ':updated': new Date().toISOString(),
          ':updatedAt': new Date().getTime()
        },
        ReturnValues: 'ALL_NEW'
      }).promise();

      return {
        success: true,
        product: deleteResult.Attributes
      };
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
};
