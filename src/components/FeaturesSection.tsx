import React from 'react';
import { Zap, ShieldCheck, Headphones, Wallet, RefreshCw, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: '5-15 Min Instant Delivery',
      description: 'Automated delivery system dispatches digital license keys, account credentials, and setup guides right after payment verification.',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      icon: ShieldCheck,
      title: '100% Replacement Warranty',
      description: 'Zero hassle warranty. In the rare event of any downtime or lock during your subscription, our team provides an immediate replacement.',
      color: 'text-[#15803D] bg-[#E6FCED] border-[#86EFAC]'
    },
    {
      icon: Wallet,
      title: 'Local Bangladeshi Payments',
      description: 'Pay smoothly with bKash, Nagad, Rocket, Upay, or Binance USDT without needing an international dual-currency credit card.',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: Headphones,
      title: '24/7 WhatsApp Support',
      description: 'Have questions before or after buying? Reach out to our dedicated Bangladeshi support specialists anytime directly on WhatsApp.',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      icon: Award,
      title: 'Authentic & Private Licenses',
      description: 'All software and tools come from legitimate partner distributions. We offer both private personal accounts and budget-friendly shared slots.',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      icon: RefreshCw,
      title: 'Renewal on Own Accounts',
      description: 'For Canva Pro, YouTube, Microsoft 365, and Duolingo, we can upgrade your existing email address without losing personal data or bookmarks.',
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-[#E2E8F0] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold text-[#15803D] uppercase tracking-widest bg-[#E6FCED] border border-[#86EFAC] px-3.5 py-1 rounded-full shadow-sm">
            The ToolzAi BD Advantage
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight">
            Why Thousands of Bangladeshi Creators Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We solve the headache of buying international software subscriptions in Bangladesh with local payment, instant delivery, and authentic guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#86EFAC] hover:bg-[#F0FDF4] transition-all space-y-3 hover:-translate-y-1 duration-200 shadow-sm hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#0F172A]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
