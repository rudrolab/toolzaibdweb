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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center p-1.5 flex-shrink-0 shadow-sm overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-[#F8FAFC] flex items-center justify-center text-[#00C853]">
                  <Icon name={product.iconName} className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-1 pr-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">{product.categoryLabel}</span>

                {product.instantDelivery && (
                  <span className="inline-flex items-center gap-1 bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                    <Zap className="w-3 h-3 fill-[#00C853]" />
                    Instant Delivery
                  </span>
                )}
              </div>

              <h2 className="font-heading font-black text-xl sm:text-2xl text-[#0F172A]">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 text-xs pt-1">
                <div className="flex items-center text-amber-500 font-bold bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-500">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Tagline & Description */}
          <div>
            <p className="text-sm font-bold text-[#00C853] mb-1.5">
              {product.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants Selection (if multiple variants) */}
          {product.hasVariants && product.variants && product.variants.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">
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
                          ? 'bg-[#E6FCED] border-[#00C853] shadow-sm'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#86EFAC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#00C853] bg-[#00C853]' : 'border-slate-400'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-2">
                            <span>{v.name}</span>
                            {v.isPopular && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold border border-red-200">
                                Most Popular
                              </span>
                            )}
                          </div>
                          {v.duration && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-[#00C853]" /> Validity: {v.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm sm:text-base font-black text-[#00C853]">
                          {formatPrice(v.price)}
                        </div>
                        {v.originalPrice && (
                          <div className="text-[11px] text-slate-400 line-through">
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
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Selected Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#00C853]">
                  {formatPrice(currentPrice * quantity)}
                </span>
                {originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(originalPrice * quantity)}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-semibold">Quantity:</span>
              <div className="flex items-center bg-white border border-[#CBD5E1] rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:text-black hover:bg-[#F1F5F9] font-bold text-sm"
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-bold text-[#0F172A] min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:text-black hover:bg-[#F1F5F9] font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">
              Included Features:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <Check className="w-4 h-4 text-[#00C853] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs / Warranty details */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">
              Specifications & Guarantee:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.specs.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 block text-[11px] font-medium">{s.label}</span>
                  <span className="text-[#0F172A] font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="p-3.5 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center gap-3 text-xs text-[#15803D]">
            <ShieldCheck className="w-6 h-6 text-[#00C853] flex-shrink-0" />
            <div>
              <span className="font-bold block">100% Replacement Warranty by ToolzAi BD</span>
              <span className="text-slate-600 text-[11px]">
                If you encounter any activation issue during the subscription period, we replace it instantly.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center gap-3">
          {product.isSoldOut ? (
            <button
              onClick={handleWhatsAppBuy}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm py-3 px-6 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Currently Sold Out - Request Stock on WhatsApp</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleAdd}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#00C853] hover:bg-[#00B248] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatPrice(currentPrice * quantity)})</span>
              </button>

              <button
                onClick={handleWhatsAppBuy}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm py-3 px-5 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
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
