import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';

interface CartItemData {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  totalPrice: number;
}

export const CartPage: React.FC = () => {
  const { user, currentAuthUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    if (!user && !currentAuthUser) {
      navigate('/login');
      return;
    }

    // Simulate fetching cart
    const loadCart = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual GraphQL query
        const mockCart: CartItemData[] = [
          {
            id: 'cart1',
            productId: 'prod1',
            productName: 'Premium Wireless Headphones',
            brand: 'AudioTech',
            price: 4999,
            quantity: 1,
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
            selectedSize: 'One Size',
            totalPrice: 4999,
          },
          {
            id: 'cart2',
            productId: 'prod2',
            productName: 'Smartphone Stand',
            brand: 'TechGear',
            price: 1299,
            quantity: 2,
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
            selectedSize: 'M',
            totalPrice: 2598,
          },
        ];

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setCartItems(mockCart);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, currentAuthUser, navigate]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }

    try {
      setUpdatingId(id);
      // Simulate update delay
      await new Promise((resolve) => setTimeout(resolve, 400));
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: item.price * newQuantity,
              }
            : item
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      setUpdatingId(id);
      // Simulate removal delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplyCoupon = () => {
    // Simulate coupon validation
    if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(0.2); // 20% discount
    } else if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.1); // 10% discount
    } else {
      alert('Invalid coupon code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = Math.round(subtotal * discount);
  const tax = Math.round((subtotal - discountAmount) * 0.18); // 18% GST
  const total = subtotal - discountAmount + tax;

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Shopping Cart</h1>
          <p className="text-gray-400">{cartItems.length} items in cart</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-gold animate-spin mr-3" />
            <span className="text-white text-lg">Loading your cart...</span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Cart is Empty</h2>
            <p className="text-gray-400 mb-6">
              Add items to your cart to get started with shopping.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 flex gap-4 p-4 group ${
                    updatingId === item.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-1">{item.productName}</h3>
                    <p className="text-sm text-gray-400 mb-2">{item.brand}</p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500 mb-2">Size: {item.selectedSize}</p>
                    )}
                    <p className="text-lg font-bold text-gold">₹{item.totalPrice}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updatingId === item.id}
                      className="text-gray-400 hover:text-red-400 transition-all duration-300 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id}
                        className="p-1 hover:bg-gray-700 rounded transition-all duration-300 disabled:opacity-50 text-gold"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-white font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="p-1 hover:bg-gray-700 rounded transition-all duration-300 disabled:opacity-50 text-gold"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Code Section */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">Apply Coupon Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (e.g., SAVE20)"
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode}
                    className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Try codes: SAVE10, SAVE20</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sticky top-24 space-y-4">
                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                <div className="space-y-3 border-b border-gray-700 pb-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({Math.round(discount * 100)}%)</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-bold text-gold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gold text-black py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
