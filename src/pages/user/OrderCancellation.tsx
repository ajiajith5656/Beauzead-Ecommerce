import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, AlertCircle, Check
} from 'lucide-react';
import type { OrderSummary } from '../../types';
import { formatPrice } from '../../constants';

const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Found a better price elsewhere',
  'Delivery taking too long',
  'Product no longer required',
  'Changed my mind',
  'Other'
];

const OrderCancellation: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cancellationId, setCancellationId] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock order data
      const mockOrder: OrderSummary = {
        id: orderId || 'ORD001',
        user_id: 'user1',
        total: 299.99,
        currency: 'USD',
        status: 'processing',
        created_at: '2024-01-15T10:30:00Z',
        seller_id: 'seller1',
        seller_name: 'Premium Electronics Store',
        items: [
          {
            id: 'item1',
            order_id: orderId || 'ORD001',
            product_id: 'prod1',
            product_name: 'Premium Wireless Headphones',
            product_image: 'https://via.placeholder.com/200',
            quantity: 1,
            price: 299.99,
            currency: 'USD'
          }
        ],
        shipping_address: '123 Main St, Apt 4B, New York, NY 10001, United States',
        payment_method: 'Credit Card (**** 1234)',
        cancellation_policy: {
          allow_pending: true,
          allow_processing: true,
          allow_shipped: false,
          policy_text: 'Cancellation allowed before shipment. Refund within 5-7 business days.'
        }
      };

      setOrder(mockOrder);
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  const generateCancellationId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `CNL-BZ-${year}-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      alert('Please select a cancellation reason');
      return;
    }

    if (selectedReason === 'Other' && !otherReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate cancellation ID
    const newCancellationId = generateCancellationId();
    setCancellationId(newCancellationId);
    
    // TODO: In real app, create cancellation record via API
    // const cancellationData = {
    //   order_id: order.id,
    //   reason: selectedReason,
    //   other_reason: selectedReason === 'Other' ? otherReason : undefined,
    //   status: 'pending'
    // };

    setSubmitting(false);
    setShowSuccess(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      navigate(`/user/orders/${orderId}`);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Order Not Found</h3>
          <p className="text-gray-400 mb-6">Unable to load order details.</p>
          <button 
            onClick={() => navigate('/user/orders')}
            className="btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Success Modal
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
          <p className="text-gray-300 mb-4">
            Your cancellation request has been submitted successfully and is pending seller approval.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1">Cancellation ID</p>
            <p className="text-gold font-mono font-semibold">{cancellationId}</p>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Redirecting to order details...
          </p>
          <button
            onClick={() => navigate(`/user/orders/${orderId}`)}
            className="btn-primary w-full"
          >
            View Order Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(`/user/orders/${orderId}`)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled={submitting}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gold">Cancel Order</h1>
              <p className="text-sm text-gray-400">Review order details and submit a cancellation request</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Order Summary (Read-Only) */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
            <div className="space-y-4">
              {/* Order ID */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Order ID</p>
                  <p className="text-white font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Order Status</p>
                  <p className="text-white font-medium capitalize">{order.status}</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-800 pt-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-800"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/100/1f2937/eab308?text=Product';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.product_name}</h3>
                      <p className="text-sm text-gray-400 mt-1">Quantity: {item.quantity}</p>
                      <p className="text-gold font-semibold mt-2">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seller and Amount */}
              <div className="border-t border-gray-800 pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Seller Name</p>
                  <p className="text-white font-medium">{order.seller_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Order Amount</p>
                  <p className="text-gold font-bold text-lg">
                    {formatPrice(order.total, order.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Cancellation Reason */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">Cancellation Reason</h2>
            
            {/* Reason Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason For Cancellation <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gold transition-colors"
                required
                disabled={submitting}
              >
                <option value="">Select a reason</option>
                {CANCELLATION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Other Reason Text Area */}
            {selectedReason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Please specify your reason
                </label>
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value.slice(0, 200))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gold transition-colors resize-none"
                  rows={4}
                  maxLength={200}
                  placeholder="Enter your reason (max 200 characters)"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {otherReason.length}/200 characters
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Policy Notice */}
          <div className="card bg-yellow-500/5 border-yellow-500/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <h3 className="font-semibold text-yellow-500">Cancellation Policy</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>• This cancellation request is subject to seller approval.</li>
                  <li>• Refund will be processed only after seller approval.</li>
                  <li>• Refund timeline depends on original payment method.</li>
                  {order.cancellation_policy?.policy_text && (
                    <li className="mt-2 pt-2 border-t border-yellow-500/20">
                      • {order.cancellation_policy.policy_text}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(`/user/orders/${orderId}`)}
              className="flex-1 bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={submitting || !selectedReason}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Proceed With Cancellation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCancellation;
