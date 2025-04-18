/**
 * Memory Profiler Utility
 *
 * This utility helps monitor and detect potential memory leaks in the application.
 * It provides functions to track memory usage over time and report on concerning patterns.
 */

type MemorySnapshot = {
  timestamp: number;
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  nodes: number;
  detachedNodes: number;
};

type MemorySeries = {
  snapshots: MemorySnapshot[];
  startTime: number;
  label: string;
};

/**
 * Global registry to store memory series by label
 */
const memorySeries: Record<string, MemorySeries> = {};

/**
 * Takes a snapshot of the current memory usage
 * @returns Memory snapshot object or null if not supported
 */
export const takeMemorySnapshot = (): MemorySnapshot | null => {
  // Check if performance memory API is available
  if (typeof performance === "undefined" || !(performance as any).memory) {
    console.warn(
      "Performance memory API not available. Run Chrome with --enable-precise-memory-info flag",
    );
    return null;
  }

  // Get memory info from performance API
  const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = (
    performance as any
  ).memory;

  // Get DOM node counts if possible
  let nodes = 0;
  const detachedNodes = 0;

  if (document && document.querySelectorAll) {
    nodes = document.querySelectorAll("*").length;

    // We can't directly count detached nodes, but we can look for potential issues
    // This is just a heuristic and might need refinement
    if (window.gc) {
      // Force garbage collection if available (requires --expose-gc flag)
      window.gc();
    }
  }

  return {
    timestamp: Date.now(),
    jsHeapSizeLimit,
    totalJSHeapSize,
    usedJSHeapSize,
    nodes,
    detachedNodes,
  };
};

/**
 * Start tracking memory usage with a given label
 * @param label Identifier for this memory tracking session
 * @returns The label of the started tracking session
 */
export const startMemoryTracking = (label: string = "default"): string => {
  const snapshot = takeMemorySnapshot();

  if (!snapshot) {
    return label;
  }

  memorySeries[label] = {
    snapshots: [snapshot],
    startTime: Date.now(),
    label,
  };

  console.info(`Memory tracking started: ${label}`);
  return label;
};

/**
 * Take a new snapshot and add it to an existing memory tracking session
 * @param label The label of the tracking session
 * @returns The updated series or null if not found
 */
export const updateMemoryTracking = (
  label: string = "default",
): MemorySeries | null => {
  if (!memorySeries[label]) {
    console.warn(`No memory tracking found with label: ${label}`);
    return null;
  }

  const snapshot = takeMemorySnapshot();
  if (!snapshot) {
    return memorySeries[label];
  }

  memorySeries[label].snapshots.push(snapshot);
  return memorySeries[label];
};

/**
 * Stop tracking memory and analyze for potential leaks
 * @param label The label of the tracking session
 * @param threshold Growth percentage that indicates a potential leak
 * @returns Analysis results
 */
export const stopMemoryTracking = (
  label: string = "default",
  threshold: number = 20,
): {
  hasPotentialLeak: boolean;
  growthRate: number;
  series: MemorySeries | null;
  elapsedTime: number;
} => {
  if (!memorySeries[label]) {
    console.warn(`No memory tracking found with label: ${label}`);
    return {
      hasPotentialLeak: false,
      growthRate: 0,
      series: null,
      elapsedTime: 0,
    };
  }

  // Take final snapshot
  const snapshot = takeMemorySnapshot();
  if (snapshot) {
    memorySeries[label].snapshots.push(snapshot);
  }

  const series = memorySeries[label];
  const firstSnapshot = series.snapshots[0];
  const lastSnapshot = series.snapshots[series.snapshots.length - 1];
  const elapsedTime = lastSnapshot.timestamp - firstSnapshot.timestamp;

  // Calculate growth rate
  const memoryGrowth =
    lastSnapshot.usedJSHeapSize - firstSnapshot.usedJSHeapSize;
  const growthRate = (memoryGrowth / firstSnapshot.usedJSHeapSize) * 100;

  // Check if growth exceeds threshold
  const hasPotentialLeak = growthRate > threshold;

  if (hasPotentialLeak) {
    console.warn(
      `Potential memory leak detected in "${label}". Memory grew by ${growthRate.toFixed(2)}% over ${elapsedTime}ms`,
    );
  } else {
    console.info(
      `Memory tracking "${label}" completed. Growth rate: ${growthRate.toFixed(2)}%`,
    );
  }

  // Store a copy of the series before deleting
  const seriesCopy = { ...series };

  // Clean up
  delete memorySeries[label];

  return {
    hasPotentialLeak,
    growthRate,
    series: seriesCopy,
    elapsedTime,
  };
};

/**
 * Track memory during a specific action or operation
 * @param action Function to execute and monitor for memory usage
 * @param label Optional label for this tracking session
 * @param threshold Growth percentage that indicates a potential leak
 * @returns Analysis results
 */
export const trackMemoryForAction = async (
  action: () => Promise<void> | void,
  label: string = `action-${Date.now()}`,
  threshold: number = 20,
): Promise<{
  hasPotentialLeak: boolean;
  growthRate: number;
  elapsedTime: number;
}> => {
  startMemoryTracking(label);

  try {
    // Execute the action
    await action();
  } catch (error) {
    console.error("Error during memory tracked action:", error);
  }

  // Final update
  updateMemoryTracking(label);

  const result = stopMemoryTracking(label, threshold);
  return {
    hasPotentialLeak: result.hasPotentialLeak,
    growthRate: result.growthRate,
    elapsedTime: result.elapsedTime,
  };
};

// Add a global hook for debugging if needed
if (typeof window !== "undefined") {
  (window as any).__memoryProfiler = {
    takeMemorySnapshot,
    startMemoryTracking,
    updateMemoryTracking,
    stopMemoryTracking,
    trackMemoryForAction,
    getSeries: (label: string) => memorySeries[label],
  };
}
