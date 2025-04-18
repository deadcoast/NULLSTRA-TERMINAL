/**
 * Automated Performance Testing Utility
 *
 * This utility provides tools for automated performance testing,
 * continuous monitoring, and CI/CD integration.
 */

import { performance } from "perf_hooks";
import { BenchmarkResult, runTerminalBenchmark } from "./terminalBenchmarker";

/**
 * Performance test configuration
 */
export interface PerformanceTestConfig {
  /** Test name for identification */
  name: string;
  /** Test description */
  description?: string;
  /** Container element selector */
  containerSelector: string;
  /** Number of test runs */
  runs: number;
  /** Benchmark configuration overrides */
  benchmarkConfig?: Record<string, any>;
  /** Performance budgets for metrics */
  budgets?: PerformanceBudgets;
  /** Baseline performance for comparison */
  baseline?: BaselineMetrics;
  /** Whether to automatically generate reports */
  generateReport?: boolean;
  /** Directory to save reports */
  reportDir?: string;
  /** Report format (html, json, csv) */
  reportFormat?: string[];
  /** Whether to fail on budget violation */
  failOnBudgetViolation?: boolean;
}

/**
 * Performance budgets for various metrics
 */
export interface PerformanceBudgets {
  /** Maximum average command execution time (ms) */
  maxAvgCommandExecutionTime?: number;
  /** Maximum 95th percentile command execution time (ms) */
  maxP95CommandExecutionTime?: number;
  /** Maximum average render time (ms) */
  maxAvgRenderTime?: number;
  /** Maximum total response time (ms) */
  maxTotalResponseTime?: number;
  /** Maximum memory usage (MB) */
  maxMemoryUsage?: number;
  /** Minimum average FPS */
  minAvgFps?: number;
  /** Maximum input latency (ms) */
  maxInputLatency?: number;
  /** Maximum DOM node count */
  maxDomNodeCount?: number;
}

/**
 * Baseline metrics for comparison
 */
export interface BaselineMetrics {
  /** Average command execution time (ms) */
  avgCommandExecutionTime?: number;
  /** 95th percentile command execution time (ms) */
  p95CommandExecutionTime?: number;
  /** Average render time (ms) */
  avgRenderTime?: number;
  /** Average total response time (ms) */
  avgTotalResponseTime?: number;
  /** Average memory usage (MB) */
  avgMemoryUsage?: number;
  /** Average FPS */
  avgFps?: number;
  /** Average input latency (ms) */
  avgInputLatency?: number;
}

/**
 * Budget violation result
 */
export interface BudgetViolation {
  /** Metric that violated the budget */
  metric: string;
  /** Budget value */
  budget: number;
  /** Actual value */
  actual: number;
  /** Amount over budget */
  overage: number;
  /** Percentage over budget */
  overagePercentage: number;
}

/**
 * Baseline comparison result
 */
export interface BaselineComparison {
  /** Metric being compared */
  metric: string;
  /** Baseline value */
  baseline: number;
  /** Current value */
  current: number;
  /** Absolute change */
  change: number;
  /** Percentage change */
  changePercentage: number;
  /** Whether change is an improvement */
  isImprovement: boolean;
}

/**
 * Performance test result
 */
export interface PerformanceTestResult {
  /** Test configuration */
  config: PerformanceTestConfig;
  /** Test start time */
  startTime: number;
  /** Test end time */
  endTime: number;
  /** Total duration of all tests */
  totalDuration: number;
  /** Individual benchmark results */
  benchmarkResults: BenchmarkResult[];
  /** Aggregated metrics from all runs */
  aggregatedMetrics: Record<string, number>;
  /** Budget violations (if applicable) */
  budgetViolations: BudgetViolation[];
  /** Comparison to baseline (if applicable) */
  baselineComparisons: BaselineComparison[];
  /** Whether the test passed performance budgets */
  passedBudgets: boolean;
  /** Whether the test improved over baseline */
  improvedOverBaseline: boolean;
  /** Test environment information */
  environment: {
    /** User agent string */
    userAgent: string;
    /** Window dimensions */
    windowDimensions: { width: number; height: number };
    /** Device pixel ratio */
    devicePixelRatio: number;
    /** CPU cores */
    cpuCores: number;
    /** Memory info (if available) */
    memory?: Record<string, any>;
  };
}

/**
 * Run automated performance tests
 */
export async function runPerformanceTests(
  config: PerformanceTestConfig,
): Promise<PerformanceTestResult> {
  const startTime = performance.now();
  const benchmarkResults: BenchmarkResult[] = [];
  let containerElement: HTMLElement | null = null;

  // Find container element
  if (typeof document !== "undefined") {
    containerElement = document.querySelector(config.containerSelector);
    if (!containerElement) {
      throw new Error(
        `Container element not found: ${config.containerSelector}`,
      );
    }
  } else {
    throw new Error(
      "Document not available - are you running in a browser context?",
    );
  }

  try {
    // Run tests
    for (let i = 0; i < config.runs; i++) {
      const result = await runTerminalBenchmark(
        containerElement,
        config.benchmarkConfig,
      );
      benchmarkResults.push(result);

      // Add a small delay between runs to avoid potential issues
      if (i < config.runs - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Calculate aggregated metrics
    const aggregatedMetrics = aggregateMetrics(benchmarkResults);

    // Check budget violations
    const budgetViolations = checkBudgetViolations(
      aggregatedMetrics,
      config.budgets || {},
    );

    // Compare with baseline
    const baselineComparisons = compareWithBaseline(
      aggregatedMetrics,
      config.baseline || {},
    );

    // Determine if passed budgets
    const passedBudgets = budgetViolations.length === 0;

    // Determine if improved over baseline
    const improvedOverBaseline =
      baselineComparisons.filter((c) => c.isImprovement).length >
      baselineComparisons.filter((c) => !c.isImprovement).length;

    // Gather environment information
    const environment = {
      userAgent: navigator.userAgent,
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      devicePixelRatio: window.devicePixelRatio,
      cpuCores: navigator.hardwareConcurrency || 1,
      memory: (performance as any).memory
        ? {
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          }
        : undefined,
    };

    // Generate result
    const result: PerformanceTestResult = {
      config,
      startTime,
      endTime: performance.now(),
      totalDuration: performance.now() - startTime,
      benchmarkResults,
      aggregatedMetrics,
      budgetViolations,
      baselineComparisons,
      passedBudgets,
      improvedOverBaseline,
      environment,
    };

    // Generate report if needed
    if (config.generateReport) {
      generatePerformanceReport(result, config);
    }

    // Handle CI/CD integration
    if (config.failOnBudgetViolation && !passedBudgets) {
      console.error(`
        Performance budget violations detected:
        ${budgetViolations
          .map(
            (v) => `
          - ${v.metric}: ${v.actual} (budget: ${v.budget}, overage: ${v.overage}, ${v.overagePercentage.toFixed(2)}%)
        `,
          )
          .join("")}
      `);

      // In CI environment, you could throw an error or set process.exitCode
      // to make the CI pipeline fail
    }

    return result;
  } catch (error) {
    console.error("Error running performance tests:", error);
    throw error;
  }
}

/**
 * Aggregate metrics from multiple benchmark results
 */
function aggregateMetrics(results: BenchmarkResult[]): Record<string, number> {
  if (results.length === 0) {
    return {};
  }

  const metrics: Record<string, number[]> = {
    avgCommandExecutionTime: [],
    p95CommandExecutionTime: [],
    maxCommandExecutionTime: [],
    avgRenderTime: [],
    avgTotalResponseTime: [],
    avgMemoryUsage: [],
    peakMemoryUsage: [],
    avgFps: [],
    minFps: [],
    avgInputLatency: [],
  };

  // Collect metrics from all results
  results.forEach((result) => {
    const { aggregateMetrics } = result;

    Object.keys(aggregateMetrics).forEach((key) => {
      if (metrics[key]) {
        metrics[key].push(
          aggregateMetrics[key as keyof typeof aggregateMetrics],
        );
      }
    });
  });

  // Average the metrics
  const aggregated: Record<string, number> = {};

  Object.keys(metrics).forEach((key) => {
    const values = metrics[key];
    if (values.length > 0) {
      aggregated[key] =
        values.reduce((sum, val) => sum + val, 0) / values.length;
    }
  });

  // For min/max metrics, take the worst case
  if (metrics.minFps.length > 0) {
    aggregated.minFps = Math.min(...metrics.minFps);
  }

  if (metrics.peakMemoryUsage.length > 0) {
    aggregated.peakMemoryUsage = Math.max(...metrics.peakMemoryUsage);
  }

  if (metrics.maxCommandExecutionTime.length > 0) {
    aggregated.maxCommandExecutionTime = Math.max(
      ...metrics.maxCommandExecutionTime,
    );
  }

  return aggregated;
}

/**
 * Check for budget violations
 */
function checkBudgetViolations(
  metrics: Record<string, number>,
  budgets: PerformanceBudgets,
): BudgetViolation[] {
  const violations: BudgetViolation[] = [];

  // Check each budget
  Object.entries(budgets).forEach(([budgetKey, budgetValue]) => {
    if (typeof budgetValue !== "number") return;

    // Convert budget key to metric key (e.g., maxAvgRenderTime -> avgRenderTime)
    let metricKey = budgetKey;
    if (metricKey.startsWith("max")) {
      metricKey =
        metricKey.substring(3, 4).toLowerCase() + metricKey.substring(4);
    } else if (metricKey.startsWith("min")) {
      metricKey =
        metricKey.substring(3, 4).toLowerCase() + metricKey.substring(4);
    }

    const metricValue = metrics[metricKey];
    if (typeof metricValue !== "number") return;

    // Check for violation
    let isViolation = false;
    let overage = 0;

    if (budgetKey.startsWith("max") && metricValue > budgetValue) {
      isViolation = true;
      overage = metricValue - budgetValue;
    } else if (budgetKey.startsWith("min") && metricValue < budgetValue) {
      isViolation = true;
      overage = budgetValue - metricValue;
    }

    if (isViolation) {
      violations.push({
        metric: metricKey,
        budget: budgetValue,
        actual: metricValue,
        overage,
        overagePercentage: (overage / budgetValue) * 100,
      });
    }
  });

  return violations;
}

/**
 * Compare metrics with baseline
 */
function compareWithBaseline(
  metrics: Record<string, number>,
  baseline: BaselineMetrics,
): BaselineComparison[] {
  const comparisons: BaselineComparison[] = [];

  // Compare each metric with baseline
  Object.entries(baseline).forEach(([metricKey, baselineValue]) => {
    if (typeof baselineValue !== "number") return;

    const currentValue = metrics[metricKey];
    if (typeof currentValue !== "number") return;

    const change = currentValue - baselineValue;
    const changePercentage = (change / baselineValue) * 100;

    // Determine if change is an improvement
    // For most metrics, lower is better (execution time, latency, etc.)
    // For some metrics, higher is better (FPS)
    let isImprovement = change < 0;
    if (metricKey === "avgFps" || metricKey === "minFps") {
      isImprovement = change > 0;
    }

    comparisons.push({
      metric: metricKey,
      baseline: baselineValue,
      current: currentValue,
      change,
      changePercentage,
      isImprovement,
    });
  });

  return comparisons;
}

/**
 * Generate performance test report
 */
function generatePerformanceReport(
  result: PerformanceTestResult,
  config: PerformanceTestConfig,
): void {
  // This is a simplified implementation
  // A real implementation would save reports to disk in CI environments
  // or generate visual HTML reports with charts

  const reportFormats = config.reportFormat || ["json"];

  if (reportFormats.includes("json")) {
    const jsonReport = JSON.stringify(result, null, 2);
    console.log("Performance Report (JSON):", jsonReport);

    // In a CI environment, you would save this to a file
    // fs.writeFileSync(`${config.reportDir}/${config.name}.json`, jsonReport);
  }

  if (reportFormats.includes("csv")) {
    // Generate CSV report
    const csvLines = [
      // Header
      "Metric,Value,Baseline,Change,Change %,Budget,Status",
      // Data rows
      ...Object.entries(result.aggregatedMetrics).map(([metric, value]) => {
        const baseline =
          result.baselineComparisons.find((c) => c.metric === metric)
            ?.baseline || "";
        const change =
          result.baselineComparisons.find((c) => c.metric === metric)?.change ||
          "";
        const changePercentage =
          result.baselineComparisons
            .find((c) => c.metric === metric)
            ?.changePercentage?.toFixed(2) || "";
        const budget =
          result.budgetViolations.find((v) => v.metric === metric)?.budget ||
          "";
        const status = result.budgetViolations.find((v) => v.metric === metric)
          ? "FAIL"
          : "PASS";

        return `${metric},${value},${baseline},${change},${changePercentage},${budget},${status}`;
      }),
    ].join("\n");

    console.log("Performance Report (CSV):", csvLines);
  }

  // Log summary
  console.log(`
    Performance Test Summary:
    - Test: ${config.name}
    - Duration: ${(result.totalDuration / 1000).toFixed(2)}s
    - Runs: ${result.benchmarkResults.length}
    - Budget Violations: ${result.budgetViolations.length}
    - Baseline Improvement: ${result.improvedOverBaseline ? "Yes" : "No"}
  `);
}

/**
 * Create a performance test runner with default configuration
 */
export function createPerformanceTestRunner(
  defaultConfig: Partial<PerformanceTestConfig>,
) {
  return (config: Partial<PerformanceTestConfig>) => {
    return runPerformanceTests({
      name: "Default Performance Test",
      runs: 3,
      containerSelector: "#terminal-container",
      generateReport: true,
      failOnBudgetViolation: false,
      ...defaultConfig,
      ...config,
    });
  };
}

/**
 * CI/CD integration helper
 */
export function runCiPerformanceTest(
  config: PerformanceTestConfig,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create container element if needed
      if (
        typeof document !== "undefined" &&
        !document.querySelector(config.containerSelector)
      ) {
        const container = document.createElement("div");
        container.id = config.containerSelector.replace(/[^a-zA-Z0-9]/g, "");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "-9999px";
        container.style.width = "1000px";
        container.style.height = "800px";
        document.body.appendChild(container);
      }

      // Run tests with CI-specific configuration
      const result = await runPerformanceTests({
        ...config,
        failOnBudgetViolation: true,
        generateReport: true,
      });

      // In CI environment, output results in appropriate format
      if (typeof process !== "undefined" && process.env.CI) {
        // Output GitHub Actions annotations
        if (process.env.GITHUB_ACTIONS) {
          result.budgetViolations.forEach((violation) => {
            console.log(
              `::error::Performance budget violation: ${violation.metric} = ${violation.actual} (budget: ${violation.budget})`,
            );
          });
        }

        // Exit with error code if budget violations and configured to fail
        if (config.failOnBudgetViolation && !result.passedBudgets) {
          if (typeof process !== "undefined") {
            process.exitCode = 1;
          }
          reject(new Error("Performance budget violations detected"));
          return;
        }
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export default {
  runPerformanceTests,
  createPerformanceTestRunner,
  runCiPerformanceTest,
};
