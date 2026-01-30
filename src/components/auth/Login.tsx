import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  role?: 'user' | 'seller' | 'admin';
}

export const Login: React.FC<LoginProps> = ({ role = 'user' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
      return;
    }

    // Wait a moment for the user profile to be fetched
    setTimeout(() => {
      // Redirect based on role - the AuthContext will handle role verification
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/user/dashboard');
      }
      setLoading(false);
    }, 500);
  };

  const getRoleTitle = () => {
    if (role === 'admin') return 'Admin';
    if (role === 'seller') return 'Seller';
    return 'User';
  };

  const getSignupLink = () => {
    if (role === 'admin') return null; // Admin signup disabled - create via AWS CLI only
    if (role === 'seller') return '/seller/signup';
    return '/signup';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gold">
            Beauzead
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {getRoleTitle()} Login
          </p>
        </div>
        <form className="mt-8 space-y-6 card" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900 bg-opacity-20 p-4 border border-red-700">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-gold hover:text-gold-light">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {getSignupLink() && (
            <div className="text-center text-sm">
              <span className="text-gray-400">Don't have an account? </span>
              <Link to={getSignupLink()!} className="font-medium text-gold hover:text-gold-light">
                Sign up
              </Link>
            </div>
          )}
          
          {role === 'admin' && !getSignupLink() && (
            <div className="text-center text-sm text-gray-400">
              Admin accounts are created via AWS CLI only.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
