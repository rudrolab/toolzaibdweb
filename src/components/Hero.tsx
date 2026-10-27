import React from 'react';
import { Zap, ShieldCheck, Headphones, CheckCircle2, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { WHATSAPP_URL } from '../data/products';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-gray-800/60 bg-gradient-to-b from-[#0e1424] via-[#090D16] to-[#090D16]">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[250px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>#1 Digital Account & Subscription Provider in Bangladesh</span>
            </div>

            {/* Main Title */}
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
              Authentic Digital Accounts &{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
                Software Subscriptions
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Get genuine licenses for <strong>Microsoft 365, Google AI, Windows 11, Canva Pro, Duolingo, Netflix</strong> and 20+ premium tools at up to <span className="text-amber-400 font-bold">96% discount</span>. Instant automated delivery with full replacement warranty.
            </p>

            {/* Trust bullet badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-gray-300 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-medium">Instant 5-Min Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-medium">100% Replacement Warranty</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/60 border border-gray-800 col-span-2 sm:col-span-1">
                <CreditCard className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="font-medium">bKash, Nagad & Rocket</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all active:scale-95"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700/80 text-gray-200 hover:text-white font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl transition-all"
              >
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>24/7 WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Card Container */}
              <div className="relative rounded-2xl bg-gradient-to-b from-gray-800/80 to-gray-900/90 p-6 border border-gray-700/80 shadow-2xl backdrop-blur-xl">
                
                {/* Brand Header inside card */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <img src="./logo.jpg" alt="ToolzAi BD" className="w-10 h-10 rounded-lg object-contain bg-white p-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">ToolzAi BD Verified</h4>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Official Digital Partner
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold px-2 py-0.5 rounded">
                    Flash Deals
                  </span>
                </div>

                {/* Popular fast highlights */}
                <div className="space-y-3 py-4">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-amber-500/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        M365
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Microsoft 365 Official</div>
                        <div className="text-[10px] text-gray-400">1TB OneDrive + 5 Devices</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-400">From 499৳</div>
                      <div className="text-[9px] text-rose-400 line-through">2,500৳</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-amber-500/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        Canva
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Canva Pro 1 Year</div>
                        <div className="text-[10px] text-gray-400">Own Email Activation</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-400">599৳</div>
                      <div className="text-[9px] text-rose-400 line-through">4,590৳</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-amber-500/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
                        NF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Netflix Premium 12M</div>
                        <div className="text-[10px] text-gray-400">4K UHD Private Screen Pin</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-400">4,500৳</div>
                      <div className="text-[9px] text-rose-400 line-through">15,000৳</div>
                    </div>
                  </div>
                </div>

                {/* Footer guarantee bar */}
                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Zap className="w-3.5 h-3.5" /> Instant Delivery
                  </span>
                  <span>Over 12,000+ Happy Customers</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
