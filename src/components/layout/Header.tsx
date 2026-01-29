import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Package, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { SUPPORTED_CURRENCIES } from '../../utils/currency';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { currency, setCurrency, loading: currencyLoading } = useCurrency();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setShowProfileDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gold shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/logo/logo.png" 
              alt="Beauzead" 
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback to text logo if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-2xl font-bold text-gold">Beauzead</span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-gray-900 text-gold border border-gray-700 rounded-lg px-3 py-2 pr-8 text-sm font-medium hover:border-gold transition-colors cursor-pointer"
                disabled={currencyLoading}
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
              {currencyLoading && (
                <Loader2 className="absolute right-2 top-2.5 h-4 w-4 text-gold animate-spin" />
              )}
            </div>

            {/* Become a Seller Button */}
            <Link
              to="/seller/signup"
              className="hidden md:block text-sm font-medium text-gold hover:text-gold-light transition-colors"
            >
              Become a Seller
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-900 rounded-lg transition-colors">
              <Heart className="h-6 w-6 text-gold" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-900 rounded-lg transition-colors">
              <ShoppingCart className="h-6 w-6 text-gold" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-900 rounded-lg transition-colors"
                >
                  <User className="h-6 w-6 text-gold" />
                  <span className="hidden md:block text-gold text-sm font-medium">
                    {user.full_name || user.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gold" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gold rounded-lg shadow-lg py-2">
                    <Link
                      to="/user/dashboard"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User className="inline h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Package className="inline h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Heart className="inline h-4 w-4 mr-2" />
                      Wishlist
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-2">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
