import React, { useState } from 'react';
import {
  Copy,
  Check,
  MessageCircle,
  Zap,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Globe,
  Building2
} from 'lucide-react';
import { CartItem, Order, StoreSettings, Product } from '../types';
import { getStorePaymentMethods, getWhatsAppUrl } from '../utils/paymentHelpers';
import {
  sanitizeInput,
  isValidBDPhone,
  isValidEmail,
  isValidTrxId,
  isSpamSubmission,
  checkRateLimit
} from '../utils/security';
import {
  verifyPaymentInFirestore,
  sendDeliveryEmailViaResend,
  resolveOrderCredentials
} from '../services/autoDelivery';

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
  products?: Product[];
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
  products = [],
}) => {
  const paymentMethods = getStorePaymentMethods(settings);
  const [activeTab, setActiveTab] = useState<'mobile' | 'international' | 'netbanking'>('mobile');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id || 'bkash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [whatsappOrderUrl, setWhatsappOrderUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Automated delivery states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState<'verifying' | 'sending_email' | 'done'>('verifying');
  const [autoDeliveredData, setAutoDeliveredData] = useState<{
    credentials: string;
    instructions: string;
    emailSent: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

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

  const handleCopyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Anti-bot honeypot check
    if (isSpamSubmission(honeypot)) {
      return;
    }

    // 2. Submission rate limiting
    const rateCheck = checkRateLimit('checkout_order_submission', 2000);
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
      setErrorMsg('অনুগ্রহ করে আপনার হোয়াটসঅ্যাপ মোবাইল নম্বর লিখুন।');
      return;
    }
    if (!isValidBDPhone(cleanPhone)) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!cleanEmail) {
      setErrorMsg('অনুগ্রহ করে ডিজিটাল ডেলিভারির জন্য আপনার ইমেইল লিখুন।');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('অনুগ্রহ করে একটি সঠিক ইমেইল অ্যাড্রেস লিখুন (যেমন: yourname@gmail.com)।');
      return;
    }
    if (!cleanTrx) {
      setErrorMsg('অনুগ্রহ করে সেন্ড মানি করে Transaction ID (TrxID) প্রদান করুন।');
      return;
    }
    if (!isValidTrxId(cleanTrx)) {
      setErrorMsg('ট্রানজেকশন আইডি (TrxID) ইংরেজি অক্ষর ও সংখ্যা হতে হবে (৬-২০ অক্ষর)।');
      return;
    }

    const orderId = 'TZ-' + Math.floor(100000 + Math.random() * 900000);

    const itemListSummary = cartItems
      .map(
        (it) =>
          `• ${it.product.title}${it.selectedVariant ? ` (${it.selectedVariant.name})` : ''} x${it.quantity} - ৳${it.price * it.quantity}`
      )
      .join('\n');

    const message =
      `🎉 TOOLZAI BD ORDER (#${orderId})\n\n` +
      `Items:\n${itemListSummary}\n\n` +
      `Subtotal: ৳${rawSubtotal}\n` +
      (discountAmount > 0 ? `Coupon Discount (${couponCode}): -৳${discountAmount}\n` : '') +
      `Total Payable: ৳${finalTotal}\n\n` +
      `Customer Details:\n` +
      `Name: ${cleanName || 'Customer'}\n` +
      `WhatsApp Phone: ${cleanPhone}\n` +
      `Delivery Email: ${cleanEmail}\n\n` +
      `Payment Method: ${activeMethod.name} Personal\n` +
      (cleanSender ? `Sender Number: ${cleanSender}\n` : '') +
      (cleanTrx ? `Transaction ID: ${cleanTrx}\n` : '') +
      `\nPlease verify payment and deliver digital credentials instantly.`;

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

    // ================= ⚡ AUTOMATED VERIFICATION & DELIVERY =================
    const canAutoVerify = Boolean(
      settings?.autoVerifyEnabled &&
      (settings?.firebaseProjectId || settings?.gatewayApiUrl) &&
      cleanTrx
    );

    if (canAutoVerify) {
      setIsVerifying(true);
      setVerificationStage('verifying');

      try {
        const verifyRes = await verifyPaymentInFirestore({
          settings: settings!,
          trxId: cleanTrx,
          requiredAmount: finalTotal,
          orderId,
        });

        if (verifyRes.success) {
          setVerificationStage('sending_email');

          const { credentialsText, instructionsText } = resolveOrderCredentials(newOrder, products);

          let emailSent = false;
          if (settings?.resendApiKey) {
            const emailRes = await sendDeliveryEmailViaResend({
              settings: settings!,
              order: newOrder,
              credentialsText,
              instructionsText,
            });
            emailSent = emailRes.success;
          }

          newOrder.status = 'delivered';
          newOrder.deliveryStatus = emailSent ? 'sent' : 'pending';
          newOrder.deliveryCredentialsSent = credentialsText;
          newOrder.verifiedAt = new Date().toISOString();
          newOrder.notes = `⚡ Auto-Verified via Gateway (TrxID: ${cleanTrx}). Email: ${emailSent ? 'Sent' : 'Pending'}`;

          if (onPlaceOrder) onPlaceOrder(newOrder);

          setAutoDeliveredData({
            credentials: credentialsText,
            instructions: instructionsText,
            emailSent,
          });
          setCompletedOrderId(orderId);
          setWhatsappOrderUrl(targetWhatsAppUrl);
          setOrderComplete(true);
          setIsVerifying(false);
          onOrderSuccess();
          return;
        } else {
          setErrorMsg(verifyRes.message || 'Transaction ID not found in our records.');
          newOrder.notes = `Auto-verify attempt failed: ${verifyRes.message}`;
        }
      } catch (err: any) {
        console.error('Auto verify pipeline error:', err);
        newOrder.notes = `Auto-verify error: ${err.message || 'Unknown'}`;
      } finally {
        setIsVerifying(false);
      }
    }

    // Default Fallback
    if (onPlaceOrder) onPlaceOrder(newOrder);
    setCompletedOrderId(orderId);
    setWhatsappOrderUrl(targetWhatsAppUrl);
    setOrderComplete(true);
    onOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 sm:min-w-[650px] sm:rounded-lg sm:p-8 sm:shadow-lg sm:shadow-[#0057d0]/10 font-['Poppins',sans-serif] my-auto"
        style={{
          backgroundImage: `linear-gradient(350deg, rgb(244, 249, 255), rgba(237, 244, 255, 0.79)), url("https://pay.smmnea.com/themes/default/assets/images/body.png")`,
          backgroundSize: 'cover',
        }}
      >
        
        {/* Top Bar: Close Button */}
        <div className="flex h-12 w-full items-center justify-between overflow-hidden rounded-lg bg-white p-5 shadow-md shadow-[#0057d0]/5 sm:bg-[#fbfcff] sm:shadow-none sm:ring-1 sm:ring-[#0057d0]/10">
          <div className="text-xs font-semibold text-[#6D7F9A]">
            Secure Checkout
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-content-center rounded-full border border-[#e1ecff] text-[#6D7F9A] hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Verification Loading State */}
        {isVerifying ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-[#0057d0] text-[#0057d0] flex items-center justify-center mx-auto animate-spin">
              <Zap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[#30405a]">
                {verificationStage === 'verifying'
                  ? 'গেটওয়েতে পেমেন্ট যাচাই করা হচ্ছে...'
                  : 'পেমেন্ট সফল! আপনার ইমেইলে প্রোডাক্ট পাঠানো হচ্ছে...'}
              </h3>
              <p className="text-xs text-[#879ab6]">
                অপেক্ষা করুন, কয়েক সেকেন্ডের মধ্যে লাইসেন্স পেয়ে যাবেন...
              </p>
            </div>
          </div>
        ) : orderComplete ? (
          /* Order Complete / Delivered State */
          <div className="p-6 sm:p-8 text-center space-y-4">
            {autoDeliveredData ? (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C853] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <span className="bg-[#DCFCE7] text-[#15803D] text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block">
                    ⚡ Instant Delivery Completed
                  </span>
                  <h3 className="text-xl font-semibold text-[#30405a]">
                    পেমেন্ট ভেরিফাইড ও প্রডাক্ট ডেলিভার্ড!
                  </h3>
                  <p className="text-xs text-[#6D7F9A] leading-relaxed">
                    আপনার ডিজিটাল লাইসেন্স / অ্যাক্টিভেশন লিঙ্ক সরাসরি <strong className="text-[#0057d0]">{customerEmail}</strong> এ পাঠিয়ে দেওয়া হয়েছে।
                  </p>
                </div>

                {/* Instant On-Screen Credential Box (Backup) */}
                <div className="text-left bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <Zap className="w-3.5 h-3.5" /> অ্যাক্টিভেশন তথ্য (Backup):
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(autoDeliveredData.credentials)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 font-bold text-[11px]"
                    >
                      {copiedCreds ? <Check className="w-3 h-3 text-[#00C853]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCreds ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap break-all bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
                    {autoDeliveredData.credentials}
                  </pre>
                  {autoDeliveredData.instructions && (
                    <p className="text-[11px] text-slate-400 whitespace-pre-line pt-1 border-t border-slate-800/80">
                      {autoDeliveredData.instructions}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C853] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold text-[#30405a]">অর্ডার সফলভাবে জমা হয়েছে!</h3>
                  <p className="text-xs sm:text-sm text-[#6D7F9A] max-w-md mx-auto">
                    ধন্যবাদ, <strong>{customerName || 'Customer'}</strong>! দ্রুত ডেলিভারির জন্য হোয়াটসঅ্যাপে ইনভয়েসটি পাঠিয়ে দিন।
                  </p>
                </div>
              </div>
            )}

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

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappOrderUrl || getWhatsAppUrl(settings?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Helpline</span>
                <ExternalLink className="w-3.5 h-3.5" />
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
          /* Payment Gateway Interface (Exact 1:1 Structure from User HTML) */
          <div>
            
            {/* Header: Branding & Title */}
            <div className="mb-6 mt-7 flex w-full flex-col items-center sm:mb-3 sm:flex-row">
              <div className="mb-4 sm:mr-8">
                <div className="w-20 h-20 sm:w-[85px] sm:h-[85px] rounded-full ring-1 ring-[#0057D0]/20 bg-gradient-to-tr from-[#0057D0] to-[#004cb7] text-white flex items-center justify-center font-bold text-2xl shadow-md transition-all duration-300 hover:scale-105">
                  PG
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <h3 className="mb-4 text-xl font-semibold text-[#6D7F9A] sm:mb-2">Payment Gateway</h3>
                <div className="text-xs text-[#879ab6] flex items-center gap-1.5">
                  <a
                    href={getWhatsAppUrl(settings?.whatsappNumber, 'Hello ToolzAIBD, I need payment assistance.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0057D0] transition-colors"
                  >
                    সহায়তা
                  </a>
                  <span>•</span>
                  {onOpenPolicy ? (
                    <button type="button" onClick={onOpenPolicy} className="hover:text-[#0057D0] transition-colors">
                      প্রশ্নাবলী
                    </button>
                  ) : (
                    <span>প্রশ্নাবলী</span>
                  )}
                  <span>•</span>
                  {onOpenPolicy ? (
                    <button type="button" onClick={onOpenPolicy} className="hover:text-[#0057D0] transition-colors">
                      বিস্তারিত
                    </button>
                  ) : (
                    <span>বিস্তারিত</span>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder}>
              
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

              {/* Category Tabs (Blue Bar) */}
              <div className="mb-3 flex w-full justify-between overflow-hidden rounded-md bg-[#0057d0] text-white">
                <button
                  type="button"
                  onClick={() => setActiveTab('mobile')}
                  className={`h-full w-full rounded-md py-1.5 text-center text-[12px] leading-[23px] transition-all sm:text-[15px] ${
                    activeTab === 'mobile' ? 'bg-[#004cb7] text-white font-semibold' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  মোবাইল ব্যাংকিং
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('international')}
                  className={`h-full w-full rounded-md py-1.5 text-center text-[12px] leading-[23px] transition-all sm:text-[15px] ${
                    activeTab === 'international' ? 'bg-[#004cb7] text-white font-semibold' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  ইন্টারন্যাশনাল
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`h-full w-full rounded-md py-1.5 text-center text-[12px] leading-[23px] transition-all sm:text-[15px] ${
                    activeTab === 'netbanking' ? 'bg-[#004cb7] text-white font-semibold' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  নেট ব্যাংকিং
                </button>
              </div>

              {/* Tab 1: মোবাইল ব্যাংকিং */}
              {activeTab === 'mobile' && (
                <div className="mt-3 w-full overflow-auto p-0.5 pb-2">
                  <div className="grid grid-cols-2 gap-3 pb-3 sm:grid-cols-4">
                    
                    {/* Bkash Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('bkash')}
                      className={`relative flex flex-col items-center overflow-hidden rounded-xl border bg-[#ffffff] transition-all hover:shadow-lg ${
                        selectedPayment === 'bkash'
                          ? 'border-2 border-[#0057d0] ring-2 ring-[#0057d0]/30 shadow-md shadow-blue-900/10 bg-blue-50/20'
                          : 'border-[#E0E0E0] opacity-85 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      {selectedPayment === 'bkash' && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0057d0] text-white flex items-center justify-center text-[10px] font-bold shadow">
                          ✓
                        </span>
                      )}
                      <div className="flex h-14 w-full items-center justify-center px-3 py-2">
                        <img
                          className="h-10 w-full object-contain"
                          alt="Bkash Personal"
                          src="https://pay.smmnea.com/assets/gateways/bkash/bkashpersonal.png"
                        />
                      </div>
                      <div className={`w-full border-t px-3 py-2 ${selectedPayment === 'bkash' ? 'bg-[#0057d0]/5 font-semibold text-[#0057d0]' : ''}`}>
                        <p className="text-center text-xs tracking-wide text-[#222222]">Bkash Personal</p>
                      </div>
                    </button>

                    {/* Nagad Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('nagad')}
                      className={`relative flex flex-col items-center overflow-hidden rounded-xl border bg-[#ffffff] transition-all hover:shadow-lg ${
                        selectedPayment === 'nagad'
                          ? 'border-2 border-[#0057d0] ring-2 ring-[#0057d0]/30 shadow-md shadow-blue-900/10 bg-blue-50/20'
                          : 'border-[#E0E0E0] opacity-85 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      {selectedPayment === 'nagad' && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0057d0] text-white flex items-center justify-center text-[10px] font-bold shadow">
                          ✓
                        </span>
                      )}
                      <div className="flex h-14 w-full items-center justify-center px-3 py-2">
                        <img
                          className="h-10 w-full object-contain"
                          alt="Nagad Personal"
                          src="https://pay.smmnea.com/assets/gateways/nagad/nagadpersonal.png"
                        />
                      </div>
                      <div className={`w-full border-t px-3 py-2 ${selectedPayment === 'nagad' ? 'bg-[#0057d0]/5 font-semibold text-[#0057d0]' : ''}`}>
                        <p className="text-center text-xs tracking-wide text-[#222222]">Nagad Personal</p>
                      </div>
                    </button>

                    {/* Rocket Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('rocket')}
                      className={`relative flex flex-col items-center overflow-hidden rounded-xl border bg-[#ffffff] transition-all hover:shadow-lg ${
                        selectedPayment === 'rocket'
                          ? 'border-2 border-[#0057d0] ring-2 ring-[#0057d0]/30 shadow-md shadow-blue-900/10 bg-blue-50/20'
                          : 'border-[#E0E0E0] opacity-85 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      {selectedPayment === 'rocket' && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0057d0] text-white flex items-center justify-center text-[10px] font-bold shadow">
                          ✓
                        </span>
                      )}
                      <div className="flex h-14 w-full items-center justify-center px-3 py-2">
                        <img
                          className="h-10 w-full object-contain"
                          alt="Rocket Personal"
                          src="https://pay.smmnea.com/assets/gateways/rocket/rocketpersonal.png"
                        />
                      </div>
                      <div className={`w-full border-t px-3 py-2 ${selectedPayment === 'rocket' ? 'bg-[#0057d0]/5 font-semibold text-[#0057d0]' : ''}`}>
                        <p className="text-center text-xs tracking-wide text-[#222222]">Rocket Personal</p>
                      </div>
                    </button>

                    {/* UPay Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('upay')}
                      className={`relative flex flex-col items-center overflow-hidden rounded-xl border bg-[#ffffff] transition-all hover:shadow-lg ${
                        selectedPayment === 'upay'
                          ? 'border-2 border-[#0057d0] ring-2 ring-[#0057d0]/30 shadow-md shadow-blue-900/10 bg-blue-50/20'
                          : 'border-[#E0E0E0] opacity-85 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      {selectedPayment === 'upay' && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0057d0] text-white flex items-center justify-center text-[10px] font-bold shadow">
                          ✓
                        </span>
                      )}
                      <div className="flex h-14 w-full items-center justify-center px-3 py-2">
                        <img
                          className="h-10 w-full object-contain"
                          alt="UPay Personal"
                          src="https://pay.smmnea.com/assets/gateways/upay/upaypersonal.png"
                        />
                      </div>
                      <div className={`w-full border-t px-3 py-2 ${selectedPayment === 'upay' ? 'bg-[#0057d0]/5 font-semibold text-[#0057d0]' : ''}`}>
                        <p className="text-center text-xs tracking-wide text-[#222222]">UPay Personal</p>
                      </div>
                    </button>
                  </div>

                  {/* Send Money Number & Step-by-Step Instructions */}
                  <div className="mb-3 rounded-xl border border-[#cbe1ff] bg-white p-3.5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[#eef4fc]">
                      <div>
                        <span className="text-[11px] text-[#6D7F9A] block font-medium">
                          {activeMethod.name} Personal Send Money Number:
                        </span>
                        <span className="text-base font-bold font-mono text-[#0057D0] tracking-wide">
                          {activeMethod.number}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(activeMethod.number || '')}
                        className="flex items-center gap-1 rounded-lg border border-[#0057D0]/30 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0057D0] hover:bg-blue-100 transition-colors shadow-xs"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                      </button>
                    </div>

                    {/* Instructions */}
                    <div className="rounded-lg bg-[#F8FAFC] border border-slate-200/70 p-2.5 text-[11.5px] text-[#334155] space-y-1.5">
                      <p className="font-bold text-[#1e293b] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0057D0]"></span>
                        টাকা পাঠানোর নিয়ম (Send Money Instructions):
                      </p>
                      <div className="flex items-start gap-2 pt-0.5">
                        <span className="w-4 h-4 rounded-full bg-[#0057D0] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">১</span>
                        <p>আপনার <strong>{activeMethod.name} অ্যাপ</strong> ওপেন করে <strong>Send Money</strong> সিলেক্ট করুন।</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#0057D0] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">২</span>
                        <p>উপরে প্রদর্শিত নম্বরে সঠিক পরিমাণ <strong>৳{finalTotal}</strong> টাকা সেন্ড মানি করুন।</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#0057D0] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">৩</span>
                        <p>টাকা পাঠানোর পর প্রাপ্ত <strong>Transaction ID (TrxID)</strong> টি নিচের বক্সে লিখে ভেরিফাই করুন।</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: ইন্টারন্যাশনাল */}
              {activeTab === 'international' && (
                <div className="my-3 rounded-lg border border-[#e1ecff] bg-white p-4 text-center space-y-2">
                  <Globe className="w-8 h-8 text-[#0057D0] mx-auto" />
                  <h4 className="text-sm font-semibold text-[#30405a]">Binance Pay & USDT (TRC20 / BEP20)</h4>
                  <p className="text-xs text-[#879ab6]">
                    আন্তর্জাতিক বা ক্রিপ্টোতে পেমেন্ট করতে সরাসরি হোয়াটসঅ্যাপে নক দিন।
                  </p>
                  <a
                    href={getWhatsAppUrl(settings?.whatsappNumber, `Hello, I want to pay ${finalTotal} BDT via Binance / USDT.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#0057D0] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Crypto Help</span>
                  </a>
                </div>
              )}

              {/* Tab 3: নেট ব্যাংকিং */}
              {activeTab === 'netbanking' && (
                <div className="my-3 rounded-lg border border-[#e1ecff] bg-white p-4 text-center space-y-2">
                  <Building2 className="w-8 h-8 text-[#0057D0] mx-auto" />
                  <h4 className="text-sm font-semibold text-[#30405a]">City Touch / Islami Bank / Brac Bank</h4>
                  <p className="text-xs text-[#879ab6]">
                    সরাসরি ব্যাংক ট্রান্সফারের মাধ্যমে পে করতে আমাদের অ্যাকাউন্ট বিস্তারিত পেতে হোয়াটসঅ্যাপে যোগাযোগ করুন।
                  </p>
                  <a
                    href={getWhatsAppUrl(settings?.whatsappNumber, `Hello, I want to pay ${finalTotal} BDT via Bank Transfer.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#0057D0] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Get Bank Details</span>
                  </a>
                </div>
              )}

              {/* Amount (BDT) (Exact User Input Structure) */}
              <label className="mb-2 mt-2 block text-sm font-semibold text-[#30405a]">Amount (BDT)</label>
              <input
                min="1"
                readOnly
                className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 cursor-not-allowed font-bold"
                placeholder="e.g. 13000"
                required
                type="number"
                value={finalTotal}
              />

              {/* Info Alert Message (Matching User HTML) */}
              <p className="mt-3 rounded-md bg-blue-50 p-2 text-xs text-blue-700">
                ⚡ স্বয়ংক্রিয় গেটওয়ে: সমপরিমাণ টাকা সেন্ড মানি করে TrxID প্রদান করুন। যাচাই হওয়ামাত্র স্বয়ংক্রিয়ভাবে ইমেইলে প্রোডাক্ট ডেলিভারি হবে।
              </p>

              {/* Dynamic Error Message (Matching User HTML) */}
              {errorMsg && (
                <p className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}

              {/* Customer Details for Delivery */}
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#30405a] mb-1">আপনার নাম (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. আপনার নাম"
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2 text-xs text-gray-900 focus:border-[#0057d0] focus:ring-[#0057d0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#30405a] mb-1">হোয়াটসঅ্যাপ নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2 text-xs text-gray-900 focus:border-[#0057d0] focus:ring-[#0057d0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#30405a] mb-1">
                    ডেলিভারি ইমেইল (যেখানে লাইসেন্স কি পাঠানো হবে) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 text-xs text-gray-900 focus:border-[#0057d0] focus:ring-[#0057d0]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#30405a] mb-1">
                      প্রেরক নম্বর (Sender No)
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2 text-xs text-gray-900 focus:border-[#0057d0] focus:ring-[#0057d0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#30405a] mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. BL92A8ZK9Q"
                      className="block w-full rounded-lg border border-[#0057d0] bg-white p-2 text-xs font-mono font-bold uppercase text-gray-900 focus:ring-1 focus:ring-[#0057d0]"
                    />
                  </div>
                </div>
              </div>

              {/* Pay Button (Matching User HTML) */}
              <button
                type="submit"
                disabled={isVerifying}
                className="mt-4 w-full rounded-lg bg-[#0057D0] py-3.5 text-center font-semibold text-white shadow-md transition-all hover:bg-[#004cb7] active:scale-[0.99] disabled:opacity-80 cursor-pointer"
              >
                Pay {finalTotal} BDT
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
