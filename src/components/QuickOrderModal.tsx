import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Zap, MessageCircle } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { BANGLADESH_PAYMENTS, WHATSAPP_URL } from '../data/products';
import { ProductCardBanner } from './ProductCardBanner';

interface QuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderSuccess: (msg: string) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  product,
  onClose,
  onOrderSuccess,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('TOOLZAI10');
  const [selectedPayment, setSelectedPayment] = useState(BANGLADESH_PAYMENTS[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVar = product.variants.find((v) => v.isPopular) || product.variants[0];
      setSelectedVariant(defaultVar);
    } else {
      setSelectedVariant(undefined);
    }
    setQuantity(1);
    setErrorMsg('');
    setOrderComplete(false);
  }, [product]);

  if (!product) return null;

  const unitPrice = selectedVariant
    ? selectedVariant.price
    : product.currentPrice || (product.priceRange ? product.priceRange.min : 0);

  const rawSubtotal = unitPrice * quantity;

  let discount = 0;
  if (appliedCoupon === 'TOOLZAI10') {
    discount = Math.round(rawSubtotal * 0.10);
  }

  const finalTotal = Math.max(0, rawSubtotal - discount);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
  };

  const activeMethod = BANGLADESH_PAYMENTS.find((p) => p.id === selectedPayment) || BANGLADESH_PAYMENTS[0];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const c = couponCode.trim().toUpperCase();
    if (c === 'TOOLZAI10' || c === 'WELCOME50') {
      setAppliedCoupon(c);
      setCouponCode('');
    } else {
      setErrorMsg('Invalid coupon code. Try TOOLZAI10.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      setErrorMsg('Please enter your WhatsApp phone number.');
      return;
    }
    if (!customerEmail.trim()) {
      setErrorMsg('Please enter your email for delivery.');
      return;
    }

    const orderId = 'TZ-' + Math.floor(100000 + Math.random() * 900000);
    const variantInfo = selectedVariant ? ` (${selectedVariant.name})` : '';

    const message = encodeURIComponent(
      `🎉 TOOLZAI BD QUICK ORDER (#${orderId})\n\n` +
      `Product: ${product.title}${variantInfo}\n` +
      `Quantity: ${quantity}\n` +
      `Total Payable: ${formatPrice(finalTotal)}\n` +
      (discount > 0 ? `Coupon Discount: -${formatPrice(discount)}\n` : '') +
      `\nCustomer Details:\n` +
      `Name: ${customerName || 'Customer'}\n` +
      `WhatsApp Phone: ${customerPhone}\n` +
      `Delivery Email: ${customerEmail}\n\n` +
      `Payment: ${activeMethod.name} Send Money\n` +
      (senderNumber ? `Sender Number: ${senderNumber}\n` : '') +
      (trxId ? `Transaction ID: ${trxId}\n` : '') +
      `\nPlease verify and deliver digital credentials instantly.`
    );

    setOrderComplete(true);
    onOrderSuccess(`Order #${orderId} placed successfully!`);

    setTimeout(() => {
      window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-[500px] bg-white rounded-[20px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden my-6 border border-[#E2E8F0]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#FEE2E2] hover:text-[#EF4444] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {orderComplete ? (
          /* Order Complete State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="font-black text-xl text-[#0F172A]">Order Submitted Successfully!</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              We are opening WhatsApp with your receipt. Digital access credentials will be delivered to <strong className="text-[#00C853]">{customerEmail}</strong> within 5-15 minutes.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full bg-[#00C853] hover:bg-[#009624] text-white font-bold py-3 rounded-xl text-sm shadow-md"
              >
                Close & Return to Store
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <div>
            
            {/* Header: Product Preview */}
            <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex items-center gap-3.5 bg-[#FAFBFD]">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E2E8F0] flex-shrink-0 bg-white">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain p-1" />
                ) : (
                  <ProductCardBanner product={product} />
                )}
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  {product.brand}
                </span>
                <h3 className="font-bold text-sm sm:text-[15px] text-[#0F172A] line-clamp-1">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-[#00C853]">
                    {formatPrice(unitPrice)}
                  </span>
                  {product.instantDelivery && (
                    <span className="bg-[#E6FCED] text-[#00C853] text-[9.5px] font-bold px-1.5 py-0.2 rounded border border-[#BBF7D0]">
                      ⚡ Instant
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Variation Chips (MixProBD style: .mixpro-variation-chip) */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-[11px] font-extrabold text-[#475569] uppercase tracking-wider mb-2">
                    Select Option / Duration:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`text-xs font-bold py-2 px-3 rounded-xl border transition-all text-left flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#00C853] text-white border-[#00C853] shadow-[0_3px_10px_rgba(0,200,83,0.35)] -translate-y-0.5'
                              : 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <span>{v.name}</span>
                          <span className={isSelected ? 'text-white/90' : 'text-[#00C853]'}>
                            {formatPrice(v.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#334155]">Order Quantity:</span>
                <div className="flex items-center gap-2 bg-white border border-[#CBD5E1] rounded-full p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#334155] font-black text-sm flex items-center justify-center hover:bg-[#00C853] hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-7 text-center font-black text-xs text-[#0F172A]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#334155] font-black text-sm flex items-center justify-center hover:bg-[#00C853] hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon: TOOLZAI10"
                  className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#00C853] focus:outline-none uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#0F172A] hover:bg-[#00C853] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedCoupon && (
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex justify-between items-center">
                  <span>Coupon {appliedCoupon} applied (10% OFF)!</span>
                  <span className="text-emerald-800">Saved -{formatPrice(discount)}</span>
                </div>
              )}

              {/* Customer Delivery Fields */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-[11px] font-extrabold text-[#475569] uppercase tracking-wider">
                  Delivery Details:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#00C853] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Phone Number *"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#00C853] focus:outline-none"
                  />
                </div>

                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email Address for License Delivery *"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#00C853] focus:outline-none"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-[11px] font-extrabold text-[#475569] uppercase tracking-wider">
                  Payment Method (Send Money):
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {BANGLADESH_PAYMENTS.map((m) => {
                    const isSelected = selectedPayment === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setSelectedPayment(m.id)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#E6FCED] border-[#00C853] shadow-sm'
                            : 'bg-[#F8FAFC] border-[#E2E8F0]'
                        }`}
                      >
                        <div className="text-xs font-black" style={{ color: m.color }}>{m.logoText}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Account Details Box */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#64748B] block">Send Money to {activeMethod.name}:</span>
                      <span className="font-mono font-bold text-sm text-[#0F172A]">
                        {activeMethod.number || activeMethod.address}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(activeMethod.number || activeMethod.address || '')}
                      className="bg-white border border-[#CBD5E1] hover:border-[#00C853] text-[#334155] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      {copied ? (
                        <span className="text-[#00C853] font-bold">Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="Sender Number (Optional)"
                      className="bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853]"
                    />
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="Transaction ID / TrxID (Optional)"
                      className="bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853] uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Total Calculation & Place Order Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-[#00C853] to-[#009624] hover:from-[#00E676] hover:to-[#00C853] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-[0_10px_25px_rgba(7,148,71,0.35)] hover:shadow-[0_14px_30px_rgba(7,148,71,0.45)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Place Quick Order ({formatPrice(finalTotal)})</span>
                </button>

                <div className="mt-2 text-center text-[10.5px] text-[#64748B] flex items-center justify-center gap-1">
                  <MessageCircle className="w-3 h-3 text-[#00C853]" />
                  <span>Verified 5-15 min delivery directly to your WhatsApp & Email</span>
                </div>
              </div>

            </form>

          </div>
        )}

      </div>

    </div>
  );
};
