import { QueueOptions } from "bullmq";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export let isRedisFallback = false;

// Connection options for BullMQ
export let bullConnectionOptions: any = {
  host: "127.0.0.1",
  port: 6379
};

export async function checkRedisConnection(): Promise<boolean> {
  const client = createClient({
    url: REDIS_URL,
    socket: {
      connectTimeout: 2000, // 2-second timeout
      reconnectStrategy: false // do not retry endlessly
    }
  });

  client.on("error", () => {}); // silence immediate log dumps

  try {
    console.log(`[Redis] Testing connection to Redis at: ${REDIS_URL}`);
    await client.connect();
    await client.disconnect();
    
    console.log("[Redis] Successful connection to Redis server.");
    isRedisFallback = false;
    
    // Parse Redis URL for BullMQ
    const parsed = new URL(REDIS_URL);
    bullConnectionOptions = {
      host: parsed.hostname || "127.0.0.1",
      port: parseInt(parsed.port || "6379", 10),
      username: parsed.username || undefined,
      password: parsed.password || undefined
    };
    
    return true;
  } catch (error: any) {
    console.warn("\n============================================================");
    console.warn("[REDIS WARNING] Local Redis service was not reachable.");
    console.warn("Reason:", error?.message || error);
    console.warn("Action: Bypassing BullMQ. Background workers will process");
    console.warn("        jobs using in-memory local asynchronous event loops.");
    console.warn("============================================================\n");
    
    isRedisFallback = true;
    return false;
  }
}
