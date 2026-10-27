import { useState, useEffect, useMemo, useRef } from 'react';
import { PRODUCTS_DATA, CATEGORIES } from './data/products';
import { Product, ProductVariant, CartItem } from './types';
import { CountdownBanner } from './components/CountdownBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { QuickOrderModal } from './components/QuickOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FeaturesSection } from './components/FeaturesSection';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Toast } from './components/Toast';
import { Search, Sparkles, Filter, ArrowUpDown } from 'lucide-react';

export function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const productSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('toolzaibd_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered and Sorted products calculation
  const filteredProducts = useMemo(() => {
    const list = PRODUCTS_DATA.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.tagline.toLowerCase().includes(query) ||
        product.categoryLabel.toLowerCase().includes(query) ||
        product.features.some((f) => f.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => {
        const pA = a.priceRange ? a.priceRange.min : (a.currentPrice || 0);
        const pB = b.priceRange ? b.priceRange.min : (b.currentPrice || 0);
        return pA - pB;
      });
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => {
        const pA = a.priceRange ? a.priceRange.min : (a.currentPrice || 0);
        const pB = b.priceRange ? b.priceRange.min : (b.currentPrice || 0);
        return pB - pA;
      });
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'discount') {
      return [...list].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    }
    return list; // default original sequence
  }, [selectedCategory, searchQuery, sortBy]);

  // First 8 items and remaining items for "MOST POPULAR" divider
  const isDefaultView = selectedCategory === 'all' && !searchQuery && sortBy === 'featured';
  const topEight = isDefaultView ? filteredProducts.slice(0, 8) : filteredProducts;
  const popularRemaining = isDefaultView ? filteredProducts.slice(8) : [];

  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    if (product.hasVariants && !variant) {
      setActiveModalProduct(product);
      return;
    }

    const price = variant
      ? variant.price
      : product.currentPrice || (product.priceRange ? product.priceRange.min : 0);

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedVariant?.id === variant?.id
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedVariant: variant, quantity, price }];
      }
    });

    const itemLabel = variant ? `${product.title} (${variant.name})` : product.title;
    setToastMessage(`Added ${itemLabel} to cart!`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
    setToastMessage('Item removed from cart.');
  };

  const handleOpenCheckout = (discountAmount: number, couponCode: string) => {
    setCheckoutDiscount(discountAmount);
    setCheckoutCoupon(couponCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* 1. Top Navigation Bar (Woodmart Style) */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSelectProduct={(p) => setActiveModalProduct(p)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero onExploreClick={scrollToProducts} />

      {/* 3. Products Catalog Section */}
      <main ref={productSectionRef} className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        
        {/* Capsule Countdown Bar (Matching MixProBD Reference) */}
        <CountdownBanner />

        {/* Section Title & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 mt-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00C853] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Digital Accounts & Subscriptions</span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-[#0F172A] tracking-tight">
              Genuine Software Licenses in Bangladesh
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#00C853]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured & Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating ★</option>
                <option value="discount">Biggest Discount %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 mb-6 p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs shadow-sm">
            <Filter className="w-4 h-4 text-[#00C853]" />
            <span className="text-gray-500">Active Filter:</span>
            {selectedCategory !== 'all' && (
              <span className="bg-[#E6FCED] text-[#00C853] px-2 py-0.5 rounded font-bold border border-[#BBF7D0]">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </span>
            )}
            {searchQuery && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="ml-auto text-gray-500 hover:text-black underline text-xs"
            >
              Reset
            </button>
          </div>
        )}

        {/* Products Grid: Part 1 (First 8 Products) */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
            <Search className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-base text-[#0F172A]">No products found</h3>
            <p className="text-xs text-gray-500">
              No digital subscriptions matched your search. Try "Microsoft", "Canva", "AI", or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-[#00C853] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
            >
              View All 26 Products
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {topEight.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setActiveModalProduct(p)}
                  onQuickOrder={(p) => setQuickOrderProduct(p)}
                  showInstantPill={true}
                />
              ))}
            </div>

            {/* "MOST POPULAR" Centered Divider (Exactly as seen in MixProBD screenshot!) */}
            {isDefaultView && popularRemaining.length > 0 && (
              <div className="w-full flex items-center justify-center my-8 sm:my-10 relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-[#86EFAC]/80 to-transparent pointer-events-none" />
                <div className="relative z-10 inline-flex items-center gap-2 px-6 py-1.5 rounded-full bg-gradient-to-r from-white to-[#F0FDF4] border-[1.5px] border-[#86EFAC] shadow-[0_2px_10px_rgba(0,200,83,0.12)]">
                  <span className="text-sm">🔥</span>
                  <span className="text-xs sm:text-[13px] font-black text-[#1E293B] tracking-wider uppercase">
                    MOST POPULAR
                  </span>
                </div>
              </div>
            )}

            {/* Products Grid: Part 2 (Remaining Products) */}
            {isDefaultView && popularRemaining.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {popularRemaining.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => setActiveModalProduct(p)}
                    onQuickOrder={(p) => setQuickOrderProduct(p)}
                    showInstantPill={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. Features Section */}
      <FeaturesSection />

      {/* 5. Customer Reviews */}
      <CustomerReviews />

      {/* 6. FAQ Section */}
      <FAQSection />

      {/* 7. Footer */}
      <Footer onSelectCategory={(cat) => {
        setSelectedCategory(cat);
        scrollToProducts();
      }} />

      {/* 8. Woodmart Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          scrollToProducts();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCategories={() => {
          scrollToProducts();
        }}
        onGoHome={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Quick Order Popup Modal (Exact MixProBD instant checkout!) */}
      <QuickOrderModal
        product={quickOrderProduct}
        onClose={() => setQuickOrderProduct(null)}
        onOrderSuccess={(msg) => setToastMessage(msg)}
      />

      {/* Product Details & Specs Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={checkoutDiscount}
        couponCode={checkoutCoupon}
        onOrderSuccess={() => setToastMessage('Order received! Redirecting to WhatsApp...')}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Sticky WhatsApp Floater (Desktop/Tablet) */}
      <div className="hidden md:block">
        <FloatingWhatsApp />
      </div>

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}

export default App;
