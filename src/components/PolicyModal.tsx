import React from 'react';
import { X, ShieldCheck, Zap, RotateCcw, CreditCard, Lock, CheckCircle2, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';
import { getWhatsAppUrl } from '../utils/paymentHelpers';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: StoreSettings;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  const whatsappLink = getWhatsAppUrl(
    settings?.whatsappNumber,
    'Hello ToolzAi BD! I have a question regarding your warranty & refund policy.'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853] shadow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-[#0F172A]">
                Customer Trust, Warranty & Policies
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ToolzAi BD — 100% Authentic Licenses & Satisfaction Guarantee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-600">
          
          {/* 1. Fast Delivery */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#00C853] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#0F172A] text-sm">⚡ ৫-১৫ মিনিটে ইনস্ট্যান্ট ডিজিটাল ডেলিভারি</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                পেমেন্ট সম্পন্ন হওয়ার পর আপনার অর্ডারটি আমাদের অটোমেটেড ও ডেডিকেটেড সাপোর্ট টিম দ্বারা ভেরিফাই হয়। এরপর ৫ থেকে ১৫ মিনিটের মধ্যে আপনার প্রদত্ত ইমেইল ও হোয়াটসঅ্যাপ নম্বরে এক্টিভেশন লিংক অথবা লগিন ক্রিডেনশিয়াল পৌঁছে দেওয়া হয়।
              </p>
            </div>
          </div>

          {/* 2. Replacement Warranty */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#0F172A] text-sm">🛡️ ১০০% ফুল-টার্ম রিপ্লেসমেন্ট ওয়ারেন্টি</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                আপনার সাবস্ক্রিপশন মেয়াদের (১ মাস / ৬ মাস / ১ বছর / আজীবন) প্রথম দিন থেকে শেষ দিন পর্যন্ত যেকোনো টেকনিক্যাল সমস্যা হলে আমাদের অফিসিয়াল সাপোর্ট থেকে তাত্ক্ষণিক ফিক্স অথবা নতুন একাউন্ট/ইনভাইটেশন রিপ্লেস করে দেওয়া হয়। কোনো হিডেন চার্জ নেই।
              </p>
            </div>
          </div>

          {/* 3. Refund Policy */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#0F172A] text-sm">🔄 রিফান্ড ও রিটার্ন পলিসি</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                যদি আমরা আপনাকে সঠিক পণ্য প্রদানে ব্যর্থ হই অথবা প্রদত্ত কোনো সাবস্ক্রিপশনে টেকনিক্যাল ত্রুটি তৈরি হয় এবং তা ২৪ ঘণ্টার মধ্যে সমাধান করা না যায়, তবে আপনার পেমেন্ট ১০০% সমপরিমাণ টাকায় আপনার bKash বা Nagad নম্বরে রিফান্ড করে দেওয়া হবে।
              </p>
            </div>
          </div>

          {/* 4. Payment Verification */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#0F172A] text-sm">💳 bKash, Nagad ও Rocket পেমেন্ট ভেরিফিকেশন</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                চেকআউট পেজে প্রদত্ত পার্সোনাল নম্বরে <strong>Send Money</strong> করুন। পেমেন্ট শেষে ট্রানজেকশন আইডি (TrxID) ফর্মে লিখে দিন অথবা সরাসরি আমাদের অফিশিয়াল হোয়াটসঅ্যাপ হেল্পলাইনে মেসেজ/স্ক্রিনশট পাঠিয়ে দিন। ম্যানুয়াল ভেরিফিকেশনে সাধারণত ২-৫ মিনিট সময় লাগে।
              </p>
            </div>
          </div>

          {/* 5. Account Safety & Privacy */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#0F172A] text-sm">🔒 একাউন্ট সিকিউরিটি ও প্রাইভেসি</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                পার্সোনাল প্ল্যানে আপনার নিজস্ব Gmail বা ইমেইল একাউন্টেই এক্টিভেশন হয়। আপনার ইমেইলের কোনো পাসওয়ার্ড আমাদের কখনোই প্রয়োজন হয় না। অফিসিয়াল ইনভাইটেশন লিংকের মাধ্যমে নিরাপদ অ্যাক্টিভেশন নিশ্চিত করা হয়।
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
            <span>অফিসিয়াল কাস্টমার সাপোর্ট সর্বদা সক্রিয়</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে কথা বলুন</span>
            </a>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none py-2.5 px-5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-[#CBD5E1] transition-colors"
            >
              বুঝেছি (Close)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
