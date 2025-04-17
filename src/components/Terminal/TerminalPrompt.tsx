// src/components/Terminal/TerminalPrompt.tsx
/**
 * 1. **Debounce Input Changes**: Implement a debounce mechanism for the `onChange` handler to reduce the frequency of updates, improving performance and user experience.

2. **Keyboard Shortcuts for Navigation**: Enhance keyboard navigation by adding shortcuts for quickly accessing command history (e.g., Ctrl + Up/Down) and toggling suggestions (e.g., Ctrl + Space).

3. **Customizable Cursor Styles**: Allow users to customize cursor styles further by providing additional options or themes, enhancing visual appeal and user preference.
 */
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useCommandCompletion } from '../../hooks';
import { CommandRegistry } from '../../utils/terminalCommands/types';
import { Glitch } from '../UI';
import SuggestionList from './SuggestionList';

interface TerminalPromptProps {
  // Original interface
  currentPath?: string;
  onExecuteCommand?: (command: string) => void;
  commandHistory?: string[];
  historyIndex?: number;
  onNavigateHistory?: (direction: 'up' | 'down') => void;
  isProcessing?: boolean;
  commandRegistry?: CommandRegistry;
  availableFiles?: string[];
  
  // New socket-based interface
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (command: string) => void;
  onClear?: () => void;
  onKeyNavigation?: (direction: 'up' | 'down') => void;
  disabled?: boolean;
  cursorStyle?: 'blink' | 'steady' | 'fade';
}

const TerminalPrompt = forwardRef<HTMLInputElement, TerminalPromptProps>(({
  // Original props
  currentPath = '/',
  onExecuteCommand,
  commandHistory = [],
  historyIndex = -1,
  onNavigateHistory,
  isProcessing = false,
  commandRegistry = {},
  availableFiles = [],
  
  // New socket-based props
  value,
  onChange,
  onSubmit,
  onClear,
  onKeyNavigation,
  disabled = false,
  cursorStyle = 'blink'
}, ref) => {
  // State for controlled or uncontrolled input
  const [input, setInput] = useState(value || '');
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const inputRef = (ref as React.RefObject<HTMLInputElement>) || defaultInputRef;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInput(value);
    }
  }, [value]);
  
  // Use the command completion hook if available
  const {
    suggestions,
    activeSuggestion,
    completedValue,
    showSuggestions,
    navigateSuggestions,
    selectSuggestion,
    resetSuggestions,
    handleTabCompletion
  } = useCommandCompletion({
    commandRegistry,
    currentPath,
    currentInput: input,
    availableFiles
  });
  
  // Apply completed value when it changes
  useEffect(() => {
    if (completedValue) {
      setInput(completedValue);
      if (onChange) {
        onChange(completedValue);
      }
    }
  }, [completedValue, onChange]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  
  // Click outside handler to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        resetSuggestions();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [resetSuggestions]);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };
  
  const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        const command = input.trim();
        if (command) {
          // Call the appropriate submit handler
          if (onSubmit) {
            onSubmit(command);
          } else if (onExecuteCommand) {
            onExecuteCommand(command);
          }
          
          // Clear input only if not controlled
          if (value === undefined) {
            setInput('');
          }
          
          resetSuggestions();
        }
        event.preventDefault();
        break;
        
      case 'Tab':
        // Handle tab completion
        handleTabCompletion();
        event.preventDefault();
        break;
        
      case 'ArrowUp':
        // Check if suggestions are showing
        if (showSuggestions) {
          navigateSuggestions('up');
          event.preventDefault();
        } else {
          // Call the appropriate history navigation handler
          if (onKeyNavigation) {
            onKeyNavigation('up');
          } else if (onNavigateHistory) {
            onNavigateHistory('up');
            
            // If we have a command at the current history index, set it as input
            if (historyIndex >= 0 && historyIndex < commandHistory.length) {
              setInput(commandHistory[historyIndex]);
              if (onChange) {
                onChange(commandHistory[historyIndex]);
              }
            } else if (historyIndex === -1) {
              // Reset input when navigating to the start
              setInput('');
              if (onChange) {
                onChange('');
              }
            }
          }
          
          event.preventDefault();
        }
        break;
        
      case 'ArrowDown':
        // Check if suggestions are showing
        if (showSuggestions) {
          navigateSuggestions('down');
          event.preventDefault();
        } else {
          // Call the appropriate history navigation handler
          if (onKeyNavigation) {
            onKeyNavigation('down');
          } else if (onNavigateHistory) {
            onNavigateHistory('down');
            
            // If we have a command at the current history index, set it as input
            if (historyIndex >= 0 && historyIndex < commandHistory.length) {
              setInput(commandHistory[historyIndex]);
              if (onChange) {
                onChange(commandHistory[historyIndex]);
              }
            } else if (historyIndex === -1) {
              // Reset input when navigating to the start
              setInput('');
              if (onChange) {
                onChange('');
              }
            }
          }
          
          event.preventDefault();
        }
        break;
        
      case 'Escape':
        // Close suggestions
        resetSuggestions();
        break;
        
      case 'KeyL':
        // Clear terminal with Ctrl+L
        if (event.ctrlKey && onClear) {
          onClear();
          event.preventDefault();
        }
        break;
        
      default:
        // Do nothing for other keys
        break;
    }
  };
  
  const handleSuggestionSelect = (index: number) => {
    selectSuggestion(index);
    inputRef.current?.focus();
  };
  
  // Determine if we're suggesting commands or files
  const isCommandSuggestion = input.trim().split(/\s+/).length === 1;
  
  // Determine if the input is disabled
  const isDisabled = disabled || isProcessing;
  
  // Apply cursor style
  const getCursorClass = () => {
    switch (cursorStyle) {
      case 'blink':
        return 'animate-cursor-blink';
      case 'fade':
        return 'animate-cursor-fade';
      case 'steady':
        return '';
      default:
        return 'animate-cursor-blink';
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`terminal-input relative flex items-center px-2 py-1 border-t border-shocking-pink ${isDisabled ? 'opacity-50' : ''}`}
    >
      <Glitch intensity="low" active={isProcessing || disabled}>
        <span className="text-shocking-pink font-bold">
          {currentPath ? `[USER@${currentPath}]$ ` : '$ '}
        </span>
      </Glitch>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
        className={`bg-transparent border-none outline-none text-lime flex-grow focus:ring-0 p-0 m-0 ${getCursorClass()}`}
        autoComplete="off"
        spellCheck="false"
        disabled={isDisabled}
      />
      
      {/* Suggestions dropdown */}
      {showSuggestions && !isDisabled && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <SuggestionList
            suggestions={suggestions}
            activeSuggestion={activeSuggestion}
            onSelect={handleSuggestionSelect}
            isCommand={isCommandSuggestion}
          />
        </div>
      )}
    </div>
  );
});

TerminalPrompt.displayName = 'TerminalPrompt';

export default TerminalPrompt;