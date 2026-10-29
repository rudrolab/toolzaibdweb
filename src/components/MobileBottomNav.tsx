import React, { useState } from 'react';
import { Store, Layers, Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';
import { getWhatsAppUrl } from '../utils/paymentHelpers';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenCategories: () => void;
  onGoHome: () => void;
  settings?: StoreSettings;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenCategories,
  onGoHome,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'categories' | 'search' | 'cart'>('store');
  const whatsappUrl = getWhatsAppUrl(settings?.whatsappNumber);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around text-slate-600">
      
      {/* Home / Store */}
      <button
        onClick={() => {
          setActiveTab('store');
          onGoHome();
        }}
        className={`flex flex-col items-center justify-center p-1.5 text-xs active:scale-95 transition-all ${
          activeTab === 'store' ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]'
        }`}
      >
        <Store className={`w-5 h-5 ${activeTab === 'store' ? 'text-[#00C853]' : 'text-slate-600'}`} />
        <span className="text-[10px] font-bold mt-0.5">Store</span>
      </button>

      {/* Categories */}
      <button
        onClick={() => {
          setActiveTab('categories');
          onOpenCategories();
        }}
        className={`flex flex-col items-center justify-center p-1.5 text-xs active:scale-95 transition-all ${
          activeTab === 'categories' ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]'
        }`}
      >
        <Layers className={`w-5 h-5 ${activeTab === 'categories' ? 'text-[#00C853]' : 'text-slate-600'}`} />
        <span className="text-[10px] font-bold mt-0.5">Categories</span>
      </button>

      {/* Search */}
      <button
        onClick={() => {
          setActiveTab('search');
          onOpenSearch();
        }}
        className={`flex flex-col items-center justify-center p-1.5 text-xs active:scale-95 transition-all ${
          activeTab === 'search' ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]'
        }`}
      >
        <Search className={`w-5 h-5 ${activeTab === 'search' ? 'text-[#00C853]' : 'text-slate-600'}`} />
        <span className="text-[10px] font-bold mt-0.5">Search</span>
      </button>

      {/* Cart */}
      <button
        onClick={() => {
          setActiveTab('cart');
          onOpenCart();
        }}
        className={`relative flex flex-col items-center justify-center p-1.5 text-xs active:scale-95 transition-all ${
          activeTab === 'cart' ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]'
        }`}
      >
        <div className="relative">
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'cart' ? 'text-[#00C853]' : 'text-slate-600'}`} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-black text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5 border border-white shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-0.5">Cart</span>
      </button>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-1.5 text-xs text-[#25D366] hover:text-[#1eb854] active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Chat</span>
      </a>

    </nav>
  );
};
