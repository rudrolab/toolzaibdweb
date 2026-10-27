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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-[#0f172a] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-gray-900/80 hover:bg-gray-800 rounded-full border border-gray-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {orderComplete ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-white">Order Received Successfully!</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                Thank you, <strong>{customerName || 'Customer'}</strong>! We are redirecting you to WhatsApp to finalize verification and instant delivery to <span className="text-amber-400">{customerEmail}</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Total Amount Paid/Due:</span>
                <span className="font-black text-amber-400 text-sm">{formatPrice(finalTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Guarantee:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> 5-15 Minutes
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Support Line:</span>
                <span className="text-white font-mono">+8801886822838</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Support</span>
              </a>
              <button
                onClick={onClose}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-3 px-6 rounded-xl border border-gray-700 font-semibold"
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-gray-900 via-[#111c38] to-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                    Checkout & Instant Delivery
                  </h3>
                  <p className="text-xs text-gray-400">
                    Pay securely using bKash, Nagad, or Rocket Send Money
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              
              {/* Order total preview */}
              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">Payable Total ({cartItems.length} items):</span>
                  <div className="text-xl font-black text-amber-400">{formatPrice(finalTotal)}</div>
                </div>
                {discountAmount > 0 && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md font-semibold">
                    Saved {formatPrice(discountAmount)}
                  </span>
                )}
              </div>

              {/* Step 1: Customer Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-black">1</span>
                  Delivery Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Julkar Nayen"
                      className="w-full bg-gray-900 border border-gray-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full bg-gray-900 border border-gray-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Email Address for Credentials Delivery *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-gray-900 border border-gray-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    (Account credentials, license keys, and instructions will be sent to this email & WhatsApp)
                  </span>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-black">2</span>
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
                            ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                            : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <span className="text-xs font-black" style={{ color: method.color }}>
                          {method.logoText}
                        </span>
                        <span className="text-[10px] text-gray-400">{method.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Send Money to:</span>
                      <span className="text-sm sm:text-base font-black text-white font-mono tracking-wider">
                        {activeMethod.number || activeMethod.address}
                      </span>
                      <span className="text-[11px] text-amber-400 block mt-0.5 font-medium">
                        {activeMethod.type}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyNumber(activeMethod.number || activeMethod.address || '')}
                      className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Payment Steps */}
                  <div className="pt-2 border-t border-gray-800/80 text-[11px] text-gray-300 space-y-1">
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
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="Transaction ID (TrxID)"
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Order & Activate Instantly ({formatPrice(finalTotal)})</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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
