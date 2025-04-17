import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';

// Whether authentication is required
const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  userId: string;
  sessionId: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate API requests using JWT
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip authentication if not enabled
  if (!AUTH_ENABLED) {
    return next();
  }

  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.',
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: (error as Error).message,
    });
  }
};

/**
 * Generate a JWT token for a user session
 */
export const generateToken = (userId: string, sessionId: string): string => {
  return jwt.sign({ userId, sessionId }, JWT_SECRET, { expiresIn: '24h' });
};

// Extend Express Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}
