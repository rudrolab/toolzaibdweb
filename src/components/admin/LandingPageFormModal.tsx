import React, { useState, useEffect } from 'react';
import { X, Trash2, Globe, Image } from 'lucide-react';
import { LandingPage, LandingPageFeature, LandingPageFAQ } from '../../types';

interface LandingPageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  landingPageToEdit?: LandingPage | null;
  onSave: (lp: LandingPage) => void;
}

const PRESET_IMAGES = [
  './products/Google-18-1-pic-lp1024.webp',
  './products/Gemini--lp1024.webp',
  'https://mixprobd.com/wp-content/uploads/2026/10/5-TB--lp1024.webp',
  'https://mixprobd.com/wp-content/uploads/2026/10/Antigravity--lp1024.webp',
  'https://mixprobd.com/wp-content/uploads/2026/10/Google-Flow-lp1024.webp',
  './products/365-1-home-430-q80.webp',
  './products/canva-pro-mix-pro-bd-1-home-430-q80.webp',
];

export const LandingPageFormModal: React.FC<LandingPageFormModalProps> = ({
  isOpen,
  onClose,
  landingPageToEdit,
  onSave,
}) => {
  const isEditing = Boolean(landingPageToEdit);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [badgeText, setBadgeText] = useState('✓ Personal সাবস্ক্রিপশন • Shared নয়');
  const [regularPrice, setRegularPrice] = useState(999);
  const [offerPrice, setOfferPrice] = useState(399);
  const [saveBadgeText, setSaveBadgeText] = useState('সেভ করুন 600+ ৳');
  const [stockRemaining, setStockRemaining] = useState(38);
  const [stockSold, setStockSold] = useState(2002);
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');
  const [features, setFeatures] = useState<LandingPageFeature[]>([]);
  const [faqs, setFaqs] = useState<LandingPageFAQ[]>([]);
  const [videoTutorialUrl, setVideoTutorialUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (landingPageToEdit) {
      setTitle(landingPageToEdit.title);
      setSlug(landingPageToEdit.slug);
      setHeadline(landingPageToEdit.headline);
      setSubheadline(landingPageToEdit.subheadline);
      setBadgeText(landingPageToEdit.badgeText);
      setRegularPrice(landingPageToEdit.regularPrice);
      setOfferPrice(landingPageToEdit.offerPrice);
      setSaveBadgeText(landingPageToEdit.saveBadgeText);
      setStockRemaining(landingPageToEdit.stockRemaining);
      setStockSold(landingPageToEdit.stockSold);
      setSliderImages(landingPageToEdit.sliderImages || []);
      setFeatures(landingPageToEdit.features || []);
      setFaqs(landingPageToEdit.faqs || []);
      setVideoTutorialUrl(landingPageToEdit.videoTutorialUrl || '');
      setIsActive(landingPageToEdit.isActive);
    } else {
      setTitle('Gemini Pro 18 Months Personal');
      setSlug(`gemini-pro-${Date.now().toString().slice(-4)}`);
      setHeadline('Gemini Pro 18 Months Personal');
      setSubheadline(
        'আপনার নিজের Gmail-এ Personal অ্যাক্টিভেশন—কোনো shared account নয়। একবার পেমেন্ট করুন, ইমেইলে পাওয়া লিংক খুলে Activate-এ ক্লিক করুন।'
      );
      setBadgeText('✓ Personal সাবস্ক্রিপশন • Shared নয়');
      setRegularPrice(999);
      setOfferPrice(399);
      setSaveBadgeText('সেভ করুন 600+ ৳');
      setStockRemaining(45);
      setStockSold(1250);
      setSliderImages([
        './products/Google-18-1-pic-lp1024.webp',
        './products/Gemini--lp1024.webp',
      ]);
      setFeatures([
        { icon: '✨', title: 'Gemini 3.1 Pro & 4 Argon', description: 'Google-এর ফ্ল্যাগশিপ মডেল, ২ মিলিয়ন টোকেন মেমরি সহ।' },
        { icon: '☁️', title: '৫TB ক্লাউড স্টোরেজ', description: 'Drive, Gmail ও Photos-এর জন্য বিশাল ৫ টেরাবাইট স্টোরেজ।' },
      ]);
      setFaqs([
        { question: 'এটি কি Personal, নাকি Shared?', answer: 'এটি Personal সাবস্ক্রিপশন, কোনো shared account নয়।' },
        { question: 'অর্ডার ও অ্যাক্টিভেশন কীভাবে করব?', answer: 'ফর্ম পূরণ করে পেমেন্ট করলে সাধারণত ১-৩ মিনিটে ইমেইলে লিংক পাবেন।' }
      ]);
      setVideoTutorialUrl('https://mixprobd.com/wp-content/uploads/2026/10/subscription_order_tutorial.mp4');
      setIsActive(true);
    }
  }, [landingPageToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageInput.trim()) {
      setSliderImages([...sliderImages, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSliderImages(sliderImages.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    setFeatures([
      ...features,
      { icon: '⚡', title: 'New Feature Highlight', description: 'Feature description detail' },
    ]);
  };

  const handleUpdateFeature = (index: number, field: keyof LandingPageFeature, val: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: val };
    setFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: 'New Question?', answer: 'Answer details here.' }]);
  };

  const handleUpdateFaq = (index: number, field: keyof LandingPageFAQ, val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: val };
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');

    const lp: LandingPage = {
      id: landingPageToEdit ? landingPageToEdit.id : `lp-${formattedSlug}-${Date.now().toString().slice(-4)}`,
      slug: formattedSlug,
      title: title.trim(),
      headline: headline.trim() || title.trim(),
      subheadline: subheadline.trim(),
      badgeText: badgeText.trim(),
      regularPrice: Number(regularPrice),
      offerPrice: Number(offerPrice),
      saveBadgeText: saveBadgeText.trim(),
      stockRemaining: Number(stockRemaining),
      stockSold: Number(stockSold),
      sliderImages: sliderImages.length > 0 ? sliderImages : ['./products/Google-18-1-pic-lp1024.webp'],
      scrollingFeatures: landingPageToEdit?.scrollingFeatures || [
        '👑 Owner Account – সম্পূর্ণ নিজের অ্যাকাউন্ট',
        '📧 নিজের Gmail-এ Direct Activation',
        '☁️ 5TB Google Cloud Storage',
        '⚡ 1,000 AI Credits / Month',
      ],
      features,
      faqs,
      videoTutorialUrl: videoTutorialUrl.trim(),
      activationGuideImages: landingPageToEdit?.activationGuideImages || [
        './products/Gmail-Activation-Link-Tutorial.webp',
        './products/Google-One-Activation-Guide-copy.png',
      ],
      isActive,
      createdAt: landingPageToEdit?.createdAt || new Date().toISOString(),
      viewsCount: landingPageToEdit?.viewsCount || 0,
      conversionsCount: landingPageToEdit?.conversionsCount || 0,
    };

    onSave(lp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-[#0F172A]">
                {isEditing ? 'Edit Landing Page Campaign' : 'Create Custom Landing Page Campaign'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Design custom marketing funnels with express checkout, sliders & countdowns.
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
          
          {/* Campaign Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Campaign Name / Internal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gemini Pro 18 Months Offer"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#00C853] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                URL Slug / Identifier *
              </label>
              <div className="flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 focus-within:border-[#00C853] focus-within:bg-white">
                <span className="text-xs text-slate-400 font-mono">/landing/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="gemini-pro-18"
                  className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-[#0F172A] font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Headlines */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Hero Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Gemini Pro 18 Months Personal"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#00C853]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Subheadline / Bengali Pitch
              </label>
              <textarea
                rows={2}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="আপনার নিজের Gmail-এ Personal অ্যাক্টিভেশন..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#00C853]"
              />
            </div>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Pricing & Stock Display
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Offer Price (৳) *</label>
                <input
                  type="number"
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-black text-[#00C853]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Regular Price (৳)</label>
                <input
                  type="number"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Save Badge Text</label>
                <input
                  type="text"
                  value={saveBadgeText}
                  onChange={(e) => setSaveBadgeText(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-bold text-red-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock Left</label>
                <input
                  type="number"
                  value={stockRemaining}
                  onChange={(e) => setStockRemaining(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-bold text-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Slider Images Manager */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Image className="w-4 h-4 text-[#00C853]" />
                Hero Slider Images ({sliderImages.length})
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newImageInput}
                onChange={(e) => setNewImageInput(e.target.value)}
                placeholder="Enter image URL or select preset below..."
                className="flex-1 bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-[#00C853] hover:bg-[#00B248] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Add Image
              </button>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-500">
              <span className="font-semibold">Quick Presets:</span>
              {PRESET_IMAGES.slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSliderImages([...sliderImages, p])}
                  className="bg-white border border-[#CBD5E1] hover:border-[#00C853] px-2 py-0.5 rounded text-[10px] font-mono truncate max-w-[120px]"
                >
                  +{p.split('/').pop()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {sliderImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#CBD5E1] bg-white aspect-video p-1">
                  <img src={img} alt="slide" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded p-1 opacity-80 hover:opacity-100"
                    title="Remove Image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Features Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0F172A]">
                Key Highlight Features ({features.length})
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs text-[#15803D] bg-[#E6FCED] border border-[#86EFAC] px-2.5 py-1 rounded-md font-bold"
              >
                + Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {features.map((f, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2">
                  <input
                    type="text"
                    value={f.icon}
                    onChange={(e) => handleUpdateFeature(idx, 'icon', e.target.value)}
                    className="w-10 text-center bg-white border border-[#CBD5E1] rounded py-1 text-sm"
                  />
                  <input
                    type="text"
                    value={f.title}
                    onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                    placeholder="Feature Title"
                    className="flex-1 bg-white border border-[#CBD5E1] rounded px-2.5 py-1 text-xs font-bold text-[#0F172A]"
                  />
                  <input
                    type="text"
                    value={f.description}
                    onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                    placeholder="Short description"
                    className="flex-1 bg-white border border-[#CBD5E1] rounded px-2.5 py-1 text-xs text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0F172A]">
                FAQ Accordion Items ({faqs.length})
              </label>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs text-[#15803D] bg-[#E6FCED] border border-[#86EFAC] px-2.5 py-1 rounded-md font-bold"
              >
                + Add FAQ
              </button>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                      placeholder="Question"
                      className="flex-1 bg-white border border-[#CBD5E1] rounded px-2.5 py-1 text-xs font-bold text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                    placeholder="Answer details..."
                    className="w-full bg-white border border-[#CBD5E1] rounded px-2.5 py-1 text-xs text-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Publish Status Toggle */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-[#0F172A]">Campaign Status</span>
              <p className="text-[11px] text-slate-500">Enable or disable this landing page</p>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[#00C853] focus:ring-[#00C853]"
              />
              <span className="text-xs font-bold text-[#0F172A]">{isActive ? 'Live & Active' : 'Draft / Off'}</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-slate-600 hover:bg-[#F1F5F9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00C853] hover:bg-[#00B248] text-white text-xs font-black shadow-[0_4px_14px_rgba(0,200,83,0.3)] transition-all active:scale-95"
            >
              {isEditing ? 'Save Campaign' : 'Publish Landing Page'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
