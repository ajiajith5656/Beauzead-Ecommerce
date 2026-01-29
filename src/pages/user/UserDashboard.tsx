import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Package, LogOut } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-900 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gold">Beauzead</h1>
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
        <h2 className="text-3xl font-bold text-gold mb-8">User Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/user/orders')}
            className="card cursor-pointer hover:border-gold transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">My Orders</h3>
              <Package className="h-8 w-8 text-gold" />
            </div>
            <p className="text-gray-400">View and track your orders</p>
          </div>

          <div className="card cursor-pointer hover:border-gold transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Shopping Cart</h3>
              <ShoppingBag className="h-8 w-8 text-gold" />
            </div>
            <p className="text-gray-400">View items in your cart</p>
          </div>

          <div className="card cursor-pointer hover:border-gold transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Wishlist</h3>
              <Heart className="h-8 w-8 text-gold" />
            </div>
            <p className="text-gray-400">View your saved items</p>
          </div>
        </div>

        <div className="mt-8 card">
          <h3 className="text-2xl font-semibold text-gold mb-4">Recent Orders</h3>
          <div className="text-center text-gray-400 py-8">
            No orders yet. Start shopping to see your orders here!
          </div>
        </div>
      </div>
    </div>
  );
};
