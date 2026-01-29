import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Package, MapPin, CreditCard, X, CheckCircle, XCircle, Clock
} from 'lucide-react';
import type { OrderSummary, OrderCancellation } from '../../types';
import { formatPrice } from '../../constants';

const OrderDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [cancellation] = useState<OrderCancellation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock order data with cancellation policy
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

  const canCancelOrder = () => {
    if (!order || !order.cancellation_policy) return false;
    
    const { status } = order;
    const { allow_pending, allow_processing, allow_shipped } = order.cancellation_policy;

    if (status === 'pending' && allow_pending) return true;
    if (status === 'processing' && allow_processing) return true;
    if (status === 'shipped' && allow_shipped) return true;
    
    return false;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getCancellationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pending Approval
        </span>;
      case 'approved':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-red-500/10 text-red-500 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </span>;
      default:
        return null;
    }
  };

  const getRefundStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'pending':
        return <span className="text-yellow-500">Refund Pending</span>;
      case 'processing':
        return <span className="text-blue-500">Refund Processing</span>;
      case 'completed':
        return <span className="text-green-500">Refund Completed</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Order Not Found</h3>
          <p className="text-gray-400 mb-6">The order you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/user/orders')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gold">Order Details</h1>
                <p className="text-sm text-gray-400">Order ID: {order.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-800 last:border-0">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg bg-gray-800"
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
            </div>

            {/* Cancellation Status (if exists) */}
            {cancellation && (
              <div className="card border-2 border-yellow-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">Cancellation Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Cancellation ID:</span>
                    <span className="text-white font-medium">{cancellation.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    {getCancellationStatusBadge(cancellation.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Reason:</span>
                    <span className="text-white">{cancellation.reason}</span>
                  </div>
                  {cancellation.status === 'approved' && cancellation.refund_status && (
                    <>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                        <span className="text-gray-400">Refund Status:</span>
                        {getRefundStatusBadge(cancellation.refund_status)}
                      </div>
                      {cancellation.refund_status === 'completed' && cancellation.refund_completed_date && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Refund Date:</span>
                          <span className="text-white">{formatDate(cancellation.refund_completed_date)}</span>
                        </div>
                      )}
                    </>
                  )}
                  {cancellation.status === 'rejected' && cancellation.seller_response && (
                    <div className="pt-2 border-t border-gray-800">
                      <span className="text-gray-400">Rejection Reason:</span>
                      <p className="text-white mt-1">{cancellation.seller_response}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order Date</span>
                  <span className="text-white">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Seller</span>
                  <span className="text-white">{order.seller_name || 'N/A'}</span>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">Total Amount</span>
                    <span className="text-lg font-bold text-gold">
                      {formatPrice(order.total, order.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-5 w-5 text-gold" />
                  <h2 className="text-lg font-semibold text-white">Shipping Address</h2>
                </div>
                <p className="text-gray-300 text-sm">{order.shipping_address}</p>
              </div>
            )}

            {/* Payment Method */}
            {order.payment_method && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="h-5 w-5 text-gold" />
                  <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                </div>
                <p className="text-gray-300 text-sm">{order.payment_method}</p>
              </div>
            )}

            {/* Cancel Order Button */}
            {!cancellation && (
              <div className="card">
                {canCancelOrder() ? (
                  <button
                    onClick={() => navigate(`/user/orders/${order.id}/cancel`)}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel Order</span>
                  </button>
                ) : (
                  <div className="text-center">
                    <button
                      disabled
                      className="w-full bg-gray-800 text-gray-500 font-semibold py-2 px-6 rounded-lg cursor-not-allowed mb-2"
                    >
                      Cancel Order
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      Cancellation is not available for this order as per seller policy.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
