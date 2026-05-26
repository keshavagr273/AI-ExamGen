"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SimulatedSocket from "@/components/SimulatedSocket";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Download,
  Eye,
  EyeOff,
  Wand2,
  FileText,
  AlertCircle,
  X,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function PreviewAssignment() {
  const params = useParams();
  const router = useRouter();
  const assignments = useAssignmentStore((state) => state.assignments);
  const triggerGeneration = useAssignmentStore((state) => state.triggerGeneration);
  const updateCurrentCreation = useAssignmentStore((state) => state.updateCurrentCreation);
  const activeNotification = useAssignmentStore((state) => state.activeNotification);
  const dismissNotification = useAssignmentStore((state) => state.dismissNotification);

  const id = params.id as string;
  const assignment = assignments.find((a) => a.id === id);

  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // If no matching assignment, display error state
  if (!assignment) {
    return (
      <div className="flex h-screen overflow-hidden text-gray-800 font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col" data-purpose="main-content">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[#f1f2f4]">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Assignment Not Found
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              The requested assessment id does not match any current records.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#2d333b] hover:bg-gray-800 text-white rounded-full py-2.5 px-6 text-xs font-semibold shadow-md transitioncursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Handle Dynamic Regenerate Simulation
  const handleRegenerate = () => {
    setIsRegenerating(true);

    // Extract questions mapping to populate matrix
    const questionTypes = assignment.sections.map((sec, idx) => {
      // Deconstruct standard titles/instructions
      let type = sec.instruction;
      type = type.replace(/\.\s*Attempt\s+all\s+questions\.*$/gi, "");
      type = type.replace(/\.\s*Each\s+question\s+carries.*$/gi, "");
      type = type.trim();
      if (!type) {
        type = "Short Questions";
      }

      const count = sec.questions.length;
      const marks = sec.questions[0]?.marks || 2;

      return {
        id: `row-${idx}-${Date.now()}`,
        type,
        count,
        marks
      };
    });

    // Populate Zustand store creation model
    updateCurrentCreation({
      title: assignment.title,
      subject: assignment.subject,
      classLevel: assignment.classLevel,
      fileName: assignment.sourceFile || "",
      dueDate: assignment.dueDate,
      questionTypes: questionTypes.length > 0 ? questionTypes : [
        { id: "row-1", type: "Multiple Choice Questions", count: 4, marks: 1 },
        { id: "row-2", type: "Short Questions", count: 3, marks: 2 }
      ],
      additionalInstructions: assignment.generalInstructions || ""
    });

    // Sync school name branding back to school input variables
    let schoolNameVal = "Delhi Public School";
    let schoolRegionVal = "Bokaro Steel City";
    if (assignment.schoolName && assignment.schoolName.includes(",")) {
      const parts = assignment.schoolName.split(",");
      schoolNameVal = parts[0].trim();
      schoolRegionVal = parts.slice(1).join(",").trim();
    } else if (assignment.schoolName) {
      schoolNameVal = assignment.schoolName;
    }

    useAssignmentStore.setState((state) => ({
      globalSettings: {
        ...state.globalSettings,
        schoolName: schoolNameVal,
        schoolRegion: schoolRegionVal
      }
    }));

    triggerGeneration((newId) => {
      setIsRegenerating(false);
      router.push(`/preview/${newId}`);
    });
  };

  // Trigger high-fidelity browser PDF dialog
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <>
      {/* DESKTOP VIEW (md and up) */}
      <div className="hidden md:flex h-screen overflow-hidden text-gray-800 font-sans">
        {/* WebSocket Ingestion Modal */}
        <SimulatedSocket />

        {/* Dynamic Alerts Banner */}
        {activeNotification && (
          <div className="fixed top-6 right-6 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl z-40 border border-gray-800 flex items-center gap-3 animate-slide-in text-xs font-bold no-print">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
            <span>{activeNotification}</span>
            <button
              onClick={dismissNotification}
              className="text-gray-400 hover:text-white transition cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Panel */}
        <main className="flex-1 flex flex-col min-w-0 mr-0 md:mr-4 my-0 md:my-4" data-purpose="main-content">
          {/* Top Header */}
          <Header />

          {/* Scrollable Content Area */}
          <div
            className="flex-1 overflow-y-auto bg-gray-50 rounded-b-xl border-t border-gray-100 p-6 scrollbar-hide relative shadow-inner"
            data-purpose="scrollable-content"
          >
            <div className="max-w-4xl mx-auto">
              {/* AI Response Notification Banner - exact recreation */}
              <div
                className="bg-[#374151] text-white p-5 rounded-t-2xl shadow-md border-b border-gray-600 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print"
                data-purpose="ai-banner"
              >
                <div className="flex items-start gap-2.5 max-w-xl">
                  <Sparkles className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5 animate-pulse" />
                  <p className="font-medium text-xs leading-relaxed text-gray-200">
                    Certainly! Here is your customized{" "}
                    <span className="font-bold underline decoration-white/50 underline-offset-2 text-white">
                      Question Paper
                    </span>{" "}
                    for Grade {assignment.classLevel.replace("Class ", "")} {assignment.subject} CBSE classes on the requested
                    chapters.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white border border-gray-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    <Wand2 className="w-4 h-4 text-orange-400 shrink-0" />
                    {isRegenerating ? "Generating..." : "Regenerate"}
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-white text-gray-900 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer shrink-0 border border-gray-200"
                  >
                    <Printer className="w-4 h-4 text-gray-500 shrink-0" />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Exam Question Paper Sheet - exact recreation */}
              <div
                className="bg-white p-10 md:p-14 rounded-b-2xl shadow-lg border border-gray-200"
                data-purpose="question-paper"
              >
                {/* Paper Header letterhead */}
                <div
                  className="text-center mb-8 border-b border-gray-200 pb-6"
                  data-purpose="paper-header"
                >
                  <h1 className="text-xl font-black text-gray-900 mb-1 tracking-tight">
                    {assignment.schoolName}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                    <span>Subject: {assignment.subject}</span>
                    <span>•</span>
                    <span>Class: {assignment.classLevel}</span>
                  </div>
                </div>

                {/* Paper Metadata row */}
                <div
                  className="flex justify-between items-end mb-6 text-xs font-bold text-gray-900 border-b border-gray-50 pb-3"
                  data-purpose="paper-meta"
                >
                  <div>Time Allowed: {assignment.timeAllowed}</div>
                  <div>Maximum Marks: {assignment.totalMarks}</div>
                </div>

                {/* General Instructions */}
                <div className="mb-8" data-purpose="general-instructions">
                  <p className="text-xs font-bold text-gray-900 mb-1">
                    General Instructions:
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    {assignment.generalInstructions}
                  </p>
                </div>

                {/* Student Details Fields - input lines recreated */}
                <div
                  className="space-y-4 mb-10 text-xs text-gray-800"
                  data-purpose="student-details"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[90px]">
                      Student Name:
                    </span>
                    <div className="border-b border-gray-300 flex-1 max-w-[250px] h-4"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[90px]">
                      Roll Number:
                    </span>
                    <div className="border-b border-gray-300 flex-1 max-w-[250px] h-4"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[90px]">
                      Class &amp; Section:
                    </span>
                    <span className="font-medium text-gray-500">
                      {assignment.classLevel} Section:
                    </span>
                    <div className="border-b border-gray-300 flex-1 max-w-[120px] h-4"></div>
                  </div>
                </div>

                {/* Loop through Syllabus Sections */}
                <div className="space-y-10">
                  {assignment.sections.map((section, secIdx) => (
                    <div key={section.id} data-purpose={`section-${secIdx}`}>
                      <h4 className="text-center font-black text-sm uppercase tracking-wider mb-6 text-gray-900 border-y border-gray-100 py-2 bg-gray-50/50">
                        {section.title}
                      </h4>
                      <div className="mb-5">
                        <p className="italic text-gray-500 text-xs">
                          {section.instruction}
                        </p>
                      </div>

                      <ol
                        className="list-decimal list-outside ml-5 space-y-5 text-xs text-gray-800 leading-relaxed"
                        data-purpose="question-list"
                      >
                        {section.questions.map((question) => {
                          // Color code difficulties beautifully
                          let difficultyStyle =
                            "bg-green-50 text-green-700 border-green-200";
                          if (question.difficulty === "Moderate") {
                            difficultyStyle =
                              "bg-amber-50 text-amber-700 border-amber-200";
                          } else if (question.difficulty === "Challenging") {
                            difficultyStyle =
                              "bg-red-50 text-red-700 border-red-200";
                          }

                          return (
                            <li key={question.id} className="pl-2">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                <span className="flex-1 font-medium text-gray-800">
                                  {question.text}
                                </span>
                                <div className="flex items-center gap-2 shrink-0 no-print">
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${difficultyStyle}`}
                                  >
                                    {question.difficulty}
                                  </span>
                                  <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    {question.marks} Marks
                                  </span>
                                </div>
                                {/* Printed-only mark indicator */}
                                <span className="hidden print:inline font-bold shrink-0 text-gray-500 whitespace-nowrap ml-2">
                                  [{question.marks} Marks]
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ))}
                </div>

                {/* End Of Paper Indicator */}
                <div className="text-center border-t border-gray-150 pt-8 mt-12">
                  <p className="font-bold text-xs uppercase tracking-widest text-gray-400">
                    --- End of Question Paper ---
                  </p>
                </div>

                {/* Collapsible Answer Key Module */}
                {assignment.answerKey && assignment.answerKey.length > 0 && (
                  <div className="mt-14 border-t-2 border-dashed border-gray-200 pt-8 no-print">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-black text-sm text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                        <FileText className="w-4 h-4 text-orange-500" />
                        Assessment Answer Key &amp; Solutions
                      </h4>
                      <button
                        onClick={() => setShowAnswerKey(!showAnswerKey)}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {showAnswerKey ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            Hide Solutions
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            Reveal Solutions
                          </>
                        )}
                      </button>
                    </div>

                    {showAnswerKey && (
                      <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-150 animate-fade-in space-y-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                          Suggested Answers for Grading:
                        </p>
                        <ol className="list-decimal list-outside ml-5 space-y-4 text-xs text-gray-600 leading-relaxed">
                          {assignment.answerKey.map((keyItem) => (
                            <li key={keyItem.id} className="pl-2">
                              <span className="font-bold text-gray-900 block mb-1">
                                Question {keyItem.questionNumber} Solution Model:
                              </span>
                              <span className="text-gray-600 font-medium block">
                                {keyItem.answer}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE VIEW (under md) */}
      <div className="block md:hidden min-h-screen bg-gray-100 text-gray-900 antialiased font-sans overflow-x-hidden relative pb-32">
        {/* WebSocket Ingestion Modal */}
        <SimulatedSocket />

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
            <button className="relative p-2 text-gray-600 hover:text-black transition">
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
            </button>
            <img alt="User Profile" className="w-7.5 h-7.5 rounded-full object-cover border border-gray-250 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH7ehtX5DiQIQ3F1diZbq35PC2anGoFEYkxJ-IIvJUnpqkaBxYVpKvk7kvta4eJCARpvd0yEWz4HC07ty3NYy9Ip56KlJzFyvVdgHt3eOdnZDpoOWmPEJrkOi5wL6oKttI7qygH0iVME9DNxRkev_-rxpysejmpPXjFIuIDpOT4PJle47ddjx7uEjRDjbDUFrgvHGJ1OUSZI4VPDpU_X9yDOwZt44voYIuhzSNQ6Roz9-xaDUvcDbQWT4x5-qDeI8YtTCgoVKOuyFb"/>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4">
          {/* AI Message Card */}
          <div className="bg-[#2a2a2a] rounded-3xl p-5 mb-6 text-white shadow-md relative overflow-hidden">
            <div className="flex items-start gap-2.5 max-w-xl z-10 relative">
              <Sparkles className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5 animate-pulse" />
              <p className="font-semibold text-xs leading-relaxed text-gray-200">
                Certainly! Here is your customized{" "}
                <span className="font-bold underline decoration-white/50 underline-offset-2 text-white">
                  Question Paper
                </span>{" "}
                for Grade {assignment.classLevel.replace("Class ", "")} {assignment.subject} CBSE classes on the requested
                chapters.
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 z-10 relative">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-gray-600 disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                {isRegenerating ? "Generating..." : "Regenerate"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-white text-gray-900 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-gray-250 shrink-0"
              >
                <Printer className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                Download PDF
              </button>
            </div>
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#2a2a2a] to-transparent pointer-events-none"></div>
          </div>

          {/* Exam Question Paper Card */}
          <div className="bg-[#f8f9fa] rounded-3xl pt-8 pb-12 px-5 shadow-sm border border-gray-200/60 min-h-[500px]">
            {/* Paper Header letterhead */}
            <div className="text-center mb-8 border-b border-gray-200 pb-5">
              <h1 className="text-base font-extrabold text-gray-900 mb-1 leading-tight">
                {assignment.schoolName}
              </h1>
              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-700 mt-1.5">
                <span>Subject: {assignment.subject}</span>
                <span>•</span>
                <span>Class: {assignment.classLevel}</span>
              </div>
            </div>

            {/* Paper Metadata row */}
            <div className="flex justify-between items-end mb-5 text-[11px] font-bold text-gray-900 border-b border-gray-100 pb-3">
              <div>Time Allowed: {assignment.timeAllowed}</div>
              <div>Maximum Marks: {assignment.totalMarks}</div>
            </div>

            {/* General Instructions */}
            <div className="mb-6">
              <p className="text-[11px] font-bold text-gray-900 mb-1">
                General Instructions:
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed italic">
                {assignment.generalInstructions}
              </p>
            </div>

            {/* Student Details Fields */}
            <div className="space-y-3 mb-8 text-[11px] text-gray-800">
              <div className="flex items-center gap-2">
                <span className="font-bold min-w-[80px]">Student Name:</span>
                <div className="border-b border-gray-350 flex-1 max-w-[200px] h-3.5"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold min-w-[80px]">Roll Number:</span>
                <div className="border-b border-gray-350 flex-1 max-w-[200px] h-3.5"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold min-w-[80px]">Class &amp; Sec:</span>
                <span className="font-semibold text-gray-500">
                  {assignment.classLevel} Sec:
                </span>
                <div className="border-b border-gray-350 flex-1 max-w-[100px] h-3.5"></div>
              </div>
            </div>

            {/* Syllabus Sections */}
            <div className="space-y-8">
              {assignment.sections.map((section, secIdx) => (
                <div key={section.id}>
                  <h4 className="text-center font-extrabold text-[12px] uppercase tracking-wider mb-4 text-gray-900 border-y border-gray-200/60 py-2 bg-gray-100/40">
                    {section.title}
                  </h4>
                  <div className="mb-4">
                    <p className="italic text-gray-500 text-[11px]">
                      {section.instruction}
                    </p>
                  </div>

                  <ol className="list-decimal list-outside ml-4 space-y-4 text-[12px] text-gray-800 leading-relaxed">
                    {section.questions.map((question) => {
                      let difficultyStyle = "bg-green-50 text-green-700 border-green-200";
                      if (question.difficulty === "Moderate") {
                        difficultyStyle = "bg-amber-50 text-amber-700 border-amber-200";
                      } else if (question.difficulty === "Challenging") {
                        difficultyStyle = "bg-red-50 text-red-700 border-red-200";
                      }

                      return (
                        <li key={question.id} className="pl-1">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-800 leading-snug">
                              {question.text}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${difficultyStyle}`}>
                                {question.difficulty}
                              </span>
                              <span className="bg-gray-150 text-gray-600 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                {question.marks} Marks
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>

            {/* End Indicator */}
            <div className="text-center border-t border-gray-200 pt-6 mt-10">
              <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400">
                --- End of Question Paper ---
              </p>
            </div>

            {/* Collapsible Answer Key */}
            {assignment.answerKey && assignment.answerKey.length > 0 && (
              <div className="mt-10 border-t border-dashed border-gray-300 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-[12px] text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                    Suggested Answers
                  </h4>
                  <button
                    onClick={() => setShowAnswerKey(!showAnswerKey)}
                    className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {showAnswerKey ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        Reveal
                      </>
                    )}
                  </button>
                </div>

                {showAnswerKey && (
                  <div className="bg-gray-100/60 rounded-2xl p-4 border border-gray-200/50 animate-fade-in space-y-3">
                    <ol className="list-decimal list-outside ml-4 space-y-3 text-[11px] text-gray-600 leading-relaxed font-medium">
                      {assignment.answerKey.map((keyItem) => (
                        <li key={keyItem.id} className="pl-1">
                          <span className="font-extrabold text-gray-800 block mb-0.5">
                            Q{keyItem.questionNumber} Answer Model:
                          </span>
                          <span className="text-gray-650 block leading-snug">
                            {keyItem.answer}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

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
          <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 text-white relative cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-4V7h4v5zm4 0h-2V7h2v5z"></path>
            </svg>
            <span className="text-[10px] font-bold">Assignments</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
          </button>
          <button onClick={() => router.push("/library")} className="flex flex-col items-center gap-1 hover:text-white cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-medium">Library</span>
          </button>
          <button onClick={() => router.push("/toolkit")} className="flex flex-col items-center gap-1 hover:text-white cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-medium">AI Toolkit</span>
          </button>
        </nav>
      </div>
    </>
  );
}
