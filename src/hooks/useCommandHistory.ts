import { useCallback, useState } from 'react';

const useCommandHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Add a command to history
  const addToHistory = useCallback((command: string) => {
    setHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);
  }, []);
  
  // Navigate through history
  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (direction === 'up') {
          // Move back in history
          if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
          }
        }
    else if (historyIndex >= 0) {
            setHistoryIndex(prev => prev - 1);
          }
  }, [historyIndex, history.length]);
  
  // Get current command from history
  const getCurrentCommand = useCallback(() => {
    if (historyIndex >= 0 && historyIndex < history.length) {
      return history[historyIndex];
    }
    return '';
  }, [history, historyIndex]);
  
  return {
    history,
    historyIndex,
    addToHistory,
    navigateHistory,
    getCurrentCommand
  };
};

export default useCommandHistory;