import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowLeft, ShieldCheck, ChevronRight, ShoppingBag, Clock, Package, CheckCircle, XCircle, Truck
} from 'lucide-react';
import type { OrderSummary, Order } from '../../types';
import { formatPrice } from '../../constants';

type OrderStatus = Order['status'];

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - in real app, fetch from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock orders data
      const mockOrders: OrderSummary[] = [
        {
          id: 'ORD001',
          user_id: 'user1',
          total: 299.99,
          currency: 'USD',
          status: 'delivered',
          created_at: '2024-01-15T10:30:00Z',
          seller_id: 'seller1',
          seller_name: 'Premium Electronics Store',
          items: [
            {
              id: 'item1',
              order_id: 'ORD001',
              product_id: 'prod1',
              product_name: 'Premium Wireless Headphones',
              product_image: 'https://via.placeholder.com/100',
              quantity: 1,
              price: 299.99,
              currency: 'USD'
            }
          ],
          shipping_address: '123 Main St, New York, NY 10001',
          payment_method: 'Credit Card',
          cancellation_policy: {
            allow_pending: true,
            allow_processing: true,
            allow_shipped: false
          }
        },
        {
          id: 'ORD002',
          user_id: 'user1',
          total: 149.50,
          currency: 'USD',
          status: 'shipped',
          created_at: '2024-01-20T14:15:00Z',
          seller_id: 'seller2',
          seller_name: 'Tech Gadgets Hub',
          items: [
            {
              id: 'item2',
              order_id: 'ORD002',
              product_id: 'prod2',
              product_name: 'Smart Watch Series 5',
              product_image: 'https://via.placeholder.com/100',
              quantity: 1,
              price: 149.50,
              currency: 'USD'
            }
          ],
          shipping_address: '123 Main St, New York, NY 10001',
          payment_method: 'PayPal',
          cancellation_policy: {
            allow_pending: true,
            allow_processing: true,
            allow_shipped: true
          }
        },
        {
          id: 'ORD003',
          user_id: 'user1',
          total: 89.99,
          currency: 'USD',
          status: 'processing',
          created_at: '2024-01-25T09:00:00Z',
          seller_id: 'seller3',
          seller_name: 'Audio World',
          items: [
            {
              id: 'item3',
              order_id: 'ORD003',
              product_id: 'prod3',
              product_name: 'Bluetooth Speaker',
              product_image: 'https://via.placeholder.com/100',
              quantity: 2,
              price: 44.99,
              currency: 'USD'
            }
          ],
          shipping_address: '123 Main St, New York, NY 10001',
          payment_method: 'Credit Card',
          cancellation_policy: {
            allow_pending: true,
            allow_processing: true,
            allow_shipped: false
          }
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Filter orders based on search and status using useMemo
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filtered;
  }, [searchQuery, statusFilter, orders]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/user/dashboard')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gold">My Orders</h1>
                <p className="text-sm text-gray-400">Track and manage your orders</p>
              </div>
            </div>
            <ShieldCheck className="h-8 w-8 text-gold" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gold"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start shopping to see your orders here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold transition-colors"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-sm text-gray-400">Order ID</p>
                        <p className="font-semibold text-white">{order.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Order Date</p>
                        <p className="font-medium text-white">{formatDate(order.created_at)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Total Amount</p>
                        <p className="font-bold text-gold">{formatPrice(order.total, order.currency)}</p>
                      </div>
                      
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-3">
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-800"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100/1f2937/eab308?text=Product';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{item.product_name}</p>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gold">{formatPrice(item.price * item.quantity, item.currency)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                  <button 
                    onClick={() => navigate(`/user/orders/${order.id}`)}
                    className="flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-2 bg-gold text-black font-medium rounded-lg hover:bg-gold-light transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
