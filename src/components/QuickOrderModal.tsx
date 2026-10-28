import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Zap, MessageCircle, AlertCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { Product, ProductVariant, Order, Coupon, StoreSettings } from '../types';
import { ProductCardBanner } from './ProductCardBanner';
import { getStorePaymentMethods, getWhatsAppUrl } from '../utils/paymentHelpers';
import {
  sanitizeInput,
  isValidBDPhone,
  isValidEmail,
  isValidTrxId,
  isSpamSubmission,
  checkRateLimit
} from '../utils/security';

interface QuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderSuccess: (msg: string) => void;
  onPlaceOrder?: (order: Order) => void;
  coupons?: Coupon[];
  settings?: StoreSettings;
  onOpenPolicy?: () => void;
  onCouponUsed?: (couponCode: string) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  product,
  onClose,
  onOrderSuccess,
  onPlaceOrder,
  coupons = [],
  settings,
  onOpenPolicy,
  onCouponUsed,
}) => {
  const paymentMethods = getStorePaymentMethods(settings);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [whatsappOrderUrl, setWhatsappOrderUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [honeypot, setHoneypot] = useState('');

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
    
    // Auto-apply TOOLZAI10 if available in coupons or as fallback
    const defaultCoupon = coupons.find((c) => c.code.toUpperCase() === 'TOOLZAI10' && c.isActive);
    if (defaultCoupon) {
      setAppliedCoupon(defaultCoupon);
    } else {
      setAppliedCoupon({
        id: 'c-default-10',
        code: 'TOOLZAI10',
        discountType: 'percent',
        discountValue: 10,
        isActive: true,
        usageCount: 0,
      });
    }
  }, [product, coupons]);

  if (!product) return null;

  const unitPrice = selectedVariant
    ? selectedVariant.price
    : product.currentPrice || (product.priceRange ? product.priceRange.min : 0);

  const rawSubtotal = unitPrice * quantity;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.minSpend && rawSubtotal < appliedCoupon.minSpend) {
      discount = 0;
    } else if (appliedCoupon.discountType === 'percent') {
      discount = Math.round(rawSubtotal * (appliedCoupon.discountValue / 100));
    } else {
      discount = Math.min(rawSubtotal, appliedCoupon.discountValue);
    }
  }

  const finalTotal = Math.max(0, rawSubtotal - discount);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
  };

  const activeMethod = paymentMethods.find((p) => p.id === selectedPayment) || paymentMethods[0];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOrderId = (idText: string) => {
    navigator.clipboard.writeText(idText);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    // Look up in passed coupons list
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);
    if (found) {
      if (found.minSpend && rawSubtotal < found.minSpend) {
        setErrorMsg(`কুপনটির জন্য সর্বনিম্ন অর্ডার ${found.minSpend}৳ প্রয়োজন।`);
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
      setErrorMsg('সঠিক কুপন কোড প্রদান করুন। (Try: TOOLZAI10)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Anti-bot honeypot check
    if (isSpamSubmission(honeypot)) {
      return;
    }

    // 2. Submission rate limiting
    const rateCheck = checkRateLimit('quick_order_submission', 3000);
    if (!rateCheck.allowed) {
      setErrorMsg(`অপেক্ষা করুন, আরও ${rateCheck.waitSeconds} সেকেন্ড পর চেষ্টা করুন।`);
      return;
    }

    // 3. Input Sanitization
    const cleanName = sanitizeInput(customerName);
    const cleanPhone = sanitizeInput(customerPhone);
    const cleanEmail = sanitizeInput(customerEmail);
    const cleanSender = sanitizeInput(senderNumber);
    const cleanTrx = sanitizeInput(trxId);

    // 4. Strict Validation
    if (!cleanPhone) {
      setErrorMsg('অনুগ্রহ করে আপনার হোয়াটসঅ্যাপ মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    if (!isValidBDPhone(cleanPhone)) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!cleanEmail) {
      setErrorMsg('অনুগ্রহ করে ডিজিটাল ডেলিভারির জন্য আপনার ইমেইল প্রদান করুন।');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('অনুগ্রহ করে একটি সঠিক ইমেইল অ্যাড্রেস লিখুন (যেমন: yourname@gmail.com)।');
      return;
    }
    if (cleanTrx && !isValidTrxId(cleanTrx)) {
      setErrorMsg('ট্রানজেকশন আইডি (TrxID) ইংরেজি অক্ষর ও সংখ্যা হতে হবে (৬-২০ অক্ষর)।');
      return;
    }

    const orderId = 'TZ-' + Math.floor(100000 + Math.random() * 900000);
    const variantInfo = selectedVariant ? ` (${selectedVariant.name})` : '';

    const message =
      `🎉 TOOLZAI BD QUICK ORDER (#${orderId})\n\n` +
      `Product: ${product.title}${variantInfo}\n` +
      `Quantity: ${quantity}\n` +
      `Total Payable: ${formatPrice(finalTotal)}\n` +
      (discount > 0 ? `Coupon Discount (${appliedCoupon?.code}): -${formatPrice(discount)}\n` : '') +
      `\nCustomer Details:\n` +
      `Name: ${cleanName || 'Customer'}\n` +
      `WhatsApp Phone: ${cleanPhone}\n` +
      `Delivery Email: ${cleanEmail}\n\n` +
      `Payment: ${activeMethod.name} Send Money\n` +
      (cleanSender ? `Sender Number: ${cleanSender}\n` : '') +
      (cleanTrx ? `Transaction ID: ${cleanTrx}\n` : '') +
      `\nPlease verify and deliver digital credentials instantly.`;

    const targetWhatsAppUrl = getWhatsAppUrl(settings?.whatsappNumber, message);

    const newOrder: Order = {
      id: orderId,
      customerName: cleanName || 'Customer',
      customerPhone: cleanPhone,
      customerEmail: cleanEmail,
      items: [
        {
          productId: product.id,
          title: product.title,
          variantName: selectedVariant?.name,
          quantity,
          price: unitPrice,
        }
      ],
      subtotal: rawSubtotal,
      discount,
      total: finalTotal,
      paymentMethod: activeMethod.name,
      senderNumber: cleanSender || undefined,
      trxId: cleanTrx || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (onPlaceOrder) {
      onPlaceOrder(newOrder);
    }

    if (appliedCoupon && onCouponUsed) {
      onCouponUsed(appliedCoupon.code);
    }

    setCompletedOrderId(orderId);
    setWhatsappOrderUrl(targetWhatsAppUrl);
    setOrderComplete(true);
    onOrderSuccess(`Order #${orderId} placed successfully!`);

    setTimeout(() => {
      window.open(targetWhatsAppUrl, '_blank', 'noopener,noreferrer');
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
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C853] flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-heading font-black text-xl text-[#0F172A]">অর্ডার সফলভাবে জমা হয়েছে!</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                ধন্যবাদ! ডিজিটাল লাইসেন্স ক্রেডেনশিয়াল <strong className="text-[#00C853]">{customerEmail}</strong> এবং হোয়াটসঅ্যাপে ৫-১৫ মিনিটে পৌঁছে দেওয়া হবে।
              </p>
            </div>

            {/* Order ID Pill */}
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto p-2 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl">
              <span className="text-xs text-slate-600 font-semibold">Order ID:</span>
              <span className="font-mono font-black text-sm text-[#15803D]">{completedOrderId}</span>
              <button
                type="button"
                onClick={() => handleCopyOrderId(completedOrderId)}
                className="ml-1 p-1 hover:bg-white rounded-lg text-slate-500 hover:text-[#00C853] transition-colors"
                title="Copy Order ID"
              >
                {copiedOrderId ? <Check className="w-3.5 h-3.5 text-[#00C853]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Total breakdown */}
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1 text-left">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount:</span>
                <span className="font-black text-[#00C853]">{formatPrice(finalTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hotline:</span>
                <span className="font-mono font-bold text-slate-800">{settings?.whatsappNumber || '+8801886822838'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={whatsappOrderUrl || getWhatsAppUrl(settings?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all animate-bounce"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send Invoice via WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="w-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-slate-700 font-semibold py-2.5 rounded-xl text-xs border border-[#CBD5E1]"
              >
                Close & Return to Store
              </button>
            </div>

            {onOpenPolicy && (
              <button
                onClick={onOpenPolicy}
                className="text-xs text-slate-500 hover:text-[#00C853] underline flex items-center justify-center gap-1 mx-auto pt-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ওয়ারেন্টি ও রিফান্ড পলিসি পড়ুন</span>
              </button>
            )}
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
              
              {/* Invisible honeypot for anti-bot protection */}
              <input
                type="text"
                name="website_url_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }}
                aria-hidden="true"
              />

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              
              {/* Variation Chips */}
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
                  <span>
                    Coupon {appliedCoupon.code} applied ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discountValue}% OFF` : `${appliedCoupon.discountValue}৳ OFF`})!
                  </span>
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
                  {paymentMethods.map((m) => {
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

              {/* Guarantees & Policy trigger */}
              <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#15803D] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#00C853]" />
                  <span>100% Genuine Replacement Guarantee</span>
                </div>
                {onOpenPolicy && (
                  <button
                    type="button"
                    onClick={onOpenPolicy}
                    className="text-[11px] text-[#00C853] font-bold underline hover:text-[#15803D]"
                  >
                    View Policy
                  </button>
                )}
              </div>

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
