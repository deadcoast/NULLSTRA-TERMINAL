/**
 * 1. Implement PropTypes or TypeScript interfaces to enforce type checking for the component's props, ensuring better maintainability and reducing runtime errors.

2. Add accessibility features, such as ARIA roles and keyboard navigation support, to improve usability for all users.

3. Include customizable styles or themes to allow users to personalize the appearance of the terminal header.
 */
import React from 'react';

interface TerminalHeaderProps {
  title: string;
  ipAddress?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  showControls?: boolean;
  useGradient?: boolean;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ 
  title, 
  ipAddress,
  onMinimize,
  onMaximize,
  onClose,
  showControls = false,
  useGradient = false
}) => {
  return (
    <div className={`terminal-header flex justify-between items-center ${useGradient ? 'terminal-header-gradient' : ''}`}>
      <div className="text-center w-full">
        <div className="border-b border-shocking-pink border-opacity-50 mb-2 pb-1">
          {'*'.repeat(60)}
        </div>
        <h1 className={`text-lg font-bold ${useGradient ? 'text-night' : 'text-shocking-pink'}`}>
          {title} {ipAddress && <span className="text-sm font-normal">({ipAddress})</span>}
        </h1>
        <div className="border-t border-shocking-pink border-opacity-50 mt-2 pt-1">
          {'*'.repeat(60)}
        </div>
      </div>
      
      {showControls && (
        <div className="flex">
          <button 
            onClick={onMinimize}
            className="w-4 h-4 mx-1 rounded-full bg-maize"
            aria-label="Minimize"
          />
          <button 
            onClick={onMaximize}
            className="w-4 h-4 mx-1 rounded-full bg-lime"
            aria-label="Maximize"
          />
          <button 
            onClick={onClose}
            className="w-4 h-4 mx-1 rounded-full bg-terminal-red"
            aria-label="Close"
          />
        </div>
      )}
    </div>
  );
};

export default TerminalHeader;