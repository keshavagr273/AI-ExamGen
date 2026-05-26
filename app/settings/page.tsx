"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useState, useEffect } from "react";
import { Save, GraduationCap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { globalSettings, updateGlobalSettings, initFullStackConnection } = useAssignmentStore();

  const [schoolName, setSchoolName] = useState("");
  const [schoolRegion, setSchoolRegion] = useState("");

  // Sync state with Zustand globalSettings on load
  useEffect(() => {
    initFullStackConnection();
    setSchoolName(globalSettings.schoolName);
    setSchoolRegion(globalSettings.schoolRegion);
  }, [globalSettings, initFullStackConnection]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateGlobalSettings({
      schoolName: schoolName.trim() || "Delhi Public School",
      schoolRegion: schoolRegion.trim() || "Bokaro Steel City"
    });
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
              <div className="w-3 h-3 bg-orange-50 rounded-full shadow-[0_0_8px_rgba(240,90,40,0.6)]"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-xs text-gray-400 font-medium font-sans">Configure curriculum presets and institution profiles.</p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto w-full pb-24">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Card 1: School Branding */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Institution Profile &amp; Branding</h2>
                      <p className="text-[10px] text-gray-400">Sets the letterhead branding details for generated exam sheets.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">School Name</label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Delhi Public School"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Region / Campus Branch</label>
                      <input
                        type="text"
                        value={schoolRegion}
                        onChange={(e) => setSchoolRegion(e.target.value)}
                        placeholder="e.g. Bokaro Steel City"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <button
                  type="submit"
                  className="w-full bg-[#2d333b] hover:bg-gray-800 text-white rounded-full py-3 px-6 text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-orange-400" />
                  Save Settings &amp; Branding
                </button>
              </form>
            </div>
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
            <h1 className="font-extrabold text-xl mb-1 text-gray-900 tracking-tight">Settings</h1>
            <p className="text-gray-500 text-xs font-semibold">Configure presets and institution profile</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Card: School Branding */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/50 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold text-gray-900">Branding</h2>
                  <p className="text-[9px] text-gray-400 font-semibold leading-none mt-0.5">Customizes your generated paper headers</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Region / Branch</label>
                  <input
                    type="text"
                    value={schoolRegion}
                    onChange={(e) => setSchoolRegion(e.target.value)}
                    placeholder="e.g. Bokaro Steel City"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-[#1C1C1E] hover:bg-gray-800 text-white rounded-full py-3.5 px-6 text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-orange-400" />
              Save Settings &amp; Branding
            </button>
          </form>
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
