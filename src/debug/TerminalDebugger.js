/**
 * Terminal Debugger Tool - Provides advanced debugging capabilities for MidaTerminal
 */

class TerminalDebugger {
  constructor(terminal) {
    this.terminal = terminal;
    this.logs = [];
    this.performance = {
      commands: {},
      operations: {},
    };
    this.errorTraces = [];
    this.filters = {
      level: "info",
      sources: [],
    };
    this.active = false;
    this.visualizationAttached = false;
    this.initialize();
  }

  /**
   * Initialize debugger and set up event listeners
   */
  initialize() {
    // Attach event listeners to terminal
    if (this.terminal) {
      this.terminal.on("command", this.trackCommand.bind(this));
      this.terminal.on("error", this.traceError.bind(this));
    }
  }

  /**
   * Enable debugger
   */
  enable() {
    this.active = true;
    console.log("Terminal debugger enabled");
    return this;
  }

  /**
   * Disable debugger
   */
  disable() {
    this.active = false;
    console.log("Terminal debugger disabled");
    return this;
  }

  /**
   * Track command execution time and result
   */
  trackCommand(command, startTime = Date.now()) {
    if (!this.active) return;

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!this.performance.commands[command]) {
      this.performance.commands[command] = {
        count: 0,
        totalTime: 0,
        averageTime: 0,
        executions: [],
      };
    }

    const stats = this.performance.commands[command];
    stats.count++;
    stats.totalTime += duration;
    stats.averageTime = stats.totalTime / stats.count;
    stats.executions.push({
      timestamp: new Date().toISOString(),
      duration,
      success: true, // Can be updated by error handler
    });

    this.log("debug", `Command executed: ${command} (${duration}ms)`);
  }

  /**
   * Trace error with stack and context
   */
  traceError(error, context = {}) {
    if (!this.active) return;

    const trace = {
      timestamp: new Date().toISOString(),
      error: error.message || String(error),
      stack: error.stack,
      context,
    };

    this.errorTraces.push(trace);
    this.log("error", `Error: ${error.message}`, trace);

    // Update performance stats if this was a command error
    if (context.command && this.performance.commands[context.command]) {
      const lastExecution =
        this.performance.commands[context.command].executions.slice(-1)[0];
      if (lastExecution) {
        lastExecution.success = false;
        lastExecution.error = error.message;
      }
    }

    return trace;
  }

  /**
   * Log message to debugger console
   */
  log(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(logEntry);

    // Apply filtering
    if (this.shouldLog(logEntry)) {
      const levelStyles = {
        error: "color: red; font-weight: bold",
        warn: "color: orange",
        info: "color: blue",
        debug: "color: gray",
      };

      console.log(
        `%c[Terminal Debugger][${level.toUpperCase()}]`,
        levelStyles[level] || "",
        message,
        data || "",
      );
    }

    return logEntry;
  }

  /**
   * Check if log entry should be displayed based on filters
   */
  shouldLog(entry) {
    const levelPriority = { error: 0, warn: 1, info: 2, debug: 3 };

    // Filter by level
    if (levelPriority[entry.level] > levelPriority[this.filters.level]) {
      return false;
    }

    // Filter by source
    if (this.filters.sources.length > 0) {
      if (!entry.data || !entry.data.source) return false;
      return this.filters.sources.includes(entry.data.source);
    }

    return true;
  }

  /**
   * Set log filter level
   */
  setFilterLevel(level) {
    if (["error", "warn", "info", "debug"].includes(level)) {
      this.filters.level = level;
      return true;
    }
    return false;
  }

  /**
   * Add source filter
   */
  addSourceFilter(source) {
    if (!this.filters.sources.includes(source)) {
      this.filters.sources.push(source);
    }
    return this.filters.sources;
  }

  /**
   * Clear source filters
   */
  clearSourceFilters() {
    this.filters.sources = [];
    return true;
  }

  /**
   * Search logs using query string or regex
   */
  searchLogs(query) {
    const searchRegex =
      typeof query === "string" ? new RegExp(query, "i") : query;

    return this.logs.filter((entry) => {
      return (
        searchRegex.test(entry.message) ||
        (entry.data && searchRegex.test(JSON.stringify(entry.data)))
      );
    });
  }

  /**
   * Get command performance statistics
   */
  getCommandStats(command = null) {
    if (command) {
      return this.performance.commands[command] || null;
    }
    return this.performance.commands;
  }

  /**
   * Get all error traces
   */
  getErrorTraces() {
    return this.errorTraces;
  }

  /**
   * Attach visualization to DOM
   */
  attachVisualization(container) {
    if (!container || this.visualizationAttached) return false;

    // Create debugger UI
    const debuggerEl = document.createElement("div");
    debuggerEl.className = "terminal-debugger-ui";
    debuggerEl.innerHTML = `
      <div class="debugger-header">
        <h3>Terminal Debugger</h3>
        <div class="debugger-controls">
          <button id="clear-logs">Clear Logs</button>
          <select id="log-level">
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info" selected>Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
      </div>
      <div class="debugger-tabs">
        <button class="tab-btn active" data-tab="logs">Logs</button>
        <button class="tab-btn" data-tab="errors">Errors</button>
        <button class="tab-btn" data-tab="performance">Performance</button>
      </div>
      <div class="debugger-content">
        <div class="tab-content active" id="logs-tab">
          <div class="log-entries"></div>
        </div>
        <div class="tab-content" id="errors-tab">
          <div class="error-traces"></div>
        </div>
        <div class="tab-content" id="performance-tab">
          <div class="performance-stats"></div>
        </div>
      </div>
    `;

    container.appendChild(debuggerEl);

    // Add basic styles
    const style = document.createElement("style");
    style.textContent = `
      .terminal-debugger-ui {
        font-family: monospace;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
        max-height: 400px;
        display: flex;
        flex-direction: column;
      }
      .debugger-header {
        background: #f1f1f1;
        padding: 8px;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .debugger-header h3 {
        margin: 0;
      }
      .debugger-tabs {
        display: flex;
        background: #e1e1e1;
      }
      .tab-btn {
        border: none;
        background: none;
        padding: 8px 16px;
        cursor: pointer;
      }
      .tab-btn.active {
        background: #fff;
        border-bottom: 2px solid #0066ff;
      }
      .debugger-content {
        flex: 1;
        overflow: auto;
        background: #fff;
      }
      .tab-content {
        display: none;
        padding: 10px;
        height: 300px;
        overflow: auto;
      }
      .tab-content.active {
        display: block;
      }
      .log-entry {
        margin-bottom: 4px;
        padding: 4px;
        border-bottom: 1px solid #eee;
      }
      .log-entry.error { color: red; }
      .log-entry.warn { color: orange; }
      .log-entry.info { color: blue; }
      .log-entry.debug { color: gray; }
      .error-trace {
        background: #fff0f0;
        border-left: 3px solid red;
        padding: 8px;
        margin-bottom: 8px;
      }
      .performance-item {
        display: flex;
        justify-content: space-between;
        padding: 4px;
        border-bottom: 1px solid #eee;
      }
    `;
    document.head.appendChild(style);

    // Set up event handlers and UI updates
    this._setupDebuggerUI(debuggerEl);

    this.visualizationAttached = true;
    return true;
  }

  /**
   * Set up debugger UI event handlers
   */
  _setupDebuggerUI(container) {
    // Tab switching
    const tabButtons = container.querySelectorAll(".tab-btn");
    const tabContents = container.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabButtons.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((t) => t.classList.remove("active"));

        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        container.querySelector(`#${tabId}-tab`).classList.add("active");
      });
    });

    // Log level filter
    const logLevelSelect = container.querySelector("#log-level");
    logLevelSelect.addEventListener("change", (e) => {
      this.setFilterLevel(e.target.value);
      this._updateLogsUI(container);
    });

    // Clear logs button
    const clearLogsBtn = container.querySelector("#clear-logs");
    clearLogsBtn.addEventListener("click", () => {
      this.logs = [];
      this._updateLogsUI(container);
    });

    // Initial UI update
    this._updateLogsUI(container);
    this._updateErrorsUI(container);
    this._updatePerformanceUI(container);

    // Set up interval for UI updates
    setInterval(() => {
      this._updateLogsUI(container);
      this._updateErrorsUI(container);
      this._updatePerformanceUI(container);
    }, 1000);
  }

  /**
   * Update logs UI
   */
  _updateLogsUI(container) {
    const logEntriesEl = container.querySelector(".log-entries");

    // Only show logs that pass the filter
    const filteredLogs = this.logs.filter((log) => this.shouldLog(log));

    // Build HTML for logs
    let html = "";
    filteredLogs.slice(-100).forEach((log) => {
      html += `
        <div class="log-entry ${log.level}">
          <span class="timestamp">${log.timestamp.split("T")[1].split(".")[0]}</span>
          <span class="level">[${log.level.toUpperCase()}]</span>
          <span class="message">${log.message}</span>
          ${log.data ? `<pre class="data">${JSON.stringify(log.data, null, 2)}</pre>` : ""}
        </div>
      `;
    });

    logEntriesEl.innerHTML =
      html || '<div class="empty-state">No logs to display</div>';
  }

  /**
   * Update errors UI
   */
  _updateErrorsUI(container) {
    const errorTracesEl = container.querySelector(".error-traces");

    let html = "";
    this.errorTraces.slice(-20).forEach((trace) => {
      html += `
        <div class="error-trace">
          <div class="error-title">${trace.error}</div>
          <div class="error-time">${trace.timestamp}</div>
          ${trace.stack ? `<pre class="error-stack">${trace.stack}</pre>` : ""}
          ${trace.context ? `<pre class="error-context">${JSON.stringify(trace.context, null, 2)}</pre>` : ""}
        </div>
      `;
    });

    errorTracesEl.innerHTML =
      html || '<div class="empty-state">No errors to display</div>';
  }

  /**
   * Update performance UI
   */
  _updatePerformanceUI(container) {
    const statsEl = container.querySelector(".performance-stats");

    let html = "<h4>Command Performance</h4>";

    const commands = Object.keys(this.performance.commands);
    if (commands.length === 0) {
      html +=
        '<div class="empty-state">No command performance data available</div>';
    } else {
      html += '<div class="performance-list">';
      commands.forEach((cmd) => {
        const stats = this.performance.commands[cmd];
        html += `
          <div class="performance-item">
            <div class="cmd-name">${cmd}</div>
            <div class="cmd-stats">
              <span>Count: ${stats.count}</span>
              <span>Avg: ${stats.averageTime.toFixed(2)}ms</span>
              <span>Total: ${stats.totalTime}ms</span>
            </div>
          </div>
        `;
      });
      html += "</div>";
    }

    statsEl.innerHTML = html;
  }

  /**
   * Export logs to file
   */
  exportLogs(format = "json") {
    if (format === "json") {
      const dataStr = JSON.stringify(this.logs, null, 2);
      this._downloadFile(dataStr, "terminal-logs.json", "application/json");
    } else if (format === "csv") {
      let csv = "timestamp,level,message\n";
      this.logs.forEach((log) => {
        csv += `${log.timestamp},"${log.level}","${log.message.replace(/"/g, '""')}"\n`;
      });
      this._downloadFile(csv, "terminal-logs.csv", "text/csv");
    }
  }

  /**
   * Export performance data to file
   */
  exportPerformance() {
    const dataStr = JSON.stringify(this.performance, null, 2);
    this._downloadFile(
      dataStr,
      "terminal-performance.json",
      "application/json",
    );
  }

  /**
   * Helper to trigger file download
   */
  _downloadFile(content, filename, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /**
   * Clear all logs and performance data
   */
  clearAll() {
    this.logs = [];
    this.errorTraces = [];
    this.performance = { commands: {}, operations: {} };
    return true;
  }
}

// Export the debugger class
export default TerminalDebugger;
