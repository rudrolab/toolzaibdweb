import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Copy,
  Zap,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Lock,
  Globe,
  Building2
} from 'lucide-react';
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
import {
  verifyPaymentInFirestore,
  sendDeliveryEmailViaResend,
  resolveOrderCredentials
} from '../services/autoDelivery';

// Official Vector Provider Logos
const BkashLogo = () => (
  <div className="flex items-center justify-center">
    <svg viewBox="0 0 100 32" className="h-6 w-auto" fill="none">
      <path d="M22 4L8 24h12l-3 7 19-19H24l4-12z" fill="#E2136E" />
      <text x="42" y="22" fontFamily="sans-serif" fontWeight="900" fontSize="18" fill="#E2136E" letterSpacing="-0.5px">bKash</text>
    </svg>
  </div>
);

const NagadLogo = () => (
  <div className="flex items-center justify-center">
    <svg viewBox="0 0 100 32" className="h-6 w-auto" fill="none">
      <circle cx="16" cy="16" r="11" fill="#F7941D" fillOpacity="0.2" />
      <path d="M16 6c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10c0-3.8-2-6.6-4.8-8.5l-1.9 2.8c1.9 1.4 2.9 3.3 2.9 5.7 0 3.8-2.9 6.7-6.2 6.7s-6.2-2.9-6.2-6.7c0-3.8 2.9-6.7 6.2-6.7v-3.3z" fill="#F7941D" />
      <circle cx="16" cy="16" r="2.8" fill="#ED1C24" />
      <text x="36" y="22" fontFamily="sans-serif" fontWeight="900" fontSize="17" fill="#F7941D" letterSpacing="-0.5px">নগদ</text>
    </svg>
  </div>
);

const RocketLogo = () => (
  <div className="flex items-center justify-center">
    <svg viewBox="0 0 100 32" className="h-6 w-auto" fill="none">
      <path d="M15 4c-4 5-5.5 10-5.5 15 0 4 2 8 5.5 9.5 3.5-1.5 5.5-5.5 5.5-9.5 0-5-1.5-10-5.5-15z" fill="#8C3494" />
      <path d="M9.5 19l-4 4 1.2 2 4.8-2M20.5 19l4 4-1.2 2-4.8-2" stroke="#8C3494" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15" cy="14" r="2.8" fill="#FFFFFF" />
      <text x="34" y="22" fontFamily="sans-serif" fontWeight="900" fontSize="17" fill="#8C3494" letterSpacing="-0.5px">রকেট</text>
    </svg>
  </div>
);

const UpayLogo = () => (
  <div className="flex items-center justify-center">
    <svg viewBox="0 0 100 32" className="h-6 w-auto" fill="none">
      <path d="M9 9v8a6.5 6.5 0 0013 0V9h-3.3v8a3.2 3.2 0 01-6.4 0V9H9z" fill="#0072BC" />
      <circle cx="15.5" cy="6.5" r="2.2" fill="#FFC80A" />
      <circle cx="15.5" cy="19.5" r="2.2" fill="#FFC80A" />
      <text x="32" y="22" fontFamily="sans-serif" fontWeight="900" fontSize="18" fill="#0072BC" letterSpacing="-0.5px">upay</text>
    </svg>
  </div>
);

interface QuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderSuccess: (msg: string) => void;
  onPlaceOrder?: (order: Order) => void;
  coupons?: Coupon[];
  settings?: StoreSettings;
  onOpenPolicy?: () => void;
  onCouponUsed?: (couponCode: string) => void;
  products?: Product[];
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
  products = [],
}) => {
  const paymentMethods = getStorePaymentMethods(settings);
  const [activeTab, setActiveTab] = useState<'mobile' | 'international' | 'netbanking'>('mobile');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
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

  // Auto verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState<'verifying' | 'sending_email' | 'done'>('verifying');
  const [autoDeliveredData, setAutoDeliveredData] = useState<{
    credentials: string;
    instructions: string;
    emailSent: boolean;
  } | null>(null);

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
    setAutoDeliveredData(null);
    
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

  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '৳';
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

  const handleCopyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setErrorMsg('অনুগ্রহ করে কুপন কোড লিখুন।');
      return;
    }

    const matched = coupons.find((c) => c.code === code && c.isActive);
    if (!matched) {
      setErrorMsg('অবৈধ অথবা মেয়াদোত্তীর্ণ কুপন কোড।');
      return;
    }

    if (matched.minSpend && rawSubtotal < matched.minSpend) {
      setErrorMsg(`এই কুপনটি ব্যবহার করতে ন্যূনতম ${formatPrice(matched.minSpend)} টাকার অর্ডার প্রয়োজন।`);
      return;
    }

    setAppliedCoupon(matched);
    setErrorMsg('');
    if (onCouponUsed) onCouponUsed(matched.code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Anti-bot honeypot check
    if (isSpamSubmission(honeypot)) {
      return;
    }

    // 2. Submission rate limiting
    const rateCheck = checkRateLimit('quick_order_submission', 2000);
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
    if (!cleanTrx) {
      setErrorMsg('অনুগ্রহ করে সেন্ড মানি করে Transaction ID (TrxID) প্রদান করুন।');
      return;
    }
    if (!isValidTrxId(cleanTrx)) {
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
      `Payment: ${activeMethod.name} Personal\n` +
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

    // ================= ⚡ AUTOMATED VERIFICATION & DELIVERY =================
    const canAutoVerify = Boolean(
      settings?.autoVerifyEnabled &&
      settings?.firebaseProjectId &&
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

          const allProductsList = products.length > 0 ? products : [product];
          const { credentialsText, instructionsText } = resolveOrderCredentials(newOrder, allProductsList);

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
          newOrder.notes = `⚡ Auto-Verified via Firebase Firestore (TrxID: ${cleanTrx}). Email: ${emailSent ? 'Sent' : 'Pending'}`;

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
          return;
        } else {
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
    onOrderSuccess(`Order placed! Redirecting to WhatsApp...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Background Pattern Wallpaper */}
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-auto"
        style={{
          backgroundImage: `radial-gradient(#E2E8F0 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      >
        
        {/* Top Search / Header Pill */}
        <div className="p-4 sm:p-5 pb-0">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>ToolzAi BD Secure 256-bit Encrypted Checkout</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Loading State */}
        {isVerifying ? (
          <div className="p-8 sm:p-12 text-center space-y-5 bg-white/95">
            <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-[#0052CC] text-[#0052CC] flex items-center justify-center mx-auto animate-spin">
              <Zap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-lg text-[#0F172A]">
                {verificationStage === 'verifying'
                  ? 'গেটওয়েতে পেমেন্ট যাচাই করা হচ্ছে...'
                  : 'পেমেন্ট সফল! আপনার ইমেইলে প্রোডাক্ট পাঠানো হচ্ছে...'}
              </h3>
              <p className="text-xs text-slate-500">
                অপেক্ষা করুন, কয়েক সেকেন্ডের মধ্যে লাইসেন্স পেয়ে যাবেন...
              </p>
            </div>
          </div>
        ) : orderComplete ? (
          /* Order Complete State */
          <div className="p-6 sm:p-8 text-center space-y-4 bg-white/95">
            {autoDeliveredData ? (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C853] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <span className="bg-[#DCFCE7] text-[#15803D] text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block">
                    ⚡ Instant Delivery Completed
                  </span>
                  <h3 className="font-heading font-black text-xl text-[#0F172A]">
                    পেমেন্ট ভেরিফাইড ও প্রডাক্ট ডেলিভার্ড!
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    আপনার ডিজিটাল লাইসেন্স / অ্যাক্টিভেশন লিঙ্ক সরাসরি <strong className="text-blue-600">{customerEmail}</strong> এ পাঠিয়ে দেওয়া হয়েছে।
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
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C853] flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-2xl text-[#0F172A]">অর্ডার সফলভাবে জমা হয়েছে!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    ধন্যবাদ, <strong>{customerName || 'Customer'}</strong>! দ্রুত ডেলিভারির জন্য হোয়াটসঅ্যাপ বাটনে ক্লিক করে ইনভয়েসটি পাঠিয়ে দিন।
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

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left max-w-md mx-auto text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount:</span>
                <span className="font-black text-blue-600 text-sm">{formatPrice(finalTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Email:</span>
                <span className="font-bold text-[#0F172A]">{customerEmail}</span>
              </div>
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
          /* Payment Gateway Interface (1:1 Match with Screenshot) */
          <div className="bg-white/95">
            
            {/* Selected Product Pill Banner */}
            <div className="px-5 sm:px-6 pt-3 pb-2 flex items-center justify-between border-b border-slate-100 bg-[#F8FAFC]/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain p-0.5" />
                  ) : (
                    <ProductCardBanner product={product} />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#0F172A] truncate">
                    {product.title} {selectedVariant ? `(${selectedVariant.name})` : ''}
                  </h4>
                  <span className="text-[10px] text-slate-500">Qty: {quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-blue-600 font-mono">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Gateway Brand Header */}
            <div className="px-5 sm:px-6 pt-3 pb-3 flex items-center gap-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-heading font-black text-xs shadow-sm flex-shrink-0">
                <span>PG</span>
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-[#0F172A] tracking-tight">
                  Payment Gateway
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <a
                    href={getWhatsAppUrl(settings?.whatsappNumber, 'Hello ToolzAIBD, I need help with payment.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    সহায়তা
                  </a>
                  <span>•</span>
                  {onOpenPolicy && (
                    <button
                      type="button"
                      onClick={onOpenPolicy}
                      className="hover:text-blue-600 transition-colors"
                    >
                      প্রশ্নাবলী
                    </button>
                  )}
                  <span>•</span>
                  {onOpenPolicy && (
                    <button
                      type="button"
                      onClick={onOpenPolicy}
                      className="hover:text-blue-600 transition-colors"
                    >
                      বিস্তারিত
                    </button>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
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

              {/* Product Option Variants (if any) */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Option / Duration:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`text-xs font-bold py-1.5 px-3 rounded-xl border transition-all text-left flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span>{v.name}</span>
                          <span className={isSelected ? 'text-blue-700' : 'text-slate-500'}>
                            {formatPrice(v.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Promo Code Input & Discount Pill */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon: TOOLZAI10"
                  className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-blue-600 focus:outline-none uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedCoupon && (
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex justify-between items-center">
                  <span>
                    Coupon {appliedCoupon.code} applied ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discountValue}% OFF` : `${appliedCoupon.discountValue}৳ OFF`})
                  </span>
                  <span className="text-emerald-800">Saved -{formatPrice(discount)}</span>
                </div>
              )}

              {/* Category Navigation Tabs (The iconic Blue Bar from screenshot) */}
              <div className="bg-[#0052CC] rounded-xl p-1 grid grid-cols-3 gap-1 shadow-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('mobile')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'mobile'
                      ? 'bg-[#003B95] text-white shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  মোবাইল ব্যাংকিং
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('international')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'international'
                      ? 'bg-[#003B95] text-white shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ইন্টারন্যাশনাল
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'netbanking'
                      ? 'bg-[#003B95] text-white shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  নেট ব্যাংকিং
                </button>
              </div>

              {/* Tab 1: মোবাইল ব্যাংকিং (4 Grid Cards matching screenshot) */}
              {activeTab === 'mobile' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Bkash Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('bkash')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        selectedPayment === 'bkash'
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <BkashLogo />
                      <span className="text-[11px] font-semibold text-slate-600">Bkash Personal</span>
                    </button>

                    {/* Nagad Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('nagad')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        selectedPayment === 'nagad'
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <NagadLogo />
                      <span className="text-[11px] font-semibold text-slate-600">Nagad Personal</span>
                    </button>

                    {/* Rocket Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('rocket')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        selectedPayment === 'rocket'
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <RocketLogo />
                      <span className="text-[11px] font-semibold text-slate-600">Rocket Personal</span>
                    </button>

                    {/* UPay Personal */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('upay')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        selectedPayment === 'upay'
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <UpayLogo />
                      <span className="text-[11px] font-semibold text-slate-600">UPay Personal</span>
                    </button>
                  </div>

                  {/* Provider Send Money Details Box */}
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10.5px] text-slate-500 font-semibold block uppercase">
                          {activeMethod.name} Personal Send Money Number:
                        </span>
                        <span className="text-base font-black font-mono text-[#0F172A] tracking-wider">
                          {activeMethod.number}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(activeMethod.number || '')}
                        className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 shadow-sm transition-all"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/80 space-y-0.5">
                      <p>১. আপনার <strong>{activeMethod.name} অ্যাপে</strong> গিয়ে <strong>Send Money</strong> সিলেক্ট করুন।</p>
                      <p>২. নিচে উল্লেখিত স্বয়ংক্রিয় <strong>{formatPrice(finalTotal)}</strong> টাকা সেন্ড মানি করুন।</p>
                      <p>৩. প্রাপ্ত <strong>Transaction ID (TrxID)</strong> নিচে লিখে পে চাপুন।</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: ইন্টারন্যাশনাল */}
              {activeTab === 'international' && (
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-center space-y-3 animate-in fade-in duration-150">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#0F172A]">Binance Pay & USDT (TRC20 / BEP20)</h4>
                    <p className="text-xs text-slate-600">
                      আন্তর্জাতিক পেমেন্ট বা ক্রিপ্টোতে পে করতে চাইলে সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন।
                    </p>
                  </div>
                  <a
                    href={getWhatsAppUrl(settings?.whatsappNumber, `Hello ToolzAIBD, I want to pay ${formatPrice(finalTotal)} using Crypto USDT / Binance for ${product.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0052CC] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Pay via WhatsApp Crypto Help</span>
                  </a>
                </div>
              )}

              {/* Tab 3: নেট ব্যাংকিং */}
              {activeTab === 'netbanking' && (
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-center space-y-3 animate-in fade-in duration-150">
                  <Building2 className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#0F172A]">City Touch / Islami Bank / Brac Bank</h4>
                    <p className="text-xs text-slate-600">
                      সরাসরি ব্যাংক ট্রান্সফারের মাধ্যমে পে করতে আমাদের অ্যাকাউন্ট বিস্তারিত পেতে হোয়াটসঅ্যাপে নক দিন।
                    </p>
                  </div>
                  <a
                    href={getWhatsAppUrl(settings?.whatsappNumber, `Hello ToolzAIBD, I want to pay ${formatPrice(finalTotal)} via Bank Transfer for ${product.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0052CC] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Get Bank Account Details</span>
                  </a>
                </div>
              )}

              {/* Amount (BDT) Section (Exact Screenshot Match: Automatic Set) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Amount (BDT)
                  </label>
                  <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Automatic Set
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={finalTotal}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#0F172A] cursor-not-allowed select-all focus:outline-none"
                  placeholder="e.g. 13000"
                />

                {/* Light Blue Info Alert Banner (Matching screenshot) */}
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] rounded-xl px-3.5 py-2 text-[11px] leading-relaxed flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>
                    স্বয়ংক্রিয় গেটওয়ে: সমপরিমাণ টাকা সেন্ড মানি করে TrxID দিন, সাথে সাথে ইমেইলে প্রোডাক্ট ডেলিভারি হবে।
                  </span>
                </div>
              </div>

              {/* Customer Details for Delivery */}
              <div className="pt-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      আপনার নাম (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Julkar Nayen"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      হোয়াটসঅ্যাপ নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    ডেলিভারি ইমেইল (যেখানে লাইসেন্স কি পাঠানো হবে) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      প্রেরক নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. BL92A8ZK9Q"
                      className="w-full bg-[#F8FAFC] border border-blue-400 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-[#0F172A] focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Big Blue Pay Amount Action Button (Screenshot Match) */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#0052CC] hover:bg-[#0047B3] text-white font-heading font-black text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <span>Pay Amount</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
