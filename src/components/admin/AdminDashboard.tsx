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
  ExternalLink,
  LogOut,
  Shield,
  Key,
  Database,
  Download,
  RefreshCw,
  Mail,
  Zap,
  Send
} from 'lucide-react';
import { Product, Order, OrderStatus, Coupon, StoreSettings, LandingPage } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { LandingPageFormModal } from './LandingPageFormModal';
import { Icon } from '../Icon';
import { hashPassword } from '../../utils/security';
import { sendDeliveryEmailViaResend, resolveOrderCredentials } from '../../services/autoDelivery';
import {
  saveSupabaseConfig,
  testSupabaseConnection,
  seedCloudDatabase,
  getStoredSupabaseConfig
} from '../../services/supabase';

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
  onLogout: () => void;
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
  onLogout,
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
  const [upayNumber, setUpayNumber] = useState(settings.upayNumber || settings.nagadNumber);
  const [noticeText, setNoticeText] = useState(settings.announcementNotice);
  const [isNoticeActive, setIsNoticeActive] = useState(settings.isNoticeActive);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Resend Email Settings
  const [resendApiKey, setResendApiKey] = useState(settings.resendApiKey || '');
  const [senderEmail, setSenderEmail] = useState(settings.senderEmail || 'ToolzAi BD <onboarding@resend.dev>');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Firebase Firestore Gateway Settings
  const [autoVerifyEnabled, setAutoVerifyEnabled] = useState(settings.autoVerifyEnabled ?? true);
  const [gatewayApiUrl, setGatewayApiUrl] = useState(settings.gatewayApiUrl || '');
  const [firebaseApiKey, setFirebaseApiKey] = useState(settings.firebaseApiKey || '');
  const [firebaseProjectId, setFirebaseProjectId] = useState(settings.firebaseProjectId || '');
  const [firestoreCollectionName, setFirestoreCollectionName] = useState(settings.firestoreCollectionName || 'transactions');
  const [firestoreTrxIdField, setFirestoreTrxIdField] = useState(settings.firestoreTrxIdField || 'trxId');
  const [firestoreAmountField, setFirestoreAmountField] = useState(settings.firestoreAmountField || 'amount');

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
      ...settings,
      storeName,
      whatsappNumber,
      bkashNumber,
      nagadNumber,
      rocketNumber,
      upayNumber: upayNumber.trim() || undefined,
      announcementNotice: noticeText,
      isNoticeActive,
      resendApiKey: resendApiKey.trim() || undefined,
      senderEmail: senderEmail.trim() || undefined,
      autoVerifyEnabled,
      gatewayApiUrl: gatewayApiUrl.trim() || undefined,
      firebaseApiKey: firebaseApiKey.trim() || undefined,
      firebaseProjectId: firebaseProjectId.trim() || undefined,
      firestoreCollectionName: firestoreCollectionName.trim() || 'transactions',
      firestoreTrxIdField: firestoreTrxIdField.trim() || 'trxId',
      firestoreAmountField: firestoreAmountField.trim() || 'amount',
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSendManualDeliveryEmail = async (order: Order) => {
    if (!resendApiKey) {
      alert('Resend API Key কনফিগার করা নেই। Settings ট্যাবে গিয়ে Resend API Key দিন।');
      return;
    }
    const { credentialsText, instructionsText } = resolveOrderCredentials(order, products);
    const res = await sendDeliveryEmailViaResend({
      settings: {
        ...settings,
        resendApiKey,
        senderEmail,
      },
      order,
      credentialsText,
      instructionsText,
    });
    if (res.success) {
      onUpdateOrderStatus(order.id, 'delivered');
      alert(`✅ ডেলিভারি ইমেইল সফলভাবে পাঠানো হয়েছে: ${order.customerEmail}`);
    } else {
      alert(`❌ ডেলিভারি ইমেইল পাঠানো যায়নি: ${res.message}`);
    }
  };

  const handleSendTestEmail = async () => {
    if (!resendApiKey) {
      setTestEmailResult({ success: false, msg: 'Resend API Key প্রদান করুন।' });
      return;
    }

    const targetEmail = window.prompt(
      'যে ইমেইলে টেস্ট ডেলিভারি দেখতে চান সেটি লিখুন (Resend-এর ফ্রি টেস্ট মোডে আপনার Resend একাউন্টের জিমেইলটি দিন):',
      ''
    );
    if (!targetEmail || !targetEmail.trim()) {
      return;
    }

    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    try {
      const dummyOrder: Order = {
        id: 'TZ-TEST-' + Math.floor(1000 + Math.random() * 9000),
        customerName: 'Admin Tester',
        customerPhone: whatsappNumber || '01886822838',
        customerEmail: targetEmail.trim(),
        items: [
          { productId: 'test-1', title: 'Test Product (Canva Pro / Gemini)', quantity: 1, price: 999 }
        ],
        subtotal: 999,
        discount: 0,
        total: 999,
        paymentMethod: 'bKash Auto Gateway (Test)',
        status: 'delivered',
        createdAt: new Date().toISOString(),
      };

      const res = await sendDeliveryEmailViaResend({
        settings: {
          ...settings,
          resendApiKey,
          senderEmail,
        },
        order: dummyOrder,
        credentialsText: 'TEST LICENSE KEY: W269N-WFGWX-YVC9B-4J6C9-T83GX\nInvite Link: https://canva.com/brand/join?test=sample',
        instructionsText: '১. এটি একটি টেস্ট ডেলিভারি ইমেইল।\n২. আপনার Resend ইন্টিগ্রেশন ১০০% সক্রিয় রয়েছে!',
      });

      if (res.success) {
        setTestEmailResult({ success: true, msg: `টেস্ট ইমেইল সফলভাবে পাঠানো হয়েছে (${res.emailId})!` });
      } else {
        setTestEmailResult({ success: false, msg: `ইমেইল পাঠানো যায়নি: ${res.message}` });
      }
    } catch (e: any) {
      setTestEmailResult({ success: false, msg: e.message || 'Error occurred' });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Security / Admin Password Change state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatusMsg(null);

    const activeStoredHash = settings.adminPasswordHash || 'toolzadmin2026';
    const inputCurrentHash = await hashPassword(currentPasswordInput.trim());
    const expectedCurrentHash = activeStoredHash.length > 20
      ? activeStoredHash
      : await hashPassword(activeStoredHash);

    const isCurrentValid =
      currentPasswordInput.trim() === activeStoredHash ||
      inputCurrentHash === expectedCurrentHash;

    if (!isCurrentValid) {
      setPasswordStatusMsg({ type: 'error', text: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!' });
      return;
    }

    if (newPasswordInput.trim().length < 6) {
      setPasswordStatusMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatusMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!' });
      return;
    }

    const newHashed = await hashPassword(newPasswordInput.trim());
    onSaveSettings({
      ...settings,
      adminPasswordHash: newHashed,
    });

    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordStatusMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' });
    setTimeout(() => setPasswordStatusMsg(null), 4000);
  };

  // Supabase Cloud Configuration State
  const initialSupabaseConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || initialSupabaseConfig?.url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings.supabaseAnonKey || initialSupabaseConfig?.anonKey || '');
  const [cloudConnectStatus, setCloudConnectStatus] = useState<{ testing: boolean; message?: string; success?: boolean } | null>(null);
  const [isSeedingCloud, setIsSeedingCloud] = useState(false);

  const handleTestAndConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setCloudConnectStatus({ testing: false, success: false, message: 'Supabase URL এবং Anon Key উভয়টি পূরণ করুন।' });
      return;
    }

    setCloudConnectStatus({ testing: true, message: 'Supabase সংযোগ পরীক্ষা করা হচ্ছে...' });
    const result = await testSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
    if (result.success) {
      saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
      onSaveSettings({
        ...settings,
        supabaseUrl: supabaseUrl.trim(),
        supabaseAnonKey: supabaseAnonKey.trim()
      });
      setCloudConnectStatus({ testing: false, success: true, message: result.message });
    } else {
      setCloudConnectStatus({ testing: false, success: false, message: result.message });
    }
  };

  const handleSeedCatalogToSupabase = async () => {
    if (!confirm('আপনি কি বর্তমান সব প্রোডাক্ট, কুপন ও সেটিংস Supabase ক্লাউডে আপলোড করতে চান?')) return;
    setIsSeedingCloud(true);
    const result = await seedCloudDatabase(products, coupons, landingPages, settings);
    setIsSeedingCloud(false);
    alert(result.message);
  };

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
                <span className="hidden sm:inline">View Live Store</span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                  title="Logout from Admin Dashboard"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>লগআউট</span>
                </button>
              )}
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
                          <td className="p-3 text-right pr-4 whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleSendManualDeliveryEmail(o)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#E6FCED] border border-[#86EFAC] text-[#15803D] hover:bg-[#DCFCE7] text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1"
                              title="Send credentials email to customer"
                            >
                              <Zap className="w-3.5 h-3.5 text-[#00C853]" />
                              <span>Email</span>
                            </button>
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

                <div>
                  <label className="block text-xs font-bold text-[#0072BC] mb-1">Upay Send Money Number</label>
                  <input
                    type="text"
                    value={upayNumber}
                    onChange={(e) => setUpayNumber(e.target.value)}
                    placeholder="e.g. 01886822838"
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

              {/* ⚡ Automated Gateway & Instant Email Delivery Settings */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0FDF4] to-[#F8FAFC] border-2 border-[#86EFAC] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#86EFAC]/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#00C853] text-white flex items-center justify-center font-black">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm sm:text-base text-[#0F172A]">
                        Automated Gateway & Instant Email Delivery (স্বয়ংক্রিয় পেমেন্ট ভেরিফিকেশন ও ইমেইল ডেলিভারি)
                      </h4>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Firebase Firestore থেকে TrxID ভেরিফাই করে Resend দিয়ে ৩ সেকেন্ডে ক্রেতার জিমেইলে লাইসেন্স কী পাঠায়
                      </p>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#86EFAC] shadow-sm">
                    <input
                      type="checkbox"
                      checked={autoVerifyEnabled}
                      onChange={(e) => setAutoVerifyEnabled(e.target.checked)}
                      className="rounded text-[#00C853] focus:ring-[#00C853] w-4 h-4"
                    />
                    <span className="text-xs font-bold text-[#15803D]">
                      {autoVerifyEnabled ? 'Active (স্বক্রিয়)' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Resend Configuration */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      1. Resend Email Service Configuration (Free 3,000 emails/mo)
                    </span>
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#00C853] hover:underline font-bold inline-flex items-center gap-1"
                    >
                      Get Free Resend API Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Resend API Key (re_...)
                      </label>
                      <input
                        type="password"
                        value={resendApiKey}
                        onChange={(e) => setResendApiKey(e.target.value)}
                        placeholder="re_123456789_abcdef..."
                        className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Sender From Email Address
                      </label>
                      <input
                        type="text"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="ToolzAi BD <onboarding@resend.dev>"
                        className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                      />
                    </div>
                  </div>

                  {/* Send Test Email button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-slate-500">
                      {testEmailResult && (
                        <span className={testEmailResult.success ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                          {testEmailResult.msg}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      disabled={isSendingTestEmail || !resendApiKey}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3 h-3 text-[#00C853]" />
                      <span>{isSendingTestEmail ? 'পাঠানো হচ্ছে...' : 'Send Test Delivery Email'}</span>
                    </button>
                  </div>
                </div>

                {/* Firebase Firestore Configuration */}
                <div className="space-y-3 pt-2 border-t border-[#86EFAC]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-amber-600" />
                      2. Personal Gateway Firebase Firestore Settings
                    </span>
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-600 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      Firebase Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Gateway Verification API URL (ঐচ্ছিক - Vercel Gateway Deploy করা থাকলে)
                    </label>
                    <input
                      type="url"
                      value={gatewayApiUrl}
                      onChange={(e) => setGatewayApiUrl(e.target.value)}
                      placeholder="https://your-payment-gateway.vercel.app"
                      className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      আপনার নিজস্ব গেটওয়ের Vercel URL থাকলে এটি দিন, সরাসরি /api/verify-payment দিয়ে ভেরিফাই হবে।
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Firebase Project ID *
                      </label>
                      <input
                        type="text"
                        value={firebaseProjectId}
                        onChange={(e) => setFirebaseProjectId(e.target.value)}
                        placeholder="e.g. my-gateway-123"
                        className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Firebase Web API Key (Optional)
                      </label>
                      <input
                        type="password"
                        value={firebaseApiKey}
                        onChange={(e) => setFirebaseApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Firestore Collection Name
                      </label>
                      <input
                        type="text"
                        value={firestoreCollectionName}
                        onChange={(e) => setFirestoreCollectionName(e.target.value)}
                        placeholder="transactions"
                        className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        TrxID Field Name
                      </label>
                      <input
                        type="text"
                        value={firestoreTrxIdField}
                        onChange={(e) => setFirestoreTrxIdField(e.target.value)}
                        placeholder="trxId"
                        className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Amount Field Name
                      </label>
                      <input
                        type="text"
                        value={firestoreAmountField}
                        onChange={(e) => setFirestoreAmountField(e.target.value)}
                        placeholder="amount"
                        className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:border-[#00C853]"
                      />
                    </div>
                  </div>
                </div>

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

            {/* Admin Security & Access Protection Card */}
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 shadow-sm mt-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-heading font-black text-base text-[#0F172A]">
                    Admin Security & Password (অ্যাডমিন নিরাপত্তা ও পাসওয়ার্ড পরিবর্তন)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Secure your admin management console from unauthorized public access
                  </p>
                </div>
              </div>

              {passwordStatusMsg && (
                <div
                  className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordStatusMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordStatusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বর্তমান পাসওয়ার্ড (Current)
                    </label>
                    <input
                      type="password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      placeholder="বর্তমান পাসওয়ার্ড..."
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      নতুন পাসওয়ার্ড (New)
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড..."
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পুনরায় নতুন পাসওয়ার্ড (Confirm)
                    </label>
                    <input
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="পুনরায় লিখুন..."
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Default password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">toolzadmin2026</code>
                  </span>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Supabase Cloud Database Real-time Sync Card */}
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 shadow-sm mt-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-[#0F172A] flex items-center gap-2">
                      Supabase Cloud Database (রিয়েল-টাইম ক্লাউড সিঙ্ক)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Connect your 100% free Supabase project to sync products, orders, and edits live across all visitors
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                  initialSupabaseConfig?.url
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${initialSupabaseConfig?.url ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {initialSupabaseConfig?.url ? 'Cloud Connected' : 'Local Storage Mode'}
                </span>
              </div>

              {cloudConnectStatus && (
                <div
                  className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    cloudConnectStatus.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border border-amber-200 text-amber-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{cloudConnectStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleTestAndConnectSupabase} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Supabase Anon Public Key
                    </label>
                    <input
                      type="password"
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    💡 <strong>Tip:</strong> Supabase ড্যাশবোর্ডে <strong>SQL Editor</strong>-এ গিয়ে আমাদের প্রোভাইড করা <code className="bg-white px-1.5 py-0.5 rounded border font-mono font-bold">supabase-schema.sql</code> রান করুন।
                  </span>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-1"
                  >
                    Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSeedCatalogToSupabase}
                    disabled={isSeedingCloud}
                    className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSeedingCloud ? 'animate-spin' : ''}`} />
                    <span>{isSeedingCloud ? 'আপলোড হচ্ছে...' : 'সব প্রোডাক্ট ও ক্যাম্পেইন Supabase-এ সিড করুন (Upload All)'}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-[#00C853] hover:bg-[#00B248] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Save & Connect Cloud</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 1-Click Store Backup & Restore Card */}
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 shadow-sm mt-6">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E2E8F0]">
                <Download className="w-5 h-5 text-cyan-600" />
                <div>
                  <h3 className="font-heading font-black text-base text-[#0F172A]">
                    Store Backup & Restore (সম্পূর্ণ সাইট ব্যাকআপ ও রিস্টোর)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Export your entire store catalog, orders, and landing pages as a JSON file or restore anytime
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs text-slate-600">
                  Total Items: <strong>{products.length} Products</strong>, <strong>{orders.length} Orders</strong>, <strong>{landingPages.length} Landing Pages</strong>
                </span>

                <button
                  type="button"
                  onClick={handleExportStoreBackup}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Store Backup (.JSON)</span>
                </button>
              </div>
            </div>
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
        onSendDeliveryEmail={handleSendManualDeliveryEmail}
      />

    </div>
  );
};
