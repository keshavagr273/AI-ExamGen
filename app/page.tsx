"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SimulatedSocket from "@/components/SimulatedSocket";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Trash2,
  Eye,
  FileSpreadsheet,
  X,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const {
    assignments,
    deleteAssignment,
    activeNotification,
    dismissNotification,
    initFullStackConnection,
  } = useAssignmentStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Trigger WebSocket handshake on mount
  useEffect(() => {
    initFullStackConnection();
  }, [initFullStackConnection]);

  // Compute dashboard metrics
  const totalAssessments = assignments.length;
  const avgMarks = totalAssessments > 0 
    ? Math.round(assignments.reduce((acc, a) => acc + a.totalMarks, 0) / totalAssessments)
    : 0;
  
  // Find next upcoming due assignment
  const nextDueAssignment = assignments.length > 0
    ? [...assignments].sort((a, b) => {
        const parseDate = (d: string) => {
          const parts = d.split("-");
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
        };
        return parseDate(a.dueDate) - parseDate(b.dueDate);
      })[0]
    : null;

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  return (
    <>
      {/* DESKTOP VIEW (md and up) */}
      <div className="hidden md:flex h-screen overflow-hidden text-gray-800 font-sans bg-[#f1f2f4]">
        {/* Dynamic WebSocket Queue Overlay */}
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
        <main className="flex-1 flex flex-col min-w-0" data-purpose="main-content">
          {/* Top Header */}
          <Header />

          {/* Content Area */}
          <div
            className="flex-1 overflow-y-auto p-6 flex flex-col relative scrollbar-hide"
            data-purpose="content-area"
          >
            {/* Dashboard Page Header */}
            <div className="mb-6 flex items-center gap-3" data-purpose="page-header">
              <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Assignments
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Manage and create assignments for your classes.
                </p>
              </div>
            </div>

            {/* Statistics Panel */}
            {assignments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 shrink-0 no-print animate-fade-in">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Active Assessments</p>
                    <p className="text-base font-black text-gray-800 leading-tight">{totalAssessments}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                    <i className="fa-solid fa-graduation-cap text-base"></i>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Curriculum Average</p>
                    <p className="text-base font-black text-gray-800 leading-tight">{avgMarks} Marks</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Next Due Assessment</p>
                    <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                      {nextDueAssignment ? nextDueAssignment.title : "None Scheduled"}
                    </p>
                    {nextDueAssignment && (
                      <p className="text-[9px] text-red-500 font-semibold mt-0.5 leading-none">Due: {nextDueAssignment.dueDate}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Search & Filters */}
            <div
              className="bg-white rounded-2xl p-2 mb-6 flex items-center justify-between shadow-sm border border-gray-100 shrink-0"
              data-purpose="filters-search"
            >
              <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors cursor-pointer">
                <Filter className="w-4 h-4" />
                Filter By
              </button>
              <div className="relative w-72 md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Assignment..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            {/* Assignments Content */}
            {filteredAssignments.length === 0 ? (
              /* EMPTY STATE - Pixel-Perfect Stitch Desktop Recreation */
              <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto" data-purpose="empty-state">
                <div className="max-w-md w-full flex flex-col items-center text-center">
                  {/* Illustration */}
                  <div className="relative w-64 h-64 mb-6 flex items-center justify-center bg-radial from-gray-200/50 to-transparent rounded-full">
                    {/* Abstract SVG elements */}
                    <svg className="absolute w-full h-full" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      {/* Squiggle */}
                      <path d="M40 70 C 30 70, 20 80, 40 90 C 60 100, 20 120, 20 120" stroke="#FF5A1F" strokeLinecap="round" strokeWidth="2" opacity="0.3"></path>
                      {/* Star */}
                      <path d="M50 140 L 55 145 L 60 140 L 55 135 Z" fill="#f05a28"></path>
                      <path d="M55 130 L 55 150 M 45 140 L 65 140" stroke="#f05a28" strokeLinecap="round" strokeWidth="1.5"></path>
                      {/* Dot */}
                      <circle cx="160" cy="110" fill="#f05a28" r="4"></circle>
                    </svg>

                    {/* Floating Document Card */}
                    <div className="absolute bg-white rounded-xl shadow-md p-4 w-28 h-36 border border-gray-100 flex flex-col gap-3 left-1/2 -translate-x-1/2 -translate-y-4 transition-transform group-hover:scale-105 duration-500">
                      <div className="w-16 h-3 bg-gray-800 rounded-full"></div>
                      <div className="w-full h-1.5 bg-gray-250 rounded-full"></div>
                      <div className="w-3/4 h-1.5 bg-gray-250 rounded-full"></div>
                      <div className="w-full h-1.5 bg-gray-250 rounded-full mt-auto"></div>
                      <div className="w-2/3 h-1.5 bg-gray-250 rounded-full"></div>
                    </div>

                    {/* Small Floating Card */}
                    <div className="absolute bg-white rounded-lg shadow-md p-2 w-16 h-10 border border-gray-100 top-8 right-8 flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Magnifying Glass with Red X */}
                    <div className="absolute z-10 right-8 bottom-8 transform translate-x-4 -translate-y-4">
                      {/* Glass Handle */}
                      <div className="absolute w-12 h-3.5 bg-orange-200 rounded-full transform rotate-45 bottom-0 right-0 translate-x-5 translate-y-5"></div>
                      {/* Glass Ring */}
                      <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full border-[5px] border-orange-100 shadow-lg flex items-center justify-center relative">
                        <div className="w-full h-full rounded-full border-2 border-gray-100 absolute inset-0"></div>
                        {/* Red X */}
                        <X className="w-8 h-8 text-red-500 z-20 font-bold" />
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No assignments yet</h2>
                  <p className="text-xs text-gray-400 mb-8 leading-relaxed max-w-xs">
                    Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => router.push("/create")}
                    className="bg-[#2d333b] hover:bg-gray-800 text-white rounded-full py-2.5 px-6 flex items-center gap-2 text-xs font-semibold shadow-md transition-all cursor-pointer hover:scale-105"
                  >
                    <Plus className="w-4 h-4 text-orange-400" />
                    Create Your First Assignment
                  </button>
                </div>
              </div>
            ) : (
              /* GRID OF ASSIGNMENT CARDS */
              <div className="flex-1">
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-24"
                  data-purpose="assignments-grid"
                >
                  {filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      onClick={() => router.push(`/preview/${assignment.id}`)}
                      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {assignment.subject}
                            </span>
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {assignment.classLevel}
                            </span>
                          </div>
                          <h2 className="text-base font-bold text-gray-800 tracking-tight group-hover:text-orange-500 transition-colors">
                            {assignment.title}
                          </h2>
                          {assignment.sourceFile && (
                            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-medium">
                              <i className="fa-solid fa-file-pdf text-red-500"></i>
                              {assignment.sourceFile}
                            </p>
                          )}
                        </div>

                        {/* Options Button */}
                        <div className="relative">
                          <button
                            onClick={(e) => toggleDropdown(assignment.id, e)}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Options */}
                          {activeDropdown === assignment.id && (
                            <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-40 z-20 animate-fade-in no-print">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(null);
                                  router.push(`/preview/${assignment.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-400" />
                                View Assignment
                              </button>
                              <hr className="my-1 border-gray-100" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(null);
                                  deleteAssignment(assignment.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Metadata & Actions */}
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50 text-[11px] font-medium text-gray-500">
                        <div>
                          <span className="text-gray-800 font-bold">Total:</span> {assignment.totalQuestions} Qs ({assignment.totalMarks} Marks)
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-gray-800 font-bold">Assigned:</span> {assignment.assignedDate}
                          </div>
                          <div>
                            <span className="text-red-500 font-bold">Due:</span> {assignment.dueDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Create Button */}
                <div
                  className="fixed bottom-8 left-1/2 transform -translate-x-1/2 md:left-[58%] z-30 no-print"
                  data-purpose="floating-create-btn"
                >
                  <button
                    onClick={() => router.push("/create")}
                    className="bg-[#2d333b] hover:bg-gray-800 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 font-semibold shadow-xl transition-all border border-gray-700 hover:scale-105 cursor-pointer text-xs"
                  >
                    <Plus className="w-4 h-4 text-orange-400" />
                    Create Assignment
                  </button>
                </div>
              </div>
            )}

            {/* Gradient Fade at bottom */}
            <div className="fixed bottom-0 left-64 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none z-10 no-print"></div>
          </div>
        </main>
      </div>

      {/* MOBILE VIEW (under md) */}
      <div className="block md:hidden min-h-screen bg-gray-100 text-gray-900 antialiased font-sans overflow-x-hidden relative pb-32">
        {/* Dynamic WebSocket Queue Overlay */}
        <SimulatedSocket />

        {/* Top Header Navigation */}
        <header className="bg-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-gray-200/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded flex items-center justify-center text-white font-black text-[15px]">V</div>
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
            <button className="text-gray-600 hover:text-black p-1">
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </header>

        {/* Page Title */}
        <div className="px-4 py-4 flex items-center justify-center">
          <h1 className="font-extrabold text-[17px] text-gray-900 leading-none">Assignments</h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-4 mb-5">
          <div className="bg-white rounded-2xl shadow-sm p-1.5 flex items-center h-14 border border-gray-200/50">
            <button className="flex items-center gap-1.5 px-3 text-gray-500 border-r border-gray-200 hover:text-gray-800 transition">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="text-[13px] font-bold">Filter</span>
            </button>
            <div className="flex-1 flex items-center px-2 relative h-full ml-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 bg-transparent border-none focus:outline-none focus:ring-0 text-[13px] placeholder-gray-400"
                placeholder="Search Name"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {filteredAssignments.length === 0 ? (
          /* MOBILE EMPTY STATE */
          <div className="flex flex-col items-center px-6 mt-4">
            <div className="relative w-60 h-60 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#E8E9EC] rounded-full"></div>
              <div className="absolute w-28 h-36 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-4.5 z-10 -ml-8 -mt-8">
                <div className="w-10 h-3 bg-gray-800 rounded-full mb-3"></div>
                <div className="w-16 h-2 bg-gray-250 rounded-full mb-2"></div>
                <div className="w-12 h-2 bg-gray-250 rounded-full mb-2"></div>
                <div className="w-20 h-2 bg-gray-250 rounded-full mb-2"></div>
                <div className="w-8 h-2 bg-gray-250 rounded-full mb-2"></div>
              </div>
              <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/4">
                <div className="relative w-28 h-28">
                  <div className="absolute inset-0 bg-[#EAEAF0]/80 rounded-full border-[10px] border-white shadow-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-10 h-10 text-[#FF453A]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-5 h-14 bg-[#D8D8E3] rounded-full transform rotate-[-45deg]"></div>
                </div>
              </div>
              <div className="absolute top-4 right-10 w-12 h-8 bg-white rounded-lg flex items-center justify-center gap-1 shadow-sm">
                <div className="w-2 h-2 bg-[#A3A3D1] rounded-full"></div>
                <div className="w-4 h-2 bg-gray-200 rounded-full"></div>
              </div>
              <svg className="absolute top-1/4 left-0 w-14 h-14 text-[#2B3A55]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 100 100">
                <path d="M10,80 Q30,90 50,50 T90,20" fill="none" strokeLinecap="round"></path>
                <circle cx="20" cy="50" r="8"></circle>
              </svg>
              <svg className="absolute bottom-1/4 left-10 w-5 h-5 text-[#4F86C6]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"></path>
              </svg>
              <div className="absolute right-8 bottom-1/3 w-2.5 h-2.5 bg-[#4F86C6] rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2.5 text-center">No assignments yet</h1>
            <p className="text-center text-gray-500 text-xs leading-relaxed mb-6 px-4">
              Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
            </p>
            <button
              onClick={() => router.push("/create")}
              className="bg-[#1C1C1E] text-white px-6 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors w-[260px] justify-center shadow-lg text-xs cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5 text-orange-400" />
              Create Your First Assignment
            </button>
          </div>
        ) : (
          /* MOBILE CARD LIST */
          <div className="px-4 space-y-4">
            {filteredAssignments.map((a) => (
              <div
                key={a.id}
                onClick={() => router.push(`/preview/${a.id}`)}
                className="bg-[#FAFAFA] border border-gray-200/70 rounded-2xl p-5 shadow-sm active:bg-gray-50 transition cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="bg-orange-50/70 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded">
                        {a.subject}
                      </span>
                      <span className="bg-gray-200/60 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded">
                        {a.classLevel}
                      </span>
                    </div>
                    <h2 className="font-extrabold text-[15px] text-gray-800 tracking-tight leading-snug">
                      {a.title}
                    </h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(a.id, e);
                    }}
                    className="text-gray-400 hover:text-black p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Options */}
                  {activeDropdown === a.id && (
                    <div className="absolute right-4 top-12 bg-white rounded-xl shadow-lg border border-gray-150 py-1 w-36 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(null);
                          router.push(`/preview/${a.id}`);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        View
                      </button>
                      <hr className="border-gray-100" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(null);
                          deleteAssignment(a.id);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-[10px] text-gray-500 gap-3 border-t border-gray-100 pt-3 font-semibold">
                  <p><span className="text-gray-700">Assigned:</span> {a.assignedDate}</p>
                  <p><span className="text-red-500">Due:</span> {a.dueDate}</p>
                  <p className="ml-auto text-gray-900 font-extrabold">{a.totalQuestions} Qs ({a.totalMarks} M)</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        {assignments.length > 0 && (
          <div className="fixed bottom-28 right-6 z-20">
            <button
              onClick={() => router.push("/create")}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition border border-gray-200/50 cursor-pointer"
            >
              <Plus className="w-8 h-8 text-[#FF5722]" />
            </button>
          </div>
        )}

        {/* Dark Bottom Navigation Bar */}
        <nav className="fixed bottom-4 left-4 right-4 bg-[#1A1A1A] rounded-[32px] py-4 px-6 flex justify-between items-center z-30 shadow-2xl">
          <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 text-white relative w-1/4 cursor-pointer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"></path>
            </svg>
            <span className="text-[10px] font-bold">Home</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
          </button>
          <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition w-1/4 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-4V7h4v5zm4 0h-2V7h2v5z"></path>
            </svg>
            <span className="text-[10px] font-medium">Assignments</span>
          </button>
          <button onClick={() => router.push("/library")} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition w-1/4 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-medium">Library</span>
          </button>
          <button onClick={() => router.push("/toolkit")} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition w-1/4 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-[10px] font-medium">AI Toolkit</span>
          </button>
        </nav>
      </div>
    </>
  );
}
