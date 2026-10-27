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
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  price: number;
}
