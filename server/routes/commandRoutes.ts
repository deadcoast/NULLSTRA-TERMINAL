import { Application, Request, Response } from 'express';
import { executeCommand } from '../services/commandService';
import { authenticate } from '../middlewares/auth';

/**
 * Set up command routes for the Express application
 */
export const setupCommandRoutes = (app: Application): void => {
  /**
   * @route POST /api/command
   * @desc Execute a terminal command
   * @access Private (if authentication is enabled)
   */
  app.post(
    '/api/command',
    authenticate,
    async (req: Request, res: Response) => {
      try {
        const { command, args = [], sessionId } = req.body;

        if (!command) {
          return res.status(400).json({
            success: false,
            message: 'Command is required',
          });
        }

        const result = await executeCommand(command, args, sessionId);

        return res.json({
          success: true,
          result,
        });
      } catch (error) {
        console.error('Command execution error:', error);
        return res.status(500).json({
          success: false,
          message: 'Error executing command',
          error: (error as Error).message,
        });
      }
    }
  );

  /**
   * @route GET /api/commands
   * @desc Get list of available commands
   * @access Public
   */
  app.get('/api/commands', (req: Request, res: Response) => {
    // This would be populated with actual available commands
    const availableCommands = [
      { name: 'help', description: 'Display help information' },
      { name: 'ls', description: 'List directory contents' },
      { name: 'cd', description: 'Change directory' },
      { name: 'cat', description: 'Display file contents' },
      { name: 'ping', description: 'Test connectivity to a host' },
      { name: 'connect', description: 'Connect to a remote server' },
      { name: 'disconnect', description: 'Disconnect from current session' },
      { name: 'netstat', description: 'Display network connections' },
      { name: 'traceroute', description: 'Trace route to host' },
    ];

    return res.json({
      success: true,
      commands: availableCommands,
    });
  });

  /**
   * Health check endpoint
   */
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
  });
};
