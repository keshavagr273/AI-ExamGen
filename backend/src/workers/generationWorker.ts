import { Worker } from "bullmq";
import { bullConnectionOptions, isRedisFallback } from "../config/redis";
import { generateQuestionPaper } from "../services/aiService";
import { saveAssignment } from "../services/dbService";
import { broadcastProgress } from "../services/socketService";

/**
 * Unified core job processing loop used by both live BullMQ workers
 * and the local event loop simulation fallbacks.
 */
export async function processJobDirectly(jobId: string, data: any) {
  try {
    console.log(`[Worker Engine] Processing Job: ${jobId}`);

    // Step 1: Ingest parameters
    broadcastProgress(jobId, 15, "Queue Worker Connected. Ingesting input templates...");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 2: Digest formatting
    broadcastProgress(jobId, 35, "Digesting reference sheets & formatting CBSE curriculum schemas...");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 3: Trigger AI Generation
    broadcastProgress(jobId, 60, "Invoking VedaAI Structured Prompt Generator...");
    
    // Call our resilient AI compiler
    const generatedPaper = await generateQuestionPaper(data);

    // Step 4: Structuring sheets & compiling answer keys
    broadcastProgress(jobId, 85, "Structuring question sheets & compiling suggestions key...");
    await new Promise((resolve) => setTimeout(resolve, 850));

    // Save paper details to database (or local catalog)
    const savedDoc = await saveAssignment(generatedPaper);

    // Step 5: Finished successfully
    broadcastProgress(jobId, 100, `Success! Saved paper to DB. Redirecting client...`);
    
    // Emit final success packet containing the new ID so the client routes immediately
    const finalId = savedDoc._id || savedDoc.id;
    broadcastProgress(jobId, 101, finalId);

    console.log(`[Worker Engine] Job completed successfully: ${jobId}`);
  } catch (err: any) {
    console.error(`[Worker Engine Error] processing job ${jobId}:`, err);
    broadcastProgress(jobId, -1, `Job generation failed: ${err?.message || err}`);
    throw err;
  }
}

/**
 * Initiates the BullMQ worker listener thread if local Redis is available.
 */
export function initWorker() {
  const forceFallback = (global as any).isRedisFallbackForce || isRedisFallback;
  
  if (!forceFallback) {
    try {
      const worker = new Worker(
        "generationQueue",
        async (job) => {
          await processJobDirectly(job.id || `job-${Date.now()}`, job.data);
        },
        { connection: bullConnectionOptions }
      );

      worker.on("completed", (job) => {
        console.log(`[Worker] BullMQ job ${job.id} completed successfully.`);
      });

      worker.on("failed", (job, err) => {
        console.error(`[Worker] BullMQ job ${job?.id} failed:`, err?.message || err);
      });

      console.log("[Worker] Successfully started BullMQ background listener thread.");
    } catch (err: any) {
      console.error("[Worker Error] Failed to start BullMQ worker. Operating in local mode.", err?.message || err);
    }
  } else {
    console.log("[Worker] Bypassing BullMQ Worker threads. Queue processed locally.");
  }
}
