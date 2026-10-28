import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, MessageCircle, Menu, X, Shield, Sparkles, PackageCheck, ArrowRight, Star, LayoutDashboard } from 'lucide-react';
import { WHATSAPP_URL, PRODUCTS_DATA } from '../data/products';
import { Product } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (p: Product) => void;
  onOpenTrackOrder: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onOpenTrackOrder,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'All Store' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'office', label: 'Microsoft & Office' },
    { id: 'creative', label: 'Design & Video' },
    { id: 'streaming', label: 'Streaming' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'social', label: 'Social & Growth' },
    { id: 'cards', label: 'Gift Cards' },
  ];

  // Woodmart style AJAX live search matching items
  const liveSearchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS_DATA.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    ).slice(0, 5); // top 5 instant results
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') + '৳';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm transition-all duration-200">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectCategory('all')}>
            <div className="relative p-1 bg-gradient-to-tr from-[#00C853] via-amber-400 to-blue-500 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src="./logo.jpg"
                alt="ToolzAi BD Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-contain bg-white"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-[#0F172A] group-hover:text-[#00C853] transition-colors">
                  TOOLZ<span className="text-[#00C853]">AI</span>
                </span>
                <span className="bg-gradient-to-r from-red-600 to-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                  BD
                </span>
              </div>
              <span className="text-[10.5px] sm:text-xs text-[#64748B] font-medium tracking-wide">
                Intelligent Tools. Modern Solutions.
              </span>
            </div>
          </div>

          {/* Search Bar with Live Instant Dropdown (Woodmart Style) - Desktop */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search Microsoft 365, Canva, ChatGPT, Netflix..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#00C853] rounded-xl pl-10 pr-14 py-2.5 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 bg-[#E2E8F0] px-1.5 py-0.5 rounded font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Search AJAX Dropdown Results */}
            {isSearchFocused && liveSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#CBD5E1] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11px] text-slate-600 flex items-center justify-between font-semibold px-3">
                  <span>Quick Results ({liveSearchResults.length})</span>
                  <span className="text-[#00C853] text-[10px] font-bold">Instant Live Search</span>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {liveSearchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-[#F8FAFC] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center p-0.5 flex-shrink-0 overflow-hidden">
                          {prod.imageUrl ? (
                            <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-contain" />
                          ) : (
                            <Icon name={prod.iconName} className="w-5 h-5 text-[#00C853]" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#0F172A] line-clamp-1">
                            {prod.title}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            <span>{prod.brand}</span>
                            <span>•</span>
                            <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {prod.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-black text-[#00C853]">
                          {prod.priceRange
                            ? `${formatPrice(prod.priceRange.min)}`
                            : formatPrice(prod.currentPrice || 0)}
                        </div>
                        {prod.discountPercent && (
                          <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-bold">
                            -{prod.discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => setIsSearchFocused(false)}
                  className="p-2.5 bg-[#F8FAFC] text-center text-xs font-semibold text-[#00C853] hover:text-[#16A34A] cursor-pointer border-t border-[#F1F5F9] flex items-center justify-center gap-1"
                >
                  <span>View all matching results in store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Track Order Button (Woodmart Style) */}
            <button
              onClick={onOpenTrackOrder}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] hover:text-[#00C853] hover:border-[#86EFAC] hover:bg-[#F0FDF4] text-xs font-semibold transition-all shadow-sm"
              title="Track order status"
            >
              <PackageCheck className="w-4 h-4 text-[#00C853]" />
              <span>Track Order</span>
            </button>

            {/* Admin Management Dashboard Button */}
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-sm"
              title="Open Store Management Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 text-[#00C853]" />
              <span>Dashboard</span>
            </button>

            {/* WhatsApp Support Button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] hover:bg-[#DCFCE7] transition-all text-xs font-bold group shadow-sm"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#00C853] group-hover:scale-110 transition-transform" />
              <span>WhatsApp Help</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#00C853] hover:bg-[#00B248] text-white font-bold px-3.5 sm:px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(0,200,83,0.3)] hover:shadow-[0_6px_20px_rgba(0,200,83,0.4)] transition-all active:scale-95"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 26+ subscriptions..."
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#00C853] rounded-xl pl-10 pr-4 py-2 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Navigation (Woodmart Style) */}
      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]/90 backdrop-blur-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#00C853] text-white shadow-sm shadow-[#00C853]/30 font-bold'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0]/70'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 py-4 space-y-4 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] font-bold text-xs text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Help</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold text-xs text-center"
            >
              <PackageCheck className="w-4 h-4 text-[#00C853]" />
              <span>Track Order</span>
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs text-center"
          >
            <LayoutDashboard className="w-4 h-4 text-[#00C853]" />
            <span>Store Management Dashboard</span>
          </button>

          <div className="pt-2 border-t border-[#E2E8F0] text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#00C853]" /> 100% Replacement Warranty
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant 5-Min
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
