import React, { useState } from 'react';
import { X, MessageCircle, Clock, Zap } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateNotes: (orderId: string, notes: string) => void;
  onSendDeliveryEmail?: (order: Order) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onSendDeliveryEmail,
}) => {
  if (!order) return null;

  const [notes, setNotes] = useState(order.notes || '');

  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '৳';
  };

  const handleSaveNotes = () => {
    onUpdateNotes(order.id, notes);
  };

  const handleOpenWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hello ${order.customerName}, regarding your ToolzAi BD Order #${order.id} for ${order.items.map(i => i.title).join(', ')}...`
    );
    // If the customer provided a valid 11-digit BD number, link directly
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-black text-[#0F172A]">
                {order.id}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 text-[#15803D]'
                    : order.status === 'verified'
                    ? 'bg-blue-100 text-blue-700'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Placed on: {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Customer & Delivery Information */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Customer Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Customer Name</span>
                <span className="font-bold text-[#0F172A] text-sm">{order.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">WhatsApp Mobile</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-[#0F172A]">{order.customerPhone}</span>
                  <button
                    onClick={handleOpenWhatsAppChat}
                    className="inline-flex items-center gap-1 bg-[#25D366] text-white px-2 py-0.5 rounded text-[10.5px] font-bold shadow-sm"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Chat
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Delivery Email</span>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="font-mono font-medium text-slate-700">{order.customerEmail}</span>
                  {onSendDeliveryEmail && (
                    <button
                      type="button"
                      onClick={() => onSendDeliveryEmail(order)}
                      className="inline-flex items-center gap-1.5 bg-[#00C853] hover:bg-[#00B248] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Send Credentials Email</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Ordered Items ({order.items.length})
            </h4>
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0]">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-[#0F172A]">{item.title}</h5>
                    {item.variantName && (
                      <span className="text-[11px] text-[#00C853] font-medium block">
                        {item.variantName}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Qty: {item.quantity} × {formatPrice(item.price)}</span>
                    <div className="font-black text-[#0F172A]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#15803D] font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-[#0F172A] pt-1 border-t border-[#E2E8F0]">
                <span>Total Amount:</span>
                <span className="text-[#00C853] text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Payment Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Method</span>
                <span className="font-bold text-[#0F172A]">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sender Number</span>
                <span className="font-mono font-bold text-[#0F172A]">{order.senderNumber || 'Direct Transfer'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Transaction ID (TrxID)</span>
                <span className="font-mono font-bold text-[#00C853]">{order.trxId || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Order Status Changer */}
          <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] space-y-3">
            <label className="block text-xs font-bold text-[#0F172A]">
              Update Order Status:
            </label>
            <div className="flex flex-wrap gap-2">
              {(['pending', 'verified', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateStatus(order.id, st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
                    order.status === st
                      ? 'bg-[#00C853] text-white shadow-sm'
                      : 'bg-[#F8FAFC] border border-[#CBD5E1] text-slate-600 hover:bg-[#F1F5F9]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Internal Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#0F172A]">
              Internal Fulfillment Notes / Activation Keys
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Sent license key: W269N-WFGWX-YVC9B... on WhatsApp"
                className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A]"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="bg-[#00C853] hover:bg-[#00B248] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                Save
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
