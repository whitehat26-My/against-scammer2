/**
 * Taksonomi bersama.
 *
 * Modul Ensiklopedia (/taktik) dan modul Suapan Berita menggunakan senarai
 * kategori & platform yang SAMA supaya artikel boleh dipautkan silang dengan
 * entri ensiklopedia tanpa mapping tambahan.
 */

export const PLATFORMS = [
  'whatsapp',
  'telegram',
  'panggilan',
  'sms',
  'facebook',
  'marketplace',
  'aplikasi-dating',
  'e-mel',
  'laman-web',
] as const;

export type PlatformId = (typeof PLATFORMS)[number];

export const PLATFORM_LABEL: Record<PlatformId, { ms: string; en: string }> = {
  whatsapp: { ms: 'WhatsApp', en: 'WhatsApp' },
  telegram: { ms: 'Telegram', en: 'Telegram' },
  panggilan: { ms: 'Panggilan telefon', en: 'Phone call' },
  sms: { ms: 'SMS', en: 'SMS' },
  facebook: { ms: 'Facebook', en: 'Facebook' },
  marketplace: { ms: 'Facebook Marketplace', en: 'Facebook Marketplace' },
  'aplikasi-dating': { ms: 'Aplikasi dating', en: 'Dating apps' },
  'e-mel': { ms: 'E-mel', en: 'Email' },
  'laman-web': { ms: 'Laman web palsu', en: 'Fake websites' },
};

export const RISK_LEVELS = ['sederhana', 'tinggi', 'sangat-tinggi'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_LABEL: Record<RiskLevel, { ms: string; en: string }> = {
  sederhana: { ms: 'Risiko sederhana', en: 'Moderate risk' },
  tinggi: { ms: 'Risiko tinggi', en: 'High risk' },
  'sangat-tinggi': { ms: 'Risiko sangat tinggi', en: 'Very high risk' },
};

export function isPlatformId(value: string): value is PlatformId {
  return (PLATFORMS as readonly string[]).includes(value);
}

export function isRiskLevel(value: string): value is RiskLevel {
  return (RISK_LEVELS as readonly string[]).includes(value);
}
