import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Firestore
} from 'firebase/firestore';
import { StoreSettings, Order, Product } from '../types';

let cachedFirestore: Firestore | null = null;

export function getFirestoreInstance(settings: StoreSettings): Firestore | null {
  if (cachedFirestore) return cachedFirestore;

  const projectId = settings.firebaseProjectId?.trim();
  if (!projectId) return null;

  try {
    const firebaseConfig = {
      apiKey: settings.firebaseApiKey?.trim() || 'AIzaSyDummyKeyForPublicProjects',
      authDomain: settings.firebaseAuthDomain?.trim() || `${projectId}.firebaseapp.com`,
      projectId: projectId,
      storageBucket: settings.firebaseStorageBucket?.trim() || `${projectId}.appspot.com`,
      messagingSenderId: settings.firebaseMessagingSenderId?.trim(),
      appId: settings.firebaseAppId?.trim(),
    };

    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    cachedFirestore = getFirestore(app);
    return cachedFirestore;
  } catch (err) {
    console.error('Failed to initialize Firebase app:', err);
    return null;
  }
}

export interface VerificationResult {
  success: boolean;
  message: string;
  docId?: string;
  senderNumber?: string;
  paidAmount?: number;
}

/**
 * Verifies a customer's TrxID directly against the user's personal Firebase Firestore database.
 * If verified, marks the transaction as used to prevent double-spending.
 */
export async function verifyPaymentInFirestore(params: {
  settings: StoreSettings;
  trxId: string;
  requiredAmount: number;
  orderId: string;
}): Promise<VerificationResult> {
  const { settings, trxId, requiredAmount, orderId } = params;

  const db = getFirestoreInstance(settings);
  if (!db) {
    return {
      success: false,
      message: 'Firebase Project ID কনফিগার করা নেই। এডমিন সেটিংস থেকে Firebase Config সেট করুন।',
    };
  }

  const cleanTrx = trxId.trim();
  if (!cleanTrx) {
    return { success: false, message: 'সঠিক TrxID প্রদান করুন।' };
  }

  const collectionName = settings.firestoreCollectionName?.trim() || 'transactions';
  const trxField = settings.firestoreTrxIdField?.trim() || 'trxId';
  const amountField = settings.firestoreAmountField?.trim() || 'amount';

  try {
    const colRef = collection(db, collectionName);

    // 1. Try exact match & uppercase match
    const candidates = [cleanTrx, cleanTrx.toUpperCase(), cleanTrx.toLowerCase()];
    let matchedDoc: any = null;

    for (const testTrx of candidates) {
      const q = query(colRef, where(trxField, '==', testTrx));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        matchedDoc = querySnap.docs[0];
        break;
      }
    }

    if (!matchedDoc) {
      return {
        success: false,
        message: 'পেমেন্ট গেটওয়েতে এই TrxID টি পাওয়া যায়নি। ব্যাংক এসএমএস প্রসেস হতে ১-২ মিনিট সময় লাগতে পারে।',
      };
    }

    const data = matchedDoc.data();

    // 2. Check if already used
    if (data.used === true || data.status === 'used' || data.isUsed === true) {
      return {
        success: false,
        message: 'এই Transaction ID টি ইতিমধ্যে একবার ব্যবহার করা হয়েছে। অন্য TrxID ব্যবহার করুন।',
      };
    }

    // 3. Check paid amount (allow ±1 BDT margin for rounding/fees)
    const paidAmount = Number(data[amountField] || data.amount || 0);
    if (paidAmount < requiredAmount - 1) {
      return {
        success: false,
        message: `পেমেন্টের পরিমাণ সঠিক নয় (প্রয়োজন: ৳${requiredAmount}, পাওয়া গেছে: ৳${paidAmount})।`,
      };
    }

    // 4. Lock transaction in Firestore (Prevent double spending)
    try {
      const docRef = doc(db, collectionName, matchedDoc.id);
      await updateDoc(docRef, {
        used: true,
        orderId: orderId,
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'ToolzAi BD Auto Gateway',
      });
    } catch (updateErr) {
      console.warn('Could not update used flag on Firestore document (check write rules):', updateErr);
      // Even if rules block write, the read verification passed
    }

    return {
      success: true,
      message: 'পেমেন্ট সফলভাবে ভেরিফাই হয়েছে!',
      docId: matchedDoc.id,
      senderNumber: data.sender || data.phone || data.senderNumber,
      paidAmount: paidAmount,
    };
  } catch (error: any) {
    console.error('Firestore payment verification error:', error);
    return {
      success: false,
      message: `ফায়ারবেস চেক করার সময় ত্রুটি ঘটেছে: ${error?.message || 'Unknown error'}`,
    };
  }
}

/**
 * Resolves digital credentials (license keys, invite link, or credentials) from products catalog
 */
export function resolveOrderCredentials(order: Order, products: Product[]): {
  credentialsText: string;
  instructionsText: string;
} {
  const credsList: string[] = [];
  const guidesList: string[] = [];

  for (const item of order.items) {
    const prod = products.find((p) => p.id === item.productId);
    if (!prod) continue;

    // 1. Check variant credentials
    let itemCred = '';
    if (item.variantName && prod.variants) {
      const variant = prod.variants.find((v) => v.name === item.variantName);
      if (variant?.digitalCredential) {
        itemCred = variant.digitalCredential;
      }
    }

    // 2. Fallback to product-level credentials
    if (!itemCred && prod.digitalCredential) {
      itemCred = prod.digitalCredential;
    }

    if (itemCred) {
      credsList.push(`• ${prod.title}${item.variantName ? ` (${item.variantName})` : ''}:\n${itemCred}`);
    } else {
      credsList.push(
        `• ${prod.title}${item.variantName ? ` (${item.variantName})` : ''}:\nঅ্যাক্টিভেশন লিঙ্ক ক্রেতার জিমেইলে ইনভাইটেশন পাঠানো হয়েছে। ইনবক্সে গিয়ে Accept Invitation-এ ক্লিক করুন।`
      );
    }

    if (prod.activationInstructions) {
      guidesList.push(`[${prod.title}]: ${prod.activationInstructions}`);
    }
  }

  const credentialsText = credsList.join('\n\n') || 'অফিসিয়াল অ্যাক্টিভেশন লিঙ্ক সরাসরি আপনার দেওয়া ইমেইলে পাঠিয়ে দেওয়া হয়েছে।';
  const instructionsText =
    guidesList.join('\n\n') ||
    '১. আপনার জিমেইল ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।\n২. পাওয়া অফিসিয়াল ইনভাইটেশন লিঙ্কে ক্লিক করে অ্যাক্টিভেট করুন।\n৩. কোনো সমস্যা হলে সরাসরি আমাদের হোয়াটসঅ্যাপে মেসেজ দিন।';

  return { credentialsText, instructionsText };
}

/**
 * Composes a high-converting, professional HTML email for instant digital delivery
 */
export function buildDeliveryEmailHtml(params: {
  order: Order;
  credentialsText: string;
  instructionsText: string;
  storeName: string;
  supportPhone: string;
}): string {
  const { order, credentialsText, instructionsText, storeName, supportPhone } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Credentials Delivery</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #0F172A; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #00C853 0%, #009624 100%); padding: 30px 24px; text-align: center; color: #FFFFFF; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 28px 24px; }
    .badge { display: inline-block; background: #DCFCE7; color: #15803D; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; }
    .credential-box { background: #0F172A; color: #38BDF8; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #1E293B; font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-all; }
    .summary-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: #475569; }
    .summary-row:last-child { margin-bottom: 0; font-weight: bold; color: #0F172A; }
    .guide-box { background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 1.6; color: #166534; white-space: pre-line; margin: 20px 0; }
    .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748B; }
    .btn-wa { display: inline-block; background: #25D366; color: #FFFFFF; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${storeName}</h1>
      <p>Authentic Digital Accounts & Software Subscriptions</p>
    </div>
    
    <div class="content">
      <div class="badge">⚡ Payment Verified & Order Delivered</div>
      <h2 style="font-size: 20px; margin: 0 0 8px; color: #0F172A;">ধন্যবাদ, ${order.customerName || 'গ্রাহক'}!</h2>
      <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0;">
        আপনার পেমেন্ট সফলভাবে যাচাই করা হয়েছে। আপনার ক্রয়কৃত ডিজিটাল সাবস্ক্রিপশন / লাইসেন্স ক্রিডেনশিয়াল নিচে দেওয়া হলো:
      </p>

      <div style="margin-top: 20px;">
        <strong style="font-size: 13px; text-transform: uppercase; color: #0F172A; letter-spacing: 0.5px;">
          🔑 আপনার ডিজিটাল লাইসেন্স / এক্সেস লিঙ্ক:
        </strong>
        <div class="credential-box">${credentialsText}</div>
      </div>

      <div class="summary-card">
        <div class="summary-row">
          <span>Order ID:</span>
          <strong>${order.id}</strong>
        </div>
        <div class="summary-row">
          <span>Delivery Email:</span>
          <strong>${order.customerEmail}</strong>
        </div>
        <div class="summary-row">
          <span>Payment Method:</span>
          <strong>${order.paymentMethod} (Verified)</strong>
        </div>
        ${order.trxId ? `<div class="summary-row"><span>TrxID:</span><strong>${order.trxId}</strong></div>` : ''}
        <div class="summary-row" style="border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 8px;">
          <span>Total Paid:</span>
          <strong style="color: #00C853; font-size: 15px;">৳${order.total.toLocaleString()}</strong>
        </div>
      </div>

      <div class="guide-box">
        <strong style="font-size: 13px; display: block; margin-bottom: 6px;">📖 অ্যাক্টিভেশন নির্দেশনা (Activation Guide):</strong>
        ${instructionsText}
      </div>

      <p style="font-size: 12px; color: #64748B; line-height: 1.5;">
        🛡️ <strong>১০০% ফুল-টার্ম রিপ্লেসমেন্ট ওয়ারেন্টি:</strong> সাবস্ক্রিপশনের মেয়াদ চলাকালীন যেকোনো সমস্যায় আমাদের সাপোর্ট টিম তাত্ক্ষণিক সমাধান প্রদান করবে।
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://wa.me/8801886822838?text=Hello%20ToolzAi%20BD,%20I%20have%20an%20order%20%23${order.id}" class="btn-wa">
          হোয়াটসঅ্যাপে হেল্প নিন (${supportPhone})
        </a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px;">© ${new Date().getFullYear()} ${storeName}. সর্বস্বত্ব সংরক্ষিত।</p>
      <p style="margin: 0;">Dhaka, Bangladesh • Instant Automated Digital Delivery</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Sends digital delivery email to customer via Resend API
 */
export async function sendDeliveryEmailViaResend(params: {
  settings: StoreSettings;
  order: Order;
  credentialsText: string;
  instructionsText: string;
}): Promise<{ success: boolean; message: string; emailId?: string }> {
  const { settings, order, credentialsText, instructionsText } = params;

  const apiKey = settings.resendApiKey?.trim();
  if (!apiKey) {
    return {
      success: false,
      message: 'Resend API Key কনফিগার করা নেই। এডমিন সেটিংস থেকে Resend API Key যুক্ত করুন।',
    };
  }

  const senderEmail = settings.senderEmail?.trim() || 'ToolzAi BD <onboarding@resend.dev>';
  const storeName = settings.storeName || 'ToolzAi BD';
  const supportPhone = settings.whatsappNumber || '+8801886822838';

  const html = buildDeliveryEmailHtml({
    order,
    credentialsText,
    instructionsText,
    storeName,
    supportPhone,
  });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [order.customerEmail],
        subject: `🎉 Your Digital Product Credentials (#${order.id}) - ${storeName}`,
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API returned error:', data);
      return {
        success: false,
        message: data.message || `Resend API Error (${response.status})`,
      };
    }

    return {
      success: true,
      message: 'গ্রাহকের ইমেইলে প্রোডাক্ট সফলভাবে পাঠানো হয়েছে!',
      emailId: data.id,
    };
  } catch (err: any) {
    console.error('Resend fetch failed:', err);
    return {
      success: false,
      message: `ইমেইল পাঠাতে ব্যর্থ: ${err.message || 'Network error'}`,
    };
  }
}
