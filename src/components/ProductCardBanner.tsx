import React from 'react';
import { Product } from '../types';

interface ProductCardBannerProps {
  product: Product;
}

export const ProductCardBanner: React.FC<ProductCardBannerProps> = ({ product }) => {
  const id = product.id;

  // Render authentic styled visual representation for each product
  switch (id) {
    case 'microsoft-365-official':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#EBF3FF] via-[#F4F8FF] to-[#DCEBFF] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          {/* Top Tag */}
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-blue-700">
            <span className="bg-blue-100/90 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">Official Microsoft</span>
            <span className="text-gray-500 font-medium">1TB Cloud</span>
          </div>
          {/* Center 3D Office Logos */}
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.17 3.25L13.5 1.5v9.75h9V3.92c0-.36-.2-.68-.5-.84l-.83-.41v.08zM12 1.5L2.83 3.25c-.3.16-.5.48-.5.84v7.16h9.67V1.5zm-9.67 11.25V19.9c0 .36.2.68.5.84l9.17 1.76v-9.75H2.33zm11.17 0v9.75l7.67-1.48c.3-.06.5-.32.5-.63v-7.64h-8.17z"/>
              </svg>
            </div>
            {/* Floating App Badges */}
            <div className="absolute -bottom-2 -left-3 bg-[#185ABD] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-md border border-white/80">W</div>
            <div className="absolute -top-2 -right-3 bg-[#107C41] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-md border border-white/80">X</div>
            <div className="absolute -bottom-2 -right-2 bg-[#C43E1C] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-md border border-white/80">P</div>
          </div>
          {/* Bottom Banner */}
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Microsoft 365</div>
            <div className="text-[10px] text-blue-600 font-semibold">Word • Excel • PowerPoint • 1TB OneDrive</div>
          </div>
        </div>
      );

    case 'google-ai-pro-premium':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FEF7EE] via-[#FFFDF9] to-[#F0FDF4] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-amber-700">
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">Google Gemini</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">2TB Storage</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl border border-gray-100 flex items-center justify-center relative p-3">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 via-rose-500 to-amber-400 rounded-xl flex items-center justify-center shadow-inner">
                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 bg-gradient-to-r from-blue-600 to-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow">
                GEMINI 2.0 PRO
              </div>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Google AI Pro + 2TB</div>
            <div className="text-[10px] text-amber-600 font-semibold">Gemini Advanced & Google One Cloud</div>
          </div>
        </div>
      );

    case 'windows-11-pro':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#E6F4FF] via-[#F0F8FF] to-[#D0EBFF] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-sky-800">
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">OEM / Retail Key</span>
            <span className="text-sky-700 font-semibold">Lifetime Bind</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#0078D4] to-[#00A4EF] rounded-2xl shadow-xl shadow-sky-500/30 flex items-center justify-center p-3">
              <div className="grid grid-cols-2 gap-1.5 w-12 h-12">
                <div className="bg-white rounded-sm shadow-sm"></div>
                <div className="bg-white rounded-sm shadow-sm"></div>
                <div className="bg-white rounded-sm shadow-sm"></div>
                <div className="bg-white rounded-sm shadow-sm"></div>
              </div>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Windows 11 Pro</div>
            <div className="text-[10px] text-sky-600 font-semibold">Official Microsoft Server Activation</div>
          </div>
        </div>
      );

    case 'office-2024-ltsc-pro-plus':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF1F2] via-[#FFF8F8] to-[#FEE2E2] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-rose-800">
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">Latest 2024 Release</span>
            <span className="text-rose-600 font-bold">Permanent</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl shadow-xl shadow-rose-600/30 flex flex-col items-center justify-center text-white p-2">
              <span className="font-black text-xs tracking-wider">OFFICE</span>
              <span className="font-black text-lg text-yellow-300 leading-none">2024</span>
              <span className="text-[8.5px] font-bold text-white/90 uppercase tracking-widest mt-0.5">LTSC PRO</span>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Office 2024 LTSC Pro Plus</div>
            <div className="text-[10px] text-rose-600 font-semibold">One-time payment • Lifetime validity</div>
          </div>
        </div>
      );

    case 'microsoft-2021-office-pro-plus':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FFFBEB] via-[#FEF9C3] to-[#FEF08A] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-amber-800">
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">1 PC License</span>
            <span className="text-amber-700 font-bold">100% Genuine</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl shadow-xl shadow-orange-600/30 flex flex-col items-center justify-center text-white p-2">
              <span className="font-black text-xs tracking-wider">OFFICE</span>
              <span className="font-black text-lg text-white leading-none">2021</span>
              <span className="text-[8.5px] font-bold text-yellow-200 uppercase tracking-widest mt-0.5">PRO PLUS</span>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Office 2021 Pro Plus</div>
            <div className="text-[10px] text-amber-700 font-semibold">Word, Excel, PowerPoint Lifetime</div>
          </div>
        </div>
      );

    case 'duolingo-super-12-month':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-emerald-800">
            <span className="bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">12 Month Plan</span>
            <span className="text-emerald-700 font-bold">Zero Ads</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#58CC02] to-[#78E02B] rounded-2xl shadow-xl shadow-emerald-500/40 flex flex-col items-center justify-center text-white relative">
              <div className="flex gap-2">
                <div className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </div>
              <div className="w-3 h-2 bg-orange-400 rounded-b-md mt-1"></div>
              <div className="absolute -bottom-2 bg-emerald-900 text-yellow-300 font-black text-[9px] px-2 py-0.5 rounded-full border border-yellow-300/60 shadow">
                SUPER ∞
              </div>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Duolingo Super 1 Year</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Unlimited Hearts • Practice Hub</div>
          </div>
        </div>
      );

    case 'canva-pro-1-year':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#E0F2FE] via-[#EDE9FE] to-[#FCE7F3] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-indigo-800">
            <span className="bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-full border border-cyan-200">Own Email Invite</span>
            <span className="text-indigo-700 font-bold">1 Year Pro</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#00C4CC] via-[#7D2AE8] to-[#FF4E64] rounded-2xl shadow-xl shadow-purple-500/30 flex items-center justify-center p-2">
              <span className="font-black text-2xl text-white italic tracking-tighter">Canva</span>
            </div>
            <div className="absolute -bottom-2 bg-amber-400 text-slate-900 font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-md border border-white">
              PRO VIP
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Canva Pro 1 Year</div>
            <div className="text-[10px] text-purple-700 font-semibold">Brand Kit • Magic Studio • 100M+ Assets</div>
          </div>
        </div>
      );

    case 'truecaller-premium-1-year':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B1329] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-blue-400">
            <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700">1 Year Gold</span>
            <span className="text-amber-400 font-bold">🔥 Most Popular</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-800 rounded-2xl shadow-xl shadow-blue-500/40 flex flex-col items-center justify-center text-white p-2 border border-blue-400/40">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7z"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-[9px] px-2 py-0.5 rounded-full shadow">
              GOLD CALLER ID
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-white tracking-tight">Truecaller Premium 1 Year</div>
            <div className="text-[10px] text-sky-400 font-semibold">Block Spam Calls & Ads • Incognito</div>
          </div>
        </div>
      );

    case 'autodesk-all-apps-yearly':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#F0FDF4] via-[#F8FAFC] to-[#DCFCE7] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-emerald-800">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">AutoCAD + 40 Apps</span>
            <span className="text-emerald-700 font-bold">1-3 Years</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0696D7] to-[#0277BD] rounded-2xl shadow-xl shadow-cyan-600/30 flex items-center justify-center p-3 text-white font-black text-xl">
              AUTODESK
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">Autodesk All Apps Yearly</div>
            <div className="text-[10px] text-cyan-700 font-semibold">AutoCAD • Revit • Maya • 3ds Max</div>
          </div>
        </div>
      );

    case 'youtube-premium':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FEF2F2] via-[#FFF5F5] to-[#FEE2E2] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-red-800">
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">Ad-Free + Music</span>
            <span className="text-red-700 font-bold">6-12 Months</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-[#FF0000] rounded-2xl shadow-xl shadow-red-500/40 flex items-center justify-center p-3">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 bg-black text-white font-black text-[9px] px-2 py-0.5 rounded-full border border-red-500 shadow">
              PREMIUM
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">YouTube Premium</div>
            <div className="text-[10px] text-red-600 font-semibold">Background Play • Zero Ads • YT Music</div>
          </div>
        </div>
      );

    case 'notebooklm-pro':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-teal-800">
            <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">AI Audio Overview</span>
            <span className="text-teal-700 font-bold">Research AI</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl shadow-xl shadow-teal-600/30 flex flex-col items-center justify-center text-white p-2">
              <span className="font-black text-sm tracking-tight">Notebook</span>
              <span className="font-black text-xl text-yellow-300 leading-none">LM</span>
              <span className="text-[9px] font-bold text-teal-100 mt-0.5">PRO AI</span>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">NotebookLM Pro</div>
            <div className="text-[10px] text-teal-700 font-semibold">Generate Viral 2-Host AI Audio Overviews</div>
          </div>
        </div>
      );

    case 'linkedin-career-premium-3-months':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-blue-900">
            <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">3 Months Career</span>
            <span className="text-amber-600 font-black">👑 Gold Badge</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-[#0A66C2] rounded-2xl shadow-xl shadow-blue-600/40 flex items-center justify-center p-3">
              <span className="font-black text-3xl text-white">in</span>
            </div>
            <div className="absolute -bottom-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-black text-[9px] px-2.5 py-0.5 rounded-full shadow border border-white">
              CAREER PRO
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">LinkedIn Career Premium</div>
            <div className="text-[10px] text-blue-700 font-semibold">InMail Credits • 21,000+ Video Courses</div>
          </div>
        </div>
      );

    case 'netflix-premium-12-months':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0B0F19] via-[#1A0B10] to-[#2D060E] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-red-400">
            <span className="bg-red-950/80 text-red-300 px-2 py-0.5 rounded-full border border-red-800">4K Ultra HD</span>
            <span className="text-white font-bold">1 Screen PIN</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-b from-[#E50914] to-[#8B0000] rounded-2xl shadow-xl shadow-red-600/50 flex items-center justify-center p-2 border border-red-500/50">
              <span className="font-black text-4xl text-white tracking-tighter">N</span>
            </div>
            <div className="absolute -bottom-2 bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full shadow border border-red-400">
              4K UHD HDR
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-white tracking-tight">Netflix Premium 12 Months</div>
            <div className="text-[10px] text-red-400 font-semibold">Private Screen • Zero Household Error</div>
          </div>
        </div>
      );

    case 'itunes-gift-card-usa':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-purple-900">
            <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-200">USA Store Code</span>
            <span className="text-purple-700 font-bold">$25 - $125</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-purple-700 via-pink-600 to-indigo-600 rounded-2xl shadow-xl shadow-purple-600/30 flex flex-col items-center justify-center text-white p-2">
              <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.99.04-2.16.66-2.84 1.48-.59.7-.12 1.84.02 2.96 1.09.08 2.16-.54 2.83-1.34z"/>
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider text-pink-200 mt-0.5">Gift Card</span>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">ITUNES GIFT CARD (USA)</div>
            <div className="text-[10px] text-purple-700 font-semibold">100% Authentic Scanned Digital Codes</div>
          </div>
        </div>
      );

    case 'chatgpt-plus':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#061A14] via-[#092B22] to-[#04140F] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold">
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded shadow">SOLD OUT</span>
            <span className="text-emerald-400 font-bold">GPT-4o / o1</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#10A37F] to-[#0A6B53] rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center p-3 border border-emerald-400/40">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.28 9.87a5.98 5.98 0 0 0-.52-4.93 6.06 6.06 0 0 0-6.44-2.92 5.98 5.98 0 0 0-4.32-1.92c-3.1 0-5.69 2.33-6.04 5.38A6.06 6.06 0 0 0 .52 8.4a5.98 5.98 0 0 0 .52 4.93 6.06 6.06 0 0 0 6.44 2.92 5.98 5.98 0 0 0 4.32 1.92c3.1 0 5.69-2.33 6.04-5.38a6.06 6.06 0 0 0 4.44-2.92z"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 bg-emerald-500 text-black font-black text-[9px] px-2.5 py-0.5 rounded-full shadow">
              OPENAI PLUS
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-white tracking-tight">ChatGPT Plus (GPT-4o)</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Canvas • DALL-E 3 • Voice Mode</div>
          </div>
        </div>
      );

    case 'supergrok-ai':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0B0F19] via-[#18181B] to-[#090D16] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold">
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded shadow">SOLD OUT</span>
            <span className="text-gray-400 font-bold">xAI Grok 2</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-neutral-800 to-black rounded-2xl shadow-xl shadow-white/10 flex items-center justify-center p-3 border border-gray-700">
              <span className="font-black text-3xl text-white tracking-tighter">GROK</span>
            </div>
            <div className="absolute -bottom-2 bg-white text-black font-black text-[9px] px-2.5 py-0.5 rounded-full shadow">
              FLUX.1 AI
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-white tracking-tight">SuperGrok AI (xAI)</div>
            <div className="text-[10px] text-gray-400 font-semibold">Real-time X Search • Uncensored FLUX</div>
          </div>
        </div>
      );

    case 'international-roaming-sim':
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FEF3C7] via-[#FFFBEB] to-[#FDE68A] relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold">
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded shadow">SOLD OUT</span>
            <span className="text-amber-800 font-bold">120+ Countries</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-600 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/30 flex flex-col items-center justify-center text-white p-2">
              <span className="font-black text-xs">GLOBAL</span>
              <span className="font-black text-lg text-white leading-none">eSIM</span>
              <span className="text-[9px] font-bold text-yellow-200 mt-0.5">ROAMING</span>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-slate-800 tracking-tight">International Roaming SIM</div>
            <div className="text-[10px] text-amber-700 font-semibold">Global Data & Foreign OTP Verification</div>
          </div>
        </div>
      );

    default:
      // Generic branded card for remaining products
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#10172A] to-slate-950 relative flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          <div className="w-full flex justify-between items-center text-[10px] font-bold text-gray-400">
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700">{product.brand}</span>
            <span className="text-amber-400 font-semibold">★ {product.rating}</span>
          </div>
          <div className="my-auto relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center justify-center text-white p-2 text-center">
              <span className="font-black text-xs text-amber-400 uppercase tracking-wider">{product.brand}</span>
              <span className="font-bold text-[10px] text-gray-300 mt-1 line-clamp-1">{product.categoryLabel}</span>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="font-black text-sm text-white tracking-tight line-clamp-1">{product.title}</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Authentic Digital Subscription</div>
          </div>
        </div>
      );
  }
};
