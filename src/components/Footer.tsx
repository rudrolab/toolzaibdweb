import React from 'react';
import { MessageCircle, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { WHATSAPP_URL, BANGLADESH_PAYMENTS } from '../data/products';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-[#070A10] border-t border-gray-800 text-gray-400 text-xs pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-blue-500 rounded-xl">
                <img src="./logo.jpg" alt="ToolzAi BD" className="w-10 h-10 rounded-lg object-contain bg-white" />
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-white tracking-tight">
                  TOOLZ<span className="text-amber-500">AI</span> <span className="text-xs bg-red-600 px-1.5 py-0.5 rounded text-white font-extrabold ml-1">BD</span>
                </span>
                <span className="text-xs text-gray-400 block font-medium">
                  Intelligent Tools. Modern Solutions.
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Bangladesh's leading digital subscription & authentic software store. Providing instant delivery, genuine warranties, and local bKash/Nagad payments for students, developers, and creators.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Genuine Digital Licenses & 24/7 Replacement Warranty</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-white text-sm">Categories</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onSelectCategory('ai')} className="hover:text-amber-400 transition-colors">AI & Tools</button></li>
              <li><button onClick={() => onSelectCategory('office')} className="hover:text-amber-400 transition-colors">Microsoft & Office</button></li>
              <li><button onClick={() => onSelectCategory('creative')} className="hover:text-amber-400 transition-colors">Design & Video</button></li>
              <li><button onClick={() => onSelectCategory('streaming')} className="hover:text-amber-400 transition-colors">Streaming Media</button></li>
              <li><button onClick={() => onSelectCategory('utilities')} className="hover:text-amber-400 transition-colors">Utilities & Security</button></li>
              <li><button onClick={() => onSelectCategory('cards')} className="hover:text-amber-400 transition-colors">iTunes Gift Cards</button></li>
            </ul>
          </div>

          {/* Featured Tools */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-white text-sm">Popular Subscriptions</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer" onClick={() => onSelectCategory('office')}>Microsoft 365 1TB</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onSelectCategory('creative')}>Canva Pro 1 Year</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onSelectCategory('office')}>Windows 11 Pro</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onSelectCategory('streaming')}>Netflix Premium 4K</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onSelectCategory('utilities')}>Duolingo Super</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onSelectCategory('ai')}>Google AI Gemini Pro</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-white text-sm">Contact & Support</h4>
            <div className="space-y-2.5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: +880 1886-822838</span>
              </a>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>support@toolzaibd.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Payment Logos & Banner */}
            <div className="pt-3">
              <span className="text-[11px] text-gray-400 font-semibold block mb-2">Accepted Payment Methods:</span>
              <img
                src="./products/Minimal-Payment-Methods-Banner.webp"
                alt="bKash, Nagad, Rocket, Upay, Cards, Binance"
                className="w-full max-w-[280px] h-auto rounded-lg border border-gray-800 bg-white p-1 mb-2"
                loading="lazy"
              />
              <div className="flex flex-wrap gap-1.5">
                {BANGLADESH_PAYMENTS.map((p) => (
                  <span
                    key={p.id}
                    className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] font-bold"
                    style={{ color: p.color }}
                  >
                    {p.logoText}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} ToolzAi BD. All rights reserved. Authentic Digital Accounts & Software Subscriptions in Bangladesh.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for Bangladeshi Digital Creators</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
