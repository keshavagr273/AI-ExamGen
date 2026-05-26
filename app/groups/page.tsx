"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";
import { Search, Plus, Users, GraduationCap, Calendar, MessageSquare, MoreVertical, X } from "lucide-react";

interface ClassGroup {
  id: string;
  name: string;
  grade: string;
  subject: string;
  studentsCount: number;
  averageScore: number;
  assignedCount: number;
  color: string;
}

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("Science");
  const [newGroupGrade, setNewGroupGrade] = useState("Class 8");

  const [groups, setGroups] = useState<ClassGroup[]>([
    {
      id: "group-1",
      name: "CBSE Class 8 - Science Section A",
      grade: "Class 8",
      subject: "Science",
      studentsCount: 38,
      averageScore: 82,
      assignedCount: 6,
      color: "from-orange-500 to-amber-500"
    },
    {
      id: "group-2",
      name: "Grade 5 - English Grammar Masters",
      grade: "Class 5",
      subject: "English",
      studentsCount: 32,
      averageScore: 88,
      assignedCount: 4,
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "group-3",
      name: "CBSE Class 9 - Chemistry Lab Group",
      grade: "Class 9",
      subject: "Science",
      studentsCount: 40,
      averageScore: 78,
      assignedCount: 8,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "group-4",
      name: "Mathematics Advanced Prep 8B",
      grade: "Class 8",
      subject: "Mathematics",
      studentsCount: 28,
      averageScore: 91,
      assignedCount: 12,
      color: "from-rose-500 to-pink-500"
    }
  ]);

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: ClassGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      grade: newGroupGrade,
      subject: newGroupSubject,
      studentsCount: Math.floor(Math.random() * 15) + 20, // 20-35
      averageScore: Math.floor(Math.random() * 20) + 75, // 75-95
      assignedCount: 0,
      color: "from-orange-500 to-amber-500"
    };

    setGroups([newGroup, ...groups]);
    setNewGroupName("");
    setShowAddModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden text-gray-800 font-sans bg-[#f1f2f4]">
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
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Groups</h1>
                <p className="text-xs text-gray-400 font-medium">Manage student rosters and classroom statistics.</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#2d333b] hover:bg-gray-800 text-white rounded-xl py-2 px-4 flex items-center gap-2 text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              Add New Group
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-2 mb-6 flex items-center justify-between shadow-sm border border-gray-100 shrink-0">
            <span className="text-xs font-bold text-gray-400 pl-3">Active Classrooms ({filteredGroups.length})</span>
            <div className="relative w-72 md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Classrooms..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs transition-all"
              />
            </div>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-24">
            {filteredGroups.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative transition-all duration-300 hover:shadow-md group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {g.subject}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {g.grade}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-gray-800 tracking-tight group-hover:text-orange-500 transition-colors">
                      {g.name}
                    </h2>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Micro-stats cards */}
                <div className="grid grid-cols-3 gap-3 mb-6 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="text-center">
                    <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Roster</p>
                    <p className="text-xs font-black text-gray-800">{g.studentsCount}</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <GraduationCap className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Average</p>
                    <p className="text-xs font-black text-blue-600">{g.averageScore}%</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Assigned</p>
                    <p className="text-xs font-black text-emerald-600">{g.assignedCount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-auto pt-3 border-t border-gray-50">
                  <span className="font-semibold">Delhi Public School Catalog</span>
                  <button className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer">
                    Manage Roster
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Group Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-gray-900">Add New Classroom Group</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddGroup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Group Name</label>
                    <input
                      type="text"
                      required
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g. Grade 8 CBSE Science - Section C"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Subject</label>
                      <select
                        value={newGroupSubject}
                        onChange={(e) => setNewGroupSubject(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Mathematics">Mathematics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Class / Grade</label>
                      <select
                        value={newGroupGrade}
                        onChange={(e) => setNewGroupGrade(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        <option value="Class 5">Class 5th</option>
                        <option value="Class 6">Class 6th</option>
                        <option value="Class 7">Class 7th</option>
                        <option value="Class 8">Class 8th</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2d333b] hover:bg-gray-800 text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md transition-all mt-4 cursor-pointer"
                  >
                    Register Classroom Group
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
