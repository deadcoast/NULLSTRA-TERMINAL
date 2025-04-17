// src/components/Terminal/TerminalDialog.tsx
/**
 * 1. Add TypeScript interfaces for props to ensure type safety and improve code readability.
2. Implement accessibility features, such as ARIA roles and keyboard navigation, to enhance usability.
3. Include a backdrop or overlay to focus user attention on the dialog and improve visual hierarchy. 
 */
import React, { ReactNode } from 'react';

interface TerminalDialogProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  showCloseButton?: boolean;
}

const TerminalDialog: React.FC<TerminalDialogProps> = ({
  title,
  children,
  onClose,
  className = '',
  showCloseButton = true,
}) => {
  return (
    <div className={`terminal-dialog ${className}`}>
      <div className="terminal-dialog-header">
        <span className="terminal-dialog-title">{title}</span>
        {showCloseButton && onClose && (
          <button className="terminal-dialog-close" onClick={onClose}>
            X
          </button>
        )}
      </div>
      <div className="terminal-dialog-content">{children}</div>
    </div>
  );
};

export default TerminalDialog;
