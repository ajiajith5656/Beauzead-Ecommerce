import { generateClient } from 'aws-amplify/api';
import type { OrderData } from '../types';

const client = generateClient();

interface CreatePaymentIntentResult {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

interface CreateCheckoutResult {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

interface ConfirmPaymentResult {
  success: boolean;
  orderId?: string;
  status?: string;
  error?: string;
}

/**
 * Create a Stripe Payment Intent for a customer order
 */
export const createPaymentIntent = async (
  orderData: {
    customerId: string;
    customerEmail: string;
    customerName: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  }
): Promise<CreatePaymentIntentResult> => {
  try {
    // Amount in cents
    const amountInCents = Math.round(orderData.totalAmount * 100);

    // Use the GraphQL mutation from mutations.js
    const mutation = /* GraphQL */ `
      mutation CreateStripePaymentIntent($input: CreatePaymentIntentInput!) {
        createStripePaymentIntent(input: $input) {
          success
          clientSecret
          paymentIntentId
          status
          amount
          error
        }
      }
    `;

    const variables = {
      input: {
        customerId: orderData.customerId,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          itemCount: orderData.items.length.toString(),
          items: JSON.stringify(orderData.items),
          shippingAddress: JSON.stringify(orderData.shippingAddress),
        },
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      console.error('GraphQL Error:', response.errors);
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to create payment intent',
      };
    }

    const paymentIntent = response.data?.createStripePaymentIntent;
    
    if (!paymentIntent?.success) {
      return {
        success: false,
        error: paymentIntent?.error || 'Failed to create payment intent',
      };
    }

    return {
      success: true,
      clientSecret: paymentIntent?.clientSecret,
      paymentIntentId: paymentIntent?.paymentIntentId,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: `Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Create a checkout session for multi-item orders
 */
export const createCheckoutSession = async (
  orderData: {
    customerId: string;
    customerEmail: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    successUrl: string;
    cancelUrl: string;
  }
): Promise<CreateCheckoutResult> => {
  try {
    const mutation = `
      mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
        createCheckoutSession(input: $input) {
          sessionId
          url
          status
        }
      }
    `;

    const variables = {
      input: {
        customerId: orderData.customerId,
        customerEmail: orderData.customerEmail,
        items: orderData.items,
        successUrl: orderData.successUrl,
        cancelUrl: orderData.cancelUrl,
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to create checkout session',
      };
    }

    const session = response.data?.createCheckoutSession;
    return {
      success: true,
      sessionId: session?.sessionId,
      url: session?.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: `Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Confirm payment and create order
 */
export const confirmPayment = async (
  paymentIntentId: string,
  orderData: {
    customerId: string;
    customerEmail: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    shippingAddress: any;
    billingAddress: any;
    notes?: string;
  }
): Promise<ConfirmPaymentResult> => {
  try {
    const mutation = `
      mutation ConfirmPaymentAndCreateOrder($input: ConfirmPaymentInput!) {
        confirmPaymentAndCreateOrder(input: $input) {
          success
          orderId
          status
          paymentStatus
          error
        }
      }
    `;

    // Format address as string
    const addressStr = orderData.shippingAddress
      ? `${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}`
      : '';

    const variables = {
      input: {
        paymentIntentId,
        userId: orderData.userId || orderData.customerId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        address: addressStr,
        phone: '', // Add phone field if available in orderData
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      console.error('GraphQL Error:', response.errors);
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to confirm payment',
      };
    }

    const order = response.data?.confirmPaymentAndCreateOrder;
    
    if (!order?.success) {
      return {
        success: false,
        error: order?.error || 'Failed to confirm payment',
      };
    }

    return {
      success: true,
      orderId: order?.orderId,
      status: order?.status,
    };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return {
      success: false,
      error: `Failed to confirm payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Retrieve payment intent status
 */
export const getPaymentIntentStatus = async (
  paymentIntentId: string
): Promise<{
  status?: string;
  clientSecret?: string;
  amount?: number;
  error?: string;
}> => {
  try {
    const query = `
      query GetPaymentIntent($id: ID!) {
        getPaymentIntent(id: $id) {
          id
          status
          clientSecret
          amount
          currency
        }
      }
    `;

    const response: any = await client.graphql({
      query,
      variables: { id: paymentIntentId },
    });

    if (response.errors) {
      return {
        error: response.errors[0]?.message || 'Failed to fetch payment intent',
      };
    }

    const paymentIntent = response.data?.getPaymentIntent;
    return {
      status: paymentIntent?.status,
      clientSecret: paymentIntent?.clientSecret,
      amount: paymentIntent?.amount,
    };
  } catch (error) {
    console.error('Error fetching payment intent:', error);
    return {
      error: `Failed to fetch payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Create refund for a payment
 */
export const createRefund = async (
  paymentIntentId: string,
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'abandoned'
): Promise<{
  success: boolean;
  refundId?: string;
  status?: string;
  error?: string;
}> => {
  try {
    const mutation = `
      mutation CreateRefund($input: CreateRefundInput!) {
        createRefund(input: $input) {
          success
          refundId
          status
          amount
          error
        }
      }
    `;

    const variables = {
      input: {
        paymentIntentId,
        reason,
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      console.error('GraphQL Error:', response.errors);
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to create refund',
      };
    }

    const refund = response.data?.createRefund;
    
    if (!refund?.success) {
      return {
        success: false,
        error: refund?.error || 'Failed to create refund',
      };
    }

    return {
      success: true,
      refundId: refund?.refundId,
      status: refund?.status,
    };
  } catch (error) {
    console.error('Error creating refund:', error);
    return {
      success: false,
      error: `Failed to create refund: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get customer's order history
 */
export const getCustomerOrders = async (
  customerId: string
): Promise<OrderData[]> => {
  try {
    const query = `
      query GetCustomerOrders($customerId: ID!) {
        listOrders(filter: { customerId: { eq: $customerId } }) {
          items {
            id
            customerId
            totalAmount
            orderStatus
            paymentStatus
            items
            shippingAddress
            createdAt
            updatedAt
          }
        }
      }
    `;

    const response: any = await client.graphql({
      query,
      variables: { customerId },
    });

    if (response.errors) {
      console.error('Error fetching orders:', response.errors);
      return [];
    }

    return response.data?.listOrders?.items || [];
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
};

/**
 * Get order details
 */
export const getOrderDetails = async (
  orderId: string
): Promise<OrderData | null> => {
  try {
    const query = `
      query GetOrder($id: ID!) {
        getOrder(id: $id) {
          id
          customerId
          customerEmail
          totalAmount
          orderStatus
          paymentStatus
          paymentIntentId
          items
          shippingAddress
          billingAddress
          notes
          trackingNumber
          createdAt
          updatedAt
          completedAt
        }
      }
    `;

    const response: any = await client.graphql({
      query,
      variables: { id: orderId },
    });

    if (response.errors) {
      console.error('Error fetching order:', response.errors);
      return null;
    }

    return response.data?.getOrder || null;
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
};

/**
 * Update order status (admin/fulfillment)
 */
export const updateOrderStatus = async (
  orderId: string,
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const mutation = `
      mutation UpdateOrder($input: UpdateOrderInput!) {
        updateOrder(input: $input) {
          id
          orderStatus
          updatedAt
        }
      }
    `;

    const variables = {
      input: {
        id: orderId,
        orderStatus,
        updatedAt: new Date().toISOString(),
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to update order',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: `Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Process refund for an order (admin/support operation)
 */
export const processRefundForOrder = async (
  orderId: string,
  paymentIntentId: string,
  amount?: number,
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'abandoned' = 'requested_by_customer',
  notes?: string
): Promise<{
  success: boolean;
  refundId?: string;
  status?: string;
  amount?: number;
  error?: string;
}> => {
  try {
    const mutation = /* GraphQL */ `
      mutation ProcessRefund($input: ProcessRefundInput!) {
        processRefund(input: $input) {
          success
          refundId
          status
          amount
          error
        }
      }
    `;

    const variables = {
      input: {
        orderId,
        paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason,
        notes,
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      console.error('GraphQL Error:', response.errors);
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to process refund',
      };
    }

    const refundResult = response.data?.processRefund;

    if (!refundResult?.success) {
      return {
        success: false,
        error: refundResult?.error || 'Failed to process refund',
      };
    }

    return {
      success: true,
      refundId: refundResult?.refundId,
      status: refundResult?.status,
      amount: refundResult?.amount,
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    return {
      success: false,
      error: `Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Process seller payout (admin-only operation)
 */
export const processSellerPayout = async (
  sellerId: string,
  startDate?: string,
  endDate?: string,
  forceAmount?: number
): Promise<{
  success: boolean;
  payoutId?: string;
  amount?: number;
  ordersProcessed?: number;
  grossEarnings?: number;
  platformFee?: number;
  netPayout?: number;
  error?: string;
}> => {
  try {
    const mutation = /* GraphQL */ `
      mutation ProcessSellerPayout($input: ProcessPayoutInput!) {
        processSellerPayout(input: $input) {
          success
          payoutId
          amount
          ordersProcessed
          grossEarnings
          platformFee
          netPayout
          error
        }
      }
    `;

    const variables = {
      input: {
        sellerId,
        startDate,
        endDate,
        forceAmount: forceAmount ? Math.round(forceAmount * 100) : undefined,
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      console.error('GraphQL Error:', response.errors);
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to process payout',
      };
    }

    const payoutResult = response.data?.processSellerPayout;

    if (!payoutResult?.success) {
      return {
        success: false,
        error: payoutResult?.error || 'Failed to process payout',
      };
    }

    return {
      success: true,
      payoutId: payoutResult?.payoutId,
      amount: payoutResult?.amount,
      ordersProcessed: payoutResult?.ordersProcessed,
      grossEarnings: payoutResult?.grossEarnings,
      platformFee: payoutResult?.platformFee,
      netPayout: payoutResult?.netPayout,
    };
  } catch (error) {
    console.error('Error processing seller payout:', error);
    return {
      success: false,
      error: `Failed to process payout: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

