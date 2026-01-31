import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { UserDashboard } from './pages/user/UserDashboard';
import ForgotPassword from './pages/user/ForgotPassword';
import SellerDashboard from './pages/seller/SellerDashboard';
import { SellerLanding } from './pages/seller/SellerLanding';
import SellerSignup from './pages/seller/SellerSignup';
import SellerLogin from './pages/seller/SellerLogin';
import SellerForgotPassword from './pages/seller/SellerForgotPassword';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/modules/AdminOverview';
import { UserManagement } from './pages/admin/modules/UserManagement';
import { SellerManagement } from './pages/admin/modules/SellerManagement';
import { ProductManagement } from './pages/admin/modules/ProductManagement';
import { OrderManagement } from './pages/admin/modules/OrderManagement';
import { CategoryManagement } from './pages/admin/modules/CategoryManagement';
import { BannerManagement } from './pages/admin/modules/BannerManagement';
import { PromotionManagement } from './pages/admin/modules/PromotionManagement';
import { ReviewManagement } from './pages/admin/modules/ReviewManagement';
import { ComplaintManagement } from './pages/admin/modules/ComplaintManagement';
import { AccountsManagement } from './pages/admin/modules/AccountsManagement';
import { ReportsManagement } from './pages/admin/modules/ReportsManagement';
import { AdminManagement } from './pages/admin/modules/AdminManagement';
import { ProfilePage } from './pages/admin/modules/ProfilePage';
import { SettingsPage } from './pages/admin/modules/SettingsPage';
import { NewHome } from './pages/NewHome';
import ProductDetailsPage from './pages/ProductDetailsPage';

// Simple path-based route guard
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authRole, loading } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (loading || !authRole) return;

    // SELLER ROUTES: Allow seller OR admin
    if (path.startsWith('/seller/dashboard') || path.startsWith('/seller/products') || 
        path.startsWith('/seller/orders') || path.startsWith('/seller/wallet')) {
      if (authRole !== 'seller' && authRole !== 'admin') {
        window.location.href = '/seller/login';
      }
    }

    // ADMIN ROUTES: Allow admin ONLY
    if (path.startsWith('/admin') && !path.includes('/login') && !path.includes('/signup')) {
      if (authRole !== 'admin') {
        window.location.href = '/seller/login';
      }
    }

    // USER DASHBOARD: Allow user ONLY
    if (path.startsWith('/user/dashboard')) {
      if (authRole !== 'user') {
        window.location.href = '/login';
      }
    }
  }, [authRole, path, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold text-xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <RouteGuard>
                <Routes>
                  <Route path="/" element={<NewHome />} />
                  <Route path="/products/:productId" element={<ProductDetailsPage />} />
                  
                  {/* User Routes */}
                  <Route path="/login" element={<Login role="user" />} />
                  <Route path="/signup" element={<Signup role="user" />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                  
                  {/* Seller Routes */}
                  <Route path="/seller" element={<SellerLanding />} />
                  <Route path="/seller/login" element={<SellerLogin />} />
                  <Route path="/seller/signup" element={<SellerSignup />} />
                  <Route path="/seller/forgot-password" element={<SellerForgotPassword />} />
                  <Route 
                    path="/seller/dashboard" 
                    element={
                      <SellerDashboard 
                        onLogout={() => window.location.href = '/seller/login'}
                        sellerEmail="seller@example.com"
                        onNavigate={(view: string) => {
                          if (view === 'seller-dashboard') window.location.href = '/seller/dashboard';
                          if (view === 'seller-verify') window.location.href = '/seller/verify';
                          if (view === 'seller-product-listing') window.location.href = '/seller/products';
                        }}
                        verificationStatus="unverified"
                      />
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<Navigate to="/seller/login" replace />} />
                  <Route path="/admin/signup" element={<Navigate to="/seller/login" replace />} />
                  
                  {/* Admin Layout Routes */}
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminOverview />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/sellers" element={<SellerManagement />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />
                    <Route path="/admin/categories" element={<CategoryManagement />} />
                    <Route path="/admin/banners" element={<BannerManagement />} />
                    <Route path="/admin/promotions" element={<PromotionManagement />} />
                    <Route path="/admin/reviews" element={<ReviewManagement />} />
                    <Route path="/admin/complaints" element={<ComplaintManagement />} />
                    <Route path="/admin/accounts" element={<AccountsManagement />} />
                    <Route path="/admin/reports" element={<ReportsManagement />} />
                    <Route path="/admin/admins" element={<AdminManagement />} />
                    <Route path="/admin/profile" element={<ProfilePage />} />
                    <Route path="/admin/settings" element={<SettingsPage />} />
                  </Route>
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </RouteGuard>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
