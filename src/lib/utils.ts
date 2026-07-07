import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price for display
export function formatPrice(price: number | null, currency: string = 'EUR'): string {
  if (price === null) return 'Preis auf Anfrage';
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

// Format date for display
export function formatDate(date: string | Date, locale: string = 'de-DE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Format time for display
export function formatTime(time: string): string {
  if (!time) return '';
  
  // Handle 24-hour format
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const minute = minutes || '00';
  
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check if value is empty (null, undefined, empty string, empty array, empty object)
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Safe JSON stringify
export function safeJsonStringify(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '';
  }
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

// Format phone number for display
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as German phone number
  if (digits.startsWith('49')) {
    // International format
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  } else if (digits.startsWith('0')) {
    // National format
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  
  return phone;
}

// Format opening hours for display
export function formatOpeningHours(hours: { open: string | null; close: string | null; all_day: boolean; is_open: boolean }): string {
  if (!hours.is_open) return 'Geschlossen';
  if (hours.all_day) return 'Ganztägig geöffnet';
  if (!hours.open || !hours.close) return 'Geöffnet';
  
  return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
}

// Get day name in German
export function getGermanDayName(dayIndex: number): string {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  return days[dayIndex] || '';
}

// Get current day name in German
export function getCurrentGermanDayName(): string {
  return getGermanDayName(new Date().getDay());
}

// Check if currently open
export function isCurrentlyOpen(openingHours: Array<{
  day: string;
  open: string | null;
  close: string | null;
  is_open: boolean;
  all_day: boolean;
}>): boolean {
  const today = getCurrentGermanDayName();
  const todayHours = openingHours.find(hour => hour.day === today);
  
  if (!todayHours || !todayHours.is_open) return false;
  if (todayHours.all_day) return true;
  
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours * 60 + currentMinutes;
  
  if (!todayHours.open || !todayHours.close) return true;
  
  const [openHours, openMinutes] = todayHours.open.split(':').map(Number);
  const [closeHours, closeMinutes] = todayHours.close.split(':').map(Number);
  
  const openTime = openHours * 60 + openMinutes;
  const closeTime = closeHours * 60 + closeMinutes;
  
  return currentTime >= openTime && currentTime <= closeTime;
}