import { Server } from "socket.io";

let ioServer: Server | null = null;

export function initSocket(io: Server) {
  ioServer = io;
  
  io.on("connection", (socket) => {
    console.log(`[WebSocket] Active connection client: ${socket.id}`);

    // Allow client to subscribe to updates for a specific generation jobId
    socket.on("join-job", (jobId: string) => {
      console.log(`[WebSocket] Client ${socket.id} subscribed to job updates: ${jobId}`);
      socket.join(jobId);
    });

    socket.on("disconnect", () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * Broadcasts progress updates directly to subscribers in the job room.
 */
export function broadcastProgress(jobId: string, progress: number, step: string) {
  if (ioServer) {
    console.log(`[WebSocket Broadcast] Job ${jobId} -> ${progress}%: ${step}`);
    ioServer.to(jobId).emit("job-progress", { jobId, progress, step });
  } else {
    console.warn("[WebSocket Broadcast Warning] ioServer is not active. Skipping broadcast.");
  }
}
