import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SellerDashboard from './SellerDashboard';
import { logger } from '../../utils/logger';

export const SellerDashboardWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user, currentAuthUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to seller landing page after logout
      navigate('/seller');
    } catch (error) {
      logger.error(error as Error, { context: 'Seller logout error' });
    }
  };

  const handleNavigate = (view: string) => {
    if (view === 'seller-dashboard') navigate('/seller/dashboard');
    if (view === 'seller-verify') navigate('/seller/verify');
    if (view === 'seller-product-listing') navigate('/seller/products');
  };

  // Get seller info from auth
  const sellerEmail = user?.email || currentAuthUser?.email || currentAuthUser?.attributes?.email || 'seller@example.com';
  const sellerPhone = user?.phone || currentAuthUser?.attributes?.phone_number || '';
  const sellerFullName = user?.full_name || currentAuthUser?.attributes?.name || 'Seller';
  const sellerCountry = 'India'; // This should come from user profile

  return (
    <SellerDashboard
      onLogout={handleLogout}
      sellerEmail={sellerEmail}
      sellerPhone={sellerPhone}
      sellerFullName={sellerFullName}
      sellerCountry={sellerCountry}
      onNavigate={handleNavigate}
      verificationStatus="unverified"
    />
  );
};
