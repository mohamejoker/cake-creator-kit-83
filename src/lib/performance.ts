/**
 * أدوات تحسين الأداء والمراقبة
 */

// Performance monitoring utilities
export const performanceMonitor = {
  // Measure function execution time
  measureTime: <T extends (...args: any[]) => any>(
    fn: T,
    label?: string
  ): T => {
    return ((...args: any[]) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      if (label) {
        console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    }) as T;
  },

  // Debounce function for search and input optimization
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(undefined, args), wait);
    };
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(undefined, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Image optimization utilities
export const imageOptimizer = {
  // Lazy load images with intersection observer
  createLazyLoader: (threshold: number = 0.1) => {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
          }
        });
      },
      { threshold }
    );
  },

  // Preload critical images
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  // Generate responsive image URLs (for future use with image CDN)
  getResponsiveUrl: (url: string, width: number): string => {
    // For now, return original URL
    // In future, can integrate with image CDN like Cloudinary
    return url;
  }
};

// Memory management utilities
export const memoryManager = {
  // Clean up blob URLs to prevent memory leaks
  cleanupBlobUrls: (urls: string[]) => {
    urls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  },

  // Monitor memory usage (development only)
  logMemoryUsage: () => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log('🧠 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  }
};