// src/components/Terminal/TerminalOutputLine.tsx
/**
 * 1. Add prop type validation using TypeScript interfaces to ensure correct data types for each prop.
2. Implement default values for `type` and `prefix` to handle cases where they are not provided.
3. Use `React.Fragment` instead of a `div` if the component is meant to return multiple elements without adding extra nodes to the DOM.
 */
import classNames from "classnames";
import React, { useEffect, useState } from "react";

/**
 * Interface for the props of the TerminalOutputLine component
 */
interface TerminalOutputLineProps {
  type?: "command" | "error" | "warning" | "success" | "info" | "system";
  prefix?: string;
  timestamp?: string;
  children?: React.ReactNode;
  animated?: boolean;
  files?: string[];
  className?: string;
}

/**
 * Component to render a line of terminal output
 */
const TerminalOutputLine: React.FC<TerminalOutputLineProps> = ({
  type = "info",
  prefix,
  timestamp,
  children,
  animated = false,
  files,
  className,
}) => {
  // State to track if we're on the client side
  const [isClient, setIsClient] = useState(false);
  
  // Use effect to set isClient to true after hydration completes
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Determine the line class based on type
  const lineClass = classNames("terminal-line", {
    "terminal-line-command": type === "command",
    "terminal-line-error": type === "error",
    "terminal-line-warning": type === "warning",
    "terminal-line-success": type === "success",
    "terminal-line-info": type === "info",
    "terminal-line-system": type === "system",
    "animated": animated,
  }, className);

  // For file listings
  const renderFiles = () => {
    if (!files || files.length === 0) return null;
    return (
      <div className="terminal-files">
        {files.map((file, index) => (
          <span
            key={index}
            className={classNames("terminal-file", {
              "terminal-directory": file.endsWith("/"),
            })}
          >
            {file}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={lineClass}>
      {prefix && <span className="terminal-line-prefix">{prefix}</span>}
      <span className="terminal-content">{children}</span>
      {files && renderFiles()}
      {timestamp && (
        <span className="terminal-timestamp" suppressHydrationWarning>
          {isClient ? timestamp : ''}
        </span>
      )}
    </div>
  );
};

export default TerminalOutputLine;
