/**
 * Debugger Extension - Provides tools for debugging terminal usage and extensions
 */

const DebuggerExtension = {
  id: "debugger-extension",
  name: "Terminal Debugger",
  version: "1.0.0",
  author: "MidaTerminal",
  description:
    "Debug terminal commands, view event logs, and analyze performance",
  settings: {
    "Auto-start": false,
    "Log level": "info",
    "Log command execution": true,
    "Log command output": true,
    "Track performance": true,
    "Maximum log entries": 500,
  },

  // Internal state
  _active: false,
  _logs: [],
  _commandHistory: [],
  _performanceMetrics: {},
  _startTime: null,
  _commandStartTime: null,
  _debugPanel: null,

  // Called when extension is initialized
  initialize: function () {
    this.console.log("Debugger Extension initialized");

    // Start debugger if auto-start is enabled
    if (this.extension.getSettings()["Auto-start"]) {
      this._active = true;
      this._startDebugger();
    }

    return {
      debuggerActive: this._active,
    };
  },

  // Hook into terminal events
  hooks: {
    // Before command execution
    beforeCommand: function (command, args) {
      if (!this._active) return { command, args };

      // Log command start
      this._commandStartTime = performance.now();
      this._logEvent("command", `Executing: ${command} ${args.join(" ")}`);

      // Track command history
      this._commandHistory.push({
        command,
        args,
        timestamp: new Date().toISOString(),
        status: "started",
      });

      return { command, args };
    },

    // After command execution
    afterCommand: function (command, result) {
      if (!this._active) return;

      // Calculate execution time
      const executionTime = performance.now() - this._commandStartTime;

      // Update command history
      const cmdEntry = this._commandHistory[this._commandHistory.length - 1];
      if (cmdEntry && cmdEntry.command === command) {
        cmdEntry.status = "completed";
        cmdEntry.executionTime = executionTime;
        cmdEntry.result = result;
      }

      // Log command completion
      this._logEvent(
        "command",
        `Completed: ${command} (${executionTime.toFixed(2)}ms)`,
      );

      // Track performance metrics
      if (this.extension.getSettings()["Track performance"]) {
        if (!this._performanceMetrics[command]) {
          this._performanceMetrics[command] = {
            count: 0,
            totalTime: 0,
            avgTime: 0,
            minTime: Number.MAX_VALUE,
            maxTime: 0,
          };
        }

        const metrics = this._performanceMetrics[command];
        metrics.count++;
        metrics.totalTime += executionTime;
        metrics.avgTime = metrics.totalTime / metrics.count;
        metrics.minTime = Math.min(metrics.minTime, executionTime);
        metrics.maxTime = Math.max(metrics.maxTime, executionTime);
      }

      // Log command output if enabled
      if (this.extension.getSettings()["Log command output"]) {
        this._logEvent("output", `Output: ${result}`);
      }
    },

    // On terminal output
    onOutput: function (output) {
      if (!this._active) return;

      // Only log if command output logging is enabled
      if (this.extension.getSettings()["Log command output"]) {
        this._logEvent("output", `Terminal output: ${output}`);
      }
    },

    // On terminal error
    onError: function (error) {
      if (!this._active) return;

      this._logEvent("error", `Error: ${error.message || error}`, error);

      // Update last command status if there is one
      if (this._commandHistory.length > 0) {
        const lastCmd = this._commandHistory[this._commandHistory.length - 1];
        if (lastCmd.status === "started") {
          lastCmd.status = "error";
          lastCmd.error = error;
        }
      }
    },
  },

  // Custom commands
  commands: {
    debug: function (args, terminal) {
      const subcommand = args[0]?.toLowerCase();

      if (
        subcommand === "start" ||
        (subcommand === "toggle" && !this._active)
      ) {
        this._active = true;
        this._startTime = performance.now();
        this._startDebugger();
        return "Debugger started";
      } else if (
        subcommand === "stop" ||
        (subcommand === "toggle" && this._active)
      ) {
        this._active = false;
        this._stopDebugger();
        return "Debugger stopped";
      } else if (subcommand === "status") {
        const status = this._active ? "active" : "inactive";
        const runTime = this._active
          ? ((performance.now() - this._startTime) / 1000).toFixed(2) + "s"
          : "N/A";

        terminal.writeLine(`Debugger status: ${status}`);
        terminal.writeLine(`Running time: ${runTime}`);
        terminal.writeLine(`Log entries: ${this._logs.length}`);
        terminal.writeLine(
          `Commands tracked: ${Object.keys(this._performanceMetrics).length}`,
        );

        return "Debugger status displayed";
      } else if (subcommand === "clear") {
        this._clearLogs();
        return "Debugger logs cleared";
      } else if (subcommand === "show") {
        this._showDebuggerPanel();
        return "Debugger panel displayed";
      } else if (subcommand === "hide") {
        this._hideDebuggerPanel();
        return "Debugger panel hidden";
      } else if (subcommand === "log") {
        const logLevel = args[1]?.toLowerCase() || "info";
        const message = args.slice(2).join(" ");

        if (message) {
          this._logEvent(logLevel, message);
          return `Log entry added with level: ${logLevel}`;
        } else {
          return "Usage: debug log <level> <message>";
        }
      } else if (subcommand === "performance") {
        this._displayPerformanceMetrics(terminal);
        return "Performance metrics displayed";
      } else if (subcommand === "export") {
        const format = args[1]?.toLowerCase() || "json";
        this._exportLogs(format);
        return `Logs exported in ${format} format`;
      } else {
        // Show help
        terminal.writeLine("Debugger Commands:");
        terminal.writeLine("  debug start - Start the debugger");
        terminal.writeLine("  debug stop - Stop the debugger");
        terminal.writeLine("  debug toggle - Toggle debugger state");
        terminal.writeLine("  debug status - Show debugger status");
        terminal.writeLine("  debug clear - Clear all logs");
        terminal.writeLine("  debug show - Show debugger panel");
        terminal.writeLine("  debug hide - Hide debugger panel");
        terminal.writeLine(
          "  debug log <level> <message> - Add a custom log entry",
        );
        terminal.writeLine("  debug performance - Show performance metrics");
        terminal.writeLine("  debug export [format] - Export logs (json, csv)");
        return "Debugger help displayed";
      }
    },
  },

  // Start the debugger
  _startDebugger: function () {
    this._logEvent("info", "Debugger started");

    // Create debug panel if it doesn't exist
    if (!this._debugPanel) {
      this._createDebuggerPanel();
    }
  },

  // Stop the debugger
  _stopDebugger: function () {
    const duration = ((performance.now() - this._startTime) / 1000).toFixed(2);
    this._logEvent("info", `Debugger stopped after ${duration}s`);

    // Hide the panel but don't destroy it
    if (this._debugPanel) {
      this._hideDebuggerPanel();
    }
  },

  // Log an event
  _logEvent: function (level, message, data = null) {
    const maxEntries = this.extension.getSettings()["Maximum log entries"];
    const minLevel = this.extension.getSettings()["Log level"];

    // Check if we should log based on level
    if (!this._shouldLogLevel(level, minLevel)) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    // Add to logs array
    this._logs.push(logEntry);

    // Trim logs if they exceed maximum
    if (this._logs.length > maxEntries) {
      this._logs = this._logs.slice(-maxEntries);
    }

    // Update debug panel if visible
    this._updateDebugPanel();

    return logEntry;
  },

  // Check if a level should be logged
  _shouldLogLevel: function (level, minLevel) {
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4,
    };

    return levels[level] <= levels[minLevel];
  },

  // Clear all logs
  _clearLogs: function () {
    this._logs = [];
    this._updateDebugPanel();
  },

  // Create debugger panel
  _createDebuggerPanel: function () {
    // Create panel container
    this._debugPanel = document.createElement("div");
    this._debugPanel.className = "terminal-debugger-panel";
    this._debugPanel.style.position = "fixed";
    this._debugPanel.style.bottom = "0";
    this._debugPanel.style.right = "0";
    this._debugPanel.style.width = "400px";
    this._debugPanel.style.height = "300px";
    this._debugPanel.style.backgroundColor = "#282c34";
    this._debugPanel.style.color = "#abb2bf";
    this._debugPanel.style.fontFamily = "monospace";
    this._debugPanel.style.fontSize = "12px";
    this._debugPanel.style.padding = "5px";
    this._debugPanel.style.overflow = "hidden";
    this._debugPanel.style.display = "flex";
    this._debugPanel.style.flexDirection = "column";
    this._debugPanel.style.zIndex = "9999";
    this._debugPanel.style.border = "1px solid #181a1f";
    this._debugPanel.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

    // Create header
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.padding = "5px";
    header.style.borderBottom = "1px solid #181a1f";

    const title = document.createElement("span");
    title.textContent = "Terminal Debugger";
    title.style.fontWeight = "bold";

    const controls = document.createElement("div");

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.style.marginRight = "5px";
    clearBtn.style.backgroundColor = "#3a404b";
    clearBtn.style.color = "#abb2bf";
    clearBtn.style.border = "none";
    clearBtn.style.padding = "3px 8px";
    clearBtn.style.cursor = "pointer";
    clearBtn.addEventListener("click", () => this._clearLogs());

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.backgroundColor = "#e06c75";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.width = "20px";
    closeBtn.style.height = "20px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.display = "flex";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.alignItems = "center";
    closeBtn.addEventListener("click", () => this._hideDebuggerPanel());

    controls.appendChild(clearBtn);
    controls.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(controls);

    // Create tab bar
    const tabBar = document.createElement("div");
    tabBar.style.display = "flex";
    tabBar.style.borderBottom = "1px solid #181a1f";

    const tabs = ["Logs", "Commands", "Performance"];
    tabs.forEach((tabName) => {
      const tab = document.createElement("div");
      tab.className = `debugger-tab ${tabName === "Logs" ? "active" : ""}`;
      tab.dataset.tab = tabName.toLowerCase();
      tab.textContent = tabName;
      tab.style.padding = "5px 10px";
      tab.style.cursor = "pointer";
      tab.style.borderRight = "1px solid #181a1f";

      if (tabName === "Logs") {
        tab.style.backgroundColor = "#3a404b";
      }

      tab.addEventListener("click", () => {
        // Deactivate all tabs
        tabBar.querySelectorAll(".debugger-tab").forEach((t) => {
          t.classList.remove("active");
          t.style.backgroundColor = "";
        });

        // Activate this tab
        tab.classList.add("active");
        tab.style.backgroundColor = "#3a404b";

        // Show corresponding content
        this._debugPanel.querySelectorAll(".tab-content").forEach((c) => {
          c.style.display = "none";
        });

        const contentId = tab.dataset.tab;
        this._debugPanel.querySelector(`#debugger-${contentId}`).style.display =
          "block";
      });

      tabBar.appendChild(tab);
    });

    // Create content area
    const contentArea = document.createElement("div");
    contentArea.style.flex = "1";
    contentArea.style.overflow = "hidden";

    // Create logs tab content
    const logsContent = document.createElement("div");
    logsContent.id = "debugger-logs";
    logsContent.className = "tab-content";
    logsContent.style.height = "100%";
    logsContent.style.overflow = "auto";
    logsContent.style.display = "block";

    // Create commands tab content
    const commandsContent = document.createElement("div");
    commandsContent.id = "debugger-commands";
    commandsContent.className = "tab-content";
    commandsContent.style.height = "100%";
    commandsContent.style.overflow = "auto";
    commandsContent.style.display = "none";

    // Create performance tab content
    const perfContent = document.createElement("div");
    perfContent.id = "debugger-performance";
    perfContent.className = "tab-content";
    perfContent.style.height = "100%";
    perfContent.style.overflow = "auto";
    perfContent.style.display = "none";

    contentArea.appendChild(logsContent);
    contentArea.appendChild(commandsContent);
    contentArea.appendChild(perfContent);

    // Add all elements to panel
    this._debugPanel.appendChild(header);
    this._debugPanel.appendChild(tabBar);
    this._debugPanel.appendChild(contentArea);

    // Add to document
    document.body.appendChild(this._debugPanel);

    // Make panel draggable
    this._makeDraggable(this._debugPanel, header);

    // Initial update
    this._updateDebugPanel();
  },

  // Make an element draggable
  _makeDraggable: function (element, handle) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    handle.style.cursor = "move";
    handle.onmousedown = dragMouseDown;

    handle.style.cursor = "move";

    // Arrow function expression
    const dragMouseDown = (e) => {
      e = e || window.event;
      e.preventDefault();
      // Rest of your function
    };

    handle.onmousedown = dragMouseDown;

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // Calculate new position
      const newTop = element.offsetTop - pos2;
      const newLeft = element.offsetLeft - pos1;

      // Apply new position
      element.style.top = newTop + "px";
      element.style.left = newLeft + "px";

      // Remove bottom/right if we're using top/left
      element.style.bottom = "auto";
      element.style.right = "auto";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  },

  // Show debugger panel
  _showDebuggerPanel: function () {
    if (!this._debugPanel) {
      this._createDebuggerPanel();
    }

    this._debugPanel.style.display = "flex";
    this._updateDebugPanel();
  },

  // Hide debugger panel
  _hideDebuggerPanel: function () {
    if (this._debugPanel) {
      this._debugPanel.style.display = "none";
    }
  },

  // Update debug panel with current data
  _updateDebugPanel: function () {
    if (!this._debugPanel || this._debugPanel.style.display === "none") {
      return;
    }

    // Update logs tab
    const logsContainer = this._debugPanel.querySelector("#debugger-logs");
    logsContainer.innerHTML = "";

    const logLevelColors = {
      error: "#e06c75",
      warn: "#e5c07b",
      info: "#61afef",
      debug: "#98c379",
      trace: "#c678dd",
      command: "#56b6c2",
      output: "#abb2bf",
    };

    this._logs.forEach((log) => {
      const logEntry = document.createElement("div");
      logEntry.className = "log-entry";
      logEntry.style.padding = "2px 5px";
      logEntry.style.borderBottom = "1px solid #181a1f";
      logEntry.style.fontFamily = "monospace";
      logEntry.style.fontSize = "12px";
      logEntry.style.whiteSpace = "pre-wrap";
      logEntry.style.wordBreak = "break-word";

      const time = new Date(log.timestamp).toLocaleTimeString();

      logEntry.innerHTML = `<span style="color: #abb2bf">[${time}]</span> <span style="color: ${
        logLevelColors[log.level] || "#abb2bf"
      }">[${log.level.toUpperCase()}]</span> ${log.message}`;

      if (log.data) {
        const dataEl = document.createElement("div");
        dataEl.className = "log-data";
        dataEl.style.paddingLeft = "20px";
        dataEl.style.fontSize = "11px";
        dataEl.style.color = "#7f848e";

        try {
          dataEl.textContent =
            typeof log.data === "object"
              ? JSON.stringify(log.data, null, 2)
              : String(log.data);
        } catch (e) {
          dataEl.textContent = "[Unable to display data]";
        }

        logEntry.appendChild(dataEl);
      }

      logsContainer.appendChild(logEntry);
    });

    // Scroll to bottom
    logsContainer.scrollTop = logsContainer.scrollHeight;

    // Update commands tab
    const commandsContainer =
      this._debugPanel.querySelector("#debugger-commands");
    commandsContainer.innerHTML = "";

    this._commandHistory.forEach((cmd) => {
      const cmdEntry = document.createElement("div");
      cmdEntry.className = "command-entry";
      cmdEntry.style.padding = "5px";
      cmdEntry.style.borderBottom = "1px solid #181a1f";

      const statusColors = {
        started: "#e5c07b",
        completed: "#98c379",
        error: "#e06c75",
      };

      const time = new Date(cmd.timestamp).toLocaleTimeString();
      const argsStr = cmd.args.join(" ");
      const statusColor = statusColors[cmd.status] || "#abb2bf";

      cmdEntry.innerHTML = `
        <div><span style="color: #7f848e">[${time}]</span> <span style="color: #61afef">${
        cmd.command
      }</span> ${argsStr}</div>
        <div style="padding-left: 20px; margin-top: 3px;">
          <span style="color: ${statusColor}">Status: ${cmd.status}</span>
          ${
            cmd.executionTime
              ? `<span style="margin-left: 10px">Time: ${cmd.executionTime.toFixed(
                  2,
                )}ms</span>`
              : ""
          }
        </div>
      `;

      if (cmd.error) {
        const errorEl = document.createElement("div");
        errorEl.style.paddingLeft = "20px";
        errorEl.style.color = "#e06c75";
        errorEl.textContent = `Error: ${
          cmd.error.message || String(cmd.error)
        }`;
        cmdEntry.appendChild(errorEl);
      }

      commandsContainer.appendChild(cmdEntry);
    });

    // Update performance tab
    const perfContainer = this._debugPanel.querySelector(
      "#debugger-performance",
    );
    perfContainer.innerHTML = "";

    if (Object.keys(this._performanceMetrics).length === 0) {
      perfContainer.innerHTML =
        "<div style='padding: 10px; color: #7f848e;'>No performance data available yet</div>";
    } else {
      // Command performance table
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.marginTop = "10px";

      // Header
      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr style="background-color: #3a404b;">
          <th style="text-align: left; padding: 5px; border-bottom: 1px solid #181a1f;">Command</th>
          <th style="text-align: right; padding: 5px; border-bottom: 1px solid #181a1f;">Count</th>
          <th style="text-align: right; padding: 5px; border-bottom: 1px solid #181a1f;">Avg Time</th>
          <th style="text-align: right; padding: 5px; border-bottom: 1px solid #181a1f;">Min</th>
          <th style="text-align: right; padding: 5px; border-bottom: 1px solid #181a1f;">Max</th>
        </tr>
      `;
      table.appendChild(thead);

      // Body
      const tbody = document.createElement("tbody");

      for (const [cmd, metrics] of Object.entries(this._performanceMetrics)) {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #181a1f";

        row.innerHTML = `
          <td style="padding: 5px;">${cmd}</td>
          <td style="text-align: right; padding: 5px;">${metrics.count}</td>
          <td style="text-align: right; padding: 5px;">${metrics.avgTime.toFixed(
            2,
          )}ms</td>
          <td style="text-align: right; padding: 5px;">${metrics.minTime.toFixed(
            2,
          )}ms</td>
          <td style="text-align: right; padding: 5px;">${metrics.maxTime.toFixed(
            2,
          )}ms</td>
        `;

        tbody.appendChild(row);
      }

      table.appendChild(tbody);
      perfContainer.appendChild(table);
    }
  },

  // Display performance metrics to terminal
  _displayPerformanceMetrics: function (terminal) {
    if (Object.keys(this._performanceMetrics).length === 0) {
      terminal.writeLine("No performance metrics available");
      return;
    }

    terminal.writeLine("Command Performance Metrics:");
    terminal.writeLine("----------------------------");

    for (const [cmd, metrics] of Object.entries(this._performanceMetrics)) {
      terminal.writeLine(`${cmd}:`);
      terminal.writeLine(`  Count: ${metrics.count}`);
      terminal.writeLine(`  Avg Time: ${metrics.avgTime.toFixed(2)}ms`);
      terminal.writeLine(`  Min Time: ${metrics.minTime.toFixed(2)}ms`);
      terminal.writeLine(`  Max Time: ${metrics.maxTime.toFixed(2)}ms`);
      terminal.writeLine("----------------------------");
    }
  },

  // Export logs to file
  _exportLogs: function (format) {
    let content;
    let filename;
    let mimeType;

    if (format === "csv") {
      // Generate CSV
      content = "Timestamp,Level,Message\n";

      this._logs.forEach((log) => {
        const { timestamp, level } = log;
        // Escape quotes and handle commas in the message
        const message = log.message.replace(/"/g, '""');

        content += `"${timestamp}","${level}","${message}"\n`;
      });

      filename = "terminal-debug-logs.csv";
      mimeType = "text/csv";
    } else {
      // Default to JSON
      content = JSON.stringify(
        {
          logs: this._logs,
          commands: this._commandHistory,
          performanceMetrics: this._performanceMetrics,
        },
        null,
        2,
      );

      filename = "terminal-debug-data.json";
      mimeType = "application/json";
    }

    // Create a download link and trigger it
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  },
};

export default DebuggerExtension;
