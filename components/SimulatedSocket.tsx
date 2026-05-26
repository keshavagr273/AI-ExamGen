"use client";

import { useAssignmentStore } from "../store/useAssignmentStore";
import { Sparkles, Loader2, Cpu, CheckCircle } from "lucide-react";

export default function SimulatedSocket() {
  const { isGenerating, generationProgress, generationStep } = useAssignmentStore();

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/65 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in no-print">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center transform scale-95 transition-transform duration-300 ease-out">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-50 relative">
            <Cpu className="w-10 h-10 text-orange-500 animate-pulse" />
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Header */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          VedaAI Queue Engine
        </h3>
        <p className="text-sm text-gray-400 font-medium mb-6">
          Running background generation worker. Real-time updates active via WebSockets.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden p-0.5 border border-gray-200">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${generationProgress}%` }}
          ></div>
        </div>

        <div className="flex justify-between w-full text-xs font-bold text-gray-400 mb-6">
          <span>Progress</span>
          <span className="text-orange-600">{generationProgress}%</span>
        </div>

        {/* Logs terminal */}
        <div className="w-full bg-gray-950 rounded-2xl p-4 text-left font-mono text-[11px] text-green-400 shadow-inner h-28 overflow-y-auto scrollbar-hide border border-gray-800 space-y-2">
          <div className="text-gray-500 select-none">
            [system@worker-core ~]$ tail -f /var/log/bullmq/worker.log
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span>[2026-05-26T10:14:02.193Z]</span>
            <span className="text-blue-400">INFO</span>
            <span>- Initializing queue listener on redis://127.0.0.1:6379</span>
          </div>
          <div className="flex items-start gap-1.5 leading-relaxed">
            <span className="text-gray-500 shrink-0">[2026-05-26T10:14:04.288Z]</span>
            <span className="text-green-500 font-bold shrink-0">JOB</span>
            <span className="text-green-300 break-words">{generationStep}</span>
          </div>
          <div className="flex items-center gap-1.5 animate-pulse text-gray-500">
            <span>▋</span>
            <span>Awaiting next batch update...</span>
          </div>
        </div>

        {/* Footer loading message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
          <span>Generating structured prompt files...</span>
        </div>
      </div>
    </div>
  );
}
