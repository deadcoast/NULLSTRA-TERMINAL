// src/utils/terminalCommands/types.ts
// Types for the terminal command system

/**
 * Represents a message in the terminal output
 */
export interface TerminalMessage {
  type: 'error' | 'warning' | 'success' | 'info' | 'command';
  content: string;
  prefix?: string;
  timestamp?: string;
  path?: string;
  animated?: boolean;
  files?: string[];
  clearTerminal?: boolean;
  tableData?: {
    headers: string[];
    rows: string[][];
    title?: string;
  };
  progress?: {
    value?: number; // 0-100, if undefined it's indeterminate
    status?: string;
    isComplete?: boolean;
    isError?: boolean;
    label?: string;
  };
}

/**
 * Represents the structure of a file or directory in the virtual file system
 */
export interface FileSystemItem {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  metadata?: {
    size?: number;
    created?: string;
    modified?: string;
    permissions?: string;
    owner?: string;
  };
  children?: Record<string, FileSystemItem>;
}

/**
 * Represents a virtual file system
 */
export interface FileSystem {
  [path: string]: FileSystemItem;
}

/**
 * Function that executes a terminal command
 */
export type CommandExecutor = (
  args: string[],
  context: CommandContext
) =>
  | TerminalMessage
  | TerminalMessage[]
  | Promise<TerminalMessage | TerminalMessage[]>;

/**
 * Command context containing current state and utilities
 */
export interface CommandContext {
  // Restore previously removed properties
  commandRegistry: CommandRegistry;
  commandHistory: string[];
  aliases: Record<string, string>; // Assuming aliases are needed, maybe map name->alias or vice versa?

  // Essential context properties:
  currentPath: string;
  fileSystem: FileSystem;
  environmentVariables: Record<string, string>;
  lastExitCode: number;

  // Callbacks for the hook's state setters:
  updatePath: (newPath: string) => void;
  getTimestamp: () => string; // Function to get a formatted timestamp
}

/**
 * Command definition with help text and executor
 */
export interface Command {
  name: string;
  description: string;
  usage: string;
  examples?: string[];
  executor: CommandExecutor;
  aliases?: string[];
}

/**
 * Registry of all available commands
 */
export type CommandRegistry = Record<string, Command>;
