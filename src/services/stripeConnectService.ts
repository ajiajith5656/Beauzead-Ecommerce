/**
 * Stripe Connect Service
 * 
 * Handles Stripe Connect account creation, onboarding, and status management
 * for seller KYC verification through Stripe's hosted onboarding.
 * 
 * @module stripeConnectService
 */

import { logger } from '../utils/logger';
import type { Seller } from '../types';

// Stripe API configuration
const STRIPE_API_VERSION = '2023-10-16';
const STRIPE_API_BASE = 'https://api.stripe.com/v1';

interface StripeAccountCreationParams {
  email: string;
  country: string;
  businessType?: 'individual' | 'company';
  capabilities?: string[];
}

interface StripeAccountLinkParams {
  accountId: string;
  returnUrl: string;
  refreshUrl: string;
  type?: 'account_onboarding' | 'account_update';
}

interface StripeAccountStatusResponse {
  accountId: string;
  detailsSubmitted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  requirementsCurrentlyDue: string[];
  requirementsEventuallyDue: string[];
  disabled: boolean;
  disabledReason?: string;
}

/**
 * Create a Stripe Connect Express account for a seller
 */
export const createStripeConnectAccount = async (
  params: StripeAccountCreationParams
): Promise<{ success: boolean; accountId?: string; error?: string }> => {
  try {
    logger.log('[Stripe] Creating Connect account:', params.email);

    const response = await fetch(`${STRIPE_API_BASE}/accounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': STRIPE_API_VERSION,
      },
      body: new URLSearchParams({
        type: 'express',
        email: params.email,
        country: params.country,
        'capabilities[card_payments][requested]': 'true',
        'capabilities[transfers][requested]': 'true',
        ...(params.businessType && { 'business_type': params.businessType }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create Stripe account');
    }

    const account = await response.json();
    
    logger.log('[Stripe] Connect account created:', account.id);
    
    return {
      success: true,
      accountId: account.id,
    };
  } catch (error: any) {
    logger.error(error, { context: 'createStripeConnectAccount' });
    return {
      success: false,
      error: error.message || 'Failed to create Stripe account',
    };
  }
};

/**
 * Generate Stripe Account Link for onboarding
 */
export const createAccountOnboardingLink = async (
  params: StripeAccountLinkParams
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    logger.log('[Stripe] Creating account link for:', params.accountId);

    const response = await fetch(`${STRIPE_API_BASE}/account_links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': STRIPE_API_VERSION,
      },
      body: new URLSearchParams({
        account: params.accountId,
        refresh_url: params.refreshUrl,
        return_url: params.returnUrl,
        type: params.type || 'account_onboarding',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create account link');
    }

    const accountLink = await response.json();
    
    logger.log('[Stripe] Account link created, expires at:', accountLink.expires_at);
    
    return {
      success: true,
      url: accountLink.url,
    };
  } catch (error: any) {
    logger.error(error, { context: 'createAccountOnboardingLink' });
    return {
      success: false,
      error: error.message || 'Failed to create onboarding link',
    };
  }
};

/**
 * Retrieve Stripe account status
 */
export const getStripeAccountStatus = async (
  accountId: string
): Promise<{ success: boolean; status?: StripeAccountStatusResponse; error?: string }> => {
  try {
    logger.log('[Stripe] Fetching account status for:', accountId);

    const response = await fetch(`${STRIPE_API_BASE}/accounts/${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
        'Stripe-Version': STRIPE_API_VERSION,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch account status');
    }

    const account = await response.json();
    
    const status: StripeAccountStatusResponse = {
      accountId: account.id,
      detailsSubmitted: account.details_submitted || false,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      requirementsCurrentlyDue: account.requirements?.currently_due || [],
      requirementsEventuallyDue: account.requirements?.eventually_due || [],
      disabled: account.requirements?.disabled_reason ? true : false,
      disabledReason: account.requirements?.disabled_reason,
    };
    
    logger.log('[Stripe] Account status retrieved. Charges:', status.chargesEnabled, 'Payouts:', status.payoutsEnabled);
    
    return {
      success: true,
      status,
    };
  } catch (error: any) {
    logger.error(error, { context: 'getStripeAccountStatus' });
    return {
      success: false,
      error: error.message || 'Failed to get account status',
    };
  }
};

/**
 * Map Stripe account status to seller KYC status
 */
export const mapStripeStatusToKYC = (
  stripeStatus: StripeAccountStatusResponse
): Seller['kyc_status'] => {
  if (stripeStatus.disabled) {
    return 'restricted';
  }
  
  if (stripeStatus.requirementsCurrentlyDue.length > 0) {
    return 'action_required';
  }
  
  if (stripeStatus.chargesEnabled && stripeStatus.payoutsEnabled) {
    return 'verified';
  }
  
  if (stripeStatus.detailsSubmitted) {
    return 'pending';
  }
  
  return 'pending';
};

/**
 * Create or retrieve Stripe account and generate onboarding link
 * This is the main function to call when seller clicks "KYC Verification"
 */
export const initiateSellerKYCOnboarding = async (seller: {
  id: string;
  email: string;
  country?: string;
  stripe_account_id?: string;
}): Promise<{ success: boolean; onboardingUrl?: string; accountId?: string; error?: string }> => {
  try {
    let accountId = seller.stripe_account_id;

    // Create account if doesn't exist
    if (!accountId) {
      const createResult = await createStripeConnectAccount({
        email: seller.email,
        country: seller.country || 'US',
        businessType: 'individual',
      });

      if (!createResult.success || !createResult.accountId) {
        return {
          success: false,
          error: createResult.error || 'Failed to create Stripe account',
        };
      }

      accountId = createResult.accountId;
    }

    // Generate onboarding link
    const baseUrl = window.location.origin;
    const linkResult = await createAccountOnboardingLink({
      accountId,
      returnUrl: `${baseUrl}/seller/dashboard?onboarding=complete`,
      refreshUrl: `${baseUrl}/seller/dashboard?onboarding=refresh`,
      type: 'account_onboarding',
    });

    if (!linkResult.success || !linkResult.url) {
      return {
        success: false,
        error: linkResult.error || 'Failed to create onboarding link',
      };
    }

    return {
      success: true,
      onboardingUrl: linkResult.url,
      accountId,
    };
  } catch (error: any) {
    logger.error(error, { context: 'initiateSellerKYCOnboarding' });
    return {
      success: false,
      error: error.message || 'Failed to initiate KYC onboarding',
    };
  }
};

/**
 * Handle Stripe webhook for account updates
 */
export const handleStripeAccountUpdate = async (
  accountId: string
): Promise<{ 
  success: boolean; 
  kycStatus?: Seller['kyc_status']; 
  payoutsEnabled?: boolean; 
  chargesEnabled?: boolean;
  error?: string;
}> => {
  try {
    const statusResult = await getStripeAccountStatus(accountId);

    if (!statusResult.success || !statusResult.status) {
      return {
        success: false,
        error: statusResult.error || 'Failed to get account status',
      };
    }

    const kycStatus = mapStripeStatusToKYC(statusResult.status);

    return {
      success: true,
      kycStatus,
      payoutsEnabled: statusResult.status.payoutsEnabled,
      chargesEnabled: statusResult.status.chargesEnabled,
    };
  } catch (error: any) {
    logger.error(error, { context: 'handleStripeAccountUpdate' });
    return {
      success: false,
      error: error.message || 'Failed to handle account update',
    };
  }
};

export default {
  createStripeConnectAccount,
  createAccountOnboardingLink,
  getStripeAccountStatus,
  mapStripeStatusToKYC,
  initiateSellerKYCOnboarding,
  handleStripeAccountUpdate,
};
