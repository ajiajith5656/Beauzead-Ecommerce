import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SellerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signOut, authRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First, sign out any existing session to prevent "already signed in" error
      await signOut();
    } catch (err) {
      // Ignore signout errors, continue with login
      console.log('No existing session to sign out');
    }

    const { error: signInError, role } = await signIn(email, password);

    setIsLoading(false);
    if (signInError) {
      // Better error messages
      const errorMessage = signInError.message || '';
      if (errorMessage.includes('Incorrect username or password')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('User does not exist')) {
        setError('No account found with this email. Please sign up first.');
      } else {
        setError(errorMessage || 'Failed to sign in');
      }
      return;
    }

    // Wait longer for role to be properly set and JWT to be decoded
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Seller login - Returned role from signIn:', role);
    console.log('Seller login - Current authRole from context:', authRole);

    // Use the role returned from signIn (which includes resolveRoleFromSession)
    const finalRole = role || authRole;
    
    console.log('Final role to use for navigation:', finalRole);

    if (finalRole === 'admin') {
      console.log('Redirecting admin to /admin');
      navigate('/admin');
      return;
    }

    if (finalRole === 'seller') {
      console.log('Redirecting seller to /seller/dashboard');
      navigate('/seller/dashboard');
      return;
    }

    if (finalRole === 'user') {
      console.log('User role detected, redirecting to homepage');
      navigate('/');
      return;
    }

    // Final fallback - if still no role detected
    console.warn('No role detected after login, redirecting to homepage');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/95 text-black rounded-2xl shadow-2xl border border-white/40 p-8 md:p-10 relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-xs font-semibold text-gray-500 hover:text-black"
        >
          Back to Home
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Seller & Admin Login</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your email and password to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="seller-email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="seller-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="seller-password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="seller-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                to="/seller/forgot-password"
                className="text-xs font-semibold text-gray-500 hover:text-black"
              >
                Forgot Key?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          New here?{' '}
          <Link to="/seller/signup" className="font-semibold text-black hover:underline">
            Create your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
