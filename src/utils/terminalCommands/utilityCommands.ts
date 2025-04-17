// src/utils/terminalCommands/utility.ts
// Utility commands for the terminal

import {
  createErrorMessage,
  createInfoMessage,
  createSuccessMessage,
} from './helpers';
import { Command, CommandRegistry } from './types';

/**
 * whoami command - Display current user
 */
const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Display current user',
  usage: 'whoami',
  examples: ['whoami'],
  executor: (args, context) => {
    return createInfoMessage('Current user: NULLSTRA_OPERATOR');
  },
};

/**
 * history command - Display command history
 */
const historyCommand: Command = {
  name: 'history',
  description: 'Display command history',
  usage: 'history [n]',
  examples: ['history', 'history 10'],
  executor: (args, context) => {
    const { commandHistory = [] } = context;
    const count =
      args.length > 0 ? parseInt(args[0], 10) : commandHistory.length;

    if (isNaN(count) || count <= 0) {
      return createErrorMessage('Invalid count. Usage: history [n]');
    }

    const historyToShow = commandHistory.slice(0, count);

    if (historyToShow.length === 0) {
      return createInfoMessage('No command history available.');
    }

    const messages = [createInfoMessage('Command history:')];

    historyToShow.forEach((cmd, index) => {
      messages.push(createInfoMessage(`${index + 1}  ${cmd}`));
    });

    return messages;
  },
};

/**
 * alias command - Create command aliases
 */
const aliasCommand: Command = {
  name: 'alias',
  description: 'Create or list command aliases',
  usage: 'alias [name[=value]]',
  examples: ['alias', 'alias ls="ls -la"', 'alias ll="ls -l"'],
  executor: (args, context) => {
    const { aliases = {} } = context;

    // List all aliases if no arguments provided
    if (args.length === 0) {
      if (Object.keys(aliases).length === 0) {
        return createInfoMessage('No aliases defined.');
      }

      const messages = [createInfoMessage('Defined aliases:')];

      Object.entries(aliases).forEach(([name, value]) => {
        messages.push(createInfoMessage(`${name}='${value}'`));
      });

      return messages;
    }

    // Create a new alias
    const aliasArg = args.join(' ');
    const aliasMatch = aliasArg.match(/^(\w+)=(.+)$/);

    if (!aliasMatch) {
      return createErrorMessage(
        'Invalid alias syntax. Usage: alias name="command"'
      );
    }

    const [, name, value] = aliasMatch;

    // Update aliases
    context.aliases = {
      ...aliases,
      [name]: value.replace(/^"|"$/g, '').replace(/^'|'$/g, ''),
    };

    return createSuccessMessage(`Alias created: ${name}`);
  },
};

/**
 * unalias command - Remove command aliases
 */
const unaliasCommand: Command = {
  name: 'unalias',
  description: 'Remove command aliases',
  usage: 'unalias name',
  examples: ['unalias ll', 'unalias myalias'],
  executor: (args, context) => {
    const { aliases = {} } = context;

    if (args.length === 0) {
      return createErrorMessage('No alias specified. Usage: unalias name');
    }

    const name = args[0];

    if (!aliases[name]) {
      return createErrorMessage(`Alias not found: ${name}`);
    }

    // Remove the alias
    const newAliases = { ...aliases };
    delete newAliases[name];
    context.aliases = newAliases;

    return createSuccessMessage(`Alias removed: ${name}`);
  },
};

/**
 * find command - Find files or directories
 */
const findCommand: Command = {
  name: 'find',
  description: 'Search for files in a directory hierarchy',
  usage: 'find [path] [expression]',
  examples: ['find', 'find /Legislation -name "Security"', 'find . -type f'],
  executor: (args, context) => {
    const { currentPath, fileSystem } = context;

    // Default to current path if none specified
    const path =
      args.length > 0 && !args[0].startsWith('-')
        ? args[0]
        : currentPath || '/';

    // Simple find implementation - for demo purposes only
    return [
      createInfoMessage(`Searching in ${path}...`, {
        animated: true,
      }),
      createInfoMessage(`${path}/file1.txt`, {
        animated: true,
      }),
      createInfoMessage(`${path}/subdir/file2.dat`, {
        animated: true,
      }),
      createInfoMessage(`${path}/subdir/config.ini`, {
        animated: true,
      }),
      createSuccessMessage(`Find complete. 3 matches found.`, {
        animated: true,
      }),
    ];
  },
};

/**
 * grep command - Search for patterns in files
 */
const grepCommand: Command = {
  name: 'grep',
  description: 'Search for patterns in files',
  usage: 'grep pattern [file...]',
  examples: ['grep "error" log.txt', 'grep -i "warning" /var/log/*'],
  executor: (args, context) => {
    if (args.length === 0) {
      return createErrorMessage(
        'No pattern specified. Usage: grep pattern [file...]'
      );
    }

    const pattern = args[0];
    const files = args.slice(1);

    if (files.length === 0) {
      return createErrorMessage(
        'No files specified. Usage: grep pattern [file...]'
      );
    }

    // Simple grep implementation - for demo purposes
    return [
      createInfoMessage(
        `Searching for "${pattern}" in ${files.join(', ')}...`,
        {
          animated: true,
        }
      ),
      createInfoMessage(
        `${files[0]}:42: match found: "This is an ${pattern} in the file"`,
        {
          animated: true,
        }
      ),
      createInfoMessage(
        `${files[0]}:78: match found: "Another ${pattern} appears here"`,
        {
          animated: true,
        }
      ),
      createSuccessMessage(`Grep complete. 2 matches found.`, {
        animated: true,
      }),
    ];
  },
};

/**
 * chmod command - Change file permissions
 */
const chmodCommand: Command = {
  name: 'chmod',
  description: 'Change file access permissions',
  usage: 'chmod mode file',
  examples: ['chmod 755 script.sh', 'chmod +x executable.bin'],
  executor: (args, context) => {
    if (args.length < 2) {
      return createErrorMessage('Invalid usage. Usage: chmod mode file');
    }

    const mode = args[0];
    const file = args[1];

    // Simulate permission change
    return createSuccessMessage(`Changed permissions of ${file} to ${mode}`);
  },
};

/**
 * df command - Display disk space usage
 */
const dfCommand: Command = {
  name: 'df',
  description: 'Display free disk space',
  usage: 'df [options]',
  examples: ['df', 'df -h'],
  executor: (args, context) => {
    const humanReadable = args.includes('-h');

    if (humanReadable) {
      return [
        createInfoMessage('Filesystem      Size  Used Avail Use% Mounted on'),
        createInfoMessage('/dev/sda1       120T   78T   42T  65% /'),
        createInfoMessage('/dev/sdb1        50T   15T   35T  30% /data'),
        createInfoMessage('quantum-storage  10P  2.3P  7.7P  23% /quantum'),
        createSuccessMessage('df complete.'),
      ];
    }

    return [
      createInfoMessage(
        'Filesystem      1K-blocks       Used    Available Use% Mounted on'
      ),
      createInfoMessage(
        '/dev/sda1       125829120000 81788928000 44040192000  65% /'
      ),
      createInfoMessage(
        '/dev/sdb1       52428800000 15728640000 36700160000  30% /data'
      ),
      createInfoMessage(
        'quantum-storage 10995116277760 2528776742912 8466339534848  23% /quantum'
      ),
      createSuccessMessage('df complete.'),
    ];
  },
};

/**
 * Register all utility commands
 */
export const registerUtilityCommands = (registry: CommandRegistry): void => {
  registry.whoami = whoamiCommand;
  registry.history = historyCommand;
  registry.alias = aliasCommand;
  registry.unalias = unaliasCommand;
  registry.find = findCommand;
  registry.grep = grepCommand;
  registry.chmod = chmodCommand;
  registry.df = dfCommand;
};
