import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { UserDashboard } from './pages/user/UserDashboard';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NewHome } from './pages/NewHome';
import OrdersPage from './pages/user/OrdersPage';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                <Route path="/" element={<NewHome />} />
                
                {/* User Routes */}
                <Route path="/login" element={<Login role="user" />} />
                <Route path="/signup" element={<Signup role="user" />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/orders" element={<OrdersPage />} />
                
                {/* Seller Routes */}
                <Route path="/seller/login" element={<Login role="seller" />} />
                <Route path="/seller/signup" element={<Signup role="seller" />} />
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
