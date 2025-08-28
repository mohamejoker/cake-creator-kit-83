import { ORDER_STATUSES, SHIPPING_FEES, PHONE_REGEX } from './constants';
import type { OrderStatus } from './constants';

/**
 * Format price with Egyptian pound currency
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} ج.م`;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (phone.length === 11) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  }
  return phone;
};

/**
 * Validate Egyptian phone number
 */
export const validatePhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.replace(/\s+/g, ''));
};

/**
 * Get shipping fee based on governorate
 */
export const getShippingFee = (governorate?: string | null): number => {
  if (!governorate) return SHIPPING_FEES.DEFAULT;
  
  const normalized = governorate.trim();
  
  if (normalized === 'القاهرة') return SHIPPING_FEES.CAIRO;
  if (normalized === 'الجيزة') return SHIPPING_FEES.GIZA;
  if (normalized === 'الإسكندرية') return SHIPPING_FEES.ALEXANDRIA;
  
  return SHIPPING_FEES.DEFAULT;
};

/**
 * Calculate total order amount including shipping
 */
export const calculateOrderTotal = (
  productPrice: number, 
  quantity: number = 1, 
  governorate?: string | null
): { subtotal: number; shipping: number; total: number } => {
  const subtotal = productPrice * quantity;
  const shipping = getShippingFee(governorate);
  const total = subtotal + shipping;
  
  return { subtotal, shipping, total };
};

/**
 * Get order status color class
 */
export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case ORDER_STATUSES.NEW:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ORDER_STATUSES.PREPARING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ORDER_STATUSES.SHIPPED:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case ORDER_STATUSES.DELIVERED:
      return 'bg-green-100 text-green-800 border-green-200';
    case ORDER_STATUSES.CANCELLED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Generate WhatsApp order message
 */
export const generateWhatsAppMessage = (
  customerName: string,
  productName: string,
  price: number,
  governorate: string
): string => {
  const { subtotal, shipping, total } = calculateOrderTotal(price, 1, governorate);
  
  return encodeURIComponent(
    `مرحباً، أريد طلب:\n\n` +
    `📦 المنتج: ${productName}\n` +
    `👤 الاسم: ${customerName}\n` +
    `📍 المحافظة: ${governorate}\n\n` +
    `💰 السعر: ${formatPrice(subtotal)}\n` +
    `🚚 الشحن: ${formatPrice(shipping)}\n` +
    `💳 الإجمالي: ${formatPrice(total)}\n\n` +
    `يرجى التأكيد والتواصل لإتمام الطلب.`
  );
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Cairo'
  }).format(d);
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Cairo'
  }).format(d);
};

/**
 * Validate product image URL
 */
export const validateImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

/**
 * Generate random ID for temporary use
 */
export const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function for search and input optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(undefined, args), wait);
  };
};