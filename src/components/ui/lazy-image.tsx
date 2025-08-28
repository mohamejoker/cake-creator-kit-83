import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { imageOptimizer } from '@/lib/performance';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  containerClassName?: string;
}

const LazyImage = ({ 
  src, 
  alt, 
  fallback = '/placeholder.svg',
  className,
  containerClassName,
  ...props 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(fallback);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Create intersection observer for lazy loading
    observerRef.current = imageOptimizer.createLazyLoader(0.1);
    
    const img = imgRef.current;
    img.dataset.src = src;
    
    // Start observing
    observerRef.current.observe(img);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setCurrentSrc(fallback);
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          "transition-all duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          فشل تحميل الصورة
        </div>
      )}
    </div>
  );
};

export default LazyImage;