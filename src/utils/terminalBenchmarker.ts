/**
 * Terminal Benchmarking Utility
 *
 * This utility provides tools for benchmarking terminal performance with
 * multiple sessions, tracking performance metrics, and generating reports.
 */

import { performance } from "perf_hooks";

/**
 * Metrics collected during terminal session benchmarking
 */
export interface TerminalSessionMetrics {
  /** Unique session identifier */
  sessionId: string;
  /** Command execution time in milliseconds */
  commandExecutionTime: number[];
  /** Time to first output in milliseconds */
  timeToFirstOutput: number[];
  /** Render time for terminal output in milliseconds */
  renderTime: number[];
  /** Time between command submission and full rendering in milliseconds */
  totalResponseTime: number[];
  /** Terminal memory usage in MB */
  memoryUsage: number[];
  /** Frames per second during active periods */
  fps: number[];
  /** Input latency in milliseconds */
  inputLatency: number[];
  /** Time between terminal output updates in milliseconds */
  outputUpdateDelay: number[];
  /** Number of DOM nodes in terminal output */
  outputDomNodes: number[];
}

/**
 * Configuration for terminal benchmark tests
 */
export interface BenchmarkConfig {
  /** Number of terminal sessions to create */
  sessionCount: number;
  /** Commands to execute in each session */
  commands: string[];
  /** Delay between commands in milliseconds */
  commandDelay: number;
  /** Time to run benchmark in milliseconds */
  duration: number;
  /** Whether to run commands randomly */
  randomCommands: boolean;
  /** Whether to collect memory profiles */
  collectMemoryProfiles: boolean;
  /** Whether to simulate user typing */
  simulateTyping: boolean;
  /** Typing speed in characters per second when simulating */
  typingSpeed: number;
}

/**
 * Default benchmark configuration
 */
const DEFAULT_CONFIG: BenchmarkConfig = {
  sessionCount: 3,
  commands: [
    "ls -la",
    'echo "Hello World"',
    "cat package.json",
    "ps aux",
    'find . -type f -name "*.ts" | wc -l',
    "date",
    "uptime",
  ],
  commandDelay: 500,
  duration: 30000, // 30 seconds
  randomCommands: true,
  collectMemoryProfiles: true,
  simulateTyping: true,
  typingSpeed: 10, // 10 chars per second
};

/**
 * Result of a terminal benchmark test
 */
export interface BenchmarkResult {
  /** Configuration used for the test */
  config: BenchmarkConfig;
  /** Metrics for each terminal session */
  sessionMetrics: TerminalSessionMetrics[];
  /** Aggregate metrics across all sessions */
  aggregateMetrics: {
    /** Average command execution time in milliseconds */
    avgCommandExecutionTime: number;
    /** 95th percentile command execution time in milliseconds */
    p95CommandExecutionTime: number;
    /** Maximum command execution time in milliseconds */
    maxCommandExecutionTime: number;
    /** Average render time in milliseconds */
    avgRenderTime: number;
    /** Average total response time in milliseconds */
    avgTotalResponseTime: number;
    /** Average memory usage in MB */
    avgMemoryUsage: number;
    /** Peak memory usage in MB */
    peakMemoryUsage: number;
    /** Average FPS across all sessions */
    avgFps: number;
    /** Minimum FPS observed */
    minFps: number;
    /** Average input latency in milliseconds */
    avgInputLatency: number;
  };
  /** Start time of the benchmark */
  startTime: number;
  /** End time of the benchmark */
  endTime: number;
  /** Total duration of the benchmark in milliseconds */
  totalDuration: number;
  /** Any errors that occurred during the benchmark */
  errors: string[];
}

/**
 * Terminal session simulation for benchmarking
 */
class TerminalSession {
  private metrics: TerminalSessionMetrics;
  private commandQueue: string[] = [];
  private isExecuting = false;
  private startTime = 0;
  private sessionElement: HTMLElement | null = null;
  private outputObserver: MutationObserver | null = null;
  private animationFrameId: number | null = null;
  private frameCount = 0;
  private lastFrameTime = 0;
  private typingInterval: NodeJS.Timeout | null = null;

  /**
   * Create a terminal session for benchmarking
   */
  constructor(
    public readonly id: string,
    private config: BenchmarkConfig,
    private onMetricsUpdate: (metrics: TerminalSessionMetrics) => void,
  ) {
    this.metrics = {
      sessionId: id,
      commandExecutionTime: [],
      timeToFirstOutput: [],
      renderTime: [],
      totalResponseTime: [],
      memoryUsage: [],
      fps: [],
      inputLatency: [],
      outputUpdateDelay: [],
      outputDomNodes: [],
    };
  }

  /**
   * Initialize the terminal session
   */
  public initialize(container: HTMLElement): void {
    // Create terminal container
    this.sessionElement = document.createElement("div");
    this.sessionElement.className = "benchmark-terminal";
    this.sessionElement.setAttribute("data-session-id", this.id);
    container.appendChild(this.sessionElement);

    // Create terminal input
    const input = document.createElement("input");
    input.type = "text";
    input.className = "benchmark-terminal-input";
    this.sessionElement.appendChild(input);

    // Create terminal output
    const output = document.createElement("div");
    output.className = "benchmark-terminal-output";
    this.sessionElement.appendChild(output);

    // Set up mutation observer to track terminal output changes
    this.outputObserver = new MutationObserver((mutations) => {
      const now = performance.now();

      // Track time to first output if this is the first output after command
      if (
        this.startTime > 0 &&
        this.metrics.timeToFirstOutput.length <
          this.metrics.commandExecutionTime.length
      ) {
        this.metrics.timeToFirstOutput.push(now - this.startTime);
      }

      // Track DOM node count
      this.metrics.outputDomNodes.push(output.querySelectorAll("*").length);

      // Track render time (simplified - real implementation would use RequestAnimationFrame callback)
      const renderStart = performance.now();
      requestAnimationFrame(() => {
        this.metrics.renderTime.push(performance.now() - renderStart);
      });
    });

    this.outputObserver.observe(output, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Start FPS monitoring
    this.startFpsMonitoring();
  }

  /**
   * Execute a command in the terminal
   */
  public executeCommand(command: string): void {
    if (this.isExecuting) {
      // Queue the command if currently executing
      this.commandQueue.push(command);
      return;
    }

    this.isExecuting = true;

    if (this.config.simulateTyping) {
      this.simulateTyping(command);
    } else {
      this.submitCommand(command);
    }
  }

  /**
   * Simulate user typing a command
   */
  private simulateTyping(command: string): void {
    const input = this.sessionElement?.querySelector(
      ".benchmark-terminal-input",
    ) as HTMLInputElement;
    if (!input) return;

    input.value = "";
    let charIndex = 0;
    const charsPerSecond = this.config.typingSpeed;
    const delay = 1000 / charsPerSecond;

    // Measure input latency from first character
    const inputStart = performance.now();

    this.typingInterval = setInterval(() => {
      if (charIndex < command.length) {
        // Append the next character
        input.value += command.charAt(charIndex);

        // Record input latency on first character
        if (charIndex === 0) {
          this.metrics.inputLatency.push(performance.now() - inputStart);
        }

        charIndex++;
      } else {
        // Clear typing interval and submit command
        if (this.typingInterval) {
          clearInterval(this.typingInterval);
          this.typingInterval = null;
        }
        this.submitCommand(command);
      }
    }, delay);
  }

  /**
   * Submit a command to the terminal
   */
  private submitCommand(command: string): void {
    const input = this.sessionElement?.querySelector(
      ".benchmark-terminal-input",
    ) as HTMLInputElement;
    const output = this.sessionElement?.querySelector(
      ".benchmark-terminal-output",
    );

    if (!input || !output) return;

    // Record start time for metrics
    this.startTime = performance.now();

    // Create command output element
    const commandElement = document.createElement("div");
    commandElement.className = "command-entry";

    const promptElement = document.createElement("span");
    promptElement.className = "prompt";
    promptElement.textContent = "$ ";

    const commandTextElement = document.createElement("span");
    commandTextElement.className = "command-text";
    commandTextElement.textContent = command;

    commandElement.appendChild(promptElement);
    commandElement.appendChild(commandTextElement);
    output.appendChild(commandElement);

    // Clear input
    input.value = "";

    // Simulate command execution with delay based on command complexity
    const executionTime = this.getSimulatedExecutionTime(command);

    setTimeout(() => {
      // Record command execution time
      this.metrics.commandExecutionTime.push(executionTime);

      // Generate simulated output
      const outputElement = document.createElement("div");
      outputElement.className = "command-output";

      const outputText = this.getSimulatedOutput(command);
      outputElement.textContent = outputText;

      output.appendChild(outputElement);

      // Record total response time
      this.metrics.totalResponseTime.push(performance.now() - this.startTime);

      // Record memory usage
      if (
        this.config.collectMemoryProfiles &&
        typeof performance !== "undefined" &&
        (performance as any).memory &&
        (performance as any).memory.usedJSHeapSize
      ) {
        this.metrics.memoryUsage.push(
          (performance as any).memory.usedJSHeapSize / (1024 * 1024),
        );
      } else {
        this.metrics.memoryUsage.push(0);
      }

      // Send metrics update
      this.onMetricsUpdate({ ...this.metrics });

      // Execute next command from queue after delay
      setTimeout(() => {
        this.isExecuting = false;

        if (this.commandQueue.length > 0) {
          const nextCommand = this.commandQueue.shift()!;
          this.executeCommand(nextCommand);
        }
      }, this.config.commandDelay);
    }, executionTime);
  }

  /**
   * Get simulated execution time based on command complexity
   */
  private getSimulatedExecutionTime(command: string): number {
    // Simple heuristic - longer commands or commands with pipes take longer
    let baseTime = 50 + command.length * 5;

    if (command.includes("|")) {
      baseTime += 200 * (command.split("|").length - 1);
    }

    if (command.includes("find") || command.includes("grep")) {
      baseTime += 500;
    }

    // Add some randomness
    return baseTime + Math.random() * 100;
  }

  /**
   * Get simulated output for a command
   */
  private getSimulatedOutput(command: string): string {
    // Very simplified simulation - real implementation would be more complex
    if (command.startsWith("ls")) {
      return "file1.txt\nfile2.js\ndirectory1\ndirectory2\npackage.json\nREADME.md";
    } else if (command.startsWith("echo")) {
      const match = /echo\s+"?([^"]*)"?/.exec(command);
      return match ? match[1] : "";
    } else if (command.includes("cat")) {
      return '{\n  "name": "terminal-app",\n  "version": "1.0.0",\n  "description": "Terminal Application"\n}';
    } else if (command.startsWith("date")) {
      return new Date().toString();
    } else if (command.startsWith("uptime")) {
      return "10:30  up 2 days, 12:43, 5 users, load averages: 1.20 1.33 1.45";
    } else if (command.includes("find") && command.includes("wc -l")) {
      return "42";
    } else if (command.startsWith("ps")) {
      return "USER    PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nuser  12345  2.0  0.2 123456 12345 ?        Ss   10:00   0:01 node\nuser  12346  1.5  0.1  98765  9876 ?        S    10:01   0:00 npm";
    }

    return "Command executed successfully.";
  }

  /**
   * Start monitoring FPS
   */
  private startFpsMonitoring(): void {
    this.frameCount = 0;
    this.lastFrameTime = performance.now();

    const updateFps = () => {
      this.frameCount++;
      const now = performance.now();
      const elapsed = now - this.lastFrameTime;

      // Update FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / elapsed);
        this.metrics.fps.push(fps);
        this.frameCount = 0;
        this.lastFrameTime = now;
      }

      this.animationFrameId = requestAnimationFrame(updateFps);
    };

    this.animationFrameId = requestAnimationFrame(updateFps);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.outputObserver) {
      this.outputObserver.disconnect();
      this.outputObserver = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }

    if (this.sessionElement?.parentNode) {
      this.sessionElement.parentNode.removeChild(this.sessionElement);
    }
  }

  /**
   * Get the current metrics
   */
  public getMetrics(): TerminalSessionMetrics {
    return { ...this.metrics };
  }
}

/**
 * Terminal Benchmarker for testing multiple terminal sessions
 */
export class TerminalBenchmarker {
  private sessions: TerminalSession[] = [];
  private container: HTMLElement | null = null;
  private config: BenchmarkConfig;
  private sessionMetrics: TerminalSessionMetrics[] = [];
  private benchmarkTimer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private startTime = 0;
  private endTime = 0;
  private errors: string[] = [];
  private sessionCommands: Map<string, number> = new Map();

  /**
   * Create a terminal benchmarker
   */
  constructor(config: Partial<BenchmarkConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start the benchmark
   */
  public async start(container: HTMLElement): Promise<BenchmarkResult> {
    if (this.isRunning) {
      throw new Error("Benchmark is already running");
    }

    this.isRunning = true;
    this.container = container;
    this.startTime = performance.now();
    this.errors = [];
    this.sessionMetrics = [];
    this.sessionCommands = new Map();

    try {
      // Create terminal sessions
      for (let i = 0; i < this.config.sessionCount; i++) {
        const sessionId = `session-${i + 1}`;
        const session = new TerminalSession(
          sessionId,
          this.config,
          this.handleMetricsUpdate.bind(this),
        );

        this.sessions.push(session);
        session.initialize(container);
        this.sessionCommands.set(sessionId, 0);
      }

      // Schedule commands for each session
      this.scheduleCommands();

      // Return promise that resolves when benchmark completes
      return new Promise<BenchmarkResult>((resolve) => {
        this.benchmarkTimer = setTimeout(() => {
          this.stop();
          resolve(this.generateResults());
        }, this.config.duration);
      });
    } catch (error) {
      this.isRunning = false;
      this.errors.push(`Failed to start benchmark: ${error}`);
      throw error;
    }
  }

  /**
   * Schedule commands to be executed
   */
  private scheduleCommands(): void {
    // Initial commands for each session
    this.sessions.forEach((session) => {
      this.executeRandomCommand(session);
    });

    // Schedule additional commands during the benchmark
    const scheduleNextCommands = () => {
      if (!this.isRunning) return;

      // Calculate how many commands each session should execute
      const totalCommands = Math.ceil(
        this.config.duration / (this.config.commandDelay * 2),
      );
      const commandsPerSession = Math.ceil(
        totalCommands / this.config.sessionCount,
      );

      // Schedule additional commands if needed
      this.sessions.forEach((session) => {
        const executedCommands = this.sessionCommands.get(session.id) || 0;

        if (executedCommands < commandsPerSession) {
          // Schedule next command with random delay
          const delay =
            this.config.commandDelay + Math.random() * this.config.commandDelay;

          setTimeout(() => {
            if (this.isRunning) {
              this.executeRandomCommand(session);
              scheduleNextCommands();
            }
          }, delay);
        }
      });
    };

    // Start scheduling after initial delay
    setTimeout(scheduleNextCommands, this.config.commandDelay * 2);
  }

  /**
   * Execute a random command in a session
   */
  private executeRandomCommand(session: TerminalSession): void {
    const { commands, randomCommands } = this.config;

    // Select command based on configuration
    let command: string;

    if (randomCommands) {
      const index = Math.floor(Math.random() * commands.length);
      command = commands[index];
    } else {
      const commandIndex = this.sessionCommands.get(session.id) || 0;
      command = commands[commandIndex % commands.length];
    }

    // Track command count for this session
    this.sessionCommands.set(
      session.id,
      (this.sessionCommands.get(session.id) || 0) + 1,
    );

    // Execute command
    session.executeCommand(command);
  }

  /**
   * Handle metrics update from a session
   */
  private handleMetricsUpdate(metrics: TerminalSessionMetrics): void {
    // Find existing metrics for this session
    const existingIndex = this.sessionMetrics.findIndex(
      (m) => m.sessionId === metrics.sessionId,
    );

    if (existingIndex >= 0) {
      // Update existing metrics
      this.sessionMetrics[existingIndex] = metrics;
    } else {
      // Add new metrics
      this.sessionMetrics.push(metrics);
    }
  }

  /**
   * Stop the benchmark
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.endTime = performance.now();

    // Clear benchmark timer
    if (this.benchmarkTimer) {
      clearTimeout(this.benchmarkTimer);
      this.benchmarkTimer = null;
    }

    // Destroy sessions
    this.sessions.forEach((session) => {
      session.destroy();
    });

    this.sessions = [];
  }

  /**
   * Generate benchmark results
   */
  private generateResults(): BenchmarkResult {
    // Calculate aggregate metrics
    const allExecutionTimes: number[] = [];
    const allRenderTimes: number[] = [];
    const allResponseTimes: number[] = [];
    const allMemoryUsages: number[] = [];
    const allFps: number[] = [];
    const allInputLatencies: number[] = [];

    // Collect all metrics
    this.sessionMetrics.forEach((metrics) => {
      allExecutionTimes.push(...metrics.commandExecutionTime);
      allRenderTimes.push(...metrics.renderTime);
      allResponseTimes.push(...metrics.totalResponseTime);
      allMemoryUsages.push(...metrics.memoryUsage);
      allFps.push(...metrics.fps);
      allInputLatencies.push(...metrics.inputLatency);
    });

    // Calculate aggregate metrics
    const aggregateMetrics = {
      avgCommandExecutionTime: this.calculateAverage(allExecutionTimes),
      p95CommandExecutionTime: this.calculatePercentile(allExecutionTimes, 95),
      maxCommandExecutionTime: Math.max(...allExecutionTimes),
      avgRenderTime: this.calculateAverage(allRenderTimes),
      avgTotalResponseTime: this.calculateAverage(allResponseTimes),
      avgMemoryUsage: this.calculateAverage(allMemoryUsages),
      peakMemoryUsage: Math.max(...allMemoryUsages),
      avgFps: this.calculateAverage(allFps),
      minFps: Math.min(...allFps),
      avgInputLatency: this.calculateAverage(allInputLatencies),
    };

    return {
      config: { ...this.config },
      sessionMetrics: [...this.sessionMetrics],
      aggregateMetrics,
      startTime: this.startTime,
      endTime: this.endTime,
      totalDuration: this.endTime - this.startTime,
      errors: [...this.errors],
    };
  }

  /**
   * Calculate average of an array of numbers
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * Calculate percentile of an array of numbers
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;

    // Sort values
    const sorted = [...values].sort((a, b) => a - b);

    // Calculate index
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;

    return sorted[index];
  }
}

/**
 * Create a terminal benchmarker with the given configuration
 */
export function createTerminalBenchmarker(
  config: Partial<BenchmarkConfig> = {},
): TerminalBenchmarker {
  return new TerminalBenchmarker(config);
}

/**
 * Run a terminal benchmark with the given configuration
 */
export async function runTerminalBenchmark(
  container: HTMLElement,
  config: Partial<BenchmarkConfig> = {},
): Promise<BenchmarkResult> {
  const benchmarker = createTerminalBenchmarker(config);
  return await benchmarker.start(container);
}

export default {
  createTerminalBenchmarker,
  runTerminalBenchmark,
};
