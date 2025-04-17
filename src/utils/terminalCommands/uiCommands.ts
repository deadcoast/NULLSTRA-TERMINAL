import {
  createErrorMessage,
  createInfoMessage,
  createSuccessMessage,
} from './helpers';
import { Command, CommandRegistry } from './types';

/**
 * Register UI-specific commands that integrate with the terminal UI
 */
export const registerUICommands = (registry: CommandRegistry): void => {
  // Theme command - change terminal appearance
  const themeCommand: Command = {
    name: 'theme',
    description: 'Change the terminal theme or open theme selector',
    usage: 'theme [theme-name]',
    examples: ['theme', 'theme list', 'theme cyberpunk', 'theme hacker'],
    executor: (args, context) => {
      // This command doesn't directly execute anything - it's intercepted by Terminal.tsx
      // and handled there to show the UI. But we return a message for feedback.

      if (args.length === 0) {
        return createInfoMessage('Opening theme selector...', {
          animated: true,
        });
      }

      if (args[0] === 'list') {
        return createInfoMessage(
          'Available themes: cyberpunk, hacker, midnight, retro',
          {
            animated: true,
          }
        );
      }

      const selectedTheme = args[0].toLowerCase();
      const validThemes = ['cyberpunk', 'hacker', 'midnight', 'retro'];

      if (validThemes.includes(selectedTheme)) {
        return createSuccessMessage(`Switching to ${selectedTheme} theme...`, {
          animated: true,
        });
      }

      return createErrorMessage(
        `Unknown theme: ${selectedTheme}. Try 'theme list' to see available themes.`,
        {
          animated: true,
        }
      );
    },
    aliases: ['themes'],
  };

  // View command - view file contents
  const viewCommand: Command = {
    name: 'view',
    description: 'View file contents in a modal dialog',
    usage: 'view <filename>',
    examples: ['view config.json', 'view readme.md'],
    executor: (args, context) => {
      if (args.length === 0) {
        return createErrorMessage('Please specify a file to view', {
          animated: true,
        });
      }

      // This is handled by Terminal.tsx to show the FileViewer UI
      const fileName = args[0];
      return createInfoMessage(`Opening ${fileName} in viewer...`, {
        animated: true,
      });
    },
    aliases: [],
  };

  // Table command - display tabular data
  const tableCommand: Command = {
    name: 'table',
    description: 'Display data in a formatted table',
    usage: 'table <type>',
    examples: [
      'table system',
      'table network',
      'table users',
      'table processes',
    ],
    executor: (args, context) => {
      // This is intercepted by Terminal.tsx to render tables
      const tableType = args[0] || 'system';
      return createInfoMessage(
        `Displaying ${tableType} data in table format...`,
        { animated: true }
      );
    },
    aliases: [],
  };

  // Stats command - show system statistics
  const statsCommand: Command = {
    name: 'stats',
    description: 'Show system statistics in a table',
    usage: 'stats [component]',
    examples: ['stats', 'stats network', 'stats users'],
    executor: (args, context) => {
      // This is intercepted by Terminal.tsx to render tables
      const component = args[0] || 'system';
      return createInfoMessage(`Showing ${component} statistics...`, {
        animated: true,
      });
    },
    aliases: ['statistics'],
  };

  // Task command - run a task with progress indicator
  const taskCommand: Command = {
    name: 'task',
    description: 'Run a task with progress indicator',
    usage: 'task <type>',
    examples: ['task scan', 'task compile', 'task encrypt', 'task decrypt'],
    executor: (args, context) => {
      // This is intercepted by Terminal.tsx to show progress indicators
      const taskType = args[0] || 'default';
      return createInfoMessage(`Starting ${taskType} task...`, {
        animated: true,
      });
    },
    aliases: [],
  };

  // Download command - simulate file download with progress
  const downloadCommand: Command = {
    name: 'download',
    description: 'Download a file with progress indicator',
    usage: 'download <filename>',
    examples: ['download data.zip', 'download system.iso'],
    executor: (args, context) => {
      // This is intercepted by Terminal.tsx to show progress indicators
      const fileName = args[0] || 'file';
      return createInfoMessage(`Downloading ${fileName}...`, {
        animated: true,
      });
    },
    aliases: [],
  };

  // Upload command - simulate file upload with progress
  const uploadCommand: Command = {
    name: 'upload',
    description: 'Upload a file with progress indicator',
    usage: 'upload <filename>',
    examples: ['upload report.pdf', 'upload backup.zip'],
    executor: (args, context) => {
      // This is intercepted by Terminal.tsx to show progress indicators
      const fileName = args[0] || 'file';
      return createInfoMessage(`Uploading ${fileName}...`, { animated: true });
    },
    aliases: [],
  };

  // Register all UI commands
  registry['theme'] = themeCommand;
  registry['view'] = viewCommand;
  registry['table'] = tableCommand;
  registry['stats'] = statsCommand;
  registry['task'] = taskCommand;
  registry['download'] = downloadCommand;
  registry['upload'] = uploadCommand;
};
