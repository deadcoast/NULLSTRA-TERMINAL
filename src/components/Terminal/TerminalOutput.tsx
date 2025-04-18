/**
 * 1. Implement a loading indicator to enhance user experience during command execution.
2. Add keyboard shortcuts for quick command execution to improve accessibility.
3. Include error handling to display user-friendly messages for failed commands.
 */
import { forwardRef } from "react";
import { CommandResult } from "../../hooks/useSocket";
import { TerminalMessage } from "../../utils/terminalCommands/types";
import MessageRenderer from "./MessageRenderer";

// Define a union type that can handle both the original TerminalMessage and the new CommandResult
type MessageType = TerminalMessage | CommandResult;

interface TerminalOutputProps {
  messages: MessageType[];
  onExecuteCommand?: (command: string) => void;
  className?: string;
  suppressHydrationWarning?: boolean;
}

const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  (
    {
      messages,
      onExecuteCommand,
      className = "",
      suppressHydrationWarning = false,
    },
    ref,
  ) => {
    // Handle the different message types
    const renderMessage = (message: MessageType, index: number) => {
      return (
        <div
          key={`${message.timestamp}-${index}`}
          suppressHydrationWarning={suppressHydrationWarning}
          className="mb-1 relative z-10"
        >
          <MessageRenderer
            message={message as TerminalMessage}
            onExecuteCommand={onExecuteCommand}
          />
        </div>
      );
    };

    return (
      <div
        className={`terminal-output flex-grow overflow-y-auto mb-1 text-xs leading-tight pr-1 ${className}`}
        ref={ref}
        suppressHydrationWarning={suppressHydrationWarning}
      >
        <div className="crt-glow opacity-50 pointer-events-none absolute inset-0"></div>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => renderMessage(message, index))
        ) : (
          <div className="text-terminal-gray">No output to display</div>
        )}
      </div>
    );
  },
);

TerminalOutput.displayName = "TerminalOutput";

export default TerminalOutput;
