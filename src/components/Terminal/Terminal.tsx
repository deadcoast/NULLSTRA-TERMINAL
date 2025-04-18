"use client";
/**
 * 1. Implement error handling to manage exceptions and improve robustness.
 * 2. Use TypeScript interfaces or types to define data structures for better type safety.
 * 3. Optimize performance by minimizing unnecessary computations or using memoization.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

import { useTheme } from "../../context";
import { useSocket } from "../../hooks";
import { CommandResult } from "../../hooks/useSocket";
import { formatIpAddress, formatTimestamp } from "../../utils/effectsHelper";
import { TerminalMessage } from "../../utils/terminalCommands/types";

import FileViewer from "./FileViewer";
import "./terminal.css";
import TerminalBody from "./TerminalBody";
import TerminalHeader from "./TerminalHeader";
import TerminalStatusLine from "./TerminalStatusLine";
import TerminalWindow from "./TerminalWindow";
import ThemeSelector from "./ThemeSelector";

// --- Configuration for the Frame ---
const terminalConfig = {
  totalWidth: 75, // Adjust to your desired total width (char count)
  topBarTitle: "CLEye",
  topBarTitleWidth: 7, // Width for ' CLEye ' section
  topBarContent: "> ALWAYS_WATCHING",
  buttonTitle: "NULLSTRA",
  buttonInnerWidth: 14, // Width for ' NULLSTRA ' section inside ║
  initialContent: [
    "{",
    ' "name": "USER_43127",',
    ' "IP": "192.168.1.100",',
    ' "path": "C:/chrome/chrome.exe",',
    ' "enabled_tracking": true',
    "}",
  ],
  lineNumberWidth: 1, // Use 1 for single-digit line numbers
  leadingSpaces: " ", // Keep the indentation
};

// --- Define Props Interface ---
export interface TerminalProps {
  ipAddress?: string;
  showHeader?: boolean;
  showStatus?: boolean;
  initialMessages?: TerminalMessage[] | CommandResult[];
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}

// --- Terminal Component ---
const Terminal: React.FC<TerminalProps> = ({
  ipAddress = "127.0.0.1",
  showHeader = true,
  showStatus = true,
  initialMessages = [],
  title = "Terminal",
  onMinimize: _onMinimize,
  onMaximize: _onMaximize,
  onClose: _onClose,
  className,
}) => {
  // Theme context
  const { theme } = useTheme();
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Terminal state
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [outputMessages, setOutputMessages] = useState<CommandResult[]>(
    initialMessages as CommandResult[],
  );
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  // Client-side IP formatting state
  const [clientIpAddress, setClientIpAddress] = useState("");

  // Generate session ID based on IP address - handle empty IP case for SSR
  const sessionId = `session-${
    ipAddress ? ipAddress.replace(/\./g, "-") : "default"
  }`;

  // Socket.io hook
  const {
    isConnected,
    isExecuting,
    commandResults,
    error,
    executeCommand,
    getCommandHistory,
    clearResults,
  } = useSocket();

  // State for file viewer
  const [fileViewer, setFileViewer] = useState({
    isOpen: false,
    filename: "",
    content: "",
    fileType: "text",
  });

  // Update output messages when command results change
  useEffect(() => {
    if (commandResults.length > 0) {
      setOutputMessages((prevMessages) => [...prevMessages, ...commandResults]);
    }
  }, [commandResults]);

  // Show error messages
  useEffect(() => {
    if (error) {
      const errorMsg: CommandResult = {
        content: `Error: ${error}`,
        timestamp: new Date().toISOString(),
        type: "error",
      };
      setOutputMessages((prev) => [...prev, errorMsg]);
    }
  }, [error]);

  // Get command history from server on mount
  useEffect(() => {
    if (isConnected) {
      getCommandHistory(sessionId);
    }
  }, [isConnected, getCommandHistory, sessionId]);

  // Focus input on mount
  useEffect(() => {
    terminalInputRef.current?.focus();
  }, []);

  // Focus input when clicked anywhere in terminal
  const focusInput = useCallback(() => {
    terminalInputRef.current?.focus();
  }, []);

  const handleCommandSubmit = useCallback(
    (command: string) => {
      if (!command.trim()) {
        return;
      }

      // Special command handling
      if (command.trim() === "clear") {
        handleClear();
        return;
      }

      if (command.trim() === "theme") {
        setThemeDialogOpen(true);
        return;
      }

      // Parse command and arguments
      const parts = command.trim().split(" ");
      const cmd = parts[0];
      const args = parts.slice(1);

      // Add to command history
      setCommandHistory((prev) => [command, ...prev].slice(0, 100));
      setHistoryIndex(-1);

      // Clear input
      setInputValue("");

      // Execute command
      executeCommand(cmd, args, sessionId);
    },
    [executeCommand, sessionId],
  );

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Handle key navigation (up/down for history)
  const handleKeyNavigation = useCallback(
    (direction: "up" | "down") => {
      if (commandHistory.length === 0) {
        return;
      }

      if (direction === "up") {
        // Navigate up in history
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex] || "");
      } else {
        // Navigate down in history
        const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
        setHistoryIndex(newIndex);
        setInputValue(newIndex === -1 ? "" : commandHistory[newIndex]);
      }
    },
    [commandHistory, historyIndex],
  );

  // Handle clear command
  const handleClear = useCallback(() => {
    setOutputMessages([]);
    clearResults();
  }, [clearResults]);

  // Update client-side IP address after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientIpAddress(formatIpAddress(ipAddress));
    }
  }, [ipAddress]);

  return (
    <button
      className={`terminal-container ${
        className || ""
      } bg-transparent border-0 p-0 w-full text-left`}
      onClick={focusInput}
      aria-label="Terminal interface"
    >
      <div
        className="h-screen overflow-hidden flex flex-col"
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.foreground,
          fontFamily: theme.fonts.primary,
          fontSize: theme.fonts.size,
          lineHeight: theme.fonts.lineHeight,
        }}
      >
        <TerminalWindow isProcessing={isExecuting}>
          {/* Header section */}
          {showHeader && (
            <TerminalHeader title={title} ipAddress={clientIpAddress} />
          )}

          {/* Main terminal area */}
          <TerminalBody
            outputMessages={outputMessages}
            inputValue={inputValue}
            isExecuting={isExecuting}
            isConnected={isConnected}
            onInputChange={handleInputChange}
            onCommandSubmit={handleCommandSubmit}
            onClear={handleClear}
            onKeyNavigation={handleKeyNavigation}
            focusInput={focusInput}
          />

          {/* Status bar */}
          {showStatus && (
            <TerminalStatusLine
              ipAddress={clientIpAddress || ""}
              isConnected={isConnected}
              isExecuting={isExecuting}
              timestamp={formatTimestamp()}
            />
          )}
        </TerminalWindow>

        {/* File viewer */}
        {fileViewer.isOpen && (
          <FileViewer
            filename={fileViewer.filename}
            content={fileViewer.content}
            fileType={fileViewer.fileType}
            isOpen={fileViewer.isOpen}
            onClose={() =>
              setFileViewer((prev) => ({ ...prev, isOpen: false }))
            }
          />
        )}

        {/* Theme selector */}
        {themeDialogOpen && (
          <div role="dialog" aria-label="Theme selection">
            <ThemeSelector minimal={false} />
            <button
              className="mt-2 px-3 py-1 border border-terminal-green text-terminal-green rounded"
              onClick={() => setThemeDialogOpen(false)}
              aria-label="Close theme selector"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </button>
  );
};

export default Terminal;
