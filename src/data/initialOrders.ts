import { Order, Coupon, StoreSettings } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'TZ-948215',
    customerName: 'Tanvir Ahmed',
    customerPhone: '01711223344',
    customerEmail: 'tanvir.designer@gmail.com',
    items: [
      { productId: 'canva-pro-1-year', title: 'Canva Pro 1 Year', variantName: '1 Year License', quantity: 1, price: 599 }
    ],
    subtotal: 599,
    discount: 60,
    total: 539,
    paymentMethod: 'bKash Send Money',
    senderNumber: '01711223344',
    trxId: 'BK9X2451A',
    status: 'delivered',
    createdAt: '2026-10-27T19:42:00.000Z',
    notes: 'Canva invite sent to email.'
  },
  {
    id: 'TZ-831920',
    customerName: 'Nayeem Chowdhury',
    customerPhone: '01822334455',
    customerEmail: 'nayeem.dev@outlook.com',
    items: [
      { productId: 'microsoft-365-official', title: 'Microsoft 365 Official', variantName: '1 Year Shared Subscription (5 Devices + 1TB OneDrive)', quantity: 1, price: 499 },
      { productId: 'windows-11-pro', title: 'Windows 11 Pro', variantName: 'Windows 11 Pro Retail Key (1 PC Lifetime)', quantity: 1, price: 899 }
    ],
    subtotal: 1398,
    discount: 140,
    total: 1258,
    paymentMethod: 'Nagad Send Money',
    senderNumber: '01822334455',
    trxId: 'NG771923K',
    status: 'delivered',
    createdAt: '2026-10-27T18:15:00.000Z',
    notes: 'Product key emailed + WhatsApp confirmation.'
  },
  {
    id: 'TZ-762104',
    customerName: 'Fariha Yasmin',
    customerPhone: '01933445566',
    customerEmail: 'fariha.ielts@gmail.com',
    items: [
      { productId: 'duolingo-super-12-month', title: 'Duolingo Super 12 Month', quantity: 1, price: 999 },
      { productId: 'grammarly-premium', title: 'Grammarly Premium', variantName: '6 Months Private Account', quantity: 1, price: 1499 }
    ],
    subtotal: 2498,
    discount: 250,
    total: 2248,
    paymentMethod: 'bKash Send Money',
    senderNumber: '01933445566',
    trxId: 'BK339108M',
    status: 'delivered',
    createdAt: '2026-10-27T16:30:00.000Z'
  },
  {
    id: 'TZ-654912',
    customerName: 'Rafiqul Islam',
    customerPhone: '01655667788',
    customerEmail: 'rafiqul.editor@yahoo.com',
    items: [
      { productId: 'capcut-pro-1-month', title: 'CapCut Pro 1 Month', quantity: 2, price: 599 }
    ],
    subtotal: 1198,
    discount: 0,
    total: 1198,
    paymentMethod: 'Rocket Send Money',
    senderNumber: '01655667788',
    trxId: 'RC990182',
    status: 'verified',
    createdAt: '2026-10-27T20:10:00.000Z'
  },
  {
    id: 'TZ-542190',
    customerName: 'Kazi Mahfuz',
    customerPhone: '01799887766',
    customerEmail: 'mahfuz.ai@gmail.com',
    items: [
      { productId: 'chatgpt-plus', title: 'ChatGPT Plus', variantName: '1 Month Shared Account (4 Person Slot)', quantity: 1, price: 999 },
      { productId: 'google-ai-pro-premium', title: 'Google AI Pro Premium', variantName: '1 Month Gemini Advanced + 2TB Google One', quantity: 1, price: 999 }
    ],
    subtotal: 1998,
    discount: 200,
    total: 1798,
    paymentMethod: 'bKash Send Money',
    senderNumber: '01799887766',
    trxId: 'BK882194P',
    status: 'pending',
    createdAt: '2026-10-27T21:12:00.000Z'
  },
  {
    id: 'TZ-431876',
    customerName: 'Zubair Hossain',
    customerPhone: '01511223388',
    customerEmail: 'zubair.stream@gmail.com',
    items: [
      { productId: 'netflix-premium-12-months', title: 'Netflix Premium 12 Months', quantity: 1, price: 4500 }
    ],
    subtotal: 4500,
    discount: 450,
    total: 4050,
    paymentMethod: 'bKash Send Money',
    senderNumber: '01511223388',
    trxId: 'BK120489Q',
    status: 'delivered',
    createdAt: '2026-10-26T22:05:00.000Z'
  },
  {
    id: 'TZ-320984',
    customerName: 'Tasnim Rahman',
    customerPhone: '01877665544',
    customerEmail: 'tasnim.cad@gmail.com',
    items: [
      { productId: 'autodesk-all-apps-yearly', title: 'Autodesk All Apps Yearly', quantity: 1, price: 999 }
    ],
    subtotal: 999,
    discount: 100,
    total: 899,
    paymentMethod: 'Nagad Send Money',
    senderNumber: '01877665544',
    trxId: 'NG667210',
    status: 'delivered',
    createdAt: '2026-10-26T17:40:00.000Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'TOOLZAI10',
    discountType: 'percent',
    discountValue: 10,
    minSpend: 400,
    isActive: true,
    usageCount: 142
  },
  {
    id: 'c-2',
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minSpend: 500,
    isActive: true,
    usageCount: 89
  },
  {
    id: 'c-3',
    code: 'FLASH20',
    discountType: 'percent',
    discountValue: 20,
    minSpend: 1500,
    isActive: false,
    usageCount: 34
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'ToolzAi BD',
  whatsappNumber: '+8801886822838',
  bkashNumber: '01886822838',
  nagadNumber: '01886822838',
  rocketNumber: '01886822838',
  announcementNotice: '⚡ Instant 5-15 minute delivery operational. bKash & Nagad payments verified 24/7.',
  isNoticeActive: true
};
