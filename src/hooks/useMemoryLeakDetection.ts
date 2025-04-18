import * as React from "react";
const {  useEffect, useRef  } = React;
import {
  startMemoryTracking,
  stopMemoryTracking,
  updateMemoryTracking,
} from "../utils/memoryProfiler";

/**
 * Options for memory leak detection
 */
interface MemoryLeakDetectionOptions {
  /** Label for tracking session (defaults to component name) */
  label?: string;
  /** Percentage threshold to consider as memory leak */
  threshold?: number;
  /** Interval in ms to take snapshots */
  interval?: number;
  /** Whether to auto-start tracking on mount */
  autoStart?: boolean;
  /** Number of snapshots to take (-1 for continuous) */
  snapshotCount?: number;
  /** Whether to log progress to console */
  verbose?: boolean;
}

/**
 * Result of memory leak detection
 */
interface MemoryLeakDetectionResult {
  /** Start memory tracking */
  startTracking: () => void;
  /** Stop memory tracking and get results */
  stopTracking: () => {
    hasPotentialLeak: boolean;
    growthRate: number;
    elapsedTime: number;
  };
  /** Force taking a memory snapshot */
  takeSnapshot: () => void;
  /** Whether tracking is active */
  isTracking: boolean;
  /** Component name used for tracking */
  componentName: string;
}

/**
 * React hook for memory leak detection in components
 *
 * @param componentName Name of the component (used for tracking label if not provided)
 * @param options Configuration options
 * @returns Memory leak detection controls
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { startTracking, stopTracking, isTracking } = useMemoryLeakDetection('MyComponent');
 *
 *   useEffect(() => {
 *     return () => {
 *       const result = stopTracking();
 *       if (result.hasPotentialLeak) {
 *         console.error('Memory leak detected!', result);
 *       }
 *     };
 *   }, [stopTracking]);
 *
 *   return <div>My Component</div>;
 * };
 * ```
 */
export function useMemoryLeakDetection(
  componentName: string,
  options: MemoryLeakDetectionOptions = {},
): MemoryLeakDetectionResult {
  const {
    label = componentName,
    threshold = 15,
    interval = 1000,
    autoStart = true,
    snapshotCount = -1,
    verbose = false,
  } = options;

  const isTrackingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapshotCountRef = useRef(0);

  const clearInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTracking = () => {
    if (isTrackingRef.current) return;

    if (verbose) console.log(`Starting memory tracking for ${componentName}`);

    startMemoryTracking(label);
    isTrackingRef.current = true;
    snapshotCountRef.current = 0;

    // Set up interval for periodic snapshots
    clearInterval();
    if (interval > 0) {
      intervalRef.current = setInterval(() => {
        if (!isTrackingRef.current) {
          clearInterval();
          return;
        }

        updateMemoryTracking(label);
        snapshotCountRef.current++;

        if (verbose) {
          console.log(
            `Memory snapshot #${snapshotCountRef.current} taken for ${componentName}`,
          );
        }

        // Stop if we've reached the desired number of snapshots
        if (snapshotCount > 0 && snapshotCountRef.current >= snapshotCount) {
          clearInterval();
        }
      }, interval);
    }
  };

  const stopTracking = () => {
    if (!isTrackingRef.current) {
      return {
        hasPotentialLeak: false,
        growthRate: 0,
        elapsedTime: 0,
      };
    }

    clearInterval();
    isTrackingRef.current = false;

    if (verbose) console.log(`Stopping memory tracking for ${componentName}`);

    const result = stopMemoryTracking(label, threshold);
    return {
      hasPotentialLeak: result.hasPotentialLeak,
      growthRate: result.growthRate,
      elapsedTime: result.elapsedTime,
    };
  };

  // Force taking a snapshot
  const takeSnapshot = () => {
    if (!isTrackingRef.current) return;
    updateMemoryTracking(label);
    snapshotCountRef.current++;
  };

  // Auto-start on mount if requested
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    // Clean up on unmount
    return () => {
      if (isTrackingRef.current) {
        stopTracking();
      }
    };
  }, []);

  return {
    startTracking,
    stopTracking,
    takeSnapshot,
    isTracking: isTrackingRef.current,
    componentName,
  };
}

export default useMemoryLeakDetection;
