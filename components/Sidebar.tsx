"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAssignmentStore } from "../store/useAssignmentStore";
import {
  LayoutGrid,
  Users,
  FileText,
  Smartphone,
  Clock,
  Settings,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const assignments = useAssignmentStore((state) => state.assignments);

  const navItems = [
    { name: "Home", href: "/", icon: LayoutGrid },
    { name: "My Groups", href: "/groups", icon: Users },
    {
      name: "Assignments",
      href: "/",
      icon: FileText,
      badge: assignments.length,
    },
    { name: "AI Teacher's Toolkit", href: "/toolkit", icon: Smartphone },
    { name: "My Library", href: "/library", icon: Clock },
  ];

  return (
    <aside
      className="w-64 bg-white flex flex-col m-3 rounded-2xl shadow-sm z-20 shrink-0 border border-gray-100 no-print"
      data-purpose="sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6" data-purpose="logo">
        <div className="w-8 h-8 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          V
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-800">
          Veda<span className="text-orange-500">AI</span>
        </span>
      </div>

      {/* Create Assignment Button */}
      <div className="px-5 mb-6" data-purpose="sidebar-create-btn">
        <button
          onClick={() => router.push("/create")}
          className="w-full bg-[#2d333b] hover:bg-gray-800 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium shadow-[0_0_15px_rgba(240,90,40,0.2)] hover:shadow-[0_0_20px_rgba(240,90,40,0.35)] transition-all border border-gray-700 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent group-hover:opacity-100 transition-opacity"></div>
          <Sparkles className="w-4 h-4 text-orange-400 relative z-10 animate-pulse" />
          <span className="relative z-10 text-sm">Create Assignment</span>
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide"
        data-purpose="sidebar-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/preview")
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-orange-500" : "text-gray-400"
                }`}
              />
              <span>{item.name}</span>
              {item.badge !== undefined && (
                <span
                  className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto border-t border-gray-50" data-purpose="sidebar-bottom">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
            pathname.startsWith("/settings")
              ? "bg-orange-50 text-orange-600 font-semibold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings className={`w-5 h-5 ${pathname.startsWith("/settings") ? "text-orange-500" : "text-gray-400"}`} />
          <span>Settings</span>
        </Link>

        {/* School Profile Card */}
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
          <img
            alt="School Logo"
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNBH04JMrheGNzaj8Yzd-Y_16oWrG40WfcgeW21EOgF7qc_Com77BDcDXKH2iusJ9Xg9A73-zqX57WbRQngQXeZw1MwDXRV6yNvmMvIodDOGjdyBC64xc1Vg69s3qWMzg3Qky_eJWGKlA5j_JZheP5WlNsdEoNM02ZXQ5bwI324jQkosrTSINiHUud1ISCwueZhOY9gu-UiN3Z_AWJE2g4R_219zODuGKM01tygEXmVqABBMWo7yATk2NouwdD_E2fe7iArDvwaQWn"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              Delhi Public School
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
