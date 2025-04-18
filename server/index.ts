import cors from "cors";
import * as dotenv from "dotenv";
import * as http from "http";
import { Server } from "socket.io";
import { setupRedisConnection } from "./db/redis";
import { setupCommandRoutes } from "./routes/commandRoutes";
import { setupSocketHandlers } from "./socket/socketHandlers";

// Need to use require for Express to work with the CommonJS module system
const express = require("express");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4001;

// Middleware with proper CORS for Next.js
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

// Create HTTP server with type assertion
const server = http.createServer(app);

// Initialize Socket.io with improved configuration
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// API Routes
setupCommandRoutes(app);

// Socket.io handlers
setupSocketHandlers(io);

// Connect to Redis if configured
const redisEnabled = process.env.REDIS_ENABLED === "true";
if (redisEnabled) {
  setupRedisConnection();
}

// Add a simple logger class
const logger = {
  info: (message: string) => {
    console.log(`[SERVER] ${message}`);
  },
  error: (message: string, error?: unknown) => {
    console.error(`[SERVER ERROR] ${message}`, error);
  },
};

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🔌 Socket.io initialized and ready for connections`);
  logger.info(`🔄 Redis ${redisEnabled ? "connected" : "disabled"}`);
  logger.info(
    `🌐 CORS configured for ${
      process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"
    }`,
  );
});
