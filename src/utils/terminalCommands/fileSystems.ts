// src/utils/terminalCommands/fileSystem.ts
// File system related commands

import
    {
        createErrorMessage,
        createFileListingMessage,
        createInfoMessage,
        createSuccessMessage,
        createWarningMessage,
        getFileSystemItem,
        resolvePath
    } from './helpers';
import
    {
        Command,
        CommandRegistry,
        FileSystem
    } from './types';

/**
 * ls command - List directory contents
 */
const lsCommand: Command = {
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [directory]',
  examples: [
    'ls',
    'ls /Command_History',
    'ls ../Legislation'
  ],
  executor: (args, context) => {
    const { currentPath, fileSystem } = context;
    
    // Determine target directory
    const targetPath = args[0] 
      ? resolvePath(currentPath, args[0])
      : currentPath;
    
    // Get directory contents
    const directory = getFileSystemItem(fileSystem, targetPath);
    
    if (!directory) {
      return createErrorMessage(`Directory not found: ${targetPath}`);
    }
    
    if (directory.type !== 'directory') {
      return createErrorMessage(`Not a directory: ${targetPath}`);
    }
    
    // Get files and directories in the target directory
    const files = Object.keys(directory.children || {});
    
    return createFileListingMessage(
      targetPath.split('/').pop() || 'root',
      files
    );
  }
};

/**
 * cd command - Change directory
 */
const cdCommand: Command = {
  name: 'cd',
  description: 'Change current directory',
  usage: 'cd [directory]',
  examples: [
    'cd',
    'cd Security',
    'cd ..',
    'cd /Legislation/Security'
  ],
  executor: (args, context) => {
    const { currentPath, fileSystem, updatePath } = context;
    
    // Handle cd with no arguments - go to root
    if (args.length === 0 || args[0] === '~') {
      updatePath('');
      return createSuccessMessage('Changed to root directory.');
    }
    
    // Resolve the target path
    const targetPath = resolvePath(currentPath, args[0]);
    
    // Check if the target exists and is a directory
    const target = getFileSystemItem(fileSystem, targetPath);
    
    if (!target) {
      return createErrorMessage(`Directory not found: ${targetPath}`);
    }
    
    if (target.type !== 'directory') {
      return createErrorMessage(`Not a directory: ${targetPath}`);
    }
    
    // Update the current path
    updatePath(targetPath);
    
    return createSuccessMessage(`Changed to ${targetPath} directory.`);
  }
};

/**
 * pwd command - Print working directory
 */
const pwdCommand: Command = {
  name: 'pwd',
  description: 'Print working directory',
  usage: 'pwd',
  examples: ['pwd'],
  executor: (args, context) => {
    const { currentPath } = context;
    return createInfoMessage(`Current directory: ${currentPath || '/'}`);
  }
};

/**
 * read command - Read file contents
 */
const readCommand: Command = {
  name: 'read',
  description: 'Display file contents',
  usage: 'read <file>',
  examples: [
    'read config.txt',
    'read /Legislation/Security/Cybersecurity/decrypt.sh'
  ],
  executor: (args, context) => {
    const { currentPath, fileSystem } = context;
    
    if (args.length === 0) {
      return createErrorMessage('No file specified. Usage: read <file>');
    }
    
    // Resolve the file path
    const filePath = resolvePath(currentPath, args[0]);
    
    // Get the file
    const file = getFileSystemItem(fileSystem, filePath);
    
    if (!file) {
      return createErrorMessage(`File not found: ${filePath}`);
    }
    
    if (file.type !== 'file') {
      return createErrorMessage(`Not a file: ${filePath}`);
    }
    
    // Return the file contents
    return createInfoMessage(file.content || '', { 
      prefix: 'TERMINAL'
    });
  }
};

/**
 * cat command - Alias for read
 */
const catCommand: Command = {
  ...readCommand,
  name: 'cat',
  aliases: ['type']
};

/**
 * mkdir command - Create a new directory
 */
const mkdirCommand: Command = {
  name: 'mkdir',
  description: 'Create a new directory',
  usage: 'mkdir <directory>',
  examples: [
    'mkdir new_folder',
    'mkdir /Projects/new_project'
  ],
  executor: (args, context) => {
    const { currentPath, fileSystem } = context;
    
    if (args.length === 0) {
      return createErrorMessage('No directory name specified. Usage: mkdir <directory>');
    }
    
    // Resolve the new directory path
    const dirPath = resolvePath(currentPath, args[0]);
    const parentPath = dirPath.substring(0, dirPath.lastIndexOf('/'));
    const dirName = dirPath.split('/').pop() || '';
    
    // Check if parent directory exists
    const parentDir = getFileSystemItem(fileSystem, parentPath);
    
    if (!parentDir) {
      return createErrorMessage(`Parent directory not found: ${parentPath}`);
    }
    
    if (parentDir.type !== 'directory') {
      return createErrorMessage(`Parent is not a directory: ${parentPath}`);
    }
    
    // Check if directory already exists
    if (parentDir.children && parentDir.children[dirName]) {
      return createErrorMessage(`Directory already exists: ${dirPath}`);
    }
    
    // Create the new directory
    if (!parentDir.children) {
      parentDir.children = {};
    }
    
    parentDir.children[dirName] = {
      type: 'directory',
      name: dirName,
      children: {}
    };
    
    return createSuccessMessage(`Directory created: ${dirPath}`);
  }
};

/**
 * touch command - Create a new empty file
 */
const touchCommand: Command = {
  name: 'touch',
  description: 'Create a new empty file',
  usage: 'touch <filename>',
  examples: [
    'touch notes.txt',
    'touch /Projects/readme.md'
  ],
  executor: (args, context) => {
    const { currentPath, fileSystem } = context;
    
    if (args.length === 0) {
      return createErrorMessage('No filename specified. Usage: touch <filename>');
    }
    
    // Resolve the file path
    const filePath = resolvePath(currentPath, args[0]);
    const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
    const fileName = filePath.split('/').pop() || '';
    
    // Check if parent directory exists
    const parentDir = getFileSystemItem(fileSystem, parentPath);
    
    if (!parentDir) {
      return createErrorMessage(`Parent directory not found: ${parentPath}`);
    }
    
    if (parentDir.type !== 'directory') {
      return createErrorMessage(`Parent is not a directory: ${parentPath}`);
    }
    
    // Check if file already exists
    if (parentDir.children && parentDir.children[fileName]) {
      return createWarningMessage(`File already exists: ${filePath}`);
    }
    
    // Create the new file
    if (!parentDir.children) {
      parentDir.children = {};
    }
    
    parentDir.children[fileName] = {
      type: 'file',
      name: fileName,
      content: ''
    };
    
    return createSuccessMessage(`File created: ${filePath}`);
  }
};

/**
 * Register all file system commands
 */
export const registerFileSystemCommands = (
  registry: CommandRegistry, 
  initialData: FileSystem
): void => {
  // TODO: Use initialData to initialize the file system state used by commands
  // For example, the CommandContext might hold the file system state,
  // and you might initialize it here using initialData.

  registry.ls = lsCommand;
  registry.cd = cdCommand;
  registry.pwd = pwdCommand;
  registry.read = readCommand;
  registry.cat = catCommand;
  registry.mkdir = mkdirCommand;
  registry.touch = touchCommand;
  
  // Add aliases
  if (catCommand.aliases) {
    for (const alias of catCommand.aliases) {
      registry[alias] = catCommand;
    }
  }
};