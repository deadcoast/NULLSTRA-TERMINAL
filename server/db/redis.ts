import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Redis connection configuration
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_ENABLED = process.env.REDIS_ENABLED === 'true';

// Redis client instance
let redisClient: RedisClientType | null = null;

/**
 * Setup Redis connection
 */
export const setupRedisConnection = async (): Promise<RedisClientType | null> => {
  // Skip if Redis is not enabled
  if (!REDIS_ENABLED) {
    console.log('Redis is disabled. Skipping connection.');
    return null;
  }
  
  try {
    // Create Redis client
    redisClient = createClient({ url: REDIS_URL });
    
    // Register error event handler
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
    
    // Register connect event handler
    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
    
    // Connect to Redis
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

/**
 * Close Redis connection
 */
export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed');
  }
};