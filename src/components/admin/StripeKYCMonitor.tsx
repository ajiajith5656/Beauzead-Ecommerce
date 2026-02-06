/**
 * Stripe KYC Monitoring Component for Admin Dashboard
 * 
 * Read-only view for admins to monitor Stripe Connect KYC verification status.
 * Admins cannot override Stripe decisions - this is for monitoring only.
 */

import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  DollarSign,
  Shield,
  ExternalLink,
  Info
} from 'lucide-react';
import type { Seller } from '../../types';

interface StripeKYCMonitorProps {
  seller: Seller;
}

interface StatusBadgeProps {
  status: Seller['kyc_status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config: Record<string, any> = {
    verified: {
      icon: <CheckCircle2 size={16} />,
      label: 'Verified',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    pending: {
      icon: <Clock size={16} />,
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    action_required: {
      icon: <AlertTriangle size={16} />,
      label: 'Action Required',
      className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    restricted: {
      icon: <XCircle size={16} />,
      label: 'Restricted',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    approved: {
      icon: <CheckCircle2 size={16} />,
      label: 'Approved',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    rejected: {
      icon: <XCircle size={16} />,
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const statusConfig = config[status as string] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusConfig.className}`}>
      {statusConfig.icon}
      {statusConfig.label}
    </span>
  );
};

const StripeKYCMonitor: React.FC<StripeKYCMonitorProps> = ({ seller }) => {
  const hasStripeAccount = !!seller.stripe_account_id;
  const payoutsEnabled = seller.payouts_enabled || false;
  const chargesEnabled = seller.charges_enabled || false;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Stripe Connect KYC Status</h3>
        {hasStripeAccount && (
          <a
            href={`https://dashboard.stripe.com/connect/accounts/${seller.stripe_account_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View in Stripe
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            KYC verification is managed by Stripe. Admin actions cannot override Stripe's verification decisions.
          </p>
        </div>
      </div>

      {!hasStripeAccount ? (
        // No Stripe Account
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Shield size={32} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Seller has not started Stripe Connect onboarding yet
          </p>
        </div>
      ) : (
        <>
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* KYC Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Verification Status</span>
              </div>
              <StatusBadge status={seller.kyc_status} />
            </div>

            {/* Payouts */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Payouts</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${
                payoutsEnabled 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {payoutsEnabled ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {payoutsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Charges */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Charges</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${
                chargesEnabled 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {chargesEnabled ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {chargesEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Account Information</h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-600 font-medium">Stripe Account ID</dt>
                <dd className="text-gray-900 font-mono text-xs mt-1">{seller.stripe_account_id}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">Account Type</dt>
                <dd className="text-gray-900 mt-1">
                  {seller.stripe_account_type?.toUpperCase() || 'EXPRESS'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">Onboarding Status</dt>
                <dd className="text-gray-900 mt-1">
                  {seller.stripe_onboarding_completed ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Complete
                    </span>
                  ) : (
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock size={14} />
                      Incomplete
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">Last Updated</dt>
                <dd className="text-gray-900 mt-1">
                  {seller.kyc_last_update 
                    ? new Date(seller.kyc_last_update).toLocaleString()
                    : 'Never'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Warning for Action Required */}
          {seller.kyc_status === 'action_required' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-800">
                  Additional information is required from the seller. They need to complete onboarding in their dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Warning for Restricted */}
          {seller.kyc_status === 'restricted' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <XCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  This account has been restricted by Stripe. The seller should contact{' '}
                  <a 
                    href="https://support.stripe.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-red-900"
                  >
                    Stripe Support
                  </a>{' '}
                  for resolution.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StripeKYCMonitor;
