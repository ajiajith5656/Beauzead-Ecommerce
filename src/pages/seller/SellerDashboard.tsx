import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, ShoppingCart, LogOut, AlertCircle } from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/seller/login');
  };

  if (!user?.approved) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="card max-w-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gold mb-4" />
          <h2 className="text-2xl font-bold text-gold mb-4">Account Pending Approval</h2>
          <p className="text-gray-300 mb-6">
            Your seller account is currently under review. You will receive an email notification once your account has been approved by our admin team.
          </p>
          <button onClick={handleSignOut} className="btn-secondary">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-900 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gold">Beauzead Seller</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.full_name}</span>
              <button
                onClick={handleSignOut}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gold">Seller Dashboard</h2>
          <button className="btn-primary">Add New Product</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Total Products</h3>
              <Package className="h-8 w-8 text-gold" />
            </div>
            <p className="text-3xl font-bold text-gold">0</p>
            <p className="text-gray-400 text-sm mt-2">Active listings</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Total Sales</h3>
              <DollarSign className="h-8 w-8 text-gold" />
            </div>
            <p className="text-3xl font-bold text-gold">$0</p>
            <p className="text-gray-400 text-sm mt-2">All time revenue</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Total Orders</h3>
              <ShoppingCart className="h-8 w-8 text-gold" />
            </div>
            <p className="text-3xl font-bold text-gold">0</p>
            <p className="text-gray-400 text-sm mt-2">Orders received</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-2xl font-semibold text-gold mb-4">Recent Products</h3>
          <div className="text-center text-gray-400 py-8">
            No products yet. Start adding products to your store!
          </div>
        </div>
      </div>
    </div>
  );
};
