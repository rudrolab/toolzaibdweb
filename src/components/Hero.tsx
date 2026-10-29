import React from 'react';
import { Zap, ShieldCheck, Headphones, CheckCircle2, CreditCard, Sparkles, ArrowRight, Star, Users, Clock } from 'lucide-react';
import { StoreSettings } from '../types';
import { getWhatsAppUrl } from '../utils/paymentHelpers';

interface HeroProps {
  onExploreClick: () => void;
  settings?: StoreSettings;
  onOpenPolicy?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, settings, onOpenPolicy }) => {
  const brandLogos = [
    { name: 'ChatGPT Plus', img: './products/ChatGPT-Image-Jul-22-2026-05_38_49-PM-1-home-200-q80.webp', tag: 'OpenAI AI' },
    { name: 'Microsoft 365', img: './products/365-1-home-200-q80.webp', tag: 'Word & 1TB' },
    { name: 'Canva Pro', img: './products/compressed_canva-pro-300x300.webp', tag: 'Design' },
    { name: 'Netflix 4K', img: './products/netflix-premium-12-months-opt-300x300.webp', tag: 'Streaming' },
    { name: 'Prime Video', img: './products/amazon-prime-opt-300x300.webp', tag: 'Movies' },
    { name: 'YouTube Prem', img: './products/compressed_youtube-premium-300x300.webp', tag: 'Ad-Free' },
    { name: 'LinkedIn Prem', img: './products/compressed_Linkedin-Premium-300x300.webp', tag: 'Career' },
    { name: 'Grammarly Pro', img: './products/grammarly-pro-opt-700x700.webp', tag: 'Writing' }
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F0FDF4]/90 via-[#F8FAFC] to-[#FFFFFF]">
      {/* Subtle Decorative Ambient Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-100/70 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-[350px] h-[250px] bg-blue-100/60 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] text-xs font-extrabold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-[#00C853] animate-pulse" />
              <span>#1 Digital Account & Subscription Store in Bangladesh</span>
            </div>

            {/* Main Title */}
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-[1.12]">
              Authentic Digital Accounts &{' '}
              <span className="bg-gradient-to-r from-[#00C853] via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Software Subscriptions
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              আন্তর্জাতিক ক্রেডিট কার্ডের ঝামেলা ছাড়াই বিকাশ, নগদ ও রকেটে কিনুন <strong>Microsoft 365, ChatGPT, Canva Pro, Netflix</strong> সহ ৩০+ প্রিমিয়াম সফটওয়্যার লাইসেন্স। ৫-১৫ মিনিটে অটোমেটিক ডেলিভারি ও ফুল রিপ্লেসমেন্ট ওয়ারেন্টি।
            </p>

            {/* Trust bullet badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-700 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold text-[#1E293B]">৫-১৫ মিনিটে ডেলিভারি</span>
              </div>
              <div
                onClick={onOpenPolicy}
                className={`flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs ${
                  onOpenPolicy ? 'cursor-pointer hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-colors' : ''
                }`}
                title="View 100% Replacement Warranty & Policies"
              >
                <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0" />
                <span className="font-bold text-[#1E293B]">১০০% রিপ্লেসমেন্ট ওয়ারেন্টি</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs col-span-2 sm:col-span-1">
                <CreditCard className="w-4 h-4 text-[#0057D0] shrink-0" />
                <span className="font-bold text-[#1E293B]">বিকাশ, নগদ ও রকেট</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00B248] text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-[0_4px_18px_rgba(0,200,83,0.35)] hover:shadow-[0_6px_24px_rgba(0,200,83,0.45)] transition-all active:scale-95 cursor-pointer"
              >
                <span>সাবস্ক্রিপশন দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWhatsAppUrl(settings?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-bold text-sm sm:text-base px-5 py-3.5 rounded-xl transition-all shadow-xs"
              >
                <Headphones className="w-4 h-4 text-[#00C853]" />
                <span>২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Card Container */}
              <div className="relative rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#E2E8F0] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                
                {/* Brand Header inside card */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <img src="./logo.jpg" alt="ToolzAi BD" className="w-9 h-9 rounded-lg object-contain bg-white border border-[#E2E8F0] p-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">ToolzAi BD Verified</h4>
                      <p className="text-[11px] text-[#15803D] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-[#00C853]" /> Official Digital Partner
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-red-100 border border-red-200 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full animate-pulse">
                    ⚡ Hot Deals
                  </span>
                </div>

                {/* Popular fast highlights with authentic product thumbnails */}
                <div className="space-y-2.5 py-3.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src="./products/365-1-home-200-q80.webp"
                        alt="Microsoft 365"
                        className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] truncate">Microsoft 365 Official</div>
                        <div className="text-[10.5px] text-slate-500">1TB OneDrive + 5 Devices</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#00C853] font-mono">From 499৳</div>
                      <div className="text-[9.5px] text-slate-400 line-through font-mono">2,500৳</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src="./products/compressed_canva-pro-300x300.webp"
                        alt="Canva Pro"
                        className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] truncate">Canva Pro 1 Year</div>
                        <div className="text-[10.5px] text-slate-500">On your own email invite</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#00C853] font-mono">599.00৳</div>
                      <div className="text-[9.5px] text-slate-400 line-through font-mono">4,590৳</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src="./products/netflix-premium-12-months-opt-300x300.webp"
                        alt="Netflix 4K"
                        className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] truncate">Netflix Premium 4K UHD</div>
                        <div className="text-[10.5px] text-slate-500">Private Profile with PIN</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#00C853] font-mono">From 299৳</div>
                      <div className="text-[9.5px] text-slate-400 line-through font-mono">800৳</div>
                    </div>
                  </div>
                </div>

                {/* Instant delivery footer inside card */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-bold text-[#15803D]">
                    <Zap className="w-3.5 h-3.5 text-[#00C853]" /> অটোমেটিক ডেলিভারি
                  </span>
                  <span className="font-bold text-[#0057D0]">
                    bKash • Nagad • Rocket
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Popular Subscriptions Visual Icon/Logo Cloud */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0]/80">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            শীর্ষস্থানীয় প্ল্যাটফর্ম ও সফটওয়্যার সাবস্ক্রিপশনসমূহ
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {brandLogos.map((brand, bIdx) => (
              <div
                key={bIdx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-[#00C853] hover:shadow-sm transition-all"
              >
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="w-6 h-6 rounded-md object-contain p-0.5 bg-slate-50 border border-slate-200"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">{brand.name}</span>
                  <span className="text-[9.5px] text-slate-400 block font-medium">{brand.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Live Metric Stat Cards (Trust Bar) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00C853] border border-emerald-200 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-heading font-black text-slate-900 leading-none">১২,৫০০+</div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">সন্তুষ্ট গ্রাহক (Customers)</div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-heading font-black text-slate-900 leading-none">৫-১৫ মিনিট</div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">গড় ডেলিভারি সময় (Fast Delivery)</div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0057D0] border border-blue-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-heading font-black text-slate-900 leading-none">১০০% গ্যারান্টি</div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">ফুল রিপ্লেসমেন্ট ওয়ারেন্টি</div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-purple-500" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-heading font-black text-slate-900 leading-none">৪.৯ / ৫.০</div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">কাস্টমার স্যাটিসফ্যাকশন</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
