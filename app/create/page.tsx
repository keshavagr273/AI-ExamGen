"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SimulatedSocket from "@/components/SimulatedSocket";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Calendar,
  CloudLightning,
  CloudUpload,
  Plus,
  Trash2,
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function CreateAssignment() {
  const router = useRouter();
  const {
    currentCreation,
    updateCurrentCreation,
    addQuestionTypeRow,
    removeQuestionTypeRow,
    updateQuestionTypeRow,
    triggerGeneration,
  } = useAssignmentStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Validation States
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Compute live aggregates
  const totalQuestions = currentCreation.questionTypes.reduce(
    (acc, r) => acc + r.count,
    0
  );
  const totalMarks = currentCreation.questionTypes.reduce(
    (acc, r) => acc + r.count * r.marks,
    0
  );

  // Handle Drag-and-Drop Simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      updateCurrentCreation({ fileName: files[0].name });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      updateCurrentCreation({ fileName: files[0].name });
    }
  };

  // Mock Voice Recording Guidelines
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Append some mock voice text
      const mockText = "Generate a question paper targeting analytical skills and basic conceptual definitions. Ensure a balanced spread of easy and challenging items.";
      updateCurrentCreation({
        additionalInstructions: currentCreation.additionalInstructions
          ? `${currentCreation.additionalInstructions} ${mockText}`
          : mockText,
      });
    } else {
      setIsRecording(true);
    }
  };

  // Enforce Form Validations
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!currentCreation.title.trim()) {
      errors.title = "Assignment Title is required";
    }

    if (!currentCreation.dueDate.trim()) {
      errors.dueDate = "Due Date is required";
    } else {
      // Basic DD-MM-YYYY format validation or check if selected date
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(currentCreation.dueDate)) {
        errors.dueDate = "Enforce DD-MM-YYYY format (e.g. 21-06-2025)";
      }
    }

    if (currentCreation.questionTypes.length === 0) {
      errors.questionTypes = "At least one question type must be specified";
    }

    currentCreation.questionTypes.forEach((row) => {
      if (row.count <= 0) {
        errors.questionTypes = `Question count must be positive for ${row.type}`;
      }
      if (row.marks <= 0) {
        errors.questionTypes = `Question marks must be positive for ${row.type}`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Trigger real-time worker generation queue
  const handleGenerate = () => {
    if (!validateForm()) return;

    triggerGeneration((id) => {
      router.push(`/preview/${id}`);
    });
  };

  return (
    <>
      {/* DESKTOP VIEW (md and up) */}
      <div className="hidden md:flex h-screen overflow-hidden text-gray-800 font-sans">
        {/* WebSocket Ingestion Modal */}
        <SimulatedSocket />

        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Panel */}
        <main className="flex-1 ml-0 p-4 flex flex-col h-screen overflow-y-auto scrollbar-hide bg-[#f1f2f4]" data-purpose="main-content">
          {/* Top Header */}
          <Header />

          {/* Page Header */}
          <div className="mb-6 mt-4 px-4 shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Create Assignment
              </h1>
            </div>
            <p className="text-xs text-gray-400 ml-5 font-medium">
              Set up a new assignment and let VedaAI construct the question sheet.
            </p>
          </div>

          {/* Form Container */}
          <div className="flex-1 pb-32">
            <div
              className="bg-white rounded-3xl p-8 max-w-3xl mx-auto w-full shadow-sm border border-gray-100"
              data-purpose="form-card"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Assignment Details
              </h2>
              <p className="text-xs text-gray-400 mb-8 font-medium">
                Basic configurations and syllabus parameters.
              </p>

              {/* Title & Metadata row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-900 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    value={currentCreation.title}
                    onChange={(e) =>
                      updateCurrentCreation({ title: e.target.value })
                    }
                    placeholder="e.g. Assessment on Cells"
                    className={`w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium ${
                      formErrors.title ? "border-red-400" : ""
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-[10px] text-red-500 font-bold mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      value={currentCreation.subject}
                      onChange={(e) =>
                        updateCurrentCreation({ subject: e.target.value })
                      }
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none"
                    >
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Social Studies">Social Studies</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">
                    Grade / Class
                  </label>
                  <div className="relative">
                    <select
                      value={currentCreation.classLevel}
                      onChange={(e) =>
                        updateCurrentCreation({ classLevel: e.target.value })
                      }
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none"
                    >
                      <option value="Class 5">Class 5th</option>
                      <option value="Class 6">Class 6th</option>
                      <option value="Class 7">Class 7th</option>
                      <option value="Class 8">Class 8th</option>
                      <option value="Class 9">Class 9th</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center mb-6 transition cursor-pointer ${
                  isDragging
                    ? "border-orange-500 bg-orange-50/30"
                    : currentCreation.fileName
                    ? "border-green-300 bg-green-50/10"
                    : "border-gray-200 bg-gray-50/30 hover:bg-gray-50"
                }`}
                data-purpose="file-upload"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpeg,.jpg,.txt"
                  className="hidden"
                />
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 border border-gray-100">
                  <CloudUpload className={`w-5 h-5 ${currentCreation.fileName ? "text-green-500" : "text-gray-600"}`} />
                </div>
                {currentCreation.fileName ? (
                  <div>
                    <p className="text-xs font-bold text-green-600 mb-1">
                      File Uploaded Successfully!
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {currentCreation.fileName}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-gray-900 mb-0.5">
                      Choose a file or drag &amp; drop it here
                    </p>
                    <p className="text-[10px] text-gray-400">
                      PDF, TXT, JPEG, or PNG up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="mb-6" data-purpose="due-date">
                <label className="block text-xs font-bold text-gray-900 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentCreation.dueDate}
                    onChange={(e) =>
                      updateCurrentCreation({ dueDate: e.target.value })
                    }
                    placeholder="DD-MM-YYYY (e.g. 21-06-2025)"
                    className={`w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      formErrors.dueDate ? "border-red-400" : ""
                    }`}
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {formErrors.dueDate && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 animate-pulse">
                    {formErrors.dueDate}
                  </p>
                )}
              </div>

              {/* Question Types Matrix */}
              <div className="mb-6" data-purpose="question-types">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-bold text-gray-900">
                    Question Type Settings
                  </label>
                  <div className="flex gap-12 text-[10px] font-bold text-gray-400 pr-10">
                    <span>Questions</span>
                    <span className="pl-6">Marks / Q</span>
                  </div>
                </div>

                {formErrors.questionTypes && (
                  <p className="text-[10px] text-red-500 font-bold mb-3">
                    {formErrors.questionTypes}
                  </p>
                )}

                <div className="space-y-3">
                  {currentCreation.questionTypes.map((row) => (
                    <div key={row.id} className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <select
                          value={row.type}
                          onChange={(e) =>
                            updateQuestionTypeRow(row.id, { type: e.target.value })
                          }
                          className="w-full bg-white border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none shadow-sm"
                        >
                          <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                          <option value="Short Questions">Short Questions</option>
                          <option value="Long Questions">Long Questions</option>
                          <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                          <option value="Numerical Problems">Numerical Problems</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <button
                        onClick={() => removeQuestionTypeRow(row.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex gap-4 items-center pl-2 shrink-0">
                        {/* Count Adjuster */}
                        <div className="flex items-center bg-white border border-gray-100 rounded-full px-1 py-1 shadow-sm w-24 justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestionTypeRow(row.id, {
                                count: Math.max(1, row.count - 1),
                              })
                            }
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs">{row.count}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestionTypeRow(row.id, {
                                count: row.count + 1,
                              })
                            }
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer text-xs font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Marks Adjuster */}
                        <div className="flex items-center bg-white border border-gray-100 rounded-full px-1 py-1 shadow-sm w-24 justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestionTypeRow(row.id, {
                                marks: Math.max(1, row.marks - 1),
                              })
                            }
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs">{row.marks}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestionTypeRow(row.id, {
                                marks: row.marks + 1,
                              })
                            }
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add row & Totals row */}
                <div className="mt-4 flex justify-between items-center border-t border-gray-50 pt-4">
                  <button
                    type="button"
                    onClick={addQuestionTypeRow}
                    className="flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-orange-500 transition cursor-pointer"
                  >
                    <div className="w-5 h-5 bg-[#2d333b] text-white rounded-full flex items-center justify-center text-[10px]">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    Add Question Type
                  </button>
                  <div className="text-right text-[11px] text-gray-500 font-bold space-y-0.5">
                    <p>
                      Total Questions :{" "}
                      <span className="text-gray-900 text-sm font-black">
                        {totalQuestions}
                      </span>
                    </p>
                    <p>
                      Total Marks :{" "}
                      <span className="text-orange-600 text-sm font-black">
                        {totalMarks}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Guidelines */}
              <div data-purpose="additional-info" className="mb-4">
                <label className="block text-xs font-bold text-gray-900 mb-2">
                  Additional Instructions (Syllabus guidelines)
                </label>
                <div className="relative">
                  <textarea
                    value={currentCreation.additionalInstructions}
                    onChange={(e) =>
                      updateCurrentCreation({
                        additionalInstructions: e.target.value,
                      })
                    }
                    placeholder="e.g. Generate CBSE Level Class 8 questions. Include concepts from chemical electrolysis. Highlight industrial electroplating uses."
                    rows={4}
                    className="w-full bg-gray-50/40 border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-gray-300 resize-none"
                  ></textarea>
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center rounded-full shadow-sm cursor-pointer transition-all ${
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100"
                    }`}
                    title={isRecording ? "Stop Simulating Voice" : "Simulate Voice Prompt"}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                {isRecording && (
                  <p className="text-[10px] text-red-500 font-bold mt-1.5 animate-pulse flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                    Listening... Speak prompt instructions, then tap mic to end.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div
            className="fixed bottom-0 left-0 md:left-64 right-0 p-5 flex justify-between bg-gradient-to-t from-gray-100 via-gray-100/90 to-transparent pointer-events-none z-10 no-print"
            data-purpose="bottom-actions"
          >
            <div className="w-full max-w-3xl mx-auto flex justify-between pointer-events-auto">
              <button
                onClick={() => router.push("/")}
                className="bg-white text-gray-700 border border-gray-250 rounded-full py-2.5 px-6 flex items-center gap-2 text-xs font-semibold hover:bg-gray-50 shadow-sm transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="bg-[#2d333b] hover:bg-gray-800 text-white rounded-full py-2.5 px-6 flex items-center gap-2 text-xs font-semibold shadow-md transition hover:scale-102 cursor-pointer"
              >
                Generate Exam Paper
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE VIEW (under md) */}
      <div className="block md:hidden min-h-screen bg-gray-200 text-gray-900 antialiased font-sans overflow-x-hidden relative pb-32">
        {/* WebSocket Ingestion Modal */}
        <SimulatedSocket />

        {/* Top Header Navigation */}
        <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 text-white p-1 rounded font-black text-xs">V</div>
            <span className="font-bold text-lg text-gray-900">VedaAI</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <img alt="User Profile" className="w-8 h-8 rounded-full bg-gray-300 object-cover border border-gray-200 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAveLMHKiW4I49zLI7Pk6MptQov_PKHEvjt81lfUKb_47VoKlGypYZjg-tUJT0cMNf_GUK9DHpsWmEsgZlEZlofs5pkyTJ7lO83A_QC3Lj-CJtjhVVMrNiaHdzMhyVp6itmk1lFrPZojm1YX1g_wXK5S3XHub6zqFoEiQFS_d5Re-Cnkb2ZLGk44ZENpS852n_GL2HecMis4FIeJd49RVG57U0QprsyY1NQGi30Y_xaLjBrRvY_1YnrSZOI7radeq-AyZL7VqDHfwOQ"/>
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </header>

        {/* Page Inner Navigation */}
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-gray-900 border border-gray-100 cursor-pointer animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-semibold text-lg flex-1 text-center pr-10">Create Assignment</h1>
        </div>

        {/* Progress Stepper Line */}
        <div className="px-4 mb-6">
          <div className="h-1 bg-gray-300 rounded-full w-full overflow-hidden flex">
            <div className="h-full bg-gray-900 w-1/2"></div>
          </div>
        </div>

        {/* Core Form Card */}
        <div className="bg-gray-50 rounded-3xl mx-4 p-5 mb-6 shadow-sm border border-gray-200/50">
          <div className="mb-5">
            <h2 className="font-extrabold text-xl mb-1 text-gray-900 tracking-tight">Assignment Details</h2>
            <p className="text-gray-500 text-xs font-semibold">Basic configurations & parameters</p>
          </div>

          {/* Form Title Field */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-900 mb-2">Assignment Title</label>
            <input
              type="text"
              value={currentCreation.title}
              onChange={(e) => updateCurrentCreation({ title: e.target.value })}
              placeholder="e.g. Assessment on Cells"
              className={`w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-950 ${
                formErrors.title ? "border-red-400" : ""
              }`}
            />
            {formErrors.title && (
              <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Subject Dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-900 mb-2">Subject</label>
            <select
              value={currentCreation.subject}
              onChange={(e) => updateCurrentCreation({ subject: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-950/10"
            >
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Social Studies">Social Studies</option>
            </select>
          </div>

          {/* Class Dropdown */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-900 mb-2">Grade / Class</label>
            <select
              value={currentCreation.classLevel}
              onChange={(e) => updateCurrentCreation({ classLevel: e.target.value })}
              className="w-full bg-white border border-gray-305 rounded-xl py-3 px-4 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-950/10"
            >
              <option value="Class 5">Class 5th</option>
              <option value="Class 6">Class 6th</option>
              <option value="Class 7">Class 7th</option>
              <option value="Class 8">Class 8th</option>
              <option value="Class 9">Class 9th</option>
            </select>
          </div>

          {/* File Upload simulator */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center mb-6 transition cursor-pointer bg-white ${
              currentCreation.fileName ? "border-green-300 bg-green-50/10" : "border-gray-300"
            }`}
          >
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-600">
              <CloudUpload className={`w-5 h-5 ${currentCreation.fileName ? "text-green-500" : "text-gray-600"}`} />
            </div>
            {currentCreation.fileName ? (
              <div>
                <p className="text-xs font-bold text-green-600 mb-1">File Uploaded!</p>
                <p className="text-[9px] text-gray-500 font-mono">{currentCreation.fileName}</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-gray-900 text-xs mb-1">Choose a file or drag &amp; drop it here</p>
                <p className="text-[10px] text-gray-500 mb-4">PDF, PNG, or JPEG up to 10MB</p>
                <button className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Due Date picker */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-900 mb-2">Due Date</label>
            <div className="relative">
              <input
                type="text"
                value={currentCreation.dueDate}
                onChange={(e) => updateCurrentCreation({ dueDate: e.target.value })}
                placeholder="DD-MM-YYYY (e.g. 21-06-2025)"
                className={`w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 ${
                  formErrors.dueDate ? "border-red-400" : ""
                }`}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
            {formErrors.dueDate && (
              <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors.dueDate}</p>
            )}
          </div>

          {/* Question Type settings cards */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-900 mb-4">Question Type Settings</label>
            {formErrors.questionTypes && (
              <p className="text-[10px] text-red-500 font-bold mb-3">{formErrors.questionTypes}</p>
            )}

            <div className="space-y-4">
              {currentCreation.questionTypes.map((row) => (
                <div key={row.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/50">
                  <div className="flex justify-between items-center mb-3">
                    <select
                      value={row.type}
                      onChange={(e) => updateQuestionTypeRow(row.id, { type: e.target.value })}
                      className="text-xs font-extrabold text-gray-950 bg-transparent border-none p-0 focus:ring-0 cursor-pointer focus:outline-none"
                    >
                      <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                      <option value="Short Questions">Short Questions</option>
                      <option value="Long Questions">Long Questions</option>
                      <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                      <option value="Numerical Problems">Numerical Problems</option>
                    </select>
                    <button
                      onClick={() => removeQuestionTypeRow(row.id)}
                      className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    {/* No of questions counter */}
                    <div className="flex-1 bg-gray-100 rounded-xl p-3 flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-500 mb-2">No. of Questions</span>
                      <div className="flex items-center justify-between w-full bg-white rounded-lg px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuestionTypeRow(row.id, { count: Math.max(1, row.count - 1) })}
                          className="text-gray-400 hover:text-gray-700 w-5 h-5 flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-xs text-gray-900">{row.count}</span>
                        <button
                          type="button"
                          onClick={() => updateQuestionTypeRow(row.id, { count: row.count + 1 })}
                          className="text-gray-400 hover:text-gray-700 w-5 h-5 flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Marks counter */}
                    <div className="flex-1 bg-gray-100 rounded-xl p-3 flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-500 mb-2">Marks / Q</span>
                      <div className="flex items-center justify-between w-full bg-white rounded-lg px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuestionTypeRow(row.id, { marks: Math.max(1, row.marks - 1) })}
                          className="text-gray-400 hover:text-gray-700 w-5 h-5 flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-xs text-gray-900">{row.marks}</span>
                        <button
                          type="button"
                          onClick={() => updateQuestionTypeRow(row.id, { marks: row.marks + 1 })}
                          className="text-gray-400 hover:text-gray-700 w-5 h-5 flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add question row button */}
            <button
              type="button"
              onClick={addQuestionTypeRow}
              className="flex items-center gap-3 text-xs font-bold text-gray-950 mt-4 cursor-pointer"
            >
              <div className="w-7 h-7 bg-gray-950 text-white rounded-full flex items-center justify-center shadow">
                <Plus className="w-4 h-4" />
              </div>
              Add Question Type
            </button>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col items-end text-xs font-semibold text-gray-500 gap-1 mt-6 border-t border-gray-200/60 pt-4">
            <p>Total Questions : <span className="font-extrabold text-gray-900 text-sm">{totalQuestions}</span></p>
            <p>Total Marks : <span className="font-extrabold text-orange-600 text-sm">{totalMarks}</span></p>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="bg-gray-50 rounded-3xl mx-4 p-5 mb-10 shadow-sm border border-gray-200/50">
          <label className="block text-xs font-bold text-gray-900 mb-2">Additional Instructions</label>
          <div className="relative">
            <textarea
              value={currentCreation.additionalInstructions}
              onChange={(e) => updateCurrentCreation({ additionalInstructions: e.target.value })}
              placeholder="e.g. Include CBSE standard chemical reactions..."
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-2xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-gray-400 resize-none focus:ring-2 focus:ring-gray-950/10"
            ></textarea>
            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center rounded-full shadow-sm cursor-pointer transition-all ${
                isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          {isRecording && (
            <p className="text-[9px] text-red-500 font-bold mt-1.5 animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              Listening... Tap mic to end.
            </p>
          )}
        </div>

        {/* Bottom Stepper Actions */}
        <div className="px-4 flex gap-4 justify-center mb-10">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={handleGenerate}
            className="flex-1 bg-gray-950 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer hover:bg-gray-800"
          >
            Generate
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </button>
        </div>

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
