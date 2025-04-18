"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import { CommandResult } from "../hooks/useSocket";
import { TerminalMessage } from "../utils/terminalCommands/types";

// Define the terminal state interface
interface TerminalState {
  inputValue: string;
  commandHistory: string[];
  historyIndex: number;
  outputMessages: CommandResult[];
  isFocused: boolean;
  isProcessing: boolean;
  themeDialogOpen: boolean;
  fileViewer: {
    isOpen: boolean;
    filename: string;
    content: string;
    fileType: string;
  };
}

// Define action types
type TerminalAction =
  | { type: "SET_INPUT_VALUE"; payload: string }
  | { type: "ADD_COMMAND_TO_HISTORY"; payload: string }
  | { type: "NAVIGATE_HISTORY"; payload: "up" | "down" }
  | { type: "ADD_OUTPUT_MESSAGE"; payload: CommandResult }
  | { type: "ADD_OUTPUT_MESSAGES"; payload: CommandResult[] }
  | { type: "CLEAR_OUTPUT" }
  | { type: "SET_FOCUS"; payload: boolean }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "TOGGLE_THEME_DIALOG"; payload?: boolean }
  | {
      type: "OPEN_FILE_VIEWER";
      payload: { filename: string; content: string; fileType?: string };
    }
  | { type: "CLOSE_FILE_VIEWER" };

// Define initial state
const initialState: TerminalState = {
  inputValue: "",
  commandHistory: [],
  historyIndex: -1,
  outputMessages: [],
  isFocused: false,
  isProcessing: false,
  themeDialogOpen: false,
  fileViewer: {
    isOpen: false,
    filename: "",
    content: "",
    fileType: "text",
  },
};

// Create the reducer function
function terminalReducer(
  state: TerminalState,
  action: TerminalAction,
): TerminalState {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return {
        ...state,
        inputValue: action.payload,
      };

    case "ADD_COMMAND_TO_HISTORY":
      // Only add if not empty and not the same as the most recent command
      if (
        !action.payload.trim() ||
        (state.commandHistory.length > 0 &&
          state.commandHistory[0] === action.payload)
      ) {
        return state;
      }
      return {
        ...state,
        commandHistory: [action.payload, ...state.commandHistory].slice(0, 100),
        historyIndex: -1,
      };

    case "NAVIGATE_HISTORY":
      if (state.commandHistory.length === 0) {
        return state;
      }

      if (action.payload === "up") {
        const newIndex =
          state.historyIndex < state.commandHistory.length - 1
            ? state.historyIndex + 1
            : state.historyIndex;
        return {
          ...state,
          historyIndex: newIndex,
          inputValue: state.commandHistory[newIndex] || "",
        };
      } else {
        const newIndex = state.historyIndex > 0 ? state.historyIndex - 1 : -1;
        return {
          ...state,
          historyIndex: newIndex,
          inputValue: newIndex === -1 ? "" : state.commandHistory[newIndex],
        };
      }

    case "ADD_OUTPUT_MESSAGE":
      return {
        ...state,
        outputMessages: [...state.outputMessages, action.payload],
      };

    case "ADD_OUTPUT_MESSAGES":
      return {
        ...state,
        outputMessages: [...state.outputMessages, ...action.payload],
      };

    case "CLEAR_OUTPUT":
      return {
        ...state,
        outputMessages: [],
      };

    case "SET_FOCUS":
      return {
        ...state,
        isFocused: action.payload,
      };

    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.payload,
      };

    case "TOGGLE_THEME_DIALOG":
      return {
        ...state,
        themeDialogOpen:
          action.payload !== undefined
            ? action.payload
            : !state.themeDialogOpen,
      };

    case "OPEN_FILE_VIEWER":
      return {
        ...state,
        fileViewer: {
          isOpen: true,
          filename: action.payload.filename,
          content: action.payload.content,
          fileType: action.payload.fileType || "text",
        },
      };

    case "CLOSE_FILE_VIEWER":
      return {
        ...state,
        fileViewer: {
          ...state.fileViewer,
          isOpen: false,
        },
      };

    default:
      return state;
  }
}

// Create the context
interface TerminalContextType {
  state: TerminalState;
  setInputValue: (value: string) => void;
  addCommandToHistory: (command: string) => void;
  navigateHistory: (direction: "up" | "down") => void;
  addOutputMessage: (message: CommandResult) => void;
  addOutputMessages: (messages: CommandResult[]) => void;
  clearOutput: () => void;
  setFocus: (isFocused: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  toggleThemeDialog: (open?: boolean) => void;
  openFileViewer: (
    filename: string,
    content: string,
    fileType?: string,
  ) => void;
  closeFileViewer: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

// Create the provider component
interface TerminalProviderProps {
  children: ReactNode;
  initialMessages?: TerminalMessage[] | CommandResult[];
}

export function TerminalProvider({
  children,
  initialMessages = [],
}: TerminalProviderProps) {
  const [state, dispatch] = useReducer(terminalReducer, {
    ...initialState,
    outputMessages: initialMessages as CommandResult[],
  });

  // Action creators
  const setInputValue = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT_VALUE", payload: value });
  }, []);

  const addCommandToHistory = useCallback((command: string) => {
    dispatch({ type: "ADD_COMMAND_TO_HISTORY", payload: command });
  }, []);

  const navigateHistory = useCallback((direction: "up" | "down") => {
    dispatch({ type: "NAVIGATE_HISTORY", payload: direction });
  }, []);

  const addOutputMessage = useCallback((message: CommandResult) => {
    dispatch({ type: "ADD_OUTPUT_MESSAGE", payload: message });
  }, []);

  const addOutputMessages = useCallback((messages: CommandResult[]) => {
    dispatch({ type: "ADD_OUTPUT_MESSAGES", payload: messages });
  }, []);

  const clearOutput = useCallback(() => {
    dispatch({ type: "CLEAR_OUTPUT" });
  }, []);

  const setFocus = useCallback((isFocused: boolean) => {
    dispatch({ type: "SET_FOCUS", payload: isFocused });
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    dispatch({ type: "SET_PROCESSING", payload: isProcessing });
  }, []);

  const toggleThemeDialog = useCallback((open?: boolean) => {
    dispatch({ type: "TOGGLE_THEME_DIALOG", payload: open });
  }, []);

  const openFileViewer = useCallback(
    (filename: string, content: string, fileType?: string) => {
      dispatch({
        type: "OPEN_FILE_VIEWER",
        payload: { filename, content, fileType },
      });
    },
    [],
  );

  const closeFileViewer = useCallback(() => {
    dispatch({ type: "CLOSE_FILE_VIEWER" });
  }, []);

  const value: TerminalContextType = {
    state,
    setInputValue,
    addCommandToHistory,
    navigateHistory,
    addOutputMessage,
    addOutputMessages,
    clearOutput,
    setFocus,
    setProcessing,
    toggleThemeDialog,
    openFileViewer,
    closeFileViewer,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

// Custom hook to use the terminal context
export function useTerminalContext() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error(
      "useTerminalContext must be used within a TerminalProvider",
    );
  }
  return context;
}

export default TerminalContext;
