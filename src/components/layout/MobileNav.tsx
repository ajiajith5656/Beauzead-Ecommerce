import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bell, Package } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gold z-50">
      <div className="flex items-center justify-around py-2">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            isActive('/') ? 'text-gold' : 'text-gray-400'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/orders"
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            isActive('/orders') ? 'text-gold' : 'text-gray-400'
          }`}
        >
          <Package className="h-6 w-6" />
          <span className="text-xs">Orders</span>
        </Link>

        <Link
          to="/notifications"
          className={`flex flex-col items-center space-y-1 px-4 py-2 relative ${
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

        <Link
          to="/user/dashboard"
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            isActive('/user/dashboard') ? 'text-gold' : 'text-gray-400'
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Account</span>
        </Link>
      </div>
    </nav>
  );
};
