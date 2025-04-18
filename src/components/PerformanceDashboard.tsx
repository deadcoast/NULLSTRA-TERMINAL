import * as React from "react";
const {  useEffect, useState  } = React;
import { PerformanceTestResult } from "../utils/automatedPerformanceTesting";
import PerformanceBudgets from "./PerformanceBudgets";

interface MetricData {
  timestamp: number;
  value: number;
}

interface MetricHistory {
  [metric: string]: MetricData[];
}

interface PerformanceDashboardProps {
  testResults?: PerformanceTestResult[];
  onRunTest?: () => Promise<PerformanceTestResult>;
  onUpdateBudgets?: (budgets: any) => void;
}

/**
 * Performance Dashboard Component
 *
 * Displays performance metrics, historical trends, and budget status
 */
export default function PerformanceDashboard({
  testResults = [],
  onRunTest,
  onUpdateBudgets,
}: PerformanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "metrics" | "budgets" | "history"
  >("overview");
  const [metricHistory, setMetricHistory] = useState<MetricHistory>({});
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<{
    lastTest: PerformanceTestResult | null;
    budgetViolations: number;
    metricsImproving: number;
    metricsDeclining: number;
    totalTests: number;
  }>({
    lastTest: null,
    budgetViolations: 0,
    metricsImproving: 0,
    metricsDeclining: 0,
    totalTests: 0,
  });

  // Process test results and update dashboard data
  useEffect(() => {
    if (testResults.length === 0) return;

    // Extract metric history
    const history: MetricHistory = { ...metricHistory };

    testResults.forEach((result) => {
      const timestamp = result.endTime;

      Object.entries(result.aggregatedMetrics).forEach(([metric, value]) => {
        if (!history[metric]) {
          history[metric] = [];
        }

        history[metric].push({ timestamp, value });

        // Sort by timestamp
        history[metric].sort((a, b) => a.timestamp - b.timestamp);

        // Keep only last 50 data points
        if (history[metric].length > 50) {
          history[metric] = history[metric].slice(-50);
        }
      });
    });

    setMetricHistory(history);

    // Update dashboard data
    const lastTest = testResults[testResults.length - 1];
    const budgetViolations = lastTest.budgetViolations.length;

    // Analyze trends
    let improving = 0;
    let declining = 0;

    Object.entries(history).forEach(([metric, data]) => {
      if (data.length < 2) return;

      const latest = data[data.length - 1].value;
      const previous = data[data.length - 2].value;
      const change = latest - previous;

      // For most metrics, lower is better (except FPS)
      if (metric.includes("Fps")) {
        if (change > 0) improving++;
        else if (change < 0) declining++;
      } else if (change < 0) improving++;
      else if (change > 0) declining++;
    });

    setDashboardData({
      lastTest,
      budgetViolations,
      metricsImproving: improving,
      metricsDeclining: declining,
      totalTests: testResults.length,
    });

    // Set default selected metric
    if (!selectedMetric && Object.keys(history).length > 0) {
      setSelectedMetric(Object.keys(history)[0]);
    }
  }, [testResults]);

  // Run a performance test
  const runTest = async () => {
    if (!onRunTest || isRunningTest) return;

    setIsRunningTest(true);

    try {
      await onRunTest();
    } catch (error) {
      console.error("Error running performance test:", error);
    } finally {
      setIsRunningTest(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Format metric value for display (with appropriate units)
  const formatMetricValue = (metric: string, value: number): string => {
    if (metric.includes("Time")) {
      return `${value.toFixed(2)} ms`;
    } else if (metric.includes("Fps")) {
      return `${value.toFixed(1)} fps`;
    } else if (metric.includes("Memory")) {
      return `${value.toFixed(1)} MB`;
    } else if (metric.includes("Count")) {
      return Math.round(value).toString();
    }
    return value.toFixed(2);
  };

  // Get color for metric trending
  const getTrendColor = (metric: string, change: number): string => {
    if (change === 0) return "#999";

    // For most metrics, lower is better (except FPS)
    if (metric.includes("Fps")) {
      return change > 0 ? "#4caf50" : "#f44336";
    }
    return change < 0 ? "#4caf50" : "#f44336";
  };

  // Get trending icon
  const getTrendIcon = (change: number): string => {
    if (change === 0) return "→";
    return change > 0 ? "↑" : "↓";
  };

  // Calculate metric change
  const calculateMetricChange = (
    metric: string,
  ): { value: number; percent: number } | null => {
    const data = metricHistory[metric];
    if (!data || data.length < 2) return null;

    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    const change = latest - previous;
    const percentChange = previous !== 0 ? (change / previous) * 100 : 0;

    return { value: change, percent: percentChange };
  };

  // Get last test results formatted for the PerformanceBudgets component
  const getFormattedTestResults = () => {
    if (!dashboardData.lastTest) return [];

    const { lastTest } = dashboardData;

    return lastTest.budgetViolations
      .map((violation) => ({
        metric: violation.metric,
        value: violation.actual,
        budget: violation.budget,
        passed: false,
      }))
      .concat(
        Object.entries(lastTest.aggregatedMetrics)
          .filter(
            ([metric]) =>
              !lastTest.budgetViolations.some((v) => v.metric === metric),
          )
          .map(([metric, value]) => {
            // Find the corresponding budget (if any)
            const budgetKey = `max${metric
              .charAt(0)
              .toUpperCase()}${metric.slice(1)}`;
            const minBudgetKey = `min${metric
              .charAt(0)
              .toUpperCase()}${metric.slice(1)}`;
            const budget =
              lastTest.config.budgets?.[
                budgetKey as keyof typeof lastTest.config.budgets
              ] ||
              lastTest.config.budgets?.[
                minBudgetKey as keyof typeof lastTest.config.budgets
              ];

            return {
              metric,
              value,
              budget: budget || 0,
              passed: true,
            };
          }),
      );
  };

  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h1>Performance Dashboard</h1>
        <button
          className="run-test-button"
          disabled={isRunningTest}
          onClick={runTest}
        >
          {isRunningTest ? "Running Test..." : "Run Performance Test"}
        </button>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "metrics" ? "active" : ""}
          onClick={() => setActiveTab("metrics")}
        >
          Metrics
        </button>
        <button
          className={activeTab === "budgets" ? "active" : ""}
          onClick={() => setActiveTab("budgets")}
        >
          Budgets
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="overview-cards">
              <div className="overview-card">
                <h3>Tests Run</h3>
                <div className="card-value">{dashboardData.totalTests}</div>
                <div className="card-footer">
                  {dashboardData.lastTest && (
                    <span>
                      Last run:{" "}
                      {formatTimestamp(dashboardData.lastTest.endTime)}
                    </span>
                  )}
                </div>
              </div>

              <div className="overview-card">
                <h3>Budget Violations</h3>
                <div
                  className={`card-value ${
                    dashboardData.budgetViolations > 0 ? "negative" : "positive"
                  }`}
                >
                  {dashboardData.budgetViolations}
                </div>
                <div className="card-footer">
                  {dashboardData.budgetViolations > 0
                    ? "Action needed"
                    : "All tests passing"}
                </div>
              </div>

              <div className="overview-card">
                <h3>Trends</h3>
                <div className="card-value">
                  <span className="trend-value positive">
                    {dashboardData.metricsImproving} <span>↑</span>
                  </span>
                  <span className="trend-separator">/</span>
                  <span className="trend-value negative">
                    {dashboardData.metricsDeclining} <span>↓</span>
                  </span>
                </div>
                <div className="card-footer">
                  {dashboardData.metricsImproving >
                  dashboardData.metricsDeclining
                    ? "Improving overall"
                    : "Needs attention"}
                </div>
              </div>
            </div>

            {dashboardData.lastTest && (
              <div className="recent-test-summary">
                <h3>Recent Test Summary</h3>
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Previous</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dashboardData.lastTest.aggregatedMetrics)
                      .slice(0, 6) // Show first 6 metrics for overview
                      .map(([metric, value]) => {
                        const change = calculateMetricChange(metric);
                        const previous = change ? value - change.value : null;

                        return (
                          <tr key={metric}>
                            <td>{metric}</td>
                            <td>{formatMetricValue(metric, value)}</td>
                            <td>
                              {previous !== null
                                ? formatMetricValue(metric, previous)
                                : "-"}
                            </td>
                            <td>
                              {change && (
                                <span
                                  className="trend"
                                  style={{
                                    color: getTrendColor(metric, change.value),
                                  }}
                                >
                                  {getTrendIcon(change.value)}{" "}
                                  {Math.abs(change.percent).toFixed(1)}%
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === "metrics" && (
          <div className="metrics-tab">
            <div className="metrics-selector">
              <label htmlFor="metric-select">Select Metric:</label>
              <select
                id="metric-select"
                value={selectedMetric || ""}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                {Object.keys(metricHistory).map((metric) => (
                  <option key={metric} value={metric}>
                    {metric}
                  </option>
                ))}
              </select>
            </div>

            {selectedMetric && metricHistory[selectedMetric] && (
              <>
                <div className="metric-chart">
                  <h3>{selectedMetric}</h3>
                  <div className="chart-container">
                    {metricHistory[selectedMetric].length > 1 ? (
                      <div className="chart">
                        {metricHistory[selectedMetric].map((data, index) => {
                          const values = metricHistory[selectedMetric].map(
                            (d) => d.value,
                          );
                          const min = Math.min(...values);
                          const max = Math.max(...values);
                          const range = max - min || 1;
                          const height =
                            100 - ((data.value - min) / range) * 100;

                          return (
                            <div
                              key={index}
                              className="chart-bar"
                              style={{ height: `${height}%` }}
                              title={`${formatTimestamp(
                                data.timestamp,
                              )}: ${formatMetricValue(
                                selectedMetric,
                                data.value,
                              )}`}
                              data-value={formatMetricValue(
                                selectedMetric,
                                data.value,
                              )}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="no-data">
                        Not enough data points to show chart
                      </div>
                    )}
                  </div>
                </div>

                <div className="metric-stats">
                  <div className="stat-card">
                    <h4>Current</h4>
                    <div className="stat-value">
                      {formatMetricValue(
                        selectedMetric,
                        metricHistory[selectedMetric][
                          metricHistory[selectedMetric].length - 1
                        ].value,
                      )}
                    </div>
                  </div>

                  <div className="stat-card">
                    <h4>Average</h4>
                    <div className="stat-value">
                      {formatMetricValue(
                        selectedMetric,
                        metricHistory[selectedMetric].reduce(
                          (sum, d) => sum + d.value,
                          0,
                        ) / metricHistory[selectedMetric].length,
                      )}
                    </div>
                  </div>

                  <div className="stat-card">
                    <h4>Min</h4>
                    <div className="stat-value">
                      {formatMetricValue(
                        selectedMetric,
                        Math.min(
                          ...metricHistory[selectedMetric].map((d) => d.value),
                        ),
                      )}
                    </div>
                  </div>

                  <div className="stat-card">
                    <h4>Max</h4>
                    <div className="stat-value">
                      {formatMetricValue(
                        selectedMetric,
                        Math.max(
                          ...metricHistory[selectedMetric].map((d) => d.value),
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === "budgets" && (
          <div className="budgets-tab">
            <PerformanceBudgets
              initialBudgets={dashboardData.lastTest?.config.budgets}
              lastTestResults={getFormattedTestResults()}
              onSave={onUpdateBudgets}
              onTest={runTest}
            />
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="history-tab">
            <h3>Test History</h3>

            {testResults.length > 0 ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Budgets</th>
                    <th>Improvements</th>
                    <th>Environment</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults
                    .slice()
                    .reverse()
                    .map((result, index) => (
                      <tr key={index}>
                        <td>{formatTimestamp(result.endTime)}</td>
                        <td>{(result.totalDuration / 1000).toFixed(2)}s</td>
                        <td>
                          <span
                            className={
                              result.passedBudgets ? "tag success" : "tag error"
                            }
                          >
                            {result.passedBudgets
                              ? "PASS"
                              : `${result.budgetViolations.length} violations`}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              result.improvedOverBaseline
                                ? "tag success"
                                : "tag warning"
                            }
                          >
                            {result.improvedOverBaseline
                              ? "Improved"
                              : "Declined"}
                          </span>
                        </td>
                        <td>
                          <div className="environment-info">
                            <span>
                              {result.environment.userAgent.split(" ")[0]}
                            </span>
                            <span>
                              {result.environment.windowDimensions.width}x
                              {result.environment.windowDimensions.height}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No test history available</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .performance-dashboard {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .dashboard-header h1 {
          margin: 0;
          font-size: 28px;
          color: #333;
        }
        
        .run-test-button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .run-test-button:hover {
          background-color: #3367d6;
        }
        
        .run-test-button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }
        
        .dashboard-tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }
        
        .dashboard-tabs button {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        
        .dashboard-tabs button:hover {
          color: #333;
          border-bottom-color: #ccc;
        }
        
        .dashboard-tabs button.active {
          color: #4285f4;
          border-bottom-color: #4285f4;
        }
        
        .dashboard-content {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          min-height: 400px;
        }
        
        /* Overview Tab */
        .overview-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .overview-card {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .overview-card h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 16px;
          color: #666;
        }
        
        .card-value {
          font-size: 36px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }
        
        .card-value.positive {
          color: #0f9d58;
        }
        
        .card-value.negative {
          color: #db4437;
        }
        
        .card-footer {
          font-size: 14px;
          color: #666;
        }
        
        .trend-value {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        
        .trend-value.positive {
          color: #0f9d58;
        }
        
        .trend-value.negative {
          color: #db4437;
        }
        
        .trend-separator {
          margin: 0 10px;
          color: #999;
        }
        
        .recent-test-summary {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .recent-test-summary h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
        }
        
        .summary-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .summary-table th,
        .summary-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .summary-table th {
          color: #666;
          font-weight: 500;
        }
        
        .trend {
          display: inline-block;
          font-weight: 500;
        }
        
        /* Metrics Tab */
        .metrics-selector {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .metrics-selector label {
          font-weight: 500;
        }
        
        .metrics-selector select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
          min-width: 200px;
        }
        
        .metric-chart {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .metric-chart h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
        }
        
        .chart-container {
          height: 300px;
          position: relative;
        }
        
        .chart {
          display: flex;
          align-items: flex-end;
          height: 100%;
          gap: 2px;
        }
        
        .chart-bar {
          flex: 1;
          background-color: #4285f4;
          min-width: 5px;
          position: relative;
          transition: height 0.3s;
        }
        
        .chart-bar:hover::after {
          content: attr(data-value);
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
        }
        
        .metric-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
        }
        
        .stat-card {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .stat-card h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 14px;
          color: #666;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: 500;
          color: #333;
        }
        
        /* History Tab */
        .history-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .history-table th,
        .history-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .history-table th {
          background-color: #f5f5f5;
          font-weight: 500;
          color: #666;
        }
        
        .tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .tag.success {
          background-color: #e8f5e9;
          color: #0f9d58;
        }
        
        .tag.warning {
          background-color: #fff8e1;
          color: #f4b400;
        }
        
        .tag.error {
          background-color: #fbe9e7;
          color: #db4437;
        }
        
        .environment-info {
          display: flex;
          flex-direction: column;
          font-size: 12px;
        }
        
        .no-data {
          padding: 30px;
          text-align: center;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
