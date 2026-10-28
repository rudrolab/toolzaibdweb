import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, ShieldCheck, Zap, CreditCard, AlertCircle, ExternalLink } from 'lucide-react';
import { CartItem, Order, StoreSettings } from '../types';
import { getStorePaymentMethods, getWhatsAppUrl } from '../utils/paymentHelpers';
import {
  sanitizeInput,
  isValidBDPhone,
  isValidEmail,
  isValidTrxId,
  isSpamSubmission,
  checkRateLimit
} from '../utils/security';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  couponCode: string;
  onOrderSuccess: () => void;
  onPlaceOrder?: (order: Order) => void;
  settings?: StoreSettings;
  onOpenPolicy?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  couponCode,
  onOrderSuccess,
  onPlaceOrder,
  settings,
  onOpenPolicy,
}) => {
  const paymentMethods = getStorePaymentMethods(settings);
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

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Anti-bot honeypot check
    if (isSpamSubmission(honeypot)) {
      return;
    }

    // 2. Submission rate limiting
    const rateCheck = checkRateLimit('checkout_order_submission', 3000);
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

    const itemsSummary = cartItems
      .map(
        (it) =>
          `• ${it.product.title}${it.selectedVariant ? ` (${it.selectedVariant.name})` : ''} x${it.quantity} = ${formatPrice(it.price * it.quantity)}`
      )
      .join('\n');

    const orderId = 'TZ-' + Math.floor(100000 + Math.random() * 900000);

    const message =
      `🎉 NEW ORDER SUBMITTED (#${orderId})\n\n` +
      `Customer Name: ${cleanName || 'Customer'}\n` +
      `WhatsApp Phone: ${cleanPhone}\n` +
      `Delivery Email: ${cleanEmail}\n\n` +
      `ITEMS ORDERED:\n${itemsSummary}\n\n` +
      `Subtotal: ${formatPrice(rawSubtotal)}\n` +
      (discountAmount > 0 ? `Discount (${couponCode}): -${formatPrice(discountAmount)}\n` : '') +
      `Total Payable: ${formatPrice(finalTotal)}\n\n` +
      `Payment Method: ${activeMethod.name}\n` +
      (cleanSender ? `Sender Number: ${cleanSender}\n` : '') +
      (cleanTrx ? `Transaction ID: ${cleanTrx}\n` : '') +
      `\nPlease verify payment and deliver the digital credentials.`;

    const targetWhatsAppUrl = getWhatsAppUrl(settings?.whatsappNumber, message);

    const newOrder: Order = {
      id: orderId,
      customerName: cleanName || 'Customer',
      customerPhone: cleanPhone,
      customerEmail: cleanEmail,
      items: cartItems.map((it) => ({
        productId: it.product.id,
        title: it.product.title,
        variantName: it.selectedVariant?.name,
        quantity: it.quantity,
        price: it.price,
      })),
      subtotal: rawSubtotal,
      discount: discountAmount,
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

    setCompletedOrderId(orderId);
    setWhatsappOrderUrl(targetWhatsAppUrl);
    setOrderComplete(true);
    onOrderSuccess();

    // Auto open WhatsApp with the formatted order invoice
    setTimeout(() => {
      window.open(targetWhatsAppUrl, '_blank', 'noopener,noreferrer');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {orderComplete ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-[#00C853] text-[#00C853] flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-[#0F172A]">অর্ডার সফলভাবে জমা হয়েছে!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                ধন্যবাদ, <strong>{customerName || 'Customer'}</strong>! আপনার অর্ডারটি গ্রহণ করা হয়েছে। দ্রুত ডেলিভারির জন্য নিচের হোয়াটসঅ্যাপ বাটনে ক্লিক করে ইনভয়েসটি পাঠিয়ে দিন।
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

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount Paid/Due:</span>
                <span className="font-black text-[#00C853] text-sm">{formatPrice(finalTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Email:</span>
                <span className="font-bold text-[#0F172A]">{customerEmail}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Guarantee:</span>
                <span className="text-[#15803D] font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#00C853]" /> 5-15 Minutes
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Support Hotline:</span>
                <span className="text-[#0F172A] font-bold font-mono">{settings?.whatsappNumber || '+8801886822838'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappOrderUrl || getWhatsAppUrl(settings?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all animate-bounce"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send Invoice via WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-slate-700 text-sm py-3 px-6 rounded-xl border border-[#CBD5E1] font-semibold"
              >
                Back to Store
              </button>
            </div>

            {onOpenPolicy && (
              <button
                onClick={onOpenPolicy}
                className="text-xs text-slate-500 hover:text-[#00C853] underline flex items-center justify-center gap-1 mx-auto pt-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ওয়ারেন্টি ও রিফান্ড পলিসি পড়ুন</span>
              </button>
            )}
          </div>
        ) : (
          /* Checkout Form */
          <div>
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-[#0F172A]">
                    Checkout & Instant Delivery
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Pay securely using bKash, Nagad, or Rocket Send Money
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              
              {/* Invisible honeypot field for anti-bot spam protection */}
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

              {/* Order total preview */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Payable Total ({cartItems.length} items):</span>
                  <div className="text-xl font-black text-[#00C853]">{formatPrice(finalTotal)}</div>
                </div>
                {discountAmount > 0 && (
                  <span className="text-xs text-[#15803D] bg-[#E6FCED] border border-[#86EFAC] px-2.5 py-1 rounded-md font-bold">
                    Saved {formatPrice(discountAmount)}
                  </span>
                )}
              </div>

              {/* Step 1: Customer Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#00C853] text-white flex items-center justify-center text-[10px] font-black">1</span>
                  Delivery Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 font-semibold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Julkar Nayen"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 font-semibold mb-1">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Email Address for Credentials Delivery *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853] focus:bg-white"
                  />
                  <span className="text-[10.5px] text-slate-500 mt-1 block">
                    (Account credentials, license keys, and instructions will be sent to this email & WhatsApp)
                  </span>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#00C853] text-white flex items-center justify-center text-[10px] font-black">2</span>
                  Select Payment Method (Bangladesh)
                </h4>

                {/* Payment Option Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {paymentMethods.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#E6FCED] border-[#00C853] shadow-sm'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#86EFAC]'
                        }`}
                      >
                        <span className="text-xs font-black" style={{ color: method.color }}>
                          {method.logoText}
                        </span>
                        <span className="text-[10px] text-slate-600 font-medium">{method.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center pt-1">
                  <img
                    src="./products/Minimal-Payment-Methods-Banner.webp"
                    alt="Supported Bangladeshi Payment Methods"
                    className="w-full max-w-sm rounded-lg bg-white p-1 border border-[#E2E8F0] shadow-sm"
                  />
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Send Money to:</span>
                      <span className="text-sm sm:text-base font-black text-[#0F172A] font-mono tracking-wider">
                        {activeMethod.number || activeMethod.address}
                      </span>
                      <span className="text-[11px] text-[#00C853] block mt-0.5 font-bold">
                        {activeMethod.type}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyNumber(activeMethod.number || activeMethod.address || '')}
                      className="flex items-center gap-1.5 bg-white hover:bg-[#F1F5F9] text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#CBD5E1] transition-colors shadow-sm"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#00C853]" />
                          <span className="text-[#00C853]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Payment Steps */}
                  <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-slate-600 space-y-1">
                    <p>1. Open your <strong>{activeMethod.name} App</strong> and select <strong>Send Money</strong>.</p>
                    <p>2. Send <strong>{formatPrice(finalTotal)}</strong> to the copied number above.</p>
                    <p>3. Put your Sender Number & TrxID below (optional: you can also send screenshot directly on WhatsApp).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <input
                        type="text"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="Sender Phone Number"
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="Transaction ID (TrxID)"
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853] uppercase font-mono"
                      />
                    </div>
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

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-[#00C853] hover:bg-[#00B248] text-white font-heading font-black text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Confirm Order & Get Delivery ({formatPrice(finalTotal)})</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
