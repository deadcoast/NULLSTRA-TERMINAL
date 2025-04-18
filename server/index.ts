import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupRedisConnection } from "./db/redis";
import { setupCommandRoutes } from "./routes/commandRoutes";
import { setupSocketHandlers } from "./socket/socketHandlers";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
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

// Add a simple logger class at the top of the file
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

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🔌 Socket.io initialized`);
  logger.info(`🔄 Redis ${redisEnabled ? "connected" : "disabled"}`);
});
