"use client";

import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Server URL
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
const REST_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

// Improved Socket.io client options
const socketOptions = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000, // Max reconnection delay of 5 seconds
  timeout: 10000, // Connection timeout
  transports: ["websocket", "polling"], // Prefer websocket, fallback to polling
};

// Command result interface
export interface CommandResult {
  type: "success" | "error" | "info" | "warning" | "command";
  content: string;
  timestamp: string;
  clientFormatted?: boolean;
}

// Command API response interface
interface CommandsResponse {
  commands: string[];
}

// Batch processor for command results
class CommandBatcher {
  private queue: CommandResult[] = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private callback: (results: CommandResult[]) => void;
  private batchSize: number;
  private delayMs: number;

  constructor(
    callback: (results: CommandResult[]) => void,
    batchSize = 5,
    delayMs = 50,
  ) {
    this.callback = callback;
    this.batchSize = batchSize;
    this.delayMs = delayMs;
  }

  add(result: CommandResult) {
    this.queue.push(result);

    // If we've reached batch size, process immediately
    if (this.queue.length >= this.batchSize) {
      this.flush();
      return;
    }

    // Otherwise, set a timeout to process soon
    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.delayMs);
    }
  }

  flush() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.queue.length === 0) return;

    this.callback([...this.queue]);
    this.queue = [];
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.queue = [];
  }
}

// Global socket instance for connection pooling
let globalSocket: ReturnType<typeof io> | null = null;
let connectionCount = 0;

/**
 * Socket hook for terminal communication with the backend
 */
export const useSocket = () => {
  // Socket.io client instance
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const batcherRef = useRef<CommandBatcher | null>(null);

  // Socket connection status
  const [isConnected, setIsConnected] = useState(false);

  // Command execution status
  const [isExecuting, setIsExecuting] = useState(false);

  // Command output
  const [commandResults, setCommandResults] = useState<CommandResult[]>([]);

  // Command history
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // Error message
  const [error, setError] = useState<string | null>(null);

  // Set up batch processor
  useEffect(() => {
    batcherRef.current = new CommandBatcher((results) => {
      setCommandResults((prev) => [...prev, ...results]);
    });

    return () => {
      if (batcherRef.current) {
        batcherRef.current.clear();
      }
    };
  }, []);

  // Debounced command execution
  const debouncedSetError = useCallback(
    debounce((message: string) => {
      setError(message);
    }, 100),
    [],
  );

  /**
   * Initialize Socket.io connection with connection pooling
   */
  useEffect(() => {
    // Use existing socket if available
    if (globalSocket) {
      socketRef.current = globalSocket;
      connectionCount++;

      // If socket is already connected, update state immediately
      if ((globalSocket as any).connected) {
        setIsConnected(true);
        setError(null);
      }
    } else {
      // Create new socket if none exists
      // eslint-disable-next-line no-console
      console.log("Initializing socket connection to:", SOCKET_URL);
      globalSocket = io(SOCKET_URL, socketOptions);
      socketRef.current = globalSocket;
      connectionCount++;
    }

    const socket = socketRef.current;

    if (socket) {
      const onConnect = () => {
        // eslint-disable-next-line no-console
        console.log("Socket connected successfully");
        setIsConnected(true);
        setError(null);
      };

      const onDisconnect = () => {
        // eslint-disable-next-line no-console
        console.log("Socket disconnected");
        setIsConnected(false);
      };

      const onConnectError = (err: any) => {
        // eslint-disable-next-line no-console
        console.error("Socket connection error:", err);
        setIsConnected(false);
        debouncedSetError(`Connection error: ${err.message}`);
      };

      const onCommandStart = () => {
        setIsExecuting(true);
      };

      const onCommandOutput = (result: any) => {
        if (batcherRef.current) {
          batcherRef.current.add(result as CommandResult);
        } else {
          setCommandResults((prev) => [...prev, result as CommandResult]);
        }
      };

      const onCommandResult = (data: any) => {
        setIsExecuting(false);
        const response = data as {
          success: boolean;
          error?: string;
          completed?: boolean;
        };

        if (!response.success && response.error) {
          if (batcherRef.current) {
            batcherRef.current.add({
              type: "error",
              content: response.error || "Unknown error",
              timestamp: new Date().toISOString(),
            });
            // Flush any remaining items
            batcherRef.current.flush();
          } else {
            setCommandResults((prev) => [
              ...prev,
              {
                type: "error",
                content: response.error || "Unknown error",
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } else if (response.completed && batcherRef.current) {
          // Ensure all batched results are flushed when command completes
          batcherRef.current.flush();
        }
      };

      const onCommandHistoryResult = (data: any) => {
        const response = data as {
          success: boolean;
          history?: string[];
          error?: string;
        };

        if (response.success && response.history) {
          setCommandHistory(response.history);
        } else if (response.error) {
          debouncedSetError(response.error);
        }
      };

      // Connection event handler
      socket.on("connect", onConnect);

      // Disconnection event handler
      socket.on("disconnect", onDisconnect);

      // Connection error event handler
      socket.on("connect_error", onConnectError);

      // Command start event handler
      socket.on("command_start", onCommandStart);

      // Command output event handler
      socket.on("command_output", onCommandOutput);

      // Command result event handler
      socket.on("command_result", onCommandResult);

      // Command history result event handler
      socket.on("command_history_result", onCommandHistoryResult);

      // Add a fallback check in case the socket connection is taking too long
      const timeoutId = setTimeout(() => {
        if (!isConnected) {
          // eslint-disable-next-line no-console
          console.log(
            "Socket connection timeout - not connected after 5 seconds",
          );
          debouncedSetError(
            "Connection timeout - could not connect to server. Is the server running?",
          );
        }
      }, 5000);

      return () => {
        // Clean up event listeners
        const s = socket as any;
        s.off("connect", onConnect);
        s.off("disconnect", onDisconnect);
        s.off("connect_error", onConnectError);
        s.off("command_start", onCommandStart);
        s.off("command_output", onCommandOutput);
        s.off("command_result", onCommandResult);
        s.off("command_history_result", onCommandHistoryResult);

        clearTimeout(timeoutId);

        // Clean up connection count
        connectionCount--;

        // Only disconnect the socket if no other components are using it
        if (connectionCount === 0 && globalSocket) {
          // eslint-disable-next-line no-console
          console.log("Cleaning up socket connection");
          globalSocket.disconnect();
          globalSocket = null;
        }
      };
    }
  }, [isConnected, debouncedSetError]);

  /**
   * Execute a command via Socket.io with debounce for rapid inputs
   */
  // Create a debounced version of the command execution
  const debouncedExecuteCommand = useCallback(
    debounce(
      (command: string, args: string[] = [], sessionId?: string) => {
        const socket = socketRef.current;
        if (!socket || !isConnected) {
          debouncedSetError("Socket not connected");
          return false;
        }

        try {
          // Emit the command to the server
          socket.emit("execute_command", {
            command,
            args,
            sessionId,
          });

          return true;
        } catch (err) {
          debouncedSetError((err as Error).message);
          return false;
        }
      },
      200, // Debounce delay in milliseconds
      { leading: true, trailing: false }, // Execute on the leading edge
    ),
    [isConnected, debouncedSetError],
  );

  const executeCommand = useCallback(
    (command: string, args: string[] = [], sessionId?: string) => {
      if (!socketRef.current || !isConnected) {
        debouncedSetError("Socket not connected");
        return false;
      }

      try {
        // Clear previous command results
        setCommandResults([]);
        if (batcherRef.current) {
          batcherRef.current.clear();
        }

        // Add command to results immediately (don't batch this)
        setCommandResults([
          {
            type: "command",
            content: `${command} ${args.join(" ")}`.trim(),
            timestamp: new Date().toISOString(),
          },
        ]);

        // Use debounced execution for rapid inputs
        debouncedExecuteCommand(command, args, sessionId);

        return true;
      } catch (err) {
        debouncedSetError((err as Error).message);
        return false;
      }
    },
    [isConnected, debouncedExecuteCommand, debouncedSetError],
  );

  /**
   * Get command history via Socket.io
   */
  const getCommandHistory = useCallback(
    (sessionId: string) => {
      if (!socketRef.current || !isConnected) {
        debouncedSetError("Socket not connected");
        return false;
      }

      try {
        socketRef.current.emit("get_command_history", { sessionId });
        return true;
      } catch (err) {
        debouncedSetError((err as Error).message);
        return false;
      }
    },
    [isConnected, debouncedSetError],
  );

  /**
   * Get available commands via REST API
   * Uses a cached version if available
   */
  const cachedCommandsRef = useRef<string[]>([]);
  const commandsFetchTimeRef = useRef<number>(0);
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

  const getAvailableCommands = useCallback(async () => {
    // Return cached commands if they're fresh
    const now = Date.now();
    if (
      cachedCommandsRef.current.length > 0 &&
      now - commandsFetchTimeRef.current < CACHE_TTL
    ) {
      return cachedCommandsRef.current;
    }

    try {
      const response = await fetch(`${REST_API_URL}/api/commands`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as CommandsResponse;

      // Update cache
      cachedCommandsRef.current = data.commands || [];
      commandsFetchTimeRef.current = now;

      return cachedCommandsRef.current;
    } catch (err) {
      debouncedSetError((err as Error).message);
      return cachedCommandsRef.current.length > 0
        ? cachedCommandsRef.current // Return stale cache on error
        : [];
    }
  }, [debouncedSetError]);

  /**
   * Clear command results
   */
  const clearResults = useCallback(() => {
    setCommandResults([]);
    setError(null);
    if (batcherRef.current) {
      batcherRef.current.clear();
    }
  }, []);

  return {
    isConnected,
    isExecuting,
    commandResults,
    commandHistory,
    error,
    executeCommand,
    getCommandHistory,
    getAvailableCommands,
    clearResults,
  };
};

export default useSocket;
