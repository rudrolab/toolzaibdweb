import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast do I receive my account or license key after payment?',
      a: 'Delivery takes typically 5 to 15 minutes! Once you submit your order and send money via bKash, Nagad, or Rocket, our team verifies the transaction and delivers the login credentials, invite link, or product key directly to your email and WhatsApp.'
    },
    {
      q: 'Can I upgrade my existing personal email address (e.g., Canva or YouTube)?',
      a: 'Yes! For products like Canva Pro, YouTube Premium, Duolingo Super, Autodesk, and Microsoft 365 Personal, we send an official invitation or license link to your own existing email address. None of your saved designs, playlists, or history will be lost.'
    },
    {
      q: 'What is ToolzAi BD’s replacement warranty policy?',
      a: 'We provide a 100% replacement warranty for the entire duration of your purchase (e.g. 1 Year, 6 Months, or 3 Months). If you face any login or subscription issue, contact our WhatsApp support line, and we will resolve or replace it within minutes.'
    },
    {
      q: 'What payment methods do you accept in Bangladesh?',
      a: 'We accept all major Bangladeshi mobile banking methods: bKash (Personal Send Money / Merchant), Nagad, Rocket, Upay, as well as Binance USDT (TRC20 / BEP20) for crypto users.'
    },
    {
      q: 'Are Windows 11 and Office 2024 licenses genuine and permanent?',
      a: 'Yes, 100% genuine digital product keys that bind directly to official Microsoft servers. They support online activation in Windows Settings, include lifetime security updates, and require zero third-party activation cracks or scripts.'
    },
    {
      q: 'How does Netflix Premium 4K UHD work?',
      a: 'You receive a private 1-screen profile with your own dedicated 4-digit PIN lock. It works with 4K HDR and spatial audio on Smart TV, Phone, Laptop, and TV Box with anti-household lock support.'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-gray-800/80 bg-[#0B0F19]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Help Center
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Have questions before placing your order? Here is everything you need to know.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-gray-900/80 border border-gray-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-white hover:text-amber-400 transition-colors"
                >
                  <span className="font-heading font-bold text-sm sm:text-base flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 border-t border-gray-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
