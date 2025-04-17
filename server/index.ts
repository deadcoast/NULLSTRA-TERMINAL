import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupCommandRoutes } from './routes/commandRoutes';
import { setupSocketHandlers } from './socket/socketHandlers';
import { setupRedisConnection } from './db/redis';

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
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// API Routes
setupCommandRoutes(app);

// Socket.io handlers
setupSocketHandlers(io);

// Connect to Redis if configured
const redisEnabled = process.env.REDIS_ENABLED === 'true';
if (redisEnabled) {
  setupRedisConnection();
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io initialized`);
  console.log(`🔄 Redis ${redisEnabled ? 'connected' : 'disabled'}`);
});