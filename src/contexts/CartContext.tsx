import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Product } from '../types';
import logger from '../utils/logger';
import { createOrder } from '../graphql/mutations';

const client = generateClient();

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  createOrderFromCart: (userId: string, shippingAddress: any, billingAddress?: any, paymentMethod?: string) => Promise<any>;
  isCreatingOrder: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('beauzead_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        logger.error(error as Error, { context: 'Failed to load cart from localStorage' });
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('beauzead_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const createOrderFromCart = async (
    userId: string,
    shippingAddress: any,
    billingAddress?: any,
    paymentMethod: string = 'card'
  ) => {
    try {
      setIsCreatingOrder(true);

      if (items.length === 0) {
        throw new Error('Cart is empty. Cannot create order.');
      }

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const taxAmount = Math.round(subtotal * 0.18); // 18% GST
      const shippingCost = 100; // Fixed shipping for now
      const totalAmount = subtotal + taxAmount + shippingCost;

      // Prepare order items
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image_url,
      }));

      // Create order via GraphQL
      const orderInput = {
        user_id: userId,
        seller_id: items[0].product.seller_id || 'platform', // Use first item's seller
        order_number: `ORD-${Date.now()}`,
        status: 'pending',
        items: JSON.stringify(orderItems),
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        currency: 'INR',
        shipping_address: JSON.stringify(shippingAddress),
        billing_address: billingAddress ? JSON.stringify(billingAddress) : JSON.stringify(shippingAddress),
        payment_method: paymentMethod,
        payment_status: 'pending',
      };

      const response: any = await client.graphql({
        query: createOrder,
        variables: {
          input: orderInput,
        },
      });

      if (response.data?.createOrder) {
        logger.log('Order created successfully', response.data.createOrder);
        // Clear cart after successful order creation
        clearCart();
        return response.data.createOrder;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      logger.error(error as Error, { context: 'Failed to create order from cart' });
      throw error;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    createOrderFromCart,
    isCreatingOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
