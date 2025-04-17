// src/utils/terminalCommands/helpers.ts
// Helper functions for terminal commands

import { FileSystem, FileSystemItem, TerminalMessage, CommandContext } from './types';

/**
 * Parse a command string into command name and arguments
 */
export const parseCommand = (commandString: string): { command: string, args: string[] } => {
  const parts = commandString.trim().split(/\s+/);
  const command = parts[0] || '';
  const args = parts.slice(1);
  
  return { command, args };
};

/**
 * Resolve a path relative to the current directory
 */
export const resolvePath = (currentPath: string, targetPath: string): string => {
  // Handle absolute paths
  if (targetPath.startsWith('/')) {
    return normalizePath(targetPath);
  }
  
  // Handle . and ..
  const current = currentPath.split('/').filter(Boolean);
  const target = targetPath.split('/').filter(Boolean);
  
  for (const part of target) {
    if (part === '.') {
      // Current directory, do nothing
    } else if (part === '..') {
      // Go up one directory
      if (current.length > 0) {
        current.pop();
      }
    } else {
      // Add directory to path
      current.push(part);
    }
  }
  
  return '/' + current.join('/');
};

/**
 * Normalize a path by removing redundant slashes and resolving . and ..
 */
export const normalizePath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  const result: string[] = [];
  
  for (const part of parts) {
    if (part === '.') {
      // Skip current directory references
    } else if (part === '..') {
      // Go up one directory if possible
      if (result.length > 0) {
        result.pop();
      }
    } else {
      // Add directory to result
      result.push(part);
    }
  }
  
  return '/' + result.join('/');
};

/**
 * Find a file system item at the specified path
 */
export const getFileSystemItem = (
  fileSystem: FileSystem, 
  path: string
): FileSystemItem | null => {
  const normalizedPath = normalizePath(path);
  const parts = normalizedPath.split('/').filter(Boolean);
  
  // Root directory
  if (parts.length === 0) {
    return fileSystem[''] || null;
  }
  
  let current = fileSystem[''];
  
  for (const part of parts) {
    if (!current || current.type !== 'directory' || !current.children || !current.children[part]) {
      return null;
    }
    current = current.children[part];
  }
  
  return current;
};

/**
 * Format a timestamp for terminal output
 */
export const formatTimestamp = (): string => {
  return new Date().toLocaleTimeString();
};

/**
 * Create a success message
 */
export const createSuccessMessage = (
  content: string, 
  options: Partial<TerminalMessage> = {}
): TerminalMessage => {
  return {
    type: 'success',
    content,
    timestamp: formatTimestamp(),
    ...options
  };
};

/**
 * Create an error message
 */
export const createErrorMessage = (
  content: string, 
  options: Partial<TerminalMessage> = {}
): TerminalMessage => {
  return {
    type: 'error',
    content,
    timestamp: formatTimestamp(),
    ...options
  };
};

/**
 * Create an info message
 */
export const createInfoMessage = (
  content: string, 
  options: Partial<TerminalMessage> = {}
): TerminalMessage => {
  return {
    type: 'info',
    content,
    timestamp: formatTimestamp(),
    ...options
  };
};

/**
 * Create a warning message
 */
export const createWarningMessage = (
  content: string, 
  options: Partial<TerminalMessage> = {}
): TerminalMessage => {
  return {
    type: 'warning',
    content,
    timestamp: formatTimestamp(),
    ...options
  };
};

/**
 * Create a file listing message
 */
export const createFileListingMessage = (
  path: string,
  files: string[],
  options: Partial<TerminalMessage> = {}
): TerminalMessage => {
  return {
    type: 'info',
    content: `The folder ${path || 'root'} contains the following files:`,
    prefix: 'TERMINAL',
    timestamp: formatTimestamp(),
    files,
    ...options
  };
};