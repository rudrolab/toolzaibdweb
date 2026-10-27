import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Clock, Flame } from 'lucide-react';

export const CountdownBanner: React.FC = () => {
  // Initial total seconds: 2 days, 9 hours, 57 mins, 00 secs = 2 * 86400 + 9 * 3600 + 57 * 60 = 172800 + 32400 + 3420 = 208620
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('toolzaibd_countdown');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 208620; // 2d 9h 57m 00s
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev > 0 ? prev - 1 : 208620;
        localStorage.setItem('toolzaibd_countdown', next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-indigo-700 text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-md sticky top-0 z-40 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
          </span>
          <span className="flex items-center gap-1 font-bold text-yellow-300 uppercase tracking-wide text-xs">
            <Flame className="w-4 h-4 fill-yellow-300" />
            Special Flash Offer:
          </span>
          <span className="hidden sm:inline text-white/90">Save up to 96% on Digital Subscriptions & Licenses</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/20">
            <Clock className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-yellow-200">{pad(days)}d</span> :
            <span className="text-yellow-200">{pad(hours)}h</span> :
            <span className="text-yellow-200">{pad(minutes)}m</span> :
            <span className="text-yellow-200">{pad(seconds)}s</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
            <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            <span>Instant Delivery 5-15 Mins</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-xs text-yellow-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Code: TOOLZAI10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
