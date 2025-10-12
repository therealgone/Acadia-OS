// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureRender(componentName: string, startTime: number): void {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    this.metrics.set(`${componentName}_render`, renderTime);
    
    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Measure API call performance
  measureApiCall(apiName: string, startTime: number): void {
    const endTime = performance.now();
    const apiTime = endTime - startTime;
    this.metrics.set(`${apiName}_api`, apiTime);
    
    // Log slow API calls
    if (apiTime > 1000) {
      console.warn(`Slow API call: ${apiName} took ${apiTime.toFixed(2)}ms`);
    }
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Hook for measuring component performance
export function usePerformanceMonitor(componentName: string) {
  const startTime = performance.now();
  
  return {
    endMeasure: () => {
      PerformanceMonitor.getInstance().measureRender(componentName, startTime);
    }
  };
}

// Utility for measuring async operations
export async function measureAsync<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await operation();
    PerformanceMonitor.getInstance().measureApiCall(operationName, startTime);
    return result;
  } catch (error) {
    PerformanceMonitor.getInstance().measureApiCall(`${operationName}_error`, startTime);
    throw error;
  }
}

// Bundle size monitoring
export function logBundleSize(): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Log current bundle size information
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('_next/static')) {
        // This is a Next.js chunk
        console.log(`Bundle chunk: ${src}`);
      }
    });
    
    console.log(`Total scripts loaded: ${scripts.length}`);
  }
}

