import React from 'react';
import { Zap, ShieldCheck, Headphones, Wallet, RefreshCw, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: '5-15 Min Instant Delivery',
      description: 'Automated delivery system dispatches digital license keys, account credentials, and guides right after payment verification.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: ShieldCheck,
      title: '100% Replacement Warranty',
      description: 'Zero hassle warranty. In the rare event of any downtime or lock during your subscription, our team provides an immediate replacement.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Wallet,
      title: 'Local Bangladeshi Payments',
      description: 'Pay smoothly with bKash, Nagad, Rocket, Upay, or Binance USDT without needing an international dual-currency credit card.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: Headphones,
      title: '24/7 WhatsApp Support',
      description: 'Have questions before or after buying? Reach out to our dedicated Bangladeshi support specialists anytime directly on WhatsApp.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      icon: Award,
      title: 'Authentic & Private Licenses',
      description: 'All software and tools come from legitimate partner distributions. We offer both private personal accounts and budget-friendly shared slots.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: RefreshCw,
      title: 'Renewal on Own Accounts',
      description: 'For Canva Pro, YouTube, Microsoft 365, and Duolingo, we can upgrade your existing email address without losing personal data or bookmarks.',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-gray-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            The ToolzAi BD Advantage
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white">
            Why Thousands of Bangladeshi Creators Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            We solve the headache of buying international software subscriptions in Bangladesh with local payment, instant delivery, and authentic guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0d1322] border border-gray-800/80 hover:border-gray-700 transition-all space-y-3 hover:-translate-y-1 duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
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
