/**
 * نظام معالجة أخطاء موحد ومحسن
 */

import { toast } from '@/components/ui/sonner';

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION', 
  DATABASE = 'DATABASE',
  AUTHENTICATION = 'AUTHENTICATION',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handle(error: any, context?: string): AppError {
    const appError = this.parseError(error);
    this.logError(appError, context);
    this.showUserFriendlyMessage(appError);
    return appError;
  }

  private parseError(error: any): AppError {
    // Supabase errors
    if (error?.code) {
      return {
        type: ErrorType.DATABASE,
        message: this.getArabicErrorMessage(error.code),
        details: error.message,
        code: error.code
      };
    }

    // Network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
      return {
        type: ErrorType.NETWORK,
        message: 'مشكلة في الاتصال بالإنترنت',
        details: error.message
      };
    }

    // Validation errors
    if (error?.name === 'ValidationError' || error?.issues) {
      return {
        type: ErrorType.VALIDATION,
        message: 'بيانات غير صحيحة',
        details: error.message
      };
    }

    // Default unknown error
    return {
      type: ErrorType.UNKNOWN,
      message: 'حدث خطأ غير متوقع',
      details: error?.message || 'خطأ غير معروف'
    };
  }

  private getArabicErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      '23505': 'البيانات مكررة',
      '23503': 'مرجع غير صحيح',
      '23502': 'حقل مطلوب مفقود',
      '42P01': 'جدول غير موجود',
      'PGRST116': 'لا توجد بيانات',
      'PGRST301': 'صلاحيات غير كافية'
    };

    return errorMessages[code] || 'خطأ في قاعدة البيانات';
  }

  private logError(error: AppError, context?: string): void {
    const logData = {
      timestamp: new Date().toISOString(),
      type: error.type,
      message: error.message,
      details: error.details,
      code: error.code,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Application Error:', logData);
    }

    // In production, you could send to error tracking service
    // Example: Sentry, LogRocket, etc.
  }

  private showUserFriendlyMessage(error: AppError): void {
    const isNetworkError = error.type === ErrorType.NETWORK;
    
    toast.error(error.message, {
      description: isNetworkError 
        ? 'تحقق من اتصال الإنترنت وحاول مرة أخرى'
        : error.details,
      duration: isNetworkError ? 6000 : 4000
    });
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Helper function for async operations
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    errorHandler.handle(error, context);
    return null;
  }
};