import * as React from "react";
const {  useEffect, useRef, useState  } = React;
import {
  getMetrics,
  initPerformanceMonitoring,
  measureFunctionPerformance,
  trackRenderTime,
} from "../utils/performanceMonitoring";

/**
 * Options for performance tracking in components
 */
interface PerformanceTrackingOptions {
  /** Name of the component being tracked */
  componentName: string;
  /** Whether to track render times */
  trackRenders?: boolean;
  /** Whether to log metrics to console */
  enableLogging?: boolean;
  /** Whether to report to analytics */
  reportToAnalytics?: boolean;
}

/**
 * Hook for tracking component performance
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { metrics, trackEvent } = usePerformanceTracking({
 *     componentName: 'MyComponent',
 *     trackRenders: true
 *   });
 *
 *   // Track a specific user interaction
 *   const handleClick = () => {
 *     trackEvent('button_click');
 *     // Your logic here
 *   };
 *
 *   return <div onClick={handleClick}>Performance tracked component</div>;
 * };
 * ```
 */
export function usePerformanceTracking(options: PerformanceTrackingOptions) {
  const {
    componentName,
    trackRenders = true,
    enableLogging = process.env.NODE_ENV === "development",
    reportToAnalytics = false,
  } = options;

  const [metrics, setMetrics] = useState(getMetrics());
  const renderCount = useRef(0);
  const renderTracker = useRef(trackRenderTime(componentName));
  const mountTime = useRef(performance.now());

  // Initialize performance monitoring on mount
  useEffect(() => {
    const monitor = initPerformanceMonitoring({
      enableConsoleLogging: enableLogging,
      reportToAnalytics,
    });

    // Track component mount time
    const mountDuration = performance.now() - mountTime.current;
    if (enableLogging) {
      console.log(`${componentName} mounted in ${mountDuration.toFixed(2)}ms`);
    }

    // Record mount duration
    trackEvent("mount", mountDuration);

    // Cleanup on unmount
    return () => {
      const unmountStart = performance.now();

      // Record unmount duration and total component lifespan
      const unmountDuration = performance.now() - unmountStart;
      const lifespan = performance.now() - mountTime.current;

      trackEvent("unmount", unmountDuration);
      trackEvent("lifespan", lifespan);

      if (enableLogging) {
        console.log(
          `${componentName} unmounted in ${unmountDuration.toFixed(2)}ms (lifespan: ${lifespan.toFixed(2)}ms)`,
        );
      }
    };
  }, []);

  // Track render time if enabled
  useEffect(() => {
    if (!trackRenders) return;

    renderCount.current++;
    const duration = renderTracker.current.end();

    if (enableLogging && renderCount.current > 1) {
      console.log(
        `${componentName} render #${renderCount.current}: ${duration.toFixed(2)}ms`,
      );
    }

    // Prepare for next render
    renderTracker.current = trackRenderTime(componentName);
  }, [trackRenders, componentName, enableLogging]);

  /**
   * Track a custom event or user interaction
   */
  const trackEvent = (eventName: string, duration?: number) => {
    const eventKey = `${componentName}_${eventName}`;

    if (typeof duration === "number") {
      trackCustomMetric(eventKey, duration);
      return duration;
    }

    const startTime = performance.now();

    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        trackCustomMetric(eventKey, duration);
        return duration;
      },
    };
  };

  /**
   * Wrap a function to measure its performance
   */
  const trackFunction = <T extends (...args: any[]) => any>(
    fn: T,
    name: string,
  ): ((...args: Parameters<T>) => ReturnType<T>) => {
    return measureFunctionPerformance(fn, `${componentName}_${name}`);
  };

  /**
   * Track custom metric
   */
  const trackCustomMetric = (name: string, value: number) => {
    if (enableLogging) {
      console.log(`Metric (${componentName}): ${name} = ${value.toFixed(2)}ms`);
    }

    // Using the imported trackCustomMetric from performanceMonitoring
    // But we need to reference it differently to avoid name conflict
    import("../utils/performanceMonitoring").then((module) => {
      module.trackCustomMetric(name, value);

      // Update metrics state
      setMetrics(module.getMetrics());
    });
  };

  /**
   * Force an update of the metrics state
   */
  const refreshMetrics = () => {
    setMetrics(getMetrics());
  };

  return {
    metrics,
    trackEvent,
    trackFunction,
    trackCustomMetric,
    renderCount: renderCount.current,
    refreshMetrics,
  };
}

export default usePerformanceTracking;
