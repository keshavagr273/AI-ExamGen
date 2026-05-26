import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  id: string;
  text: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  marks: number;
}

export interface ISection {
  id: string;
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAnswerKeyItem {
  id: string;
  questionNumber: number;
  answer: string;
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  classLevel: string;
  assignedDate: string;
  dueDate: string;
  totalQuestions: number;
  totalMarks: number;
  timeAllowed: string;
  schoolName: string;
  generalInstructions: string;
  sections: ISection[];
  answerKey: IAnswerKeyItem[];
  sourceFile?: string;
  additionalInfo?: string;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Moderate", "Challenging"], required: true },
  marks: { type: Number, required: true }
});

const SectionSchema = new Schema<ISection>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema]
});

const AnswerKeyItemSchema = new Schema<IAnswerKeyItem>({
  id: { type: String, required: true },
  questionNumber: { type: Number, required: true },
  answer: { type: String, required: true }
});

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  classLevel: { type: String, required: true },
  assignedDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  timeAllowed: { type: String, required: true },
  schoolName: { type: String, required: true },
  generalInstructions: { type: String, required: true },
  sections: [SectionSchema],
  answerKey: [AnswerKeyItemSchema],
  sourceFile: { type: String },
  additionalInfo: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.Assignment || mongoose.model<IAssignment>("Assignment", AssignmentSchema);
