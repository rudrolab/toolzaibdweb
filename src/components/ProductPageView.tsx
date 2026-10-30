import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  Star,
  Check,
  ShoppingBag,
  MessageCircle,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Share2,
  Sparkles,
  ChevronRight,
  Headphones,
  Award
} from 'lucide-react';
import { Product, ProductVariant, StoreSettings, Coupon } from '../types';
import { ProductCardBanner } from './ProductCardBanner';
import { getWhatsAppUrl } from '../utils/paymentHelpers';

interface ProductPageViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onBuyNow: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  settings?: StoreSettings;
  coupons?: Coupon[];
  onOpenPolicy?: () => void;
}

export const ProductPageView: React.FC<ProductPageViewProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  settings,
  onOpenPolicy,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'description' | 'specs' | 'guide'>('features');
  const [copiedLink, setCopiedLink] = useState(false);

  // Set default variant on product change
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaultVar = product.variants.find((v) => v.isPopular) || product.variants[0];
      setSelectedVariant(defaultVar);
    } else {
      setSelectedVariant(undefined);
    }
    setQuantity(1);
    setImgError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Set page title for SEO & clarity
    const originalTitle = document.title;
    document.title = `${product.title} - ToolzAi BD | Official Subscription & License`;
    return () => {
      document.title = originalTitle;
    };
  }, [product]);

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.currentPrice || (product.priceRange ? product.priceRange.min : 0);

  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;

  const formatPrice = (price: number) => {
    return '৳' + price.toLocaleString('en-BD');
  };

  const discountAmount = originalPrice && originalPrice > currentPrice
    ? (originalPrice - currentPrice) * quantity
    : 0;

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#product=${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      // Fallback
    });
  };

  const handleDirectBuy = () => {
    onBuyNow(product, selectedVariant, quantity);
  };

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
  };

  const handleWhatsAppBuy = () => {
    const variantName = selectedVariant ? ` [${selectedVariant.name}]` : '';
    const message =
      `Hello ToolzAi BD,\n` +
      `I want to buy: ${product.title}${variantName}\n` +
      `Quantity: ${quantity}\n` +
      `Total: ${formatPrice(currentPrice * quantity)}\n\n` +
      `Please provide payment details (bKash/Nagad/Rocket/Upay) and instant delivery guide.`;
    const targetUrl = getWhatsAppUrl(settings?.whatsappNumber, message);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Get related products from the same category or others
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isPopular))
    .slice(0, 4);

  return (
    <div className="w-full bg-[#F8FAFC] pb-16">
      
      {/* 1. Breadcrumbs & Back Navigation Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-500 overflow-hidden">
            <button
              onClick={onBack}
              className="text-slate-700 hover:text-[#00C853] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#00C853] group-hover:-translate-x-0.5 transition-all" />
              <span>হোম (Home)</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600 font-medium truncate">{product.categoryLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#0F172A] font-bold truncate max-w-[180px] sm:max-w-xs">{product.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#00C853] bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 font-medium transition-all cursor-pointer"
              title="Copy product link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00C853]" />
                  <span className="text-[#00C853] font-bold">লিংক কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Product</span>
                </>
              )}
            </button>

            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সব প্রোডাক্টে ফিরে যান</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Product Hero Section (Dual-Column Showcase) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-4 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Product Image Showcase & Guarantees */}
            <div className="lg:col-span-5 space-y-5">
              <div className="w-full aspect-square rounded-2xl overflow-hidden relative bg-[#F8FAFC] border-2 border-[#E2E8F0] shadow-sm flex items-center justify-center p-4 group">
                
                {/* Instant Delivery Pill */}
                {product.instantDelivery && !product.isSoldOut && (
                  <div className="absolute top-3 left-3 z-10 bg-[#00C853] text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 pointer-events-none">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>⚡ Instant Delivery</span>
                  </div>
                )}

                {/* Sold Out Red Pill */}
                {product.isSoldOut && (
                  <div className="absolute top-3 left-3 z-10 bg-[#EF4444] text-white font-black text-xs px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                    Sold Out
                  </div>
                )}

                {/* Discount Tag */}
                {product.discountPercent && !product.isSoldOut && (
                  <div className="absolute top-3 right-3 z-10 bg-[#EF4444] text-white font-extrabold text-xs px-2 py-1 rounded-md shadow-sm">
                    -{product.discountPercent}% OFF
                  </div>
                )}

                {/* Product Image or Custom Banner */}
                {!imgError && product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ProductCardBanner product={product} />
                  </div>
                )}
              </div>

              {/* 4 Trust Feature Cards */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#86EFAC]/70 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#00C853] shrink-0" />
                  <div>
                    <span className="font-bold text-[#15803D] block">৫-১৫ মিনিট ডেলিভারি</span>
                    <span className="text-[11px] text-slate-500">অটোমেটিক ইমেইল ও এসএমএস</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#86EFAC]/70 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0" />
                  <div>
                    <span className="font-bold text-[#15803D] block">১০০% রিপ্লেসমেন্ট</span>
                    <span className="text-[11px] text-slate-500">ফুল সাবস্ক্রিপশন ওয়ারেন্টি</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5">
                  <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">২৪/৭ লাইভ সাপোর্ট</span>
                    <span className="text-[11px] text-slate-500">হোয়াটসঅ্যাপ হেল্পলাইন</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">নিরাপদ পেমেন্ট</span>
                    <span className="text-[11px] text-slate-500">বিকাশ, নগদ, রকেট, উপায়</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Pricing, Variant Selectors, Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category, Brand & Reviews */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-[#15803D] bg-[#E6FCED] border border-[#86EFAC] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Official {product.brand}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {product.categoryLabel}
                  </span>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-bold px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount} ভেরিফাইড রিভিউ)</span>
                  </div>
                </div>

                <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight leading-tight">
                  {product.title}
                </h1>

                <p className="text-sm sm:text-base font-semibold text-[#00C853] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{product.tagline}</span>
                </p>
              </div>

              {/* Price & Savings Display */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFFFF] border border-[#86EFAC]/60 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    বর্তমান অফার মূল্য (Offer Price)
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-[#00C853]">
                      {formatPrice(currentPrice * quantity)}
                    </span>
                    {originalPrice && (
                      <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                        {formatPrice(originalPrice * quantity)}
                      </span>
                    )}
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div className="text-right">
                    <span className="inline-block bg-[#EF4444] text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
                      ৳{discountAmount.toLocaleString('en-BD')} সাশ্রয়!
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1 font-medium">১০% সীমিত সময়ের ছাড়</span>
                  </div>
                )}
              </div>

              {/* Variant Selector (if variants exist) */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                      <span>প্যাকেজ / মেয়াদ সিলেক্ট করুন (Select Plan):</span>
                    </label>
                    <span className="text-xs text-[#00C853] font-semibold">
                      {product.variants.length} টি অপশন উপলব্ধ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between gap-2 relative ${
                            isSelected
                              ? 'bg-[#E6FCED] border-[#00C853] shadow-md ring-1 ring-[#00C853]/40'
                              : 'bg-white border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-[#00C853] bg-[#00C853]' : 'border-slate-400 bg-white'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                                {v.name}
                              </span>
                            </div>

                            {v.isPopular && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-black border border-red-200 uppercase tracking-wide">
                                Popular
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                            {v.duration ? (
                              <span className="text-slate-500 flex items-center gap-1 font-medium text-[11px]">
                                <Clock className="w-3 h-3 text-[#00C853]" /> মেয়াদ: {v.duration}
                              </span>
                            ) : <span />}
                            <div className="text-right">
                              <span className="font-black text-sm text-[#00C853]">{formatPrice(v.price)}</span>
                              {v.originalPrice && (
                                <span className="text-[11px] text-slate-400 line-through ml-1.5">
                                  {formatPrice(v.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">পরিমাণ (Quantity):</span>
                  <span className="text-[11px] text-slate-500">সর্বোচ্চ ২০ টি পর্যন্ত নেওয়া যাবে</span>
                </div>

                <div className="flex items-center bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-slate-700 hover:bg-[#F1F5F9] font-black text-sm transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-black text-[#0F172A] min-w-[36px] text-center bg-slate-50/50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    className="px-3.5 py-2 text-slate-700 hover:bg-[#F1F5F9] font-black text-sm transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* High-Conversion Action Buttons */}
              <div className="space-y-3 pt-2">
                {product.isSoldOut ? (
                  <button
                    onClick={handleWhatsAppBuy}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 font-bold text-sm py-3.5 px-6 rounded-2xl transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>বর্তমানে স্টক শেষ - হোয়াটসঅ্যাপে রিকোয়েস্ট পাঠান</span>
                  </button>
                ) : (
                  <>
                    {/* Primary Direct Buy Button (Triggers streamlined checkout modal) */}
                    <button
                      onClick={handleDirectBuy}
                      className="w-full py-4 px-6 rounded-2xl font-heading font-black text-base sm:text-lg text-white bg-gradient-to-r from-[#0052CC] via-[#0047B3] to-[#003B95] hover:from-[#0B57D0] hover:to-[#0052CC] shadow-[0_8px_20px_rgba(0,82,204,0.35)] hover:shadow-[0_12px_28px_rgba(0,82,204,0.45)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                      <span>⚡ Buy Now / সরাসরি কিনুন ({formatPrice(currentPrice * quantity)})</span>
                    </button>

                    {/* Secondary & Tertiary Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={handleAdd}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-[#00C853] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-600 group-hover:text-[#00C853]" />
                        <span>কার্টে যোগ করুন (Add to Cart)</span>
                      </button>

                      <button
                        onClick={handleWhatsAppBuy}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20BD5A] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 100% Replacement Warranty Box */}
              <div className="p-4 rounded-2xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-between gap-3 text-xs text-[#15803D]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#00C853] shrink-0" />
                  <div>
                    <span className="font-bold block">ToolzAi BD অফিসিয়াল ১০০% রিপ্লেসমেন্ট ওয়ারেন্টি</span>
                    <span className="text-slate-600 text-[11px]">
                      সাবস্ক্রিপশনের মেয়াদ চলাকালীন যেকোনো টেকনিক্যাল সমস্যায় ইনস্ট্যান্ট সমাধান বা নতুন একাউন্ট প্রদান করা হবে।
                    </span>
                  </div>
                </div>
                {onOpenPolicy && (
                  <button
                    type="button"
                    onClick={onOpenPolicy}
                    className="text-xs text-[#00C853] hover:text-[#15803D] font-bold underline whitespace-nowrap cursor-pointer"
                  >
                    পলিসি দেখুন
                  </button>
                )}
              </div>

              {/* Supported Payment Gateways Strip (SMMNEA Official Logos) */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00C853]"></span>
                  নিরাপদ পেমেন্ট মাধ্যম:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <img
                    src="https://pay.smmnea.com/assets/gateways/bkash/bkashpersonal.png"
                    alt="bKash"
                    className="h-5 w-auto object-contain"
                  />
                  <img
                    src="https://pay.smmnea.com/assets/gateways/nagad/nagadpersonal.png"
                    alt="Nagad"
                    className="h-5 w-auto object-contain"
                  />
                  <img
                    src="https://pay.smmnea.com/assets/gateways/rocket/rocketpersonal.png"
                    alt="Rocket"
                    className="h-5 w-auto object-contain"
                  />
                  <img
                    src="https://pay.smmnea.com/assets/gateways/upay/upaypersonal.png"
                    alt="Upay"
                    className="h-5 w-auto object-contain"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 3. In-Depth Details Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          
          {/* Tab Navigation Headers */}
          <div className="flex items-center border-b border-[#E2E8F0] overflow-x-auto no-scrollbar bg-[#F8FAFC]">
            {[
              { id: 'features', label: 'ফিচার ও সুবিধাসমূহ (Features)', icon: Sparkles },
              { id: 'description', label: 'বিস্তারিত বিবরণ (Description)', icon: CheckCircle2 },
              { id: 'specs', label: 'স্পেসিফিকেশন ও ওয়ারেন্টি (Specs)', icon: Award },
              { id: 'guide', label: 'কীভাবে এক্টিভেশন পাবেন? (Activation Guide)', icon: Zap },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#00C853] text-[#00C853] bg-white shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#00C853]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8 lg:p-10">
            
            {/* Tab 1: Key Features */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#0F172A] mb-2">
                    {product.title}-এর প্রধান সুবিধা ও সুবিধাসমূহ
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    অফিসিয়াল ও জেনুইন একাউন্টের সাথে যেসব প্রিমিয়াম ফিচার আপনি সম্পূর্ণ আনলক অবস্থায় উপভোগ করতে পারবেন:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#00C853]" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Detailed Description */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#0F172A] mb-2">
                    পণ্য পরিচিতি ও ব্যবহারের ক্ষেত্র
                  </h3>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                    <p className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC]/50 text-slate-700">
                      <strong className="text-[#15803D]">সংক্ষিপ্ত পরিচিতি: </strong>
                      {product.description}
                    </p>

                    {product.activationInstructions && (
                      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                          এক্টিভেশন নির্দেশিকা (Activation Instructions):
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {product.activationInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Technical Specifications */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#0F172A] mb-2">
                    টেকনিক্যাল স্পেসিফিকেশন ও ওয়ারেন্টি টেবিল
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">
                    সাবস্ক্রিপশন নেওয়ার আগে ডিভাইসের সাপোর্ট এবং অন্যান্য স্পেসিফিকেশন দেখে নিন:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {product.specs.map((s, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-slate-500 block text-xs font-semibold mb-1 uppercase tracking-wider">
                        {s.label}
                      </span>
                      <span className="text-[#0F172A] font-bold text-sm block">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Step-by-Step Activation Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#0F172A] mb-2">
                    কীভাবে ডেলিভারি পাবেন? সহজ ৩টি ধাপ
                  </h3>
                  <p className="text-sm text-slate-600">
                    অর্ডার সম্পন্ন করার সাথে সাথে ৫ থেকে ১৫ মিনিটের মধ্যে সম্পূর্ণ অটোমেটেড প্রসেসে আপনি এক্সেস পেয়ে যাবেন:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0052CC] text-white font-black text-sm flex items-center justify-center">
                      ১
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">প্যাকেজ নির্বাচন ও পেমেন্ট</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "Buy Now" বাটনে ক্লিক করে বিকাশ, নগদ, রকেট বা উপায়ের মাধ্যমে সহজ ট্রানজেকশন সম্পন্ন করুন।
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#00C853] text-white font-black text-sm flex items-center justify-center">
                      ২
                    </div>
                    <h4 className="font-bold text-[#15803D] text-sm">ইনস্ট্যান্ট ক্রেডেনশিয়াল ডেলিভারি</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      পেমেন্ট ভেরিফাই হওয়ামাত্রই আপনার ইমেইলে অফিশিয়াল লগইন আইডি, পাসওয়ার্ড ও সেটআপ গাইড চলে যাবে।
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                      ৩
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">ফুল ওয়ারেন্টি সাপোর্ট</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      যেকোনো সহায়তায় আমাদের ডেডিকেটেড হোয়াটসঅ্যাপ নম্বরে ২৪/৭ সাপোর্ট টিম সাথে সাথে সমাধান করে দিবে।
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 4. Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-[#00C853] uppercase tracking-wider block">
                সম্পর্কিত প্রিমিয়াম সেবা
              </span>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-[#0F172A]">
                অন্যান্য জনপ্রিয় প্রোডাক্টসমূহ
              </h2>
            </div>

            <button
              onClick={onBack}
              className="text-xs sm:text-sm font-bold text-[#0052CC] hover:text-[#00C853] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>সকল পণ্য দেখুন</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct.id}
                onClick={() => onSelectProduct(relProduct)}
                className="group flex flex-col justify-between bg-white rounded-2xl border-[1.5px] border-[#E2E8F0] p-3 hover:-translate-y-1.5 hover:border-[#00C853] hover:shadow-[0_16px_30px_-8px_rgba(0,200,83,0.22)] transition-all duration-300 relative cursor-pointer"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden relative bg-[#F8FAFC] border border-[#E2E8F0]/70 flex items-center justify-center">
                  {relProduct.imageUrl ? (
                    <img
                      src={relProduct.imageUrl}
                      alt={relProduct.title}
                      className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <ProductCardBanner product={relProduct} />
                  )}
                </div>

                <div className="mt-2.5 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#00C853] transition-colors line-clamp-2">
                      {relProduct.title}
                    </h3>
                    <div className="text-xs font-black text-[#00C853] mt-1">
                      {relProduct.priceRange
                        ? `From ৳${relProduct.priceRange.min}`
                        : `৳${relProduct.currentPrice || 0}`}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNow(relProduct);
                    }}
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003B95] hover:from-[#0B57D0] hover:to-[#0052CC] text-white font-black text-[11px] sm:text-xs transition-all shadow-xs cursor-pointer"
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
