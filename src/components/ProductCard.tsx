import React from 'react';
import { Star, Zap, Flame, Shield, ArrowRight, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { Icon } from './Icon';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
  };

  const isSoldOut = product.isSoldOut;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#131b2e] to-[#0d1322] border border-gray-800/80 hover:border-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 p-5 overflow-hidden">
      
      {/* Top Banner & Discount Pill */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.instantDelivery && (
            <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[10.5px] px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3 fill-amber-400" />
              <span>Instant Delivery</span>
            </span>
          )}
          {product.isPopular && (
            <span className="inline-flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-[10.5px] px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3 fill-rose-400" />
              <span>Most Popular</span>
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {product.discountPercent && !isSoldOut && (
          <span className="bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded-md shadow-sm">
            -{product.discountPercent}%
          </span>
        )}

        {isSoldOut && (
          <span className="bg-gray-800 text-gray-300 border border-gray-700 font-bold text-xs px-2 py-0.5 rounded-md">
            Sold out
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {/* Brand & Icon representation */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-700/80 flex items-center justify-center p-2.5 text-amber-400 group-hover:scale-105 group-hover:border-amber-500 transition-all">
            <Icon name={product.iconName} className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <div className="flex items-center text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="font-heading font-bold text-lg text-white hover:text-amber-400 cursor-pointer transition-colors line-clamp-1 mb-1.5"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Tagline / Subtitle */}
        <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px] mb-4">
          {product.tagline}
        </p>

        {/* Price Section */}
        <div className="pt-2 border-t border-gray-800/80 mb-4 min-h-[50px] flex flex-col justify-center">
          {product.hasVariants && product.priceRange ? (
            <div>
              <span className="text-[11px] text-gray-400 block font-medium">Price range:</span>
              <div className="text-base font-extrabold text-amber-400">
                {formatPrice(product.priceRange.min)} <span className="text-xs text-gray-400 font-normal">through</span> {formatPrice(product.priceRange.max)}
              </div>
            </div>
          ) : product.currentPrice && product.originalPrice ? (
            <div>
              <span className="text-[10px] text-gray-400 block line-through">
                Original price was: {formatPrice(product.originalPrice)}
              </span>
              <div className="text-base font-extrabold text-amber-400">
                Current price: {formatPrice(product.currentPrice)}
              </div>
            </div>
          ) : (
            <div className="text-base font-extrabold text-amber-400">
              {formatPrice(product.currentPrice || 0)}
            </div>
          )}
        </div>
      </div>

      {/* Button Actions */}
      <div className="space-y-2">
        {isSoldOut ? (
          <button
            disabled
            className="w-full bg-gray-800/60 text-gray-400 font-medium text-xs sm:text-sm py-2.5 rounded-xl cursor-not-allowed border border-gray-700/50"
          >
            Sold out
          </button>
        ) : product.hasVariants ? (
          <button
            onClick={() => onSelectProduct(product)}
            className="w-full flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white hover:text-amber-400 border border-gray-700 hover:border-amber-500/50 font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all group/btn"
          >
            <span>Select options</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md shadow-orange-500/15 hover:shadow-orange-500/25 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to cart</span>
          </button>
        )}

        {/* Quick Details trigger */}
        <button
          onClick={() => onSelectProduct(product)}
          className="w-full text-center text-[11px] text-gray-400 hover:text-gray-200 py-1 transition-colors flex items-center justify-center gap-1"
        >
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>View Details & Warranty</span>
        </button>
      </div>

    </div>
  );
};
