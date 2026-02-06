/**
 * StripeKYCStatus Component
 * 
 * Display Stripe Connect KYC verification status and manage onboarding flow.
 * This component replaces the manual KYC form with Stripe's hosted onboarding.
 * 
 * Features:
 * - Show current KYC status with color indicators
 * - Display payout eligibility
 * - Button to initiate/continue Stripe onboarding
 * - Auto-refresh status after onboarding completion
 */

import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  DollarSign,
  ExternalLink,
  Loader2,
  Info,
  ArrowRight
} from 'lucide-react';
import { logger } from '../../utils/logger';
import { initiateSellerKYCOnboarding, getStripeAccountStatus } from '../../services/stripeConnectService';
import type { Seller } from '../../types';

interface StripeKYCStatusProps {
  seller: Seller;
  onStatusUpdate?: (updates: Partial<Seller>) => void;
}

interface StatusInfo {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
}

const STATUS_MAP: Record<string, StatusInfo> = {
  pending: {
    label: 'Pending Verification',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    icon: <Clock size={24} className="text-yellow-400" />,
    description: 'Your KYC verification is being processed by Stripe.',
  },
  verified: {
    label: 'Verified',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    icon: <CheckCircle2 size={24} className="text-green-400" />,
    description: 'Your identity has been verified. You can now receive payouts.',
  },
  action_required: {
    label: 'Action Required',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    icon: <AlertTriangle size={24} className="text-orange-400" />,
    description: 'Additional information is needed to complete your verification.',
  },
  restricted: {
    label: 'Restricted',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    icon: <XCircle size={24} className="text-red-400" />,
    description: 'Your account has been restricted. Please contact support.',
  },
};

const StripeKYCStatus: React.FC<StripeKYCStatusProps> = ({ seller, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const kycStatus = seller.kyc_status || 'pending';
  const statusInfo = STATUS_MAP[kycStatus] || STATUS_MAP.pending;
  const isVerified = kycStatus === 'verified';
  const needsAction = kycStatus === 'action_required' || !seller.stripe_onboarding_completed;
  const isRestricted = kycStatus === 'restricted';

  // Check for onboarding completion parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const onboardingStatus = urlParams.get('onboarding');

    if (onboardingStatus === 'complete') {
      // Refresh status after successful onboarding
      refreshAccountStatus();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (onboardingStatus === 'refresh') {
      // User was prompted to refresh the onboarding link
      setError('Onboarding session expired. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleStartKYC = async () => {
    setLoading(true);
    setError(null);

    try {
      logger.log('[Stripe KYC] Starting onboarding for seller:', seller.id);

      const result = await initiateSellerKYCOnboarding({
        id: seller.id,
        email: seller.email,
        country: 'US', // TODO: Get from seller profile
        stripe_account_id: seller.stripe_account_id,
      });

      if (!result.success || !result.onboardingUrl) {
        throw new Error(result.error || 'Failed to start onboarding');
      }

      // Update seller with Stripe account ID if newly created
      if (result.accountId && !seller.stripe_account_id && onStatusUpdate) {
        onStatusUpdate({
          stripe_account_id: result.accountId,
        });
      }

      // Redirect to Stripe hosted onboarding
      window.location.href = result.onboardingUrl;
    } catch (err: any) {
      logger.error(err, { context: 'handleStartKYC' });
      setError(err.message || 'Failed to start KYC verification');
    } finally {
      setLoading(false);
    }
  };

  const refreshAccountStatus = async () => {
    if (!seller.stripe_account_id) return;

    setRefreshing(true);
    setError(null);

    try {
      logger.log('[Stripe KYC] Refreshing account status for:', seller.stripe_account_id);

      const result = await getStripeAccountStatus(seller.stripe_account_id);

      if (!result.success || !result.status) {
        throw new Error(result.error || 'Failed to get account status');
      }

      // Update seller status
      if (onStatusUpdate) {
        const updates: Partial<Seller> = {
          payouts_enabled: result.status.payoutsEnabled,
          charges_enabled: result.status.chargesEnabled,
          stripe_onboarding_completed: result.status.detailsSubmitted,
          kyc_last_update: new Date().toISOString(),
        };

        // Determine KYC status
        if (result.status.disabled) {
          updates.kyc_status = 'restricted';
        } else if (result.status.requirementsCurrentlyDue.length > 0) {
          updates.kyc_status = 'action_required';
        } else if (result.status.chargesEnabled && result.status.payoutsEnabled) {
          updates.kyc_status = 'verified';
        } else {
          updates.kyc_status = 'pending';
        }

        onStatusUpdate(updates);
      }
    } catch (err: any) {
      logger.error(err, { context: 'refreshAccountStatus' });
      setError('Failed to refresh status');
    } finally {
      setRefreshing(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    if (isVerified) return 'Verification Complete';
    if (needsAction) return 'Continue Verification';
    if (isRestricted) return 'Contact Support';
    return 'Start KYC Verification';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-1.5">
          KYC Verification
        </h2>
        <p className="text-sm text-gray-400">
          Complete your identity verification through Stripe to enable payouts
        </p>
      </div>

      {/* Status Card */}
      <div className={`border ${statusInfo.borderColor} ${statusInfo.bgColor} rounded-lg p-4`}>
        <div className="flex items-start gap-4">
          <div className="mt-1">{statusInfo.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-base font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </h3>
              {seller.kyc_last_update && (
                <span className="text-xs text-gray-500">
                  Updated {new Date(seller.kyc_last_update).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300">{statusInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Payout Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <DollarSign size={20} className={seller.payouts_enabled ? 'text-green-400' : 'text-gray-500'} />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Payouts Status</p>
              <p className={`text-sm font-semibold ${seller.payouts_enabled ? 'text-green-400' : 'text-gray-400'}`}>
                {seller.payouts_enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <Shield size={20} className={seller.charges_enabled ? 'text-green-400' : 'text-gray-500'} />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Charges Status</p>
              <p className={`text-sm font-semibold ${seller.charges_enabled ? 'text-green-400' : 'text-gray-400'}`}>
                {seller.charges_enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="border border-red-500/20 bg-red-500/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="border border-blue-500/20 bg-blue-500/5 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-400 mt-0.5" />
          <div className="text-sm text-gray-300 space-y-2">
            <p className="font-semibold text-blue-300">How Stripe KYC Works:</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 ml-2">
              <li>Click the button below to begin verification with Stripe</li>
              <li>You'll be redirected to Stripe's secure hosted onboarding</li>
              <li>Provide your identity and business information</li>
              <li>Stripe verifies your information (usually within minutes)</li>
              <li>Your dashboard updates automatically when verification completes</li>
              <li>No sensitive documents are stored on our platform</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleStartKYC}
          disabled={loading || (isVerified && !needsAction) || isRestricted}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            isVerified && !needsAction
              ? 'bg-green-500/10 text-green-400 cursor-not-allowed'
              : isRestricted
              ? 'bg-red-500/10 text-red-400 cursor-not-allowed'
              : loading
              ? 'bg-[#d4af37]/50 text-black cursor-wait'
              : 'bg-[#d4af37] text-black hover:bg-[#d4af37]/90'
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {getButtonText()}
            </>
          ) : isVerified && !needsAction ? (
            <>
              <CheckCircle2 size={18} />
              {getButtonText()}
            </>
          ) : (
            <>
              {getButtonText()}
              {!isRestricted && <ExternalLink size={18} />}
            </>
          )}
        </button>

        {seller.stripe_account_id && !isVerified && (
          <button
            onClick={refreshAccountStatus}
            disabled={refreshing}
            className="px-5 py-3 border border-gray-700 rounded-lg font-semibold text-sm text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <ArrowRight size={18} />
                Refresh Status
              </>
            )}
          </button>
        )}
      </div>

      {/* Stripe Account ID (for debugging) */}
      {seller.stripe_account_id && (
        <div className="text-xs text-gray-600 font-mono">
          Stripe Account: {seller.stripe_account_id}
        </div>
      )}
    </div>
  );
};

export default StripeKYCStatus;
