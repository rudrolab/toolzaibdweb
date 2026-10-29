import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../data/products';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'পেমেন্ট করার কতক্ষণ পর অ্যাকাউন্ট বা লাইসেন্স কি পাবো?',
      badge: 'ডেলিভারি সময়',
      a: 'পেমেন্ট সম্পন্ন হওয়ার পর সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যেই ডেলিভারি দেওয়া হয়! স্বয়ংক্রিয় গেটওয়েতে TrxID ভেরিফাই হলে তাৎক্ষণিকভাবে স্ক্রিন এবং ইমেইলে আইডি-পাসওয়ার্ড ও সেটাপ গাইড প্রদর্শিত হয়।'
    },
    {
      q: 'আমার নিজস্ব পার্সোনাল ইমেইলে কি আপগ্রেড নেওয়া সম্ভব (Canva বা YouTube)?',
      badge: 'ইমেইল আপগ্রেড',
      a: 'হ্যাঁ, অবশ্যই! Canva Pro, YouTube Premium, Duolingo Super, Autodesk এবং Microsoft 365 এর মতো প্রোডাক্টগুলোতে আপনার বর্তমান নিজস্ব ইমেইলেই অফিসিয়াল ইনভাইট পাঠানো হয়। আপনার পূর্বের কোনো ডিজাইন, প্লেলিস্ট বা ডেটা হারাবে না।'
    },
    {
      q: 'ToolzAi BD এর রিপ্লেসমেন্ট ওয়ারেন্টি পলিসি কী রকম?',
      badge: '১০০% ওয়ারেন্টি',
      a: 'আমরা আপনার ক্রয়কৃত মেয়াদের (১ বছর, ৬ মাস বা ৩ মাস) পুরো সময়জুড়ে ১০০% রিপ্লেসমেন্ট গ্যারান্টি প্রদান করি। সার্ভার বা লগইনে কোনো সমস্যা দেখা দিলে হোয়াটসঅ্যাপে যোগাযোগ করলেই দ্রুত সমাধান বা নতুন রিপ্লেসমেন্ট প্রদান করা হয়।'
    },
    {
      q: 'কোন কোন বাংলাদেশি পেমেন্ট মাধ্যমে পে করা যায়?',
      badge: 'পেমেন্ট মেথড',
      a: 'আমরা বাংলাদেশের সব জনপ্রিয় মোবাইল ব্যাংকিং মাধ্যম গ্রহণ করি: বিকাশ (bKash Personal Send Money), নগদ (Nagad), রকেট (Rocket), উপায় (Upay) এবং ক্রিপ্টো ব্যবহারকারীদের জন্য Binance USDT (TRC20 / BEP20)।'
    },
    {
      q: 'Windows 11 ও Office লাইসেন্স কি আসল এবং পার্মানেন্ট?',
      badge: 'অরিজিনাল লাইসেন্স',
      a: 'হ্যাঁ, ১০০% অফিসিয়াল ডিজিটাল প্রোডাক্ট কি, যা সরাসরি মাইক্রোসফটের অফিসিয়াল সার্ভারে বাইন্ড হয়। উইন্ডোজ সেটিংসে অনলাইন অ্যাক্টিভেশন সাপোর্ট করে এবং কোনো থার্ড-পার্টি ক্র্যাক বা ভাইরাস স্ক্রিপ্টের প্রয়োজন হয় না।'
    },
    {
      q: 'Netflix 4K UHD সাবস্ক্রিপশন কীভাবে কাজ করে?',
      badge: 'নেটফ্লিক্স প্রিমিয়াম',
      a: 'আপনি আপনার নিজের নামে একটি প্রাইভেট প্রোফাইল পাবেন ৪-ডিজিটের নিজস্ব পিন লক সহ। স্মার্ট টিভি, ফোন, ল্যাপটপ বা অ্যান্ড্রয়েড বক্সে 4K HDR ও স্পেশাল অডিও কোয়ালিটিতে সম্পূর্ণ স্মুথভাবে দেখতে পারবেন।'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-[#E2E8F0] bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] text-xs font-bold shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#00C853]" />
            <span>সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight">
            আপনার মনের সাধারণ প্রশ্ন ও উত্তর
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            অর্ডার করার আগে সেবা ও ডেলিভারি সম্পর্কে বিস্তারিত জেনে নিন।
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#00C853] bg-emerald-50/20 shadow-md shadow-emerald-500/5'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-[#0F172A] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                      isOpen ? 'bg-[#00C853] text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="font-heading font-bold text-sm sm:text-base text-slate-900 block">
                        {faq.q}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-[10.5px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {faq.badge}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#00C853]' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-[13.5px] text-slate-600 border-t border-emerald-100/80 leading-relaxed pl-14">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions WhatsApp prompt */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">অন্য কোনো বিষয়ে প্রশ্ন রয়েছে?</h4>
            <p className="text-[11px] sm:text-xs text-slate-600">আমাদের কাস্টমার সাপোর্ট টিম সরাসরি হোয়াটসঅ্যাপে প্রস্তুত রয়েছে।</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#00C853] hover:bg-[#00B248] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>হোয়াটসঅ্যাপে প্রশ্ন করুন</span>
          </a>
        </div>

      </div>
    </section>
  );
};
