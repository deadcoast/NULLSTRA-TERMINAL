# Terminal Debugger Extension Documentation

## Overview

The Terminal Debugger Extension provides powerful tools for debugging terminal sessions, monitoring command execution, analyzing performance, and tracking errors. It's designed to help developers understand terminal behavior, optimize commands, and diagnose issues quickly.

## Features

- Real-time command execution monitoring
- Performance metrics for commands
- Detailed logging with multiple log levels
- Visual debugging panel with tabbed interface
- Export capabilities for logs and metrics
- Command history tracking with status information
- Custom logging capabilities

## Commands

The Debugger Extension adds the following commands to the terminal:

| Command                       | Description                                 |
| ----------------------------- | ------------------------------------------- |
| `debug start`                 | Start the debugger                          |
| `debug stop`                  | Stop the debugger                           |
| `debug toggle`                | Toggle debugger state (on/off)              |
| `debug status`                | Show current debugger status and statistics |
| `debug clear`                 | Clear all logs and reset data               |
| `debug show`                  | Show the visual debugger panel              |
| `debug hide`                  | Hide the visual debugger panel              |
| `debug log <level> <message>` | Add a custom log entry with specified level |
| `debug performance`           | Display performance metrics in the terminal |
| `debug export [format]`       | Export logs to file (formats: json, csv)    |

## Settings

The extension supports the following settings:

| Setting                 | Default | Description                                                   |
| ----------------------- | ------- | ------------------------------------------------------------- |
| `Auto-start`            | false   | Automatically start debugger when extension loads             |
| `Log level`             | "info"  | Minimum log level to record (error, warn, info, debug, trace) |
| `Log command execution` | true    | Record command execution events                               |
| `Log command output`    | true    | Record command output                                         |
| `Track performance`     | true    | Collect performance metrics for commands                      |
| `Maximum log entries`   | 500     | Maximum number of log entries to keep in memory               |

## Visual Debugger Panel

The extension provides a visual debugger panel with three tabs:

### Logs Tab

Displays chronological logs with timestamps, log levels, and messages. Log levels are color-coded for easy identification:

- Error: Red
- Warning: Yellow
- Info: Blue
- Debug: Green
- Trace: Purple
- Command: Cyan
- Output: White

### Commands Tab

Shows command execution history with:

- Command name and arguments
- Execution status (started, completed, error)
- Execution time (for completed commands)
- Error details (for failed commands)

### Performance Tab

Displays performance metrics for executed commands:

- Execution count
- Average execution time
- Minimum execution time
- Maximum execution time

## Usage Examples

### Basic Debugging

```
# Start the debugger
debug start

# Run some commands to see execution metrics
ls
cd documents
ping localhost

# View performance metrics
debug performance

# Show visual panel
debug show

# Stop the debugger
debug stop
```

### Custom Logging

```
# Add custom log entries
debug log info "Starting file upload process"
debug log debug "Connection parameters: endpoint=api.example.com, timeout=30s"
debug log warn "Network latency detected"
debug log error "Upload failed: timeout"

# Export logs for analysis
debug export csv
```

### Performance Analysis

```
# Start debugger with focus on performance
debug start

# Run commands multiple times to gather metrics
for i in {1..10}; do find . -name "*.js"; done

# View detailed performance stats
debug performance

# Export complete data for offline analysis
debug export json
```

## Programmatic API

If you're developing extensions that interact with the debugger, you can access it through the terminal API:

```javascript
// Access the debugger
const debugger = terminal.getExtension('debugger-extension');

// Log custom events
debugger.log('info', 'Custom event from extension');

// Get performance metrics
const metrics = debugger.getPerformanceMetrics();

// Listen for debugger events
terminal.on('debugger-log', (logEntry) => {
  console.log('Debugger logged:', logEntry);
});
```

## Debugging Your Extensions

The Debugger Extension is particularly useful for extension developers:

1. Start the debugger: `debug start`
2. Show the visual panel: `debug show`
3. Run your extension commands
4. Review logs and performance
5. Export data for detailed analysis: `debug export json`

## Troubleshooting

If the debugger is affecting terminal performance:

- Increase the minimum log level to reduce logging: `debug log warn`
- Disable command output logging if not needed
- Reduce the maximum log entries setting

If the visual panel is not appearing:

- Check for console errors
- Try refreshing the terminal
- Ensure the DOM access is allowed for the extension

## Compatibility

The Debugger Extension works with all modern browsers that support:

- ES6+ JavaScript features
- DOM manipulation APIs
- Blob and File APIs (for export functionality)
- Performance API for timing measurements
