import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { Product } from '../types';
import { ProductCardBanner } from './ProductCardBanner';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onQuickOrder: (p: Product) => void;
  showInstantPill?: boolean;
  quickEditMode?: boolean;
  onQuickEdit?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickOrder,
  showInstantPill = false,
  quickEditMode = false,
  onQuickEdit,
}) => {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number) => {
    return '৳' + price.toLocaleString('en-BD');
  };

  const isSoldOut = product.isSoldOut;

  return (
    <div className="product-grid-item group flex flex-col justify-between bg-white rounded-2xl border-[1.5px] border-[#E2E8F0] p-2.5 sm:p-3 hover:-translate-y-1.5 hover:border-[#00C853] hover:shadow-[0_16px_30px_-8px_rgba(0,200,83,0.22),0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden h-full">
      
      {/* Quick Edit Floating Action Button */}
      {quickEditMode && onQuickEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickEdit(product);
          }}
          className="absolute top-2 right-2 z-20 bg-slate-900/95 hover:bg-emerald-600 text-white font-extrabold text-[10.5px] px-2.5 py-1 rounded-lg shadow-xl flex items-center gap-1 border border-slate-700 hover:border-emerald-400 transition-all hover:scale-105 active:scale-95"
          title="Edit this product directly"
        >
          <Edit3 className="w-3 h-3 text-emerald-400" />
          <span>Edit</span>
        </button>
      )}

      {/* 1:1 Aspect Ratio Image Container (Woodmart .product-element-top) */}
      <div
        onClick={() => onSelectProduct(product)}
        className="w-full aspect-square rounded-xl overflow-hidden relative cursor-pointer bg-[#F8FAFC] border border-[#E2E8F0]/70"
      >
        {/* Instant Delivery Pill on top-left (Woodmart / MixProBD style) */}
        {(showInstantPill || product.instantDelivery) && !isSoldOut && (
          <div className="absolute top-2 left-2 z-10 bg-[#00C853] text-white font-bold text-[9.5px] px-2 py-0.5 rounded shadow-[0_2px_6px_rgba(0,200,83,0.35)] flex items-center gap-1 pointer-events-none">
            <span className="text-[10px] leading-none">⚡</span>
            <span>Instant Delivery</span>
          </div>
        )}

        {/* Sold Out Red Pill */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 z-10 bg-[#EF4444] text-white font-black text-[9.5px] px-2 py-0.5 rounded shadow-md pointer-events-none uppercase tracking-wide">
            Sold out
          </div>
        )}

        {/* Discount Tag on top-right */}
        {product.discountPercent && !isSoldOut && (
          <div className="absolute top-2 right-2 z-10 bg-[#EF4444] text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded shadow-sm pointer-events-none">
            -{product.discountPercent}%
          </div>
        )}

        {/* Product Image with Woodmart Smooth Hover Zoom */}
        {!imgError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-1.5 transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProductCardBanner product={product} />
        )}
      </div>

      {/* Card Content (.product-element-bottom) */}
      <div className="mt-2.5 flex flex-col items-center text-center w-full">
        
        {/* Title & Star Rating Row (.mixprobd-card-title-row) */}
        <div className="flex items-center justify-center gap-1.5 w-full flex-wrap">
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-[13.5px] sm:text-[14px] text-[#0F172A] hover:text-[#00C853] cursor-pointer transition-colors line-clamp-2 max-w-full"
            title={product.title}
          >
            {product.title}
          </h3>

          <span className="inline-flex items-center gap-0.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-bold text-[11px] px-1.5 py-0.5 rounded shadow-sm flex-shrink-0">
            <span className="text-[#F59E0B]">★</span>
            <span>{product.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Price Row (.price) */}
        <div className="mt-1 mb-2.5 flex items-center justify-center gap-1.5 text-center min-h-[22px]">
          {product.hasVariants && product.priceRange ? (
            <div className="text-[14px] sm:text-[15px] font-black text-[#00C853]">
              <span className="text-xs text-[#64748B] font-medium">From </span>{formatPrice(product.priceRange.min)}
            </div>
          ) : product.currentPrice && product.originalPrice ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#94A3B8] line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[15px] sm:text-[16px] font-black text-[#00C853]">
                {formatPrice(product.currentPrice)}
              </span>
            </div>
          ) : (
            <div className="text-[15px] font-black text-[#00C853]">
              {formatPrice(product.currentPrice || 0)}
            </div>
          )}
        </div>

        {/* Direct Buy Now Button */}
        <button
          onClick={() => onQuickOrder(product)}
          disabled={isSoldOut}
          className={`w-full py-2.5 px-4 rounded-xl font-heading font-black text-xs sm:text-[13px] tracking-wide text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
            isSoldOut
              ? 'bg-gray-400 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-[#0052CC] to-[#003B95] hover:from-[#0B57D0] hover:to-[#0052CC] hover:shadow-[0_4px_14px_rgba(0,82,204,0.35)] active:scale-[0.98]'
          }`}
        >
          {isSoldOut ? 'Sold out' : '⚡ Buy Now (সরাসরি কিনুন)'}
        </button>

      </div>

    </div>
  );
};
