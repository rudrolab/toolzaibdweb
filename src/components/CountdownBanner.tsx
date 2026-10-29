import React, { useState, useEffect } from 'react';

// End of current offer window: fixed target date so it doesn't silently reset
const OFFER_END_TARGET_KEY = 'toolzaibd_offer_end_ts';

function getOrInitOfferEnd(): number {
  try {
    const saved = localStorage.getItem(OFFER_END_TARGET_KEY);
    if (saved) {
      const ts = parseInt(saved, 10);
      if (!isNaN(ts) && ts > Date.now()) return ts;
    }
    // Set a rolling 3-day offer window from first visit
    const end = Date.now() + 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem(OFFER_END_TARGET_KEY, end.toString());
    return end;
  } catch {
    return Date.now() + 3 * 24 * 60 * 60 * 1000;
  }
}

export const CountdownBanner: React.FC = () => {
  const [offerEnd] = useState<number>(getOrInitOfferEnd);
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    Math.max(0, Math.floor((offerEnd - Date.now()) / 1000))
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((offerEnd - Date.now()) / 1000));
      setSecondsLeft(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [offerEnd]);

  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (secondsLeft <= 0) return null;

  return (
    <div className="w-full py-2.5 px-4 flex items-center justify-center bg-transparent">
      <div className="mixprobd-offer-countdown-bar inline-flex items-center justify-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-white to-[#F0FDF4] border-[1.5px] border-[#86EFAC] shadow-[0_2px_10px_rgba(0,200,83,0.12)]">
        <span className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] tracking-tight">
          🔥 Welcome Offer — Extra ১০% ছাড়:
        </span>
        <span className="font-mono text-[12px] sm:text-[13px] font-extrabold text-[#047857] bg-[#E6FCED] px-2.5 py-0.5 rounded-md border border-[#BBF7D0] tracking-wider tabular-nums">
          {pad(days)}d: {pad(hours)}h: {pad(minutes)}m: {pad(seconds)}s
        </span>
      </div>
    </div>
  );
};
