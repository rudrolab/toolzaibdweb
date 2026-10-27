import { useState, useEffect, useMemo, useRef } from 'react';
import { PRODUCTS_DATA, CATEGORIES } from './data/products';
import { Product, ProductVariant, CartItem } from './types';
import { CountdownBanner } from './components/CountdownBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
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
import { Icon } from './components/Icon';
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
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      // Search match
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

    // Sorting
    return list.sort((a, b) => {
      const priceA = a.priceRange ? a.priceRange.min : (a.currentPrice || 0);
      const priceB = b.priceRange ? b.priceRange.min : (b.currentPrice || 0);

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return 0; // featured default
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Add to cart handler
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

  const handleOrderSuccess = () => {
    setCartItems([]);
    setToastMessage('Order placed! Redirecting to WhatsApp...');
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* 1. Countdown Flash Deal Banner */}
      <CountdownBanner />

      {/* 2. Top Navigation Bar (Woodmart Style) */}
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

      {/* 3. Hero Section */}
      <Hero onExploreClick={scrollToProducts} />

      {/* 4. Products Catalog Section */}
      <main ref={productSectionRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        
        {/* Section Title & Sort / Filter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Verified Catalog</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Digital Accounts & Licenses
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Showing {filteredProducts.length} authentic digital subscriptions in Bangladesh
            </p>
          </div>

          {/* Sort Controls (Woodmart style) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-gray-900">Featured & Popular</option>
                <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
                <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
                <option value="rating" className="bg-gray-900">Highest Customer Rating ★</option>
                <option value="discount" className="bg-gray-900">Biggest Discount %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Desktop/Tablet) */}
        <div className="hidden lg:flex flex-wrap items-center gap-1.5 p-1 bg-gray-900/80 rounded-xl border border-gray-800 mb-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Search / Filter Tag (if applicable) */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 mb-6 p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs">
            <Filter className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400">Filtering by:</span>
            {selectedCategory !== 'all' && (
              <span className="bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded font-semibold border border-amber-500/30">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </span>
            )}
            {searchQuery && (
              <span className="bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded font-semibold border border-blue-500/30">
                "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="ml-auto text-gray-400 hover:text-white underline text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">No products found</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                No digital subscriptions matched your search. Try searching for "Microsoft", "Canva", "AI", or reset filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              View All 26 Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setActiveModalProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* 5. Features Section */}
      <FeaturesSection />

      {/* 6. Customer Reviews */}
      <CustomerReviews />

      {/* 7. FAQ Section */}
      <FAQSection />

      {/* 8. Footer */}
      <Footer onSelectCategory={(cat) => {
        setSelectedCategory(cat);
        scrollToProducts();
      }} />

      {/* 9. Woodmart Mobile Sticky Bottom Navigation Bar */}
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

      {/* Modals & Overlays */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={checkoutDiscount}
        couponCode={checkoutCoupon}
        onOrderSuccess={handleOrderSuccess}
      />

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
