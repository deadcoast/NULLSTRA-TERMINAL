import * as React from "react";
const {  useEffect, useState  } = React;

import {
  BrowserInfo,
  BrowserPerformance,
  runCompatibilityTests,
} from "../utils/browserCompatibility";

/**
 * Result of the browser compatibility hook
 */
interface CompatibilityResult {
  /** Current browser information */
  browser: BrowserInfo | null;
  /** Browser performance metrics */
  performance: BrowserPerformance | null;
  /** Image format support */
  imageSupport: { webp: boolean; avif: boolean } | null;
  /** Optimization recommendations */
  recommendations: string[];
  /** Whether the browser is supported */
  isSupported: boolean;
  /** Whether optimization mode is enabled */
  optimizationEnabled: boolean;
  /** Current optimization level */
  optimizationLevel: "high" | "medium" | "low" | null;
  /** Whether the tests are currently running */
  isLoading: boolean;
  /** Toggle optimization mode */
  toggleOptimization: () => void;
}

/**
 * Hook for browser compatibility detection and optimizations
 *
 * @example
 * ```tsx
 * const {
 *   browser,
 *   performance,
 *   recommendations,
 *   optimizationEnabled,
 *   toggleOptimization
 * } = useBrowserCompatibility();
 *
 * // Apply optimizations conditionally
 * if (optimizationEnabled && performance?.deviceTier === 'low-end') {
 *   // Apply aggressive optimizations
 * }
 * ```
 */
export function useBrowserCompatibility(): CompatibilityResult {
  const [browser, setBrowser] = useState<BrowserInfo | null>(null);
  const [performance, setPerformance] = useState<BrowserPerformance | null>(
    null,
  );
  const [imageSupport, setImageSupport] = useState<{
    webp: boolean;
    avif: boolean;
  } | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);

  // Load optimization preference from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPref = localStorage.getItem("terminal-optimization-enabled");
      if (savedPref !== null) {
        setOptimizationEnabled(savedPref === "true");
      }
    }
  }, []);

  // Run compatibility tests on mount
  useEffect(() => {
    let isMounted = true;

    async function runTests() {
      try {
        // Only run in browser environment
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const results = await runCompatibilityTests();

        if (isMounted) {
          setBrowser(results.browser);
          setPerformance(results.performance);
          setImageSupport(results.imageSupport);
          setRecommendations(results.recommendations);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error running compatibility tests:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    runTests();

    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle optimization mode
  const toggleOptimization = () => {
    setOptimizationEnabled((prev) => {
      const newValue = !prev;
      // Save preference to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("terminal-optimization-enabled", String(newValue));
      }
      return newValue;
    });
  };

  // Determine if browser is supported
  const isSupported = browser
    ? !(
        browser.name === "IE" ||
        (browser.name === "Safari" && parseInt(browser.version, 10) < 11) ||
        (browser.name === "Firefox" && parseInt(browser.version, 10) < 60) ||
        (browser.name === "Chrome" && parseInt(browser.version, 10) < 60)
      )
    : true;

  return {
    browser,
    performance,
    imageSupport,
    recommendations,
    isSupported,
    optimizationEnabled,
    optimizationLevel: performance?.optimizationLevel || null,
    isLoading,
    toggleOptimization,
  };
}

/**
 * Create adaptive styles based on browser compatibility and device capabilities
 *
 * @example
 * ```tsx
 * const { getAdaptiveStyles } = useAdaptiveStyles();
 *
 * const styles = getAdaptiveStyles({
 *   base: { color: 'black', transition: 'all 0.3s' },
 *   highEnd: { transform: 'rotate(10deg)', filter: 'blur(2px)' },
 *   lowEnd: { transform: 'none', transition: 'none' },
 * });
 * ```
 */
export function useAdaptiveStyles() {
  const { performance, optimizationEnabled } = useBrowserCompatibility();

  /**
   * Get adaptive styles based on device capabilities
   */
  const getAdaptiveStyles = <T extends Record<string, any>>(options: {
    base: T;
    highEnd?: Partial<T> & { backdropFilter?: string };
    midRange?: Partial<T>;
    lowEnd?: Partial<T>;
    forceOptimize?: boolean;
  }): T => {
    const {
      base,
      highEnd = {},
      midRange = {},
      lowEnd = {},
      forceOptimize = false,
    } = options;

    // Apply forced optimization if required or optimization is enabled
    if ((forceOptimize || optimizationEnabled) && performance) {
      if (
        performance.deviceTier === "low-end" ||
        performance.optimizationLevel === "high"
      ) {
        return { ...base, ...lowEnd };
      }

      if (
        performance.deviceTier === "mid-range" ||
        performance.optimizationLevel === "medium"
      ) {
        return { ...base, ...midRange };
      }

      // High-end device with low optimization level
      return { ...base, ...highEnd };
    }

    // Default to base styles when no optimization is needed
    // or we don't have performance data yet
    return { ...base };
  };

  return { getAdaptiveStyles };
}

export default useBrowserCompatibility;
