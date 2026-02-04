import React, { useState } from 'react';
import { logger } from '../../utils/logger';
import { 
  LayoutDashboard, Package, ShoppingBag, DollarSign, 
  Settings, LogOut, CheckCircle, XCircle,
  Truck, MapPin, User, Phone, TrendingUp,
  Search, Filter, Download, Eye, AlertCircle, PackageCheck
} from 'lucide-react';
import { formatPrice } from '../../constants';

interface Order {
  id: string;
  orderId: string;
  productImage: string;
  productName: string;
  quantity: number;
  buyerName: string;
  buyerCity: string;
  buyerPhone: string;
  amount: number;
  paymentStatus: 'paid' | 'cod' | 'refunded';
  orderStatus: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  orderDate: string;
  trackingId?: string;
  rejectionReason?: string;
}

interface SellerOrderManagementProps {
  onLogout: () => void;
  sellerEmail: string;
  onNavigate: (view: any) => void;
}

const SellerOrderManagement: React.FC<SellerOrderManagementProps> = ({ onLogout, sellerEmail, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingId, setTrackingId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showActionModal, setShowActionModal] = useState<'accept' | 'reject' | 'ship' | 'deliver' | null>(null);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderId: 'BZ-ORD-458921',
      productImage: 'https://via.placeholder.com/300x300/1f2937/eab308?text=Product',
      productName: 'Premium Wireless Headphones - Black Edition',
      quantity: 2,
      buyerName: 'Sarah Mitchell',
      buyerCity: 'London',
      buyerPhone: '****5678',
      amount: 15999,
      paymentStatus: 'paid',
      orderStatus: 'new',
      orderDate: '2025-12-28 10:30 AM'
    },
    {
      id: '2',
      orderId: 'BZ-ORD-458920',
      productImage: 'https://via.placeholder.com/300x300/1f2937/eab308?text=Product',
      productName: 'Smart Watch Series 5 - Silver',
      quantity: 1,
      buyerName: 'James Cooper',
      buyerCity: 'Manchester',
      buyerPhone: '****1234',
      amount: 24999,
      paymentStatus: 'cod',
      orderStatus: 'processing',
      orderDate: '2025-12-27 03:15 PM'
    },
    {
      id: '3',
      orderId: 'BZ-ORD-458915',
      productImage: 'https://via.placeholder.com/300x300/1f2937/eab308?text=Product',
      productName: 'Laptop Stand Aluminum - Space Grey',
      quantity: 1,
      buyerName: 'Emma Wilson',
      buyerCity: 'Birmingham',
      buyerPhone: '****9876',
      amount: 4599,
      paymentStatus: 'paid',
      orderStatus: 'shipped',
      orderDate: '2025-12-25 11:20 AM',
      trackingId: 'TRK-45892-UK'
    },
    {
      id: '4',
      orderId: 'BZ-ORD-458910',
      productImage: 'https://via.placeholder.com/300x300/1f2937/eab308?text=Product',
      productName: 'USB-C Hub 7-in-1 Adapter',
      quantity: 3,
      buyerName: 'Oliver Brown',
      buyerCity: 'Leeds',
      buyerPhone: '****4567',
      amount: 8997,
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      orderDate: '2025-12-20 09:45 AM',
      trackingId: 'TRK-45890-UK'
    },
    {
      id: '5',
      orderId: 'BZ-ORD-458905',
      productImage: 'https://via.placeholder.com/300x300/1f2937/eab308?text=Product',
      productName: 'Mechanical Gaming Keyboard RGB',
      quantity: 1,
      buyerName: 'Sophia Taylor',
      buyerCity: 'Liverpool',
      buyerPhone: '****7890',
      amount: 12499,
      paymentStatus: 'refunded',
      orderStatus: 'cancelled',
      orderDate: '2025-12-18 02:30 PM',
      rejectionReason: 'Product out of stock'
    }
  ];

  const filteredOrders = mockOrders
    .filter(order => order.orderStatus === activeTab)
    .filter(order => 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const orderStats = {
    new: mockOrders.filter(o => o.orderStatus === 'new').length,
    processing: mockOrders.filter(o => o.orderStatus === 'processing').length,
    shipped: mockOrders.filter(o => o.orderStatus === 'shipped').length,
    delivered: mockOrders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: mockOrders.filter(o => o.orderStatus === 'cancelled' || o.orderStatus === 'returned').length
  };

  const handleAcceptOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowActionModal('accept');
  };

  const handleRejectOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowActionModal('reject');
  };

  const handleMarkShipped = (order: Order) => {
    setSelectedOrder(order);
    setShowActionModal('ship');
  };

  const handleMarkDelivered = (order: Order) => {
    setSelectedOrder(order);
    setShowActionModal('deliver');
  };

  const confirmAction = () => {
    // Here you would make API call
    logger.log('Order action confirmed', { action: showActionModal, orderId: selectedOrder?.orderId });
    setShowActionModal(null);
    setSelectedOrder(null);
    setTrackingId('');
    setRejectionReason('');
  };

  const getStatusBadge = (status: Order['orderStatus']) => {
    const badges = {
      new: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', label: 'New Order' },
      processing: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', label: 'Processing' },
      shipped: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', label: 'Shipped' },
      delivered: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', label: 'Delivered' },
      cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', label: 'Cancelled' },
      returned: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', label: 'Returned' }
    };
    const badge = badges[status];
    return (
      <span className={`${badge.bg} ${badge.text} ${badge.border} border text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider`}>
        {badge.label}
      </span>
    );
  };

  const getPaymentBadge = (status: Order['paymentStatus']) => {
    const badges = {
      paid: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Paid' },
      cod: { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'COD' },
      refunded: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Refunded' }
    };
    const badge = badges[status];
    return (
      <span className={`${badge.bg} ${badge.text} text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 cursor-pointer" onClick={() => onNavigate('seller-dashboard')}>
          <h1 className="text-xl font-bold text-gray-900">BeauZead Seller</h1>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-0.5">Business Portal</p>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => onNavigate('seller-dashboard')} />
          <NavItem icon={<ShoppingBag />} label="Order Management" active />
          <NavItem icon={<Package />} label="Products" onClick={() => onNavigate('seller-products')} />
          <NavItem icon={<DollarSign />} label="Wallet & Payouts" onClick={() => onNavigate('seller-wallet')} />
          <NavItem icon={<TrendingUp />} label="Analytics" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Seller ID</p>
            <p className="text-xs font-semibold text-gray-900 truncate">{sellerEmail}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
              <p className="text-gray-600 text-sm font-medium mt-1">Track and manage all your customer orders</p>
            </div>
            <div className="flex gap-3">
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all text-xs flex items-center gap-2">
                <Download size={16} /> Export
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all text-xs flex items-center gap-2">
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-2xl p-2 mb-8 flex gap-2 overflow-x-auto">
            <TabButton 
              label="New Orders" 
              count={orderStats.new}
              active={activeTab === 'new'} 
              onClick={() => setActiveTab('new')}
              color="blue"
            />
            <TabButton 
              label="Processing" 
              count={orderStats.processing}
              active={activeTab === 'processing'} 
              onClick={() => setActiveTab('processing')}
              color="yellow"
            />
            <TabButton 
              label="Shipped" 
              count={orderStats.shipped}
              active={activeTab === 'shipped'} 
              onClick={() => setActiveTab('shipped')}
              color="purple"
            />
            <TabButton 
              label="Delivered" 
              count={orderStats.delivered}
              active={activeTab === 'delivered'} 
              onClick={() => setActiveTab('delivered')}
              color="green"
            />
            <TabButton 
              label="Cancelled" 
              count={orderStats.cancelled}
              active={activeTab === 'cancelled'} 
              onClick={() => setActiveTab('cancelled')}
              color="red"
            />
          </div>

          {/* Search Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Order ID, Product Name, or Buyer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 text-sm">No {activeTab} orders at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Order ID</p>
                        <p className="text-base font-bold text-gray-900">{order.orderId}</p>
                      </div>
                      <div className="h-12 w-px bg-gray-200" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm font-semibold text-gray-700">{order.orderDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.orderStatus)}
                      {getPaymentBadge(order.paymentStatus)}
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="grid md:grid-cols-12 gap-6 mb-6">
                    {/* Product Info */}
                    <div className="md:col-span-5 flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">{order.productName}</h4>
                        <p className="text-xs text-gray-600 font-semibold">Quantity: <span className="text-gray-900">{order.quantity}</span></p>
                      </div>
                    </div>

                    {/* Buyer Info */}
                    <div className="md:col-span-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <User size={14} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{order.buyerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-gray-600">{order.buyerCity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-600">{order.buyerPhone}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="md:col-span-3 text-right">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Order Amount</p>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(order.amount)}</p>
                    </div>
                  </div>

                  {/* Tracking ID (if shipped) */}
                  {order.trackingId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck size={18} className="text-blue-600" />
                          <div>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Tracking ID</p>
                            <p className="text-sm font-bold text-blue-900">{order.trackingId}</p>
                          </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-600 hover:underline">Track Shipment</button>
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason (if cancelled) */}
                  {order.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="text-red-600 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-1">Cancellation Reason</p>
                          <p className="text-sm font-semibold text-red-900">{order.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {order.orderStatus === 'new' && (
                      <>
                        <button 
                          onClick={() => handleAcceptOrder(order)}
                          className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Accept Order
                        </button>
                        <button 
                          onClick={() => handleRejectOrder(order)}
                          className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} /> Reject Order
                        </button>
                      </>
                    )}
                    {order.orderStatus === 'processing' && (
                      <button 
                        onClick={() => handleMarkShipped(order)}
                        className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                      >
                        <Truck size={16} /> Mark as Shipped
                      </button>
                    )}
                    {order.orderStatus === 'shipped' && (
                      <button 
                        onClick={() => handleMarkDelivered(order)}
                        className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                      >
                        <PackageCheck size={16} /> Mark as Delivered
                      </button>
                    )}
                    <button className="flex-1 md:flex-none border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2">
                      <Eye size={16} /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Modal */}
      {showActionModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {showActionModal === 'accept' && 'Accept Order'}
              {showActionModal === 'reject' && 'Reject Order'}
              {showActionModal === 'ship' && 'Mark as Shipped'}
              {showActionModal === 'deliver' && 'Confirm Delivery'}
            </h3>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-xs font-bold text-gray-500 mb-1">Order ID</p>
              <p className="text-base font-bold text-gray-900">{selectedOrder.orderId}</p>
            </div>

            {showActionModal === 'reject' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={4}
                  placeholder="Enter reason for rejection..."
                />
              </div>
            )}

            {showActionModal === 'ship' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Tracking ID *</label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter tracking number..."
                />
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowActionModal(null);
                  setSelectedOrder(null);
                  setTrackingId('');
                  setRejectionReason('');
                }}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                disabled={
                  (showActionModal === 'reject' && !rejectionReason) ||
                  (showActionModal === 'ship' && !trackingId)
                }
                className={`flex-1 font-semibold px-6 py-3 rounded-xl transition-all text-sm ${
                  showActionModal === 'reject' 
                    ? 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50'
                    : showActionModal === 'ship'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })} {label}
  </button>
);

const TabButton = ({ label, count, active, onClick, color }: any) => {
  const colors: any = {
    blue: active ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    yellow: active ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
    purple: active ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    green: active ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100',
    red: active ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${colors[color]}`}
    >
      {label}
      <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20' : 'bg-black/10'}`}>
        {count}
      </span>
    </button>
  );
};

export default SellerOrderManagement;
