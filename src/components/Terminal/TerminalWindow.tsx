// src/components/Terminal/TerminalWindow.tsx
/**
 * 1. Add type annotations for `children`, `className`, and `isProcessing` to improve type safety.
 * 2. Implement a loading indicator or spinner when `isProcessing` is true to enhance user experience.
 * 3. Use `React.Fragment` or shorthand `<>` to wrap `children` if you plan to return multiple elements in the future.
 */
import * as React from "react";
import "./terminal.css";

interface TerminalWindowProps {
  children: React.ReactNode;
  isProcessing?: boolean;
  className?: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  isProcessing = false,
  className = "",
}) => {
  return (
    <div
      className={`terminal-window relative w-full h-full overflow-hidden border border-terminal-green ${className}`}
      data-processing={isProcessing ? "true" : "false"}
    >
      {/* Explicit background rendering */}
      <div className="absolute inset-0 bg-terminal-black z-0"></div>

      {/* Scanline effect */}
      <div className="terminal-scanlines absolute inset-0 pointer-events-none z-10"></div>

      {/* CRT effect */}
      <div className="crt-effect absolute inset-0 pointer-events-none z-20"></div>

      {/* Vignette effect */}
      <div className="vignette absolute inset-0 pointer-events-none z-30"></div>

      {/* Content */}
      <div className="relative z-40">{children}</div>
    </div>
  );
};

export default TerminalWindow;
