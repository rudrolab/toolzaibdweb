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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-[#0B0F19] border-l border-gray-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-800/80 flex items-center justify-between bg-gray-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Your Cart</h3>
              <p className="text-xs text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? 'product' : 'products'} selected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free instant delivery banner */}
        <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-2 flex items-center gap-2 text-xs text-emerald-300">
          <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>⚡ Instant digital delivery to Email & WhatsApp</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-base">Your cart is empty</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Explore genuine Microsoft, Canva, AI, or streaming accounts and enjoy up to 96% discount.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedVariant?.id || 'standard'}-${index}`}
                className="p-3 rounded-xl bg-gray-900/80 border border-gray-800/80 flex items-start gap-3 hover:border-gray-700 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-gray-700 p-0.5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                      {item.product.title}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.selectedVariant && (
                    <span className="text-[11px] text-amber-400/90 font-medium block mt-0.5">
                      {item.selectedVariant.name}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity modifier */}
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-gray-300 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-gray-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-amber-400">
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
          <div className="p-4 sm:p-5 border-t border-gray-800 bg-gray-900/90 space-y-3.5">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon: TOOLZAI10"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg text-amber-300">
                <span className="flex items-center gap-1 font-semibold">
                  <Tag className="w-3 h-3" /> Coupon applied: {appliedCoupon}
                </span>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-gray-400 hover:text-white text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] text-red-400">{couponError}</p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-gray-800 pt-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Special Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-gray-800">
                <span>Total Amount:</span>
                <span className="text-amber-400 text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onOpenCheckout(discountAmount, appliedCoupon || '')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Checkout</span>
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe & Verified Payments via bKash, Nagad, Rocket</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
