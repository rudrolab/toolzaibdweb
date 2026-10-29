import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, OrderStatus, Coupon, StoreSettings, LandingPage } from '../types';

let supabaseInstance: SupabaseClient | null = null;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  try {
    const meta = import.meta as any;
    const envUrl = meta.env?.VITE_SUPABASE_URL;
    const envKey = meta.env?.VITE_SUPABASE_ANON_KEY;
    if (envUrl && envKey) {
      return { url: envUrl.trim(), anonKey: envKey.trim() };
    }

    const savedUrl = localStorage.getItem('toolzaibd_supabase_url');
    const savedKey = localStorage.getItem('toolzaibd_supabase_key');
    if (savedUrl && savedKey) {
      return { url: savedUrl.trim(), anonKey: savedKey.trim() };
    }
  } catch (e) {
    console.error('Error reading Supabase config:', e);
  }
  return null;
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem('toolzaibd_supabase_url', url.trim());
    localStorage.setItem('toolzaibd_supabase_key', anonKey.trim());
    supabaseInstance = createClient(url.trim(), anonKey.trim());
  } catch (e) {
    console.error('Error saving Supabase config:', e);
  }
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const config = getStoredSupabaseConfig();
  if (config && config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 10 } }
      });
      return supabaseInstance;
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
      return null;
    }
  }
  return null;
}

export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = url && key ? createClient(url.trim(), key.trim()) : getSupabase();
    if (!client) {
      return { success: false, message: 'Supabase URL অথবা Anon Key পাওয়া যায়নি।' };
    }

    // Try a simple select to test connection
    const { error } = await client.from('products').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return { success: true, message: 'Supabase কানেক্টেড! কিন্তু টেবিল তৈরি করা প্রয়োজন (Run supabase-schema.sql).' };
      }
      return { success: false, message: `Supabase ত্রুটি: ${error.message}` };
    }

    return { success: true, message: 'Supabase ক্লাউড ডাটাবেজ সফলভাবে কানেক্ট হয়েছে!' };
  } catch (e: any) {
    return { success: false, message: e.message || 'কানেকশন ব্যর্থ হয়েছে।' };
  }
}

// ================= CLOUD PRODUCTS API =================
export async function fetchCloudProducts(): Promise<Product[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any): Product => ({
      id: row.id,
      title: row.title,
      brand: row.brand,
      tagline: row.tagline || '',
      category: row.category,
      categoryLabel: row.category_label || row.category,
      iconName: row.icon_name || 'Sparkles',
      imageUrl: row.image_url || '',
      currentPrice: row.current_price,
      originalPrice: row.original_price,
      priceRange: row.price_range,
      instantDelivery: row.instant_delivery ?? true,
      discountPercent: row.discount_percent,
      rating: row.rating || 4.9,
      reviewsCount: row.reviews_count || 50,
      isPopular: row.is_popular,
      isSoldOut: row.is_sold_out,
      hasVariants: row.has_variants ?? Boolean(row.price_range || (row.variants && row.variants.length > 0)),
      description: row.description || '',
      specs: row.specs || [],
      colorTheme: row.color_theme || 'emerald',
      features: row.features || [],
      variants: row.variants || []
    }));
  } catch (e) {
    console.error('fetchCloudProducts error:', e);
    return null;
  }
}

export async function upsertCloudProduct(p: Product): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
      id: p.id,
      title: p.title,
      brand: p.brand,
      tagline: p.tagline,
      category: p.category,
      category_label: p.categoryLabel,
      icon_name: p.iconName,
      image_url: p.imageUrl,
      current_price: p.currentPrice,
      original_price: p.originalPrice,
      price_range: p.priceRange,
      instant_delivery: p.instantDelivery,
      discount_percent: p.discountPercent,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      is_popular: p.isPopular,
      is_sold_out: p.isSoldOut,
      has_variants: p.hasVariants,
      description: p.description,
      specs: p.specs,
      color_theme: p.colorTheme,
      features: p.features,
      variants: p.variants,
      updated_at: new Date().toISOString()
    };
    const { error } = await sb.from('products').upsert(row);
    return !error;
  } catch (e) {
    console.error('upsertCloudProduct error:', e);
    return false;
  }
}

export async function deleteCloudProduct(productId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('products').delete().eq('id', productId);
    return !error;
  } catch (e) {
    console.error('deleteCloudProduct error:', e);
    return false;
  }
}

// ================= CLOUD ORDERS API =================
export async function fetchCloudOrders(): Promise<Order[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any): Order => ({
      id: row.id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      items: row.items || [],
      subtotal: row.subtotal,
      discount: row.discount || 0,
      total: row.total,
      paymentMethod: row.payment_method,
      senderNumber: row.sender_number,
      trxId: row.trx_id,
      status: row.status as OrderStatus,
      createdAt: row.created_at,
      notes: row.notes
    }));
  } catch (e) {
    console.error('fetchCloudOrders error:', e);
    return null;
  }
}

export async function insertCloudOrder(o: Order): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
      id: o.id,
      customer_name: o.customerName,
      customer_phone: o.customerPhone,
      customer_email: o.customerEmail,
      items: o.items,
      subtotal: o.subtotal,
      discount: o.discount,
      total: o.total,
      payment_method: o.paymentMethod,
      sender_number: o.senderNumber,
      trx_id: o.trxId,
      status: o.status,
      notes: o.notes,
      created_at: o.createdAt || new Date().toISOString()
    };
    const { error } = await sb.from('orders').upsert(row);
    return !error;
  } catch (e) {
    console.error('insertCloudOrder error:', e);
    return false;
  }
}

export async function updateCloudOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('orders').update({ status }).eq('id', orderId);
    return !error;
  } catch (e) {
    console.error('updateCloudOrderStatus error:', e);
    return false;
  }
}

export async function updateCloudOrderNotes(orderId: string, notes: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('orders').update({ notes }).eq('id', orderId);
    return !error;
  } catch (e) {
    console.error('updateCloudOrderNotes error:', e);
    return false;
  }
}

// ================= CLOUD COUPONS API =================
export async function fetchCloudCoupons(): Promise<Coupon[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('coupons').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any): Coupon => ({
      id: row.id,
      code: row.code,
      discountType: row.discount_type,
      discountValue: row.discount_value,
      minSpend: row.min_spend,
      isActive: row.is_active,
      usageCount: row.usage_count || 0
    }));
  } catch (e) {
    console.error('fetchCloudCoupons error:', e);
    return null;
  }
}

export async function upsertCloudCoupon(c: Coupon): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
      id: c.id,
      code: c.code,
      discount_type: c.discountType,
      discount_value: c.discountValue,
      min_spend: c.minSpend,
      is_active: c.isActive,
      usage_count: c.usageCount
    };
    const { error } = await sb.from('coupons').upsert(row);
    return !error;
  } catch (e) {
    console.error('upsertCloudCoupon error:', e);
    return false;
  }
}

export async function deleteCloudCoupon(couponId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('coupons').delete().eq('id', couponId);
    return !error;
  } catch (e) {
    console.error('deleteCloudCoupon error:', e);
    return false;
  }
}

// ================= CLOUD LANDING PAGES API =================
export async function fetchCloudLandingPages(): Promise<LandingPage[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('landing_pages').select('*');
    if (error || !data) return null;

    return data.map((row: any): LandingPage => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      headline: row.headline,
      subheadline: row.subheadline,
      badgeText: row.badge_text,
      regularPrice: row.regular_price,
      offerPrice: row.offer_price,
      saveBadgeText: row.save_badge_text,
      stockRemaining: row.stock_remaining,
      stockSold: row.stock_sold,
      sliderImages: row.slider_images || [],
      features: row.features || [],
      faqs: row.faqs || [],
      scrollingFeatures: row.scrolling_features || [],
      videoTutorialUrl: row.video_tutorial_url,
      activationGuideImages: row.activation_guide_images || [],
      isActive: row.is_active ?? true,
      createdAt: row.created_at || new Date().toISOString(),
      viewsCount: row.views_count || 0,
      conversionsCount: row.conversions_count || 0
    }));
  } catch (e) {
    console.error('fetchCloudLandingPages error:', e);
    return null;
  }
}

export async function upsertCloudLandingPage(lp: LandingPage): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
      id: lp.id,
      slug: lp.slug,
      title: lp.title,
      headline: lp.headline,
      subheadline: lp.subheadline,
      badge_text: lp.badgeText,
      regular_price: lp.regularPrice,
      offer_price: lp.offerPrice,
      save_badge_text: lp.saveBadgeText,
      stock_remaining: lp.stockRemaining,
      stock_sold: lp.stockSold,
      slider_images: lp.sliderImages,
      features: lp.features,
      faqs: lp.faqs,
      scrolling_features: lp.scrollingFeatures,
      video_tutorial_url: lp.videoTutorialUrl,
      activation_guide_images: lp.activationGuideImages,
      views_count: lp.viewsCount,
      conversions_count: lp.conversionsCount,
      is_active: lp.isActive
    };
    const { error } = await sb.from('landing_pages').upsert(row);
    return !error;
  } catch (e) {
    console.error('upsertCloudLandingPage error:', e);
    return false;
  }
}

export async function deleteCloudLandingPage(pageId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('landing_pages').delete().eq('id', pageId);
    return !error;
  } catch (e) {
    console.error('deleteCloudLandingPage error:', e);
    return false;
  }
}

// ================= CLOUD STORE SETTINGS API =================
export async function fetchCloudSettings(): Promise<StoreSettings | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('store_settings').select('*').limit(1).maybeSingle();
    if (error || !data) return null;

    return {
      storeName: data.store_name,
      whatsappNumber: data.whatsapp_number,
      bkashNumber: data.bkash_number,
      nagadNumber: data.nagad_number,
      rocketNumber: data.rocket_number,
      upayNumber: data.upay_number || undefined,
      announcementNotice: data.announcement_notice,
      isNoticeActive: data.is_notice_active,
      adminPasswordHash: data.admin_password_hash,
      resendApiKey: data.resend_api_key,
      senderEmail: data.sender_email,
      autoVerifyEnabled: data.auto_verify_enabled,
      gatewayApiUrl: data.gateway_api_url,
      firebaseProjectId: data.firebase_project_id,
      firebaseApiKey: data.firebase_api_key,
      firestoreCollectionName: data.firestore_collection_name,
      firestoreTrxIdField: data.firestore_trx_id_field,
      firestoreAmountField: data.firestore_amount_field
    };
  } catch (e) {
    console.error('fetchCloudSettings error:', e);
    return null;
  }
}

export async function saveCloudSettings(s: StoreSettings): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
      id: 1,
      store_name: s.storeName,
      whatsapp_number: s.whatsappNumber,
      bkash_number: s.bkashNumber,
      nagad_number: s.nagadNumber,
      rocket_number: s.rocketNumber,
      upay_number: s.upayNumber || null,
      announcement_notice: s.announcementNotice,
      is_notice_active: s.isNoticeActive,
      admin_password_hash: s.adminPasswordHash,
      resend_api_key: s.resendApiKey,
      sender_email: s.senderEmail,
      auto_verify_enabled: s.autoVerifyEnabled,
      gateway_api_url: s.gatewayApiUrl,
      firebase_project_id: s.firebaseProjectId,
      firebase_api_key: s.firebaseApiKey,
      firestore_collection_name: s.firestoreCollectionName,
      firestore_trx_id_field: s.firestoreTrxIdField,
      firestore_amount_field: s.firestoreAmountField,
      updated_at: new Date().toISOString()
    };
    const { error } = await sb.from('store_settings').upsert(row);
    return !error;
  } catch (e) {
    console.error('saveCloudSettings error:', e);
    return false;
  }
}

// ================= SEED INITIAL DATA TO CLOUD =================
export async function seedCloudDatabase(
  products: Product[],
  coupons: Coupon[],
  landingPages: LandingPage[],
  settings: StoreSettings
): Promise<{ success: boolean; count: number; message: string }> {
  const sb = getSupabase();
  if (!sb) return { success: false, count: 0, message: 'Supabase কানেক্টেড নয়।' };

  try {
    let count = 0;

    // 1. Seed Products
    for (const p of products) {
      await upsertCloudProduct(p);
      count++;
    }

    // 2. Seed Coupons
    for (const c of coupons) {
      await upsertCloudCoupon(c);
      count++;
    }

    // 3. Seed Landing Pages
    for (const lp of landingPages) {
      await upsertCloudLandingPage(lp);
      count++;
    }

    // 4. Seed Settings
    await saveCloudSettings(settings);

    return {
      success: true,
      count,
      message: `সফলভাবে ${products.length}টি প্রোডাক্ট, ${coupons.length}টি কুপন এবং ক্যাম্পেইন ল্যান্ডিং পেজ Supabase ক্লাউডে আপলোড করা হয়েছে!`
    };
  } catch (e: any) {
    return { success: false, count: 0, message: `আপলোড ত্রুটি: ${e.message}` };
  }
}
