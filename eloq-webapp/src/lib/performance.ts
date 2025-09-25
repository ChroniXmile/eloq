// Performance optimization utilities
// This file contains utilities to optimize application performance and ensure <200ms page load times

/**
 * Debounce function to limit the rate at which a function can fire
 * @param func Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Throttle function to limit the rate at which a function can fire
 * @param func Function to throttle
 * @param limit Limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function (...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Memoize function to cache results of expensive function calls
 * @param fn Function to memoize
 * @param resolver Function to resolve cache key (optional)
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return function (...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  } as T;
}

/**
 * Lazy load images to improve initial page load time
 * @param imageElements Image elements to lazy load
 */
export function lazyLoadImages(imageElements: HTMLImageElement[]): void {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  });
  
  imageElements.forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Preload critical resources
 * @param urls URLs of resources to preload
 */
export function preloadResources(urls: string[]): void {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'image'; // Adjust as needed for different resource types
    document.head.appendChild(link);
  });
}

/**
 * Measure page load time
 * @returns Promise that resolves with page load time in milliseconds
 */
export function measurePageLoadTime(): Promise<number> {
  return new Promise(resolve => {
    if (performance.getEntriesByType('navigation').length > 0) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      resolve(navigation.loadEventEnd - navigation.fetchStart);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          resolve(navigation.loadEventEnd - navigation.fetchStart);
        }, 0);
      });
    }
  });
}

/**
 * Optimize rendering by batching DOM updates
 * @param callback Callback function to execute
 */
export function batchDOMUpdates(callback: () => void): void {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * Virtualize long lists to improve performance
 * @param container Container element
 * @param items All items in the list
 * @param itemHeight Height of each item in pixels
 * @param renderItem Function to render each item
 */
export function virtualizeList<T>(
  container: HTMLElement,
  items: T[],
  itemHeight: number,
  renderItem: (item: T, index: number) => HTMLElement
): void {
  const containerHeight = container.clientHeight;
  const visibleItemCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer items
  const startIndex = 0;
  const endIndex = Math.min(startIndex + visibleItemCount, items.length);
  
  // Clear container
  container.innerHTML = '';
  
  // Create spacer for items before visible range
  const topSpacer = document.createElement('div');
  topSpacer.style.height = `${startIndex * itemHeight}px`;
  container.appendChild(topSpacer);
  
  // Render visible items
  for (let i = startIndex; i < endIndex; i++) {
    const itemElement = renderItem(items[i], i);
    itemElement.style.height = `${itemHeight}px`;
    container.appendChild(itemElement);
  }
  
  // Create spacer for items after visible range
  const bottomSpacer = document.createElement('div');
  bottomSpacer.style.height = `${(items.length - endIndex) * itemHeight}px`;
  container.appendChild(bottomSpacer);
  
  // Handle scroll events
  const handleScroll = (): void => {
    const scrollTop = container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const newEndIndex = Math.min(newStartIndex + visibleItemCount, items.length);
    
    // Only update if indices have changed significantly
    if (Math.abs(newStartIndex - startIndex) > visibleItemCount / 2) {
      // Update spacers and visible items
      topSpacer.style.height = `${newStartIndex * itemHeight}px`;
      bottomSpacer.style.height = `${(items.length - newEndIndex) * itemHeight}px`;
      
      // Clear and rerender visible items
      while (container.children.length > 2) {
        container.removeChild(container.children[1]);
      }
      
      for (let i = newStartIndex; i < newEndIndex; i++) {
        const itemElement = renderItem(items[i], i);
        itemElement.style.height = `${itemHeight}px`;
        container.insertBefore(itemElement, bottomSpacer);
      }
    }
  };
  
  container.addEventListener('scroll', debounce(handleScroll, 100));
}

/**
 * Optimize images by compressing and resizing
 * @param imageUrl Original image URL
 * @param maxWidth Maximum width for the image
 * @param quality Image quality (0-1)
 * @returns Optimized image URL
 */
export function optimizeImage(
  imageUrl: string,
  maxWidth: number = 800,
  quality: number = 0.8
): string {
  // In a real implementation, this would use a service like Cloudinary or Imgix
  // For now, we'll just return the original URL
  return imageUrl;
}

/**
 * Cache API responses to reduce server requests
 * @param cacheName Name of the cache
 * @param url URL to cache
 * @param response Response to cache
 */
export async function cacheApiResponse(
  cacheName: string,
  url: string,
  response: Response
): Promise<void> {
  if ('caches' in window) {
    try {
      const cache = await caches.open(cacheName);
      await cache.put(url, response.clone());
    } catch (error) {
      console.warn('Failed to cache API response:', error);
    }
  }
}

/**
 * Get cached API response if available
 * @param cacheName Name of the cache
 * @param url URL to get from cache
 * @returns Cached response or null if not found
 */
export async function getCachedApiResponse(
  cacheName: string,
  url: string
): Promise<Response | null> {
  if ('caches' in window) {
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match(url);
      return response || null;
    } catch (error) {
      console.warn('Failed to get cached API response:', error);
      return null;
    }
  }
  return null;
}

/**
 * Initialize performance optimizations
 */
export function initializePerformanceOptimizations(): void {
  // Measure initial page load time
  measurePageLoadTime().then(loadTime => {
    console.log(`Page loaded in ${loadTime}ms`);
    
    if (loadTime > 200) {
      console.warn('Page load time exceeds 200ms target');
    }
  });
  
  // Preload critical resources if any
  // preloadResources(['/images/logo.png', '/fonts/main.woff2']);
  
  console.log('Performance optimizations initialized');
}

// Export types for convenience
export type { };