/**
 * Performance Monitoring Utility
 *
 * This utility helps track and report web vitals metrics for performance monitoring.
 * It integrates with the web-vitals library to measure Core Web Vitals and other metrics.
 */

import { Metric, onCLS, onFCP, onFID, onLCP, onTTFB } from "web-vitals";

interface PerformanceMetrics {
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  LCP?: number; // Largest Contentful Paint
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
  [key: string]: number | undefined;
}

interface NavigationMetrics {
  navigationStart?: number;
  loadEventEnd?: number;
  domContentLoaded?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  timeToInteractive?: number;
}

const metrics: PerformanceMetrics = {};
let navigationTiming: NavigationMetrics = {};
const customMetrics: Record<string, number> = {};

/**
 * Report handler for web-vitals
 */
const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (typeof window === "undefined" || !onPerfEntry) return;

  // Measure Core Web Vitals
  onCLS(onPerfEntry);
  onFID(onPerfEntry);
  onLCP(onPerfEntry);
  onFCP(onPerfEntry);
  onTTFB(onPerfEntry);
};

/**
 * Default handler that stores metrics in memory
 */
const defaultMetricHandler = (metric: Metric) => {
  // Store the metric value
  metrics[metric.name] = metric.value;

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`Web Vital: ${metric.name}`, metric.value);
  }
};

/**
 * Initialize performance monitoring
 * @param options Configuration options
 */
export const initPerformanceMonitoring = (
  options: {
    reportToAnalytics?: boolean;
    customHandler?: (metric: Metric) => void;
    enableConsoleLogging?: boolean;
  } = {},
) => {
  const {
    reportToAnalytics = false,
    customHandler,
    enableConsoleLogging = process.env.NODE_ENV === "development",
  } = options;

  // Create a handler based on options
  const metricHandler = (metric: Metric) => {
    // Always store metrics in memory
    metrics[metric.name] = metric.value;

    // Log to console if enabled
    if (enableConsoleLogging) {
      console.log(
        `%cWeb Vital: ${metric.name}`,
        "color: #0066cc; font-weight: bold;",
        metric.value,
      );
    }

    // Send to analytics if enabled
    if (reportToAnalytics) {
      sendToAnalytics(metric);
    }

    // Call custom handler if provided
    if (customHandler) {
      customHandler(metric);
    }
  };

  // Start monitoring web vitals
  reportWebVitals(metricHandler);

  // Collect navigation timing metrics if available
  if (typeof window !== "undefined" && window.performance) {
    collectNavigationTiming();
  }

  return {
    getMetrics,
    trackCustomMetric,
    getNavigationTiming,
    getAllMetrics,
  };
};

/**
 * Send metrics to analytics (placeholder for actual implementation)
 */
const sendToAnalytics = (metric: Metric) => {
  // Example implementation - replace with actual analytics service
  const body = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    navigationType: metric.navigationType,
    rating: metric.rating,
  };

  // Replace with your actual analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify(body),
  //   headers: { 'Content-Type': 'application/json' }
  // });

  console.log("Sending to analytics:", body);
};

/**
 * Collect navigation timing metrics
 */
const collectNavigationTiming = () => {
  if (typeof window === "undefined" || !window.performance) return;

  // Get performance timing data
  const timing = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming;
  if (!timing) return;

  navigationTiming = {
    navigationStart: 0, // relative to timeOrigin
    loadEventEnd: timing.loadEventEnd,
    domContentLoaded: timing.domContentLoadedEventEnd,
  };

  // Get paint timing data
  const paintMetrics = performance.getEntriesByType("paint");
  for (const paint of paintMetrics) {
    if (paint.name === "first-paint") {
      navigationTiming.firstPaint = paint.startTime;
    }
    if (paint.name === "first-contentful-paint") {
      navigationTiming.firstContentfulPaint = paint.startTime;
    }
  }

  // Attempt to estimate Time to Interactive
  // This is a simplification - a real TTI calculation is more complex
  navigationTiming.timeToInteractive = timing.domInteractive;
};

/**
 * Get all collected web vitals metrics
 */
export const getMetrics = (): PerformanceMetrics => {
  return { ...metrics };
};

/**
 * Get navigation timing metrics
 */
export const getNavigationTiming = (): NavigationMetrics => {
  return { ...navigationTiming };
};

/**
 * Track a custom performance metric
 */
export const trackCustomMetric = (name: string, value: number) => {
  customMetrics[name] = value;

  if (process.env.NODE_ENV === "development") {
    console.log(`Custom metric: ${name}`, value);
  }
};

/**
 * Get all metrics (web vitals, navigation timing, and custom)
 */
export const getAllMetrics = () => {
  return {
    webVitals: { ...metrics },
    navigationTiming: { ...navigationTiming },
    customMetrics: { ...customMetrics },
  };
};

/**
 * Track the render time of a component
 * @param componentName Name of the component being measured
 * @returns Object with start and end functions
 */
export const trackRenderTime = (componentName: string) => {
  const startTime = performance.now();

  return {
    start: () => {
      return startTime;
    },
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      trackCustomMetric(`render_${componentName}`, duration);
      return duration;
    },
  };
};

/**
 * Measure the performance of a function
 */
export const measureFunctionPerformance = <T extends (...args: any[]) => any>(
  fn: T,
  name: string,
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);

    // Handle both synchronous and Promise-returning functions
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        trackCustomMetric(`function_${name}`, end - start);
      }) as ReturnType<T>;
    } else {
      const end = performance.now();
      trackCustomMetric(`function_${name}`, end - start);
      return result;
    }
  };
};

export default {
  initPerformanceMonitoring,
  getMetrics,
  getNavigationTiming,
  trackCustomMetric,
  getAllMetrics,
  trackRenderTime,
  measureFunctionPerformance,
};
