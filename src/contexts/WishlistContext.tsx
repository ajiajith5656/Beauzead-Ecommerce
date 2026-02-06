import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Product } from '../types';
import logger from '../utils/logger';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';

const client = generateClient();

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncToBackend: (userId: string) => Promise<void>;
  loadFromBackend: (userId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('beauzead_wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        logger.error(error as Error, { context: 'Failed to load wishlist from localStorage' });
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('beauzead_wishlist', JSON.stringify(items));
    
    // Auto-sync to backend if user is logged in
    if (userId && items.length >= 0) {
      syncToBackend(userId).catch(err => 
        logger.error(err, { context: 'Auto-sync wishlist failed' })
      );
    }
  }, [items]);

  // Sync wishlist to backend (store in User.preferences as JSON)
  const syncToBackend = async (uid: string) => {
    try {
      const wishlistData = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        seller_id: item.seller_id,
        category: item.category,
      }));

      await client.graphql({
        query: updateUser,
        variables: {
          input: {
            id: uid,
            preferences: JSON.stringify({ wishlist: wishlistData }),
          },
        },
      });

      logger.log('Wishlist synced to backend', { itemCount: items.length });
    } catch (error) {
      logger.error(error as Error, { context: 'Failed to sync wishlist to backend' });
    }
  };

  // Load wishlist from backend (from User.preferences)
  const loadFromBackend = async (uid: string) => {
    try {
      const response: any = await client.graphql({
        query: getUser,
        variables: { id: uid },
      });

      if (response.data?.getUser?.preferences) {
        const preferences = JSON.parse(response.data.getUser.preferences);
        if (preferences.wishlist && Array.isArray(preferences.wishlist)) {
          setItems(preferences.wishlist);
          localStorage.setItem('beauzead_wishlist', JSON.stringify(preferences.wishlist));
          logger.log('Wishlist loaded from backend', { itemCount: preferences.wishlist.length });
        }
      }
      setUserId(uid);
    } catch (error) {
      logger.error(error as Error, { context: 'Failed to load wishlist from backend' });
    }
  };

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
    syncToBackend,
    loadFromBackend,
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
