import React from 'react';
import { Zap, ShieldCheck, Headphones, Wallet, RefreshCw, Award, CheckCircle } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: '৫-১৫ মিনিটে অটোমেটিক ডেলিভারি',
      badge: 'Instant Dispatch',
      description: 'পেমেন্ট সম্পন্ন হওয়ামাত্রই স্বয়ংক্রিয়ভাবে আপনার ইমেইলে লাইসেন্স কি, লগইন ও সেটাপ গাইড পৌঁছে যায়।',
      gradient: 'from-amber-500 to-orange-500',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      icon: ShieldCheck,
      title: '১০০% ফুল রিপ্লেসমেন্ট ওয়ারেন্টি',
      badge: 'Zero Risk',
      description: 'মেয়াদের যেকোনো সময় কোনো সমস্যা হলে ঝামেলা ছাড়াই দ্রুততম সময়ে রিপ্লেসমেন্ট বা সমস্যার সমাধান দেওয়া হয়।',
      gradient: 'from-[#00C853] to-emerald-600',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      icon: Wallet,
      title: 'বিকাশ, নগদ ও রকেটে পেমেন্ট',
      badge: 'Local Payments',
      description: 'কোনো আন্তর্জাতিক ক্রেডিট কার্ড বা ডলার ছাড়াই নিশ্চিন্তে লোকাল বাংলাদেশি মোবাইল ব্যাংকিংয়ে পে করুন।',
      gradient: 'from-blue-600 to-indigo-600',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      icon: Headphones,
      title: '২৪/৭ ডেডিকেটেড হোয়াটসঅ্যাপ সাপোর্ট',
      badge: 'Live Human Support',
      description: 'অর্ডার করার আগে কিংবা পরে যেকোনো প্রয়োজনে আমাদের স্পেশালিস্ট সাপোর্ট টিমের সাথে সরাসরি চ্যাট করুন।',
      gradient: 'from-rose-500 to-pink-600',
      tagColor: 'bg-rose-50 text-rose-800 border-rose-200'
    },
    {
      icon: Award,
      title: '১০০% জেনুইন ও অফিসিয়াল লাইসেন্স',
      badge: 'Official Distribution',
      description: 'কোনো ক্র্যাক বা ঝুঁকিপূর্ণ মোড নয়; প্রতিটি অ্যাকাউন্ট অথেনটিক ও প্রাইভেট নিরাপত্তা নিশ্চিত করে প্রদান করা হয়।',
      gradient: 'from-purple-600 to-violet-700',
      tagColor: 'bg-purple-50 text-purple-800 border-purple-200'
    },
    {
      icon: RefreshCw,
      title: 'নিজের ইমেইলে রিনিউ বা আপগ্রেড',
      badge: 'Keep Your Data',
      description: 'Canva Pro, YouTube, Office 365 এর ক্ষেত্রে আপনার নিজস্ব পার্সোনাল ইমেইলেই আপগ্রেড করে নিতে পারবেন।',
      gradient: 'from-teal-500 to-cyan-600',
      tagColor: 'bg-teal-50 text-teal-800 border-teal-200'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-[#E2E8F0] bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] text-xs font-bold shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#00C853]" />
            <span>The ToolzAi BD Advantage</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight leading-tight">
            কেন বাংলাদেশের হাজারো প্রফেশনাল আমাদের বেছে নেন?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            আন্তর্জাতিক সফটওয়্যার কেনা এখন দেশীয় মুদ্রায় একদম সহজ, নিরাপদ ও দ্রুততম।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8FAFC] border-2 border-[#E2E8F0] hover:border-[#00C853] hover:bg-white transition-all duration-300 space-y-3.5 hover:-translate-y-1 shadow-xs hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#0F172A] group-hover:text-[#00C853] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00C853]" />
                  <span>যাচাইকৃত সার্ভিস গ্যারান্টি</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
