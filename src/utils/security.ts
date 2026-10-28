/**
 * Security and sanitization utilities for ToolzAi BD
 * Production hardening: XSS defense, input validation, rate limiting, and cryptographic hashing.
 */

// 1. Cryptographic Password Hashing using native Web Crypto API
export async function hashPassword(plainText: string): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    // Fallback simple checksum if Web Crypto not available (e.g. very old test runners)
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = (hash << 5) - hash + plainText.charCodeAt(i);
      hash |= 0;
    }
    return 'fb_' + Math.abs(hash).toString(16);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode('toolzaibd_salt_2026_' + plainText);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 2. Input Sanitization (strips HTML, script tags, event handlers)
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // remove angle brackets
    .replace(/javascript:/gi, '') // remove javascript: URI
    .replace(/on\w+=/gi, '') // remove inline events e.g. onclick=
    .trim();
}

// 3. Bangladeshi Phone Number Validation (013-019, 11 digits, with optional +88 / 88)
export function isValidBDPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
  return bdPhoneRegex.test(cleaned);
}

// Format BD Phone to standard 01XXXXXXXXX
export function normalizeBDPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  const match = cleaned.match(/(01[3-9]\d{8})$/);
  return match ? match[1] : cleaned;
}

// 4. Email Validation (RFC 5322 compatible regex)
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// 5. Transaction ID Validation (Alphanumeric, 6-20 chars)
export function isValidTrxId(trxId: string): boolean {
  if (!trxId) return false;
  const cleaned = trxId.trim();
  return /^[A-Za-z0-9]{6,20}$/.test(cleaned);
}

// 6. Anti-Spam Honeypot Checker
export function isSpamSubmission(honeypotValue?: string): boolean {
  return Boolean(honeypotValue && honeypotValue.trim().length > 0);
}

// 7. Client-side Action Rate Limiter (Cooldown in milliseconds)
const rateLimitMap: Record<string, number> = {};

export function checkRateLimit(actionKey: string, cooldownMs: number = 3000): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const lastAction = rateLimitMap[actionKey];

  if (lastAction && now - lastAction < cooldownMs) {
    const remainingMs = cooldownMs - (now - lastAction);
    return {
      allowed: false,
      waitSeconds: Math.ceil(remainingMs / 1000)
    };
  }

  rateLimitMap[actionKey] = now;
  return { allowed: true };
}

// 8. Mask Sensitive Customer Data (Privacy Protection)
export function maskPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.trim();
  if (cleaned.length < 8) return cleaned;
  return cleaned.substring(0, 3) + '****' + cleaned.substring(cleaned.length - 3);
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

// 9. Admin Login Rate Limiting / Brute Force Lockout
interface LockoutState {
  failedAttempts: number;
  lockedUntil: number | null;
}

const LOCKOUT_STORAGE_KEY = 'toolzaibd_admin_lockout';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function getAdminLockoutStatus(): { isLocked: boolean; remainingMinutes: number; failedAttempts: number } {
  try {
    const saved = sessionStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!saved) return { isLocked: false, remainingMinutes: 0, failedAttempts: 0 };
    const state: LockoutState = JSON.parse(saved);

    if (state.lockedUntil && Date.now() < state.lockedUntil) {
      const remainingMs = state.lockedUntil - Date.now();
      return {
        isLocked: true,
        remainingMinutes: Math.ceil(remainingMs / 60000),
        failedAttempts: state.failedAttempts
      };
    }

    if (state.lockedUntil && Date.now() >= state.lockedUntil) {
      // Lockout expired, reset attempts
      sessionStorage.removeItem(LOCKOUT_STORAGE_KEY);
      return { isLocked: false, remainingMinutes: 0, failedAttempts: 0 };
    }

    return {
      isLocked: false,
      remainingMinutes: 0,
      failedAttempts: state.failedAttempts || 0
    };
  } catch {
    return { isLocked: false, remainingMinutes: 0, failedAttempts: 0 };
  }
}

export function recordAdminFailedAttempt(): { isLocked: boolean; remainingAttempts: number; remainingMinutes: number } {
  try {
    const current = getAdminLockoutStatus();
    const newCount = current.failedAttempts + 1;

    if (newCount >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(
        LOCKOUT_STORAGE_KEY,
        JSON.stringify({ failedAttempts: newCount, lockedUntil })
      );
      return { isLocked: true, remainingAttempts: 0, remainingMinutes: 5 };
    }

    sessionStorage.setItem(
      LOCKOUT_STORAGE_KEY,
      JSON.stringify({ failedAttempts: newCount, lockedUntil: null })
    );

    return {
      isLocked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS - newCount,
      remainingMinutes: 0
    };
  } catch {
    return { isLocked: false, remainingAttempts: 0, remainingMinutes: 0 };
  }
}

export function clearAdminLockout(): void {
  try {
    sessionStorage.removeItem(LOCKOUT_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}
