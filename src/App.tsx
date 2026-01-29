import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { UserDashboard } from './pages/user/UserDashboard';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { SellerLanding } from './pages/seller/SellerLanding';
import SellerSignup from './pages/seller/SellerSignup';
import SellerLogin from './pages/seller/SellerLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NewHome } from './pages/NewHome';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                <Route path="/" element={<NewHome />} />
                <Route path="/products/:productId" element={<ProductDetailsPage />} />
                
                {/* User Routes */}
                <Route path="/login" element={<Login role="user" />} />
                <Route path="/signup" element={<Signup role="user" />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                
                {/* Seller Routes */}
                <Route path="/seller" element={<SellerLanding />} />
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/signup" element={<SellerSignup />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login role="admin" />} />
                <Route path="/admin/signup" element={<Signup role="admin" />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
