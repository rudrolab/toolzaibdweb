import { StoreSettings } from '../types';

export function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('880')) return digits;
  if (digits.startsWith('88') && digits.length >= 12) return digits;
  if (digits.startsWith('0')) return '88' + digits;
  if (digits.length === 10) return '880' + digits;
  return digits.length >= 10 ? '88' + digits : '8801886822838';
}

export function getWhatsAppUrl(rawPhone?: string, message?: string): string {
  const phone = formatWhatsAppNumber(rawPhone || '01886822838');
  const baseUrl = `https://wa.me/${phone}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

export function getStorePaymentMethods(settings?: Partial<StoreSettings>) {
  const bkash = settings?.bkashNumber?.trim() || '01886822838';
  const nagad = settings?.nagadNumber?.trim() || '01886822838';
  const rocket = settings?.rocketNumber?.trim() || '01886822838-8';
  const upay = settings?.upayNumber?.trim() || nagad;

  return [
    {
      id: 'bkash',
      name: 'bKash',
      number: bkash,
      type: 'Personal (Send Money / Cash Out)',
      fee: '0%',
      color: '#E2136E',
      logoText: 'bKash',
      logoUrl: 'https://pay.smmnea.com/assets/gateways/bkash/bkashpersonal.png'
    },
    {
      id: 'nagad',
      name: 'Nagad',
      number: nagad,
      type: 'Personal (Send Money)',
      fee: '0%',
      color: '#F7941D',
      logoText: 'Nagad',
      logoUrl: 'https://pay.smmnea.com/assets/gateways/nagad/nagadpersonal.png'
    },
    {
      id: 'rocket',
      name: 'Rocket',
      number: rocket,
      type: 'Personal (Send Money)',
      fee: '0%',
      color: '#8C3494',
      logoText: 'Rocket',
      logoUrl: 'https://pay.smmnea.com/assets/gateways/rocket/rocketpersonal.png'
    },
    {
      id: 'upay',
      name: 'Upay',
      number: upay,
      type: 'Personal (Send Money)',
      fee: '0%',
      color: '#0072BC',
      logoText: 'Upay',
      logoUrl: 'https://pay.smmnea.com/assets/gateways/upay/upaypersonal.png'
    },
    {
      id: 'crypto',
      name: 'USDT (Binance)',
      address: 'TRC20 / BEP20 (Ask on WhatsApp)',
      type: 'TRC20 / BEP20',
      fee: '0%',
      color: '#F3BA2F',
      logoText: 'Binance',
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=035'
    }
  ];
}
