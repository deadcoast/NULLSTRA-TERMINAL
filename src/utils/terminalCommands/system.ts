// src/utils/terminalCommands/system.ts
// System related commands

import
    {
        createErrorMessage,
        createInfoMessage,
        createSuccessMessage,
        createWarningMessage,
        formatTimestamp,
    } from './helpers';

import
    {
        Command,
        CommandContext,
        CommandRegistry,
        TerminalMessage
    } from './types';

/**
 * help command - Display available commands
 */
const helpCommand: Command = {
  name: 'help',
  description: 'Display help information for commands',
  usage: 'help [command]',
  examples: [
    'help',
    'help ls',
    'help sysinfo'
  ],
  executor: (args, context: CommandContext) => {
    // If a specific command is specified, show help for that command
    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const registry = context.commandRegistry || {};
      const command = registry[commandName];
      
      if (!command) {
        return {
          type: 'error',
          content: `Command not found: ${commandName}`,
          timestamp: formatTimestamp()
        };
      }
      
      const helpMessages: TerminalMessage[] = [
        {
          type: 'info',
          content: `Command: ${command.name}`,
          timestamp: formatTimestamp()
        },
        {
          type: 'info',
          content: `Description: ${command.description}`,
          timestamp: formatTimestamp()
        },
        {
          type: 'info',
          content: `Usage: ${command.usage}`,
          timestamp: formatTimestamp()
        }
      ];
      
      if (command.examples && command.examples.length > 0) {
        helpMessages.push({
          type: 'info',
          content: 'Examples:',
          timestamp: formatTimestamp()
        });
        
        command.examples.forEach(example => {
          helpMessages.push({
            type: 'info',
            content: `  ${example}`,
            timestamp: formatTimestamp()
          });
        });
      }
      
      if (command.aliases && command.aliases.length > 0) {
        helpMessages.push({
          type: 'info',
          content: `Aliases: ${command.aliases.join(', ')}`,
          timestamp: formatTimestamp()
        });
      }
      
      return helpMessages;
    }
    
    // Otherwise, show a list of all available commands
    const registry = context.commandRegistry || {};
    const commands = Object.values(registry)
      // Filter out aliases
      .filter((cmd, index, self) => 
        self.findIndex(c => (c as Command).name === (cmd as Command).name) === index
      );
    
    const helpMessages: TerminalMessage[] = [
      {
        type: 'info',
        content: 'Available commands:',
        timestamp: formatTimestamp()
      }
    ];
    
    commands.forEach(cmd => {
      const command = cmd as Command;
      helpMessages.push({
        type: 'info',
        content: `  ${command.name.padEnd(12)} - ${command.description}`,
        timestamp: formatTimestamp()
      });
    });
    
    helpMessages.push({
      type: 'info',
      content: 'Type "help <command>" for more information about a specific command.',
      timestamp: formatTimestamp()
    });
    
    return helpMessages;
  }
};

/**
 * decrypt command - Decrypt encrypted files
 */
const decryptCommand: Command = {
  name: 'decrypt',
  description: 'Decrypt encrypted files',
  usage: 'decrypt <file>',
  examples: [
    'decrypt sensitive_data.enc',
    'decrypt /Legislation/Security/encrypted_file.dat'
  ],
  executor: (args, context) => {
    if (args.length === 0) {
      return createErrorMessage('No file specified. Usage: decrypt <file>');
    }
    
    // Example of directly using TerminalMessage type
    const customMessage: TerminalMessage = {
      type: 'info',
      content: 'Starting custom decryption process',
      timestamp: formatTimestamp(), // Direct usage of formatTimestamp
      animated: true
    };
    
    // Simulate decryption process
    return [
      customMessage,
      createInfoMessage('Initializing decryption algorithm...', {
        animated: true
      }),
      createInfoMessage('Scanning for encryption signature...', {
        animated: true
      }),
      createInfoMessage('Signature identified: AES-256-CBC', {
        animated: true
      }),
      createInfoMessage('Starting decryption process...', {
        animated: true
      }),
      createSuccessMessage('Decryption complete.', {
        animated: true
      })
    ];
  }
};

/**
 * encrypt command - Encrypt files
 */
const encryptCommand: Command = {
  name: 'encrypt',
  description: 'Encrypt files with secure encryption',
  usage: 'encrypt <file>',
  examples: [
    'encrypt sensitive_data.txt',
    'encrypt /User_Notes_[Batch]/report.doc'
  ],
  executor: (args, context) => {
    if (args.length === 0) {
      return createErrorMessage('No file specified. Usage: encrypt <file>');
    }
    
    // Direct usage of both TerminalMessage and formatTimestamp
    const startMessage: TerminalMessage = {
      type: 'command',
      content: `Encrypting file: ${args[0]}`,
      timestamp: formatTimestamp(),
      prefix: 'ENCRYPT'
    };
    
    // Simulate encryption process
    return [
      startMessage,
      createInfoMessage('Initializing encryption algorithm...', {
        animated: true
      }),
      createInfoMessage('Generating secure key...', {
        animated: true
      }),
      createInfoMessage('Applying AES-256-CBC encryption...', {
        animated: true
      }),
      createSuccessMessage('Encryption complete.', {
        animated: true
      }),
      createInfoMessage('File encrypted and secured with NeuralNetDefense.', {
        animated: true
      })
    ];
  }
};

/**
 * scan command - Scan system for vulnerabilities
 */
const scanCommand: Command = {
  name: 'scan',
  description: 'Scan system for security vulnerabilities',
  usage: 'scan [target]',
  examples: [
    'scan system',
    'scan network',
    'scan /Legislation/Security'
  ],
  executor: (args, context) => {
    const target = args[0] || 'system';
    
    // Using formatTimestamp directly to create a custom timestamp
    const currentTimeStamp = formatTimestamp();
    
    // Create a custom terminal message directly
    const scanInitiatedMessage: TerminalMessage = {
      type: 'info',
      content: `Security scan initiated at ${currentTimeStamp}`,
      prefix: 'SECURITY',
      timestamp: currentTimeStamp
    };
    
    // Simulate scanning process
    return [
      scanInitiatedMessage,
      createInfoMessage(`Initializing security scan for ${target}...`, {
        animated: true
      }),
      createInfoMessage('Checking for known vulnerabilities...', {
        animated: true
      }),
      createInfoMessage('Analyzing system integrity...', {
        animated: true
      }),
      createInfoMessage('Scanning network connections...', {
        animated: true
      }),
      createWarningMessage('Minor vulnerability detected in module 7E-1D.', {
        animated: true
      }),
      createInfoMessage('Applying security patch...', {
        animated: true
      }),
      createSuccessMessage('Scan complete. System secure.', {
        animated: true
      })
    ];
  }
};

/**
 * auth command - Authenticate to secure systems
 */
const authCommand: Command = {
  name: 'auth',
  description: 'Authenticate to secure systems',
  usage: 'auth [system] [level]',
  examples: [
    'auth',
    'auth mainframe',
    'auth security admin'
  ],
  executor: (args, context) => {
    const system = args[0] || 'default';
    const level = args[1] || 'user';
    
    // Direct usage of TerminalMessage for a specialized auth message
    const authRequest: TerminalMessage = {
      type: 'command',
      content: `Authentication request: ${system} with ${level} privileges`,
      timestamp: formatTimestamp(),
      prefix: 'AUTH'
    };
    
    // Simulate authentication process
    return [
      authRequest,
      createInfoMessage(`Authenticating to ${system} with ${level} privileges...`, {
        animated: true
      }),
      createInfoMessage('Verifying credentials...', {
        animated: true
      }),
      createInfoMessage('Two-factor authentication required.', {
        animated: true
      }),
      createInfoMessage('Biometric scan accepted.', {
        animated: true
      }),
      createSuccessMessage('Authentication successful.', {
        animated: true
      }),
      createInfoMessage(`You now have ${level} access to ${system}.`, {
        animated: true
      })
    ];
  }
};

/**
 * secure command - Secure a file or directory
 */
const secureCommand: Command = {
  name: 'secure',
  description: 'Apply security measures to files or directories',
  usage: 'secure <target> [level]',
  examples: [
    'secure sensitive_data.txt',
    'secure /Legislation/Security high'
  ],
  executor: (args, context) => {
    if (args.length === 0) {
      return createErrorMessage('No target specified. Usage: secure <target> [level]');
    }
    
    const target = args[0];
    const level = args[1] || 'standard';
    
    // Create a completion message using TerminalMessage directly
    const completionTime = formatTimestamp();
    const securityCompletionMessage: TerminalMessage = {
      type: 'success',
      content: `Security operation completed at ${completionTime}`,
      timestamp: completionTime,
      prefix: 'SECURE'
    };
    
    // Simulate securing process
    return [
      createInfoMessage(`Applying ${level} security to ${target}...`, {
        animated: true
      }),
      createInfoMessage('Setting access controls...', {
        animated: true
      }),
      createInfoMessage('Encrypting metadata...', {
        animated: true
      }),
      createInfoMessage('Updating security log...', {
        animated: true
      }),
      createSuccessMessage(`Security level ${level} applied to ${target}.`, {
        animated: true
      }),
      securityCompletionMessage
    ];
  }
};

/**
 * clear command - Clear the terminal
 */
const clearCommand: Command = {
  name: 'clear',
  description: 'Clear the terminal screen',
  usage: 'clear',
  examples: ['clear'],
  aliases: ['cls'],
  executor: () => {
    return {
      type: 'command',
      content: 'Terminal cleared',
      timestamp: formatTimestamp(),
      clearTerminal: true
    };
  }
};

/**
 * sysinfo command - Display system information
 */
const sysinfoCommand: Command = {
  name: 'sysinfo',
  description: 'Display system information',
  usage: 'sysinfo',
  examples: ['sysinfo'],
  executor: () => {
    return [
      {
        type: 'info',
        prefix: 'TERMINAL',
        content: 'CYAQUEBC.local',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'OS: NULLSTRA-UNIX 2803.04.1 LTS',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Host: CyberAcme Systems Model CV-4788',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Kernel: 15.92.0-NULLSTRA-secure',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Uptime: 45088d 17h 19m',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Packages: 23,471 (quantum-apt)',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Shell: neutron-shell 12.7.3',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Resolver: 18K-Hole',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'DE: NeuroAqua 42.4.1',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'WM: Quantum Compositor 30.7.3',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'WM Theme: Grafix (DARK)',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Terminal: phantom-term 8.3.4',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'CPU: Quantum Vector 2298 (128) @ 12.88THz',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Memory: 1.28TB Quantum-RAM',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Storage: 180TB Molecular Storage (Neural-Encrypted)',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: 'Security: NeuralNetDefense Encryption Active',
        timestamp: formatTimestamp()
      }
    ];
  }
};

/**
 * echo command - Display a message
 */
const echoCommand: Command = {
  name: 'echo',
  description: 'Display a message',
  usage: 'echo <message>',
  examples: [
    'echo Hello, world!',
    'echo $PATH'
  ],
  executor: (args, context) => {
    const { environmentVariables } = context;
    
    // Join arguments into a message
    let message = args.join(' ');
    
    // Process environment variables if present
    message = message.replace(/\$(\w+)/g, (match, variableName) => {
      return environmentVariables[variableName] || match;
    });
    
    return createInfoMessage(message);
  }
};

/**
 * exec command - Execute a script
 */
const execCommand: Command = {
  name: 'exec',
  description: 'Execute a script file',
  usage: 'exec <script>',
  examples: [
    'exec decrypt.sh',
    'exec /Legislation/Security/Cybersecurity/decrypt.sh'
  ],
  executor: (args, context) => {
    const { currentPath, fileSystem } = context;
    
    if (args.length === 0) {
      return {
        type: 'error',
        content: 'No script specified. Usage: exec <script>',
        timestamp: formatTimestamp()
      };
    }
    
    // Resolve script path
    let scriptPath = args[0];
    if (!scriptPath.startsWith('/')) {
      // Relative path
      scriptPath = currentPath ? `${currentPath}/${scriptPath}` : scriptPath;
    }
    
    // Get the script from the file system
    const pathParts = scriptPath.split('/').filter(Boolean);
    let current = fileSystem[''];
    
    for (const part of pathParts) {
      if (current.type !== 'directory' || !current.children || !current.children[part]) {
        return {
          type: 'error',
          content: `Script not found: ${scriptPath}`,
          timestamp: formatTimestamp()
        };
      }
      current = current.children[part];
    }
    
    if (current.type !== 'file') {
      return {
        type: 'error',
        content: `Not a script: ${scriptPath}`,
        timestamp: formatTimestamp()
      };
    }
    
    // Execute the script
    return [
      {
        type: 'info',
        content: `Executing ${scriptPath}`,
        prefix: 'TERMINAL',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: current.content || '#!/bin/bash\n# Empty script',
        timestamp: formatTimestamp()
      },
      {
        type: 'info',
        content: '[OK] Execution completed successfully.',
        timestamp: formatTimestamp()
      }
    ];
  }
};

/**
 * date command - Display current date and time
 */
const dateCommand: Command = {
  name: 'date',
  description: 'Display current date and time',
  usage: 'date',
  examples: ['date'],
  executor: () => {
    return createInfoMessage(`Current date: ${new Date().toLocaleString()}`);
  }
};

/**
 * Register all system commands
 */
export const registerSystemCommands = (registry: CommandRegistry): void => {
  registry.help = helpCommand;
  registry.clear = clearCommand;
  registry.sysinfo = sysinfoCommand;
  registry.echo = echoCommand;
  registry.exec = execCommand;
  registry.date = dateCommand;
  registry.decrypt = decryptCommand;
  registry.encrypt = encryptCommand;
  registry.scan = scanCommand;
  registry.auth = authCommand;
  registry.secure = secureCommand;
  
  // Register aliases
  if (clearCommand.aliases) {
    for (const alias of clearCommand.aliases) {
      registry[alias] = clearCommand;
    }
  }
};