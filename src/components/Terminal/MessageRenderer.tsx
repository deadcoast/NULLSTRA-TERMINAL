/**
 * Renders a message component based on the type and content of the provided message object.
 * It handles various message types including progress, table data, file listings, and standard messages.
 * 1. Add TypeScript interfaces for `message` and `onExecuteCommand` to ensure type safety and improve code readability.
 * 2. Implement a default case in the switch statement to handle unexpected message types gracefully.
 * 3. Consider using a mapping object for message types to their corresponding components to simplify the switch statement.
 * @param {Object} message - The message object containing data to be rendered.
 * @param {Function} onExecuteCommand - Callback function to execute commands related to the message.
 */
import * as React from "react";
const {   useEffect, useState   } = React;

import { CommandResult } from "../../hooks/useSocket";
import { TerminalMessage } from "../../utils/terminalCommands/types";
import {
  useAnsiParsedText,
  useFormattedText,
} from "../../utils/textFormatters";
import { Glitch, TypeWriter } from "../UI";

import ProgressIndicator from "./ProgressIndicator";
import TableRenderer from "./TableRenderer";

// Create a combined message type that can handle both formats
export type CombinedMessage = TerminalMessage | CommandResult;

// Extend the TerminalMessage type to include tableData
interface ExtendedTerminalMessage extends TerminalMessage {
  tableData?: {
    headers: string[];
    rows: string[][];
    title?: string;
  };
}

interface MessageRendererProps {
  message: TerminalMessage;
  onExecuteCommand?: (command: string) => void;
}

// Create a client-side timestamp component to fix hydration issues
const TimestampDisplay: React.FC<{ timestamp: string | undefined }> = ({
  timestamp,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !timestamp) {
    return null;
  }

  return (
    <span className="text-cyan text-opacity-70 mr-2" suppressHydrationWarning>
      {timestamp}
    </span>
  );
};

// Normalize message to ensure consistent properties regardless of source
const normalizeMessage = (
  message: CombinedMessage,
): ExtendedTerminalMessage => {
  // Check if it"s already a TerminalMessage by checking for specific properties
  if (
    "prefix" in message ||
    "files" in message ||
    "tableData" in message ||
    "progress" in message
  ) {
    return message as ExtendedTerminalMessage;
  }

  // Convert CommandResult to TerminalMessage format
  return {
    type: message.type,
    content: message.content,
    timestamp: message.timestamp,
    animated: false,
  };
};

// Error message component with glitch effect
const ErrorMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  return (
    <div className="text-red">
      <Glitch intensity="medium" active={true}>
        <span>
          {normalizedMsg.prefix && (
            <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
          )}
          <TimestampDisplay timestamp={normalizedMsg.timestamp} />
          {normalizedMsg.animated ? (
            <TypeWriter text={normalizedMsg.content} delay={30} />
          ) : (
            normalizedMsg.content
          )}
        </span>
      </Glitch>
    </div>
  );
};

// Success message component
const SuccessMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  return (
    <div className="text-lime">
      {normalizedMsg.prefix && (
        <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
      )}
      <TimestampDisplay timestamp={normalizedMsg.timestamp} />
      {normalizedMsg.animated ? (
        <TypeWriter text={normalizedMsg.content} delay={40} />
      ) : (
        normalizedMsg.content
      )}
    </div>
  );
};

// Warning message component with mild glitch effect
const WarningMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  return (
    <div className="text-yellow">
      <Glitch intensity="low" active={true}>
        <span>
          {normalizedMsg.prefix && (
            <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
          )}
          <TimestampDisplay timestamp={normalizedMsg.timestamp} />
          {normalizedMsg.animated ? (
            <TypeWriter text={normalizedMsg.content} delay={35} />
          ) : (
            normalizedMsg.content
          )}
        </span>
      </Glitch>
    </div>
  );
};

// Info message component
const InfoMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  return (
    <div className="text-blue">
      {normalizedMsg.prefix && (
        <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
      )}
      <TimestampDisplay timestamp={normalizedMsg.timestamp} />
      {normalizedMsg.animated ? (
        <TypeWriter text={normalizedMsg.content} delay={30} />
      ) : (
        normalizedMsg.content
      )}
    </div>
  );
};

// Command message component
const CommandMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  return (
    <div className="text-shocking-pink">
      {normalizedMsg.prefix && (
        <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
      )}
      <TimestampDisplay timestamp={normalizedMsg.timestamp} />
      {normalizedMsg.animated ? (
        <TypeWriter text={normalizedMsg.content} delay={20} />
      ) : (
        normalizedMsg.content
      )}
    </div>
  );
};

// Default message component
const DefaultMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  return (
    <div className="text-white">
      {normalizedMsg.prefix && (
        <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
      )}
      <TimestampDisplay timestamp={normalizedMsg.timestamp} />
      {normalizedMsg.animated ? (
        <TypeWriter text={normalizedMsg.content} delay={30} />
      ) : (
        normalizedMsg.content
      )}
    </div>
  );
};

// File listing component
const FileListingMessage: React.FC<MessageRendererProps> = ({
  message,
  onExecuteCommand,
}) => {
  const normalizedMsg = normalizeMessage(message);
  if (!normalizedMsg.files || normalizedMsg.files.length === 0) {
    return <DefaultMessage message={normalizedMsg} />;
  }

  // Get the current path from the message if available
  const currentPath = normalizedMsg.path || "/";

  // Handle file click to execute appropriate command
  const handleFileClick = (file: string) => {
    if (!onExecuteCommand) {
      return;
    }

    // Determine if it"s a file or directory based on the naming convention
    // For now, assume directories end with "/"
    const isDirectory = file.endsWith("/");

    // Remove trailing slash for display and commands if it"s a directory
    const cleanName = isDirectory ? file.slice(0, -1) : file;

    // Execute appropriate command based on file type
    if (isDirectory) {
      onExecuteCommand(`cd ${cleanName}`);
    } else {
      onExecuteCommand(`cat ${cleanName}`);
    }
  };

  return (
    <div>
      <InfoMessage message={normalizedMsg} />
      <div className="pl-4 mt-1 mb-1 text-cyan-400">
        Current directory: {currentPath}
      </div>
      <div className="pl-4 flex flex-wrap gap-2">
        {normalizedMsg.files.map((file: string, index: number) => {
          // Check if it"s a directory (assuming it ends with "/")
          const isDirectory = file.endsWith("/");

          return (
            <div
              key={index}
              className={`
                cursor-pointer 
                ${isDirectory ? "text-blue" : "text-cyan"} 
                hover:text-white 
                hover:underline 
                transition-colors 
                duration-200
                flex items-center
              `}
              onClick={() => handleFileClick(file)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleFileClick(file);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={isDirectory ? `Navigate to ${file}` : `View ${file}`}
              title={isDirectory ? `Navigate to ${file}` : `View ${file}`}
            >
              {/* Icon for file/directory */}
              <span className="mr-1">{isDirectory ? "📁" : "📄"}</span>
              {file}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Table message component
const TableMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  if (!normalizedMsg.tableData) {
    return <DefaultMessage message={normalizedMsg} />;
  }

  return (
    <div>
      {normalizedMsg.prefix && (
        <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
      )}
      <TimestampDisplay timestamp={normalizedMsg.timestamp} />
      {normalizedMsg.content && (
        <div className="mb-2">
          {normalizedMsg.animated ? (
            <TypeWriter text={normalizedMsg.content} delay={30} />
          ) : (
            normalizedMsg.content
          )}
        </div>
      )}
      <TableRenderer
        data={normalizedMsg.tableData}
        title={normalizedMsg.tableData.title}
        glitchEffect={normalizedMsg.type === "error"}
      />
    </div>
  );
};

// Progress indicator message component
const ProgressMessage: React.FC<MessageRendererProps> = ({ message }) => {
  const normalizedMsg = normalizeMessage(message);
  if (!normalizedMsg.progress) {
    return <DefaultMessage message={normalizedMsg} />;
  }

  const { value, status, isComplete, isError, label } = normalizedMsg.progress;

  return (
    <div>
      {normalizedMsg.prefix && (
        <span className="font-bold mr-1">[{normalizedMsg.prefix}]</span>
      )}
      <TimestampDisplay timestamp={normalizedMsg.timestamp} />
      {normalizedMsg.content && (
        <div className="mb-2">
          {normalizedMsg.animated ? (
            <TypeWriter text={normalizedMsg.content} delay={30} />
          ) : (
            normalizedMsg.content
          )}
        </div>
      )}
      <ProgressIndicator
        progress={value}
        status={status}
        isComplete={isComplete}
        isError={isError}
        label={label}
        glitchEffect={normalizedMsg.type === "error" || isError}
      />
    </div>
  );
};

// Add a mapping for message types to CSS classes
const typeToClassMap: Record<string, string> = {
  success: "text-terminal-success",
  error: "text-terminal-error",
  warning: "text-terminal-warning",
  info: "text-terminal-info",
  command: "text-terminal-command font-bold",
};

// Main message renderer component
const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  onExecuteCommand,
}) => {
  const normalizedMsg = normalizeMessage(message);

  // Extract content based on message type
  let content: string = "";
  if (typeof message === "string") {
    content = message;
  } else if ("content" in message) {
    content = message.content;
  }

  // Apply memoized formatting for performance
  const formattedContent = useFormattedText(content);
  const processedContent = useAnsiParsedText(formattedContent);

  // Get CSS class based on message type
  let messageClass = "";
  if (typeof message !== "string" && "type" in message) {
    messageClass = typeToClassMap[message.type] || "";
  }

  // Render clickable command example if it starts with a $ prompt and has an onExecuteCommand handler
  if (
    content.startsWith("$ ") &&
    onExecuteCommand &&
    typeof message !== "string" &&
    message.type !== "command"
  ) {
    const command = content.substring(2).trim();
    return (
      <div className="flex">
        <span className="text-terminal-muted mr-1">$</span>
        <button
          className="text-terminal-link hover:underline cursor-pointer bg-transparent border-0 p-0 text-left font-mono"
          onClick={() => onExecuteCommand(command)}
        >
          {command}
        </button>
      </div>
    );
  }

  // Check if it"s a progress message
  if (normalizedMsg.progress) {
    return <ProgressMessage message={normalizedMsg} />;
  }

  // Check if it"s a table message
  if (normalizedMsg.tableData) {
    return <TableMessage message={normalizedMsg} />;
  }

  // Check if it"s a file listing
  if (normalizedMsg.files && normalizedMsg.files.length > 0) {
    return (
      <FileListingMessage
        message={normalizedMsg}
        onExecuteCommand={onExecuteCommand}
      />
    );
  }

  // Render based on message type
  switch (normalizedMsg.type) {
    case "error":
      return <ErrorMessage message={normalizedMsg} />;
    case "success":
      return <SuccessMessage message={normalizedMsg} />;
    case "warning":
      return <WarningMessage message={normalizedMsg} />;
    case "info":
      return <InfoMessage message={normalizedMsg} />;
    case "command":
      return <CommandMessage message={normalizedMsg} />;
    default:
      return <DefaultMessage message={normalizedMsg} />;
  }
};

// Apply memoization for performance
export default React.memo(MessageRenderer);
