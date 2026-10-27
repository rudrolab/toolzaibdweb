import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Tag,
  Settings,
  Plus,
  Search,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  Store,
  Check,
  Globe,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Product, Order, OrderStatus, Coupon, StoreSettings, LandingPage } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { LandingPageFormModal } from './LandingPageFormModal';
import { Icon } from '../Icon';

interface AdminDashboardProps {
  products: Product[];
  onSaveProduct: (p: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateOrderNotes: (orderId: string, notes: string) => void;
  coupons: Coupon[];
  onAddCoupon: (c: Coupon) => void;
  onToggleCoupon: (id: string) => void;
  onDeleteCoupon: (id: string) => void;
  landingPages: LandingPage[];
  onSaveLandingPage: (lp: LandingPage) => void;
  onDeleteLandingPage: (id: string) => void;
  onViewLandingPage: (slug: string) => void;
  settings: StoreSettings;
  onSaveSettings: (s: StoreSettings) => void;
  onCloseAdmin: () => void;
}

type TabType = 'overview' | 'products' | 'orders' | 'landing' | 'coupons' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  onUpdateOrderNotes,
  coupons,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  landingPages,
  onSaveLandingPage,
  onDeleteLandingPage,
  onViewLandingPage,
  settings,
  onSaveSettings,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Product management states
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // Orders management states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Landing pages states
  const [editingLandingPage, setEditingLandingPage] = useState<LandingPage | null>(null);
  const [isLandingPageModalOpen, setIsLandingPageModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Coupons states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponVal, setNewCouponVal] = useState<number>(10);
  const [newCouponMin, setNewCouponMin] = useState<number>(500);

  // Settings form states
  const [storeName, setStoreName] = useState(settings.storeName);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber);
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber);
  const [rocketNumber, setRocketNumber] = useState(settings.rocketNumber);
  const [noticeText, setNoticeText] = useState(settings.announcementNotice);
  const [isNoticeActive, setIsNoticeActive] = useState(settings.isNoticeActive);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ================= STATISTICS COMPUTATION =================
  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const pendingOrders = orders.filter((o) => o.status === 'pending');
    const verifiedOrders = orders.filter((o) => o.status === 'verified');

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + o.total, 0);

    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    // Revenue by category
    const categoryRevenue: Record<string, { count: number; revenue: number; label: string }> = {};
    orders.forEach((o) => {
      if (o.status === 'cancelled') return;
      o.items.forEach((it) => {
        const prod = products.find((p) => p.id === it.productId);
        const cat = prod?.categoryLabel || 'Other';
        if (!categoryRevenue[cat]) {
          categoryRevenue[cat] = { count: 0, revenue: 0, label: cat };
        }
        categoryRevenue[cat].count += it.quantity;
        categoryRevenue[cat].revenue += it.price * it.quantity;
      });
    });

    return {
      totalOrdersCount,
      deliveredOrdersCount: deliveredOrders.length,
      pendingOrdersCount: pendingOrders.length,
      verifiedOrdersCount: verifiedOrders.length,
      totalRevenue,
      avgOrderValue,
      categoryRevenue: Object.values(categoryRevenue),
    };
  }, [orders, products]);

  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US') + '৳';
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
      const q = productSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, productCatFilter, productSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const q = orderSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.trxId && o.trxId.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductFormOpen(true);
  };

  const handleOpenNewLandingPage = () => {
    setEditingLandingPage(null);
    setIsLandingPageModalOpen(true);
  };

  const handleOpenEditLandingPage = (lp: LandingPage) => {
    setEditingLandingPage(lp);
    setIsLandingPageModalOpen(true);
  };

  const handleCopyLandingLink = (slug: string) => {
    const url = `${window.location.origin}${window.location.pathname}#landing=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const c: Coupon = {
      id: `c-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponVal),
      minSpend: Number(newCouponMin) || 0,
      isActive: true,
      usageCount: 0,
    };
    onAddCoupon(c);
    setNewCouponCode('');
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      storeName,
      whatsappNumber,
      bkashNumber,
      nagadNumber,
      rocketNumber,
      announcementNotice: noticeText,
      isNoticeActive,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo / Admin Brand */}
            <div className="flex items-center gap-3">
              <div className="p-1 bg-gradient-to-tr from-[#00C853] via-amber-400 to-blue-500 rounded-xl shadow-sm">
                <img src="./logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-lg sm:text-xl text-[#0F172A] tracking-tight">
                    TOOLZ<span className="text-[#00C853]">AI</span> <span className="text-xs bg-red-600 px-1 py-0.5 rounded text-white font-extrabold ml-0.5">BD</span>
                  </span>
                  <span className="bg-[#E6FCED] text-[#15803D] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#86EFAC]">
                    MANAGEMENT DASHBOARD
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={handleOpenNewLandingPage}
                className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>New Landing Page</span>
              </button>

              <button
                onClick={handleOpenNewProduct}
                className="hidden sm:flex items-center gap-1.5 bg-[#00C853] hover:bg-[#00B248] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Post Product</span>
              </button>

              <button
                onClick={onCloseAdmin}
                className="flex items-center gap-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Store className="w-4 h-4 text-[#00C853]" />
                <span>View Live Store</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-[#F1F5F9] py-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                  : 'text-slate-600 hover:text-black hover:bg-[#F1F5F9]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistics & Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'landing'
                  ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                  : 'text-slate-600 hover:text-black hover:bg-[#F1F5F9]'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Landing Pages ({landingPages.length})</span>
              <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                NEW
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                  : 'text-slate-600 hover:text-black hover:bg-[#F1F5F9]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                  : 'text-slate-600 hover:text-black hover:bg-[#F1F5F9]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
              {stats.pendingOrdersCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {stats.pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                  : 'text-slate-600 hover:text-black hover:bg-[#F1F5F9]'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons & Promos ({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                  : 'text-slate-600 hover:text-black hover:bg-[#F1F5F9]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* ================= TAB 1: OVERVIEW & STATISTICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <div className="text-2xl font-black text-[#0F172A] mt-1">
                    {formatPrice(stats.totalRevenue)}
                  </div>
                  <span className="text-[11px] text-[#15803D] font-bold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +24% this month
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853]">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Orders
                  </span>
                  <div className="text-2xl font-black text-[#0F172A] mt-1">
                    {stats.totalOrdersCount}
                  </div>
                  <span className="text-[11px] text-blue-600 font-semibold block mt-1">
                    {stats.deliveredOrdersCount} delivered successfully
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Pending Verification
                  </span>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {stats.pendingOrdersCount}
                  </div>
                  <span className="text-[11px] text-amber-600 font-semibold block mt-1">
                    Awaiting payment check
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Catalog Items
                  </span>
                  <div className="text-2xl font-black text-[#0F172A] mt-1">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-[#15803D] font-semibold block mt-1">
                    Avg Order: {formatPrice(stats.avgOrderValue)}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Package className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Category Breakdown & Sales Charts Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Category Revenue Distribution */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-[#0F172A]">
                      Sales Volume by Category
                    </h3>
                    <p className="text-xs text-slate-500">Distribution across subscription categories</p>
                  </div>
                  <span className="text-xs font-bold text-[#00C853] bg-[#E6FCED] px-2.5 py-1 rounded-md border border-[#86EFAC]">
                    Live Analytics
                  </span>
                </div>

                <div className="space-y-3.5 pt-2">
                  {stats.categoryRevenue.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No category sales recorded yet.</p>
                  ) : (
                    stats.categoryRevenue.map((cat, idx) => {
                      const maxRevenue = Math.max(...stats.categoryRevenue.map((c) => c.revenue), 1);
                      const percent = Math.min(100, Math.round((cat.revenue / maxRevenue) * 100));
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#0F172A]">{cat.label}</span>
                            <span className="font-black text-[#00C853]">
                              {formatPrice(cat.revenue)} ({cat.count} units)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#00C853] to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Order Status Breakdown Pill Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-black text-base sm:text-lg text-[#0F172A]">
                    Fulfillment Health
                  </h3>
                  <p className="text-xs text-slate-500">Instant delivery and verification metrics</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                      <span className="font-bold text-[#15803D]">Delivered & Active</span>
                    </div>
                    <span className="font-black text-[#15803D] text-sm">{stats.deliveredOrdersCount} orders</span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-700">Verified & In Dispatch</span>
                    </div>
                    <span className="font-black text-blue-700 text-sm">{stats.verifiedOrdersCount} orders</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-amber-800">Pending bKash/Nagad Check</span>
                    </div>
                    <span className="font-black text-amber-800 text-sm">{stats.pendingOrdersCount} orders</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <span>Manage All Orders Queue</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Recent Orders Snapshot */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-base sm:text-lg text-[#0F172A]">
                    Recent Order Submissions
                  </h3>
                  <p className="text-xs text-slate-500">Live order queue from store checkout and WhatsApp</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#00C853] hover:underline"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-slate-400 font-bold uppercase text-[10.5px]">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 font-mono font-bold text-[#0F172A]">{o.id}</td>
                        <td className="py-3 font-bold text-[#0F172A]">{o.customerName}</td>
                        <td className="py-3 font-mono text-slate-600">{o.customerPhone}</td>
                        <td className="py-3 text-slate-700 max-w-[200px] truncate">
                          {o.items.map((it) => it.title).join(', ')}
                        </td>
                        <td className="py-3 text-slate-600">{o.paymentMethod}</td>
                        <td className="py-3 font-black text-[#00C853]">{formatPrice(o.total)}</td>
                        <td className="py-3">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              o.status === 'delivered'
                                ? 'bg-emerald-100 text-[#15803D]'
                                : o.status === 'verified'
                                ? 'bg-blue-100 text-blue-700'
                                : o.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setViewingOrder(o)}
                            className="p-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#E6FCED] text-slate-600 hover:text-[#00C853] border border-[#CBD5E1]"
                            title="View order details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: LANDING PAGES BUILDER & MANAGER ================= */}
        {activeTab === 'landing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Action Bar */}
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-base sm:text-lg text-[#0F172A]">
                    Custom Landing Page Campaigns
                  </h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    High Converting Funnels
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create standalone marketing campaign pages with instant express checkout, video guides, and direct bKash/Nagad integration.
                </p>
              </div>

              <button
                onClick={handleOpenNewLandingPage}
                className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00B248] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Create Landing Page</span>
              </button>
            </div>

            {/* Landing Pages Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10.5px]">
                      <th className="p-3 pl-4">Campaign Title</th>
                      <th className="p-3">Landing URL / Slug</th>
                      <th className="p-3">Offer Price</th>
                      <th className="p-3">Stock Info</th>
                      <th className="p-3">Views / Orders</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {landingPages.map((lp) => (
                      <tr key={lp.id} className="hover:bg-[#F8FAFC] transition-colors">
                        
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-[#E2E8F0] p-0.5 overflow-hidden flex items-center justify-center flex-shrink-0">
                              <img
                                src={lp.sliderImages[0] || './products/Google-18-1-pic-lp1024.webp'}
                                alt="thumb"
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[#0F172A] line-clamp-1">{lp.title}</div>
                              <span className="text-[10px] text-amber-600 font-semibold">{lp.badgeText}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <code className="bg-[#F1F5F9] text-blue-600 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                              /landing/{lp.slug}
                            </code>
                            <button
                              onClick={() => handleCopyLandingLink(lp.slug)}
                              className="text-slate-400 hover:text-slate-700 p-1"
                              title="Copy URL"
                            >
                              {copiedSlug === lp.slug ? (
                                <Check className="w-3.5 h-3.5 text-[#00C853]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="p-3 whitespace-nowrap">
                          <span className="font-black text-[#00C853] text-sm">{formatPrice(lp.offerPrice)}</span>
                          <span className="text-[10.5px] text-slate-400 line-through ml-1.5">{formatPrice(lp.regularPrice)}</span>
                        </td>

                        <td className="p-3 text-slate-600">
                          <span className="font-bold text-amber-600">{lp.stockRemaining} left</span>
                          <span className="text-[10.5px] text-slate-400 block">{lp.stockSold} sold</span>
                        </td>

                        <td className="p-3 text-slate-600">
                          <span className="font-bold text-[#0F172A]">{lp.viewsCount} views</span>
                          <span className="text-[10.5px] text-[#15803D] font-bold block">{lp.conversionsCount} sales</span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lp.isActive
                                ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {lp.isActive ? 'Active Live ✓' : 'Draft'}
                          </span>
                        </td>

                        <td className="p-3 text-right pr-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => onViewLandingPage(lp.slug)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E6FCED] text-[#15803D] border border-[#86EFAC] hover:bg-[#DCFCE7] font-bold text-xs transition-all shadow-sm"
                            title="Open Live Landing Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditLandingPage(lp)}
                            className="p-1.5 rounded-lg bg-white border border-[#CBD5E1] text-slate-700 hover:text-[#00C853] hover:border-[#86EFAC] transition-all shadow-sm"
                            title="Edit Landing Page"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete landing page "${lp.title}"?`)) {
                                onDeleteLandingPage(lp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white border border-[#CBD5E1] text-slate-700 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                            title="Delete Landing Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: PRODUCTS CATALOG ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
              <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search catalog by title, brand..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853]"
                  />
                </div>

                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="ai">AI Tools</option>
                  <option value="office">Office & OS</option>
                  <option value="creative">Design & Video</option>
                  <option value="streaming">Streaming</option>
                  <option value="utilities">Utilities</option>
                  <option value="social">Social</option>
                  <option value="cards">Gift Cards</option>
                </select>
              </div>

              <button
                onClick={handleOpenNewProduct}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#00C853] hover:bg-[#00B248] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="font-heading font-black text-sm sm:text-base text-[#0F172A]">
                  All Products ({filteredProducts.length})
                </h3>
                <span className="text-xs text-slate-500">Live store inventory</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10.5px]">
                      <th className="p-3 pl-4">Item</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Variants</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredProducts.map((p) => {
                      const isSoldOut = p.isSoldOut;
                      const priceLabel = p.hasVariants && p.priceRange
                        ? `${formatPrice(p.priceRange.min)} - ${formatPrice(p.priceRange.max)}`
                        : formatPrice(p.currentPrice || 0);

                      return (
                        <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-3 pl-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] p-0.5 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-contain" />
                                ) : (
                                  <Icon name={p.iconName} className="w-5 h-5 text-[#00C853]" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-[#0F172A] line-clamp-1">{p.title}</div>
                                <div className="text-[10.5px] text-slate-500">{p.brand} • ★ {p.rating}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="bg-[#F1F5F9] text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-[#E2E8F0]">
                              {p.categoryLabel}
                            </span>
                          </td>

                          <td className="p-3 font-black text-[#00C853] whitespace-nowrap">
                            {priceLabel}
                          </td>

                          <td className="p-3">
                            {p.discountPercent ? (
                              <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10.5px] font-bold">
                                -{p.discountPercent}%
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="p-3 text-slate-600">
                            {p.hasVariants ? `${p.variants?.length || 0} plans` : 'Single'}
                          </td>

                          <td className="p-3">
                            <button
                              onClick={() => {
                                onSaveProduct({
                                  ...p,
                                  isSoldOut: !isSoldOut,
                                });
                              }}
                              className={`px-2 py-1 rounded-full text-[10.5px] font-bold transition-all ${
                                isSoldOut
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                              }`}
                              title="Click to toggle In Stock / Sold Out"
                            >
                              {isSoldOut ? 'Sold Out 🚫' : 'In Stock ✓'}
                            </button>
                          </td>

                          <td className="p-3 text-right pr-4 whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg bg-white border border-[#CBD5E1] text-slate-700 hover:text-[#00C853] hover:border-[#86EFAC] transition-all shadow-sm"
                              title="Edit product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white border border-[#CBD5E1] text-slate-700 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 4: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
              <div className="relative flex-1 w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, phone, customer, TrxID..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853]"
                />
              </div>

              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {(['all', 'pending', 'verified', 'delivered', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase whitespace-nowrap ${
                      orderStatusFilter === st
                        ? 'bg-[#00C853] text-white shadow-sm'
                        : 'bg-[#F8FAFC] border border-[#CBD5E1] text-slate-600 hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="font-heading font-black text-sm sm:text-base text-[#0F172A]">
                  Orders List ({filteredOrders.length})
                </h3>
                <span className="text-xs text-slate-500">Live order management & updates</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10.5px]">
                      <th className="p-3 pl-4">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">WhatsApp Phone</th>
                      <th className="p-3">Items Summary</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          No orders matched your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-3 pl-4 font-mono font-bold text-[#0F172A]">{o.id}</td>
                          <td className="p-3 font-bold text-[#0F172A]">{o.customerName}</td>
                          <td className="p-3 font-mono text-slate-600">{o.customerPhone}</td>
                          <td className="p-3 text-slate-700 max-w-[200px] truncate">
                            {o.items.map((i) => i.title).join(', ')}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-700 block">{o.paymentMethod}</span>
                            {o.trxId && (
                              <span className="text-[10px] text-slate-500 font-mono">TrxID: {o.trxId}</span>
                            )}
                          </td>
                          <td className="p-3 font-black text-[#00C853]">{formatPrice(o.total)}</td>
                          <td className="p-3">
                            <select
                              value={o.status}
                              onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className={`text-[10.5px] font-bold uppercase px-2 py-1 rounded-lg border cursor-pointer ${
                                o.status === 'delivered'
                                  ? 'bg-[#E6FCED] text-[#15803D] border-[#86EFAC]'
                                  : o.status === 'verified'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : o.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="verified">Verified</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-right pr-4 whitespace-nowrap">
                            <button
                              onClick={() => setViewingOrder(o)}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-slate-700 hover:text-[#00C853] hover:border-[#86EFAC] text-xs font-bold transition-all shadow-sm"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 5: COUPONS & DISCOUNTS ================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Create Coupon Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <h3 className="font-heading font-black text-base sm:text-lg text-[#0F172A] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#00C853]" />
                Create New Promotion / Coupon Code
              </h3>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FLASH25, RAMADAN100"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono uppercase font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A]"
                  >
                    <option value="percent">Percent Off (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Discount Amount</label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-black text-[#00C853]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Min Spend (৳)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A]"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-[#00C853] hover:bg-[#00B248] text-white py-2 px-4 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    Add Coupon
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0]">
                <h4 className="font-heading font-black text-sm sm:text-base text-[#0F172A]">
                  Active Store Coupons ({coupons.length})
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10.5px]">
                      <th className="p-3 pl-4">Coupon Code</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Min Spend</th>
                      <th className="p-3">Times Used</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="p-3 pl-4 font-mono font-black text-base text-[#00C853]">
                          {c.code}
                        </td>
                        <td className="p-3 font-bold text-[#0F172A]">
                          {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `৳${c.discountValue} FLAT OFF`}
                        </td>
                        <td className="p-3 text-slate-600">
                          {c.minSpend ? `Min ৳${c.minSpend}` : 'No minimum'}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          {c.usageCount} orders
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => onToggleCoupon(c.id)}
                            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                              c.isActive
                                ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {c.isActive ? 'Active ✓' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-3 text-right pr-4">
                          <button
                            onClick={() => onDeleteCoupon(c.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 6: STORE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-black text-lg text-[#0F172A] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#00C853]" />
                Store Configuration & Payment Accounts
              </h3>
              <p className="text-xs text-slate-500">
                Update payment receiver phone numbers and emergency customer announcements.
              </p>
            </div>

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Official WhatsApp Support Hotline</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#E2136E] mb-1">bKash Send Money Number</label>
                  <input
                    type="text"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F7941D] mb-1">Nagad Send Money Number</label>
                  <input
                    type="text"
                    value={nagadNumber}
                    onChange={(e) => setNagadNumber(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8C3494] mb-1">Rocket Send Money Number</label>
                  <input
                    type="text"
                    value={rocketNumber}
                    onChange={(e) => setRocketNumber(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#0F172A]">Store Announcement Notice</label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNoticeActive}
                      onChange={(e) => setIsNoticeActive(e.target.checked)}
                      className="rounded text-[#00C853] focus:ring-[#00C853]"
                    />
                    <span>Show Notice on Store</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {settingsSaved ? (
                  <span className="text-xs font-bold text-[#15803D] flex items-center gap-1">
                    <Check className="w-4 h-4 text-[#00C853]" /> Settings Saved Successfully!
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="bg-[#00C853] hover:bg-[#00B248] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all active:scale-95"
                >
                  Save Store Settings
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* Product Form Modal (Posting / Editing) */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        productToEdit={editingProduct}
        onSave={onSaveProduct}
      />

      {/* Landing Page Form Modal */}
      <LandingPageFormModal
        isOpen={isLandingPageModalOpen}
        onClose={() => setIsLandingPageModalOpen(false)}
        landingPageToEdit={editingLandingPage}
        onSave={onSaveLandingPage}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onUpdateStatus={onUpdateOrderStatus}
        onUpdateNotes={onUpdateOrderNotes}
      />

    </div>
  );
};
