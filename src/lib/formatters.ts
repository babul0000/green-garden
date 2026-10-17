/**
 * Common formatting and conversion utilities for AR Green Garden
 * Provides localized Bengali (বাংলা) and English number, currency, and date formats.
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const EN_DIGITS_MAP: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

/**
 * Converts English digits (0-9) to Bengali digits (০-৯)
 */
export function toBnDigits(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  return String(val).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Converts Bengali digits (০-৯) to standard English digits (0-9)
 */
export function toEnDigits(val: string | number | null | undefined): string {
  if (!val) return "";
  return String(val).replace(/[০-৯]/g, (d) => EN_DIGITS_MAP[d] || d);
}

/**
 * Formats a number to Bengali comma-separated currency format (e.g. ৳১,৫০,০০০)
 */
export function formatCurrencyBn(amount: number | string, includeSymbol = true): string {
  const num = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const parts = num.toLocaleString("en-IN").split(".");
  const formatted = toBnDigits(parts[0]) + (parts[1] ? `.${toBnDigits(parts[1])}` : "");
  return includeSymbol ? `৳${formatted}` : formatted;
}

/**
 * Formats a Date object or string into a Bengali localized date (e.g. ১৭ অক্টোবর ২০২৬)
 */
export function formatDateBn(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  const monthsBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const day = toBnDigits(date.getDate());
  const month = monthsBn[date.getMonth()];
  const year = toBnDigits(date.getFullYear());

  return `${day} ${month} ${year}`;
}

/**
 * Relative time in Bengali (e.g. ৫ মিনিট আগে, ২ ঘণ্টা আগে, ৩ দিন আগে)
 */
export function formatTimeAgoBn(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "এইমাত্র";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${toBnDigits(minutes)} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toBnDigits(hours)} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${toBnDigits(days)} দিন আগে`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${toBnDigits(months)} মাস আগে`;
  const years = Math.floor(days / 365);
  return `${toBnDigits(years)} বছর আগে`;
}
