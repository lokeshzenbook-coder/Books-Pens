import React from 'react';
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { Product, Book, Pen } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onViewDetails,
}: ProductCardProps) {
  const isBook = product.type === 'book';
  
  // Calculate final discounted price
  const discountedPrice = product.price * (1 - product.discount / 100);
  
  // Rating stars generator
  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= floor
              ? 'fill-amber-400 text-amber-400'
              : i - 0.5 <= rating
              ? 'fill-amber-400 text-amber-400 opacity-60'
              : 'text-gray-200'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Wishlist Button */}
      <button
        id={`wishlist-btn-${product.id}`}
        onClick={() => onToggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-xs border border-gray-100 text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-xs"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-3/4 w-full bg-gray-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={isBook ? (product as Book).title : `${(product as Pen).brand} ${(product as Pen).model}`}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 items-start">
          {product.discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 bg-red-50 border border-red-100 rounded-md">
              {product.discount}% OFF
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 bg-amber-50 border border-amber-100 rounded-md">
              ONLY {product.stock} LEFT
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-gray-500 bg-gray-100 border border-gray-200 rounded-md">
              OUT OF STOCK
            </span>
          )}
          {product.bestSeller && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-teal-700 bg-teal-50 border border-teal-100 rounded-md flex items-center space-x-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>BESTSELLER</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category / Brand name */}
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
          <span>{isBook ? (product as Book).category : (product as Pen).brand}</span>
          <span>{isBook ? 'Book' : 'Pen'}</span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-sm font-semibold text-gray-800 font-display line-clamp-1 group-hover:text-gray-950 cursor-pointer mb-1 transition-colors"
          title={isBook ? (product as Book).title : (product as Pen).model}
        >
          {isBook ? (product as Book).title : (product as Pen).model}
        </h3>

        {/* Sub-details (Author/Specs) */}
        <p className="text-xs text-gray-500 line-clamp-1 mb-2">
          {isBook ? `by ${(product as Book).author}` : `Ink: ${(product as Pen).inkColor} • Tip: ${(product as Pen).tipSize}`}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-amber-400">
            {renderStars(product.rating)}
          </div>
          <span className="text-[10px] font-mono font-medium text-gray-400">({product.rating})</span>
        </div>

        {/* Price & Action Button */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm font-mono font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs font-mono text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={() => product.stock > 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            className={`p-2 rounded-xl transition-all flex items-center justify-center ${
              product.stock === 0
                ? 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 text-white hover:scale-105 active:scale-95 cursor-pointer shadow-xs'
            }`}
            title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
