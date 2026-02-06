/**
 * Lambda Function: Create Stripe Payment Intent
 * 
 * Creates a Stripe Payment Intent for order checkout.
 * Called during checkout to initialize payment processing.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Stripe API secret key
 * 
 * Input: CreatePaymentIntentInput
 *   - customerId: string
 *   - customerEmail: string
 *   - customerName: string
 *   - amount: number (in cents)
 *   - currency: string (default: 'usd')
 *   - metadata: { [key: string]: string }
 * 
 * Output: CreatePaymentIntentResponse
 *   - success: boolean
 *   - clientSecret?: string (for frontend)
 *   - paymentIntentId?: string (for backend)
 *   - status?: string
 *   - amount?: number
 *   - error?: string
 */

// @ts-nocheck - Lambda runtime
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

interface CreatePaymentIntentInput {
  customerId: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  currency?: string;
  metadata?: { [key: string]: string };
}

interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  status?: string;
  amount?: number;
  error?: string;
}

interface AppSyncEvent {
  arguments: {
    input: CreatePaymentIntentInput;
  };
  identity: {
    accountId?: string;
    userArn?: string;
  };
}

/**
 * Handler for AppSync resolver
 */
export const handler = async (event: AppSyncEvent): Promise<CreatePaymentIntentResponse> => {
  try {
    const { input } = event.arguments;

    // Validate input
    if (!input.customerId || !input.customerEmail || !input.amount) {
      return {
        success: false,
        error: 'Missing required fields: customerId, customerEmail, amount',
      };
    }

    if (input.amount < 50) {
      return {
        success: false,
        error: 'Amount must be at least $0.50 (50 cents)',
      };
    }

    console.log('[PaymentIntent] Creating for customer:', input.customerId, 'Amount:', input.amount);

    // Create or retrieve customer
    let customer;
    try {
      // Try to find existing customer
      const customers = await stripe.customers.list({
        email: input.customerEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
        console.log('[PaymentIntent] Using existing customer:', customer.id);
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: input.customerEmail,
          name: input.customerName,
          metadata: {
            customerId: input.customerId,
          },
        });
        console.log('[PaymentIntent] Created new customer:', customer.id);
      }
    } catch (err) {
      console.error('[PaymentIntent] Customer creation error:', err);
      return {
        success: false,
        error: 'Failed to create or retrieve customer',
      };
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: input.amount,
      currency: input.currency || 'usd',
      customer: customer.id,
      description: `Order payment for ${input.customerName}`,
      metadata: {
        customerId: input.customerId,
        ...input.metadata,
      },
      // Allow payment method collecting
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('[PaymentIntent] Created:', paymentIntent.id, 'Status:', paymentIntent.status);

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
    };
  } catch (error: any) {
    console.error('[PaymentIntent] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment intent',
    };
  }
};

/**
 * For direct Node.js invocation (local testing)
 */
export const createPaymentIntent = async (input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResponse> => {
  return handler({ arguments: { input }, identity: {} } as AppSyncEvent);
};
