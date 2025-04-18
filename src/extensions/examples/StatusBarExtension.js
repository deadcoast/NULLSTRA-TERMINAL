/**
 * Status Bar Extension - A simple example extension for MidaTerminal
 * Adds a customizable status bar to the terminal interface
 */

const StatusBarExtension = {
  id: "status-bar-extension",
  name: "Terminal Status Bar",
  version: "1.0.0",
  author: "MidaTerminal",
  description: "Adds a customizable status bar to display terminal information",
  settings: {
    "Show status bar": true,
    Position: "bottom",
    "Background color": "#1a1a1a",
    "Text color": "#ffffff",
    "Show time": true,
    "Show command count": true,
    "Auto-hide": false,
  },

  // DOM element reference
  _statusBar: null,
  _commandCounter: 0,

  // Called when extension is initialized
  initialize: function () {
    this.console.log("Status Bar Extension initialized");

    if (this.extension.getSettings()["Show status bar"]) {
      this._createStatusBar();
    }

    return {
      statusBarCreated: !!this._statusBar,
    };
  },

  // Hook into terminal events
  hooks: {
    // Set up status bar when terminal initializes
    onInit: function () {
      this.console.log("Terminal initialized, setting up status bar");
      this._updateStatusBar();
    },

    // Update command counter when commands are executed
    afterCommand: function (command) {
      this._commandCounter++;
      this._updateStatusBar();
      return command;
    },

    // Update status bar when terminal is resized
    onResize: function () {
      this._updateStatusBar();
    },

    // Clean up when extension is disabled
    onShutdown: function () {
      if (this._statusBar) {
        this._statusBar.remove();
        this._statusBar = null;
      }
    },

    // Update when theme changes
    onThemeChange: function () {
      if (this._statusBar) {
        const settings = this.extension.getSettings();
        this._statusBar.style.backgroundColor = settings["Background color"];
        this._statusBar.style.color = settings["Text color"];
      }
    },
  },

  // Custom commands
  commands: {
    statusbar: function (args, terminal) {
      const subcommand = args[0]?.toLowerCase();
      const settings = this.extension.getSettings();

      if (subcommand === "show") {
        if (this._statusBar) {
          this._statusBar.style.display = "flex";
          settings["Show status bar"] = true;
          return "Status bar is now visible";
        } else {
          this._createStatusBar();
          return "Status bar created and shown";
        }
      } else if (subcommand === "hide") {
        if (this._statusBar) {
          this._statusBar.style.display = "none";
          settings["Show status bar"] = false;
          return "Status bar is now hidden";
        }
        return "Status bar is already hidden";
      } else if (subcommand === "toggle") {
        if (!this._statusBar) {
          this._createStatusBar();
          return "Status bar created and shown";
        }

        const isVisible = this._statusBar.style.display !== "none";
        this._statusBar.style.display = isVisible ? "none" : "flex";
        settings["Show status bar"] = !isVisible;
        return `Status bar is now ${isVisible ? "hidden" : "visible"}`;
      } else if (subcommand === "color") {
        const bgColor = args[1];
        const textColor = args[2];

        if (bgColor) {
          settings["Background color"] = bgColor;
          this._statusBar.style.backgroundColor = bgColor;
        }

        if (textColor) {
          settings["Text color"] = textColor;
          this._statusBar.style.color = textColor;
        }

        return `Status bar colors updated: background=${settings["Background color"]}, text=${settings["Text color"]}`;
      } else if (subcommand === "position") {
        const position = args[1]?.toLowerCase();
        if (position === "top" || position === "bottom") {
          settings["Position"] = position;
          this._repositionStatusBar();
          return `Status bar position set to ${position}`;
        }
        return 'Invalid position. Use "top" or "bottom"';
      } else if (subcommand === "reset") {
        this._commandCounter = 0;
        this._updateStatusBar();
        return "Status bar counter reset";
      } else {
        // Show help
        terminal.writeLine("Status Bar Commands:");
        terminal.writeLine("  statusbar show - Show the status bar");
        terminal.writeLine("  statusbar hide - Hide the status bar");
        terminal.writeLine("  statusbar toggle - Toggle status bar visibility");
        terminal.writeLine(
          "  statusbar color <bg> <text> - Set status bar colors",
        );
        terminal.writeLine(
          "  statusbar position <top|bottom> - Set status bar position",
        );
        terminal.writeLine("  statusbar reset - Reset command counter");
        return "Status bar help displayed";
      }
    },
  },

  // Create the status bar DOM element
  _createStatusBar: function () {
    if (this._statusBar) {
      return;
    }

    const settings = this.extension.getSettings();

    // Create status bar element
    this._statusBar = document.createElement("div");
    this._statusBar.className = "terminal-status-bar";
    this._statusBar.style.display = "flex";
    this._statusBar.style.justifyContent = "space-between";
    this._statusBar.style.alignItems = "center";
    this._statusBar.style.padding = "4px 10px";
    this._statusBar.style.fontSize = "12px";
    this._statusBar.style.fontFamily = "monospace";
    this._statusBar.style.backgroundColor = settings["Background color"];
    this._statusBar.style.color = settings["Text color"];
    this._statusBar.style.width = "100%";
    this._statusBar.style.boxSizing = "border-box";
    this._statusBar.style.zIndex = "100";

    // Create sections for information
    const leftSection = document.createElement("div");
    leftSection.className = "status-section status-left";

    const centerSection = document.createElement("div");
    centerSection.className = "status-section status-center";

    const rightSection = document.createElement("div");
    rightSection.className = "status-section status-right";

    // Add sections to status bar
    this._statusBar.appendChild(leftSection);
    this._statusBar.appendChild(centerSection);
    this._statusBar.appendChild(rightSection);

    // Add to terminal
    const terminalEl =
      document.querySelector(".terminal-container") || document.body;
    terminalEl.appendChild(this._statusBar);

    // Position the status bar
    this._repositionStatusBar();

    // Initial update
    this._updateStatusBar();
  },

  // Reposition status bar based on settings
  _repositionStatusBar: function () {
    if (!this._statusBar) return;

    const settings = this.extension.getSettings();
    const position = settings["Position"];

    this._statusBar.style.position = "absolute";

    if (position === "top") {
      this._statusBar.style.top = "0";
      this._statusBar.style.bottom = "auto";
    } else {
      this._statusBar.style.bottom = "0";
      this._statusBar.style.top = "auto";
    }
  },

  // Update status bar content
  _updateStatusBar: function () {
    if (!this._statusBar) return;

    const settings = this.extension.getSettings();
    const leftSection = this._statusBar.querySelector(".status-left");
    const centerSection = this._statusBar.querySelector(".status-center");
    const rightSection = this._statusBar.querySelector(".status-right");

    // Left section - terminal info
    leftSection.textContent = `MidaTerminal ${this._getTerminalVersion()}`;

    // Center section - command counter
    if (settings["Show command count"]) {
      centerSection.textContent = `Commands: ${this._commandCounter}`;
    } else {
      centerSection.textContent = "";
    }

    // Right section - time
    if (settings["Show time"]) {
      rightSection.textContent = this._getCurrentTime();

      // Update time every second
      if (!this._timeInterval) {
        this._timeInterval = setInterval(() => {
          rightSection.textContent = this._getCurrentTime();
        }, 1000);
      }
    } else {
      rightSection.textContent = "";
      if (this._timeInterval) {
        clearInterval(this._timeInterval);
        this._timeInterval = null;
      }
    }
  },

  // Get current formatted time
  _getCurrentTime: function () {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  },

  // Get terminal version - placeholder
  _getTerminalVersion: function () {
    return "v1.0.0";
  },
};

export default StatusBarExtension;
