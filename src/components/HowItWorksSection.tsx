import React from 'react';
import { ShoppingBag, CreditCard, Zap, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '০১',
      title: 'সাবস্ক্রিপশন নির্বাচন করুন',
      subtitle: 'Choose Your Plan',
      desc: 'ক্যাটালগ থেকে আপনার পছন্দের AI, Office, Design বা Streaming টুল এবং মেয়াদ নির্বাচন করে "Buy Now" এ ক্লিক করুন।',
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'Genuine Licenses',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      step: '০২',
      title: 'বিকাশ বা নগদে সেন্ড মানি করুন',
      subtitle: 'Pay via bKash / Nagad',
      desc: 'স্ক্রিনে প্রদর্শিত নম্বরে বিকাশ, নগদ বা রকেট অ্যাপ থেকে সঠিক পরিমাণ টাকা সেন্ড মানি করে TrxID লিখে "Verify" চাপুন।',
      icon: CreditCard,
      gradient: 'from-[#0057D0] to-blue-700',
      badge: 'Instant Verification',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      step: '০৩',
      title: 'সাথে সাথে ডেলিভারি পেয়ে যান',
      subtitle: '5-Min Instant Delivery',
      desc: 'পেমেন্ট ভেরিফাই হওয়ামাত্রই ১-৫ মিনিটের মধ্যে আপনার ইমেইল ও স্ক্রিনে অ্যাক্টিভেশন ক্রেডেনশিয়াল ও গাইড পৌঁছে যাবে।',
      icon: Zap,
      gradient: 'from-[#00C853] to-emerald-600',
      badge: 'Full Warranty Included',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-[#F8FAFC] to-white border-b border-[#E2E8F0] relative overflow-hidden">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-emerald-100/30 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with pill badge */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] text-xs font-bold shadow-xs">
            <Zap className="w-3.5 h-3.5 text-[#00C853]" />
            <span>৩টি সহজ ধাপে অর্ডার করুন</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight">
            কীভাবে সাবস্ক্রিপশন কিনবেন ও ডেলিভারি পাবেন?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            কোনো জটিলতা ছাড়াই সম্পূর্ণ স্বয়ংক্রিয় পদ্ধতিতে দেশীয় পেমেন্টে মাত্র কয়েক মিনিটে গ্রহণ করুন আপনার ডিজিটাল অ্যাকাউন্ট।
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border-2 border-[#E2E8F0] hover:border-[#00C853] hover:shadow-[0_12px_30px_rgba(0,200,83,0.12)] transition-all duration-300 group"
              >
                {/* Step Number Top-Right */}
                <div className="absolute top-5 right-5 font-heading font-black text-3xl sm:text-4xl text-slate-200 group-hover:text-emerald-300/80 transition-colors pointer-events-none">
                  {item.step}
                </div>

                <div className="space-y-4">
                  {/* Icon Circle */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <IconComp className="w-7 h-7" />
                  </div>

                  {/* Badges & Titles */}
                  <div className="space-y-1.5">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.badge}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0F172A] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Trust Micro-Indicator */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853] shrink-0" />
                  <span>১০০% নিরাপদ ও ভেরিফাইড প্রক্রিয়া</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
