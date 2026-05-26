import { create } from "zustand";
import { io, Socket } from "socket.io-client";

export interface Question {
  id: string;
  text: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  marks: number;
}

export interface Section {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface AnswerKeyItem {
  id: string;
  questionNumber: number;
  answer: string;
}

export interface Assignment {
  id: string;
  _id?: string; // Mongoose MongoDB ID
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
  sections: Section[];
  answerKey: AnswerKeyItem[];
  sourceFile?: string;
  additionalInfo?: string;
}

export interface QuestionTypeRow {
  id: string;
  type: string;
  count: number;
  marks: number;
}

interface AssignmentState {
  assignments: Assignment[];
  currentCreation: {
    title: string;
    subject: string;
    classLevel: string;
    fileName: string;
    dueDate: string;
    questionTypes: QuestionTypeRow[];
    additionalInstructions: string;
  };
  globalSettings: {
    schoolName: string;
    schoolRegion: string;
    geminiApiKey: string;
  };
  isGenerating: boolean;
  generationProgress: number;
  generationStep: string;
  activeNotification: string | null;
  
  // Full-Stack states
  isLiveBackend: boolean;
  socketClient: Socket | null;
  
  // Actions
  initFullStackConnection: () => void;
  fetchAssignments: () => Promise<void>;
  addAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => Promise<void>;
  resetCurrentCreation: () => void;
  updateCurrentCreation: (fields: Partial<AssignmentState["currentCreation"]>) => void;
  updateGlobalSettings: (fields: Partial<AssignmentState["globalSettings"]>) => void;
  addQuestionTypeRow: () => void;
  removeQuestionTypeRow: (id: string) => void;
  updateQuestionTypeRow: (id: string, fields: Partial<QuestionTypeRow>) => void;
  triggerGeneration: (onComplete: (id: string) => void) => void;
  dismissNotification: () => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Pre-populated default assignments when offline
const initialAssignmentsOffline: Assignment[] = [
  {
    id: "electricity-quiz",
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
        answer: "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase surface durability."
      }
    ]
  }
];

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: initialAssignmentsOffline,
  currentCreation: {
    title: "",
    subject: "Science",
    classLevel: "Class 8",
    fileName: "",
    dueDate: "",
    questionTypes: [
      { id: "row-1", type: "Multiple Choice Questions", count: 4, marks: 1 },
      { id: "row-2", type: "Short Questions", count: 3, marks: 2 },
      { id: "row-3", type: "Diagram/Graph-Based Questions", count: 2, marks: 5 }
    ],
    additionalInstructions: ""
  },
  globalSettings: {
    schoolName: "Delhi Public School",
    schoolRegion: "Bokaro Steel City",
    geminiApiKey: ""
  },
  isGenerating: false,
  generationProgress: 0,
  generationStep: "",
  activeNotification: null,
  isLiveBackend: false,
  socketClient: null,

  initFullStackConnection: () => {
    if (typeof window === "undefined" || get().socketClient) return;

    console.log(`[Store Ingestion] Attempting live socket handshake with: ${BACKEND_URL}`);
    
    // Connect to local Express HTTP socket server
    const socket = io(BACKEND_URL, {
      reconnectionAttempts: 2,
      timeout: 2000
    });

    socket.on("connect", () => {
      console.log("[Store Ingestion] Socket connected. Operating in full-stack REST + WS mode.");
      set({ isLiveBackend: true, socketClient: socket });
      get().fetchAssignments();
    });

    socket.on("connect_error", () => {
      console.warn("[Store Ingestion Warning] Backend down. Operating in offline client-fallback mode.");
      set({ isLiveBackend: false });
    });

    socket.on("disconnect", () => {
      console.log("[Store Ingestion] Socket disconnected. Reverting to local state.");
      set({ isLiveBackend: false });
    });
  },

  fetchAssignments: async () => {
    if (!get().isLiveBackend) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/assignments`);
      if (response.ok) {
        const data = await response.json();
        // Standardize IDs from Mongoose (_id) to standard ID
        const normalized = data.map((a: any) => ({
          ...a,
          id: a._id || a.id
        }));
        set({ assignments: normalized });
      }
    } catch (err) {
      console.error("[Store Ingestion Error] Failed to fetch REST assignments:", err);
    }
  },

  addAssignment: (assignment) =>
    set((state) => ({ assignments: [assignment, ...state.assignments] })),

  deleteAssignment: async (id) => {
    const { isLiveBackend } = get();

    if (isLiveBackend) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/assignments/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          set((state) => ({
            assignments: state.assignments.filter((a) => a.id !== id && a._id !== id),
            activeNotification: "Assignment deleted from MongoDB successfully!"
          }));
        } else {
          console.error("[Store REST Error] Failed to delete on server.");
        }
      } catch (err) {
        console.error("[Store REST Error] Failed to contact delete API:", err);
      }
    } else {
      // Local fallback
      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id),
        activeNotification: "Assignment deleted successfully!"
      }));
    }
  },

  resetCurrentCreation: () =>
    set({
      currentCreation: {
        title: "",
        subject: "Science",
        classLevel: "Class 8",
        fileName: "",
        dueDate: "",
        questionTypes: [
          { id: "row-1", type: "Multiple Choice Questions", count: 4, marks: 1 },
          { id: "row-2", type: "Short Questions", count: 3, marks: 2 }
        ],
        additionalInstructions: ""
      }
    }),

  updateCurrentCreation: (fields) =>
    set((state) => ({
      currentCreation: { ...state.currentCreation, ...fields }
    })),

  updateGlobalSettings: (fields) =>
    set((state) => ({
      globalSettings: { ...state.globalSettings, ...fields },
      activeNotification: "Branding & API credentials updated successfully!"
    })),

  addQuestionTypeRow: () =>
    set((state) => {
      const id = `row-${Date.now()}`;
      const defaultTypes = [
        "Multiple Choice Questions",
        "Short Questions",
        "Long Questions",
        "Diagram/Graph-Based Questions",
        "Numerical Problems"
      ];
      const existingTypes = state.currentCreation.questionTypes.map((t) => t.type);
      const availableType = defaultTypes.find((t) => !existingTypes.includes(t)) || "Long Questions";

      return {
        currentCreation: {
          ...state.currentCreation,
          questionTypes: [
            ...state.currentCreation.questionTypes,
            { id, type: availableType, count: 5, marks: 5 }
          ]
        }
      };
    }),

  removeQuestionTypeRow: (id) =>
    set((state) => ({
      currentCreation: {
        ...state.currentCreation,
        questionTypes: state.currentCreation.questionTypes.filter((r) => r.id !== id)
      }
    })),

  updateQuestionTypeRow: (id, fields) =>
    set((state) => ({
      currentCreation: {
        ...state.currentCreation,
        questionTypes: state.currentCreation.questionTypes.map((row) =>
          row.id === id ? { ...row, ...fields } : row
        )
      }
    })),

  dismissNotification: () => set({ activeNotification: null }),

  triggerGeneration: async (onComplete) => {
    const { isLiveBackend, currentCreation, socketClient, globalSettings } = get();

    if (isLiveBackend && socketClient) {
      // FULL-STACK LIVE REST & WEBSOCKET PROGRESS FLOW
      try {
        set({
          isGenerating: true,
          generationProgress: 0,
          generationStep: "Express API Handshake initiated..."
        });

        // 1. Send REST creation request with credentials and school tags
        const response = await fetch(`${BACKEND_URL}/api/assignments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: currentCreation.title,
            subject: currentCreation.subject,
            classLevel: currentCreation.classLevel,
            dueDate: currentCreation.dueDate,
            questionTypes: currentCreation.questionTypes.map((q) => ({
              type: q.type,
              count: q.count,
              marks: q.marks
            })),
            additionalInstructions: currentCreation.additionalInstructions,
            fileName: currentCreation.fileName,
            schoolName: `${globalSettings.schoolName}, ${globalSettings.schoolRegion}`,
            geminiApiKey: globalSettings.geminiApiKey
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.errors ? errData.errors.join(", ") : "REST Submit failed");
        }

        const jobData = await response.json();
        const jobId = jobData.jobId;

        // 2. Subscribe to this specific Job's WebSocket room
        socketClient.emit("join-job", jobId);
        console.log(`[WebSocket Room] Subscribed to broadcasts for job: ${jobId}`);

        // 3. Bind WebSocket job listener
        socketClient.off("job-progress"); // clear prior
        socketClient.on("job-progress", (progressPayload: { jobId: string; progress: number; step: string }) => {
          if (progressPayload.jobId !== jobId) return;
          
          if (progressPayload.progress === 101) {
            // Success flag payload carries the newly generated DB document ID!
            socketClient.off("job-progress");
            
            // Sync dashboard records and finish
            get().fetchAssignments().then(() => {
              set({
                isGenerating: false,
                activeNotification: "Assessment created successfully by VedaAI on MongoDB!"
              });
              onComplete(progressPayload.step); // redirects to newly fetched assignment ID
            });
          } else if (progressPayload.progress === -1) {
            // Failure flag
            socketClient.off("job-progress");
            set({
              isGenerating: false,
              activeNotification: `Worker Error: ${progressPayload.step}`
            });
          } else {
            // General progress tick
            set({
              generationProgress: progressPayload.progress,
              generationStep: progressPayload.step
            });
          }
        });

      } catch (err: any) {
        console.error("[Store Generation Error] Full-stack trigger failed:", err);
        set({
          isGenerating: false,
          activeNotification: `Generation Failed: ${err?.message || err}`
        });
      }
    } else {
      // OFFLINE HIGH-FIDELITY FALLBACK FLOW
      set({
        isGenerating: true,
        generationProgress: 0,
        generationStep: "Local Queue Manager Initiated (BullMQ offline)..."
      });

      const totalQs = currentCreation.questionTypes.reduce((acc, r) => acc + r.count, 0);
      const totalMks = currentCreation.questionTypes.reduce((acc, r) => acc + (r.count * r.marks), 0);

      const steps = [
        { progress: 15, step: "Mock WebSockets: Job enrolled in memory queue buffer." },
        { progress: 40, step: "Dumping templates & compiling procedural content pools..." },
        { progress: 65, step: "Generating Sections A, B & calculating difficulties..." },
        { progress: 85, step: "Assembling question papers & solutions key..." },
        { progress: 100, step: "Success! Saving assignment locally." }
      ];

      let currentStepIndex = 0;

      const interval = setInterval(() => {
        if (currentStepIndex < steps.length) {
          const current = steps[currentStepIndex];
          set({
            generationProgress: current.progress,
            generationStep: current.step
          });
          currentStepIndex++;
        } else {
          clearInterval(interval);
          
          const generatedId = `offline-${Date.now()}`;
          const newTitle = currentCreation.title || `Local Assessment on ${currentCreation.subject}`;

          const sections: Section[] = currentCreation.questionTypes.map((qType, idx) => {
            const char = String.fromCharCode(65 + idx);
            const difficultyList: ("Easy" | "Moderate" | "Challenging")[] = ["Easy", "Moderate", "Challenging"];
            
            const questionsList: Question[] = Array.from({ length: qType.count }).map((_, qIdx) => ({
              id: `q-${generatedId}-${idx}-${qIdx}`,
              text: `Conceptual study guide item checking ${qType.type.toLowerCase().slice(0, -1)} parameters in ${currentCreation.subject}. Outline active formulas.`,
              difficulty: difficultyList[qIdx % 3],
              marks: qType.marks
            }));

            return {
              id: `sec-${generatedId}-${idx}`,
              title: `Section ${char}`,
              instruction: `${qType.type}. Attempt all questions. Each question carries ${qType.marks} marks.`,
              questions: questionsList
            };
          });

          const answerKey: AnswerKeyItem[] = [];
          let globalQIdx = 1;
          sections.forEach((sec) => {
            sec.questions.forEach((q) => {
              answerKey.push({
                id: `ans-${q.id}`,
                questionNumber: globalQIdx++,
                answer: `Suggested offline response model detailing standard grading benchmarks for CBSE ${currentCreation.subject} rules.`
              });
            });
          });

          const newAssignment: Assignment = {
            id: generatedId,
            title: newTitle,
            subject: currentCreation.subject,
            classLevel: currentCreation.classLevel,
            assignedDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            dueDate: currentCreation.dueDate || new Date(Date.now() + 86400000).toLocaleDateString("en-GB").replace(/\//g, "-"),
            totalQuestions: totalQs,
            totalMarks: totalMks,
            timeAllowed: "1 hour 30 minutes",
            schoolName: `${globalSettings.schoolName}, ${globalSettings.schoolRegion}`,
            generalInstructions: currentCreation.additionalInstructions || "All sections are compulsory.",
            sections,
            answerKey,
            sourceFile: currentCreation.fileName || undefined,
            additionalInfo: currentCreation.additionalInstructions || undefined
          };

          set((state) => ({
            assignments: [newAssignment, ...state.assignments],
            isGenerating: false,
            activeNotification: "Assessment created locally!"
          }));

          onComplete(generatedId);
        }
      }, 700);
    }
  }
}));
