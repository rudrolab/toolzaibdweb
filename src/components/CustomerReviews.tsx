import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Tanvir Ahmed',
      role: 'UI/UX Designer, Dhaka',
      product: 'Canva Pro 1 Year',
      avatarBg: 'bg-emerald-600 text-white',
      initials: 'TA',
      text: 'Got Canva Pro activated on my own email in literally 4 minutes after sending bKash payment. Everything unlocked smoothly. Highly recommended!',
      rating: 5,
      date: '2 days ago'
    },
    {
      name: 'Nayeem Chowdhury',
      role: 'Software Engineer, Chittagong',
      product: 'Microsoft 365 Official + 1TB',
      avatarBg: 'bg-blue-600 text-white',
      initials: 'NC',
      text: 'Was skeptical at first about the price, but the 1TB OneDrive and Office 365 apps worked directly on my Mac and Windows desktop. Genuine license bind.',
      rating: 5,
      date: 'Yesterday'
    },
    {
      name: 'Fariha Yasmin',
      role: 'IELTS Student, Sylhet',
      product: 'Duolingo Super & Grammarly',
      avatarBg: 'bg-purple-600 text-white',
      initials: 'FY',
      text: 'Duolingo Super unlimited hearts has changed my German preparation. Also bought Grammarly, customer support replied on WhatsApp within seconds.',
      rating: 5,
      date: '3 days ago'
    },
    {
      name: 'Saadman Sakib',
      role: 'Content Creator, Rajshahi',
      product: 'YouTube Premium & CapCut Pro',
      avatarBg: 'bg-rose-600 text-white',
      initials: 'SS',
      text: 'Zero ads on Smart TV and phone background play. CapCut Pro gives all trending transition effects without watermarks. ToolzAi BD is 100% legit.',
      rating: 5,
      date: '5 days ago'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-[#E2E8F0] bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Social Proof Summary */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] text-xs font-bold shadow-xs">
            <Star className="w-3.5 h-3.5 fill-[#00C853] text-[#00C853]" />
            <span>Real Customer Feedback</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight">
            ১২,০০০+ সন্তুষ্ট গ্রাহকের অভিজ্ঞতা
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            বাংলাদেশের ছাত্রছাত্রী, ফ্রিল্যান্সার ও কর্মজীবীদের আসল রিভিউ ও মতামত।
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#E2E8F0] flex flex-col justify-between hover:border-[#00C853] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-300 group"
            >
              <div className="space-y-3.5">
                {/* Rating & Quote */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] font-bold text-slate-700 ml-1">5.0</span>
                  </div>
                  <Quote className="w-4 h-4 text-emerald-300 group-hover:text-emerald-500 transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                  "{rev.text}"
                </p>
              </div>

              {/* Customer Info Footer */}
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${rev.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                    {rev.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#0F172A] flex items-center gap-1 truncate">
                      <span>{rev.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-[#00C853] shrink-0" />
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">{rev.role}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10.5px] pt-1">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate">
                    {rev.product}
                  </span>
                  <span className="text-slate-400 shrink-0 ml-1">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
