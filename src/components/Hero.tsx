import React from 'react';
import { Zap, ShieldCheck, Headphones, CheckCircle2, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { WHATSAPP_URL } from '../data/products';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F0FDF4]/80 via-[#F8FAFC] to-[#FFFFFF]">
      {/* Subtle Decorative Ambient Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-100/60 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-[350px] h-[250px] bg-amber-100/50 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-[#00C853]" />
              <span>#1 Digital Account & Subscription Store in Bangladesh</span>
            </div>

            {/* Main Title */}
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-[1.15]">
              Authentic Digital Accounts &{' '}
              <span className="bg-gradient-to-r from-[#00C853] via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Software Subscriptions
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Get genuine licenses for <strong>Microsoft 365, Google AI, Windows 11, Canva Pro, Duolingo, Netflix</strong> and 20+ premium tools at up to <span className="text-[#00C853] font-bold">96% discount</span>. Instant automated delivery with full replacement warranty.
            </p>

            {/* Trust bullet badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-700 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="font-semibold">Instant 5-Min Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#00C853] flex-shrink-0" />
                <span className="font-semibold">100% Replacement Warranty</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm col-span-2 sm:col-span-1">
                <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-semibold">bKash, Nagad & Rocket</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00B248] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(0,200,83,0.35)] hover:shadow-[0_6px_22px_rgba(0,200,83,0.45)] transition-all active:scale-95"
              >
                <span>Browse Subscriptions</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-bold text-sm sm:text-base px-5 py-3.5 rounded-xl transition-all shadow-sm"
              >
                <Headphones className="w-4 h-4 text-[#00C853]" />
                <span>24/7 WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Card Container */}
              <div className="relative rounded-2xl bg-white p-6 border border-[#E2E8F0] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                
                {/* Brand Header inside card */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <img src="./logo.jpg" alt="ToolzAi BD" className="w-10 h-10 rounded-lg object-contain bg-white border border-[#E2E8F0] p-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">ToolzAi BD Verified</h4>
                      <p className="text-[11px] text-[#15803D] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-[#00C853]" /> Official Digital Partner
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-red-100 border border-red-200 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full">
                    Flash Deals
                  </span>
                </div>

                {/* Popular fast highlights */}
                <div className="space-y-3 py-4">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        M365
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">Microsoft 365 Official</div>
                        <div className="text-[10.5px] text-slate-500">1TB OneDrive + 5 Devices</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#00C853]">From 499৳</div>
                      <div className="text-[9.5px] text-slate-400 line-through">2,500৳</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        Canva
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">Canva Pro 1 Year</div>
                        <div className="text-[10.5px] text-slate-500">On your own email invite</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#00C853]">599.00৳</div>
                      <div className="text-[9.5px] text-slate-400 line-through">4,590৳</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        Win11
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">Windows 11 Pro Genuine</div>
                        <div className="text-[10.5px] text-slate-500">Lifetime Online Activation</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#00C853]">From 899৳</div>
                      <div className="text-[9.5px] text-slate-400 line-through">1,800৳</div>
                    </div>
                  </div>
                </div>

                {/* Instant delivery footer */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-[#15803D]">
                    <Zap className="w-3.5 h-3.5 text-[#00C853]" /> 5-15 Min Instant Delivery
                  </span>
                  <span className="font-bold text-[#0F172A]">
                    bKash • Nagad • Rocket
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
