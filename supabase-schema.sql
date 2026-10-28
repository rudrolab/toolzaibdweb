-- ==========================================================
-- ToolzAi BD Supabase Complete Schema
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  category TEXT NOT NULL,
  category_label TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'Sparkles',
  image_url TEXT,
  current_price NUMERIC,
  original_price NUMERIC,
  price_range JSONB,
  instant_delivery BOOLEAN DEFAULT true,
  discount_percent NUMERIC,
  rating NUMERIC DEFAULT 4.9,
  reviews_count NUMERIC DEFAULT 50,
  is_hot BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  sender_number TEXT,
  trx_id TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  usage_count NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Landing Pages Table
CREATE TABLE IF NOT EXISTS public.landing_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  headline TEXT DEFAULT '',
  subheadline TEXT DEFAULT '',
  badge_text TEXT DEFAULT '',
  regular_price NUMERIC NOT NULL,
  offer_price NUMERIC NOT NULL,
  save_badge_text TEXT DEFAULT '',
  stock_remaining NUMERIC DEFAULT 50,
  stock_sold NUMERIC DEFAULT 1000,
  slider_images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  scrolling_features JSONB DEFAULT '[]'::jsonb,
  video_tutorial_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'ToolzAi BD',
  whatsapp_number TEXT DEFAULT '+8801886822838',
  bkash_number TEXT DEFAULT '01886822838',
  nagad_number TEXT DEFAULT '01886822838',
  rocket_number TEXT DEFAULT '01886822838',
  announcement_notice TEXT DEFAULT '⚡ Instant 5-15 minute delivery operational. bKash & Nagad payments verified 24/7.',
  is_notice_active BOOLEAN DEFAULT true,
  admin_password_hash TEXT DEFAULT 'toolzadmin2026',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables public read and store order submissions
-- ==========================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products, coupons, landing pages, and settings
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public read landing_pages" ON public.landing_pages FOR SELECT USING (true);
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);

-- Allow public to insert orders (customer checkouts)
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own order" ON public.orders FOR SELECT USING (true);

-- Allow full management with Anon Key for store admin
CREATE POLICY "Full manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full manage coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full manage landing_pages" ON public.landing_pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full manage store_settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.landing_pages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
