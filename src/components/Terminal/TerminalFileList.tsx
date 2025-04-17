// src/components/Terminal/TerminalFileList.tsx
/**
 * 1. Add type definitions for `files` and `onFileClick` to ensure type safety and improve code readability.

2. Implement error handling for cases where `files` might be empty or undefined to prevent runtime errors.

3. Use `React.Fragment` or shorthand syntax (`<>...</>`) to avoid unnecessary div wrappers if no additional styling is needed.
 */
import React from 'react';

interface TerminalFileListProps {
  title: string;
  files: string[];
  className?: string;
  onFileClick?: (file: string) => void;
}

const TerminalFileList: React.FC<TerminalFileListProps> = ({
  title,
  files,
  className = '',
  onFileClick,
}) => {
  return (
    <div className={`terminal-file-list ${className}`}>
      <div className="terminal-file-list-header">{title}</div>
      <div className="terminal-file-list-content">
        {files.map((file, index) => (
          <span
            key={index}
            className={`terminal-file-name ${onFileClick ? 'terminal-file-clickable' : ''}`}
            onClick={onFileClick ? () => onFileClick(file) : undefined}
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TerminalFileList;
