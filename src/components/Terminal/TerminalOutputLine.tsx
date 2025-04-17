// src/components/Terminal/TerminalOutputLine.tsx
/**
 * 1. Add prop type validation using TypeScript interfaces to ensure correct data types for each prop.
2. Implement default values for `type` and `prefix` to handle cases where they are not provided.
3. Use `React.Fragment` instead of a `div` if the component is meant to return multiple elements without adding extra nodes to the DOM.
 */
import * as React from 'react';

interface TerminalOutputLineProps {
  type?: 'error' | 'warning' | 'success' | 'info' | 'system';
  prefix?: string;
  timestamp?: string;
  children: React.ReactNode;
  className?: string;
}

const TerminalOutputLine: React.FC<TerminalOutputLineProps> = ({
  type,
  prefix,
  timestamp,
  children,
  className = '',
}) => {
  return (
    <div
      className={`terminal-line ${type ? `terminal-line-${type}` : ''} ${className}`}
    >
      {prefix && <span className="terminal-line-prefix">{prefix}</span>}
      {timestamp && <span className="terminal-timestamp">{timestamp}</span>}
      <span className="terminal-line-content">{children}</span>
    </div>
  );
};

export default TerminalOutputLine;
