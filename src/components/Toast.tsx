import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-2.5 bg-gray-900 border border-amber-500/40 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white ml-2 p-1 rounded-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
