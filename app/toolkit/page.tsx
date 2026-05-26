"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";
import { Sparkles, Map, FileSpreadsheet, ClipboardCheck, BookOpen, Brain, Loader2, X, Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ToolkitItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  actionText: string;
  mockPrompt: string;
  mockResponse: string;
}

export default function ToolkitPage() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<ToolkitItem | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState("");
  const [compilingProgress, setCompilingProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const tools: ToolkitItem[] = [
    {
      id: "tool-1",
      name: "Curriculum Blueprint Mapper",
      description: "Generates aligned NCERT lesson blueprints and chapters mappings according to CBSE standards.",
      icon: Map,
      iconColor: "text-orange-500 bg-orange-50 border-orange-100",
      actionText: "Generate Lesson Map",
      mockPrompt: "Compile an active 4-week lesson blueprint on Chemical Effects of Electric Current for CBSE Grade 8.",
      mockResponse: "### CBSE Grade 8 Science - Chemical Effects of Current Blueprint\n\n**Week 1: Fundamentals of Conductance**\n- Core target: Mobile ions vs solid lattices\n- Lab exercise: Acidified water electrical runs\n- Quiz weightage: 5% (1 Mark MCQ)\n\n**Week 2: Electrolysis Processes**\n- Core target: Cathode reductions, anode oxidation\n- Lab exercise: Copper deposition rates\n- Quiz weightage: 15% (Short/Numerical)\n\n**Week 3: Electroplating Applications**\n- Core target: Chromium plating, corrosion resistance\n- Lab exercise: Nickel plating coins\n- Quiz weightage: 20% (Diagram-based)\n\n**Week 4: Revision & Board Ingests**\n- NCERT review and past boards solving runs."
    },
    {
      id: "tool-2",
      name: "Standard Rubric Compiler",
      description: "Establishes precise grading matrices, scoring benchmarks, and answer schema weightages based on marks allotments.",
      icon: ClipboardCheck,
      iconColor: "text-blue-500 bg-blue-50 border-blue-100",
      actionText: "Compile Grading Rubric",
      mockPrompt: "Establish a 5-mark grading rubric evaluating electrolysis redox equations.",
      mockResponse: "### CBSE Grading Rubric - Electrolysis Redox Equations (5 Marks Max)\n\n- **Score 5 (Outstanding):** Correct molecular equations for both Cathode (reduction) and Anode (oxidation), correctly balanced with electron counts, and labeled states (aq, g).\n- **Score 4 (Excellent):** Balanced redox equations with minor formatting or state-labeling omissions.\n- **Score 3 (Competent):** Correct chemical formulas for reactants and products but equations are unbalanced or electron additions are missing.\n- **Score 2 (Developing):** Correctly identifies Cathode and Anode gases but cannot write matching molecular equations.\n- **Score 1 (Beginning):** Minimal conceptual understanding; states names of electrodes only."
    },
    {
      id: "tool-3",
      name: "Remedial Worksheet Builder",
      description: "Creates tailored study notes, conceptual definitions, and practice lists to support struggling students.",
      icon: BookOpen,
      iconColor: "text-emerald-500 bg-emerald-50 border-emerald-100",
      actionText: "Draft Remedial Cards",
      mockPrompt: "Generate simplified practice worksheets on abstract nouns for Class 5 English.",
      mockResponse: "### Remedial Practice: Abstract Nouns (Class 5 English)\n\n**Concept Card: What is an Abstract Noun?**\nAn abstract noun is a word for something that you cannot see, hear, touch, taste, or smell. It represents an *idea*, a *feeling*, or a *quality* (like happiness, anger, or courage).\n\n**Practice Activity 1: Spot the Abstract Noun**\nIdentify the abstract noun in these sentences:\n1. 'DPS students showed great *honesty* during tests.' -> (Solution: Honesty)\n2. 'Her *friendship* meant everything to John.' -> (Solution: Friendship)\n3. 'We must face our *fears*.' -> (Solution: Fears)"
    },
    {
      id: "tool-4",
      name: "Class Forecast Predictor",
      description: "Inputs roster scores and projects future CBSE grade distributions using statistical vector forecasts.",
      icon: FileSpreadsheet,
      iconColor: "text-purple-500 bg-purple-50 border-purple-100",
      actionText: "Forecast Score Vectors",
      mockPrompt: "Analyze class score averages: science midterm is 72/100.",
      mockResponse: "### Class Score Projection Vector Analytics\n\n**Current Metrics:**\n- Sample size: 38 students\n- Midterm Average: 72%\n- Variance: 12.4\n\n**Projections for CBSE Board Exams:**\n- Expected Class Average: 78.4% (Projected increase due to active remedial worksheets integration)\n- Projected Grade A1 (>91%): 8 Students\n- Projected Grade A2 (81-90%): 12 Students\n- Projected Grade B1 (71-80%): 14 Students\n- Remedial target group (<60%): 4 Students (High recommendations to run Worksheet Builder on Electricity)."
    }
  ];

  const handleLaunchTool = (tool: ToolkitItem) => {
    setActiveTool(tool);
    setIsCompiling(true);
    setCompilingProgress(0);
    setShowResult(false);

    const steps = [
      { progress: 20, step: "Handshaking with VedaAI Cognitive Engine..." },
      { progress: 50, step: "Parsing NCERT structural curriculum guidelines..." },
      { progress: 85, step: "Compiling structured outputs and layouts key..." },
      { progress: 100, step: "Successfully compiled!" }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setCompilingProgress(steps[stepIdx].progress);
        setCompilingStep(steps[stepIdx].step);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
        setShowResult(true);
      }
    }, 700);
  };

  return (
    <>
      {/* DESKTOP VIEW (md and up) */}
      <div className="hidden md:flex h-screen overflow-hidden text-gray-800 font-sans bg-[#f1f2f4]">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Panel */}
        <main className="flex-1 flex flex-col min-w-0" data-purpose="main-content">
          {/* Top Header */}
          <Header />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col relative scrollbar-hide">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3" data-purpose="page-header">
              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(240,90,40,0.6)]"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Teacher's Toolkit</h1>
                <p className="text-xs text-gray-400 font-medium">Deploy cognitive agents to assist with lessons planning and grade evaluations.</p>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-24">
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${t.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-gray-800 tracking-tight group-hover:text-orange-500 transition-colors">
                          {t.name}
                        </h2>
                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">VedaAI Agent Active</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-1 font-medium">
                      {t.description}
                    </p>

                    <button
                      onClick={() => handleLaunchTool(t)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-[#2d333b] hover:text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                    >
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      {t.actionText}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* AI Compiler Modal */}
            {activeTool && (
              <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in no-print">
                <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-orange-500 animate-pulse" />
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                        {activeTool.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTool(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* COMPILING STATE */}
                  {isCompiling && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                      <p className="text-xs font-bold text-gray-800 mb-1">{compilingStep}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-4 max-w-xs overflow-hidden">
                        <div
                          className="bg-orange-500 h-full transition-all duration-300"
                          style={{ width: `${compilingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* RESULT STATE */}
                  {showResult && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Prompt Compiled:</p>
                        <p className="text-xs text-gray-700 italic leading-relaxed font-semibold">
                          "{activeTool.mockPrompt}"
                        </p>
                      </div>

                      <div className="bg-gray-950 text-gray-200 rounded-2xl p-4 font-mono text-[11px] h-60 overflow-y-auto scrollbar-hide border border-gray-800 space-y-2 whitespace-pre-wrap leading-relaxed">
                        {activeTool.mockResponse}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setActiveTool(null)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 px-4 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            alert("PDF downloaded successfully!");
                            setActiveTool(null);
                          }}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          Download Document
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE VIEW (under md) */}
      <div className="block md:hidden min-h-screen bg-gray-100 text-gray-900 antialiased font-sans overflow-x-hidden relative pb-32">
        {/* Top Header Navigation */}
        <header className="bg-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-gray-200/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 bg-[#EFEFEF] rounded-full flex items-center justify-center hover:bg-gray-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-gray-800" />
            </button>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">VedaAI</span>
          </div>
          <div className="flex items-center gap-3">
            <img alt="User Profile" className="w-7.5 h-7.5 rounded-full object-cover border border-gray-250 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH7ehtX5DiQIQ3F1diZbq35PC2anGoFEYkxJ-IIvJUnpqkaBxYVpKvk7kvta4eJCARpvd0yEWz4HC07ty3NYy9Ip56KlJzFyvVdgHt3eOdnZDpoOWmPEJrkOi5wL6oKttI7qygH0iVME9DNxRkev_-rxpysejmpPXjFIuIDpOT4PJle47ddjx7uEjRDjbDUFrgvHGJ1OUSZI4VPDpU_X9yDOwZt44voYIuhzSNQ6Roz9-xaDUvcDbQWT4x5-qDeI8YtTCgoVKOuyFb"/>
          </div>
        </header>

        <main className="p-4">
          <div className="mb-5">
            <h1 className="font-extrabold text-xl mb-1 text-gray-900 tracking-tight">AI Teacher's Toolkit</h1>
            <p className="text-gray-500 text-xs font-semibold">Deploy cognitive agents for lesson blueprints</p>
          </div>

          {/* Tools List */}
          <div className="space-y-4">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/50 flex flex-col relative"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${t.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-extrabold text-gray-800 tracking-tight">
                        {t.name}
                      </h2>
                      <p className="text-[8px] text-orange-500 font-extrabold uppercase mt-0.5">Agent Active</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4 font-semibold">
                    {t.description}
                  </p>

                  <button
                    onClick={() => handleLaunchTool(t)}
                    className="w-full bg-[#1C1C1E] text-white hover:bg-gray-800 rounded-xl py-2.5 px-4 text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    {t.actionText}
                  </button>
                </div>
              );
            })}
          </div>
        </main>

        {/* AI Compiler Modal (Mobile optimized) */}
        {activeTool && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in no-print">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-gray-150 animate-scale-in">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                    {activeTool.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTool(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* COMPILING STATE */}
              {isCompiling && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
                  <p className="text-[11px] font-bold text-gray-800 mb-1">{compilingStep}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 max-w-[200px] overflow-hidden">
                    <div
                      className="bg-orange-500 h-full transition-all duration-300"
                      style={{ width: `${compilingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* RESULT STATE */}
              {showResult && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-150">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Prompt Compiled:</p>
                    <p className="text-[11px] text-gray-700 italic leading-snug font-semibold">
                      "{activeTool.mockPrompt}"
                    </p>
                  </div>

                  <div className="bg-gray-950 text-gray-200 rounded-xl p-3 font-mono text-[10px] h-48 overflow-y-auto scrollbar-hide border border-gray-800 space-y-1.5 whitespace-pre-wrap leading-relaxed">
                    {activeTool.mockResponse}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setActiveTool(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-250 text-gray-700 rounded-xl py-2 px-3 text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        alert("PDF downloaded successfully!");
                        setActiveTool(null);
                      }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 px-3 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation spacer */}
        <div className="h-20"></div>

        {/* Dark Bottom Navigation Bar */}
        <nav className="fixed bottom-4 left-4 right-4 bg-[#1C1C1E] text-gray-400 rounded-[32px] py-4 px-6 flex justify-between items-center z-30 shadow-2xl">
          <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 hover:text-white cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 hover:text-white cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-4V7h4v5zm4 0h-2V7h2v5z"></path>
            </svg>
            <span className="text-[10px] font-medium">Assignments</span>
          </button>
          <button onClick={() => router.push("/library")} className="flex flex-col items-center gap-1 hover:text-white cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-medium">Library</span>
          </button>
          <button onClick={() => router.push("/toolkit")} className="flex flex-col items-center gap-1 text-white relative cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-bold">AI Toolkit</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
          </button>
        </nav>
      </div>
    </>
  );
}
