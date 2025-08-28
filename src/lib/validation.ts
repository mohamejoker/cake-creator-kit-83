/**
 * نظام التحقق من البيانات المحسن والموحد
 */

import { z } from 'zod';
import { PHONE_REGEX, GOVERNORATES, PRODUCT_LIMITS } from '@/utils/constants';

// Custom validation messages in Arabic
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return { message: 'نوع البيانات غير صحيح' };
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return { message: `يجب أن يحتوي على ${issue.minimum} أحرف على الأقل` };
      }
      return { message: 'القيمة صغيرة جداً' };
    case z.ZodIssueCode.too_big:
      if (issue.type === 'string') {
        return { message: `يجب أن لا يتجاوز ${issue.maximum} حرف` };
      }
      return { message: 'القيمة كبيرة جداً' };
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return { message: 'البريد الإلكتروني غير صحيح' };
      }
      if (issue.validation === 'url') {
        return { message: 'الرابط غير صحيح' };
      }
      return { message: 'تنسيق غير صحيح' };
    default:
      return { message: ctx.defaultError };
  }
};

z.setErrorMap(customErrorMap);

// Phone number validation
export const phoneSchema = z
  .string()
  .min(11, 'رقم الهاتف يجب أن يحتوي على 11 رقم')
  .regex(PHONE_REGEX, 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01)');

// Order validation schema
export const orderSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'الاسم يجب أن يحتوي على حرفين على الأقل')
    .max(50, 'الاسم طويل جداً')
    .regex(/^[\u0600-\u06FF\s]+$/, 'الاسم يجب أن يحتوي على أحرف عربية فقط'),
  
  phone: phoneSchema,
  
  address: z
    .string()
    .min(10, 'العنوان يجب أن يحتوي على 10 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً'),
  
  governorate: z
    .string()
    .min(1, 'يرجى اختيار المحافظة')
    .refine(
      (val) => GOVERNORATES.includes(val as any),
      'المحافظة غير صحيحة'
    ),
  
  notes: z
    .string()
    .max(500, 'الملاحظات طويلة جداً')
    .optional()
});

// Product validation schema
export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'اسم المنتج قصير جداً')
    .max(PRODUCT_LIMITS.MAX_NAME_LENGTH, `اسم المنتج طويل جداً (حد أقصى ${PRODUCT_LIMITS.MAX_NAME_LENGTH} حرف)`),
  
  brand: z
    .string()
    .min(2, 'اسم العلامة التجارية قصير جداً')
    .max(PRODUCT_LIMITS.MAX_BRAND_LENGTH, `اسم العلامة التجارية طويل جداً (حد أقصى ${PRODUCT_LIMITS.MAX_BRAND_LENGTH} حرف)`),
  
  price: z
    .number()
    .min(1, 'السعر يجب أن يكون أكبر من صفر')
    .max(999999, 'السعر كبير جداً'),
  
  description: z
    .string()
    .max(PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH, `الوصف طويل جداً (حد أقصى ${PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH} حرف)`)
    .optional(),
  
  whatsapp_number: phoneSchema.optional(),
  
  benefits: z
    .array(z.string().max(PRODUCT_LIMITS.MAX_BENEFIT_LENGTH))
    .max(PRODUCT_LIMITS.MAX_BENEFITS, `عدد الفوائد كبير جداً (حد أقصى ${PRODUCT_LIMITS.MAX_BENEFITS})`),
  
  usage_instructions: z
    .array(z.string().max(PRODUCT_LIMITS.MAX_INSTRUCTION_LENGTH))
    .max(PRODUCT_LIMITS.MAX_USAGE_INSTRUCTIONS, `عدد الخطوات كبير جداً (حد أقصى ${PRODUCT_LIMITS.MAX_USAGE_INSTRUCTIONS})`),
  
  images: z
    .array(z.string().url('رابط الصورة غير صحيح'))
    .max(PRODUCT_LIMITS.MAX_IMAGES, `عدد الصور كبير جداً (حد أقصى ${PRODUCT_LIMITS.MAX_IMAGES})`)
});

// Validation helper functions
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { success: boolean; data?: T; error?: string } => {
  try {
    const result = schema.parse(value);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || 'خطأ في التحقق من البيانات' 
      };
    }
    return { success: false, error: 'خطأ غير متوقع في التحقق' };
  }
};

export const validatePartial = <T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { success: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(value);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'خطأ في التحقق من البيانات' } };
  }
};

export type OrderFormData = z.infer<typeof orderSchema>;
export type ProductFormData = z.infer<typeof productSchema>;