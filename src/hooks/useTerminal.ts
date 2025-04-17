import { useCallback, useState } from 'react';
import { glitchText, simulateConnectionIssue } from '../utils';
import initialFileSystemData from '../utils/terminalCommands/fileSystemData';
import {
  formatTimestamp,
  getFileSystemItem,
} from '../utils/terminalCommands/helpers';
import commandRegistry, {
  CommandContext,
  FileSystem,
  FileSystemItem,
  TerminalMessage,
} from '../utils/terminalCommands/index';

// Define initial context state - Simplified
const initialContextValues = {
  currentPath: '',
  fileSystem: initialFileSystemData,
  environmentVariables: { PATH: '/Legislation:/Commerce:/Diagnostics' },
  lastExitCode: 0,
};

export interface UseTerminalReturnType {
  messages: TerminalMessage[];
  addMessage: (message: TerminalMessage) => void;
  currentPath: string;
  executeCommand: (command: string) => Promise<any>;
  commandHistory: string[];
  historyIndex: number;
  navigateHistory: (direction: 'up' | 'down') => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  availableFiles: FileSystem;
}

const useTerminal = (
  initialMessages: TerminalMessage[] = []
): UseTerminalReturnType => {
  const [messages, setMessages] = useState<TerminalMessage[]>(initialMessages);
  // Use useState for context elements that change
  const [currentPath, setCurrentPath] = useState<string>(
    initialContextValues.currentPath
  );
  const [fileSystem, setFileSystem] = useState<FileSystem>(
    initialContextValues.fileSystem
  );
  const [environmentVariables, setEnvironmentVariables] = useState<
    Record<string, string>
  >(initialContextValues.environmentVariables);
  const [lastExitCode, setLastExitCode] = useState<number>(
    initialContextValues.lastExitCode
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add a message to the terminal
  const addMessage = useCallback(
    (messageOrMessages: TerminalMessage | TerminalMessage[]) => {
      const messagesToAdd = Array.isArray(messageOrMessages)
        ? messageOrMessages
        : [messageOrMessages];
      // Filter out any potential null/undefined messages just in case
      const validMessages = messagesToAdd.filter((msg) => msg != null);

      // Add animation to messages without animated property explicitly set
      const processedMessages = validMessages.map((msg) => {
        if (msg.animated === undefined) {
          // Default to animated for certain message types
          return {
            ...msg,
            animated: ['error', 'warning', 'success'].includes(msg.type),
          };
        }
        return msg;
      });

      if (processedMessages.length > 0) {
        setMessages((prev) => [...prev, ...processedMessages]);
      }
    },
    []
  );

  // Update the path - passed down in context
  const updatePath = useCallback((newPath: string) => {
    setCurrentPath(newPath);
  }, []);

  // Get timestamp - passed down in context
  const getTimestamp = useCallback(() => formatTimestamp(), []);

  // Apply glitch effect to error messages
  const processErrorMessage = useCallback(
    (message: TerminalMessage): TerminalMessage => {
      if (message.type === 'error') {
        return {
          ...message,
          content: glitchText(message.content),
        };
      }
      return message;
    },
    []
  );

  // Execute a command
  const executeCommand = useCallback(
    async (commandString: string) => {
      const trimmedCommand = commandString.trim();
      if (!trimmedCommand) {
        return;
      } // Ignore empty commands

      // Set processing state
      setIsProcessing(true);

      // Add to command history
      setCommandHistory((prev) => [trimmedCommand, ...prev].slice(0, 50)); // Limit history
      setHistoryIndex(-1);

      // Add the command itself to the output
      addMessage({
        type: 'command',
        content: trimmedCommand,
        prefix: `USER@${currentPath || '/'}`,
        timestamp: getTimestamp(),
      });

      // Parse command
      const parts = trimmedCommand.split(/\s+/);
      const commandName = parts[0].toLowerCase();
      const args = parts.slice(1);

      // Find command in registry
      const command =
        commandRegistry[commandName] ||
        commandRegistry[
          Object.keys(commandRegistry).find((key) =>
            commandRegistry[key].aliases?.includes(commandName)
          ) || ''
        ];

      try {
        // Simulate connection delay for realistic feedback
        await simulateConnectionIssue();

        let result: TerminalMessage | TerminalMessage[] | null = null;
        if (command) {
          // Construct the context for the executor, including the restored properties
          const context: CommandContext = {
            currentPath,
            fileSystem,
            environmentVariables,
            lastExitCode,
            commandRegistry, // Pass the imported registry
            commandHistory, // Pass the current history state
            aliases: {}, // Pass empty aliases for now
            updatePath,
            getTimestamp,
          };

          try {
            // Execute the command's executor
            result = await Promise.resolve(command.executor(args, context)); // Await potential promises
            setLastExitCode(0); // Assume success unless error
          } catch (error) {
            console.error('Command execution error:', error);
            result = {
              type: 'error',
              content: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
              timestamp: getTimestamp(),
              animated: true,
            };
            setLastExitCode(1); // Indicate error
          }
        } else {
          result = {
            type: 'error',
            content: `Command not found: ${commandName}`,
            timestamp: getTimestamp(),
            animated: true,
          };
          setLastExitCode(127); // Command not found exit code
        }

        // Add result message(s) to the output
        if (result) {
          const messagesToAdd = Array.isArray(result) ? result : [result];
          // Handle clear command specifically
          if (messagesToAdd.some((msg) => msg.clearTerminal)) {
            setMessages([]); // Clear messages
          } else {
            // Process messages (like applying glitch effect to errors)
            const processedMessages = messagesToAdd.map(processErrorMessage);
            addMessage(processedMessages);
          }
        }
      } finally {
        // Reset processing state
        setIsProcessing(false);
      }
    },
    [
      currentPath,
      fileSystem,
      commandHistory,
      environmentVariables,
      lastExitCode,
      addMessage,
      updatePath,
      getTimestamp,
      processErrorMessage,
    ]
  );

  // Navigate command history
  const navigateHistory = useCallback(
    (direction: 'up' | 'down') => {
      if (direction === 'up') {
        // Move back in history
        if (historyIndex < commandHistory.length - 1) {
          setHistoryIndex(historyIndex + 1);
        }
      } else if (historyIndex >= 0) {
        setHistoryIndex(historyIndex - 1);
      }
    },
    [historyIndex, commandHistory]
  );

  // Add a function to extract available files from the file system
  const extractFileList = (
    fileSystem: FileSystem,
    currentPath: string
  ): string[] => {
    // Get current directory contents
    const currentDir = getFileSystemItem(fileSystem, currentPath);
    if (
      !currentDir ||
      currentDir.type !== 'directory' ||
      !currentDir.children
    ) {
      return [];
    }

    // Convert directory content to a list of file names, marking directories with a trailing /
    return Object.entries(currentDir.children).map(([name, item]) => {
      const fileItem = item as FileSystemItem;
      return fileItem.type === 'directory' ? `${name}/` : name;
    });
  };

  return {
    messages,
    currentPath,
    executeCommand,
    addMessage,
    commandHistory,
    historyIndex,
    navigateHistory,
    isProcessing,
    setIsProcessing,
    availableFiles: Object.fromEntries(
      extractFileList(fileSystem, currentPath).map((filename) => {
        // Convert file list to FileSystem structure
        const isDir = filename.endsWith('/');
        const name = isDir ? filename.slice(0, -1) : filename;
        const item: FileSystemItem = {
          type: isDir ? 'directory' : 'file',
          name,
          children: isDir ? {} : undefined,
        };
        return [filename, item];
      })
    ),
  };
};

export default useTerminal;
