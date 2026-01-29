import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MobileNav } from '../components/layout/MobileNav';
import { mockProducts, hotDeals, trendingDeals } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/currency';

const allProducts = [...mockProducts, ...hotDeals, ...trendingDeals];

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currency, convertPrice } = useCurrency();

  const product = allProducts.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white pb-16 md:pb-0">
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold mb-3">Product not found</h1>
            <p className="text-gray-400 text-sm">Please return to the catalog and try another item.</p>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const convertedPrice = convertPrice(product.price, product.currency);
  const originalPrice = product.discount
    ? convertPrice(product.price / (1 - product.discount / 100), product.currency)
    : convertedPrice;
  const inStock = product.stock > 0;

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-16 md:pb-0">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="aspect-square bg-gray-800">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/900x900/1f2937/eab308?text=Product';
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-semibold mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 text-sm">
                {product.rating && (
                  <div className="flex items-center gap-1 text-gold">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    <span className="font-medium text-white">{product.rating}</span>
                  </div>
                )}
                {product.brand && (
                  <span className="text-gray-400 uppercase">{product.brand}</span>
                )}
              </div>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-3xl font-bold text-gold">
                {formatCurrency(convertedPrice, currency)}
              </span>
              {product.discount && product.discount > 0 && (
                <span className="text-gray-500 line-through">
                  {formatCurrency(originalPrice, currency)}
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="text-sm">
              <span className={inStock ? 'text-green-500' : 'text-red-500'}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {inStock && (
                <span className="text-gray-500 ml-2">({product.stock} available)</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => addToCart(product)}
                className="btn-primary flex items-center justify-center gap-2 py-3"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className="btn-secondary flex items-center justify-center gap-2 py-3"
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gold'}`} />
                {inWishlist ? 'Remove Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ProductDetailsPage;
