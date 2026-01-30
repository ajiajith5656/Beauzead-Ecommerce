import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Loader2,
  Mail,
  User,
  Globe,
  Briefcase,
  Phone,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
// @ts-ignore
import { listCountryListBzdcores, listBusinessTypeBzdcores } from '../../graphql/queries';

type SignupStep = 'details' | 'otp' | 'success';

interface Country {
  id: string;
  countryName: string;
  shortCode: string;
  currency: string;
  dialCode?: string;
}

interface BusinessType {
  id: string;
  typeName: string;
  description?: string;
}

const SellerSignup: React.FC = () => {
  const [step, setStep] = useState<SignupStep>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryId: '',
    businessTypeId: '',
    mobile: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const client = generateClient();

  // Fetch countries and business types on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesResponse, businessTypesResponse] = await Promise.all([
          client.graphql({ query: listCountryListBzdcores }),
          client.graphql({ query: listBusinessTypeBzdcores }),
        ]);
        
        setCountries((countriesResponse.data as any).listCountryListBzdcores?.items || []);
        setBusinessTypes((businessTypesResponse.data as any).listBusinessTypeBzdcores?.items || []);
        
        // Set default country if available
        if ((countriesResponse.data as any).listCountryListBzdcores?.items?.length > 0) {
          setFormData(prev => ({
            ...prev,
            countryId: (countriesResponse.data as any).listCountryListBzdcores.items[0].id
          }));
        }
        if ((businessTypesResponse.data as any).listBusinessTypeBzdcores?.items?.length > 0) {
          setFormData(prev => ({
            ...prev,
            businessTypeId: (businessTypesResponse.data as any).listBusinessTypeBzdcores.items[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const selectedCountry = countries.find((c) => c.id === formData.countryId);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setStep('otp');
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

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setStep('success');
  };

  const finalizeSignup = () => {
    navigate('/seller/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4 z-[9999] text-white font-sans overflow-y-auto">
      {step !== 'success' && (
        <button
          onClick={step === 'details' ? () => navigate('/seller') : () => setStep('details')}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-semibold group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {step === 'details' ? 'Exit Application' : 'Back To Details'}
        </button>
      )}

      <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-500">
        {step === 'details' && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
                Create My Store
              </h1>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Register as a seller and start building your business.
              </p>
            </div>

            <div className="bg-[#0d0d0d] rounded-2xl p-8 md:p-10 border border-gray-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Business Country</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors">
                      <Globe size={18} />
                    </div>
                    <select
                      value={formData.countryId}
                      onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                      className="w-full bg-black border-2 border-gray-900 text-white rounded-xl pl-12 pr-10 py-3.5 text-sm focus:outline-none focus:border-yellow-500 transition-all appearance-none cursor-pointer"
                      disabled={countries.length === 0}
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.countryName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter legal name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-black border-2 border-gray-900 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-yellow-500 transition-all placeholder:text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Business Type</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors">
                      <Briefcase size={18} />
                    </div>
                    <select
                      value={formData.businessTypeId}
                      onChange={(e) => setFormData({ ...formData, businessTypeId: e.target.value })}
                      className="w-full bg-black border-2 border-gray-900 text-white rounded-xl pl-12 pr-10 py-3.5 text-sm focus:outline-none focus:border-yellow-500 transition-all appearance-none cursor-pointer"
                      disabled={businessTypes.length === 0}
                    >
                      {businessTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.typeName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Business Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="merchant@beauzead.store"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border-2 border-gray-900 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-yellow-500 transition-all placeholder:text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="w-24 bg-[#1a1a1a] border-2 border-gray-900 text-gray-500 rounded-xl px-4 py-3.5 text-sm font-semibold flex items-center justify-center select-none">
                      {selectedCountry?.dialCode || '+0'}
                    </div>
                    <div className="relative group flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="Mobile number"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full bg-black border-2 border-gray-900 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-yellow-500 transition-all placeholder:text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-semibold transition-all shadow-[0_15px_30px_rgba(234,179,8,0.15)] active:scale-95 flex items-center justify-center h-14 disabled:opacity-50 mt-4"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send OTP'}
                </button>
              </form>
            </div>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
                Verify Your Email
              </h1>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                We've sent a verification code to {formData.email}
              </p>
            </div>

            <div className="bg-[#0d0d0d] rounded-2xl p-8 md:p-10 border border-gray-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
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
                      className="w-full aspect-square bg-black border-2 border-gray-900 rounded-xl text-center text-xl font-semibold text-white focus:border-yellow-500 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length < 6}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-semibold transition-all shadow-[0_15px_30px_rgba(234,179,8,0.15)] active:scale-95 flex items-center justify-center h-14 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Verify OTP'}
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-xs font-semibold text-yellow-500/60 hover:text-yellow-500 transition-colors"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <p className="mt-8 text-center text-gray-700 text-[10px] font-semibold">
              Secure Merchant Verification <span className="mx-2">•</span> Encrypted Session
            </p>
          </>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                <CheckCircle2 size={48} className="animate-bounce" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
              Verification Successful
            </h1>
            <p className="text-gray-500 text-sm font-medium mb-12 leading-relaxed">
              Your seller account has been verified successfully. You are now ready to launch your store.
            </p>
            <button
              onClick={finalizeSignup}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-xl font-semibold transition-all shadow-2xl active:scale-95"
            >
              Enter Seller Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSignup;
