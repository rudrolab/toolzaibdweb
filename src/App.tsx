import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { PRODUCTS_DATA, CATEGORIES } from './data/products';
import { INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_SETTINGS } from './data/initialOrders';
import { INITIAL_LANDING_PAGES } from './data/initialLandingPages';
import { Product, ProductVariant, CartItem, Order, OrderStatus, Coupon, StoreSettings, LandingPage } from './types';
import { CountdownBanner } from './components/CountdownBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Toast } from './components/Toast';
import { AdminQuickBar } from './components/admin/AdminQuickBar';
import { Search, Sparkles, Filter, ArrowUpDown, Megaphone, Flame } from 'lucide-react';

// Lazy-load customer interaction modals to minimize initial bundle size and FCP
const QuickOrderModal = lazy(() => import('./components/QuickOrderModal').then(m => ({ default: m.QuickOrderModal })));
const ProductModal = lazy(() => import('./components/ProductModal').then(m => ({ default: m.ProductModal })));
const CartDrawer = lazy(() => import('./components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const CheckoutModal = lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal').then(m => ({ default: m.OrderTrackingModal })));
const PolicyModal = lazy(() => import('./components/PolicyModal').then(m => ({ default: m.PolicyModal })));
const ProductPageView = lazy(() => import('./components/ProductPageView').then(m => ({ default: m.ProductPageView })));

// Code-split heavy admin and landing page modules to optimize storefront performance
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLoginModal = lazy(() => import('./components/admin/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const LandingPageView = lazy(() => import('./components/landing/LandingPageView').then(m => ({ default: m.LandingPageView })));
const ProductFormModal = lazy(() => import('./components/admin/ProductFormModal').then(m => ({ default: m.ProductFormModal })));
const LandingPageFormModal = lazy(() => import('./components/admin/LandingPageFormModal').then(m => ({ default: m.LandingPageFormModal })));

const SuspenseLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-[#00C853] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500">লোড হচ্ছে...</span>
    </div>
  </div>
);
import {
  getSupabase,
  fetchCloudProducts,
  fetchCloudOrders,
  fetchCloudCoupons,
  fetchCloudLandingPages,
  fetchCloudSettings,
  upsertCloudProduct,
  deleteCloudProduct,
  insertCloudOrder,
  updateCloudOrderStatus,
  updateCloudOrderNotes,
  upsertCloudCoupon,
  deleteCloudCoupon,
  upsertCloudLandingPage,
  deleteCloudLandingPage,
  saveCloudSettings
} from './services/supabase';

export function App() {
  // 1. Persistent Products Catalog (Managed via Admin Dashboard)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_products');
      return saved ? JSON.parse(saved) : PRODUCTS_DATA;
    } catch {
      return PRODUCTS_DATA;
    }
  });

  // 2. Persistent Orders List
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 3. Persistent Coupons List
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // 4. Persistent Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 5. Landing Pages Campaigns
  const [landingPages, setLandingPages] = useState<LandingPage[]>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_landing_pages');
      return saved ? JSON.parse(saved) : INITIAL_LANDING_PAGES;
    } catch {
      return INITIAL_LANDING_PAGES;
    }
  });

  // 6. Shopping Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Helper to extract landing page slug from URL hash
  const getLandingSlug = (): string | null => {
    const clean = window.location.hash.replace(/^#\/?/, '').trim();
    if (clean.startsWith('landing=') || clean.startsWith('lp=') || clean.startsWith('campaign=')) {
      return clean.split('=')[1] || null;
    }
    if (clean === 'gemini-pro-18') {
      return 'gemini-pro-18';
    }
    return null;
  };

  // Helper to extract product from URL hash (#product=... or #p=...)
  const getProductFromHash = (list: Product[]): Product | null => {
    const clean = window.location.hash.replace(/^#\/?/, '').trim();
    if (!clean) return null;
    let targetId = '';
    if (clean.startsWith('product=')) {
      targetId = clean.split('product=')[1];
    } else if (clean.startsWith('p=')) {
      targetId = clean.split('p=')[1];
    } else if (clean.startsWith('product/')) {
      targetId = clean.split('product/')[1];
    }
    if (!targetId) return null;
    return list.find((p) => p.id === targetId || p.id === decodeURIComponent(targetId)) || null;
  };

  // 7. Navigation, Filters, Modals & Admin Security
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const auth = sessionStorage.getItem('toolzaibd_admin_auth');
      const authTime = sessionStorage.getItem('toolzaibd_admin_auth_time');
      if (auth === 'true' && authTime) {
        const elapsed = Date.now() - parseInt(authTime, 10);
        return elapsed < 2 * 60 * 60 * 1000; // 2 hours session expiry
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.hash === '#admin';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(() => {
    return window.location.hash === '#admin' && !isAdminAuthenticated;
  });
  const [activeLandingSlug, setActiveLandingSlug] = useState<string | null>(() => getLandingSlug());
  const [selectedProductPage, setSelectedProductPage] = useState<Product | null>(() => {
    try {
      const saved = localStorage.getItem('toolzaibd_products');
      const initialList = saved ? JSON.parse(saved) : PRODUCTS_DATA;
      return getProductFromHash(initialList);
    } catch {
      return getProductFromHash(PRODUCTS_DATA);
    }
  });
  const [quickOrderVariant, setQuickOrderVariant] = useState<ProductVariant | undefined>(undefined);
  const [quickOrderQuantity, setQuickOrderQuantity] = useState<number>(1);

  // Storefront Quick-Edit & Cloud Sync states
  const [quickEditMode, setQuickEditMode] = useState<boolean>(false);
  const [editingStoreProduct, setEditingStoreProduct] = useState<Product | null>(null);
  const [isStoreProductModalOpen, setIsStoreProductModalOpen] = useState<boolean>(false);
  const [isStoreLandingModalOpen, setIsStoreLandingModalOpen] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);

  const handleOpenProductPage = (product: Product) => {
    setSelectedProductPage(product);
    window.location.hash = `product=${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseProductPage = () => {
    setSelectedProductPage(null);
    if (window.location.hash.includes('product=') || window.location.hash.includes('product/')) {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const productSectionRef = useRef<HTMLDivElement>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('toolzaibd_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('toolzaibd_landing_pages', JSON.stringify(landingPages));
    } catch (e) {
      console.error(e);
    }
  }, [landingPages]);

  useEffect(() => {
    try {
      localStorage.setItem('toolzaibd_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('toolzaibd_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('toolzaibd_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Idle preloader for interactive customer modals to ensure 0ms latency when clicked
  useEffect(() => {
    const timer = setTimeout(() => {
      import('./components/QuickOrderModal');
      import('./components/ProductModal');
      import('./components/CartDrawer');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('toolzaibd_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync hash routing & Security Verification
  useEffect(() => {
    const handleHashChange = () => {
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdminView(isHashAdmin);
      if (isHashAdmin && !isAdminAuthenticated) {
        setIsAdminLoginOpen(true);
      }
      setActiveLandingSlug(getLandingSlug());
      const hashProd = getProductFromHash(products);
      setSelectedProductPage(hashProd);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuthenticated, products]);

  // Cloud Database Sync on Mount
  useEffect(() => {
    const syncFromCloud = async () => {
      const sb = getSupabase();
      if (!sb) {
        setIsCloudConnected(false);
        return;
      }

      setIsCloudConnected(true);

      try {
        const [cloudProducts, cloudOrders, cloudCoupons, cloudLandingPages, cloudSettings] = await Promise.all([
          fetchCloudProducts(),
          fetchCloudOrders(),
          fetchCloudCoupons(),
          fetchCloudLandingPages(),
          fetchCloudSettings()
        ]);

        if (cloudProducts && cloudProducts.length > 0) setProducts(cloudProducts);
        if (cloudOrders && cloudOrders.length > 0) setOrders(cloudOrders);
        if (cloudCoupons && cloudCoupons.length > 0) setCoupons(cloudCoupons);
        if (cloudLandingPages && cloudLandingPages.length > 0) setLandingPages(cloudLandingPages);
        if (cloudSettings) setSettings(cloudSettings);
      } catch (err) {
        console.error('Cloud sync error:', err);
      }
    };

    syncFromCloud();
  }, []);

  const openAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminView(true);
    setActiveLandingSlug(null);
    if (!isAdminAuthenticated) {
      setIsAdminLoginOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
    setIsAdminLoginOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('toolzaibd_admin_auth');
      sessionStorage.removeItem('toolzaibd_admin_auth_time');
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
    setIsAdminLoginOpen(false);
    setQuickEditMode(false);
    window.location.hash = '';
    setToastMessage('অ্যাডমিন ড্যাশবোর্ড থেকে সফলভাবে লগআউট হয়েছে।');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewLandingPage = (slug: string) => {
    window.location.hash = `landing=${slug}`;
    setActiveLandingSlug(slug);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ================= ADMIN HANDLERS (WITH SUPABASE REALTIME SYNC) =================
  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === updatedProduct.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = updatedProduct;
        return next;
      } else {
        return [updatedProduct, ...prev];
      }
    });
    upsertCloudProduct(updatedProduct).catch(console.error);
    setToastMessage(`Product "${updatedProduct.title}" saved successfully!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteCloudProduct(productId).catch(console.error);
    setToastMessage('Product deleted from catalog.');
  };

  const handleSaveLandingPage = (page: LandingPage) => {
    setLandingPages((prev) => {
      const idx = prev.findIndex((p) => p.id === page.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = page;
        return next;
      } else {
        return [page, ...prev];
      }
    });
    upsertCloudLandingPage(page).catch(console.error);
    setToastMessage(`Campaign "${page.title}" saved successfully!`);
  };

  const handleDeleteLandingPage = (pageId: string) => {
    setLandingPages((prev) => prev.filter((p) => p.id !== pageId));
    deleteCloudLandingPage(pageId).catch(console.error);
    setToastMessage('Campaign deleted.');
  };

  const handleCouponUsed = (couponCode: string) => {
    if (!couponCode) return;
    setCoupons((prev) => {
      const codeUpper = couponCode.trim().toUpperCase();
      const next = prev.map((c) => {
        if (c.code.toUpperCase() === codeUpper) {
          const updated: Coupon = { ...c, usageCount: (c.usageCount || 0) + 1 };
          upsertCloudCoupon(updated).catch(console.error);
          return updated;
        }
        return c;
      });
      return next;
    });
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    insertCloudOrder(newOrder).catch(console.error);
    if (checkoutCoupon) {
      handleCouponUsed(checkoutCoupon);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    updateCloudOrderStatus(orderId, status).catch(console.error);
    setToastMessage(`Order #${orderId} marked as ${status}.`);
  };

  const handleUpdateOrderNotes = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, notes } : o))
    );
    updateCloudOrderNotes(orderId, notes).catch(console.error);
    setToastMessage(`Notes saved for order #${orderId}.`);
  };

  const handleAddCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    upsertCloudCoupon(coupon).catch(console.error);
    setToastMessage(`Coupon "${coupon.code}" created!`);
  };

  const handleToggleCoupon = (id: string) => {
    setCoupons((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
      const target = next.find((c) => c.id === id);
      if (target) upsertCloudCoupon(target).catch(console.error);
      return next;
    });
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    deleteCloudCoupon(id).catch(console.error);
    setToastMessage('Coupon deleted.');
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveCloudSettings(newSettings).catch(console.error);
    setToastMessage('Store settings saved successfully!');
  };

  // ================= BACKUP & RESTORE =================
  const handleExportStoreBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      products,
      orders,
      coupons,
      landingPages,
      settings
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolzaibd_store_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('Store backup file downloaded!');
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.products && Array.isArray(data.products)) setProducts(data.products);
        if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
        if (data.coupons && Array.isArray(data.coupons)) setCoupons(data.coupons);
        if (data.landingPages && Array.isArray(data.landingPages)) setLandingPages(data.landingPages);
        if (data.settings) setSettings(data.settings);
        setToastMessage('Backup restored successfully!');
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // ================= STOREFRONT FILTERING =================
  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
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
    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const isDefaultView = selectedCategory === 'all' && !searchQuery && sortBy === 'featured';
  const topEight = isDefaultView ? filteredProducts.slice(0, 8) : filteredProducts;
  const popularRemaining = isDefaultView ? filteredProducts.slice(8) : [];

  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    if (product.hasVariants && !variant) {
      handleOpenProductPage(product);
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

  // ================= ADMIN DASHBOARD RENDER =================
  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <Suspense fallback={<SuspenseLoader />}>
          <AdminLoginModal
            isOpen={true}
            onClose={closeAdmin}
            onSuccess={() => {
              setIsAdminAuthenticated(true);
              setIsAdminLoginOpen(false);
              setToastMessage('অ্যাডমিন ভেরিফিকেশন সফল হয়েছে!');
            }}
            adminPasswordHash={settings.adminPasswordHash}
          />
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<SuspenseLoader />}>
        <AdminDashboard
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateOrderNotes={handleUpdateOrderNotes}
          coupons={coupons}
          onAddCoupon={handleAddCoupon}
          onToggleCoupon={handleToggleCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          landingPages={landingPages}
          onSaveLandingPage={handleSaveLandingPage}
          onDeleteLandingPage={handleDeleteLandingPage}
          onViewLandingPage={handleViewLandingPage}
          onCloseAdmin={closeAdmin}
          onLogout={handleAdminLogout}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </Suspense>
    );
  }

  // ================= LANDING PAGE CAMPAIGN RENDER =================
  const activeLandingPage = landingPages.find((lp) => lp.slug === activeLandingSlug);

  if (activeLandingPage) {
    return (
      <Suspense fallback={<SuspenseLoader />}>
        <LandingPageView
          landingPage={activeLandingPage}
          onPlaceOrder={handlePlaceOrder}
          onGoHome={() => {
            window.location.hash = '';
            setActiveLandingSlug(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={openAdmin}
          coupons={coupons}
          settings={settings}
          onOpenPolicy={() => setIsPolicyModalOpen(true)}
          onCouponUsed={handleCouponUsed}
          onSaveLandingPage={handleSaveLandingPage}
        />
        <PolicyModal
          isOpen={isPolicyModalOpen}
          onClose={() => setIsPolicyModalOpen(false)}
          settings={settings}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </Suspense>
    );
  }

  // ================= LIVE STOREFRONT RENDER =================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Admin Quick Bar (Displayed when admin is logged in) */}
      {isAdminAuthenticated && (
        <AdminQuickBar
          isCloudConnected={isCloudConnected}
          quickEditMode={quickEditMode}
          onToggleQuickEdit={() => setQuickEditMode(!quickEditMode)}
          onOpenAddProduct={() => {
            setEditingStoreProduct(null);
            setIsStoreProductModalOpen(true);
          }}
          onOpenAddLandingPage={() => setIsStoreLandingModalOpen(true)}
          onOpenDashboard={openAdmin}
          onExportBackup={handleExportStoreBackup}
          onImportBackup={handleImportBackup}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Optional Store Announcement Banner */}
      {settings.isNoticeActive && settings.announcementNotice && (
        <div className="bg-[#E6FCED] border-b border-[#86EFAC] text-[#15803D] text-[11px] sm:text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <Megaphone className="w-3.5 h-3.5 text-[#00C853] flex-shrink-0 animate-bounce" />
          <span>{settings.announcementNotice}</span>
        </div>
      )}

      {/* Active Special Campaign Announcement Bar */}
      {landingPages.length > 0 && landingPages.some(lp => lp.isActive) && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-emerald-500/30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-900 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" /> স্পেশাল অফার
              </span>
              <span className="font-semibold text-emerald-50 line-clamp-1">
                {landingPages[0].title} — মাত্র <strong className="text-amber-300 font-extrabold text-sm sm:text-base">৳{landingPages[0].offerPrice}</strong> (নিয়মিত ৳{landingPages[0].regularPrice})!
              </span>
            </div>
            <button
              onClick={() => handleViewLandingPage(landingPages[0].slug)}
              className="bg-white/95 hover:bg-white text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-1 flex-shrink-0"
            >
              অফারটি দেখুন ➔
            </button>
          </div>
        </div>
      )}

      {/* 1. Top Navigation Bar (Woodmart Style) */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (selectedProductPage) {
            handleCloseProductPage();
          }
        }}
        onSelectProduct={(p) => handleOpenProductPage(p)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenAdmin={openAdmin}
        settings={settings}
        onOpenPolicy={() => setIsPolicyModalOpen(true)}
        products={products}
      />

      {/* Main Content Area: Dedicated In-Page Product View OR Storefront Home */}
      {selectedProductPage ? (
        <Suspense fallback={<SuspenseLoader />}>
          <ProductPageView
            product={selectedProductPage}
            allProducts={products}
            onBack={handleCloseProductPage}
            onAddToCart={handleAddToCart}
            onBuyNow={(prod, variant, qty) => {
              setQuickOrderVariant(variant);
              setQuickOrderQuantity(qty || 1);
              setQuickOrderProduct(prod);
            }}
            onSelectProduct={handleOpenProductPage}
            settings={settings}
            coupons={coupons}
            onOpenPolicy={() => setIsPolicyModalOpen(true)}
          />
        </Suspense>
      ) : (
        <>

      {/* 2. Hero Section */}
      <Hero
        onExploreClick={scrollToProducts}
        settings={settings}
        onOpenPolicy={() => setIsPolicyModalOpen(true)}
      />

      {/* 2.5 Visual 3-Step "How It Works" Workflow Guide */}
      <HowItWorksSection />

      {/* 3. Products Catalog Section */}
      <main ref={productSectionRef} className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        
        {/* Capsule Countdown Bar (Matching MixProBD Reference) */}
        <CountdownBanner />

        {/* Section Title & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 mt-2">
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
            <div className="flex items-center gap-2 bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs shadow-xs">
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

        {/* Visual Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {[
            { id: 'all', label: 'সকল পণ্য', icon: '⚡' },
            { id: 'ai', label: 'AI ও চ্যাটবট', icon: '🤖' },
            { id: 'office', label: 'Office ও Windows', icon: '💼' },
            { id: 'creative', label: 'Design ও Video', icon: '🎨' },
            { id: 'streaming', label: 'Streaming ও OTT', icon: '🎬' },
            { id: 'utilities', label: 'VPN ও Security', icon: '🔒' },
            { id: 'social', label: 'Social & Growth', icon: '👥' },
            { id: 'cards', label: 'Gift Cards', icon: '🎁' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#00C853] text-white border-[#00C853] shadow-md shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#00C853]/40 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Tags */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 mb-6 p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs shadow-sm">
            <Filter className="w-4 h-4 text-[#00C853]" />
            <span className="text-slate-500">Active Filter:</span>
            {selectedCategory !== 'all' && (
              <span className="bg-[#E6FCED] text-[#15803D] px-2 py-0.5 rounded font-bold border border-[#86EFAC]">
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
              className="ml-auto text-slate-500 hover:text-black underline text-xs"
            >
              Reset
            </button>
          </div>
        )}

        {/* Products Grid: Part 1 */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-[#0F172A]">No products found</h3>
            <p className="text-xs text-slate-500">
              No digital subscriptions matched your search. Try "Microsoft", "Canva", "AI", or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-[#00C853] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {topEight.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => handleOpenProductPage(p)}
                  onQuickOrder={(p) => {
                    setQuickOrderVariant(undefined);
                    setQuickOrderQuantity(1);
                    setQuickOrderProduct(p);
                  }}
                  showInstantPill={true}
                  quickEditMode={quickEditMode}
                  onQuickEdit={(p) => {
                    setEditingStoreProduct(p);
                    setIsStoreProductModalOpen(true);
                  }}
                />
              ))}
            </div>

            {/* "MOST POPULAR" Centered Divider */}
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

            {/* Products Grid: Part 2 */}
            {isDefaultView && popularRemaining.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {popularRemaining.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => handleOpenProductPage(p)}
                    onQuickOrder={(p) => {
                      setQuickOrderVariant(undefined);
                      setQuickOrderQuantity(1);
                      setQuickOrderProduct(p);
                    }}
                    showInstantPill={false}
                    quickEditMode={quickEditMode}
                    onQuickEdit={(p) => {
                      setEditingStoreProduct(p);
                      setIsStoreProductModalOpen(true);
                    }}
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
    </>
  )}

      {/* 7. Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (selectedProductPage) {
            handleCloseProductPage();
          }
          scrollToProducts();
        }}
        onOpenAdmin={openAdmin}
        settings={settings}
        onOpenPolicy={() => setIsPolicyModalOpen(true)}
      />

      {/* 8. Woodmart Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          if (selectedProductPage) {
            handleCloseProductPage();
          }
          scrollToProducts();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCategories={() => {
          if (selectedProductPage) {
            handleCloseProductPage();
          }
          scrollToProducts();
        }}
        onGoHome={() => {
          if (selectedProductPage) {
            handleCloseProductPage();
          }
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        settings={settings}
      />

      {/* Quick Order Popup Modal */}
      {quickOrderProduct && (
        <Suspense fallback={null}>
          <QuickOrderModal
            product={quickOrderProduct}
            products={products}
            initialVariant={quickOrderVariant}
            initialQuantity={quickOrderQuantity}
            onClose={() => {
              setQuickOrderProduct(null);
              setQuickOrderVariant(undefined);
              setQuickOrderQuantity(1);
            }}
            onOrderSuccess={(msg) => setToastMessage(msg)}
            onPlaceOrder={handlePlaceOrder}
            coupons={coupons}
            settings={settings}
            onOpenPolicy={() => setIsPolicyModalOpen(true)}
            onCouponUsed={handleCouponUsed}
          />
        </Suspense>
      )}

      {/* Product Details & Specs Modal */}
      {activeModalProduct && (
        <Suspense fallback={null}>
          <ProductModal
            product={activeModalProduct}
            onClose={() => setActiveModalProduct(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={(prod) => {
              setActiveModalProduct(null);
              setQuickOrderProduct(prod);
            }}
            settings={settings}
            onOpenPolicy={() => setIsPolicyModalOpen(true)}
          />
        </Suspense>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <Suspense fallback={null}>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onOpenCheckout={handleOpenCheckout}
            coupons={coupons}
            settings={settings}
            onOpenPolicy={() => setIsPolicyModalOpen(true)}
          />
        </Suspense>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            products={products}
            discountAmount={checkoutDiscount}
            couponCode={checkoutCoupon}
            onOrderSuccess={() => setToastMessage('Order received! Redirecting to WhatsApp...')}
            onPlaceOrder={handlePlaceOrder}
            settings={settings}
            onOpenPolicy={() => setIsPolicyModalOpen(true)}
          />
        </Suspense>
      )}

      {/* Customer Trust, Warranty & Refund Policy Modal */}
      {isPolicyModalOpen && (
        <Suspense fallback={null}>
          <PolicyModal
            isOpen={isPolicyModalOpen}
            onClose={() => setIsPolicyModalOpen(false)}
            settings={settings}
          />
        </Suspense>
      )}

      {/* Order Tracking Modal (With Privacy Protection & Two-Factor Verification) */}
      {isTrackOrderOpen && (
        <Suspense fallback={null}>
          <OrderTrackingModal
            isOpen={isTrackOrderOpen}
            onClose={() => setIsTrackOrderOpen(false)}
            orders={orders}
          />
        </Suspense>
      )}

      {/* Admin Login Modal (Triggered when accessing admin console) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => {
          setIsAdminLoginOpen(false);
          closeAdmin();
        }}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminLoginOpen(false);
          setIsAdminView(true);
          setToastMessage('অ্যাডমিন ভেরিফিকেশন সফল হয়েছে!');
        }}
        adminPasswordHash={settings.adminPasswordHash}
      />

      {/* Storefront In-Line Quick Edit Product Modal */}
      {isStoreProductModalOpen && (
        <Suspense fallback={null}>
          <ProductFormModal
            isOpen={isStoreProductModalOpen}
            onClose={() => {
              setIsStoreProductModalOpen(false);
              setEditingStoreProduct(null);
            }}
            productToEdit={editingStoreProduct}
            onSave={(saved) => {
              handleSaveProduct(saved);
              setIsStoreProductModalOpen(false);
              setEditingStoreProduct(null);
            }}
          />
        </Suspense>
      )}

      {/* Storefront Quick Add Landing Page Modal */}
      {isStoreLandingModalOpen && (
        <Suspense fallback={null}>
          <LandingPageFormModal
            isOpen={isStoreLandingModalOpen}
            onClose={() => setIsStoreLandingModalOpen(false)}
            landingPageToEdit={null}
            onSave={(saved) => {
              handleSaveLandingPage(saved);
              setIsStoreLandingModalOpen(false);
            }}
          />
        </Suspense>
      )}

      {/* Sticky WhatsApp Floater (Desktop/Tablet) */}
      <div className="hidden md:block">
        <FloatingWhatsApp settings={settings} />
      </div>

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}

export default App;
