import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles, Image, Layers } from 'lucide-react';
import { Product, ProductVariant } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (product: Product) => void;
}

const CATEGORY_OPTIONS = [
  { id: 'ai', label: 'AI Tools', categoryLabel: 'AI & Tools' },
  { id: 'office', label: 'Microsoft & Office', categoryLabel: 'Office & OS' },
  { id: 'creative', label: 'Design & Video', categoryLabel: 'Design & Video' },
  { id: 'streaming', label: 'Streaming', categoryLabel: 'Entertainment' },
  { id: 'utilities', label: 'Utilities', categoryLabel: 'Utilities & Education' },
  { id: 'social', label: 'Social & Growth', categoryLabel: 'Social & Marketing' },
  { id: 'cards', label: 'Gift Cards', categoryLabel: 'Gift Cards' },
] as const;

// Preset authentic images available in store
const PRESET_IMAGES = [
  { label: 'Microsoft 365', path: './products/365-1-home-430-q80.webp' },
  { label: 'Google AI Pro', path: './products/Google-storage-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Windows 11 Pro', path: './products/Windows-11-Pro-Mix-pro-bd-home-430-q80.webp' },
  { label: 'Office 2024 LTSC', path: './products/Office-2024-mix-pro-bd-home-430-q80.webp' },
  { label: 'Office 2021 Pro Plus', path: './products/Office-2021-Mix-pro-bd-home-430-q80.webp' },
  { label: 'Duolingo Super', path: './products/Duolingo-Super-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Canva Pro', path: './products/canva-pro-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Truecaller Premium', path: './products/Truecaller-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Autodesk All Apps', path: './products/Autodesk-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'YouTube Premium', path: './products/Youtube-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'NotebookLM Pro', path: './products/NotebookLM-Pro-mix-pro-bd-home-430-q80.webp' },
  { label: 'LinkedIn Career', path: './products/Linkdin-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Phone Ads Blocker', path: './products/Phone-Ads-Blocker-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Amazon Prime', path: './products/Amazon-prime-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Netflix Premium', path: './products/Netflix-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'iTunes Gift Card', path: './products/iTunes-Gift-Card-USA-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Follower Service', path: './products/Follower-Service-mix-pro-bd-home-430-q80.webp' },
  { label: 'Meta Verified', path: './products/Meta-Verified-mix-pro-bd-home-430-q80.webp' },
  { label: 'CapCut Pro', path: './products/Capcut-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'NanoBanana Pro', path: './products/NanoBanana-mix-pro-bd-home-430-q80.webp' },
  { label: 'Grammarly Premium', path: './products/Grammarly-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'Telegram Premium', path: './products/Telegram-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'International SIM', path: './products/International-Roaming-SIM-mix-pro-bd-home-430-q80.webp' },
  { label: 'ChatGPT Plus', path: './products/Chatgpt-mix-pro-bd-1-home-430-q80.webp' },
  { label: 'SuperGrok AI', path: './products/SuperGrok-AI-mix-pro-bd-home-430-q80.webp' },
  { label: 'Google Meet Premium', path: './products/Google-Meet-mix-pro-bd-home-430-q80.webp' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}) => {
  const isEditing = Boolean(productToEdit);

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<'office' | 'ai' | 'creative' | 'streaming' | 'utilities' | 'social' | 'cards'>('ai');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(4.9);
  const [reviewsCount, setReviewsCount] = useState(120);
  const [instantDelivery, setInstantDelivery] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);

  // Pricing mode: single price vs variants
  const [hasVariants, setHasVariants] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(999);
  const [originalPrice, setOriginalPrice] = useState<number>(2000);
  const [discountPercent, setDiscountPercent] = useState<number>(50);

  // Variants list
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Features list
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  // Digital delivery & Credentials Vault
  const [digitalCredential, setDigitalCredential] = useState('');
  const [activationInstructions, setActivationInstructions] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setBrand(productToEdit.brand);
      setCategory(productToEdit.category);
      setTagline(productToEdit.tagline || '');
      setDescription(productToEdit.description || '');
      setImageUrl(productToEdit.imageUrl || '');
      setRating(productToEdit.rating || 4.9);
      setReviewsCount(productToEdit.reviewsCount || 100);
      setInstantDelivery(productToEdit.instantDelivery ?? true);
      setIsPopular(productToEdit.isPopular ?? false);
      setIsSoldOut(productToEdit.isSoldOut ?? false);
      setHasVariants(productToEdit.hasVariants ?? false);
      setCurrentPrice(productToEdit.currentPrice || (productToEdit.priceRange ? productToEdit.priceRange.min : 999));
      setOriginalPrice(productToEdit.originalPrice || 2000);
      setDiscountPercent(productToEdit.discountPercent || 50);
      setVariants(productToEdit.variants || []);
      setFeatures(productToEdit.features || []);
      setDigitalCredential(productToEdit.digitalCredential || '');
      setActivationInstructions(productToEdit.activationInstructions || '');
    } else {
      // Default new product values
      setTitle('');
      setBrand('ToolzAi');
      setCategory('ai');
      setTagline('Authentic digital subscription with instant delivery');
      setDescription('Genuine account credentials or official activation link sent directly to email and WhatsApp.');
      setImageUrl('./products/Google-storage-mix-pro-bd-1-home-430-q80.webp');
      setRating(4.9);
      setReviewsCount(150);
      setInstantDelivery(true);
      setIsPopular(false);
      setIsSoldOut(false);
      setHasVariants(false);
      setCurrentPrice(999);
      setOriginalPrice(2000);
      setDiscountPercent(50);
      setDigitalCredential('');
      setActivationInstructions('১. আপনার জিমেইল ইনবক্স চেক করে এক্টিভেশন লিঙ্কে ক্লিক করুন।\n২. পার্সোনাল একাউন্টে লগিন করে অ্যাক্টিভেশন নিশ্চিত করুন।\n৩. কোনো সহায়তার প্রয়োজন হলে হোয়াটসঅ্যাপে অর্ডার আইডি লিখে মেসেজ দিন।');
      setVariants([
        { id: 'v-1', name: '1 Month Subscription', price: 999, originalPrice: 2000, duration: '1 Month', isPopular: true },
        { id: 'v-2', name: '3 Months Subscription', price: 2499, originalPrice: 5000, duration: '3 Months' },
      ]);
      setFeatures([
        'Instant Automated Delivery (5-15 mins)',
        '100% Replacement Warranty Included',
        'Official Account / Legitimate License'
      ]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddVariant = () => {
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      name: 'New Option / Plan',
      price: 999,
      originalPrice: 1999,
      duration: '1 Month',
      isPopular: false,
    };
    setVariants([...variants, newV]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCatInfo = CATEGORY_OPTIONS.find((c) => c.id === category) || CATEGORY_OPTIONS[0];

    // Calculate price range if variants exist
    let priceRange: { min: number; max: number } | undefined = undefined;
    if (hasVariants && variants.length > 0) {
      const prices = variants.map((v) => v.price);
      priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }

    const calculatedDiscount = originalPrice && currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : discountPercent;

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `tz-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      brand: brand.trim() || 'ToolzAi',
      category,
      categoryLabel: selectedCatInfo.categoryLabel,
      rating: Number(rating),
      reviewsCount: Number(reviewsCount),
      instantDelivery,
      isPopular,
      isSoldOut,
      hasVariants,
      priceRange,
      originalPrice: Number(originalPrice),
      currentPrice: Number(currentPrice),
      discountPercent: calculatedDiscount,
      variants: hasVariants ? variants : undefined,
      tagline: tagline.trim(),
      description: description.trim(),
      features: features.length > 0 ? features : ['100% Replacement Warranty', 'Instant Delivery'],
      specs: [
        { label: 'Delivery', value: 'Instant via Email/WhatsApp (5-15 mins)' },
        { label: 'Validity', value: hasVariants && variants[0]?.duration ? variants[0].duration : 'Subscription Duration' },
        { label: 'Warranty', value: '100% Replacement Warranty' }
      ],
      colorTheme: 'from-emerald-500 to-teal-700',
      iconName: 'Zap',
      imageUrl: imageUrl.trim() || './products/Google-storage-mix-pro-bd-1-home-430-q80.webp',
      digitalCredential: digitalCredential.trim() || undefined,
      activationInstructions: activationInstructions.trim() || undefined,
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-[#0F172A]">
                {isEditing ? 'Update Product Details' : 'Post / Add New Product'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Changes will instantly reflect in the live store and catalog.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Basic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ChatGPT Plus Official or Microsoft 365"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#00C853] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Brand / Developer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. OpenAI, Microsoft, Canva, Adobe"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853] focus:bg-white cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.categoryLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tagline & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Short Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Full suite with 1TB cloud storage & multi-device sync"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Full Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed explanation of the subscription, instructions, and warranty..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853]"
              />
            </div>
          </div>

          {/* Image Selection */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Image className="w-4 h-4 text-[#00C853]" />
                Product Image (Choose Preset or Enter Path)
              </label>
              {imageUrl && (
                <div className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] p-0.5 overflow-hidden flex-shrink-0">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs text-[#0F172A] cursor-pointer"
                >
                  <option value="">-- Select Preset Authentic Image --</option>
                  {PRESET_IMAGES.map((p, idx) => (
                    <option key={idx} value={p.path}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or enter custom URL/path"
                  className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs text-[#0F172A]"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Variants Controls */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#00C853]" />
                  Pricing Configuration
                </h4>
                <p className="text-[11px] text-slate-500">
                  Choose between a single price or multiple duration packages.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#CBD5E1] shadow-sm">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="rounded text-[#00C853] focus:ring-[#00C853]"
                />
                <span className="text-xs font-bold text-[#0F172A]">Multiple Variants</span>
              </label>
            </div>

            {hasVariants ? (
              /* Variants dynamic list */
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Product Packages ({variants.length})</span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="flex items-center gap-1 text-xs bg-[#E6FCED] text-[#15803D] hover:bg-[#DCFCE7] border border-[#86EFAC] px-2.5 py-1 rounded-md font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Plan
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div key={v.id || idx} className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex flex-wrap items-center gap-2 shadow-sm">
                      <div className="flex-1 min-w-[160px]">
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                          placeholder="Variant Name"
                          className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2.5 py-1 text-xs text-[#0F172A]"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                          placeholder="Price (৳)"
                          className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1 text-xs text-[#00C853] font-bold"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          value={v.originalPrice || ''}
                          onChange={(e) => handleUpdateVariant(idx, 'originalPrice', Number(e.target.value))}
                          placeholder="Original (৳)"
                          className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1 text-xs text-slate-400"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          value={v.duration || ''}
                          onChange={(e) => handleUpdateVariant(idx, 'duration', e.target.value)}
                          placeholder="Duration"
                          className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1 text-xs text-slate-600"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove Variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Single Price Inputs */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Selling Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs sm:text-sm font-black text-[#00C853]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Discount % Badge
                  </label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-red-600 font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Badges and Stock Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0F172A]">
              <input
                type="checkbox"
                checked={instantDelivery}
                onChange={(e) => setInstantDelivery(e.target.checked)}
                className="rounded text-[#00C853] focus:ring-[#00C853]"
              />
              <span>⚡ Instant Delivery</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0F172A]">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>🔥 Most Popular</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-red-600">
              <input
                type="checkbox"
                checked={isSoldOut}
                onChange={(e) => setIsSoldOut(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span>🚫 Mark Sold Out</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Rating:</span>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-16 bg-white border border-[#CBD5E1] rounded px-2 py-0.5 text-xs text-[#0F172A] font-bold"
              />
            </div>
          </div>

          {/* Features Tag Builder */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#0F172A]">
              Key Highlights & Features
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. 1TB Cloud Storage Included"
                className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-[#00C853] hover:bg-[#00B248] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {features.map((feat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-white border border-[#CBD5E1] px-2.5 py-1 rounded-lg text-xs text-slate-700 shadow-sm"
                >
                  <Check className="w-3 h-3 text-[#00C853]" />
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* ⚡ Automated Digital Delivery & Credentials Vault */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0FDF4] to-[#F8FAFC] border border-[#86EFAC] space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853] font-black text-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0F172A]">
                  Automated Email Delivery Credentials (অটোমেটেড ইমেইল ডেলিভারি তথ্য)
                </h4>
                <p className="text-[11px] text-slate-500">
                  পেমেন্ট সফল হলে গ্রাহকের জিমেইলে স্বয়ংক্রিয়ভাবে নিচের লাইসেন্স কী বা ইনভাইট লিংক চলে যাবে।
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1">
                🔑 Digital License Key / Invite Link / Account Credentials:
              </label>
              <textarea
                rows={3}
                value={digitalCredential}
                onChange={(e) => setDigitalCredential(e.target.value)}
                placeholder="উদাহরণ: https://canva.com/brand/join?invite=XYZ... অথবা License: W269N-WFGWX-YVC9B... অথবা ID/Password"
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#00C853]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1">
                📖 Step-by-Step Activation Instructions (ইমেইলে প্রদর্শিত নির্দেশিকা):
              </label>
              <textarea
                rows={2}
                value={activationInstructions}
                onChange={(e) => setActivationInstructions(e.target.value)}
                placeholder="১. লিঙ্কে ক্লিক করে আপনার জিমেইলে জয়েন করুন। ২. ইনস্ট্যান্ট অ্যাক্টিভেশন নিশ্চিত হবে।"
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853]"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-slate-600 hover:bg-[#F1F5F9] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00C853] hover:bg-[#00B248] text-white text-xs font-black shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all active:scale-95"
            >
              {isEditing ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
