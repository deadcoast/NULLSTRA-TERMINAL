// src/components/Terminal/TerminalStatusLine.tsx
/**
 * 1. Implement error handling to manage connection issues and display user-friendly messages.
2. Use TypeScript enums for status indicators to improve code readability and maintainability.
3. Optimize rendering by using React.memo to prevent unnecessary re-renders when props haven't changed.
 */
import React, { useEffect, useState } from "react";

interface TerminalStatusLineProps {
  ipAddress: string;
  isConnected: boolean;
  isExecuting: boolean;
  timestamp: string;
  className?: string;
  children?: React.ReactNode;
}

const TerminalStatusLine: React.FC<TerminalStatusLineProps> = ({
  ipAddress,
  isConnected,
  isExecuting,
  timestamp,
  className = "",
  children,
}) => {
  const [clientTimestamp, setClientTimestamp] = useState(timestamp);
  
  // Update timestamp on client side only
  useEffect(() => {
    setClientTimestamp(timestamp);
  }, [timestamp]);

  return (
    <div
      className={`terminal-status-line text-xs flex justify-between items-center px-2 py-1 border-t border-shocking-pink ${className}`}
    >
      <div className="flex items-center space-x-2">
        <span className="terminal-status-ip">&lt;{ipAddress}&gt;</span>
        <span
          className={`connection-status ${isConnected ? "text-lime" : "text-red"}`}
        >
          {isConnected ? "[CONNECTED]" : "[DISCONNECTED]"}
        </span>
        {isExecuting && (
          <span className="processing-status text-yellow">[PROCESSING]</span>
        )}
      </div>
      {children || (
        <span suppressHydrationWarning className="terminal-status-time">
          {typeof window !== 'undefined' ? clientTimestamp : timestamp}
        </span>
      )}
    </div>
  );
};

export default TerminalStatusLine;
