import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, Globe, Loader2, ChevronDown } from 'lucide-react';
import { generateClient } from 'aws-amplify/api';
// @ts-ignore
import { listCountryListBzdcores } from '../../graphql/queries';

interface SignupProps {
  role?: 'user' | 'seller' | 'admin';
}

interface Country {
  id: string;
  countryName: string;
  shortCode: string;
  currency: string;
  dialCode?: string;
}

type SignupStep = 'details' | 'otp' | 'success';

export const Signup: React.FC<SignupProps> = ({ role = 'user' }) => {
  const [step, setStep] = useState<SignupStep>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { signUp } = useAuth();
  const client = generateClient();

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await client.graphql({ query: listCountryListBzdcores });
        const countriesData = (response.data as any).listCountryListBzdcores?.items || [];
        setCountries(countriesData);
        if (countriesData.length > 0) {
          setCountryId(countriesData[0].id);
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };
    fetchCountries();
  }, []);

  const selectedCountry = countries.find((c) => c.id === countryId);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (password.length > 16) {
      errors.push('Password must not exceed 16 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Must contain at least one special character (!@#$%^&*...)');
    }
    
    return errors;
  };

  const validateFullName = (name: string): string => {
    if (!name || name.length === 0) {
      return 'Full name is required';
    }
    if (!/^[A-Z]/.test(name)) {
      return 'First letter must be capital';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      setPasswordErrors(validatePassword(value));
    } else {
      setPasswordErrors([]);
    }
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setError('');
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate full name
    const nameError = validateFullName(fullName);
    if (nameError) {
      setError(nameError);
      return;
    }

    // Validate password
    const pwErrors = validatePassword(password);
    if (pwErrors.length > 0) {
      setPasswordErrors(pwErrors);
      return;
    }

    if (!countryId) {
      setError('Please select a country');
      return;
    }

    setLoading(true);
    setStep('otp');
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    setLoading(true);

    const result = await signUp(email, password, role, fullName, selectedCountry?.currency);

    if (result.error) {
      setError(result.error.message || 'Failed to sign up');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const getRoleTitle = () => {
    if (role === 'admin') return 'Admin';
    if (role === 'seller') return 'Seller';
    return 'User';
  };

  const getLoginLink = () => {
    if (role === 'admin') return '/admin/login';
    if (role === 'seller') return '/seller/login';
    return '/login';
  };

  const getApprovalMessage = () => {
    if (role === 'seller') {
      return 'Your seller account is pending approval. You will receive an email once approved.';
    }
    if (role === 'admin') {
      return 'Your admin account is pending approval. You will receive an email once approved.';
    }
    return 'Please check your email to verify your account.';
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="card text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-gold mb-4" />
            <h2 className="text-2xl font-bold text-gold mb-4">Registration Successful!</h2>
            <p className="text-gray-300 mb-6">{getApprovalMessage()}</p>
            <p className="text-gray-400 mb-4 text-sm">Selected Country: <span className="text-gold font-semibold">{selectedCountry?.countryName}</span></p>
            <p className="text-gray-400 mb-6 text-sm">Currency: <span className="text-gold font-semibold">{selectedCountry?.currency}</span></p>
            <Link to={getLoginLink()} className="btn-primary inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gold">
            Beauzead
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create your {getRoleTitle()} account
          </p>
        </div>

        {step === 'details' && (
          <form className="mt-8 space-y-6 card" onSubmit={handleDetailsSubmit}>
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
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <select
                    id="country"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    className="input-field pl-10 pr-10 w-full appearance-none"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
                {selectedCountry && (
                  <p className="mt-1 text-xs text-gray-400">Currency: <span className="text-gold font-semibold">{selectedCountry.currency}</span></p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => handleFullNameChange(e.target.value)}
                    className="input-field pl-10 w-full"
                    placeholder="First letter must be capital"
                  />
                </div>
              </div>

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
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={`input-field pl-10 pr-10 w-full ${
                      passwordErrors.length > 0 ? 'border-red-500' : ''
                    }`}
                    placeholder="Min 8 chars, upper/lower, number, special char"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gold"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordErrors.map((err, idx) => (
                      <p key={idx} className="text-xs text-red-400 flex items-start gap-2">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                        {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || passwordErrors.length > 0 || !fullName || !email || !password || !countryId}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link to={getLoginLink()} className="font-medium text-gold hover:text-gold-light">
                Sign in
              </Link>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form className="mt-8 space-y-6 card" onSubmit={handleVerifyOtp}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Verify Your Email</h3>
              <p className="text-sm text-gray-400">We've sent a 6-digit code to {email}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      if (el) otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="input-field text-center text-2xl font-bold"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? <Loader2 className="inline animate-spin mr-2" size={20} /> : ''}
                Verify OTP
              </button>
            </div>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="font-medium text-gold hover:text-gold-light"
              >
                Back to Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
