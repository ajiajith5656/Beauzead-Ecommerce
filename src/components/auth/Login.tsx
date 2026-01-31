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
  const { signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, sign out any existing session to prevent "already signed in" error
      await signOut();
    } catch (err) {
      // Ignore signout errors, continue with login
      console.log('No existing session to sign out');
    }

    const result = await signIn(email, password);

    if (result.error) {
      // Better error messages
      const errorMessage = result.error.message || '';
      if (errorMessage.includes('Incorrect username or password')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('User does not exist')) {
        setError('No account found with this email. Please sign up first.');
      } else {
        setError(errorMessage || 'Failed to sign in');
      }
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
        navigate('/'); // Users go to homepage
      }
      setLoading(false);
    }, 500);
  };

  const getSignupLink = () => {
    if (role === 'admin') return null; // Admin signup disabled - create via AWS CLI only
    if (role === 'seller') return '/seller/signup';
    return '/signup';
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
          <h1 className="text-2xl md:text-3xl font-semibold">Sign in to your account</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your email and password to continue.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none text-sm"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-gray-500 hover:text-black"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {getSignupLink() && (
            <div className="text-center text-sm text-gray-600">
              New here?{' '}
              <Link to={getSignupLink()!} className="font-semibold text-black hover:underline">
                Create your account
              </Link>
            </div>
          )}

          {role === 'admin' && !getSignupLink() && (
            <div className="text-center text-sm text-gray-500">
              Admin accounts are created via AWS CLI only.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
