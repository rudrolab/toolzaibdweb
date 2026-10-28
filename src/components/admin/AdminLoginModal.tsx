import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import {
  hashPassword,
  getAdminLockoutStatus,
  recordAdminFailedAttempt,
  clearAdminLockout
} from '../../utils/security';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminPasswordHash?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  adminPasswordHash = 'toolzadmin2026'
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockout, setLockout] = useState(getAdminLockoutStatus());

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage(null);
      setLockout(getAdminLockoutStatus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout.isLocked) return;

    if (!password.trim()) {
      setErrorMessage('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড লিখুন।');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate slight cryptographic delay to mitigate timing attacks
      await new Promise((r) => setTimeout(r, 400));

      const inputHash = await hashPassword(password.trim());
      const expectedHash = adminPasswordHash.length > 20
        ? adminPasswordHash
        : await hashPassword(adminPasswordHash);

      const isMatch =
        password.trim() === adminPasswordHash ||
        inputHash === expectedHash;

      if (isMatch) {
        clearAdminLockout();
        sessionStorage.setItem('toolzaibd_admin_auth', 'true');
        sessionStorage.setItem('toolzaibd_admin_auth_time', Date.now().toString());
        setIsLoading(false);
        onSuccess();
      } else {
        const result = recordAdminFailedAttempt();
        setLockout(getAdminLockoutStatus());
        setIsLoading(false);

        if (result.isLocked) {
          setErrorMessage(`ভুল পাসওয়ার্ড! ৫ বার ভুল করায় সিকিউরিটির জন্য ৫ মিনিটের জন্য লক করা হয়েছে।`);
        } else {
          setErrorMessage(
            `ভুল পাসওয়ার্ড! আর মাত্র ${result.remainingAttempts} বার চেষ্টা করা যাবে।`
          );
        }
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-black text-xl text-slate-900 tracking-tight">
            অ্যাডমিন সিকিউরিটি গেট
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            ToolzAi BD Management Console Authorization
          </p>
        </div>

        {/* Lockout Warning */}
        {lockout.isLocked && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs animate-shake">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">সিকিউরিটি লকআউট সক্রিয়!</p>
              <p className="mt-0.5 text-red-600">
                একাধিকবার ভুল পাসওয়ার্ড দেওয়ায় অ্যাক্সেস সাময়িকভাবে বন্ধ আছে। প্রায় {lockout.remainingMinutes} মিনিট পর আবার চেষ্টা করুন।
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && !lockout.isLocked && (
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              অ্যাডমিন পাসওয়ার্ড (Admin Password)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={lockout.isLocked || isLoading}
                placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Default Credentials:</span>
            </div>
            <p className="text-slate-500 pl-5">
              Password: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono font-bold">toolzadmin2026</code>
            </p>
            <p className="text-[10px] text-slate-400 pl-5">
              (ড্যাশবোর্ডের Settings থেকে আপনি যেকোনো সময় পাসওয়ার্ড পরিবর্তন করতে পারবেন)
            </p>
          </div>

          <button
            type="submit"
            disabled={lockout.isLocked || isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <span>ড্যাশবোর্ডে লগইন করুন</span>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে ফিরে যান (Back to Store)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
