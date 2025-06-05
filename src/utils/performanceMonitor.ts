
// Performance monitoring utilities for production
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing a operation
  startTiming(key: string): void {
    this.metrics.set(key, performance.now());
  }

  // End timing and log result
  endTiming(key: string): number {
    const startTime = this.metrics.get(key);
    if (!startTime) {
      console.warn(`No start time found for key: ${key}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(key);

    // Only log in development or if duration is concerning
    if (import.meta.env.MODE === 'development' || duration > 1000) {
      console.log(`⏱️ ${key}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Monitor component render time
  measureComponent(componentName: string, renderFn: () => void): void {
    this.startTiming(`render:${componentName}`);
    renderFn();
    this.endTiming(`render:${componentName}`);
  }

  // Monitor async operations
  async measureAsync<T>(key: string, asyncFn: () => Promise<T>): Promise<T> {
    this.startTiming(key);
    try {
      const result = await asyncFn();
      this.endTiming(key);
      return result;
    } catch (error) {
      this.endTiming(key);
      throw error;
    }
  }

  // Get Core Web Vitals
  getCoreWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let cls = 0;
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      console.log('CLS:', cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
