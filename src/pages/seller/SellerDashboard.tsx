import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, DollarSign, BarChart2, 
  Package, Settings, LogOut, Bell, TrendingUp, 
  Plus, Search, Filter, MoreVertical, CheckCircle2, 
  Clock, AlertTriangle, ArrowUpRight, ArrowDownRight,
  ShieldCheck, Globe, CreditCard, ChevronRight, X, Info,
  Eye, Wallet, TrendingDown
} from 'lucide-react';
import { formatPrice } from '../../constants';

interface SellerDashboardProps {
  onLogout: () => void;
  sellerEmail: string;
  onNavigate: (view: any) => void;
  verificationStatus: 'unverified' | 'pending' | 'verified';
}

type DashboardSection = 'overview' | 'products' | 'orders' | 'sales' | 'payouts' | 'settings';

const SellerDashboard: React.FC<SellerDashboardProps> = ({ onLogout, sellerEmail, onNavigate, verificationStatus }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  
  const isPending = verificationStatus === 'pending';
  const isVerified = verificationStatus === 'verified';

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      <aside className="w-72 border-r border-gray-900 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="mb-12 cursor-pointer" onClick={() => onNavigate('seller-dashboard')}>
          <h1 className="text-2xl font-semibold text-white">Seller Hub</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Merchant Portal</p>
        </div>

        <nav className="space-y-3 flex-1">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Overview" 
            active={activeSection === 'overview'} 
            onClick={() => setActiveSection('overview')} 
          />
          <NavItem 
            icon={<Package />} 
            label="My Products" 
            active={activeSection === 'products'} 
            onClick={() => onNavigate('seller-product-listing')} 
            disabled={!isVerified}
          />
          <NavItem 
            icon={<ShoppingBag />} 
            label="Order Tracking" 
            active={activeSection === 'orders'} 
            onClick={() => setActiveSection('orders')} 
            disabled={!isVerified}
          />
          <NavItem 
            icon={<BarChart2 />} 
            label="Sales Reports" 
            active={activeSection === 'sales'} 
            onClick={() => setActiveSection('sales')} 
            disabled={!isVerified}
          />
          <NavItem 
            icon={<DollarSign />} 
            label="Payout Info" 
            active={activeSection === 'payouts'} 
            onClick={() => setActiveSection('payouts')} 
            disabled={!isVerified}
          />
          <NavItem 
            icon={<Settings />} 
            label="Store Settings" 
            active={activeSection === 'settings'} 
            onClick={() => setActiveSection('settings')} 
          />
        </nav>

        <div className="pt-8 border-t border-gray-900">
          <button onClick={onLogout} className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-500/5 rounded-xl font-bold text-sm transition-all text-left">
            <LogOut size={18} />
            End Session
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 md:p-16 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h2 className="text-4xl font-semibold text-white tracking-tight">
              {activeSection === 'overview' ? 'Overview' : activeSection.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Manage your premium marketplace presence</p>
          </div>
          
          <div className="flex items-center gap-5 w-full md:w-auto">
            {verificationStatus === 'unverified' && (
              <button 
                onClick={() => onNavigate('seller-verify')}
                className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest animate-pulse"
              >
                <ShieldCheck size={18} />
                Verify My Store
              </button>
            )}

            {isPending && (
              <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                <Clock size={18} />
                Pending Approval
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <button className="p-4 bg-gray-900 border border-gray-800 rounded-2xl relative text-gray-400 hover:text-white transition-colors">
                <Bell size={22} />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-black"></span>
              </button>
              <div className="h-12 w-px bg-gray-900 mx-2"></div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Merchant Elite</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isVerified ? 'text-green-500' : isPending ? 'text-blue-500' : 'text-gray-600'}`}>
                    {isVerified ? 'Verified Partner' : isPending ? 'Review In Progress' : 'Unverified Status'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-yellow-500 font-bold text-lg">
                  BZ
                </div>
              </div>
            </div>
          </div>
        </header>

        {activeSection === 'overview' && renderOverview(verificationStatus, onNavigate)}
        
        {activeSection !== 'overview' && activeSection !== 'settings' && !isVerified && (
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-[3rem] p-20 text-center animate-in fade-in duration-500">
             <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-gray-600">
               <ShieldCheck size={48} />
             </div>
             <h3 className="text-3xl font-semibold mb-3">Access Restricted</h3>
             <p className="text-gray-500 text-base font-medium mb-12 max-w-lg mx-auto leading-relaxed">Full dashboard capabilities are unlocked once your business verification is completed and approved by our administration team.</p>
             {verificationStatus === 'unverified' && (
               <button 
                 onClick={() => onNavigate('seller-verify')}
                 className="bg-white text-black font-bold px-12 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-500 transition-all shadow-2xl"
               >
                 Start Verification Now
               </button>
             )}
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-[3rem] p-20 text-center">
            <Settings size={64} className="mx-auto mb-8 text-gray-800" />
            <h3 className="text-3xl font-semibold mb-3">Store Configuration</h3>
            <p className="text-gray-500 text-base font-medium">Store profile and policy settings are being updated for production.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const renderOverview = (status: 'unverified' | 'pending' | 'verified', onNavigate: (v: any) => void) => (
  <div className="animate-in fade-in duration-500">
    {status === 'unverified' && (
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-[2.5rem] p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-yellow-500/10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-yellow-500 rounded-[1.5rem] flex items-center justify-center text-black shadow-2xl shadow-yellow-500/20">
            <AlertTriangle size={36} />
          </div>
          <div>
            <h4 className="text-2xl font-semibold">Store Verification Required</h4>
            <p className="text-gray-500 text-base font-medium mt-1">Verify your business identity to list products and access global customers.</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('seller-verify')}
          className="bg-white text-black font-bold px-10 py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-500 transition-all active:scale-95 shadow-2xl"
        >
          Begin Verification
        </button>
      </div>
    )}

    {status === 'pending' && (
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-blue-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
            <Clock size={36} />
          </div>
          <div>
            <h4 className="text-2xl font-semibold">Review In Progress</h4>
            <p className="text-gray-500 text-base font-medium mt-1">Our compliance team is reviewing your documents. Turnaround is typically 48-72 hours.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-blue-500/10 px-8 py-4 rounded-xl border border-blue-500/20">
           <Info size={18} /> Pending Approval
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
      <MerchantStat label="Total Payouts" value={status === 'verified' ? "$12,850.00" : "$0.00"} trend={status === 'verified' ? "+14.2%" : "0%"} icon={<DollarSign />} positive />
      <MerchantStat label="Active Orders" value={status === 'verified' ? "28" : "0"} trend={status === 'verified' ? "+5.1%" : "0%"} icon={<Package />} positive />
      <MerchantStat label="Store Visits" value={status === 'verified' ? "5.2k" : "0"} trend={status === 'verified' ? "-2.4%" : "0%"} icon={<BarChart2 />} positive={status === 'verified' ? false : true} />
      <MerchantStat label="Growth Rate" value={status === 'verified' ? "24%" : "0%"} trend={status === 'verified' ? "+12.1%" : "0%"} icon={<TrendingUp />} positive />
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-900 rounded-[3rem] p-12 flex flex-col justify-center items-center text-center group hover:border-yellow-500/20 transition-all">
        <div className="w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center text-gray-700 mb-8 border border-gray-800 group-hover:scale-110 transition-transform">
          <BarChart2 size={48} />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">Performance Analytics</h3>
        <p className="text-gray-500 text-base font-medium max-w-sm leading-relaxed">Deep-learning sales insights and global traffic trends will be available once your store is active.</p>
      </div>
      
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-[3rem] p-12 flex flex-col">
        <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-10 flex items-center justify-between">
          Recent Orders
          <button className="text-yellow-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
        </h3>
        <div className="space-y-10 flex-1">
          {status === 'verified' ? (
            <>
              <RecentOrder customer="James Winston" amount="$1,200.00" time="2 hours ago" status="Shipped" />
              <RecentOrder customer="Elena Russo" amount="$450.00" time="5 hours ago" status="Placed" />
              <RecentOrder customer="Marcus Kane" amount="$890.00" time="1 day ago" status="Delivered" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-700 text-xs font-semibold uppercase tracking-widest gap-4 opacity-50">
               <Package size={40} className="text-gray-800" />
               No Transaction Logs
            </div>
          )}
        </div>
        <button disabled={status !== 'verified'} onClick={() => onNavigate('seller-product-listing')} className="mt-12 w-full py-5 bg-[#111] hover:bg-white hover:text-black border border-gray-800 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl">
          Manage Inventory
        </button>
      </div>
    </div>
  </div>
);

const NavItem = ({ icon, label, active, onClick, disabled = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, disabled?: boolean }) => (
  <button 
    disabled={disabled}
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm text-left ${
    disabled ? 'opacity-20 cursor-not-allowed' :
    active ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-500/20 scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-gray-900'
  }`}>
    {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
    {label}
  </button>
);

const MerchantStat = ({ label, value, trend, icon, positive }: { label: string, value: string, trend: string, icon: React.ReactNode, positive: boolean }) => (
  <div className="bg-[#0a0a0a] border border-gray-900 p-10 rounded-[2.5rem] hover:border-yellow-500/30 transition-all group">
    <div className="flex justify-between items-start mb-8">
      <div className="w-14 h-14 bg-black border border-gray-800 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
  </div>
);

const RecentOrder = ({ customer, amount, time, status }: { customer: string, amount: string, time: string, status: string }) => (
  <div className="flex items-center justify-between border-b border-gray-900 pb-8 last:border-0 last:pb-0 group">
    <div className="flex items-center gap-5">
      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
      <div>
        <p className="text-sm font-bold text-white">{customer}</p>
        <p className="text-[10px] font-semibold text-gray-500 flex items-center gap-2 mt-0.5">
          {time} <span className="text-gray-800">•</span> <span className="text-yellow-500/80 uppercase tracking-wider">{status}</span>
        </p>
      </div>
    </div>
    <span className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">{amount}</span>
  </div>
);

export default SellerDashboard;
