import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Zap, MessageCircle } from 'lucide-react';
import { CartItem, Coupon, StoreSettings } from '../types';
import { getWhatsAppUrl } from '../utils/paymentHelpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: (discountAmount: number, couponCode: string) => void;
  coupons?: Coupon[];
  settings?: StoreSettings;
  onOpenPolicy?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  coupons = [],
  settings,
  onOpenPolicy,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Auto-apply TOOLZAI10 promo on first mount if available
  useEffect(() => {
    if (!appliedCoupon) {
      const toolzaiCoupon = coupons.find((c) => c.code.toUpperCase() === 'TOOLZAI10' && c.isActive);
      if (toolzaiCoupon) {
        setAppliedCoupon(toolzaiCoupon);
      } else {
        setAppliedCoupon({
          id: 'c-default-cart-10',
          code: 'TOOLZAI10',
          discountType: 'percent',
          discountValue: 10,
          isActive: true,
          usageCount: 0,
        });
      }
    }
  }, [coupons]);

  if (!isOpen) return null;

  // Apply discount logic
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.minSpend && rawSubtotal < appliedCoupon.minSpend) {
      discountAmount = 0;
    } else if (appliedCoupon.discountType === 'percent') {
      discountAmount = Math.round(rawSubtotal * (appliedCoupon.discountValue / 100));
    } else {
      discountAmount = Math.min(rawSubtotal, appliedCoupon.discountValue);
    }
  }

  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const formatPrice = (p: number) => {
    return '৳' + p.toLocaleString('en-BD');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const found = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);
    if (found) {
      if (found.minSpend && rawSubtotal < found.minSpend) {
        setCouponError(`কুপনটির জন্য সর্বনিম্ন অর্ডার ${found.minSpend}৳ প্রয়োজন।`);
        return;
      }
      setAppliedCoupon(found);
      setCouponCode('');
    } else if (code === 'TOOLZAI10') {
      setAppliedCoupon({
        id: 'c-10',
        code: 'TOOLZAI10',
        discountType: 'percent',
        discountValue: 10,
        isActive: true,
        usageCount: 0,
      });
      setCouponCode('');
    } else if (code === 'WELCOME50') {
      setAppliedCoupon({
        id: 'c-50',
        code: 'WELCOME50',
        discountType: 'fixed',
        discountValue: 50,
        isActive: true,
        usageCount: 0,
      });
      setCouponCode('');
    } else {
      setCouponError('কুপন কোডটি সঠিক নয়। (Try: TOOLZAI10)');
    }
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const itemsSummary = cartItems
      .map(
        (it) =>
          `• ${it.product.title}${it.selectedVariant ? ` (${it.selectedVariant.name})` : ''} x${it.quantity} = ${formatPrice(it.price * it.quantity)}`
      )
      .join('\n');

    const message =
      `Hello ToolzAi BD! I want to complete my order:\n\n` +
      `${itemsSummary}\n\n` +
      `Subtotal: ${formatPrice(rawSubtotal)}\n` +
      (discountAmount > 0 ? `Discount (${appliedCoupon?.code}): -${formatPrice(discountAmount)}\n` : '') +
      `Total Payable: ${formatPrice(finalTotal)}\n\n` +
      `Please provide bKash / Nagad Send Money details.`;

    const targetUrl = getWhatsAppUrl(settings?.whatsappNumber, message);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-[#0F172A]">Your Cart</h3>
              <p className="text-xs text-slate-500">
                {cartItems.length} {cartItems.length === 1 ? 'product' : 'products'} selected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free instant delivery alert banner */}
        <div className="bg-[#E6FCED] border-b border-[#86EFAC] px-4 py-2 flex items-center gap-2 text-xs text-[#15803D] font-bold">
          <Zap className="w-4 h-4 text-[#00C853] flex-shrink-0" />
          <span>Instant Email & WhatsApp Delivery in 5-15 mins!</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-black text-slate-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Browse authentic AI subscriptions, Microsoft tools, and creative accounts.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#00C853] hover:bg-[#00B248] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const itemTotal = item.price * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || 'base'}-${index}`}
                  className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex gap-3 relative hover:border-[#86EFAC] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-white border border-[#E2E8F0] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg">⭐</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#0F172A] line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <span className="inline-block text-[10px] text-[#15803D] bg-[#E6FCED] px-1.5 py-0.5 rounded font-bold mt-0.5">
                        {item.selectedVariant.name}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E2E8F0]">
                      <div className="text-xs font-black text-[#00C853]">
                        {formatPrice(itemTotal)}
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            ({formatPrice(item.price)} each)
                          </span>
                        )}
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1.5 bg-white border border-[#CBD5E1] rounded-lg p-0.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-xs font-black text-slate-600 hover:bg-[#F1F5F9]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#0F172A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, Math.min(20, item.quantity + 1))}
                          className="w-5 h-5 rounded flex items-center justify-center text-xs font-black text-slate-600 hover:bg-[#F1F5F9]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout Trigger */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3.5">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon: TOOLZAI10"
                  className="w-full bg-white border border-[#CBD5E1] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853] uppercase font-mono shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="bg-white hover:bg-[#F1F5F9] text-slate-700 border border-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Apply
              </button>
            </form>

            {/* Quick Available Coupons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-500 font-medium">অফার কুপন:</span>
              <button
                type="button"
                onClick={() => {
                  setCouponCode('TOOLZAI10');
                  setAppliedCoupon({
                    id: 'c-10',
                    code: 'TOOLZAI10',
                    discountType: 'percent',
                    discountValue: 10,
                    isActive: true,
                    usageCount: 0,
                  });
                  setCouponError('');
                }}
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold transition-all ${
                  appliedCoupon?.code === 'TOOLZAI10'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                TOOLZAI10 (-10%)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCouponCode('WELCOME50');
                  setAppliedCoupon({
                    id: 'c-50',
                    code: 'WELCOME50',
                    discountType: 'fixed',
                    discountValue: 50,
                    isActive: true,
                    usageCount: 0,
                  });
                  setCouponError('');
                }}
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold transition-all ${
                  appliedCoupon?.code === 'WELCOME50'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                WELCOME50 (-৳50)
              </button>
            </div>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-[#E6FCED] border border-[#86EFAC] px-2.5 py-1.5 rounded-lg text-[#15803D]">
                <span className="flex items-center gap-1 font-bold">
                  <Tag className="w-3 h-3 text-[#00C853]" /> 
                  Coupon {appliedCoupon.code} ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue}৳`} OFF)
                </span>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-slate-500 hover:text-red-500 text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] text-red-500">{couponError}</p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-[#E2E8F0] pt-3">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#15803D] font-bold">
                  <span>Special Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-[#0F172A] pt-1 border-t border-[#E2E8F0]">
                <span>Total Amount:</span>
                <span className="text-[#00C853] text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onOpenCheckout(discountAmount, appliedCoupon?.code || '')}
                className="w-full flex items-center justify-center gap-2 bg-[#00C853] hover:bg-[#00B248] text-white font-black text-sm py-3 px-4 rounded-xl shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Checkout</span>
              </button>
            </div>

            {/* Trust badge & Policy link */}
            <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" />
                <span>Safe bKash / Nagad / Rocket</span>
              </div>
              {onOpenPolicy && (
                <button
                  type="button"
                  onClick={onOpenPolicy}
                  className="text-[#00C853] font-bold underline hover:text-[#15803D]"
                >
                  Warranty & Refund
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
