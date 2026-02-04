import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import logger from '../utils/logger';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('beauzead_wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        logger.error(error as Error, { context: 'Failed to load wishlist' });
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('beauzead_wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems((prevItems) => {
      if (!prevItems.find((item) => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
