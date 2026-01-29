import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Store, Shield, Globe, CreditCard, Lock } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gold">Beauzead</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary">
                User Login
              </Link>
              <Link to="/seller/login" className="text-gold hover:text-gold-light font-medium">
                Seller Login
              </Link>
              <Link to="/admin/login" className="text-gold hover:text-gold-light font-medium">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-gold">Beauzead Marketplace</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  A global marketplace infrastructure like Amazon and Flipkart. Featuring an elite dark-themed aesthetic with robust multi-tenant architecture supporting global commerce.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link to="/signup" className="btn-primary inline-flex items-center">
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/seller/signup" className="btn-secondary inline-flex items-center">
                      Become a Seller
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gold sm:text-4xl">
              Why Choose Beauzead?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              Experience premium e-commerce with cutting-edge features
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="card text-center">
                <div className="flex justify-center">
                  <Globe className="h-12 w-12 text-gold" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Global Marketplace</h3>
                <p className="mt-2 text-gray-400">
                  Real-time currency conversion for seamless international shopping
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center">
                  <Lock className="h-12 w-12 text-gold" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Secure Authentication</h3>
                <p className="mt-2 text-gray-400">
                  Email OTP verification and secure password management
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center">
                  <CreditCard className="h-12 w-12 text-gold" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Stripe Payment</h3>
                <p className="mt-2 text-gray-400">
                  Secure and reliable payment processing with Stripe
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center">
                  <Store className="h-12 w-12 text-gold" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Seller Dashboard</h3>
                <p className="mt-2 text-gray-400">
                  Comprehensive tools for sellers to manage their products
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center">
                  <Shield className="h-12 w-12 text-gold" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Admin Approval</h3>
                <p className="mt-2 text-gray-400">
                  Amazon-level approval system for sellers and admins
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center">
                  <ShoppingBag className="h-12 w-12 text-gold" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Premium Shopping</h3>
                <p className="mt-2 text-gray-400">
                  Elegant black and gold theme for a luxurious experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2026 Beauzead. All rights reserved.</p>
            <p className="mt-2 text-sm">A premium global marketplace platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
