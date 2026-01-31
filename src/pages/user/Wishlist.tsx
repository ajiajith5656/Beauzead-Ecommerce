import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Loader2 } from 'lucide-react';

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  price: number;
  discount: number;
  image: string;
  inStock: boolean;
  addedDate: string;
}

export const WishlistPage: React.FC = () => {
  const { user, currentAuthUser } = useAuth();
  const { removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!user && !currentAuthUser) {
      navigate('/login');
      return;
    }

    // Simulate fetching wishlist
    const loadWishlist = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual GraphQL query
        const mockWishlist: WishlistItem[] = [
          {
            id: '1',
            productId: 'prod1',
            productName: 'Premium Wireless Headphones',
            brand: 'AudioTech',
            price: 4999,
            discount: 25,
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
            inStock: true,
            addedDate: '2026-01-27',
          },
          {
            id: '2',
            productId: 'prod2',
            productName: 'Smartphone Stand',
            brand: 'TechGear',
            price: 1299,
            discount: 15,
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
            inStock: true,
            addedDate: '2026-01-25',
          },
          {
            id: '3',
            productId: 'prod3',
            productName: 'Wireless Charging Pad',
            brand: 'ChargePro',
            price: 2499,
            discount: 30,
            image: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg',
            inStock: false,
            addedDate: '2026-01-20',
          },
        ];

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setWishlistItems(mockWishlist);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user, currentAuthUser, navigate]);

  const handleRemoveItem = async (id: string) => {
    try {
      setRemovingId(id);
      // Simulate removal delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      removeFromWishlist(id);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    navigate(`/products/${productId}`);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlistItems.reduce(
    (sum, item) => sum + (item.price * item.discount) / 100,
    0
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">My Wishlist</h1>
          <p className="text-gray-400">{wishlistItems.length} items saved</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-gold animate-spin mr-3" />
            <span className="text-white text-lg">Loading your wishlist...</span>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
            <Heart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Wishlist Empty</h2>
            <p className="text-gray-400 mb-6">
              Start adding items to your wishlist to save them for later.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gold">₹{totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Savings</p>
                <p className="text-2xl font-bold text-green-400">₹{Math.round(totalSavings).toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Items</p>
                <p className="text-2xl font-bold text-white">{wishlistItems.length}</p>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 flex flex-col sm:flex-row gap-4 p-4 group ${
                    removingId === item.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-full sm:w-40 h-40 bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-1">{item.productName}</h3>
                    <p className="text-sm text-gray-400 mb-3">{item.brand}</p>

                    {/* Price */}
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-2xl font-bold text-gold">
                        ₹{calculateDiscountedPrice(item.price, item.discount)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">₹{item.price}</span>
                      <span className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs font-bold">
                        -{item.discount}%
                      </span>
                    </div>

                    {/* Stock Status */}
                    <p
                      className={`text-sm font-medium mb-4 ${
                        item.inStock ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {item.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 justify-end sm:w-40">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={removingId === item.id}
                      className="bg-gold text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingId === item.id}
                      className="bg-gray-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
