// src/components/Terminal/TerminalFileList.tsx
/**
 * 1. Add type definitions for `files` and `onFileClick` to ensure type safety and improve code readability.
 * 2. Implement error handling for cases where `files` might be empty or undefined to prevent runtime errors.
 * 3. Use `React.Fragment` or shorthand syntax (`<>...</>`) to avoid unnecessary div wrappers if no additional styling is needed.
 */
import * as React from "react";

interface TerminalFileListProps {
  title: string;
  files: string[];
  className?: string;
  onFileClick?: (file: string) => void;
}

const TerminalFileList: React.FC<TerminalFileListProps> = ({
  title,
  files,
  className = "",
  onFileClick,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent, file: string) => {
    if (onFileClick && (event.key === "Enter" || event.key === " ")) {
      onFileClick(file);
      event.preventDefault();
    }
  };

  return (
    <div
      className={`terminal-file-list ${className}`}
      role="region"
      aria-labelledby="file-list-title"
    >
      <div className="terminal-file-list-header" id="file-list-title">
        {title}
      </div>
      <div className="terminal-file-list-content" role="list">
        {files.map((file, index) => (
          <span
            key={index}
            className={`terminal-file-name ${onFileClick ? "terminal-file-clickable" : ""}`}
            onClick={onFileClick ? () => onFileClick(file) : undefined}
            onKeyDown={onFileClick ? (e) => handleKeyDown(e, file) : undefined}
            role={onFileClick ? "button" : "listitem"}
            tabIndex={onFileClick ? 0 : undefined}
            aria-label={`File: ${file}`}
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TerminalFileList;
