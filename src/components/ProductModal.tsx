import React, { useState, useEffect } from 'react';
import { X, Star, Zap, ShieldCheck, Check, ShoppingBag, MessageCircle, Clock } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { Icon } from './Icon';
import { WHATSAPP_URL } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // default to first or popular variant
      const defaultVar = product.variants.find((v) => v.isPopular) || product.variants[0];
      setSelectedVariant(defaultVar);
    } else {
      setSelectedVariant(undefined);
    }
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.currentPrice || (product.priceRange ? product.priceRange.min : 0);

  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
  };

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    onClose();
  };

  const handleWhatsAppBuy = () => {
    const variantName = selectedVariant ? ` [${selectedVariant.name}]` : '';
    const message = encodeURIComponent(
      `Hello ToolzAi BD, I want to order:\n` +
      `Product: ${product.title}${variantName}\n` +
      `Quantity: ${quantity}\n` +
      `Total: ${formatPrice(currentPrice * quantity)}\n` +
      `Please provide bKash/Nagad payment number and activation details.`
    );
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-gray-900/80 hover:bg-gray-800 rounded-full border border-gray-700 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-900 via-[#111c38] to-gray-900 border-b border-gray-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-700 flex items-center justify-center p-1.5 flex-shrink-0 shadow-lg overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-amber-400">
                  <Icon name={product.iconName} className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-1 pr-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-400">{product.categoryLabel}</span>

                {product.instantDelivery && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded">
                    <Zap className="w-3 h-3 fill-emerald-400" />
                    Instant Delivery
                  </span>
                )}
              </div>

              <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 text-xs pt-1">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Tagline & Description */}
          <div>
            <p className="text-sm font-semibold text-amber-300/90 mb-2">
              {product.tagline}
            </p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants Selection (if multiple variants) */}
          {product.hasVariants && product.variants && product.variants.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2.5">
                Select Option / Duration:
              </label>
              <div className="space-y-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                          : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-400 bg-amber-400' : 'border-gray-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                            <span>{v.name}</span>
                            {v.isPopular && (
                              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-semibold border border-rose-500/30">
                                Most Popular
                              </span>
                            )}
                          </div>
                          {v.duration && (
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-amber-400" /> Validity: {v.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm sm:text-base font-extrabold text-amber-400">
                          {formatPrice(v.price)}
                        </div>
                        {v.originalPrice && (
                          <div className="text-[11px] text-gray-500 line-through">
                            {formatPrice(v.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing & Quantity */}
          <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Selected Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-400">
                  {formatPrice(currentPrice * quantity)}
                </span>
                {originalPrice && (
                  <span className="text-xs text-rose-400 line-through">
                    {formatPrice(originalPrice * quantity)}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium">Quantity:</span>
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-700 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-bold text-white min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-700 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2.5">
              Included Features:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-gray-900/40 border border-gray-800/80">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs / Warranty details */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2.5">
              Specifications & Guarantee:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.specs.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-gray-950/70 border border-gray-800">
                  <span className="text-gray-400 block text-[11px]">{s.label}</span>
                  <span className="text-gray-200 font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold block">100% Replacement Warranty by ToolzAi BD</span>
              <span className="text-emerald-400/80 text-[11px]">
                If you encounter any activation issue during the subscription period, we replace it instantly.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-gray-900/90 border-t border-gray-800 flex flex-col sm:flex-row items-center gap-3">
          {product.isSoldOut ? (
            <button
              onClick={handleWhatsAppBuy}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-amber-400 border border-amber-500/40 font-bold text-sm py-3 px-6 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Currently Sold Out - Request Stock on WhatsApp</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleAdd}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatPrice(currentPrice * quantity)})</span>
              </button>

              <button
                onClick={handleWhatsAppBuy}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buy via WhatsApp</span>
              </button>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
