/**
 * Code Splitting Utilities
 *
 * This module provides utilities for dynamic imports and code splitting
 * to optimize the loading performance of terminal features.
 */

import type { ComponentType } from "react";
import * as React from "react";
const { lazy } = React;

/**
 * Options for dynamic imports
 */
interface DynamicImportOptions {
  /**
   * Loading fallback component
   * @default null
   */
  fallback?: React.ReactNode;

  /**
   * Whether to preload the component
   * @default false
   */
  preload?: boolean;

  /**
   * Whether to prefetch the component
   * @default false
   */
  prefetch?: boolean;

  /**
   * Delay in ms before showing loading state
   * @default 200
   */
  loadingDelay?: number;

  /**
   * Error handler for failed imports
   */
  onError?: (error: Error) => void;
}

/**
 * Dynamically imports a component with better error handling and loading states
 *
 * @param importFn Function that imports the component
 * @param options Configuration options
 * @returns Lazy-loaded component
 */
export function dynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {},
): T {
  const { preload = false, prefetch = false } = options;

  // Create the lazy component
  const LazyComponent = lazy(() => {
    return importFn().catch((error) => {
      console.error("Error loading dynamic component:", error);
      if (options.onError) {
        options.onError(error);
      }
      // Re-throw to trigger error boundary
      throw error;
    });
  });

  // Handle preloading/prefetching if requested
  if (preload) {
    // Start loading right away
    importFn();
  } else if (prefetch && typeof window !== "undefined") {
    // Prefetch after initial load is complete
    window.addEventListener("load", () => {
      setTimeout(() => importFn(), 1000);
    });
  }

  return LazyComponent as unknown as T;
}

/**
 * Terminal feature modules that can be dynamically imported
 */
export const TerminalFeatures = {
  /**
   * Terminal CRT effect
   */
  CRTEffect: dynamicImport(() => import("../components/Effects/CRTEffect"), {
    prefetch: true,
  }),

  /**
   * Terminal syntax highlighter
   */
  SyntaxHighlighter: dynamicImport(
    () => import("../components/Terminal/SyntaxHighlighter"),
    { preload: false },
  ),

  /**
   * Terminal animations
   */
  TerminalAnimations: dynamicImport(
    () => import("../components/Effects/TerminalAnimations"),
    { prefetch: true },
  ),

  /**
   * Terminal markdown renderer
   */
  MarkdownRenderer: dynamicImport(
    () => import("../components/Terminal/MarkdownRenderer"),
    { preload: false },
  ),

  /**
   * Advanced input features
   */
  AdvancedInput: dynamicImport(
    () => import("../components/Terminal/AdvancedInput"),
    { preload: false },
  ),
};

/**
 * Preloads all terminal features
 * Call this function when the user has been idle for a while
 * or when the app is fully loaded and ready
 */
export function preloadAllFeatures(): void {
  Object.values(TerminalFeatures).forEach((LazyComponent) => {
    // Force the import to happen
    import("../components/Effects/CRTEffect");
    import("../components/Terminal/SyntaxHighlighter");
    import("../components/Effects/TerminalAnimations");
    import("../components/Terminal/MarkdownRenderer");
    import("../components/Terminal/AdvancedInput");
  });
}

/**
 * Utility for detecting user idle time to preload features
 * @param idleTime Time in ms before considering the user idle
 */
export function setupIdlePreloading(idleTime: number = 5000): () => void {
  if (typeof window === "undefined") return () => {};

  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let hasPreloaded = false;

  const resetTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    if (hasPreloaded) return;

    idleTimer = setTimeout(() => {
      if (!hasPreloaded) {
        console.log("User idle, preloading remaining features");
        preloadAllFeatures();
        hasPreloaded = true;
      }
    }, idleTime);
  };

  // User interaction events
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

  // Add event listeners
  events.forEach((event) => {
    window.addEventListener(event, resetTimer, { passive: true });
  });

  // Start the timer
  resetTimer();

  // Return cleanup function
  return () => {
    if (idleTimer) clearTimeout(idleTimer);
    events.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
  };
}

export default {
  dynamicImport,
  TerminalFeatures,
  preloadAllFeatures,
  setupIdlePreloading,
};
