import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Bell, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleAccountClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gold z-50">
      <div className="flex items-center justify-around py-2">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 px-4 py-2 transition-all duration-300 ${
            isActive('/') ? 'text-gold' : 'text-gray-400'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/orders"
          className={`flex flex-col items-center space-y-1 px-4 py-2 transition-all duration-300 ${
            isActive('/orders') ? 'text-gold' : 'text-gray-400'
          }`}
        >
          <Package className="h-6 w-6" />
          <span className="text-xs">Orders</span>
        </Link>

        <Link
          to="/notifications"
          className={`flex flex-col items-center space-y-1 px-4 py-2 relative transition-all duration-300 ${
            isActive('/notifications') ? 'text-gold' : 'text-gray-400'
          }`}
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs">Notifications</span>
          {/* Notification badge */}
          <span className="absolute top-1 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </Link>

        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center space-y-1 px-4 py-2 transition-all duration-300 ${
            isActive('/profile') || isActive('/login') ? 'text-gold' : 'text-gray-400'
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">{user ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
};
