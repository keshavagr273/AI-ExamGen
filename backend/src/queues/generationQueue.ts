import { Queue } from "bullmq";
import { bullConnectionOptions, isRedisFallback } from "../config/redis";
import { processJobDirectly } from "../workers/generationWorker";

let bullQueue: Queue | null = null;

export function initQueue() {
  if (!isRedisFallback) {
    try {
      bullQueue = new Queue("generationQueue", {
        connection: bullConnectionOptions
      });
      console.log("[Queue] Successful initialization of BullMQ 'generationQueue'.");
    } catch (err: any) {
      console.error("[Queue Error] Failed to initialize BullMQ. Bypassing Redis.", err?.message || err);
      // force fallback
      (global as any).isRedisFallbackForce = true;
    }
  } else {
    console.log("[Queue] Fallback local queue manager active. Bypassing BullMQ.");
  }
}

/**
 * Adds an assessment generation job to the queue.
 * Returns the unique Job ID immediately.
 */
export async function addGenerationJob(data: any): Promise<string> {
  const jobId = `job-${Date.now()}`;
  const forceFallback = (global as any).isRedisFallbackForce || isRedisFallback;

  if (!forceFallback && bullQueue) {
    await bullQueue.add("generate-paper", data, { jobId });
    console.log(`[Queue] Added job ${jobId} to BullMQ.`);
  } else {
    console.log(`[Queue Fallback] Enrolling Job ${jobId} into Direct Local Thread.`);
    // Process asynchronously in a separate macro-task to simulate background workers
    setTimeout(async () => {
      try {
        await processJobDirectly(jobId, data);
      } catch (err) {
        console.error(`[Queue Fallback Error] Local process for job ${jobId} crashed:`, err);
      }
    }, 200);
  }

  return jobId;
}
