export interface ProductVariant {
  id: string;
  name: string;
  originalPrice?: number;
  price: number;
  duration?: string;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'office' | 'ai' | 'creative' | 'streaming' | 'utilities' | 'social' | 'cards';
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  instantDelivery: boolean;
  discountPercent?: number;
  isPopular?: boolean;
  isSoldOut?: boolean;
  hasVariants: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  originalPrice?: number;
  currentPrice?: number;
  variants?: ProductVariant[];
  tagline: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  colorTheme: string; // Tailwind gradient/accent class
  iconName: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'verified' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  variantName?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  senderNumber?: string;
  trxId?: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minSpend?: number;
  isActive: boolean;
  usageCount: number;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  announcementNotice: string;
  isNoticeActive: boolean;
  adminPasswordHash?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface LandingPageFeature {
  icon: string;
  title: string;
  description: string;
}

export interface LandingPageFAQ {
  question: string;
  answer: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  badgeText: string;
  regularPrice: number;
  offerPrice: number;
  saveBadgeText: string;
  stockRemaining: number;
  stockSold: number;
  sliderImages: string[];
  scrollingFeatures: string[];
  features: LandingPageFeature[];
  faqs: LandingPageFAQ[];
  videoTutorialUrl?: string;
  activationGuideImages: string[];
  isActive: boolean;
  createdAt: string;
  viewsCount: number;
  conversionsCount: number;
}
