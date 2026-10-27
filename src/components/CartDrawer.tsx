import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Zap, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import { WHATSAPP_URL } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: (discountAmount: number, couponCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('TOOLZAI10'); // Default flash promo
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Apply discount logic
  let discountAmount = 0;
  if (appliedCoupon === 'TOOLZAI10') {
    discountAmount = Math.round(rawSubtotal * 0.10);
  } else if (appliedCoupon === 'WELCOME50') {
    discountAmount = Math.min(rawSubtotal, 50);
  }

  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'TOOLZAI10' || code === 'WELCOME50' || code === 'PROMO10') {
      setAppliedCoupon(code);
      setCouponCode('');
    } else {
      setCouponError('Invalid promo code. Try TOOLZAI10 for 10% off.');
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

    const message = encodeURIComponent(
      `Hello ToolzAi BD! I want to complete my order:\n\n` +
      `${itemsSummary}\n\n` +
      `Subtotal: ${formatPrice(rawSubtotal)}\n` +
      (discountAmount > 0 ? `Discount (${appliedCoupon}): -${formatPrice(discountAmount)}\n` : '') +
      `Total Payable: ${formatPrice(finalTotal)}\n\n` +
      `Please provide bKash / Nagad Send Money details.`
    );
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
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
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free instant delivery banner */}
        <div className="bg-[#E6FCED] border-b border-[#86EFAC] px-4 py-2 flex items-center gap-2 text-xs text-[#15803D] font-bold">
          <Zap className="w-4 h-4 text-[#00C853] flex-shrink-0" />
          <span>⚡ Instant digital delivery to Email & WhatsApp</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#0F172A] text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explore genuine Microsoft, Canva, AI, or streaming accounts and enjoy up to 96% discount.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#00C853] hover:bg-[#00B248] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedVariant?.id || 'standard'}-${index}`}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3 hover:border-[#86EFAC] transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-[#E2E8F0] p-0.5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] line-clamp-1">
                      {item.product.title}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.selectedVariant && (
                    <span className="text-[11px] text-[#00C853] font-semibold block mt-0.5">
                      {item.selectedVariant.name}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity modifier */}
                    <div className="flex items-center bg-white border border-[#CBD5E1] rounded-md shadow-sm">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:text-black font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-[#0F172A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:text-black font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#00C853]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Controls */}
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

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-[#E6FCED] border border-[#86EFAC] px-2.5 py-1.5 rounded-lg text-[#15803D]">
                <span className="flex items-center gap-1 font-bold">
                  <Tag className="w-3 h-3 text-[#00C853]" /> Coupon applied: {appliedCoupon}
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
                  <span>Special Discount ({appliedCoupon})</span>
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
                onClick={() => onOpenCheckout(discountAmount, appliedCoupon || '')}
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

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" />
              <span>Safe & Verified Payments via bKash, Nagad, Rocket</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
