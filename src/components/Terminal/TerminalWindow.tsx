// src/components/Terminal/TerminalWindow.tsx
/**
 * 1. Add type annotations for `children`, `className`, and `isProcessing` to improve type safety.
2. Implement a loading indicator or spinner when `isProcessing` is true to enhance user experience.
3. Use `React.Fragment` or shorthand `<>` to wrap `children` if you plan to return multiple elements in the future.
 */
import React, { ReactNode } from 'react';
import './terminal.css';

interface TerminalWindowProps {
  children: ReactNode;
  className?: string;
  isProcessing?: boolean;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  className = '',
  isProcessing = false,
}) => {
  return (
    <div className={`terminal-window ${className}`}>
      <div
        className={`terminal-background ${isProcessing ? 'processing' : ''}`}
      >
        <div className="terminal-scanlines"></div>
        <div className="terminal-content">{children}</div>
      </div>
    </div>
  );
};

export default TerminalWindow;
