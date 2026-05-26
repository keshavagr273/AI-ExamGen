import Assignment, { IAssignment } from "../models/Assignment";
import { isMongoFallback } from "../config/db";

// Memory container used during local database fallbacks
let inMemoryAssignments: any[] = [
  {
    _id: "electricity-quiz",
    title: "Quiz on Electricity",
    subject: "Science",
    classLevel: "Class 8",
    assignedDate: "20-06-2025",
    dueDate: "21-06-2025",
    totalQuestions: 10,
    totalMarks: 20,
    timeAllowed: "45 minutes",
    schoolName: "Delhi Public School, Sector-4, Bokaro",
    generalInstructions: "All questions are compulsory unless stated otherwise. Use of calculators is strictly prohibited.",
    sections: [
      {
        id: "sec-a",
        title: "Section A",
        instruction: "Short Answer Questions. Attempt all questions. Each question carries 2 marks.",
        questions: [
          { id: "q1", text: "Define electroplating. Explain its purpose in daily life.", difficulty: "Easy", marks: 2 },
          { id: "q2", text: "What is the role of a conductor in the process of electrolysis?", difficulty: "Moderate", marks: 2 },
          { id: "q3", text: "Why does a solution of copper sulfate conduct electricity?", difficulty: "Easy", marks: 2 },
          { id: "q4", text: "Describe one example of the chemical effect of electric current in daily life.", difficulty: "Moderate", marks: 2 }
        ]
      }
    ],
    answerKey: [
      {
        id: "a1",
        questionNumber: 1,
        answer: "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance (e.g. silver plating), or increase surface durability."
      }
    ]
  }
];

export async function getAllAssignments(): Promise<any[]> {
  if (isMongoFallback) {
    console.log("[Database Fallback] Reading assignments list from memory buffer.");
    return inMemoryAssignments;
  }
  return await Assignment.find().sort({ createdAt: -1 });
}

export async function getAssignmentById(id: string): Promise<any> {
  if (isMongoFallback) {
    console.log(`[Database Fallback] Finding assignment ID in memory: ${id}`);
    const found = inMemoryAssignments.find((a) => a._id === id || a.id === id);
    return found || null;
  }
  
  try {
    return await Assignment.findById(id);
  } catch {
    // If invalid ObjectID format, fall back to check custom IDs
    return await Assignment.findOne({ id });
  }
}

export async function saveAssignment(assignmentData: any): Promise<any> {
  if (isMongoFallback) {
    console.log("[Database Fallback] Saving assignment directly to memory buffer.");
    const saved = {
      _id: assignmentData.id || `assn-${Date.now()}`,
      createdAt: new Date(),
      ...assignmentData
    };
    inMemoryAssignments.unshift(saved);
    return saved;
  }

  const newDoc = new Assignment(assignmentData);
  return await newDoc.save();
}

export async function removeAssignment(id: string): Promise<boolean> {
  if (isMongoFallback) {
    console.log(`[Database Fallback] Removing assignment ID: ${id}`);
    const initialLength = inMemoryAssignments.length;
    inMemoryAssignments = inMemoryAssignments.filter((a) => a._id !== id && a.id !== id);
    return inMemoryAssignments.length < initialLength;
  }

  try {
    const result = await Assignment.findByIdAndDelete(id);
    if (result) return true;
    const resultAlt = await Assignment.deleteOne({ id });
    return resultAlt.deletedCount > 0;
  } catch {
    const resultAlt = await Assignment.deleteOne({ id });
    return resultAlt.deletedCount > 0;
  }
}
