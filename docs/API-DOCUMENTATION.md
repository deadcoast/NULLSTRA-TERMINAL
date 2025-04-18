# Terminal API Documentation

## Overview

This document provides comprehensive documentation for the MidaTerminal API, which allows developers to interact with and extend the terminal functionality. The API provides endpoints for terminal customization, plugin development, and integration with developer tools.

## Table of Contents

1. [Core API](#core-api)
2. [Terminal Instance API](#terminal-instance-api)
3. [Plugin Development](#plugin-development)
4. [Event System](#event-system)
5. [Theming API](#theming-api)
6. [Extension API](#extension-api)

## Core API

### Initialization

```javascript
// Initialize a new terminal
const terminal = MidaTerminal.create(options);

// Options object structure
const options = {
  container: HTMLElement, // DOM element to attach terminal to
  theme: "default", // Theme name or object
  fontSize: 14, // Font size in pixels
  fontFamily: "monospace", // Font family
  cursorStyle: "block", // 'block', 'underline', or 'bar'
  cursorBlink: true, // Whether cursor should blink
  scrollback: 1000, // Maximum lines in scrollback buffer
  cols: 80, // Number of columns
  rows: 24, // Number of rows
};
```

### Global Methods

```javascript
// Get version information
MidaTerminal.version(); // Returns version string

// List all registered plugins
MidaTerminal.listPlugins();

// Register a plugin
MidaTerminal.registerPlugin(pluginDefinition);

// Get default configuration
MidaTerminal.getDefaultConfig();
```

## Terminal Instance API

### Basic Methods

```javascript
// Write text to terminal
terminal.write(text);

// Read current line content
const lineContent = terminal.readLine();

// Clear terminal
terminal.clear();

// Focus terminal
terminal.focus();

// Get current dimensions
const dimensions = terminal.getDimensions(); // Returns {cols, rows}

// Resize terminal
terminal.resize(cols, rows);
```

### Advanced Methods

```javascript
// Execute command
terminal.executeCommand(commandString);

// Split terminal (direction: 'horizontal' or 'vertical')
const newTerminal = terminal.split(direction);

// Create a new tab
const newTab = terminal.createTab(options);

// Register command
terminal.registerCommand(name, callback);

// Add to command history
terminal.addToHistory(command);

// Search command history
const results = terminal.searchHistory(query);
```

## Plugin Development

Plugins extend terminal functionality through a standardized interface.

```javascript
// Plugin structure
const myPlugin = {
  name: "my-plugin",
  version: "1.0.0",
  description: "Example plugin",

  // Called when plugin is loaded
  initialize: function (terminal) {
    // Set up plugin
  },

  // Called when plugin is unloaded
  destroy: function () {
    // Clean up resources
  },

  // Custom commands provided by plugin
  commands: {
    "my-command": function (args) {
      // Command implementation
    },
  },

  // Plugin-specific API
  api: {
    customFunction: function () {
      // Implementation
    },
  },
};

// Register the plugin
MidaTerminal.registerPlugin(myPlugin);
```

## Event System

The terminal provides an event system for reacting to terminal activities.

```javascript
// Register event listener
terminal.on("data", function (data) {
  console.log("Data received:", data);
});

// Available events:
// - 'data': Triggered when data is received from the terminal
// - 'key': Triggered when a key is pressed
// - 'line': Triggered when a line is completed
// - 'resize': Triggered when terminal is resized
// - 'focus': Triggered when terminal gains focus
// - 'blur': Triggered when terminal loses focus
// - 'command': Triggered when a command is executed
// - 'tab-created': Triggered when a new tab is created
// - 'tab-closed': Triggered when a tab is closed
// - 'split': Triggered when terminal is split

// Remove event listener
terminal.off("data", listener);

// Emit event (for custom extensions)
terminal.emit("custom-event", data);
```

## Theming API

Interface for customizing terminal appearance.

```javascript
// Set theme
terminal.setTheme(themeObject);

// Get current theme
const currentTheme = terminal.getTheme();

// Theme object structure
const theme = {
  background: "#1e1e1e",
  foreground: "#d4d4d4",
  cursor: "#ffffff",
  selection: "rgba(255, 255, 255, 0.3)",
  black: "#000000",
  red: "#cd3131",
  green: "#0dbc79",
  yellow: "#e5e510",
  blue: "#2472c8",
  magenta: "#bc3fbc",
  cyan: "#11a8cd",
  white: "#e5e5e5",
  brightBlack: "#666666",
  brightRed: "#f14c4c",
  brightGreen: "#23d18b",
  brightYellow: "#f5f543",
  brightBlue: "#3b8eea",
  brightMagenta: "#d670d6",
  brightCyan: "#29b8db",
  brightWhite: "#ffffff",
};

// Create a new theme
MidaTerminal.createTheme(name, theme);

// List available themes
const themes = MidaTerminal.listThemes();
```

## Extension API

API for developing and managing terminal extensions.

```javascript
// Load an extension
terminal.loadExtension(extensionId);

// Unload an extension
terminal.unloadExtension(extensionId);

// List loaded extensions
const extensions = terminal.getLoadedExtensions();

// Extension interface
const extension = {
  id: "extension-id",
  name: "My Extension",
  version: "1.0.0",
  description: "Description of the extension",

  // Called when extension is loaded
  activate: function (terminal) {
    // Initialize extension
    return {
      // Public API exposed by this extension
      getStatus: function () {
        return "active";
      },
    };
  },

  // Called when extension is unloaded
  deactivate: function () {
    // Clean up resources
  },
};

// Register extension
MidaTerminal.registerExtension(extension);
```

## Integration Examples

### Integrating with Developer Tools

```javascript
// Connect to Chrome DevTools Protocol
terminal.connectToDevTools({
  port: 9222,
  host: "localhost",
});

// Inject console output into terminal
terminal.injectConsole();

// Log terminal output to browser console
terminal.logToConsole(true);
```

### Creating a Custom Terminal Command

```javascript
terminal.registerCommand("hello", function (args) {
  terminal.write("Hello, " + (args[0] || "World") + "!\r\n");
});

// Now users can type "hello" or "hello UserName" in the terminal
```
