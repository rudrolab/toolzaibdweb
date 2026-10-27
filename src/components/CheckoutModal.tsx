import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, ShieldCheck, Zap, CreditCard, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { BANGLADESH_PAYMENTS, WHATSAPP_URL } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  couponCode: string;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  couponCode,
  onOrderSuccess,
}) => {
  const [selectedPayment, setSelectedPayment] = useState(BANGLADESH_PAYMENTS[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
  };

  const activeMethod = BANGLADESH_PAYMENTS.find((p) => p.id === selectedPayment) || BANGLADESH_PAYMENTS[0];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerPhone.trim()) {
      setErrorMsg('Please enter your WhatsApp phone number.');
      return;
    }
    if (!customerEmail.trim()) {
      setErrorMsg('Please enter your email for digital delivery.');
      return;
    }

    const itemsSummary = cartItems
      .map(
        (it) =>
          `• ${it.product.title}${it.selectedVariant ? ` (${it.selectedVariant.name})` : ''} x${it.quantity} = ${formatPrice(it.price * it.quantity)}`
      )
      .join('\n');

    const orderId = 'TZ-' + Math.floor(100000 + Math.random() * 900000);

    const message = encodeURIComponent(
      `🎉 NEW ORDER SUBMITTED (#${orderId})\n\n` +
      `Customer Name: ${customerName || 'Customer'}\n` +
      `WhatsApp Phone: ${customerPhone}\n` +
      `Delivery Email: ${customerEmail}\n\n` +
      `ITEMS ORDERED:\n${itemsSummary}\n\n` +
      `Subtotal: ${formatPrice(rawSubtotal)}\n` +
      (discountAmount > 0 ? `Discount (${couponCode}): -${formatPrice(discountAmount)}\n` : '') +
      `Total Payable: ${formatPrice(finalTotal)}\n\n` +
      `Payment Method: ${activeMethod.name}\n` +
      (senderNumber ? `Sender Number: ${senderNumber}\n` : '') +
      (trxId ? `Transaction ID: ${trxId}\n` : '') +
      `\nPlease verify payment and deliver the digital credentials.`
    );

    setOrderComplete(true);
    onOrderSuccess();

    // Auto open WhatsApp with the formatted order invoice
    setTimeout(() => {
      window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
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
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-[#00C853] text-[#00C853] flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-[#0F172A]">Order Received Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{customerName || 'Customer'}</strong>! We are redirecting you to WhatsApp to finalize verification and instant delivery to <span className="text-[#00C853] font-bold">{customerEmail}</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount Paid/Due:</span>
                <span className="font-black text-[#00C853] text-sm">{formatPrice(finalTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Guarantee:</span>
                <span className="text-[#15803D] font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#00C853]" /> 5-15 Minutes
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Support Line:</span>
                <span className="text-[#0F172A] font-bold font-mono">+8801886822838</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Support</span>
              </a>
              <button
                onClick={onClose}
                className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-slate-700 text-sm py-3 px-6 rounded-xl border border-[#CBD5E1] font-semibold"
              >
                Back to Store
              </button>
            </div>
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
                  {BANGLADESH_PAYMENTS.map((method) => {
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

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#00C853] hover:bg-[#00B248] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-[0_4px_16px_rgba(0,200,83,0.35)] transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Order & Activate Instantly ({formatPrice(finalTotal)})</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" />
                  <span>100% Secure Transaction & Instant Replacement Guarantee</span>
                </div>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
};
