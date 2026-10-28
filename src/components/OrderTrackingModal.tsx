import React, { useState } from 'react';
import { X, Search, PackageCheck, Clock, CheckCircle2, AlertCircle, MessageCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { WHATSAPP_URL } from '../data/products';
import { Order } from '../types';
import { maskPhone, maskEmail, sanitizeInput, checkRateLimit } from '../utils/security';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders = []
}) => {
  const [orderId, setOrderId] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const cleanId = sanitizeInput(orderId).toUpperCase().trim();
    const cleanPhone = sanitizeInput(customerPhone).trim().replace(/[\s-]/g, '');

    if (!cleanId) {
      setSearchError('অনুগ্রহ করে আপনার অর্ডার আইডি (e.g. TZ-123456) প্রদান করুন।');
      return;
    }

    if (!cleanPhone) {
      setSearchError('অনুগ্রহ করে অর্ডার করার সময় ব্যবহৃত মোবাইল নম্বর বা ইমেইল লিখুন।');
      return;
    }

    // Rate-limiting to protect customer privacy and prevent scraping
    const rateCheck = checkRateLimit('order_tracking_lookup', 1500);
    if (!rateCheck.allowed) {
      setSearchError(`অপেক্ষা করুন, আরও ${rateCheck.waitSeconds} সেকেন্ড পর চেষ্টা করুন।`);
      return;
    }

    setSearched(true);

    // Exact two-factor match: Order ID + Phone (or Email)
    const match = orders.find((o) => {
      const idMatch = o.id.toUpperCase() === cleanId;
      const phoneMatch = o.customerPhone.replace(/[\s-]/g, '').endsWith(cleanPhone) ||
                         cleanPhone.endsWith(o.customerPhone.replace(/[\s-]/g, ''));
      const emailMatch = o.customerEmail.toLowerCase().trim() === cleanPhone.toLowerCase().trim();
      return idMatch && (phoneMatch || emailMatch);
    });

    if (match) {
      setTrackedOrder(match);
      setSearchError(null);
    } else {
      setTrackedOrder(null);
      setSearchError('অর্ডার আইডি এবং মোবাইল নম্বর মিলছে না! তথ্য যাচাই করে পুনরায় চেষ্টা করুন।');
    }
  };

  const handleSupportConnect = () => {
    const msg = encodeURIComponent(`Hello ToolzAi BD, I want to verify my order status. Order ID: ${orderId.trim()}, Phone: ${customerPhone.trim()}`);
    window.open(`${WHATSAPP_URL}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl overflow-hidden p-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#E6FCED] border border-[#86EFAC] flex items-center justify-center text-[#00C853] shadow-sm">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-[#0F172A]">Track Order Status</h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Customer Verification
            </p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              অর্ডার নম্বর (Order ID)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. TZ-948215"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-4 py-2 text-xs font-mono font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853] focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              অর্ডারের মোবাইল নম্বর বা ইমেইল
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 017XXXXXXXX or name@gmail.com"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00C853] focus:bg-white"
                required
              />
            </div>
          </div>

          {searchError && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{searchError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#00C853] hover:bg-[#00B248] text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            অর্ডারের বর্তমান অবস্থা দেখুন (Check Status)
          </button>
        </form>

        {searched && trackedOrder && (
          <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-xs">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#86EFAC] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[#0F172A] font-extrabold text-sm">{trackedOrder.id}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    গ্রাহক: {trackedOrder.customerName} ({maskPhone(trackedOrder.customerPhone)})
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                  trackedOrder.status === 'delivered'
                    ? 'bg-[#E6FCED] text-[#15803D] border border-[#86EFAC]'
                    : trackedOrder.status === 'verified'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {trackedOrder.status}
                </span>
              </div>

              {/* Items List */}
              <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 border-b border-slate-100 pb-1">
                  অর্ডারকৃত আইটেম:
                </div>
                {trackedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                    <span className="truncate pr-2 font-medium">{it.title} × {it.quantity}</span>
                    <span className="font-mono font-bold text-slate-800">৳{it.price * it.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-black text-slate-900 border-t border-slate-100 pt-1.5">
                  <span>সর্বমোট পরিশোধ:</span>
                  <span className="text-[#00C853]">৳{trackedOrder.total}</span>
                </div>
              </div>

              <div className="text-slate-500 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00C853]" />
                  {new Date(trackedOrder.createdAt).toLocaleDateString('bn-BD')}
                </span>
                <span className="text-emerald-700 font-semibold">
                  ইমেইল: {maskEmail(trackedOrder.customerEmail)}
                </span>
              </div>
            </div>
          </div>
        )}

        {searched && !trackedOrder && !searchError && (
          <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center">
            <p className="text-slate-600 text-xs mb-3">
              অর্ডারের তথ্য তাৎক্ষণিক পাওয়া যায়নি। সরাসরি WhatsApp সাপোর্টে মেসেজ দিয়ে সহায়তা নিন।
            </p>
            <button
              type="button"
              onClick={handleSupportConnect}
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে যোগাযোগ করুন</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};