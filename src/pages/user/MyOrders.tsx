import React, { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Loader2 } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  trackingId?: string;
}

export const MyOrders: React.FC = () => {
  const { user, currentAuthUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    // Check if user is logged in
    if (!user && !currentAuthUser) {
      navigate('/login');
      return;
    }

    // Simulate fetching orders
    const loadOrders = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual GraphQL query
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-001',
            date: '2026-01-25',
            total: 4999,
            status: 'delivered',
            items: 3,
            trackingId: 'TRK-123456',
          },
          {
            id: '2',
            orderNumber: 'ORD-002',
            date: '2026-01-28',
            total: 2499,
            status: 'shipped',
            items: 1,
            trackingId: 'TRK-789012',
          },
          {
            id: '3',
            orderNumber: 'ORD-003',
            date: '2026-01-29',
            total: 7999,
            status: 'processing',
            items: 5,
          },
        ];
        
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        logger.error(error as Error, { context: 'Failed to load orders' });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, currentAuthUser, navigate]);

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter((order) => order.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-900 text-green-200';
      case 'shipped':
        return 'bg-blue-900 text-blue-200';
      case 'processing':
        return 'bg-yellow-900 text-yellow-200';
      case 'pending':
        return 'bg-gray-700 text-gray-200';
      case 'cancelled':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'processing':
        return '⏳';
      case 'cancelled':
        return '✕';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(['all', 'pending', 'shipped', 'delivered', 'cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === filter
                  ? 'bg-gold text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter !== 'all' && ` (${orders.filter((o) => o.status === filter).length})`}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-gold animate-spin mr-3" />
            <span className="text-white text-lg">Loading your orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Found</h2>
            <p className="text-gray-400 mb-6">
              You don't have any {selectedFilter !== 'all' ? selectedFilter : ''} orders yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gold transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-gold transition-all duration-300">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-400">{order.date}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    <span>{getStatusIcon(order.status)}</span>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Items</p>
                    <p className="text-lg font-bold text-gold">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Total</p>
                    <p className="text-lg font-bold text-white">₹{order.total}</p>
                  </div>
                  {order.trackingId && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Tracking</p>
                      <p className="text-lg font-bold text-gold">{order.trackingId}</p>
                    </div>
                  )}
                  <div className="flex items-end justify-end">
                    <ChevronRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>

                {order.status === 'delivered' && (
                  <button className="text-gold hover:text-yellow-400 text-sm font-medium transition-all duration-300">
                    Write a Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
