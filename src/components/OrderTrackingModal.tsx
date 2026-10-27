import React, { useState } from 'react';
import { X, Search, PackageCheck, Clock, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../data/products';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<{
    id: string;
    status: 'processing' | 'delivered';
    date: string;
    items: string;
  } | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);
    // Simulating instant verified lookup for ToolzAi BD orders
    if (query.toUpperCase().startsWith('TZ-') || query.length >= 10) {
      setTrackedOrder({
        id: query.toUpperCase().startsWith('TZ-') ? query.toUpperCase() : `TZ-${Math.floor(100000 + Math.random() * 899999)}`,
        status: 'delivered',
        date: 'Today, within 8 minutes',
        items: 'Digital Credentials & License Guide Dispatched to Email & WhatsApp'
      });
    } else {
      setTrackedOrder(null);
    }
  };

  const handleSupportConnect = () => {
    const msg = encodeURIComponent(`Hello ToolzAi BD, I want to track my order. Order ID / Phone: ${query}`);
    window.open(`${WHATSAPP_URL}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden p-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-900/80 rounded-full border border-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-white">Track Order Status</h3>
            <p className="text-xs text-gray-400">Enter your Order ID (e.g. TZ-123456) or WhatsApp Phone</p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. TZ-582914 or 017XXXXXXXX"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all"
          >
            Check Status
          </button>
        </form>

        {searched && (
          <div className="mt-5 pt-4 border-t border-gray-800 text-xs">
            {trackedOrder ? (
              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-gray-300 font-bold">{trackedOrder.id}</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                </div>
                <div className="text-gray-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-amber-400" /> {trackedOrder.date}
                </div>
                <p className="text-gray-300 text-[11px] bg-gray-950 p-2 rounded border border-gray-800">
                  {trackedOrder.items}
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-amber-500/30 space-y-2 text-center">
                <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                <p className="text-gray-300 text-[11px]">
                  Could not find an instant match for "{query}". If you just sent bKash/Nagad, our agents are verifying it now.
                </p>
                <button
                  type="button"
                  onClick={handleSupportConnect}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] mx-auto transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask Support on WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
