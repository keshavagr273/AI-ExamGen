import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db";
import { checkRedisConnection } from "./config/redis";
import { initQueue } from "./queues/generationQueue";
import { initWorker } from "./workers/generationWorker";
import { initSocket } from "./services/socketService";
import assignmentRouter from "./routes/assignmentRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with expansive CORS rules to support local Next.js client navigations
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// REST Routes
app.use("/api", assignmentRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    redisFallback: (global as any).isRedisFallbackForce || false,
    environment: process.env.NODE_ENV || "development"
  });
});

async function startServer() {
  console.log("=================================================");
  console.log("      VedaAI Backend Service Initialization       ");
  console.log("=================================================");

  // 1. Establish Database Connection (with resilient timeouts)
  await connectDB();

  // 2. Perform Redis connectivity checks
  await checkRedisConnection();

  // 3. Initialize BullMQ Queue producers and worker consumers
  initQueue();
  initWorker();

  // 4. Initialize Socket.io WebSockets broadsheets
  initSocket(io);

  // 5. Start listening
  server.listen(PORT, () => {
    console.log(`\n[VedaAI Server] Express active on: http://localhost:${PORT}`);
    console.log(`[VedaAI Server] WebSockets active on: ws://localhost:${PORT}`);
    console.log("=================================================\n");
  });
}

// Global exception catches to prevent crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("[CRITICAL REJECTION] Unhandled Promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[CRITICAL ERROR] Uncaught application exception:", error);
});

startServer();
