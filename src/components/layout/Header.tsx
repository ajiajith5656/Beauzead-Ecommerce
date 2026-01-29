import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Package, ChevronDown, Loader2, Menu } from 'lucide-react';
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
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
        setShowLoginDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowProfileDropdown(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  // Get display name from user
  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.email) {
      // Extract name from email (before @)
      return user.email.split('@')[0];
    }
    return 'User';
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

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-gray-900 text-gold border border-gray-700 rounded-lg px-3 py-2 pr-8 text-sm font-medium hover:border-gold transition-all duration-300 cursor-pointer"
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
              className="text-sm font-medium text-gold hover:text-gold-light transition-all duration-300"
            >
              Become a Seller
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-900 rounded-lg transition-all duration-300">
              <Heart className="h-6 w-6 text-gold" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-900 rounded-lg transition-all duration-300">
              <ShoppingCart className="h-6 w-6 text-gold" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-900"
                >
                  <User className="h-5 w-5 text-gold" />
                  <span className="text-white font-medium text-sm">
                    {getDisplayName()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gold" />
                </button>

                {showProfileDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-gray-900 border-2 border-gold rounded-lg shadow-xl py-2 animate-fadeIn"
                    onMouseLeave={() => setShowProfileDropdown(false)}
                  >
                    <Link
                      to="/user/dashboard"
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-800 transition-all duration-300"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User className="inline h-4 w-4 mr-3 text-gold" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-800 transition-all duration-300"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Package className="inline h-4 w-4 mr-3 text-gold" />
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-800 transition-all duration-300"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Heart className="inline h-4 w-4 mr-3 text-gold" />
                      My Wishlist
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all duration-300"
                    >
                      <LogOut className="inline h-4 w-4 mr-3" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onMouseEnter={() => setShowLoginDropdown(true)}
                  onClick={() => navigate('/login')}
                  className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gold transition-all duration-300 text-sm"
                >
                  Login
                </button>

                {showLoginDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-gray-900 border-2 border-gold rounded-lg shadow-xl py-2 animate-fadeIn"
                    onMouseLeave={() => setShowLoginDropdown(false)}
                  >
                    <div className="px-4 py-2 text-xs text-gray-400 font-medium uppercase">
                      Quick Access
                    </div>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-800 transition-all duration-300"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      <User className="inline h-4 w-4 mr-3 text-gold" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right Side - Only Cart, Wishlist, and Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative p-2">
              <Heart className="h-6 w-6 text-gold" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gold" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gold"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-gray-900 border-t border-gold">
          <div className="px-4 py-3 space-y-2">
            {/* Currency Selector */}
            <div className="relative mb-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full appearance-none bg-black text-gold border border-gray-700 rounded-lg px-3 py-2 text-sm font-medium"
                disabled={currencyLoading}
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Login/Profile Section */}
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-white font-medium border-b border-gray-700">
                  {getDisplayName()}
                </div>
                <Link
                  to="/user/dashboard"
                  className="block px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <User className="inline h-4 w-4 mr-2 text-gold" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Package className="inline h-4 w-4 mr-2 text-gold" />
                  Orders
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded transition-all duration-300"
                >
                  <LogOut className="inline h-4 w-4 mr-2" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block bg-white text-black font-semibold px-4 py-2 rounded-lg text-center hover:bg-gold transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-black border-2 border-gold text-gold font-semibold px-4 py-2 rounded-lg text-center hover:bg-gold hover:text-black transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Become a Seller */}
            <Link
              to="/seller/signup"
              className="block px-3 py-2 text-sm text-gold hover:bg-gray-800 rounded transition-all duration-300"
              onClick={() => setShowMobileMenu(false)}
            >
              Become a Seller
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
