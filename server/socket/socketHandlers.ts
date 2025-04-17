import { Server, Socket } from 'socket.io';
import { executeCommand, getCommandHistory } from '../services/commandService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';

// Whether authentication is required
const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

/**
 * Interface for Socket.io client data
 */
interface SocketClient {
  socket: Socket;
  userId?: string;
  sessionId?: string;
  authenticated: boolean;
}

// Active client connections
const clients: Map<string, SocketClient> = new Map();

/**
 * Set up Socket.io event handlers
 */
export const setupSocketHandlers = (io: Server): void => {
  // Connection event handler
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Store client connection
    clients.set(socket.id, {
      socket,
      authenticated: !AUTH_ENABLED
    });
    
    // Authenticate event handler
    socket.on('authenticate', (token: string) => {
      try {
        // Skip authentication if not enabled
        if (!AUTH_ENABLED) {
          clients.set(socket.id, {
            ...clients.get(socket.id)!,
            authenticated: true
          });
          
          socket.emit('authenticated', { success: true });
          return;
        }
        
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET) as {
          userId: string;
          sessionId: string;
        };
        
        // Update client with authentication info
        clients.set(socket.id, {
          socket,
          userId: decoded.userId,
          sessionId: decoded.sessionId,
          authenticated: true
        });
        
        socket.emit('authenticated', { 
          success: true,
          userId: decoded.userId,
          sessionId: decoded.sessionId
        });
        
        console.log(`Socket authenticated: ${socket.id} (User: ${decoded.userId})`);
        
      } catch (error) {
        console.error('Socket authentication error:', error);
        socket.emit('authenticated', { 
          success: false,
          error: (error as Error).message
        });
      }
    });
    
    // Execute command event handler
    socket.on('execute_command', async ({ command, args, sessionId }) => {
      const client = clients.get(socket.id);
      
      // Ensure client is authenticated if required
      if (AUTH_ENABLED && (!client || !client.authenticated)) {
        socket.emit('command_result', {
          success: false,
          error: 'Authentication required'
        });
        return;
      }
      
      try {
        // Emit command_start event to indicate processing
        socket.emit('command_start', { command, timestamp: new Date().toISOString() });
        
        // Get command session
        const cmdSessionId = sessionId || client?.sessionId;
        
        // Execute command
        const result = await executeCommand(command, args, cmdSessionId);
        
        // Stream results if multiple
        if (Array.isArray(result)) {
          // Delay between results for streaming effect
          for (const [index, item] of result.entries()) {
            // Add small delay between messages for realistic streaming
            await new Promise(resolve => setTimeout(resolve, 100 * (index + 1)));
            socket.emit('command_output', item);
          }
          
          // Send final completion message
          socket.emit('command_result', {
            success: true,
            completed: true,
            timestamp: new Date().toISOString()
          });
        } else {
          // Send single result
          socket.emit('command_output', result);
          socket.emit('command_result', {
            success: true,
            completed: true,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Command execution error:', error);
        socket.emit('command_result', {
          success: false,
          error: (error as Error).message,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Get command history event handler
    socket.on('get_command_history', async ({ sessionId }) => {
      const client = clients.get(socket.id);
      
      // Ensure client is authenticated if required
      if (AUTH_ENABLED && (!client || !client.authenticated)) {
        socket.emit('command_history_result', {
          success: false,
          error: 'Authentication required'
        });
        return;
      }
      
      try {
        // Get command session
        const cmdSessionId = sessionId || client?.sessionId;
        
        if (!cmdSessionId) {
          socket.emit('command_history_result', {
            success: false,
            error: 'Session ID required'
          });
          return;
        }
        
        // Get command history
        const history = await getCommandHistory(cmdSessionId);
        
        socket.emit('command_history_result', {
          success: true,
          history
        });
      } catch (error) {
        console.error('Get command history error:', error);
        socket.emit('command_history_result', {
          success: false,
          error: (error as Error).message
        });
      }
    });
    
    // Disconnect event handler
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      clients.delete(socket.id);
    });
  });
};