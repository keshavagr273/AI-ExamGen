"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState, useRef } from "react";
import { Search, FolderOpen, FileText, Trash2, Eye, Upload, Filter, X, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface LibraryFile {
  id: string;
  name: string;
  type: "PDF" | "Text" | "Spreadsheet";
  size: string;
  uploadedAt: string;
  category: string;
}

export default function LibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<LibraryFile[]>([
    {
      id: "file-1",
      name: "CBSE_Grade8_Science_Ch12_NCERT.pdf",
      type: "PDF",
      size: "4.2 MB",
      uploadedAt: "12-05-2025",
      category: "Science"
    },
    {
      id: "file-2",
      name: "Class5_English_Grammar_Adverbs_StudyGuide.txt",
      type: "Text",
      size: "18 KB",
      uploadedAt: "24-05-2026",
      category: "English"
    },
    {
      id: "file-3",
      name: "CBSE_Revised_Curriculum_Science_2025.pdf",
      type: "PDF",
      size: "1.8 MB",
      uploadedAt: "10-04-2025",
      category: "Science"
    },
    {
      id: "file-4",
      name: "Delhi_Public_School_Grading_Schedules.xlsx",
      type: "Spreadsheet",
      size: "240 KB",
      uploadedAt: "01-03-2025",
      category: "Administration"
    }
  ]);

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (uploaded && uploaded.length > 0) {
      const file = uploaded[0];
      const typeMap: Record<string, "PDF" | "Text" | "Spreadsheet"> = {
        "application/pdf": "PDF",
        "text/plain": "Text"
      };
      const fileType = typeMap[file.type] || "PDF";
      
      const newFile: LibraryFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        type: fileType,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        category: "Uploads"
      };

      setFiles([newFile, ...files]);
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
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
            <div className="mb-6 flex items-center justify-between" data-purpose="page-header">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(240,90,40,0.6)]"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Library</h1>
                  <p className="text-xs text-gray-400 font-medium">Store reference study guides, CBSE board syllabi, and textbook assets.</p>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#2d333b] hover:bg-gray-800 text-white rounded-xl py-2 px-4 flex items-center gap-2 text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-orange-400" />
                Upload Reference File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadFile}
                className="hidden"
              />
            </div>

            {/* Search bar & filter */}
            <div className="bg-white rounded-2xl p-2 mb-6 flex items-center justify-between shadow-sm border border-gray-100 shrink-0">
              <span className="text-xs font-bold text-gray-400 pl-3">Vault Materials ({filteredFiles.length})</span>
              <div className="relative w-72 md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reference papers..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            {/* Files List Layout */}
            {filteredFiles.length === 0 ? (
              <div className="flex-1 bg-white/70 border border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full my-4 shadow-sm min-h-[300px]">
                <FolderOpen className="w-12 h-12 text-gray-300 mb-4 animate-pulse" />
                <h3 className="text-base font-bold text-gray-900 mb-1">No reference files found</h3>
                <p className="text-xs text-gray-400 max-w-xs mb-6">Upload textbooks and blueprints to parse them inside the AI Assessment Creator.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-24 shrink-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                    <thead className="bg-gray-50 text-gray-400 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="px-6 py-4">Document Title</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Size</th>
                        <th className="px-6 py-4">Syllabus Tag</th>
                        <th className="px-6 py-4">Ingestion Date</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {filteredFiles.map((f) => {
                        let typeBadge = "bg-red-50 text-red-700 border-red-200";
                        if (f.type === "Text") {
                          typeBadge = "bg-blue-50 text-blue-700 border-blue-200";
                        } else if (f.type === "Spreadsheet") {
                          typeBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                        }

                        return (
                          <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-900 truncate max-w-xs">
                              <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                                {f.name}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${typeBadge}`}>
                                {f.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-400 text-[10px]">{f.size}</td>
                            <td className="px-6 py-4">
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                {f.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-[10px]">{f.uploadedAt}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => alert(`View details of: ${f.name}`)}
                                  className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                                  title="Open details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFile(f.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 cursor-pointer transition-colors"
                                  title="Delete file"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#1C1C1E] text-white p-2 rounded-full inline-flex items-center justify-center shadow transition hover:bg-gray-800 cursor-pointer"
              title="Upload Reference File"
            >
              <Upload className="w-4 h-4 text-orange-400" />
            </button>
            <img alt="User Profile" className="w-7.5 h-7.5 rounded-full object-cover border border-gray-250 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH7ehtX5DiQIQ3F1diZbq35PC2anGoFEYkxJ-IIvJUnpqkaBxYVpKvk7kvta4eJCARpvd0yEWz4HC07ty3NYy9Ip56KlJzFyvVdgHt3eOdnZDpoOWmPEJrkOi5wL6oKttI7qygH0iVME9DNxRkev_-rxpysejmpPXjFIuIDpOT4PJle47ddjx7uEjRDjbDUFrgvHGJ1OUSZI4VPDpU_X9yDOwZt44voYIuhzSNQ6Roz9-xaDUvcDbQWT4x5-qDeI8YtTCgoVKOuyFb"/>
          </div>
        </header>

        <main className="p-4">
          <div className="mb-5 flex justify-between items-center">
            <div>
              <h1 className="font-extrabold text-xl mb-1 text-gray-900 tracking-tight">My Library</h1>
              <p className="text-gray-500 text-xs font-semibold">Store text resources &amp; guides</p>
            </div>
          </div>

          {/* Search box & filter */}
          <div className="bg-white rounded-2xl p-1.5 mb-5 flex items-center h-14 border border-gray-200/50 shadow-sm">
            <div className="flex-1 flex items-center px-2 relative h-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 bg-transparent border-none focus:outline-none focus:ring-0 text-[13px] placeholder-gray-400 font-medium"
                placeholder="Search resources..."
              />
            </div>
          </div>

          {/* Reference files list */}
          {filteredFiles.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-gray-200/50 min-h-[220px]">
              <FolderOpen className="w-10 h-10 text-gray-300 mb-3 animate-pulse" />
              <h3 className="text-sm font-extrabold text-gray-900">No reference files</h3>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">Upload textbooks to parse them in VedaAI</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFiles.map((f) => {
                let typeBadge = "bg-red-50 text-red-700 border-red-150";
                if (f.type === "Text") {
                  typeBadge = "bg-blue-50 text-blue-700 border-blue-150";
                } else if (f.type === "Spreadsheet") {
                  typeBadge = "bg-emerald-50 text-emerald-700 border-emerald-150";
                }

                return (
                  <div
                    key={f.id}
                    className="bg-[#FAFAFA] border border-gray-200/70 rounded-2xl p-4 shadow-sm relative flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileText className="w-4.5 h-4.5 text-gray-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <h2 className="font-extrabold text-[13px] text-gray-800 tracking-tight leading-snug break-all pr-4">
                            {f.name}
                          </h2>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${typeBadge}`}>
                              {f.type}
                            </span>
                            <span className="bg-gray-200/60 text-gray-600 text-[8px] font-bold px-1.5 py-0.5 rounded">
                              {f.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(f.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-100 pt-2.5 text-[9px] text-gray-400 font-bold">
                      <p>Size: {f.size}</p>
                      <p>Uploaded: {f.uploadedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          <button onClick={() => router.push("/library")} className="flex flex-col items-center gap-1 text-white relative cursor-pointer w-1/4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-bold">Library</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
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
