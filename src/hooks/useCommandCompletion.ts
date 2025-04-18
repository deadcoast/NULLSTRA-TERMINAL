import * as React from "react";
const {  useCallback, useEffect, useState  } = React;
import { CommandRegistry } from "../utils/terminalCommands/types";

interface UseCommandCompletionParams {
  commandRegistry: CommandRegistry;
  _currentPath: string;
  currentInput: string;
  availableFiles?: string[];
}

interface UseCommandCompletionResult {
  suggestions: string[];
  activeSuggestion: number;
  completedValue: string;
  showSuggestions: boolean;
  navigateSuggestions: (direction: "up" | "down") => void;
  selectSuggestion: (index?: number) => void;
  resetSuggestions: () => void;
  handleTabCompletion: () => void;
}

const useCommandCompletion = ({
  commandRegistry,
  _currentPath,
  currentInput,
  availableFiles = [],
}: UseCommandCompletionParams): UseCommandCompletionResult => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [completedValue, setCompletedValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Generate suggestions based on input
  useEffect(() => {
    if (!currentInput) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const parts = currentInput.trim().split(/\s+/);
    const firstWord = parts[0].toLowerCase();

    // If we're entering the first word, suggest commands
    if (parts.length === 1) {
      const commandSuggestions = Object.keys(commandRegistry)
        .filter((cmd) => cmd.startsWith(firstWord))
        .sort();

      setSuggestions(commandSuggestions);

      // If only one suggestion and it exactly matches the input, don't show suggestions
      if (
        commandSuggestions.length === 1 &&
        commandSuggestions[0] === firstWord
      ) {
        setShowSuggestions(false);
      } else if (commandSuggestions.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
    // If we're entering arguments for commands like cd, ls, cat, suggest files/directories
    else if (["cd", "ls", "cat", "view"].includes(firstWord)) {
      // Get the partial path the user is typing
      const currentArg = parts[parts.length - 1];

      // Filter files based on the current argument
      const fileSuggestions = availableFiles
        .filter((file) => file.startsWith(currentArg))
        .sort();

      setSuggestions(fileSuggestions);

      if (fileSuggestions.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      // For other commands, don't show suggestions for now
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Reset active suggestion whenever input changes
    setActiveSuggestion(-1);
  }, [currentInput, commandRegistry, availableFiles]);

  // Navigate through suggestions
  const navigateSuggestions = useCallback(
    (direction: "up" | "down") => {
      if (!showSuggestions || suggestions.length === 0) {
        return;
      }

      if (direction === "down") {
        const newIndex =
          activeSuggestion < suggestions.length - 1 ? activeSuggestion + 1 : 0;
        setActiveSuggestion(newIndex);
      } else {
        const newIndex =
          activeSuggestion > 0 ? activeSuggestion - 1 : suggestions.length - 1;
        setActiveSuggestion(newIndex);
      }
    },
    [activeSuggestion, suggestions, showSuggestions],
  );

  // Select a suggestion
  const selectSuggestion = useCallback(
    (index?: number) => {
      if (!showSuggestions || suggestions.length === 0) {
        return;
      }

      const selectedIndex = index !== undefined ? index : activeSuggestion;
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const parts = currentInput.trim().split(/\s+/);

        if (parts.length === 1) {
          // If selecting a command, replace the whole input
          setCompletedValue(suggestions[selectedIndex]);
        } else {
          // If selecting a file/path, replace just the last part
          parts[parts.length - 1] = suggestions[selectedIndex];
          setCompletedValue(parts.join(" "));
        }

        setShowSuggestions(false);
      }
    },
    [activeSuggestion, currentInput, suggestions, showSuggestions],
  );

  // Reset suggestions
  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setActiveSuggestion(-1);
    setShowSuggestions(false);
  }, []);

  // Handle tab completion
  const handleTabCompletion = useCallback(() => {
    if (suggestions.length === 0) {
      return;
    }

    // If there's only one suggestion, use it directly
    if (suggestions.length === 1) {
      const parts = currentInput.trim().split(/\s+/);

      if (parts.length === 1) {
        // If completing a command, replace the whole input
        setCompletedValue(suggestions[0]);
      } else {
        // If completing a file/path, replace just the last part
        parts[parts.length - 1] = suggestions[0];
        setCompletedValue(parts.join(" "));
      }
    }
    // If there are multiple suggestions and none is active, try to complete common prefix
    else if (activeSuggestion === -1) {
      const commonPrefix = findCommonPrefix(suggestions);

      if (commonPrefix && commonPrefix.length > 0) {
        const parts = currentInput.trim().split(/\s+/);

        if (parts.length === 1) {
          // If completing a command, replace the whole input
          setCompletedValue(commonPrefix);
        } else {
          // If completing a file/path, replace just the last part
          parts[parts.length - 1] = commonPrefix;
          setCompletedValue(parts.join(" "));
        }
      } else {
        // If no common prefix, just show suggestions
        setShowSuggestions(true);
      }
    }
    // If a suggestion is active, select it
    else {
      selectSuggestion();
    }
  }, [currentInput, suggestions, activeSuggestion, selectSuggestion]);

  return {
    suggestions,
    activeSuggestion,
    completedValue,
    showSuggestions,
    navigateSuggestions,
    selectSuggestion,
    resetSuggestions,
    handleTabCompletion,
  };
};

// Helper function to find the common prefix among an array of strings
const findCommonPrefix = (strings: string[]): string => {
  if (strings.length === 0) {
    return "";
  }

  if (strings.length === 1) {
    return strings[0];
  }

  const firstString = strings[0];
  let prefixLength = firstString.length;

  for (let i = 1; i < strings.length; i++) {
    const currentString = strings[i];
    let j = 0;

    while (
      j < prefixLength &&
      j < currentString.length &&
      firstString[j].toLowerCase() === currentString[j].toLowerCase()
    ) {
      j++;
    }

    prefixLength = j;

    if (prefixLength === 0) {
      break;
    }
  }

  return firstString.substring(0, prefixLength);
};

export default useCommandCompletion;
