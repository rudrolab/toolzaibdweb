import { Product } from '../types';

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'microsoft-365-official',
    title: 'Microsoft 365 Official',
    brand: 'Microsoft',
    category: 'office',
    categoryLabel: 'Office & OS',
    rating: 4.9,
    reviewsCount: 384,
    instantDelivery: true,
    discountPercent: 96,
    hasVariants: true,
    priceRange: { min: 499, max: 1899 },
    variants: [
      { id: 'ms365-1y-shared', name: '1 Year Shared Subscription (5 Devices + 1TB OneDrive)', price: 499, originalPrice: 2500, duration: '1 Year', isPopular: true },
      { id: 'ms365-1y-personal', name: '1 Year Personal License (Own Account Renewal)', price: 1199, originalPrice: 5800, duration: '1 Year' },
      { id: 'ms365-family-slot', name: 'Family Group Slot - Lifetime Support', price: 1899, originalPrice: 9500, duration: 'Multi-Year' }
    ],
    tagline: 'Full Microsoft Office suite with 1TB cloud storage & multi-device sync',
    description: 'Get genuine Microsoft 365 with access to Word, Excel, PowerPoint, Outlook, OneNote, and 1TB OneDrive Cloud Storage. Valid on Windows, Mac, Android, and iOS devices with automated instant digital activation.',
    features: [
      'Official Microsoft Account / Activation',
      '1TB OneDrive Cloud Storage Included',
      'Install on up to 5 Devices (PC, Mac, Tablet, Phone)',
      'Always updated with the latest AI Copilot integration',
      'Full replacement guarantee for the duration'
    ],
    specs: [
      { label: 'Delivery', value: 'Instant via Email/WhatsApp (5-15 mins)' },
      { label: 'Validity', value: '1 Year / Lifetime Variants' },
      { label: 'Devices', value: 'Windows, macOS, iOS, Android' },
      { label: 'Warranty', value: '100% Replacement Warranty' }
    ],
    colorTheme: 'from-blue-600 to-indigo-700',
    iconName: 'LayoutGrid',
    imageUrl: './products/365-1-home-430-q80.webp'
  },
  {
    id: 'google-ai-pro-premium',
    title: 'Google AI Pro Premium',
    brand: 'Google AI',
    category: 'ai',
    categoryLabel: 'AI & Tools',
    rating: 4.9,
    reviewsCount: 219,
    instantDelivery: true,
    hasVariants: true,
    priceRange: { min: 999, max: 1999 },
    variants: [
      { id: 'gemini-1m', name: '1 Month Gemini Advanced + 2TB Google One', price: 999, originalPrice: 2400, duration: '1 Month' },
      { id: 'gemini-3m', name: '3 Months Gemini Advanced + 2TB Google One', price: 1999, originalPrice: 5900, duration: '3 Months', isPopular: true }
    ],
    tagline: "Google's most capable AI model (Gemini 2.0 / 1.5 Pro) with 2TB Cloud Storage",
    description: 'Access Gemini Advanced with 1M token context window, deep coding capabilities, audio & multimodal vision, integrated with Docs, Gmail, and 2TB high-speed Google Drive storage.',
    features: [
      'Gemini Advanced 1.5 / 2.0 Pro Access',
      'Includes 2TB Google One Cloud Storage',
      'Integrated with Google Docs, Gmail, Drive & Slides',
      'Private account with personal email activation',
      'Priority access to next-gen reasoning models'
    ],
    specs: [
      { label: 'Delivery', value: 'Instant Digital Access' },
      { label: 'Account Type', value: 'Private / On Your Own Email' },
      { label: 'Cloud Space', value: '2,048 GB (2TB)' },
      { label: 'Warranty', value: 'Full Term Warranty' }
    ],
    colorTheme: 'from-amber-500 to-red-600',
    iconName: 'Sparkles',
    imageUrl: './products/Google-storage-mix-pro-bd-1-home-430-q80.webp'
  },
  {
    id: 'windows-11-pro',
    title: 'Windows 11 Pro',
    brand: 'Windows 11',
    category: 'office',
    categoryLabel: 'Office & OS',
    rating: 4.8,
    reviewsCount: 512,
    instantDelivery: true,
    discountPercent: 50,
    hasVariants: true,
    priceRange: { min: 899, max: 999 },
    variants: [
      { id: 'win11-oem', name: 'OEM Digital License Key (1 PC / Lifetime)', price: 899, originalPrice: 1800, duration: 'Lifetime' },
      { id: 'win11-retail', name: 'Retail Transferable Key (1 PC / Lifetime)', price: 999, originalPrice: 2000, duration: 'Lifetime', isPopular: true }
    ],
    tagline: '100% Genuine Lifetime Retail/OEM License with Official Microsoft Server Bind',
    description: 'Upgrade your Windows experience to genuine Windows 11 Pro. Unlock BitLocker encryption, Windows Sandbox, Remote Desktop, Hyper-V, and full official security updates directly from Microsoft.',
    features: [
      'Lifetime validity on 1 PC',
      'Online activation with Microsoft servers',
      'Supports all languages (English, Bengali, etc.)',
      'Upgrades from Windows 11 Home to Pro seamlessly',
      '32-bit & 64-bit universal compatibility'
    ],
    specs: [
      { label: 'Type', value: 'Original Digital Key' },
      { label: 'Validity', value: 'Lifetime (No monthly fees)' },
      { label: 'Activation', value: 'Online Direct in Settings' },
      { label: 'Delivery', value: 'Instant within 2 minutes' }
    ],
    colorTheme: 'from-blue-500 to-cyan-600',
    iconName: 'Monitor',
    imageUrl: './products/ChatGPT-Image-Jul-22-2026-05_38_49-PM-1-home-430-q80.webp'
  },
  {
    id: 'office-2024-ltsc-pro-plus',
    title: 'Office 2024 LTSC Professional Plus',
    brand: 'Office 2024',
    category: 'office',
    categoryLabel: 'Office & OS',
    rating: 4.7,
    reviewsCount: 167,
    instantDelivery: true,
    discountPercent: 52,
    hasVariants: false,
    originalPrice: 2000,
    currentPrice: 999,
    tagline: 'Latest official release of standalone Microsoft Office 2024 LTSC',
    description: 'Microsoft Office 2024 LTSC Professional Plus includes Word, Excel, PowerPoint, Outlook, Access, and Publisher. One-time payment for lifetime activation on 1 Windows PC.',
    features: [
      'Permanent Lifetime Activation',
      'No annual or monthly renewal fees',
      'Latest 2024 modern UI and Excel performance functions',
      'Full offline functionality support',
      'Direct download link from official Microsoft CDN'
    ],
    specs: [
      { label: 'OS Required', value: 'Windows 10 / Windows 11' },
      { label: 'License Type', value: 'Lifetime Commercial License' },
      { label: 'Delivery', value: 'Instant Key + ISO Guide' }
    ],
    colorTheme: 'from-red-600 to-rose-700',
    iconName: 'FileSpreadsheet',
    imageUrl: './products/office-24-1-home-430-q80.webp'
  },
  {
    id: 'microsoft-2021-office-pro-plus',
    title: 'Microsoft 2021 Office Pro Plus',
    brand: 'Microsoft',
    category: 'office',
    categoryLabel: 'Office & OS',
    rating: 4.7,
    reviewsCount: 420,
    instantDelivery: true,
    discountPercent: 52,
    hasVariants: false,
    originalPrice: 1450,
    currentPrice: 699,
    tagline: 'Permanent digital license for Office 2021 Professional Plus',
    description: 'Lifetime genuine product key for Microsoft Office 2021 Pro Plus. Perfect for students, freelancers, and businesses who want classic Office without recurring subscription costs.',
    features: [
      'Lifetime genuine key for 1 Windows PC',
      'Word, Excel, PowerPoint, Outlook, OneNote, Access, Publisher',
      'Redeems officially via Microsoft setup',
      'Full offline capabilities & updates'
    ],
    specs: [
      { label: 'Validity', value: 'Lifetime' },
      { label: 'Compatibility', value: 'Windows 10 & 11' },
      { label: 'Delivery', value: 'Instant Delivery' }
    ],
    colorTheme: 'from-orange-600 to-amber-700',
    iconName: 'FileText',
    imageUrl: './products/office-2021-opt-430x430.webp'
  },
  {
    id: 'duolingo-super-12-month',
    title: 'Duolingo Super 12 Month',
    brand: 'Duolingo',
    category: 'utilities',
    categoryLabel: 'Education & Learning',
    rating: 4.9,
    reviewsCount: 310,
    instantDelivery: true,
    discountPercent: 60,
    hasVariants: false,
    originalPrice: 2500,
    currentPrice: 999,
    tagline: 'Learn 40+ languages with Unlimited Hearts, Zero Ads, and Practice Hub',
    description: 'Supercharge your language learning journey with Duolingo Super for a full year. Practice without interruptions, fix mistakes with the Practice Hub, and master English, German, French, Spanish, Japanese & more.',
    features: [
      'Unlimited Hearts (never wait to continue)',
      '100% Ad-Free Learning experience',
      'Full access to Mistake Review & Practice Hub',
      'Unlimited legendary challenge attempts',
      'Activated directly onto your existing Duolingo profile'
    ],
    specs: [
      { label: 'Duration', value: '12 Months (1 Full Year)' },
      { label: 'Profile', value: 'Personal existing account' },
      { label: 'Warranty', value: '365 Days Full Replacement' }
    ],
    colorTheme: 'from-emerald-500 to-green-600',
    iconName: 'GraduationCap',
    imageUrl: './products/Duolingo-Super-12-Month-mix-pro-bd-430x430.webp'
  },
  {
    id: 'canva-pro-1-year',
    title: 'Canva Pro 1 Year',
    brand: 'Canva Pro',
    category: 'creative',
    categoryLabel: 'Design & Creative',
    rating: 4.6,
    reviewsCount: 890,
    instantDelivery: true,
    discountPercent: 87,
    hasVariants: false,
    originalPrice: 4590,
    currentPrice: 599,
    tagline: 'Unlock 100M+ premium assets, Brand Kit, Magic Studio AI & background remover',
    description: 'Canva Pro annual membership activated on your own personal email. Unleash unlimited graphic design power with premium stock photos, video editor, one-click background remover, and Magic AI tools.',
    features: [
      '100M+ premium photos, videos, graphics, and audio',
      'One-click Magic Background Remover',
      'Magic Resize for social media posts in seconds',
      'Brand Kits with custom fonts and palettes',
      '1TB cloud storage for all your designs'
    ],
    specs: [
      { label: 'Duration', value: '1 Year Subscription' },
      { label: 'Activation', value: 'Invite to your own email' },
      { label: 'Support', value: 'All devices (Web, App, Tablet)' }
    ],
    colorTheme: 'from-cyan-500 to-blue-600',
    iconName: 'Palette',
    imageUrl: './products/compressed_canva-pro-400x400.webp'
  },
  {
    id: 'truecaller-premium-1-year',
    title: 'Truecaller Premium 1 Year',
    brand: 'Truecaller',
    category: 'utilities',
    categoryLabel: 'Utilities & Security',
    rating: 4.7,
    reviewsCount: 460,
    instantDelivery: true,
    discountPercent: 33,
    isPopular: true,
    hasVariants: false,
    originalPrice: 1500,
    currentPrice: 999,
    tagline: 'Block spam calls, identify unknown callers, and view caller IDs incognito',
    description: 'Official Truecaller Premium 1 Year subscription. Block irritating telemarketers, identify spam SMS & callers, view who viewed your profile, and enjoy ad-free calling experience in Bangladesh.',
    features: [
      'Advanced spam blocking with real-time updates',
      'Who Viewed My Profile & Incognito Mode',
      'Ad-free experience across the whole app',
      'Gold Caller ID badge available',
      'Unlimited contact requests'
    ],
    specs: [
      { label: 'Duration', value: '1 Year' },
      { label: 'OS', value: 'Android & iOS supported' },
      { label: 'Warranty', value: '1 Year Full Warranty' }
    ],
    colorTheme: 'from-blue-600 to-sky-500',
    iconName: 'ShieldCheck',
    imageUrl: './products/compressed_turecaller-1-400x400.webp'
  },
  {
    id: 'autodesk-all-apps-yearly',
    title: 'Autodesk All Apps Yearly',
    brand: 'Autodesk',
    category: 'creative',
    categoryLabel: 'Design & Creative',
    rating: 4.7,
    reviewsCount: 145,
    instantDelivery: true,
    discountPercent: 82,
    hasVariants: true,
    priceRange: { min: 999, max: 2499 },
    variants: [
      { id: 'ad-1y', name: '1 Year Education / Professional License (All 40+ Apps)', price: 999, originalPrice: 5500, duration: '1 Year', isPopular: true },
      { id: 'ad-3y', name: '3 Years Full License (AutoCAD, Revit, 3ds Max, Maya)', price: 2499, originalPrice: 14500, duration: '3 Years' }
    ],
    tagline: 'Access AutoCAD, Revit, 3ds Max, Maya, Fusion 360 & all 40+ Autodesk apps',
    description: 'Get legitimate Autodesk All Apps subscription linked directly to your official Autodesk email account. Download installer files straight from autodesk.com with zero cracks or keygens.',
    features: [
      'Includes AutoCAD, Revit, Maya, 3ds Max, Inventor, Civil 3D',
      'Works on Windows and macOS',
      'Official license registered on Autodesk portal',
      'Cloud credits and cloud rendering privileges'
    ],
    specs: [
      { label: 'Email', value: 'On Your Own Autodesk Email' },
      { label: 'Term', value: '1 Year / 3 Years' },
      { label: 'Delivery', value: 'Instant (15-30 Mins)' }
    ],
    colorTheme: 'from-indigo-600 to-purple-600',
    iconName: 'Box',
    imageUrl: './products/autodesk-opt-430x430.webp'
  },
  {
    id: 'youtube-premium',
    title: 'YouTube Premium',
    brand: 'YouTube Premium',
    category: 'streaming',
    categoryLabel: 'Streaming & Media',
    rating: 4.7,
    reviewsCount: 680,
    instantDelivery: true,
    discountPercent: 60,
    hasVariants: true,
    priceRange: { min: 1699, max: 2999 },
    variants: [
      { id: 'yt-6m', name: '6 Months YouTube Premium (Family Slot / Own Email)', price: 1699, originalPrice: 4200, duration: '6 Months' },
      { id: 'yt-12m', name: '12 Months YouTube Premium (Family Slot / Own Email)', price: 2999, originalPrice: 7500, duration: '12 Months', isPopular: true }
    ],
    tagline: 'Ad-free videos, background play, offline downloads & YouTube Music Premium',
    description: 'Enjoy completely ad-free video watching on phone, smart TV, tablet, and PC. Stream uninterrupted YouTube Music with audio playback in the background or with screen locked.',
    features: [
      'Zero ads on all videos and YouTube Music',
      'Background play while using other apps or screen off',
      'Download videos for offline watching in 1080p / 4K',
      'Full YouTube Music Premium streaming access',
      'Activated on your own personal Gmail ID'
    ],
    specs: [
      { label: 'Type', value: 'Family Group Invitation' },
      { label: 'Account', value: 'Your Own Existing Gmail' },
      { label: 'Warranty', value: 'Duration-matched replacement guarantee' }
    ],
    colorTheme: 'from-red-600 to-red-800',
    iconName: 'PlaySquare',
    imageUrl: './products/compressed_youtube-premium-400x400.webp'
  },
  {
    id: 'notebooklm-pro',
    title: 'NotebookLM Pro',
    brand: 'NotebookLM',
    category: 'ai',
    categoryLabel: 'AI & Tools',
    rating: 4.7,
    reviewsCount: 98,
    instantDelivery: true,
    discountPercent: 25,
    hasVariants: true,
    priceRange: { min: 999, max: 1299 },
    variants: [
      { id: 'nb-1m', name: '1 Month Pro Unlimited Notebook & Audio Overview Access', price: 999, originalPrice: 1350, duration: '1 Month' },
      { id: 'nb-3m', name: '3 Months Pro High-Capacity Study Workspace', price: 1299, originalPrice: 2000, duration: '3 Months', isPopular: true }
    ],
    tagline: "Google's revolutionary AI research assistant & viral Audio Overview generator",
    description: 'Transform complex PDFs, documents, URLs, and notes into interactive discussions and podcast-like Audio Overviews. Powered by Gemini 1.5 Pro with source citations.',
    features: [
      'Create 50+ notebooks with up to 500,000 words each',
      'Generate stunning 2-host audio podcast discussions',
      'Instant synthesis across research papers and textbooks',
      'Verified factual grounding with precise page citations'
    ],
    specs: [
      { label: 'Access', value: 'Private Verified Account' },
      { label: 'Delivery', value: 'Instant 5-10 minutes' }
    ],
    colorTheme: 'from-teal-500 to-cyan-700',
    iconName: 'BookOpen',
    imageUrl: './products/notebooklm-pro-opt-430x430.webp'
  },
  {
    id: 'linkedin-career-premium-3-months',
    title: 'LinkedIn Career Premium 3 Months',
    brand: 'LinkedIn Career',
    category: 'social',
    categoryLabel: 'Professional & Career',
    rating: 4.9,
    reviewsCount: 230,
    instantDelivery: true,
    discountPercent: 25,
    hasVariants: false,
    originalPrice: 2000,
    currentPrice: 1499,
    tagline: 'Get 2.6x more recruiter views, InMail messages, and 21,000+ LinkedIn Learning courses',
    description: 'Supercharge your job search and professional career with LinkedIn Premium Career. Message hiring managers directly with InMail credits, see competitive applicant insights, and stand out with the gold badge.',
    features: [
      '5 InMail credits per month to contact any recruiter',
      'See who viewed your profile over the past 365 days',
      'Competitive insights on other job applicants',
      'Access to 21,000+ LinkedIn Learning video courses',
      'Direct upgrade gift link for your personal LinkedIn'
    ],
    specs: [
      { label: 'Duration', value: '3 Months' },
      { label: 'Account', value: 'Your Own Personal LinkedIn Profile' },
      { label: 'Delivery', value: 'Official Gift Upgrade Link' }
    ],
    colorTheme: 'from-blue-700 to-sky-600',
    iconName: 'Briefcase',
    imageUrl: './products/compressed_Linkedin-Premium-400x400.webp'
  },
  {
    id: 'phone-ads-blocker-lifetime',
    title: 'Phone Ads Blocker Lifetime',
    brand: 'Phone Ads Blocker',
    category: 'utilities',
    categoryLabel: 'Utilities & Security',
    rating: 4.9,
    reviewsCount: 312,
    instantDelivery: true,
    discountPercent: 50,
    hasVariants: false,
    originalPrice: 999,
    currentPrice: 499,
    tagline: 'System-wide ad blocker for Android & iOS: block popups, video ads, trackers',
    description: 'Say goodbye to intrusive mobile ads, malicious popups, and battery-draining tracking cookies across all apps and browsers. Works seamlessly without rooting or jailbreaking.',
    features: [
      'Blocks video ads, banner ads, and popup overlays',
      'Saves 40% mobile data and prolongs battery life',
      'System-wide DNS / VPN based protection',
      'Privacy safeguard against trackers and malware domains',
      'Lifetime license key with one-time setup'
    ],
    specs: [
      { label: 'Platform', value: 'Android & iOS' },
      { label: 'Validity', value: 'Lifetime Unlimited' },
      { label: 'Setup', value: 'Easy 2-minute setup guide' }
    ],
    colorTheme: 'from-emerald-600 to-teal-700',
    iconName: 'ShieldAlert',
    imageUrl: './products/compressed_add-blocker-400x400.webp'
  },
  {
    id: 'amazon-prime-6-months',
    title: 'Amazon Prime 6 Months',
    brand: 'Amazon',
    category: 'streaming',
    categoryLabel: 'Streaming & Media',
    rating: 4.8,
    reviewsCount: 194,
    instantDelivery: true,
    discountPercent: 57,
    hasVariants: false,
    originalPrice: 3500,
    currentPrice: 1499,
    tagline: 'Stream Prime Video in 4K HDR, Prime Gaming rewards & Prime Reading',
    description: 'Get 6 months of Amazon Prime Video streaming. Watch top global movies, blockbuster series (The Boys, Rings of Power, Reacher, Mirzapur), plus Prime Gaming free in-game loot.',
    features: [
      '4K Ultra HD & HDR streaming with Dolby Atmos',
      'Watch on Smart TV, Phone, PC, Tablet, or FireStick',
      'Includes Prime Gaming & Twitch subscriber token',
      'Download shows for offline flight & commute viewing'
    ],
    specs: [
      { label: 'Duration', value: '6 Months' },
      { label: 'Profile', value: 'Personal 1 Screen with PIN Lock' },
      { label: 'Delivery', value: 'Instant Login Credentials' }
    ],
    colorTheme: 'from-sky-500 to-blue-700',
    iconName: 'Tv',
    imageUrl: './products/amazon-prime-opt-430x430.webp'
  },
  {
    id: 'netflix-premium-12-months',
    title: 'Netflix Premium 12 Months',
    brand: 'Netflix Premium',
    category: 'streaming',
    categoryLabel: 'Streaming & Media',
    rating: 4.9,
    reviewsCount: 780,
    instantDelivery: true,
    discountPercent: 70,
    hasVariants: false,
    originalPrice: 15000,
    currentPrice: 4500,
    tagline: '4K Ultra HD 1 Screen with Private PIN code for 1 full year',
    description: 'Watch all your favorite movies, anime, dramas, and Netflix originals in crystal clear 4K Ultra HD with Spatial Audio. Comes with a dedicated private profile protected by your own 4-digit PIN.',
    features: [
      '4K HDR Ultra HD picture quality + Spatial Audio',
      'Dedicated personal profile with custom PIN lock',
      'Supports Smart TV, Android Box, PC, Mobile & iPad',
      'Zero household location error (Anti-household lock system)',
      'Full 365-day replacement warranty guarantee'
    ],
    specs: [
      { label: 'Duration', value: '12 Months (365 Days)' },
      { label: 'Quality', value: '4K UHD HDR' },
      { label: 'Screens', value: '1 Screen Dedicated Profile' },
      { label: 'Warranty', value: '100% Replacement Warranty' }
    ],
    colorTheme: 'from-red-600 to-rose-950',
    iconName: 'Film',
    imageUrl: './products/netflix-premium-12-months-opt-430x430.webp'
  },
  {
    id: 'itunes-gift-card-usa',
    title: 'ITUNES GIFT CARD (USA)',
    brand: 'ITUNES',
    category: 'cards',
    categoryLabel: 'Gift Cards',
    rating: 4.7,
    reviewsCount: 112,
    instantDelivery: true,
    discountPercent: 30,
    hasVariants: true,
    priceRange: { min: 3000, max: 14999 },
    variants: [
      { id: 'itunes-25', name: '$25 USD Apple Gift Card (USA Store)', price: 3000, originalPrice: 4300, duration: 'No Expiry' },
      { id: 'itunes-50', name: '$50 USD Apple Gift Card (USA Store)', price: 6000, originalPrice: 8500, duration: 'No Expiry', isPopular: true },
      { id: 'itunes-100', name: '$100 USD Apple Gift Card (USA Store)', price: 12000, originalPrice: 17000, duration: 'No Expiry' },
      { id: 'itunes-125', name: '$125 USD Apple Gift Card (USA Store)', price: 14999, originalPrice: 21500, duration: 'No Expiry' }
    ],
    tagline: 'Authentic Apple / iTunes Gift Card codes for USA region Apple ID',
    description: 'Redeem directly on your USA Apple ID to purchase apps, subscriptions (iCloud+, Apple Music, Arcade), in-app game purchases (PUBG UC, Genshin, CoD), movies, and books on iOS & Mac.',
    features: [
      '100% authentic scanned digital codes',
      'Redeems directly on App Store / iTunes',
      'Valid for in-app purchases and subscriptions',
      'Permanent balance without expiration dates'
    ],
    specs: [
      { label: 'Region', value: 'United States (USA)' },
      { label: 'Format', value: 'Digital 16-Digit Code' },
      { label: 'Delivery', value: 'Instant via WhatsApp/Email' }
    ],
    colorTheme: 'from-slate-700 to-gray-900',
    iconName: 'CreditCard',
    imageUrl: './products/compressed_apple-gift-card-400x400.webp'
  },
  {
    id: 'follower-service',
    title: 'Follower Service',
    brand: 'Follower',
    category: 'social',
    categoryLabel: 'Social & Growth',
    rating: 4.6,
    reviewsCount: 290,
    instantDelivery: true,
    discountPercent: 30,
    hasVariants: false,
    originalPrice: 500,
    currentPrice: 350,
    tagline: 'High quality non-drop social growth for Facebook Page, Profile & Instagram',
    description: 'Grow your social media presence quickly with real & high retention followers. Safe for pages and personal accounts with gradual natural delivery algorithms.',
    features: [
      '1,000 High-Quality Non-Drop Followers',
      'No password required (only profile/page link needed)',
      'Safe organic drip-feed delivery method',
      '30-day refill guarantee if count drops'
    ],
    specs: [
      { label: 'Platforms', value: 'Facebook / Instagram' },
      { label: 'Safety', value: '100% TOS Compliant' },
      { label: 'Start Time', value: 'Within 1-6 hours' }
    ],
    colorTheme: 'from-pink-600 to-rose-500',
    iconName: 'Users',
    imageUrl: './products/compressed_follower-500x500.webp'
  },
  {
    id: 'meta-verified',
    title: 'Meta Verified',
    brand: 'Meta',
    category: 'social',
    categoryLabel: 'Social & Growth',
    rating: 4.6,
    reviewsCount: 156,
    instantDelivery: false,
    discountPercent: 8,
    hasVariants: true,
    priceRange: { min: 4499, max: 7999 },
    variants: [
      { id: 'meta-fb', name: 'Facebook Blue Badge 1 Month (Full Setup Support)', price: 4499, originalPrice: 4890, duration: '1 Month' },
      { id: 'meta-ig', name: 'Instagram Blue Badge 1 Month (Full Setup Support)', price: 4499, originalPrice: 4890, duration: '1 Month' },
      { id: 'meta-bundle', name: 'Meta Verified Combo (FB + IG Dual Verification)', price: 7999, originalPrice: 9500, duration: '1 Month', isPopular: true }
    ],
    tagline: 'Official Meta Blue Badge verification on Facebook & Instagram with enhanced support',
    description: 'Establish authenticity and gain enhanced proactive account protection with official Meta Verification. Stand out in comments and search with the iconic verified blue tick.',
    features: [
      'Official verified blue checkmark on profile and comments',
      'Proactive identity impersonation protection',
      'Direct access to real human customer support agents',
      'Exclusive stickers and story features'
    ],
    specs: [
      { label: 'Requirement', value: 'Government NID / Passport' },
      { label: 'Assistance', value: '1-on-1 WhatsApp Support' },
      { label: 'Term', value: 'Monthly' }
    ],
    colorTheme: 'from-blue-600 to-indigo-800',
    iconName: 'BadgeCheck',
    imageUrl: './products/compressed_image-20-500x500.webp'
  },
  {
    id: 'capcut-pro-1-month',
    title: 'CapCut Pro 1 Month',
    brand: 'CapCut Pro',
    category: 'creative',
    categoryLabel: 'Design & Creative',
    rating: 4.6,
    reviewsCount: 375,
    instantDelivery: true,
    discountPercent: 8,
    hasVariants: false,
    originalPrice: 650,
    currentPrice: 599,
    tagline: 'Export in 4K 60FPS without watermarks, unlock Pro effects, transitions & AI body tracking',
    description: 'Create viral TikToks, Reels, and YouTube shorts with CapCut Pro. Unlock exclusive AI voice generators, noise reduction, motion blur, and professional color grading LUTs.',
    features: [
      'Pro transitions, auto-captions with custom animation styles',
      'AI portrait cutout, auto-reframe, and slow motion effects',
      'Export up to 4K 60fps with zero watermarks',
      'Works on PC, Mac, Android, and iOS devices'
    ],
    specs: [
      { label: 'Duration', value: '1 Month' },
      { label: 'Platform', value: 'Mobile + Desktop App' },
      { label: 'Delivery', value: 'Instant via Login ID' }
    ],
    colorTheme: 'from-cyan-400 to-indigo-600',
    iconName: 'Video',
    imageUrl: './products/capcut-pro-official-opt-700x700.webp'
  },
  {
    id: 'nanobanana-pro',
    title: 'NanoBanana Pro',
    brand: 'NanoBanana',
    category: 'ai',
    categoryLabel: 'AI & Tools',
    rating: 4.8,
    reviewsCount: 140,
    instantDelivery: true,
    discountPercent: 60,
    hasVariants: false,
    originalPrice: 2500,
    currentPrice: 999,
    tagline: 'High-speed AI automation, prompt engineering & content creation suite',
    description: 'Access the NanoBanana Pro ecosystem for automated marketing copy, graphic generation, social media management, and workflow automation for digital creators.',
    features: [
      'Unlimited high-speed AI content generation credits',
      'Multi-engine synthesis (text, code, image generation)',
      'Export ready-to-publish assets with 1 click',
      'Exclusive Bangladesh priority server node'
    ],
    specs: [
      { label: 'Duration', value: '1 Month Access' },
      { label: 'Access', value: 'Instant Dashboard Login' },
      { label: 'Warranty', value: '30 Days Full Replacement' }
    ],
    colorTheme: 'from-yellow-500 to-amber-600',
    iconName: 'Zap',
    imageUrl: './products/nanobanana-pro-opt-700x700.webp'
  },
  {
    id: 'grammarly-premium',
    title: 'Grammarly Premium',
    brand: 'Grammarly Premium',
    category: 'ai',
    categoryLabel: 'AI & Tools',
    rating: 4.9,
    reviewsCount: 520,
    instantDelivery: true,
    discountPercent: 90,
    hasVariants: true,
    priceRange: { min: 1499, max: 2999 },
    variants: [
      { id: 'gram-6m', name: '6 Months Grammarly Premium (Private Access)', price: 1499, originalPrice: 8500, duration: '6 Months' },
      { id: 'gram-1y', name: '1 Year Grammarly Premium (Own Email Invite / Shared slot)', price: 2999, originalPrice: 18000, duration: '1 Year', isPopular: true }
    ],
    tagline: 'Real-time tone adjustment, plagiarism detection, clarity rewrites & AI grammar correction',
    description: 'Write error-free English emails, research papers, proposals, and essays with Grammarly Premium. Integrates seamlessly into Microsoft Word, Google Docs, Chrome, and your phone keyboard.',
    features: [
      'Advanced grammar, punctuation, and vocabulary enhancement',
      'Tone adjustments and clarity sentence rewrites',
      '16 Billion+ webpage plagiarism checker',
      'Grammarly AI prompt assistant (up to 1,000 monthly prompts)',
      'Works across browser extensions, Word, and mobile apps'
    ],
    specs: [
      { label: 'Term', value: '6 Months / 1 Year' },
      { label: 'Delivery', value: 'Instant Access' },
      { label: 'Support', value: 'Browser, MS Word, Desktop, Mobile' }
    ],
    colorTheme: 'from-emerald-600 to-teal-800',
    iconName: 'CheckCircle2',
    imageUrl: './products/grammarly-pro-opt-700x700.webp'
  },
  {
    id: 'telegram-premium',
    title: 'Telegram Premium',
    brand: 'Telegram Premium',
    category: 'social',
    categoryLabel: 'Social & Growth',
    rating: 4.6,
    reviewsCount: 340,
    instantDelivery: true,
    discountPercent: 33,
    hasVariants: true,
    priceRange: { min: 750, max: 4200 },
    variants: [
      { id: 'tg-3m', name: '3 Months Telegram Premium Gift (On Your Username)', price: 1200, originalPrice: 1800, duration: '3 Months' },
      { id: 'tg-6m', name: '6 Months Telegram Premium Gift (On Your Username)', price: 2250, originalPrice: 3200, duration: '6 Months' },
      { id: 'tg-12m', name: '12 Months Telegram Premium Gift (Official Fragment Gift)', price: 4200, originalPrice: 6200, duration: '1 Year', isPopular: true }
    ],
    tagline: '4GB file uploads, faster download speed, voice-to-text conversion & premium star badge',
    description: 'Official Telegram Premium subscription gifted directly to your @username without sharing passwords. Double all limits: join up to 1,000 channels, create 20 chat folders, and enjoy animated emojis.',
    features: [
      'Upload massive files up to 4 GB each',
      'Maximum download speed with zero throttling',
      'Instant voice-to-text audio message transcription',
      'Exclusive star badge beside your name',
      'Unique emoji reactions and full-screen animations'
    ],
    specs: [
      { label: 'Requirement', value: 'Only Telegram @Username' },
      { label: 'Security', value: 'No password needed' },
      { label: 'Duration', value: '3, 6, or 12 Months' }
    ],
    colorTheme: 'from-sky-500 to-blue-600',
    iconName: 'Send',
    imageUrl: './products/telegram-premium-opt-700x700.webp'
  },
  {
    id: 'international-roaming-sim',
    title: 'International Roaming SIM',
    brand: 'International',
    category: 'utilities',
    categoryLabel: 'Utilities & Security',
    rating: 4.9,
    reviewsCount: 88,
    instantDelivery: false,
    discountPercent: 33,
    isSoldOut: true,
    hasVariants: false,
    originalPrice: 3000,
    currentPrice: 1999,
    tagline: 'Global eSIM / Physical SIM with multi-country roaming and high-speed data',
    description: 'Pre-activated international roaming SIM card for travelers, remote freelancers, and students. Works across 120+ countries including USA, UK, Canada, UAE, Saudi Arabia, and Europe.',
    features: [
      'Works in 120+ countries worldwide',
      'Receive foreign SMS verification codes and OTPs',
      'Instant QR code eSIM delivery',
      'Hotspot and tethering supported'
    ],
    specs: [
      { label: 'Status', value: 'Sold Out (Restocking Soon)' },
      { label: 'Coverage', value: 'Global 120+ countries' }
    ],
    colorTheme: 'from-amber-600 to-orange-700',
    iconName: 'Smartphone',
    imageUrl: './products/international-roaming-opt-700x700.webp'
  },
  {
    id: 'chatgpt-plus',
    title: 'ChatGPT Plus',
    brand: 'ChatGPT Plus',
    category: 'ai',
    categoryLabel: 'AI & Tools',
    rating: 4.7,
    reviewsCount: 1420,
    instantDelivery: false,
    discountPercent: 79,
    isSoldOut: true,
    hasVariants: true,
    priceRange: { min: 499, max: 2500 },
    variants: [
      { id: 'gpt-shared', name: '1 Month Shared Pool (GPT-4o, Canvas, DALL-E 3)', price: 499, originalPrice: 2400, duration: '1 Month' },
      { id: 'gpt-private', name: '1 Month Private Account (On Your Own Email)', price: 2500, originalPrice: 3500, duration: '1 Month', isPopular: true }
    ],
    tagline: 'Official OpenAI GPT-4o, OpenAI o1 reasoning model, Canvas workspace & DALL-E 3',
    description: 'Get world-class AI capability with ChatGPT Plus. Solve complex mathematics, write software, brainstorm business ideas, analyze large documents, and generate ultra-realistic images.',
    features: [
      'Access to GPT-4o, GPT-4, and OpenAI o1 preview',
      'DALL-E 3 image generation directly inside chat',
      'Advanced Data Analysis with Python code execution',
      'Canvas interactive coding and writing tool',
      'Faster response times during peak hours'
    ],
    specs: [
      { label: 'Status', value: 'Sold Out (Batch filling up)' },
      { label: 'Type', value: 'Shared & Private Options' }
    ],
    colorTheme: 'from-emerald-600 to-teal-800',
    iconName: 'Bot',
    imageUrl: './products/compressed_gpt-plus-scaled-1-500x500.webp'
  },
  {
    id: 'supergrok-ai',
    title: 'SuperGrok AI',
    brand: 'SuperGrok',
    category: 'ai',
    categoryLabel: 'AI & Tools',
    rating: 4.9,
    reviewsCount: 165,
    instantDelivery: false,
    discountPercent: 76,
    isSoldOut: true,
    hasVariants: true,
    priceRange: { min: 499, max: 999 },
    variants: [
      { id: 'grok-shared', name: '1 Month Grok 2 Shared Access', price: 499, originalPrice: 2000, duration: '1 Month' },
      { id: 'grok-private', name: '1 Month Grok 2 Private Subscription', price: 999, originalPrice: 3800, duration: '1 Month', isPopular: true }
    ],
    tagline: 'xAI Grok 2 model with real-time X / Twitter search & uncensored FLUX image generation',
    description: 'Access Elon Musk’s xAI Grok 2 platform. Features up-to-the-minute real-world data from X, lightning-fast reasoning, and uncensored FLUX.1 generative image synthesis.',
    features: [
      'Real-time information access via X platform stream',
      'FLUX.1 image generation built-in',
      'Unrestricted conversational depth with fun / normal mode',
      'Deep research and coding capability'
    ],
    specs: [
      { label: 'Status', value: 'Sold Out' },
      { label: 'Provider', value: 'xAI' }
    ],
    colorTheme: 'from-zinc-700 to-neutral-900',
    iconName: 'Cpu',
    imageUrl: './products/supergrok-ai-opt-700x700.webp'
  },
  {
    id: 'meet-premium-3-month',
    title: 'Meet Premium 3 Month',
    brand: 'Meet',
    category: 'office',
    categoryLabel: 'Office & OS',
    rating: 4.9,
    reviewsCount: 188,
    instantDelivery: true,
    discountPercent: 87,
    hasVariants: false,
    originalPrice: 4500,
    currentPrice: 599,
    tagline: 'Up to 24-hour meetings, 250 participants, in-call recording & noise cancellation',
    description: 'Google Meet Premium allows you to conduct professional business meetings, webinars, and online classes without the 60-minute cutoff limit. Records calls directly to Google Drive.',
    features: [
      'Longer group calls up to 24 hours continuously',
      'Host meetings with up to 250 active participants',
      'Cloud meeting recording directly to Google Drive',
      'AI background noise cancellation for crystal clear voice',
      'Breakout rooms, polls, and Q&A interactive tools'
    ],
    specs: [
      { label: 'Duration', value: '3 Months' },
      { label: 'Account', value: 'Google Workspace activation' },
      { label: 'Delivery', value: 'Instant Delivery' }
    ],
    colorTheme: 'from-green-600 to-emerald-800',
    iconName: 'Video',
    imageUrl: './products/meet-premium-3-month-opt-700x700.webp'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'Grid' },
  { id: 'ai', label: 'AI & Tools', icon: 'Sparkles' },
  { id: 'office', label: 'Office & OS', icon: 'Monitor' },
  { id: 'creative', label: 'Design & Creative', icon: 'Palette' },
  { id: 'streaming', label: 'Streaming & Media', icon: 'Tv' },
  { id: 'utilities', label: 'Utilities & Security', icon: 'ShieldCheck' },
  { id: 'social', label: 'Social & Growth', icon: 'Users' },
  { id: 'cards', label: 'Gift Cards', icon: 'CreditCard' },
];

export const BANGLADESH_PAYMENTS = [
  { id: 'bkash', name: 'bKash', number: '01886822838', type: 'Personal (Send Money / Cash Out)', fee: '0%', color: '#E2136E', logoText: 'bKash' },
  { id: 'nagad', name: 'Nagad', number: '01886822838', type: 'Personal (Send Money)', fee: '0%', color: '#F7941D', logoText: 'Nagad' },
  { id: 'rocket', name: 'Rocket', number: '01886822838-8', type: 'Personal (Send Money)', fee: '0%', color: '#8C3494', logoText: 'Rocket' },
  { id: 'upay', name: 'Upay', number: '01886822838', type: 'Personal (Send Money)', fee: '0%', color: '#0072BC', logoText: 'Upay' },
  { id: 'crypto', name: 'USDT (Binance)', address: 'TPq3x98a...TRC20 (Ask on WA)', type: 'TRC20 / BEP20', fee: '0%', color: '#F3BA2F', logoText: 'Binance' },
];

export const WHATSAPP_NUMBER = '8801886822838';
export const WHATSAPP_URL = 'https://wa.me/8801886822838';
