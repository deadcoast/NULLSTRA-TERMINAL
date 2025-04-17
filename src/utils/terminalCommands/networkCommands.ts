// src/utils/terminalCommands/network.ts
// Network related commands

import { 
  Command, 
  CommandRegistry 
} from './types';
import {
  createSuccessMessage,
  createErrorMessage,
  createInfoMessage,
  createWarningMessage,
  formatTimestamp
} from './helpers';

/**
 * ping command - Check network connectivity
 */
const pingCommand: Command = {
  name: 'ping',
  description: 'Check network connectivity to a host',
  usage: 'ping <host>',
  examples: [
    'ping server',
    'ping 192.168.1.1',
    'ping quantum.node'
  ],
  executor: (args, context) => {
    if (args.length === 0) {
      return createErrorMessage('No host specified. Usage: ping <host>');
    }
    
    const host = args[0];
    
    // Simulate ping process
    return [
      createInfoMessage(`PING ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}): 56 data bytes`, {
        animated: true
      }),
      createInfoMessage(`64 bytes from ${host}: icmp_seq=0 ttl=64 time=${Math.random() * 10 + 1}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createInfoMessage(`64 bytes from ${host}: icmp_seq=1 ttl=64 time=${Math.random() * 10 + 1}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createInfoMessage(`64 bytes from ${host}: icmp_seq=2 ttl=64 time=${Math.random() * 10 + 1}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createInfoMessage(`64 bytes from ${host}: icmp_seq=3 ttl=64 time=${Math.random() * 10 + 1}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createSuccessMessage(`--- ${host} ping statistics ---`, {
        animated: true
      }),
      createInfoMessage('4 packets transmitted, 4 packets received, 0.0% packet loss', {
        animated: true
      }),
      createInfoMessage('round-trip min/avg/max/stddev = 1.123/4.567/9.876/2.345 ms', {
        animated: true
      })
    ];
  }
};

/**
 * netstat command - Display network connections
 */
const netstatCommand: Command = {
  name: 'netstat',
  description: 'Display network connections and routing tables',
  usage: 'netstat [options]',
  examples: [
    'netstat',
    'netstat -a',
    'netstat -r'
  ],
  executor: (args, context) => {
    const options = args.join(' ');
    
    // Simulate different outputs based on options
    if (options.includes('-r')) {
      // Routing tables
      return [
        createInfoMessage('Kernel IP routing table', {
          animated: true
        }),
        createInfoMessage('Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface', {
          animated: true
        }),
        createInfoMessage('0.0.0.0         192.168.1.1     0.0.0.0         UG        0 0          0 eth0', {
          animated: true
        }),
        createInfoMessage('192.168.1.0     0.0.0.0         255.255.255.0   U         0 0          0 eth0', {
          animated: true
        }),
        createInfoMessage('quantum.local   0.0.0.0         255.255.255.0   U         0 0          0 qnet0', {
          animated: true
        })
      ];
    } else if (options.includes('-a')) {
      // All connections
      return [
        createInfoMessage('Active Internet connections (servers and established)', {
          animated: true
        }),
        createInfoMessage('Proto Recv-Q Send-Q Local Address           Foreign Address         State', {
          animated: true
        }),
        createInfoMessage('tcp        0      0 localhost:domain        *:*                     LISTEN', {
          animated: true
        }),
        createInfoMessage('tcp        0      0 *:ssh                   *:*                     LISTEN', {
          animated: true
        }),
        createInfoMessage('tcp        0     64 localhost:44231         server-2.local:https    ESTABLISHED', {
          animated: true
        }),
        createInfoMessage('udp        0      0 *:bootpc                *:*                     ESTABLISHED', {
          animated: true
        }),
        createInfoMessage('tcp        0      0 quantum.node:55123      remote-server:ssh       ESTABLISHED', {
          animated: true
        })
      ];
    } else {
      // Default output
      return [
        createInfoMessage('Active Internet connections', {
          animated: true
        }),
        createInfoMessage('Proto Recv-Q Send-Q Local Address           Foreign Address         State', {
          animated: true
        }),
        createInfoMessage('tcp        0     64 localhost:44231         server-2.local:https    ESTABLISHED', {
          animated: true
        }),
        createInfoMessage('tcp        0      0 quantum.node:55123      remote-server:ssh       ESTABLISHED', {
          animated: true
        })
      ];
    }
  }
};

/**
 * connect command - Connect to a remote server
 */
const connectCommand: Command = {
  name: 'connect',
  description: 'Connect to a remote server or node',
  usage: 'connect <server> [port]',
  examples: [
    'connect quantum.server',
    'connect 192.168.1.100 22',
    'connect mainframe.local'
  ],
  executor: (args, context) => {
    if (args.length === 0) {
      return createErrorMessage('No server specified. Usage: connect <server> [port]');
    }
    
    const server = args[0];
    const port = args[1] || 'default';
    
    // Simulate connection process
    return [
      createInfoMessage(`Connecting to ${server}${port !== 'default' ? ` on port ${port}` : ''}...`, {
        animated: true
      }),
      createInfoMessage('Initializing connection...', {
        animated: true
      }),
      createInfoMessage('Resolving host...', {
        animated: true
      }),
      createWarningMessage('Link failure. Attempt 1/5...', {
        animated: true
      }),
      createWarningMessage('Link failure. Attempt 2/5...', {
        animated: true
      }),
      createInfoMessage('Link failure detected at node 4A-7D. Network integrity scan initiated.', {
        animated: true
      }),
      createInfoMessage('Latency spikes observed. External interference or signal degradation suspected.', {
        animated: true
      }),
      createWarningMessage('Link failure. Attempt 3/5...', {
        animated: true
      }),
      createSuccessMessage('Connection stabilized.', {
        animated: true
      }),
      createInfoMessage(`Connected to ${server}. Welcome to the network.`, {
        animated: true
      })
    ];
  }
};

/**
 * disconnect command - Disconnect from a remote server
 */
const disconnectCommand: Command = {
  name: 'disconnect',
  description: 'Disconnect from a remote server or node',
  usage: 'disconnect [server]',
  examples: [
    'disconnect',
    'disconnect quantum.server'
  ],
  executor: (args, context) => {
    const server = args[0] || 'current connection';
    
    // Simulate disconnection process
    return [
      createInfoMessage(`Disconnecting from ${server}...`, {
        animated: true
      }),
      createInfoMessage('Closing active sessions...', {
        animated: true
      }),
      createInfoMessage('Terminating secure channels...', {
        animated: true
      }),
      createSuccessMessage(`Disconnected from ${server}.`, {
        animated: true
      })
    ];
  }
};

/**
 * traceroute command - Trace network route to host
 */
const tracerouteCommand: Command = {
  name: 'traceroute',
  description: 'Trace the network route to a host',
  usage: 'traceroute <host>',
  examples: [
    'traceroute server.local',
    'traceroute 192.168.1.1',
    'traceroute quantum.node'
  ],
  aliases: ['tracert'],
  executor: (args, context) => {
    if (args.length === 0) {
      return createErrorMessage('No host specified. Usage: traceroute <host>');
    }
    
    const host = args[0];
    
    // Simulate traceroute process
    return [
      createInfoMessage(`traceroute to ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}), 30 hops max, 60 byte packets`, {
        animated: true
      }),
      createInfoMessage(` 1  gateway (192.168.1.1)  ${Math.random() * 5 + 1}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 5 + 1}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 5 + 1}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createInfoMessage(` 2  edge-router.local (10.0.0.1)  ${Math.random() * 10 + 5}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 10 + 5}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 10 + 5}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createInfoMessage(` 3  core-switch-1.net (172.16.0.1)  ${Math.random() * 15 + 10}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 15 + 10}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 15 + 10}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createInfoMessage(` 4  quantum-gate.net (172.31.0.1)  ${Math.random() * 20 + 15}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 20 + 15}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 20 + 15}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      }),
      createInfoMessage(` 5  ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)})  ${Math.random() * 25 + 20}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 25 + 20}.${Math.floor(Math.random() * 999)} ms  ${Math.random() * 25 + 20}.${Math.floor(Math.random() * 999)} ms`, {
        animated: true
      })
    ];
  }
};

/**
 * Register all network commands
 */
export const registerNetworkCommands = (registry: CommandRegistry): void => {
  registry.ping = pingCommand;
  registry.netstat = netstatCommand;
  registry.connect = connectCommand;
  registry.disconnect = disconnectCommand;
  registry.traceroute = tracerouteCommand;
  
  // Register aliases
  if (tracerouteCommand.aliases) {
    for (const alias of tracerouteCommand.aliases) {
      registry[alias] = tracerouteCommand;
    }
  }
};