import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Example component using Amplify's built-in Authenticator UI
 * This provides a complete authentication flow with sign-up, sign-in, password reset, etc.
 */
export function AmplifyAuthExample() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="p-8">
          <h1>Welcome, {user?.username || 'User'}!</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </Authenticator>
  );
}

/**
 * Example: Custom Sign Up Component
 */
export function CustomSignUp() {
  const { signUp, confirmSignUp } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [confirmCode, setConfirmCode] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await signUp(email, password, 'user', fullName);
    if (result.success) {
      setIsConfirming(true);
    } else {
      setError(result.error?.message || 'Sign up failed');
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await confirmSignUp(email, confirmCode);
    if (result.success) {
      alert('Email confirmed! You can now sign in.');
      // Redirect to login
    } else {
      setError(result.error?.message || 'Confirmation failed');
    }
  };

  if (isConfirming) {
    return (
      <form onSubmit={handleConfirm} className="w-full max-w-md mx-auto p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Confirm Your Email</h2>
        <p className="text-gray-600 mb-4">
          We sent a confirmation code to {email}
        </p>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Confirmation code"
          value={confirmCode}
          onChange={(e) => setConfirmCode(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold"
        >
          Confirm
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="w-full max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded font-semibold"
      >
        Sign Up
      </button>
    </form>
  );
}

/**
 * Example: Custom Sign In Component
 */
export function CustomSignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);
    if (!result.success) {
      setError(result.error?.message || 'Sign in failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignIn} className="w-full max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded font-semibold disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

/**
 * Example: Password Reset Component
 */
export function PasswordReset() {
  const { resetPassword, confirmPasswordReset } = useAuth();
  const [email, setEmail] = React.useState('');
  const [stage, setStage] = React.useState<'email' | 'confirm'>('email');
  const [confirmCode, setConfirmCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await resetPassword(email);
    if (result.success) {
      setStage('confirm');
    } else {
      setError(result.error?.message || 'Failed to send reset code');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await confirmPasswordReset(email, confirmCode, newPassword);
    if (result.success) {
      alert('Password reset successfully!');
      // Redirect to login
    } else {
      setError(result.error?.message || 'Failed to reset password');
    }
  };

  if (stage === 'confirm') {
    return (
      <form onSubmit={handleConfirmReset} className="w-full max-w-md mx-auto p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <input
          type="text"
          placeholder="Confirmation code"
          value={confirmCode}
          onChange={(e) => setConfirmCode(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold"
        >
          Confirm Reset
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetRequest} className="w-full max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded font-semibold"
      >
        Send Reset Code
      </button>
    </form>
  );
}
