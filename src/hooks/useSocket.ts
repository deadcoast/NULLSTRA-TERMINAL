import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

// Server URL
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const REST_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Socket.io client options
const socketOptions = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
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

/**
 * Socket hook for terminal communication with the backend
 */
export const useSocket = () => {
  // Socket.io client instance
  const socketRef = useRef<Socket | null>(null);

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

  /**
   * Initialize Socket.io connection
   */
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Initializing socket connection to:", SOCKET_URL);
    
    // Create Socket.io client instance
    socketRef.current = io(SOCKET_URL, socketOptions);
    const socket = socketRef.current;

    if (socket) {
      // Connection event handler
      socket.on("connect", () => {
        // eslint-disable-next-line no-console
        console.log("Socket connected successfully");
        setIsConnected(true);
        setError(null);
      });

      // Disconnection event handler
      socket.on("disconnect", () => {
        // eslint-disable-next-line no-console
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      // Connection error event handler
      socket.on("connect_error", (err) => {
        // eslint-disable-next-line no-console
        console.error("Socket connection error:", err);
        setIsConnected(false);
        setError(`Connection error: ${(err as Error).message}`);
      });

      // Add a fallback check in case the socket connection is taking too long
      const timeoutId = setTimeout(() => {
        if (!isConnected) {
          // eslint-disable-next-line no-console
          console.log(
            "Socket connection timeout - not connected after 5 seconds"
          );
          setError(
            "Connection timeout - could not connect to server. Is the server running?"
          );
        }
      }, 5000);

      // Command start event handler
      socket.on("command_start", () => {
        setIsExecuting(true);
      });

      // Command output event handler
      socket.on("command_output", (result) => {
        setCommandResults((prev) => [...prev, result as CommandResult]);
      });

      // Command result event handler
      socket.on("command_result", (data) => {
        const response = data as {
          success: boolean;
          error?: string;
          completed?: boolean;
        };
        setIsExecuting(false);

        if (!response.success && response.error) {
          setCommandResults((prev) => [
            ...prev,
            {
              type: "error",
              content: response.error || "Unknown error",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      });

      // Command history result event handler
      socket.on("command_history_result", (data) => {
        const response = data as {
          success: boolean;
          history?: string[];
          error?: string;
        };
        if (response.success && response.history) {
          setCommandHistory(response.history);
        } else if (response.error) {
          setError(response.error);
        }
      });

      return () => {
        clearTimeout(timeoutId);
        if (socketRef.current) {
          // eslint-disable-next-line no-console
          console.log("Cleaning up socket connection");
          socketRef.current.disconnect();
        }
      };
    }
  }, [isConnected]);

  /**
   * Execute a command via Socket.io
   */
  const executeCommand = useCallback(
    (command: string, args: string[] = [], sessionId?: string) => {
      if (!socketRef.current || !isConnected) {
        setError("Socket not connected");
        return false;
      }

      try {
        // Clear previous command results
        setCommandResults([]);

        // Add command to results
        setCommandResults([
          {
            type: "command",
            content: `${command} ${args.join(" ")}`.trim(),
            timestamp: new Date().toISOString(),
          },
        ]);

        // Execute command
        socketRef.current.emit("execute_command", {
          command,
          args,
          sessionId,
        });

        return true;
      } catch (err) {
        setError((err as Error).message);
        return false;
      }
    },
    [isConnected],
  );

  /**
   * Get command history via Socket.io
   */
  const getCommandHistory = useCallback(
    (sessionId: string) => {
      if (!socketRef.current || !isConnected) {
        setError("Socket not connected");
        return false;
      }

      try {
        socketRef.current.emit("get_command_history", { sessionId });
        return true;
      } catch (err) {
        setError((err as Error).message);
        return false;
      }
    },
    [isConnected],
  );

  /**
   * Get available commands via REST API
   */
  const getAvailableCommands = useCallback(async () => {
    try {
      const response = await axios.get<CommandsResponse>(
        `${REST_API_URL}/api/commands`,
      );
      return response.data.commands || [];
    } catch (err) {
      setError((err as Error).message);
      return [];
    }
  }, []);

  /**
   * Clear command results
   */
  const clearResults = useCallback(() => {
    setCommandResults([]);
    setError(null);
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
