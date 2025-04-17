/*
 * 1. **Debounce Input Handling**: Implement a debounce mechanism for the `handleSubmit` function to prevent multiple rapid submissions when the Enter key is pressed multiple times.
 * 2. **Accessibility Improvements**: Add ARIA roles and properties to enhance accessibility, such as `aria-live` for announcing command execution feedback to screen readers.
 * 3. **Error Handling**: Introduce error handling for the `onSubmit` function to manage and display any errors that may occur during command execution, providing user feedback.
 */

import { KeyboardEvent, useEffect, useRef, useState } from 'react';

interface CommandPromptProps {
  path: string;
  onSubmit: (command: string) => void;
  history: string[];
  historyIndex: number;
  onNavigateHistory: (direction: 'up' | 'down') => void;
  cursorStyle?: 'default' | 'fade'; // Add option for cursor style
}

const CommandPrompt: React.FC<CommandPromptProps> = ({
  path,
  onSubmit,
  history,
  historyIndex,
  onNavigateHistory,
  cursorStyle = 'default' // Default to the original style
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>( null );
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandExecuted, setCommandExecuted] = useState(false);
  
  // Focus input on mount and when path changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [path]);
    
  // Handle command execution with visual feedback
  const handleSubmit = () => {
    if (!input.trim()) {
      return;
    }
    
    setIsExecuting(true);
    setCommandExecuted(true);
    
    // Clear command-executed class after animation completes
    setTimeout(() => {
      setCommandExecuted(false);
    }, 300); // Match animation duration
    
    // Visual delay for execution effect
    setTimeout(() => {
      onSubmit(input);
      setInput('');
      setIsExecuting(false);
    }, 200);
  };
  
  
  // Update input when navigating through history
  useEffect(() => {
    if (historyIndex >= 0 && historyIndex < history.length) {
      setInput(history[historyIndex]);
    } else if (historyIndex === -1) {
      setInput('');
    }
  }, [historyIndex, history]);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      if (input.trim()) {
        onSubmit(input);
        setInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigateHistory('down');
    }
  };
  
  // Define cursor class based on the selected style
  const cursorClass = cursorStyle === 'fade' ? 'cursor-fade' : 'cursor';
  
  return (
    <div className={`command-prompt command-input-line ${commandExecuted ? 'command-executed' : ''} ${isExecuting ? 'command-execute' : ''}`}>
      <div className="text-terminal-brightGreen mr-2 flex items-center">
        <span>USER</span>
        <span className="text-terminal-white mx-1">/</span>
        <span className="path">{path}</span>
      </div>
      <div className="flex-1 flex items-center">
        <span className="text-terminal-white mr-1">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-terminal-green"
          autoFocus
          disabled={isExecuting}
        />
        <span className={`${cursorClass} ${isExecuting ? 'hidden' : ''}`} />
      </div>
    </div>
  );
};

export default CommandPrompt;