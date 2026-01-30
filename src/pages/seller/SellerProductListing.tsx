import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, DollarSign, 
  Settings, LogOut, Plus, Filter, Eye,
  Trash2, Edit3, CheckCircle2, AlertTriangle, Clock, TrendingUp,
  Star, Image as ImageIcon, Search
} from 'lucide-react';
import { ALL_PRODUCTS, formatPrice } from '../../constants';

interface SellerProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stockCount: number;
  inStock: boolean;
  approved: boolean;
  revenue: number;
  orders: number;
  views: number;
  rating: number | string;
  image: string;
  brand?: string;
  reviewCount?: number;
  discount?: number;
}

interface SellerProductListingProps {
  onLogout: () => void;
  sellerEmail: string;
  onNavigate: (view: any) => void;
}

const SellerProductListing: React.FC<SellerProductListingProps> = ({ onLogout, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock seller products (in real app, filter by seller_id)
  const sellerProducts: SellerProduct[] = ALL_PRODUCTS.map((product: any, index: number) => ({
    ...product,
    stockCount: product.stockCount || Math.floor(Math.random() * 100) + 1,
    brand: product.brand || 'BeauZead',
    rating: product.rating || (4 + Math.random()).toFixed(1),
    reviewCount: Math.floor(Math.random() * 500) + 50,
    approved: index % 5 !== 0, // 20% pending approval
    views: Math.floor(Math.random() * 10000) + 500,
    orders: Math.floor(Math.random() * 200) + 10,
    revenue: product.price * (Math.floor(Math.random() * 200) + 10)
  }));

  const filteredProducts = sellerProducts.filter((product: SellerProduct) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.approved && product.inStock) ||
                         (filterStatus === 'pending' && !product.approved) ||
                         (filterStatus === 'outofstock' && !product.inStock);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    active: sellerProducts.filter((p: SellerProduct) => p.approved && p.inStock).length,
    lowStock: sellerProducts.filter((p: SellerProduct) => p.stockCount < 10).length,
    pending: sellerProducts.filter((p: SellerProduct) => !p.approved).length,
    totalRevenue: sellerProducts.reduce((sum: number, p: SellerProduct) => sum + p.revenue, 0),
    totalOrders: sellerProducts.reduce((sum: number, p: SellerProduct) => sum + p.orders, 0),
    totalViews: sellerProducts.reduce((sum: number, p: SellerProduct) => sum + p.views, 0)
  };

  const categories: string[] = Array.from(new Set(sellerProducts.map((p: SellerProduct) => p.category)));

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-900 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="mb-12 cursor-pointer" onClick={() => onNavigate('seller-dashboard')}>
          <h1 className="text-2xl font-semibold text-white">Seller Hub</h1>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-1">Merchant Portal</p>
        </div>

        <nav className="space-y-3 flex-1">
          <NavItem icon={<LayoutDashboard />} label="Overview" onClick={() => onNavigate('seller-dashboard')} />
          <NavItem icon={<Package />} label="My Products" active />
          <NavItem icon={<ShoppingBag />} label="Order Tracking" />
          <NavItem icon={<TrendingUp />} label="Sales Velocity" />
          <NavItem icon={<DollarSign />} label="Payouts" />
          <NavItem icon={<Settings />} label="Store Config" />
        </nav>

        <div className="pt-8 border-t border-gray-900">
          <button onClick={onLogout} className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-500/5 rounded-xl font-semibold text-sm transition-all">
            <LogOut size={18} /> End Session
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 md:p-16 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h2 className="text-4xl font-semibold text-white tracking-tight uppercase">My Products</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Manage Your Premium Inventory Listings</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <button className="flex-1 md:flex-none border border-gray-800 hover:bg-white/5 text-gray-400 font-semibold px-8 py-3 rounded-2xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
               <Filter size={14} /> Refine List
             </button>
             <button className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10 py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest">
               <Plus size={18} /> New Listing
             </button>
          </div>
        </header>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <PerformanceCard 
            label="Total Revenue" 
            value={formatPrice(stats.totalRevenue)} 
            icon={<DollarSign className="text-green-500" />}
            trend="+24.5%"
          />
          <PerformanceCard 
            label="Total Orders" 
            value={stats.totalOrders.toString()} 
            icon={<ShoppingBag className="text-blue-500" />}
            trend="+18.2%"
          />
          <PerformanceCard 
            label="Product Views" 
            value={stats.totalViews.toLocaleString()} 
            icon={<Eye className="text-purple-500" />}
            trend="+32.1%"
          />
        </div>

        {/* Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard label="Active Items" value={stats.active.toString()} icon={<CheckCircle2 className="text-green-500" />} />
          <StatCard label="Critical Stock" value={stats.lowStock.toString()} icon={<AlertTriangle className="text-red-500" />} />
          <StatCard label="Pending Approval" value={stats.pending.toString()} icon={<Clock className="text-blue-500" />} />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[#0a0a0a] border border-gray-900 rounded-3xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors cursor-pointer appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors cursor-pointer appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active & In Stock</option>
              <option value="pending">Pending Approval</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || filterCategory !== 'all' || filterStatus !== 'all') && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-900">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Active Filters:</span>
              {searchQuery && (
                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-yellow-500/20">
                  Search: {searchQuery}
                </span>
              )}
              {filterCategory !== 'all' && (
                <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-blue-500/20">
                  {filterCategory}
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="bg-purple-500/10 text-purple-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-purple-500/20">
                  {filterStatus.replace('outofstock', 'Out of Stock')}
                </span>
              )}
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
                className="text-[10px] font-semibold text-red-500 hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-semibold text-gray-500">
            Showing <span className="text-white">{filteredProducts.length}</span> of <span className="text-white">{sellerProducts.length}</span> products
          </p>
        </div>

        {/* Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {filteredProducts.map((product: SellerProduct) => (
             <div key={product.id} className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-8 group hover:border-yellow-500/30 transition-all relative overflow-hidden">
                {/* Status Badge */}
                {!product.approved && (
                  <div className="absolute top-6 right-6 bg-blue-500/10 text-blue-500 text-[8px] font-semibold px-2 py-1 rounded border border-blue-500/20 uppercase">
                    Pending Approval
                  </div>
                )}
                {product.approved && !product.inStock && (
                  <div className="absolute top-6 right-6 bg-red-500/10 text-red-500 text-[8px] font-semibold px-2 py-1 rounded border border-red-500/20 uppercase">
                    Out of Stock
                  </div>
                )}
                {product.approved && product.inStock && product.stockCount < 10 && (
                  <div className="absolute top-6 right-6 bg-orange-500/10 text-orange-500 text-[8px] font-semibold px-2 py-1 rounded border border-orange-500/20 uppercase">
                    Low Stock
                  </div>
                )}

                <div className="flex gap-6 mb-8">
                  <div className="w-24 h-24 bg-black rounded-3xl overflow-hidden border border-gray-800 shrink-0 relative group/img">
                    <img 
                      src={product.image} 
                      className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-all duration-700" 
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x300/1f2937/eab308?text=Product';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">SKU: {product.id}</p>
                     <h4 className="text-lg font-semibold text-white line-clamp-2 leading-tight group-hover:text-yellow-500 transition-colors mb-2 uppercase">{product.name}</h4>
                     <div className="flex items-center gap-2 mb-2">
                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{product.category}</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <Star size={12} className="fill-yellow-500 text-yellow-500" />
                       <span className="text-[10px] font-bold text-yellow-500">{product.rating}</span>
                       <span className="text-[10px] text-gray-600">({product.reviewCount})</span>
                     </div>
                  </div>
                </div>

                {/* Product Metrics */}
                <div className="grid grid-cols-3 gap-4 border-y border-gray-900/50 py-6 mb-6">
                   <div className="text-center">
                     <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Views</p>
                     <p className="text-base font-semibold text-white">{product.views.toLocaleString()}</p>
                   </div>
                   <div className="text-center border-x border-gray-900/50">
                     <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Orders</p>
                     <p className="text-base font-semibold text-green-500">{product.orders}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Revenue</p>
                     <p className="text-base font-semibold text-yellow-500">{formatPrice(product.revenue)}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-gray-900/50 pb-6 mb-6">
                   <div>
                     <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Selling Price</p>
                     <p className="text-xl font-semibold text-white tracking-tight">{formatPrice(product.price)}</p>
                     {product.discount && (
                       <p className="text-[10px] text-green-500 font-bold mt-1">Save {product.discount}%</p>
                     )}
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Stock Level</p>
                     <p className={`text-xl font-semibold tracking-tight ${
                       product.inStock 
                         ? product.stockCount < 10 
                           ? 'text-orange-500' 
                           : 'text-green-500'
                         : 'text-red-500'
                     }`}>
                       {product.inStock ? `${product.stockCount} Units` : 'Sold Out'}
                     </p>
                   </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600 font-semibold uppercase tracking-widest">Brand</span>
                    <span className="text-gray-400 font-medium">{product.brand}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600 font-semibold uppercase tracking-widest">Listed Date</span>
                    <span className="text-gray-400 font-medium">Dec 15, 2025</span>
                  </div>
                </div>

                <div className="flex gap-3">
                   <button className="flex-1 bg-white/5 hover:bg-yellow-500 hover:text-black py-3 rounded-xl text-[9px] font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                     <Edit3 size={14} /> Update
                   </button>
                   <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[9px] font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                     <Eye size={14} /> Preview
                   </button>
                   <button className="w-12 h-12 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl flex items-center justify-center transition-all border border-transparent hover:border-red-500/20">
                     <Trash2 size={16} />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
            <p className="text-gray-500 text-sm mb-8">Try adjusting your filters or search criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 rounded-2xl transition-all text-[10px] uppercase tracking-widest"
            >
              Clear Filters
            </button>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="mt-20 text-center">
             <button className="bg-transparent border border-gray-800 text-gray-600 font-semibold px-12 py-4 rounded-full text-[10px] uppercase tracking-widest hover:text-white hover:border-white transition-all">
               Load More Products
             </button>
          </div>
        )}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-semibold text-sm transition-all ${
      active ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })} {label}
  </button>
);

const StatCard = ({ label, value, icon }: any) => (
  <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-10 flex items-center gap-8 group hover:border-gray-800 transition-all">
    <div className="w-16 h-16 bg-black border border-gray-800 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <div>
      <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

const PerformanceCard = ({ label, value, icon, trend }: any) => (
  <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-8 group hover:border-gray-800 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-black border border-gray-800 rounded-2xl flex items-center justify-center">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{trend}</span>
    </div>
    <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">{label}</p>
    <h3 className="text-2xl font-semibold text-white tracking-tight">{value}</h3>
  </div>
);

export default SellerProductListing;
