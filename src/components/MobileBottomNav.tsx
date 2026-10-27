import React from 'react';
import { Store, Layers, Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../data/products';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenCategories: () => void;
  onGoHome: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenCategories,
  onGoHome,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around text-slate-600">
      
      {/* Home / Store */}
      <button
        onClick={onGoHome}
        className="flex flex-col items-center justify-center p-1.5 text-xs hover:text-[#00C853] active:scale-95 transition-all"
      >
        <Store className="w-5 h-5 text-slate-600" />
        <span className="text-[10px] font-semibold mt-0.5">Store</span>
      </button>

      {/* Categories */}
      <button
        onClick={onOpenCategories}
        className="flex flex-col items-center justify-center p-1.5 text-xs hover:text-[#00C853] active:scale-95 transition-all"
      >
        <Layers className="w-5 h-5 text-slate-600" />
        <span className="text-[10px] font-semibold mt-0.5">Categories</span>
      </button>

      {/* Search */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center p-1.5 text-xs hover:text-[#00C853] active:scale-95 transition-all"
      >
        <Search className="w-5 h-5 text-slate-600" />
        <span className="text-[10px] font-semibold mt-0.5">Search</span>
      </button>

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center p-1.5 text-xs text-[#00C853] active:scale-95 transition-all"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
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
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-1.5 text-xs text-[#25D366] active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Chat</span>
      </a>

    </nav>
  );
};
