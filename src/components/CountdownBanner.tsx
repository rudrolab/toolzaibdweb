import React, { useState, useEffect } from 'react';

export const CountdownBanner: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('toolzaibd_countdown');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 208620; // 02d: 09h: 57m: 00s
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
    <div className="w-full py-2.5 px-4 flex items-center justify-center bg-transparent">
      <div className="mixprobd-offer-countdown-bar inline-flex items-center justify-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-white to-[#F0FDF4] border-[1.5px] border-[#86EFAC] shadow-[0_2px_10px_rgba(0,200,83,0.12)]">
        <span className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] tracking-tight">
          Special Offer:
        </span>
        <span className="font-mono text-[12px] sm:text-[13px] font-extrabold text-[#047857] bg-[#E6FCED] px-2.5 py-0.5 rounded-md border border-[#BBF7D0] tracking-wider tabular-nums">
          {pad(days)}d: {pad(hours)}h: {pad(minutes)}m: {pad(seconds)}s
        </span>
      </div>
    </div>
  );
};
