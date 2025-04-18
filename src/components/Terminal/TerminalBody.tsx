import * as React from "react";
const {   useCallback, useRef   } = React;

import { useTheme } from "../../context";
import { CommandResult } from "../../hooks/useSocket";
import { CRTEffect } from "../UI";

import StatusPanel from "./StatusPanel";
import TerminalInput from "./TerminalInput";
import VirtualizedOutput from "./VirtualizedOutput";

interface TerminalBodyProps {
  outputMessages: CommandResult[];
  inputValue: string;
  isExecuting: boolean;
  isConnected: boolean;
  onInputChange: (value: string) => void;
  onCommandSubmit: (command: string) => void;
  onClear: () => void;
  onKeyNavigation: (direction: "up" | "down") => void;
  focusInput: () => void;
}

const TerminalBody: React.FC<TerminalBodyProps> = ({
  outputMessages,
  inputValue,
  isExecuting,
  isConnected,
  onInputChange,
  onCommandSubmit,
  onClear,
  onKeyNavigation,
  focusInput,
}) => {
  const { theme } = useTheme();
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        focusInput();
      }
    },
    [focusInput],
  );

  // Display welcome message if no output
  const displayMessages =
    outputMessages.length > 0
      ? outputMessages
      : [
          {
            content: `Welcome to the Terminal UI. ${isConnected ? "Connected to server." : "WARNING: Not connected to server. Some features may be unavailable."}`,
            timestamp: new Date().toISOString(),
            type: isConnected ? "info" : "warning",
            clientFormatted: true,
          } as CommandResult,
          {
            content: "Type 'help' for a list of available commands.",
            timestamp: new Date().toISOString(),
            type: "info" as const,
            clientFormatted: true,
          },
        ];

  return (
    <button
      className="flex-grow overflow-hidden relative p-2 bg-transparent border-0 w-full text-left"
      aria-label="Terminal output area"
      onClick={focusInput}
      onKeyDown={handleKeyDown}
    >
      {/* Add the CRT effect */}
      <CRTEffect
        intensity={theme.effects?.crtIntensity || 0.5}
        isProcessing={isExecuting}
        enabled={theme.effects?.crtEffect !== false}
      />

      {/* Status Panel */}
      <StatusPanel className="mb-4" />

      {/* Terminal output area with virtualization */}
      <VirtualizedOutput
        messages={displayMessages}
        onExecuteCommand={onCommandSubmit}
        containerRef={terminalOutputRef}
        suppressHydrationWarning
      />

      {/* Command input */}
      <TerminalInput
        value={inputValue}
        onChange={onInputChange}
        onSubmit={onCommandSubmit}
        onClear={onClear}
        onKeyNavigation={onKeyNavigation}
        disabled={false}
        inputRef={terminalInputRef}
        cursorStyle="fade"
      />
    </button>
  );
};

export default React.memo(TerminalBody);
