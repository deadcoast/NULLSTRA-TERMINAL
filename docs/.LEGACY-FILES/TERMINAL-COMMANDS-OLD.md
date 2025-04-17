```typescript
export interface TerminalMessage {
  type: 'error' | 'warning' | 'success' | 'info' | 'command';
  content: string;
  prefix?: string;
  timestamp?: string;
  path?: string;
  animated?: boolean;
  files?: string[];
}

// Mock file system structure
const fileSystem = {
  '': {
    type: 'directory',
    children: {
      Command_History: { type: 'directory' },
      Commerce: { type: 'directory' },
      Diagnostics: { type: 'directory' },
      Education: { type: 'directory' },
      Ethics: { type: 'directory' },
      Innovation: { type: 'directory' },
      Interplanetary: { type: 'directory' },
      Legislation: {
        type: 'directory',
        children: {
          Diplomacy: { type: 'directory' },
          Governance: { type: 'directory' },
          Security: {
            type: 'directory',
            children: {
              Asset_Protection: { type: 'directory' },
              'Counter-Intelligence': { type: 'directory' },
              Cybersecurity: {
                type: 'directory',
                children: {
                  'decrypt.sh': {
                    type: 'file',
                    content:
                      '#!/bin/bash\n# Decryption utility\necho "Decrypting data..."',
                  },
                  Diplomatic_Security: { type: 'directory' },
                  'Security_Research_&_Development': { type: 'directory' },
                  Security_Training: { type: 'directory' },
                  Surveillance: { type: 'directory' },
                  Threat_Assessment: {
                    type: 'directory',
                    children: {
                      STARTING_LINE: {
                        type: 'directory',
                        children: {
                          'starting_line.txt': {
                            type: 'file',
                            content:
                              'CLASSIFIED REPORT: [CLEARANCE REQUIRED]\nCODENAME: STARTING LINE\n\nCASE FILE: [SECURITY CLASSIFIED]\nTYPE: Multi-target Threat Assessment\nSTATUS: [SECURITY CLASSIFIED]\n\nSUMMARY:\nExternal infosec breach compromised vital intelligence related to system-wide security.\nHighly classified details related to PRO:GO and its target were discovered by non-NULLSTRA operatives with intent to disseminate for currently undefined purposes including, but not limited to, anti-NULLSTRA activities, recruitment of public, private, and governmental parties into the ranks of known and suspected anti-NULLSTRA groups, including, but not limited to MIDA, Traxus OffWorld Industries, and Sekiguchi Genetics.\n\nNOTES:\nIncident response to secure systems breach via cross-party manipulation by third party operative(s).\n\nParties:\n- MIDA, primary\n- Traxus OffWorld Industries, secondary\n- Sekiguchi Genetics, secondary',
                          },
                        },
                      },
                    },
                  },
                },
              },
              Defense: { type: 'directory' },
              Surveillance: { type: 'directory' },
              Tactical_Operations: { type: 'directory' },
            },
          },
        },
      },
      Operational_Protocols: { type: 'directory' },
      Outreach: { type: 'directory' },
      Research: { type: 'directory' },
      Sustainability: { type: 'directory' },
      System_Configurations: { type: 'directory' },
      NULLSTRA_Departments: { type: 'directory' },
      'User_Notes_[Batch]': { type: 'directory' },
    },
  },
};

// Helper function to navigate file system
const getFileSystemItem = (path: string): any => {
  if (!path) {
    return fileSystem[''];
  }

  const pathParts = path.split('/').filter(Boolean);
  let current = fileSystem[''];

  for (const part of pathParts) {
    if (
      current.type !== 'directory' ||
      !current.children ||
      !current.children[part]
    ) {
      return null;
    }
    current = current.children[part];
  }

  return current;
};

// Helper to convert timestamp to string
const getTimestamp = (): string => {
  return new Date().toLocaleTimeString();
};

// Execute terminal command
export const executeCommand = (
  commandString: string,
  currentPath: string
): TerminalMessage | TerminalMessage[] => {
  const timestamp = getTimestamp();
  const [command, ...args] = commandString.trim().split(/\s+/);

  // Handle commands
  switch (command.toLowerCase()) {
    case 'help':
      return {
        type: 'info',
        content: 'Available commands: ls, cd, help, sysinfo, read, exec, clear',
        timestamp,
        animated: true,
      };

    case 'ls':
      const item = getFileSystemItem(currentPath);
      if (!item || item.type !== 'directory') {
        return {
          type: 'error',
          content: `Directory not found: ${currentPath}`,
          timestamp,
        };
      }

      // Get files/directories in current directory
      const files = Object.keys(item.children || {});

      return [
        {
          type: 'info',
          content: `The folder ${
            currentPath || 'root'
          } contains the following files:`,
          prefix: 'TERMINAL',
          timestamp,
          files,
        },
      ];

    case 'cd':
      const directory = args[0] || '';

      // Handle special cases
      if (directory === '..') {
        // Go up one level
        const pathParts = currentPath.split('/').filter(Boolean);
        pathParts.pop();
        return {
          type: 'success',
          content: 'Directory changed.',
          timestamp,
        };
      }

      // Validate destination exists
      let newPath = currentPath;
      if (currentPath) {
        newPath = `${currentPath}/${directory}`;
      } else {
        newPath = directory;
      }

      const target = getFileSystemItem(newPath);
      if (!target || target.type !== 'directory') {
        return {
          type: 'error',
          content: `Directory not found: ${newPath}`,
          timestamp,
        };
      }

      return {
        type: 'success',
        content: 'Directory changed.',
        timestamp,
      };

    case 'read':
      const filePath = args[0] || '';

      // Determine full path
      let fullPath = filePath;
      if (!filePath.startsWith('/') && currentPath) {
        fullPath = `${currentPath}/${filePath}`;
      }

      const file = getFileSystemItem(fullPath);
      if (!file || file.type !== 'file') {
        return {
          type: 'error',
          content: `File not found: ${filePath}`,
          timestamp,
        };
      }

      return {
        type: 'info',
        content: file.content,
        prefix: 'TERMINAL',
        timestamp,
      };

    case 'exec':
      const scriptPath = args[0] || '';

      // Determine full script path
      let fullScriptPath = scriptPath;
      if (!scriptPath.startsWith('/') && currentPath) {
        fullScriptPath = `${currentPath}/${scriptPath}`;
      }

      const script = getFileSystemItem(fullScriptPath);
      if (!script || script.type !== 'file') {
        return {
          type: 'error',
          content: `Script not found: ${scriptPath}`,
          timestamp,
        };
      }

      // Execute the script (simulate)
      return [
        {
          type: 'info',
          content: `Executing ${scriptPath}`,
          prefix: 'TERMINAL',
          timestamp,
        },
        {
          type: 'info',
          content: '#!/bin/bash\n# Decryption utility',
          timestamp,
        },
        {
          type: 'info',
          content: 'Decrypting data...',
          timestamp,
          animated: true,
        },
        {
          type: 'info',
          content: '[OK] Execution completed successfully.',
          timestamp,
        },
      ];

    case 'sysinfo':
      return [
        {
          type: 'info',
          prefix: 'TERMINAL',
          content: 'CYAQUEBC.local',
          timestamp,
        },
        {
          type: 'info',
          content: 'OS: NULLSTRA-UNIX 2803.04.1 LTS',
          timestamp,
        },
        {
          type: 'info',
          content: 'Host: CyberAcme Systems Model CV-4788',
          timestamp,
        },
        {
          type: 'info',
          content: 'Kernel: 15.92.0-NULLSTRA-secure',
          timestamp,
        },
        {
          type: 'info',
          content: 'Uptime: 45088d 17h 19m',
          timestamp,
        },
        {
          type: 'info',
          content: 'Packages: 23,471 (quantum-apt)',
          timestamp,
        },
        {
          type: 'info',
          content: 'Shell: neutron-shell 12.7.3',
          timestamp,
        },
        {
          type: 'info',
          content: 'Resolver: 18K-Hole',
          timestamp,
        },
        {
          type: 'info',
          content: 'DE: NeuroAqua 42.4.1',
          timestamp,
        },
        {
          type: 'info',
          content: 'WM: Quantum Compositor 30.7.3',
          timestamp,
        },
        {
          type: 'info',
          content: 'WM Theme: Grafix (DARK)',
          timestamp,
        },
        {
          type: 'info',
          content: 'Terminal: phantom-term 8.3.4',
          timestamp,
        },
        {
          type: 'info',
          content: 'CPU: Quantum Vector 2298 (128) @ 12.88THz',
          timestamp,
        },
        {
          type: 'info',
          content: 'Memory: 1.28TB Quantum-RAM',
          timestamp,
        },
        {
          type: 'info',
          content: 'Storage: 180TB Molecular Storage (Neural-Encrypted)',
          timestamp,
        },
        {
          type: 'info',
          content: 'Security: NeuralNetDefense Encryption Active',
          timestamp,
        },
      ];

    case 'clear':
      return {
        type: 'command',
        content: 'Terminal cleared',
        timestamp,
        clearTerminal: true,
      };

    default:
      return {
        type: 'error',
        content: `Command not found: ${command}`,
        timestamp,
      };
  }
};
```
