import React from 'react';
import { MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';
import { getWhatsAppUrl } from '../utils/paymentHelpers';

interface FloatingWhatsAppProps {
  settings?: StoreSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const whatsappUrl = getWhatsAppUrl(settings?.whatsappNumber);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
      aria-label="Chat with ToolzAi BD on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        WhatsApp Order
      </span>
      <span className="flex h-2.5 w-2.5 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
    </a>
  );
};
