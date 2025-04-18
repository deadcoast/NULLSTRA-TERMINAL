import * as React from "react";
const {  useRef, useState  } = React;
import {
  BenchmarkConfig,
  BenchmarkResult,
  runTerminalBenchmark,
} from "../utils/terminalBenchmarker";

interface MultiSessionBenchmarkProps {
  defaultConfig?: Partial<BenchmarkConfig>;
  onComplete?: (result: BenchmarkResult) => void;
}

/**
 * Component for benchmarking multiple terminal sessions
 */
export default function MultiSessionBenchmark({
  defaultConfig,
  onComplete,
}: MultiSessionBenchmarkProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [config, setConfig] = useState<Partial<BenchmarkConfig>>({
    sessionCount: 3,
    duration: 30000,
    ...defaultConfig,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Start benchmark
  const startBenchmark = async () => {
    if (!containerRef.current) return;

    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const benchmarkResult = await runTerminalBenchmark(
        containerRef.current,
        config,
      );

      setResult(benchmarkResult);

      if (onComplete) {
        onComplete(benchmarkResult);
      }
    } catch (err) {
      setError(
        `Benchmark error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  // Update config
  const updateConfig = (key: keyof BenchmarkConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="multi-session-benchmark">
      <h2>Terminal Multi-Session Benchmark</h2>

      {/* Configuration controls */}
      <div className="benchmark-controls">
        <div className="form-group">
          <label htmlFor="session-count">Number of sessions:</label>
          <input
            id="session-count"
            type="number"
            min="1"
            max="10"
            value={config.sessionCount ?? 3}
            onChange={(e) =>
              updateConfig("sessionCount", parseInt(e.target.value))
            }
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (ms):</label>
          <input
            id="duration"
            type="number"
            min="5000"
            max="60000"
            step="1000"
            value={config.duration ?? 30000}
            onChange={(e) => updateConfig("duration", parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label htmlFor="simulate-typing">Simulate typing:</label>
          <input
            id="simulate-typing"
            type="checkbox"
            checked={config.simulateTyping ?? true}
            onChange={(e) => updateConfig("simulateTyping", e.target.checked)}
            disabled={isRunning}
          />
        </div>

        <button
          className="benchmark-button"
          onClick={startBenchmark}
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Start Benchmark"}
        </button>
      </div>

      {/* Error message */}
      {error && <div className="benchmark-error">{error}</div>}

      {/* Terminal sessions container */}
      <div className="terminal-container" ref={containerRef}></div>

      {/* Results display */}
      {result && (
        <div className="benchmark-results">
          <h3>Benchmark Results</h3>

          <div className="result-summary">
            <div className="result-item">
              <span className="result-label">Total Duration:</span>
              <span className="result-value">
                {(result.totalDuration / 1000).toFixed(2)}s
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Avg Command Execution:</span>
              <span className="result-value">
                {result.aggregateMetrics.avgCommandExecutionTime.toFixed(2)}ms
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">P95 Command Execution:</span>
              <span className="result-value">
                {result.aggregateMetrics.p95CommandExecutionTime.toFixed(2)}ms
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Avg Render Time:</span>
              <span className="result-value">
                {result.aggregateMetrics.avgRenderTime.toFixed(2)}ms
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Avg FPS:</span>
              <span className="result-value">
                {result.aggregateMetrics.avgFps.toFixed(1)}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Min FPS:</span>
              <span className="result-value">
                {result.aggregateMetrics.minFps}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Avg Memory Usage:</span>
              <span className="result-value">
                {result.aggregateMetrics.avgMemoryUsage.toFixed(2)} MB
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Peak Memory Usage:</span>
              <span className="result-value">
                {result.aggregateMetrics.peakMemoryUsage.toFixed(2)} MB
              </span>
            </div>
          </div>

          <h4>Session Metrics</h4>
          <table className="session-metrics-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Commands</th>
                <th>Avg Execution (ms)</th>
                <th>Avg Response (ms)</th>
                <th>Avg FPS</th>
              </tr>
            </thead>
            <tbody>
              {result.sessionMetrics.map((session) => {
                const avgExecution =
                  session.commandExecutionTime.length > 0
                    ? session.commandExecutionTime.reduce((a, b) => a + b, 0) /
                      session.commandExecutionTime.length
                    : 0;

                const avgResponse =
                  session.totalResponseTime.length > 0
                    ? session.totalResponseTime.reduce((a, b) => a + b, 0) /
                      session.totalResponseTime.length
                    : 0;

                const avgFps =
                  session.fps.length > 0
                    ? session.fps.reduce((a, b) => a + b, 0) /
                      session.fps.length
                    : 0;

                return (
                  <tr key={session.sessionId}>
                    <td>{session.sessionId}</td>
                    <td>{session.commandExecutionTime.length}</td>
                    <td>{avgExecution.toFixed(2)}</td>
                    <td>{avgResponse.toFixed(2)}</td>
                    <td>{avgFps.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add some basic styling */}
      <style jsx>{`
        .multi-session-benchmark {
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }

        .benchmark-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          align-items: center;
        }

        .form-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .benchmark-button {
          padding: 8px 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .benchmark-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .terminal-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .benchmark-error {
          padding: 10px;
          background-color: #ffebee;
          color: #c62828;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .benchmark-results {
          margin-top: 20px;
          border-top: 1px solid #eaeaea;
          padding-top: 20px;
        }

        .result-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .result-item {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
        }

        .result-label {
          font-weight: bold;
          margin-right: 8px;
          display: block;
          font-size: 0.8rem;
          color: #666;
        }

        .result-value {
          font-size: 1.1rem;
          color: #333;
        }

        .session-metrics-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .session-metrics-table th,
        .session-metrics-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #eaeaea;
        }

        .session-metrics-table th {
          background-color: #f5f5f5;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
