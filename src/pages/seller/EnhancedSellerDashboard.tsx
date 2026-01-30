import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, DollarSign, Package, 
  Settings, LogOut, Bell, TrendingUp, CheckCircle2, 
  Clock, AlertTriangle, ShieldCheck, Info, Wallet,
  TrendingDown, FileText, Plus
} from 'lucide-react';
import { formatPrice } from '../../constants';

interface EnhancedSellerDashboardProps {
  onLogout: () => void;
  sellerEmail: string;
  onNavigate: (view: any) => void;
  verificationStatus: 'unverified' | 'pending' | 'verified';
}

const EnhancedSellerDashboard: React.FC<EnhancedSellerDashboardProps> = ({ 
  onLogout, 
  sellerEmail, 
  onNavigate, 
  verificationStatus 
}) => {
  const isVerified = verificationStatus === 'verified';

  // Mock data
  const dashboardData = {
    products: {
      total: 124,
      approved: 118,
      pending: 4,
      rejected: 2
    },
    orders: {
      today: 8,
      thisWeek: 45,
      thisMonth: 186,
      new: 3,
      processing: 12,
      shipped: 18,
      delivered: 153
    },
    revenue: {
      gross: 458920,
      thisMonth: 125600,
      trend: '+24.5%'
    },
    wallet: {
      available: 245680,
      pending: 89450,
      onHold: 12400
    },
    alerts: [
      { type: 'info', message: 'Payout scheduled for tomorrow at 6:00 PM', time: '2 hours ago' },
      { type: 'warning', message: '3 products awaiting admin approval', time: '5 hours ago' }
    ]
  };

  // Mock chart data - last 7 days orders
  const ordersChartData = [
    { day: 'Mon', orders: 12 },
    { day: 'Tue', orders: 18 },
    { day: 'Wed', orders: 15 },
    { day: 'Thu', orders: 22 },
    { day: 'Fri', orders: 28 },
    { day: 'Sat', orders: 35 },
    { day: 'Sun', orders: 25 }
  ];

  const maxOrders = Math.max(...ordersChartData.map(d => d.orders));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 cursor-pointer" onClick={() => onNavigate('seller-dashboard')}>
          <h1 className="text-xl font-bold text-gray-900">BeauZead Seller</h1>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-0.5">Business Portal</p>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
          <NavItem 
            icon={<ShoppingBag />} 
            label="Order Management" 
            onClick={() => onNavigate('seller-orders')}
            disabled={!isVerified}
          />
          <NavItem 
            icon={<Package />} 
            label="Products" 
            onClick={() => onNavigate('seller-products')}
            disabled={!isVerified}
          />
          <NavItem 
            icon={<DollarSign />} 
            label="Wallet & Payouts" 
            onClick={() => onNavigate('seller-wallet')}
            disabled={!isVerified}
          />
          <NavItem icon={<TrendingUp />} label="Analytics" disabled={!isVerified} />
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
              <h2 className="text-3xl font-bold text-gray-900">Seller Dashboard</h2>
              <p className="text-gray-600 text-sm font-medium mt-1">Welcome back, here's your business overview</p>
            </div>
            <div className="flex items-center gap-4">
              {verificationStatus === 'unverified' && (
                <button 
                  onClick={() => onNavigate('seller-verify')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-yellow-500/20"
                >
                  <ShieldCheck size={16} />
                  Complete Verification
                </button>
              )}
              <button className="relative p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>

          {/* KYC Status Alert */}
          {verificationStatus === 'unverified' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-yellow-900 mb-1">Store Verification Required</h4>
                <p className="text-xs text-yellow-700 leading-relaxed mb-4">
                  Complete KYC verification to start listing products and receiving orders. This typically takes 48-72 hours after document submission.
                </p>
                <button 
                  onClick={() => onNavigate('seller-verify')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-xs"
                >
                  Start Verification Process
                </button>
              </div>
            </div>
          )}

          {verificationStatus === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-900 mb-1">Verification Under Review</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Our compliance team is reviewing your documents. You'll receive an email once approved. Typical review time: 48-72 hours.
                </p>
              </div>
            </div>
          )}

          {verificationStatus === 'verified' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-green-900 mb-1">Store Verified Successfully</h4>
                <p className="text-xs text-green-700 leading-relaxed">
                  Your store is now live! You can list products, manage orders, and receive payments. Welcome to the BeauZead seller community.
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value={dashboardData.products.total.toString()}
              subtitle={`${dashboardData.products.approved} Approved, ${dashboardData.products.pending} Pending`}
              icon={<Package className="text-blue-600" />}
              trend="+8"
              trendUp={true}
            />
            <StatCard
              title="Total Orders"
              value={dashboardData.orders.thisMonth.toString()}
              subtitle="This Month"
              icon={<ShoppingBag className="text-purple-600" />}
              trend="+24.5%"
              trendUp={true}
            />
            <StatCard
              title="Gross Revenue"
              value={formatPrice(dashboardData.revenue.gross)}
              subtitle="All Time"
              icon={<DollarSign className="text-green-600" />}
              trend="+18.2%"
              trendUp={true}
            />
            <StatCard
              title="Wallet Balance"
              value={formatPrice(dashboardData.wallet.available)}
              subtitle={`${formatPrice(dashboardData.wallet.pending)} Pending`}
              icon={<Wallet className="text-yellow-600" />}
              actionLabel="Withdraw"
              onAction={() => onNavigate('seller-wallet')}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Orders Chart */}
            <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Orders Overview</h3>
                  <p className="text-xs text-gray-600 mt-1">Last 7 days performance</p>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
              </div>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {ordersChartData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-gray-600 w-12">{data.day}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${(data.orders / maxOrders) * 100}%` }}
                      >
                        <span className="text-white text-xs font-bold">{data.orders}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-4 gap-4">
                <MiniStat label="New" value={dashboardData.orders.new} color="blue" />
                <MiniStat label="Processing" value={dashboardData.orders.processing} color="yellow" />
                <MiniStat label="Shipped" value={dashboardData.orders.shipped} color="purple" />
                <MiniStat label="Delivered" value={dashboardData.orders.delivered} color="green" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {dashboardData.alerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {alert.type === 'warning' ? (
                        <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${
                          alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                        }`}>{alert.message}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl transition-all text-xs">
                View All Notifications
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton
                icon={<Plus />}
                label="Add Product"
                onClick={() => onNavigate('seller-products')}
                disabled={!isVerified}
              />
              <QuickActionButton
                icon={<ShoppingBag />}
                label="View Orders"
                onClick={() => onNavigate('seller-orders')}
                disabled={!isVerified}
              />
              <QuickActionButton
                icon={<Wallet />}
                label="Withdraw Funds"
                onClick={() => onNavigate('seller-wallet')}
                disabled={!isVerified}
              />
              <QuickActionButton
                icon={<FileText />}
                label="Reports"
                disabled={!isVerified}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : disabled
        ? 'text-gray-400 cursor-not-allowed opacity-50'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })} {label}
  </button>
);

const StatCard = ({ title, value, subtitle, icon, trend, trendUp, actionLabel, onAction }: any) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-xs text-gray-600">{subtitle}</p>
    {actionLabel && (
      <button 
        onClick={onAction}
        className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition-all text-xs"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const MiniStat = ({ label, value, color }: any) => {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',
    green: 'text-green-600 bg-green-50'
  };

  return (
    <div className="text-center">
      <div className={`${colors[color]} rounded-xl p-3 mb-2`}>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{label}</p>
    </div>
  );
};

const QuickActionButton = ({ icon, label, onClick, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all ${
      disabled
        ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
        : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    {React.cloneElement(icon, { size: 24 })}
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default EnhancedSellerDashboard;
