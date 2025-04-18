import * as dotenv from "dotenv";
import { createClient, RedisClient } from "redis";

// Load environment variables
dotenv.config();

// Redis connection configuration
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const REDIS_ENABLED = process.env.REDIS_ENABLED === "true";

// Add a simple logger
const logger = {
  info: (message: string) => {
    // eslint-disable-next-line no-console
    console.log(message);
  },
  error: (message: string, error?: unknown) => {
    // eslint-disable-next-line no-console
    console.error(message, error);
  },
};

// Redis client instance
let redisClient: RedisClient | null = null;

/**
 * Setup Redis connection
 */
export const setupRedisConnection = async (): Promise<RedisClient | null> => {
  // Skip if Redis is not enabled
  if (!REDIS_ENABLED) {
    logger.info("Redis is disabled. Skipping connection.");
    return null;
  }

  try {
    // Create Redis client
    redisClient = createClient({ url: REDIS_URL });

    // Register error event handler
    redisClient.on("error", (err: Error) => {
      logger.error("Redis connection error:", err);
    });

    // Register connect event handler
    redisClient.on("connect", () => {
      logger.info("Connected to Redis");
    });

    // Connect to Redis
    if (redisClient.connect && typeof redisClient.connect === "function") {
      await redisClient.connect();
    }

    return redisClient;
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): RedisClient | null => {
  return redisClient;
};

/**
 * Close Redis connection
 */
export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info("Redis connection closed");
  }
};
