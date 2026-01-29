import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchExchangeRates } from '../utils/currency';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  loading: boolean;
  rates: { [key: string]: number };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>('INR'); // Default to INR for guest users
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('beauzead_currency');
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Fetch exchange rates on mount and periodically
  useEffect(() => {
    const loadRates = async () => {
      setLoading(true);
      try {
        const fetchedRates = await fetchExchangeRates();
        setRates(fetchedRates);
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRates();
    // Refresh rates every hour
    const interval = setInterval(loadRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('beauzead_currency', newCurrency);
  };

  const convertPrice = (amount: number, fromCurrency: string = 'USD'): number => {
    if (loading || !rates[currency] || !rates[fromCurrency]) {
      return amount;
    }

    // Convert from source currency to USD, then to target currency
    const amountInUSD = fromCurrency === 'USD' ? amount : amount / rates[fromCurrency];
    const convertedAmount = currency === 'USD' ? amountInUSD : amountInUSD * rates[currency];

    return Math.round(convertedAmount * 100) / 100;
  };

  const value = {
    currency,
    setCurrency,
    convertPrice,
    loading,
    rates,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
