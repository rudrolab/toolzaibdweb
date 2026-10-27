import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Tanvir Ahmed',
      role: 'UI/UX Designer, Dhaka',
      product: 'Canva Pro 1 Year',
      text: 'Got Canva Pro activated on my own email in literally 4 minutes after sending bKash payment. Everything unlocked smoothly. Highly recommended!',
      rating: 5,
      date: '2 days ago'
    },
    {
      name: 'Nayeem Chowdhury',
      role: 'Software Engineer, Chittagong',
      product: 'Microsoft 365 Official + 1TB OneDrive',
      text: 'Was skeptical at first about the price, but the 1TB OneDrive and Office 365 apps worked directly on my Mac and Windows desktop. Genuine license bind.',
      rating: 5,
      date: 'Yesterday'
    },
    {
      name: 'Fariha Yasmin',
      role: 'IELTS Student, Sylhet',
      product: 'Duolingo Super & Grammarly Premium',
      text: 'Duolingo Super unlimited hearts has changed my German preparation. Also bought Grammarly, customer support replied on WhatsApp within seconds.',
      rating: 5,
      date: '3 days ago'
    },
    {
      name: 'Saadman Sakib',
      role: 'Content Creator, Rajshahi',
      product: 'YouTube Premium & CapCut Pro',
      text: 'Zero ads on Smart TV and phone background play. CapCut Pro gives all trending transition effects without watermarks. ToolzAi BD is 100% legit.',
      rating: 5,
      date: '5 days ago'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-gray-800/80 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Real Customer Feedback
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white">
            Trusted by 12,000+ Happy Users
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            See what students, remote workers, and creative professionals across Bangladesh have to say about ToolzAi BD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0c1220] border border-gray-800 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-gray-600" />
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800/80 mt-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1">
                    {rev.name}
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  </span>
                  <span className="text-[10px] text-gray-500">{rev.date}</span>
                </div>
                <div className="text-[11px] text-gray-400">{rev.role}</div>
                <div className="text-[10px] font-semibold text-amber-400/90 pt-0.5">
                  Verified: {rev.product}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
