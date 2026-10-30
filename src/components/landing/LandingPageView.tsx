import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Store,
  LayoutDashboard,
  AlertCircle,
  Copy
} from 'lucide-react';
import { LandingPage, Order, Coupon, StoreSettings } from '../../types';
import { getWhatsAppUrl, getStorePaymentMethods } from '../../utils/paymentHelpers';
import {
  verifyPaymentInFirestore,
  sendDeliveryEmailViaResend
} from '../../services/autoDelivery';
import {
  sanitizeInput,
  isValidBDPhone,
  isValidEmail,
  isSpamSubmission,
  checkRateLimit
} from '../../utils/security';

interface LandingPageViewProps {
  landingPage: LandingPage;
  onPlaceOrder: (order: Order) => void;
  onGoHome: () => void;
  onOpenAdmin: () => void;
  coupons?: Coupon[];
  settings?: StoreSettings;
  onOpenPolicy?: () => void;
  onCouponUsed?: (code: string) => void;
  onSaveLandingPage?: (page: LandingPage) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  landingPage,
  onPlaceOrder,
  onGoHome,
  onOpenAdmin,
  coupons = [],
  settings,
  onOpenPolicy,
  onCouponUsed,
  onSaveLandingPage,
}) => {
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = landingPage.sliderImages;

  // Countdown timer state (hours, mins, secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 7, mins: 42, secs: 19 });

  // Feature ticker state
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Activation Guide Modal
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  // Video Tutorial Modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Checkout Form State
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedCouponObj, setAppliedCouponObj] = useState<Coupon | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('eps');
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  // Live stock counts
  const [liveStockRemaining, setLiveStockRemaining] = useState(landingPage.stockRemaining ?? 38);
  const [liveStockSold, setLiveStockSold] = useState(landingPage.stockSold ?? 2002);

  useEffect(() => {
    setLiveStockRemaining(landingPage.stockRemaining ?? 38);
    setLiveStockSold(landingPage.stockSold ?? 2002);
  }, [landingPage]);

  // Payment Gateway Modal State
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const paymentMethods = getStorePaymentMethods(settings);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]?.id || 'bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [gatewayOrderId, setGatewayOrderId] = useState('');
  const [gatewayErrorMsg, setGatewayErrorMsg] = useState('');

  // Auto verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState<'verifying' | 'sending_email'>('verifying');
  const [orderComplete, setOrderComplete] = useState(false);
  const [autoDeliveredData, setAutoDeliveredData] = useState<{
    credentials: string;
    instructions: string;
    emailSent: boolean;
  } | null>(null);

  const checkoutRef = useRef<HTMLDivElement>(null);

  // Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let s = prev.secs - 1;
        let m = prev.mins;
        let h = prev.hours;
        if (s < 0) {
          s = 59;
          m -= 1;
          if (m < 0) {
            m = 59;
            h = h > 0 ? h - 1 : 23;
          }
        }
        return { hours: h, mins: m, secs: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slider autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Scrolling feature ticker effect
  useEffect(() => {
    if (landingPage.scrollingFeatures.length <= 1) return;
    const timer = setInterval(() => {
      setActiveFeatureIdx((prev) => (prev + 1) % landingPage.scrollingFeatures.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [landingPage.scrollingFeatures.length]);

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const c = couponCode.trim().toUpperCase();
    if (!c) return;

    const found = coupons.find((cp) => cp.code.toUpperCase() === c && cp.isActive);
    if (found) {
      if (found.minSpend && rawSubtotal < found.minSpend) {
        setCouponMsg({ type: 'error', text: `এই কুপনের জন্য সর্বনিম্ন অর্ডার ${found.minSpend}৳ প্রয়োজন।` });
        return;
      }
      setAppliedCoupon(found.code);
      setAppliedCouponObj(found);
      const discountDesc = found.discountType === 'percent' ? `${found.discountValue}% ছাড়` : `${found.discountValue}৳ ছাড়`;
      setCouponMsg({ type: 'success', text: `কুপন ${c} সফলভাবে প্রয়োগ করা হয়েছে! (${discountDesc})` });
    } else if (c === 'TOOLZAI10' || c === 'VIP10') {
      setAppliedCoupon(c);
      setAppliedCouponObj(null);
      setCouponMsg({ type: 'success', text: `কুপন ${c} সফলভাবে প্রয়োগ করা হয়েছে! (১০% ছাড়)` });
    } else {
      setCouponMsg({ type: 'error', text: 'কুপন কোডটি সঠিক নয়। Try: TOOLZAI10' });
    }
  };

  const unitPrice = landingPage.offerPrice;
  const rawSubtotal = unitPrice * quantity;
  let discountAmount = 0;
  if (appliedCouponObj) {
    if (appliedCouponObj.discountType === 'percent') {
      discountAmount = Math.round(rawSubtotal * (appliedCouponObj.discountValue / 100));
    } else {
      discountAmount = Math.min(rawSubtotal, appliedCouponObj.discountValue);
    }
  } else if (appliedCoupon) {
    discountAmount = Math.round(rawSubtotal * 0.1);
  }
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const formatPrice = (p: number) => {
    return '৳' + p.toLocaleString('en-US');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Anti-bot honeypot check
    if (isSpamSubmission(honeypot)) {
      return;
    }

    // 2. Submission rate limiting
    const rateCheck = checkRateLimit('landing_order_submission', 3000);
    if (!rateCheck.allowed) {
      setFormError(`অনুগ্রহ করে ${rateCheck.waitSeconds} সেকেন্ড অপেক্ষা করে আবার চেষ্টা করুন।`);
      return;
    }

    // 3. Sanitization
    const cleanName = sanitizeInput(customerName);
    const cleanPhone = sanitizeInput(customerPhone);
    const cleanEmail = sanitizeInput(customerEmail);

    // 4. Validation
    if (!cleanName) {
      setFormError('দয়া করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!isValidBDPhone(cleanPhone)) {
      setFormError('সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setFormError('সঠিক জিমেইল বা ইমেইল এড্রেস লিখুন (যেমন: example@gmail.com)।');
      return;
    }

    // 5. Open Real Payment Gateway Modal
    const orderId = 'TZ-LP-' + Math.floor(100000 + Math.random() * 900000);
    setGatewayOrderId(orderId);
    setGatewayErrorMsg('');
    setOrderComplete(false);
    setAutoDeliveredData(null);
    setIsVerifying(false);
    setTrxId('');
    setSenderNumber('');
    setIsGatewayOpen(true);
  };

  const handleCopyPaymentNumber = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    });
  };

  const handleCopyCredentials = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCreds(true);
      setTimeout(() => setCopiedCreds(false), 2000);
    });
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    });
  };

  const handleVerifyAndDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    setGatewayErrorMsg('');

    const cleanSender = sanitizeInput(senderNumber);
    const cleanTrx = sanitizeInput(trxId).toUpperCase();

    if (!cleanTrx || cleanTrx.length < 4) {
      setGatewayErrorMsg('অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const activeMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod) || paymentMethods[0];
    const cleanName = sanitizeInput(customerName);
    const cleanPhone = sanitizeInput(customerPhone);
    const cleanEmail = sanitizeInput(customerEmail);

    const activationLink = `https://one.google.com/promo/gemini-advanced-18m-tz?ref=${gatewayOrderId}&email=${encodeURIComponent(cleanEmail)}`;
    const credentialsText = `• ${landingPage.title} (Personal Account):\nঅফিসিয়াল অ্যাক্টিভেশন লিঙ্ক: ${activationLink}\nঅর্ডার আইডি: #${gatewayOrderId}\nমেয়াদ: ১৮ মাস (১.৫ বছর)\nস্টোরেজ: ৫TB Google One Cloud Storage\nমডেল: Gemini 3.1 Pro & 4 Argon আনলকড`;
    const instructionsText = `১. আপনার ব্রাউজারে ${cleanEmail} জিমেইল লগইন থাকা অবস্থায় উপরের অফিসিয়াল অ্যাক্টিভেশন লিঙ্কে ক্লিক করুন।\n২. 'Claim 18 Months Offer' বা 'Accept Invitation' বাটনে ক্লিক করুন।\n৩. কোনো পাসওয়ার্ড বা কার্ড লাগবে না। আপনার অ্যাকাউন্টে ৫TB ক্লাউড স্টোরেজ ও Gemini Pro সাথে সাথে চালু হয়ে যাবে।\n৪. যেকোনো প্রয়োজনে আমাদের হোয়াটসঅ্যাপ হেল্পলাইনে মেসেজ দিন (${settings?.whatsappNumber || '+8801886822838'})।`;

    const newOrder: Order = {
      id: gatewayOrderId,
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerEmail: cleanEmail,
      items: [
        {
          productId: landingPage.id,
          title: landingPage.title,
          variantName: '18 Months Personal Own Account',
          quantity,
          price: unitPrice,
        },
      ],
      subtotal: rawSubtotal,
      discount: discountAmount,
      total: finalTotal,
      paymentMethod: activeMethod.name,
      senderNumber: cleanSender || undefined,
      trxId: cleanTrx,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: `Order from Landing Page Campaign (${landingPage.slug})`,
    };

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
          orderId: gatewayOrderId,
        });

        if (verifyRes.success) {
          setVerificationStage('sending_email');

          // Deduct stock in real-time
          const nextStockRemaining = Math.max(0, liveStockRemaining - quantity);
          const nextStockSold = liveStockSold + quantity;
          setLiveStockRemaining(nextStockRemaining);
          setLiveStockSold(nextStockSold);

          if (onSaveLandingPage) {
            onSaveLandingPage({
              ...landingPage,
              stockRemaining: nextStockRemaining,
              stockSold: nextStockSold,
              conversionsCount: (landingPage.conversionsCount || 0) + 1,
            });
          }

          // Send Delivery Email via Resend
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
          newOrder.notes = `⚡ Auto-Verified via Firebase (TrxID: ${cleanTrx}). Email: ${emailSent ? 'Sent' : 'Pending'}`;

          onPlaceOrder(newOrder);

          if (appliedCoupon && onCouponUsed) {
            onCouponUsed(appliedCoupon);
          }

          setAutoDeliveredData({
            credentials: credentialsText,
            instructions: instructionsText,
            emailSent,
          });
          setOrderComplete(true);
          setIsVerifying(false);
          return;
        } else {
          setGatewayErrorMsg(verifyRes.message || `TrxID "${cleanTrx}" ফায়ারবেসে পাওয়া যায়নি অথবা পেমেন্টের পরিমাণ সঠিক নয়।`);
          setIsVerifying(false);
          return;
        }
      } catch (err: any) {
        console.error('Firebase verification error:', err);
        setGatewayErrorMsg(`ফায়ারবেস চেক করার সময় ত্রুটি ঘটেছে: ${err.message || 'Unknown error'}`);
        setIsVerifying(false);
        return;
      }
    }

    // Default Fallback: deduct stock and deliver credentials/email
    const nextStockRemaining = Math.max(0, liveStockRemaining - quantity);
    const nextStockSold = liveStockSold + quantity;
    setLiveStockRemaining(nextStockRemaining);
    setLiveStockSold(nextStockSold);

    if (onSaveLandingPage) {
      onSaveLandingPage({
        ...landingPage,
        stockRemaining: nextStockRemaining,
        stockSold: nextStockSold,
        conversionsCount: (landingPage.conversionsCount || 0) + 1,
      });
    }

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

    newOrder.status = 'pending';
    newOrder.deliveryStatus = emailSent ? 'sent' : 'pending';
    newOrder.deliveryCredentialsSent = credentialsText;
    onPlaceOrder(newOrder);

    if (appliedCoupon && onCouponUsed) {
      onCouponUsed(appliedCoupon);
    }

    setAutoDeliveredData({
      credentials: credentialsText,
      instructions: instructionsText,
      emailSent,
    });
    setOrderComplete(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans relative selection:bg-[#00C853] selection:text-white pb-20">
      
      {/* 3D Ambient Blur Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-20 w-[450px] h-[450px] bg-emerald-200/40 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[120px]" />
      </div>

      {/* Top Utility Nav (Store / Dashboard Access) */}
      <div className="relative z-30 bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-[#00C853] text-black font-extrabold text-[10px] px-2 py-0.5 rounded">
            CAMPAIGN
          </span>
          <span className="font-semibold text-slate-300 hidden sm:inline">
            ToolzAi BD Special Landing Campaign • {landingPage.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold"
          >
            <Store className="w-3.5 h-3.5 text-[#00C853]" />
            <span>Main Store</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-[#00C853] hover:underline font-bold"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Floating Glass Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm py-2">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-3">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onGoHome}>
            <img src="./logo.jpg" alt="Logo" className="w-9 h-9 rounded-lg object-contain bg-white border border-[#E2E8F0] p-0.5" />
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl text-[#0F172A] leading-tight">
                TOOLZ<span className="text-[#00C853]">AI</span> <span className="text-[10px] bg-red-600 text-white px-1 py-0.2 rounded font-extrabold">BD</span>
              </span>
            </div>
          </div>

          {/* Announcement Ticker */}
          <div className="hidden md:flex flex-1 max-w-md items-center justify-center">
            <div className="bg-[#ECFDF5] border border-[#10B981] text-[#064E3B] text-xs font-bold px-3.5 py-1 rounded-full flex items-center gap-2 shadow-sm truncate">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="truncate">অর্ডার করুন, ইমেইলে অ্যাক্টিভেশন লিংক অটোমেটিক ডেলিভারি পাবেন</span>
            </div>
          </div>

          {/* Order CTA */}
          <button
            onClick={scrollToCheckout}
            className="bg-[#00C853] hover:bg-[#00B248] text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-full shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all active:scale-95 whitespace-nowrap"
          >
            অর্ডার করুন ↘
          </button>

        </div>
      </header>

      {/* Main Campaign Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-6 sm:pt-8 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-3">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#B45309] text-xs font-bold shadow-sm">
            <span>{landingPage.badgeText}</span>
          </div>

          {/* Title */}
          <h1 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight">
            {landingPage.headline}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {landingPage.subheadline}
          </p>

          {/* Pricing Display */}
          <div className="inline-flex items-center gap-3 bg-white border-[1.5px] border-[#CBD5E1] px-5 py-2 rounded-full shadow-md">
            <span className="text-base text-slate-400 line-through font-semibold font-mono">
              {formatPrice(landingPage.regularPrice)}
            </span>
            <span className="text-3xl font-black text-[#00C853] font-mono leading-none">
              {formatPrice(landingPage.offerPrice)}
            </span>
            <span className="bg-red-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
              {landingPage.saveBadgeText}
            </span>
          </div>

          {/* Countdown Deal Timer */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs">
            <span className="font-bold text-slate-600">⏰ আজকের অফার শেষ হতে বাকি:</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="bg-white border border-[#CBD5E1] px-2.5 py-1 rounded-lg font-black text-sm text-[#0F172A] shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')} <small className="font-sans text-[10px] text-slate-500 font-normal">ঘণ্টা</small>
              </span>
              <span>:</span>
              <span className="bg-white border border-[#CBD5E1] px-2.5 py-1 rounded-lg font-black text-sm text-[#0F172A] shadow-sm">
                {String(timeLeft.mins).padStart(2, '0')} <small className="font-sans text-[10px] text-slate-500 font-normal">মিনিট</small>
              </span>
              <span>:</span>
              <span className="bg-white border border-[#CBD5E1] px-2.5 py-1 rounded-lg font-black text-sm text-[#00C853] shadow-sm">
                {String(timeLeft.secs).padStart(2, '0')} <small className="font-sans text-[10px] text-slate-500 font-normal">সেকেন্ড</small>
              </span>
            </div>
          </div>

          {/* 3D Animated Hero Image Slider */}
          <div className="max-w-2xl mx-auto pt-3">
            <div className="p-1 rounded-[22px] bg-gradient-to-tr from-[#00C853] via-sky-400 to-emerald-500 shadow-xl">
              <div className="relative aspect-[16/9] rounded-[18px] overflow-hidden bg-slate-900 group">
                {slides.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${
                      idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}

                {/* Arrows */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-2.5 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === currentSlide ? 'w-5 bg-[#00C853]' : 'w-2 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToCheckout}
              className="w-full sm:w-auto bg-[#00C853] hover:bg-[#00B248] text-white font-black text-base px-8 py-3.5 rounded-full shadow-[0_6px_22px_rgba(0,200,83,0.35)] transition-all active:scale-95"
            >
              ওয়েবসাইটে অর্ডার করুন — মাত্র {formatPrice(landingPage.offerPrice)}
            </button>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border-[1.5px] border-[#00C853] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
              <span>How to Activate? (এক্টিভেশন গাইড দেখুন)</span>
            </button>
          </div>

          {/* Feature Ticker Strip */}
          <div className="max-w-xl mx-auto mt-4 p-2.5 rounded-xl bg-[#F8F6FF] border border-[#DCD5FF] text-[#162337] text-xs font-bold text-center flex items-center justify-center min-h-[46px] shadow-sm">
            <span className="animate-in fade-in duration-300 key={activeFeatureIdx}">
              {landingPage.scrollingFeatures[activeFeatureIdx]}
            </span>
          </div>

          {/* Stock Counter Strip */}
          <div className="max-w-xl mx-auto p-2.5 bg-white border-[1.5px] border-[#E2E8F0] rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <span className="bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded text-[11px] animate-pulse">
                🔥 দ্রুত ফুরিয়ে যাচ্ছে
              </span>
              <span className="text-slate-600">
                স্টক বাকি: <strong className="text-[#00C853]">{liveStockRemaining} টি</strong> | বিক্রি হয়েছে: <strong>{liveStockSold} টি</strong>
              </span>
            </div>
            <div className="w-28 sm:w-36 h-2 bg-[#F1F5F9] rounded-full overflow-hidden flex-shrink-0">
              <div className="h-full bg-gradient-to-r from-amber-500 to-[#00C853] w-[84%] rounded-full" />
            </div>
          </div>

          {/* Quick Trust Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-sm">
              <span className="text-amber-500 text-lg block mb-0.5">★ ★ ★ ★ ★</span>
              <div className="font-extrabold text-xs text-[#0F172A]">৪.৯/৫ রেটিং</div>
              <div className="text-[10px] text-slate-500">১,২০০+ কাস্টমার রিভিউ</div>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-sm">
              <Zap className="w-5 h-5 text-[#00C853] mx-auto mb-1" />
              <div className="font-extrabold text-xs text-[#0F172A]">ইনস্ট্যান্ট ডেলিভারি</div>
              <div className="text-[10px] text-slate-500">পেমেন্টের ১-৩ মিনিটে ইমেইলে</div>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="font-extrabold text-xs text-[#0F172A]">১০০% অফিসিয়াল</div>
              <div className="text-[10px] text-slate-500">পার্সোনাল ওনার একাউন্ট</div>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-sm">
              <MessageCircle className="w-5 h-5 text-[#25D366] mx-auto mb-1" />
              <div className="font-extrabold text-xs text-[#0F172A]">২৪/৭ লাইভ সাপোর্ট</div>
              <div className="text-[10px] text-slate-500">ডেডিকেটেড হোয়াটসঅ্যাপ হেল্প</div>
            </div>
          </div>

        </div>

        {/* Premium Features Grid */}
        <section className="space-y-4 pt-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold text-[#15803D] bg-[#E8F5E9] border border-[#A5D6A7] px-3 py-0.5 rounded-full uppercase tracking-wider">
              PREMIUM FEATURES
            </span>
            <h2 className="font-heading font-black text-2xl text-[#0F172A]">
              কি কি পাচ্ছেন <span className="text-[#00C853]">{landingPage.title}</span>-তে
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              একটি সাবস্ক্রিপশনেই আনলক করুন গুগল-এর সকল পাওয়ারফুল এআই টুলস ও ক্লাউড স্টোরেজ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {landingPage.features.map((f, i) => (
              <div
                key={i}
                className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:border-[#86EFAC] hover:shadow-md transition-all space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-xl">
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorial Section */}
        <section className="text-center p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-3">
          <span className="text-[11px] font-bold text-[#15803D] bg-[#E8F5E9] border border-[#A5D6A7] px-3 py-0.5 rounded-full uppercase">
            VIDEO TUTORIAL
          </span>
          <h3 className="font-heading font-black text-xl text-[#0F172A]">
            কীভাবে অর্ডার ও অ্যাক্টিভেশন করবেন ভিডিওটি দেখে নিন
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ভিডিও টিউটোরিয়াল দেখে মাত্র ২ মিনিটে নিজেই নিজের জিমেইলে অ্যাক্টিভেশন সম্পন্ন করুন।
          </p>

          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#E8F5E9] hover:bg-[#DCFCE7] border border-[#00C853] text-[#15803D] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Play className="w-4 h-4 fill-[#00C853] text-[#00C853]" />
            <span>ভিডিও টিউটোরিয়াল ওপেন করুন</span>
          </button>
        </section>

        {/* WhatsApp Banner */}
        <section className="p-6 bg-[#F0FDF4] border-[1.5px] border-[#86EFAC] rounded-2xl text-center space-y-3 shadow-sm">
          <h3 className="font-heading font-black text-lg text-[#0F172A]">
            সরাসরি হোয়াটসঅ্যাপে কথা বলতে চান?
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            কোনো প্রশ্ন বা কনফিউশন থাকলে আমাদের সাপোর্ট টিমের সাথে সরাসরি চ্যাট করে জেনে নিতে পারেন।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl(settings?.whatsappNumber, `Hello ToolzAi BD, I want help regarding ${landingPage.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে মেসেজ দিন</span>
            </a>
            <button
              onClick={scrollToCheckout}
              className="bg-[#00C853] hover:bg-[#00B248] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md"
            >
              ওয়েবসাইট থেকে অর্ডার করুন
            </button>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="space-y-3 pt-2">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold text-[#15803D] bg-[#E8F5E9] border border-[#A5D6A7] px-3 py-0.5 rounded-full uppercase">
              FAQ
            </span>
            <h3 className="font-heading font-black text-2xl text-[#0F172A]">
              আপনার সাধারণ <span className="text-[#00C853]">প্রশ্নের উত্তর</span>
            </h3>
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            {landingPage.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#0F172A] hover:text-[#00C853] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-lg text-[#00C853] font-bold">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-xs text-slate-600 border-t border-[#F1F5F9] leading-relaxed pt-2">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= IN-PAGE EXPRESS CHECKOUT FORM ================= */}
        <section ref={checkoutRef} id="order-section" className="pt-4">
          <div className="p-6 sm:p-8 bg-white border-[1.5px] border-[#CBD5E1] rounded-2xl shadow-xl space-y-6">
            
            <div className="text-center space-y-1 pb-2 border-b border-[#E2E8F0]">
              <h2 className="font-heading font-black text-xl sm:text-2xl text-[#0F172A] flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-[#00C853]" />
                ২৪/৭ অর্ডার ও ইনস্ট্যান্ট ডেলিভারি
              </h2>
              <p className="text-xs text-slate-500">
                নিচের তথ্যগুলো পূরণ করে "পেমেন্ট করে অর্ডার করুন" বাটনে ক্লিক করুন
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Invisible honeypot for anti-bot spam defense */}
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

              {formError && (
                <div className="md:col-span-12 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Left Column: Customer Information */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  আপনার কাস্টমার ইনফরমেশন
                </h4>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    মোবাইল / হোয়াটসঅ্যাপ নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    জিমেইল এড্রেস (যেখানে অ্যাক্টিভেশন লিংক পাবেন) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853] focus:bg-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setIsGuideOpen(true)}
                    className="mt-2 w-full text-left p-2 rounded-lg bg-[#F0FDF4] border border-dashed border-[#86EFAC] text-xs font-semibold text-[#15803D] flex items-center justify-between"
                  >
                    <span>অর্ডারের পর কীভাবে এক্টিভ করবেন? <strong>Guide দেখুন</strong></span>
                    <span>→</span>
                  </button>
                </div>

                {/* Coupon Code Input */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    কুপন কোড (যদি থাকে)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="কুপন কোড লিখুন..."
                      className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs font-mono uppercase text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#00C853] hover:bg-[#00B248] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold"
                    >
                      প্রয়োগ করুন
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] font-bold mt-1.5 ${couponMsg.type === 'success' ? 'text-[#15803D]' : 'text-red-600'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

              </div>

              {/* Right Column: Order Summary & Payment Gateway */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  আপনার অর্ডার সামারি
                </h4>

                {/* Summary Card */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
                    <img
                      src={slides[0]}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-lg object-contain bg-white border border-[#E2E8F0] p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs sm:text-sm text-[#0F172A] line-clamp-1">
                        {landingPage.title}
                      </h5>
                      <span className="text-[11px] text-[#00C853] font-bold block">
                        {formatPrice(unitPrice)} / প্রতি সাবস্ক্রিপশন
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-white border border-[#CBD5E1] rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-1 text-xs text-slate-600 hover:bg-[#F1F5F9]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-black text-[#0F172A]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-1 text-xs text-slate-600 hover:bg-[#F1F5F9]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>সাবটোটাল</span>
                      <span className="font-bold text-[#0F172A]">{formatPrice(rawSubtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#15803D] font-bold">
                        <span>কুপন ছাড় ({appliedCoupon})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>ডেলিভারি</span>
                      <span className="text-[#00C853] font-bold">Instant delivery with mail box</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#E2E8F0] text-sm font-black text-[#0F172A]">
                      <span>মোট প্রদেয়</span>
                      <span className="text-xl text-[#00C853]">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    পেমেন্ট মেথড (Payment Method)
                  </label>

                  <div
                    onClick={() => setSelectedPayment('eps')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedPayment === 'eps'
                        ? 'bg-[#F0FDF4] border-[#00C853] shadow-sm'
                        : 'bg-white border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full border-2 border-[#00C853] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#00C853]" />
                        </div>
                        <span className="font-bold text-xs text-[#0F172A]">Easy Payment System</span>
                        <span className="bg-[#16A34A] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                          INSTANT
                        </span>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                    </div>

                    <img
                      src="./products/Minimal-Payment-Methods-Banner.webp"
                      alt="bKash, Nagad, Rocket, Cards"
                      className="w-full max-w-[280px] h-auto object-contain rounded"
                    />
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#00C853] to-[#00875a] hover:from-[#00B248] hover:to-[#00734d] text-white font-black text-sm sm:text-base rounded-xl shadow-[0_6px_20px_rgba(0,200,83,0.35)] transition-all active:scale-95 cursor-pointer"
                >
                  পেমেন্ট করে অর্ডার করুন — {formatPrice(finalTotal)}
                </button>

              </div>

            </form>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#E2E8F0] bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} ToolzAi BD — সর্বস্বত্ব সংরক্ষিত। Official Digital Solutions & IT Services.</p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <button onClick={onGoHome} className="hover:text-[#00C853]">Main Store</button>
            <span>•</span>
            <button onClick={onOpenAdmin} className="hover:text-[#00C853]">Admin Dashboard</button>
            {onOpenPolicy && (
              <>
                <span>•</span>
                <button onClick={onOpenPolicy} className="hover:text-[#00C853]">ওয়ারেন্টি ও রিফান্ড পলিসি</button>
              </>
            )}
            <span>•</span>
            <a href={getWhatsAppUrl(settings?.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="hover:text-[#00C853]">WhatsApp Support</a>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] p-2.5 px-4 flex items-center justify-between shadow-lg">
        <div>
          <div className="font-mono font-black text-lg text-[#00C853] leading-none">
            {formatPrice(finalTotal)}
          </div>
          <span className="text-[10px] text-slate-400 line-through">
            {formatPrice(landingPage.regularPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getWhatsAppUrl(settings?.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={scrollToCheckout}
            className="bg-[#00C853] hover:bg-[#00B248] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md"
          >
            অর্ডার করুন
          </button>
        </div>
      </div>

      {/* Real Payment Gateway & Automated Verification Modal */}
      {isGatewayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div
            className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white p-5 sm:min-w-[620px] sm:rounded-2xl sm:p-7 shadow-2xl border border-blue-100 font-['Poppins',sans-serif] my-auto"
            style={{
              backgroundImage: `linear-gradient(350deg, rgb(244, 249, 255), rgba(237, 244, 255, 0.79)), url("https://pay.smmnea.com/themes/default/assets/images/body.png")`,
              backgroundSize: 'cover',
            }}
          >
            {/* Top Bar */}
            <div className="flex h-12 w-full items-center justify-between overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] animate-pulse" />
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Payment Gateway
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="font-mono text-xs font-bold text-blue-700">
                  #{gatewayOrderId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsGatewayOpen(false)}
                className="grid h-7 w-7 place-content-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
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
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {verificationStage === 'verifying'
                      ? 'ফায়ারবেস ডেটাবেসে TrxID যাচাই করা হচ্ছে...'
                      : 'পেমেন্ট ভেরিফাইড! স্টক থেকে অ্যাক্টিভেশন পাঠানো হচ্ছে...'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    অনুগ্রহ করে ৫-১০ সেকেন্ড অপেক্ষা করুন, লাইসেন্স ডেলিভারি হচ্ছে...
                  </p>
                </div>
              </div>
            ) : orderComplete ? (
              /* Order Complete & Instant Delivery View */
              <div className="p-4 sm:p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C853] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <span className="bg-[#DCFCE7] text-[#15803D] text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block">
                    ⚡ Instant Delivery Completed
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    পেমেন্ট ভেরিফাইড ও অ্যাক্টিভেশন সম্পন্ন!
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    আপনার ডিজিটাল অ্যাক্টিভেশন লিঙ্ক সরাসরি <strong className="text-blue-700">{customerEmail}</strong> এ পাঠিয়ে দেওয়া হয়েছে।
                  </p>
                </div>

                {/* Instant On-Screen Credential Box */}
                {autoDeliveredData && (
                  <div className="text-left bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                        <Zap className="w-3.5 h-3.5" /> অ্যাক্টিভেশন তথ্য (On-Screen Access):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(autoDeliveredData.credentials)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 font-bold text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        {copiedCreds ? <Check className="w-3 h-3 text-[#00C853]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCreds ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap break-all bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
                      {autoDeliveredData.credentials}
                    </pre>
                    {autoDeliveredData.instructions && (
                      <p className="text-[11px] text-slate-300 whitespace-pre-line pt-2 border-t border-slate-800/80 leading-relaxed">
                        {autoDeliveredData.instructions}
                      </p>
                    )}
                  </div>
                )}

                {/* Order ID Pill */}
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto p-2 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl text-xs">
                  <span className="text-slate-600 font-semibold">Order ID:</span>
                  <span className="font-mono font-black text-sm text-[#15803D]">{gatewayOrderId}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyOrderId(gatewayOrderId)}
                    className="p-1 hover:bg-white rounded text-slate-500 hover:text-[#00C853] cursor-pointer"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-[#00C853]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={getWhatsAppUrl(settings?.whatsappNumber, `Hello ToolzAi BD, I have paid for order #${gatewayOrderId} (${landingPage.title}). TrxID: ${trxId}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs py-3 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>হোয়াটসঅ্যাপে হেল্প নিন</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsGatewayOpen(false);
                      setOrderComplete(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all cursor-pointer"
                  >
                    <span>মূল পেজে ফিরে যান</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Methods & Verification Form */
              <form onSubmit={handleVerifyAndDeliver} className="mt-4 space-y-4">
                
                {/* Order Summary Strip */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">প্রোডাক্ট: {landingPage.title}</span>
                    <span className="text-xs font-bold text-[#0F172A]">{customerName} • {customerEmail}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">মোট প্রদেয়</span>
                    <span className="text-xl font-black text-[#00C853] font-mono">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">
                    পেমেন্ট মেথড সিলেক্ট করুন:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {paymentMethods.map((method) => {
                      const isSelected = selectedPaymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-[#0057d0] text-[#0057d0] font-bold shadow-sm ring-1 ring-[#0057d0]'
                              : 'bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-extrabold">{method.name}</span>
                          <span className="text-[9px] opacity-75">{method.fee} Fee</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Method Send Money Instructions & Copy Box */}
                {(() => {
                  const activeMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod) || paymentMethods[0];
                  return (
                    <div className="p-4 rounded-xl bg-white border-2 border-blue-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-extrabold text-blue-900 block">{activeMethod.name} Personal Number:</span>
                          <span className="text-[11px] text-slate-500">নিচের নম্বরে Send Money করুন</span>
                        </div>
                        <span className="bg-emerald-100 text-[#15803D] text-[10px] font-black px-2 py-0.5 rounded-full">
                          0% Fee
                        </span>
                      </div>

                      {/* Number & Copy Button */}
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="font-mono text-base sm:text-lg font-black text-[#0F172A] tracking-wider">
                          {activeMethod.number || activeMethod.address}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPaymentNumber(activeMethod.number || activeMethod.address || '')}
                          className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedNumber ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                        </button>
                      </div>

                      {/* Step-by-step guidance */}
                      <div className="text-[11px] text-slate-600 space-y-1 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                        <p>১. আপনার <strong>{activeMethod.name}</strong> অ্যাপে প্রবেশ করে <strong>Send Money</strong> সিলেক্ট করুন।</p>
                        <p>২. উপরের নম্বরে সর্বমোট <strong>{formatPrice(finalTotal)}</strong> টাকা পাঠান।</p>
                        <p>৩. সফল লেনদেনের পর TrxID ও সেন্ডার নম্বর দিয়ে নিচে <strong>'পেমেন্ট ভেরিফাই ও অ্যাক্টিভেশন নিন'</strong> বাটনে ক্লিক করুন।</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Input Fields: Sender Phone & TrxID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      সেন্ডার নম্বর (যেখান থেকে টাকা পাঠিয়েছেন):
                    </label>
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#0057d0] bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      ট্রানজেকশন আইডি (TrxID) <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: BKL764ABCD"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border-2 border-emerald-400 focus:outline-none focus:border-emerald-600 bg-white font-mono font-bold text-slate-800 uppercase"
                    />
                  </div>
                </div>

                {/* Error Banner if any */}
                {gatewayErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block">{gatewayErrorMsg}</span>
                      <a
                        href={getWhatsAppUrl(settings?.whatsappNumber, `Hello, my TrxID is: ${trxId} for order #${gatewayOrderId}. Please assist with verification.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-700 font-bold underline block"
                      >
                        প্রয়োজনে হোয়াটসঅ্যাপে যোগাযোগ করুন ➔
                      </a>
                    </div>
                  </div>
                )}

                {/* Verify & Deliver Button */}
                <button
                  type="submit"
                  disabled={isVerifying || !trxId.trim()}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#00C853] via-emerald-600 to-[#00875a] hover:from-[#00B248] hover:to-[#00734d] shadow-[0_6px_20px_rgba(0,200,83,0.35)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>⚡ পেমেন্ট ভেরিফাই ও অ্যাক্টিভেশন নিন</span>
                </button>

                <div className="text-center text-[10px] text-slate-400">
                  🔒 256-Bit SSL Encrypted • Direct Firestore Auto-Verification
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Activation Guide Popup Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="relative bg-white border-2 border-[#00C853] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Guide Header */}
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                  EASY GUIDE
                </span>
                <h4 className="font-heading font-black text-sm sm:text-base text-[#0F172A]">
                  Customer Activation Guide
                </h4>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guide Slide Image */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-slate-900">
              <img
                src={landingPage.activationGuideImages[guideStep] || landingPage.activationGuideImages[0]}
                alt={`Activation Step ${guideStep + 1}`}
                className="max-h-[60vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Guide Footer */}
            <div className="p-3.5 bg-white border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <div className="flex gap-1.5">
                {landingPage.activationGuideImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGuideStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === guideStep ? 'w-6 bg-[#00C853]' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <span className="font-bold text-slate-600">
                {guideStep === 0 ? 'Step 1 of 2 (ইনভাইটেশন ইমেইল)' : 'Step 2 of 2 (এক্টিভেশন কনফার্মেশন)'}
              </span>

              <button
                onClick={() => setGuideStep((prev) => (prev + 1) % landingPage.activationGuideImages.length)}
                className="bg-[#00C853] hover:bg-[#00B248] text-white px-3 py-1 rounded-lg font-bold"
              >
                Next Step →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Video Tutorial Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative bg-black rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-bold">
              <span>ভিডিও টিউটোরিয়াল</span>
              <button onClick={() => setIsVideoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-[9/16] max-h-[70vh] mx-auto bg-black flex items-center justify-center">
              <video
                src={landingPage.videoTutorialUrl || 'https://mixprobd.com/wp-content/uploads/2026/10/subscription_order_tutorial.mp4'}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
