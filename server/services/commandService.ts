import { exec } from "child_process";
import util from "util";
import { getRedisClient } from "../db/redis";

// Convert exec to Promise-based API
const execPromise = util.promisify(exec);

// Command result type
export interface CommandResult {
  type: "success" | "error" | "info" | "warning";
  content: string;
  timestamp: string;
}

// Whitelist of safe commands that can be executed
const SAFE_COMMANDS = [
  "echo",
  "ls",
  "cat",
  "find",
  "grep",
  "pwd",
  "date",
  "whoami",
  "ping",
  "traceroute",
  "netstat",
  "curl",
];

/**
 * Execute a terminal command securely
 */
export const executeCommand = async (
  command: string,
  args: string[] = [],
  sessionId?: string,
): Promise<CommandResult[] | CommandResult> => {
  try {
    // Basic security: Check if command is in whitelist
    const baseCommand = command.split(" ")[0];
    if (!SAFE_COMMANDS.includes(baseCommand)) {
      return {
        type: "error",
        content: `Command not allowed: ${baseCommand}`,
        timestamp: new Date().toISOString(),
      };
    }

    // For simulated commands that don't need actual execution
    if (command === "ping" && args.length > 0) {
      return simulatePing(args[0]);
    }

    if (command === "traceroute" && args.length > 0) {
      return simulateTraceroute(args[0]);
    }

    // For actual command execution (be careful with this in production)
    const fullCommand = `${command} ${args.join(" ")}`.trim();
    const { stdout, stderr } = await execPromise(fullCommand);

    // Store command in history if Redis is enabled and sessionId is provided
    if (sessionId) {
      storeCommandInHistory(sessionId, fullCommand);
    }

    if (stderr) {
      return {
        type: "error",
        content: stderr,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      type: "success",
      content: stdout,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Command execution error:", error);
    return {
      type: "error",
      content: (error as Error).message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Store command in user's history using Redis
 */
const storeCommandInHistory = async (
  sessionId: string,
  command: string,
): Promise<void> => {
  try {
    const redis = getRedisClient();
    if (!redis) {
      return;
    }

    const historyKey = `terminal:history:${sessionId}`;
    await redis.lPush(historyKey, command);
    await redis.lTrim(historyKey, 0, 99); // Keep last 100 commands
    await redis.expire(historyKey, 60 * 60 * 24 * 7); // Expire after 7 days
  } catch (error) {
    console.error("Error storing command history:", error);
  }
};

/**
 * Get command history for a session
 */
export const getCommandHistory = async (
  sessionId: string,
): Promise<string[]> => {
  try {
    const redis = getRedisClient();
    if (!redis) {
      return [];
    }
    if (!sessionId) {
      return [];
    }
    if (!redis.isReady) {
      return [];
    }
    if (!redis.lRange) {
      return [];
    }
    if (!redis.expire) {
      return [];
    }
    if (!redis.lTrim) {
      return [];
    }
    if (!redis.lPush) {
      return [];
    }

    const historyKey = `terminal:history:${sessionId}`;
    return await redis.lRange(historyKey, 0, -1);
  } catch (error) {
    console.error("Error getting command history:", error);
    return [];
  }
};

/**
 * Simulate ping command for safe execution
 */
const simulatePing = (host: string): CommandResult[] => {
  const results: CommandResult[] = [];
  const timestamp = new Date().toISOString();

  results.push({
    type: "info",
    content: `PING ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}): 56 data bytes`,
    timestamp,
  });

  // Simulate 4 ping responses
  for (let i = 0; i < 4; i++) {
    const time = (Math.random() * 10 + 5).toFixed(3);
    results.push({
      type: "info",
      content: `64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${time} ms`,
      timestamp,
    });
  }

  results.push({
    type: "success",
    content: `--- ${host} ping statistics ---`,
    timestamp,
  });

  results.push({
    type: "info",
    content: "4 packets transmitted, 4 packets received, 0.0% packet loss",
    timestamp,
  });

  const min = 5;
  const max = 15;
  const avg = (Math.random() * (max - min) + min).toFixed(3);

  results.push({
    type: "info",
    content: `round-trip min/avg/max/stddev = ${min.toFixed(3)}/${avg}/${max.toFixed(3)}/2.345 ms`,
    timestamp,
  });

  return results;
};

/**
 * Simulate traceroute command for safe execution
 */
const simulateTraceroute = (host: string): CommandResult[] => {
  const results: CommandResult[] = [];
  const timestamp = new Date().toISOString();

  results.push({
    type: "info",
    content: `traceroute to ${host}, 30 hops max, 60 byte packets`,
    timestamp,
  });

  // Generate realistic IP addresses
  const baseIp1 = Math.floor(Math.random() * 255);
  const baseIp2 = Math.floor(Math.random() * 255);

  // Simulate 5 hops
  for (let i = 1; i <= 5; i++) {
    const ip =
      i === 5
        ? host
        : `${baseIp1}.${baseIp2}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const time1 = (Math.random() * 10 + i * 5).toFixed(3);
    const time2 = (Math.random() * 10 + i * 5).toFixed(3);
    const time3 = (Math.random() * 10 + i * 5).toFixed(3);

    results.push({
      type: "info",
      content: `${i}  ${ip}  ${time1} ms  ${time2} ms  ${time3} ms`,
      timestamp,
    });
  }

  return results;
};
