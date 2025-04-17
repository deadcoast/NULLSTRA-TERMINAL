import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Server URL
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const REST_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Socket.io client options
const socketOptions = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};

// Command result interface
export interface CommandResult {
  type: 'success' | 'error' | 'info' | 'warning' | 'command';
  content: string;
  timestamp: string;
}

/**
 * Socket hook for terminal communication with the backend
 */
const useSocket = () => {
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
    // Create Socket.io client instance
    socketRef.current = io(SOCKET_URL, socketOptions);
    
    // Connection event handler
    socketRef.current!.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setError(null);
    });
    
    // Disconnection event handler
    socketRef.current!.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    // Connection error event handler
    socketRef.current!.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
      setError(`Connection error: ${err.message}`);
    });
    
    // Command start event handler
    socketRef.current!.on('command_start', () => {
      setIsExecuting(true);
    });
    
    // Command output event handler
    socketRef.current!.on('command_output', (result: CommandResult) => {
      setCommandResults((prev) => [...prev, result]);
    });
    
    // Command result event handler
    socketRef.current!.on('command_result', (data: { success: boolean, error?: string, completed?: boolean }) => {
      setIsExecuting(false);
      
      if (!data.success && data.error) {
        setCommandResults((prev) => [
          ...prev,
          {
            type: 'error',
            content: data.error || 'Unknown error',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    });
    
    // Command history result event handler
    socketRef.current!.on('command_history_result', (data: { success: boolean, history?: string[], error?: string }) => {
      if (data.success && data.history) {
        setCommandHistory(data.history);
      } else if (data.error) {
        setError(data.error);
      }
    });
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  /**
   * Execute a command via Socket.io
   */
  const executeCommand = useCallback((command: string, args: string[] = [], sessionId?: string) => {
    if (!socketRef.current || !isConnected) {
      setError('Socket not connected');
      return false;
    }
    
    try {
      // Clear previous command results
      setCommandResults([]);
      
      // Add command to results
      setCommandResults([{
        type: 'command',
        content: `${command} ${args.join(' ')}`.trim(),
        timestamp: new Date().toISOString()
      }]);
      
      // Execute command
      socketRef.current.emit('execute_command', {
        command,
        args,
        sessionId
      });
      
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }, [isConnected]);
  
  /**
   * Get command history via Socket.io
   */
  const getCommandHistory = useCallback((sessionId: string) => {
    if (!socketRef.current || !isConnected) {
      setError('Socket not connected');
      return false;
    }
    
    try {
      socketRef.current.emit('get_command_history', { sessionId });
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }, [isConnected]);
  
  /**
   * Get available commands via REST API
   */
  const getAvailableCommands = useCallback(async () => {
    try {
      const response = await axios.get(`${REST_API_URL}/api/commands`);
      return response.data?.commands || [];
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
    clearResults
  };
};

export default useSocket; 