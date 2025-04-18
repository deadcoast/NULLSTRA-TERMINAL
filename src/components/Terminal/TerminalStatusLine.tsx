// src/components/Terminal/TerminalStatusLine.tsx
/**
 * 1. Implement error handling to manage connection issues and display user-friendly messages.
2. Use TypeScript enums for status indicators to improve code readability and maintainability.
3. Optimize rendering by using React.memo to prevent unnecessary re-renders when props haven't changed.
 */
import React from "react";

interface TerminalStatusLineProps {
  ipAddress: string;
  isConnected: boolean;
  isExecuting: boolean;
  timestamp: string;
  className?: string;
  children?: React.ReactNode;
}

// No IP address or timestamp rendered on server
const ServerComponent: React.FC<
  Omit<TerminalStatusLineProps, "ipAddress" | "timestamp">
> = ({ isConnected, isExecuting, className = "", children }) => {
  return (
    <div
      className={`terminal-status-line text-xs flex justify-between items-center px-2 py-1 border-t border-shocking-pink ${className}`}
    >
      <div className="flex items-center space-x-2">
        <span className="terminal-status-ip">&lt;...&gt;</span>
        <span
          className={`connection-status ${isConnected ? "text-lime" : "text-red"}`}
        >
          {isConnected ? "[CONNECTED]" : "[DISCONNECTED]"}
        </span>
        {isExecuting && (
          <span className="processing-status text-yellow">[PROCESSING]</span>
        )}
      </div>
      {children || <span className="terminal-status-time"></span>}
    </div>
  );
};

// Full component with all data on client
const ClientComponent: React.FC<TerminalStatusLineProps> = ({
  ipAddress,
  isConnected,
  isExecuting,
  timestamp,
  className = "",
  children,
}) => {
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
      {children || <span className="terminal-status-time">{timestamp}</span>}
    </div>
  );
};

const TerminalStatusLine: React.FC<TerminalStatusLineProps> = (props) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render dynamic data on server, render complete data on client
  if (!isClient) {
    // Server-side rendering or initial client render
    return (
      <ServerComponent
        isConnected={props.isConnected}
        isExecuting={props.isExecuting}
        className={props.className}
      >
        {props.children}
      </ServerComponent>
    );
  }

  // Client-side rendering
  return <ClientComponent {...props} />;
};

// Optimize rendering using React.memo as suggested in the comments
export default React.memo(TerminalStatusLine);
