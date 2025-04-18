```tsx
import React from "react";
import "../../styles/terminal.css"; // Adjust path if needed

interface TerminalHeaderProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  showControls?: boolean;
  title: string;
  className?: string;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  onMinimize,
  onMaximize,
  onClose,
  showControls = false
  title,
  className = "",
}) => {

  return (
        <div className="terminal-header flex justify-between items-center">
      <div className="text-center w-full">
        <div className="border-b border-terminal-magenta border-opacity-50 mb-2 pb-1">
          {'*'.repeat(60)}
        </div>
        <h1 className="text-lg font-bold">
          {title}
        </h1>
        <div className="border-t border-terminal-magenta border-opacity-50 mt-2 pt-1">
          {'*'.repeat(60)}
        </div>
      </div>

      {showControls && (
        <div className="flex">
          <button
            onClick={onMinimize}
            className="w-4 h-4 mx-1 rounded-full bg-terminal-yellow"
          />
          <button
            onClick={onMaximize}
            className="w-4 h-4 mx-1 rounded-full bg-terminal-green"
          />
          <button
            onClick={onClose}
            className="w-4 h-4 mx-1 rounded-full bg-terminal-red"
          />
        </div>
      )}
    <div className={`terminal-header ${className}`}>
      <div className="terminal-header-tag">TERMINAL</div>
      <div className="terminal-header-content">{title}</div>
    </div>
  );
};

export default TerminalHeader;
```
