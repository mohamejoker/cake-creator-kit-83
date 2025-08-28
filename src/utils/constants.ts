// Order status constants
export const ORDER_STATUSES = {
  NEW: 'جديد',
  PREPARING: 'قيد التجهيز', 
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي'
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

// Egyptian governorates
export const GOVERNORATES = [
  'القاهرة',
  'الجيزة', 
  'الإسكندرية',
  'القليوبية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'الغربية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'شمال سيناء',
  'جنوب سيناء',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح'
] as const;

// Product validation constants
export const PRODUCT_LIMITS = {
  MAX_BENEFITS: 10,
  MAX_USAGE_INSTRUCTIONS: 8,
  MAX_IMAGES: 10,
  MAX_BENEFIT_LENGTH: 100,
  MAX_INSTRUCTION_LENGTH: 150,
  MAX_NAME_LENGTH: 100,
  MAX_BRAND_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500
} as const;

// Phone number validation
export const PHONE_REGEX = /^(01[0-2,5]{1}[0-9]{8})$/;

// Shipping fees (in EGP)
export const SHIPPING_FEES = {
  CAIRO: 30,
  GIZA: 30,
  ALEXANDRIA: 35,
  DEFAULT: 40
} as const;

// Site settings
export const SITE_CONFIG = {
  SITE_NAME: 'سندرين بيوتي',
  SUPPORT_PHONE: '01556133633',
  DEFAULT_WHATSAPP: '201556133633',
  CURRENCY: 'ج.م',
  FACEBOOK_URL: 'https://facebook.com',
  INSTAGRAM_URL: 'https://instagram.com'
} as const;