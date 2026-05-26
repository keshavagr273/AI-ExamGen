import { Router, Request, Response } from "express";
import { getAllAssignments, getAssignmentById, removeAssignment } from "../services/dbService";
import { addGenerationJob } from "../queues/generationQueue";

const router = Router();

/**
 * GET /api/assignments
 * Returns a list of all current assessments.
 */
router.get("/assignments", async (req: Request, res: Response) => {
  try {
    const list = await getAllAssignments();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read assessments catalog" });
  }
});

/**
 * GET /api/assignments/:id
 * Returns detailed fields of a specific exam sheet.
 */
router.get("/assignments/:id", async (req: Request, res: Response) => {
  try {
    const assignment = await getAssignmentById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assessment sheet not found" });
    }
    res.json(assignment);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read assessment details" });
  }
});

/**
 * POST /api/assignments
 * Queues up a background job in BullMQ to create a new assessment.
 */
router.post("/assignments", async (req: Request, res: Response) => {
  const { title, subject, classLevel, dueDate, questionTypes, additionalInstructions, fileName } = req.body;

  // Server-side validation checks
  const errors: string[] = [];
  if (!title || !title.trim()) errors.push("Title is required");
  if (!subject) errors.push("Subject is required");
  if (!classLevel) errors.push("ClassLevel is required");
  if (!dueDate || !dueDate.trim()) errors.push("DueDate is required");
  if (!questionTypes || !Array.isArray(questionTypes) || questionTypes.length === 0) {
    errors.push("At least one question type row must be supplied");
  } else {
    questionTypes.forEach((row: any) => {
      if (!row.type) errors.push("Question type identifier is required");
      if (typeof row.count !== "number" || row.count <= 0) {
        errors.push(`Question count must be positive for type: ${row.type}`);
      }
      if (typeof row.marks !== "number" || row.marks <= 0) {
        errors.push(`Question marks must be positive for type: ${row.type}`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Enroll job in generation worker queue
    const jobId = await addGenerationJob({
      title,
      subject,
      classLevel,
      dueDate,
      questionTypes,
      additionalInstructions,
      fileName,
      schoolName: req.body.schoolName,
      geminiApiKey: req.body.geminiApiKey
    });

    res.status(202).json({
      jobId,
      status: "queued",
      message: "Generation job enrolled in BullMQ queue."
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit assessment generation request" });
  }
});

/**
 * DELETE /api/assignments/:id
 * Deletes an assignment.
 */
router.delete("/assignments/:id", async (req: Request, res: Response) => {
  try {
    const success = await removeAssignment(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Assessment sheet not found" });
    }
    res.json({ success: true, message: "Assessment sheet deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete assessment sheet" });
  }
});

export default router;
