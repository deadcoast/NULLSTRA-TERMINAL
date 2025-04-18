import * as React from "react";
const {  useState  } = React;
import { PerformanceBudgets as PerformanceBudgetsType } from "../utils/automatedPerformanceTesting";

interface PerformanceBudgetsProps {
  initialBudgets?: PerformanceBudgetsType;
  onSave?: (budgets: PerformanceBudgetsType) => void;
  onTest?: (budgets: PerformanceBudgetsType) => void;
  lastTestResults?: {
    metric: string;
    value: number;
    budget: number;
    passed: boolean;
  }[];
  className?: string;
}

/**
 * Default performance budgets with recommended values
 */
const DEFAULT_BUDGETS: PerformanceBudgetsType = {
  maxAvgCommandExecutionTime: 100,
  maxP95CommandExecutionTime: 200,
  maxAvgRenderTime: 16, // ~60fps
  maxTotalResponseTime: 300,
  maxMemoryUsage: 100,
  minAvgFps: 45,
  maxInputLatency: 100,
  maxDomNodeCount: 1000,
};

/**
 * Descriptions for each metric
 */
const METRIC_DESCRIPTIONS: Record<string, string> = {
  maxAvgCommandExecutionTime: "Maximum average time to execute a command (ms)",
  maxP95CommandExecutionTime:
    "Maximum 95th percentile command execution time (ms)",
  maxAvgRenderTime: "Maximum average render time per frame (ms)",
  maxTotalResponseTime: "Maximum time from command to complete render (ms)",
  maxMemoryUsage: "Maximum memory usage (MB)",
  minAvgFps: "Minimum acceptable average FPS",
  maxInputLatency: "Maximum input latency (ms)",
  maxDomNodeCount: "Maximum DOM node count",
};

/**
 * Component for setting and managing performance budgets
 */
export default function PerformanceBudgets({
  initialBudgets,
  onSave,
  onTest,
  lastTestResults = [],
  className = "",
}: PerformanceBudgetsProps) {
  const [budgets, setBudgets] = useState<PerformanceBudgetsType>(
    initialBudgets || DEFAULT_BUDGETS,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Format a metric key for display
  const formatMetricName = (key: string): string => {
    // Remove prefix (max/min)
    let name = key;
    if (key.startsWith("max")) {
      name = key.substring(3);
    } else if (key.startsWith("min")) {
      name = key.substring(3);
    }

    // Convert camelCase to words with spaces
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Handle budget value changes
  const handleBudgetChange = (
    metric: keyof PerformanceBudgetsType,
    value: string,
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setBudgets((prev) => ({
        ...prev,
        [metric]: numValue,
      }));
    }
  };

  // Save budgets
  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(budgets);
    }
  };

  // Reset to default budgets
  const handleReset = () => {
    setBudgets(DEFAULT_BUDGETS);
  };

  // Run tests with current budgets
  const handleTest = () => {
    if (onTest) {
      onTest(budgets);
    }
  };

  // Find test result for a metric
  const getTestResult = (metric: string) => {
    // Convert budget key to metric key if needed (e.g., maxAvgRenderTime -> avgRenderTime)
    let metricKey = metric;
    if (metricKey.startsWith("max")) {
      metricKey =
        metricKey.substring(3, 4).toLowerCase() + metricKey.substring(4);
    } else if (metricKey.startsWith("min")) {
      metricKey =
        metricKey.substring(3, 4).toLowerCase() + metricKey.substring(4);
    }

    return lastTestResults.find((result) => result.metric === metricKey);
  };

  return (
    <div className={`performance-budgets ${className}`}>
      <div className="budgets-header">
        <h2>Performance Budgets</h2>
        <div className="budget-actions">
          {isEditing ? (
            <>
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button className="reset-button" onClick={handleReset}>
                Reset to Defaults
              </button>
            </>
          ) : (
            <>
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Budgets
              </button>
              <button className="test-button" onClick={handleTest}>
                Run Performance Test
              </button>
            </>
          )}
        </div>
      </div>

      <div className="budgets-table">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Description</th>
              <th>Budget</th>
              {lastTestResults.length > 0 && (
                <>
                  <th>Last Test</th>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(budgets).map(([metric, value]) => {
              const testResult = getTestResult(metric);
              return (
                <tr key={metric}>
                  <td>{formatMetricName(metric)}</td>
                  <td>
                    <span className="metric-description">
                      {METRIC_DESCRIPTIONS[metric] || ""}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          handleBudgetChange(
                            metric as keyof PerformanceBudgetsType,
                            e.target.value,
                          )
                        }
                        min={0}
                        step={
                          metric.includes("Fps")
                            ? 1
                            : metric.includes("Memory")
                              ? 10
                              : 5
                        }
                      />
                    ) : (
                      <span className="budget-value">{value}</span>
                    )}
                  </td>
                  {lastTestResults.length > 0 && (
                    <>
                      <td>
                        {testResult ? (
                          <span className="test-value">
                            {testResult.value.toFixed(2)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {testResult ? (
                          <span
                            className={`test-status ${
                              testResult.passed ? "passed" : "failed"
                            }`}
                          >
                            {testResult.passed ? "PASS" : "FAIL"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="budgets-info">
        <p>
          Performance budgets define acceptable thresholds for performance
          metrics. Automated tests will be evaluated against these budgets to
          ensure your application maintains its performance goals.
        </p>
        {lastTestResults.length > 0 && (
          <div className="test-summary">
            <h3>Last Test Summary</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">
                  {lastTestResults.filter((r) => r.passed).length}
                </span>
                <span className="stat-label">Passing</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {lastTestResults.filter((r) => !r.passed).length}
                </span>
                <span className="stat-label">Failing</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .performance-budgets {
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .budgets-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .budgets-header h2 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }

        .budget-actions {
          display: flex;
          gap: 10px;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .edit-button,
        .save-button {
          background-color: #4caf50;
          color: white;
        }

        .cancel-button {
          background-color: #f44336;
          color: white;
        }

        .reset-button {
          background-color: #ff9800;
          color: white;
        }

        .test-button {
          background-color: #2196f3;
          color: white;
        }

        .budgets-table {
          overflow-x: auto;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        th,
        td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f0f0f0;
          font-weight: 600;
          color: #333;
        }

        input[type="number"] {
          width: 80px;
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .metric-description {
          font-size: 14px;
          color: #666;
        }

        .budget-value {
          font-weight: 500;
        }

        .test-value {
          font-family: monospace;
        }

        .test-status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .test-status.passed {
          background-color: #dff0d8;
          color: #3c763d;
        }

        .test-status.failed {
          background-color: #f2dede;
          color: #a94442;
        }

        .budgets-info {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .test-summary {
          margin-top: 20px;
          padding: 15px;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .test-summary h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
        }

        .summary-stats {
          display: flex;
          gap: 20px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
