import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatCurrency } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currency, convertPrice } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const convertedPrice = convertPrice(product.price, product.currency);
  const originalPrice = product.discount 
    ? convertPrice(product.price / (1 - product.discount / 100), product.currency)
    : convertedPrice;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div
      className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
        {product.discount && product.discount > 0 && (
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
        {product.isNew && (
          <span className="bg-gold text-black text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
      >
        <Heart
          className={`h-5 w-5 ${
            inWishlist ? 'fill-red-500 text-red-500' : 'text-white'
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x400/1f2937/eab308?text=Product';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Rating & Brand */}
        <div className="flex items-center justify-between mb-2">
          {product.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="text-sm text-white font-medium">{product.rating}</span>
            </div>
          )}
          {product.brand && (
            <span className="text-xs text-gray-400 uppercase">{product.brand}</span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 h-10">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-400 mb-2">{product.category}</p>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-gold font-bold text-lg">
            {formatCurrency(convertedPrice, currency)}
          </span>
          {product.discount && product.discount > 0 && (
            <span className="text-gray-500 text-sm line-through">
              {formatCurrency(originalPrice, currency)}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Slides up on hover */}
        <div
          className={`transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
