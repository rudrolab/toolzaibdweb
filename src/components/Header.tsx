import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, MessageCircle, Menu, X, Shield, Sparkles, PackageCheck, ArrowRight, Star } from 'lucide-react';
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
    <header className="sticky top-[38px] sm:top-[36px] z-30 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-gray-800/80 transition-all duration-200">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectCategory('all')}>
            <div className="relative p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-blue-500 rounded-xl shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300">
              <img
                src="./logo.jpg"
                alt="ToolzAi BD Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-contain bg-white"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  TOOLZ<span className="text-amber-500">AI</span>
                </span>
                <span className="bg-gradient-to-r from-red-600 to-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                  BD
                </span>
              </div>
              <span className="text-[10.5px] sm:text-xs text-gray-400 font-medium tracking-wide">
                Intelligent Tools. Modern Solutions.
              </span>
            </div>
          </div>

          {/* Search Bar with Live Instant Dropdown (Woodmart Style) - Desktop */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search Microsoft 365, Canva, ChatGPT, Netflix..."
                className="w-full bg-gray-900/90 border border-gray-700/80 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-gray-800 px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Search AJAX Dropdown Results */}
            {isSearchFocused && liveSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F172A] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-gray-800 text-[11px] text-gray-400 flex items-center justify-between font-semibold px-3">
                  <span>Quick Results ({liveSearchResults.length})</span>
                  <span className="text-amber-400 text-[10px]">Instant Live Search</span>
                </div>
                <div className="divide-y divide-gray-800/80">
                  {liveSearchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-gray-800/70 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center text-amber-400 flex-shrink-0">
                          <Icon name={prod.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                            {prod.title}
                          </div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-2">
                            <span>{prod.brand}</span>
                            <span>•</span>
                            <span className="text-amber-400 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" /> {prod.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-black text-amber-400">
                          {prod.priceRange
                            ? `${formatPrice(prod.priceRange.min)}`
                            : formatPrice(prod.currentPrice || 0)}
                        </div>
                        {prod.discountPercent && (
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-bold">
                            -{prod.discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => setIsSearchFocused(false)}
                  className="p-2.5 bg-gray-900/90 text-center text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer border-t border-gray-800 flex items-center justify-center gap-1"
                >
                  <span>View all matching results in store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Track Order Button (Woodmart Style) */}
            <button
              onClick={onOpenTrackOrder}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-amber-500/40 text-xs font-medium transition-all"
              title="Track order status"
            >
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span>Track Order</span>
            </button>

            {/* WhatsApp Support Button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25 transition-all text-xs font-semibold group"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WhatsApp Help</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-95"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 border-2 border-[#0B0F19] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 26+ subscriptions..."
              className="w-full bg-gray-900 border border-gray-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Navigation (Woodmart Style) */}
      <div className="border-t border-gray-800/60 bg-[#0B0F19]/60 backdrop-blur-sm overflow-x-auto no-scrollbar">
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
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
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
        <div className="md:hidden bg-gray-950 border-b border-gray-800 px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-semibold text-xs text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Help</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-amber-400 font-semibold text-xs text-center"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Order</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Replacement Warranty
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant 5-Min
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
