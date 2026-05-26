"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown, Grid3X3, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Derive breadcrumbs based on URL
  let pageTitle = "Assignment";
  let showBack = false;

  if (pathname.startsWith("/create")) {
    pageTitle = "Create New Assignment";
    showBack = true;
  } else if (pathname.startsWith("/preview")) {
    pageTitle = "Question Paper Preview";
    showBack = true;
  } else {
    pageTitle = "Assignments Dashboard";
  }

  return (
    <header
      className="bg-white rounded-2xl shadow-sm m-3 mb-0 px-5 py-3 flex items-center justify-between border border-gray-100 z-10 shrink-0 no-print"
      data-purpose="topbar"
    >
      <div className="flex items-center gap-4">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="p-2 text-gray-400">
            <Grid3X3 className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
          <span>{pageTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors relative cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-gray-100"
          >
            <img
              alt="John Doe"
              className="w-7 h-7 rounded-full object-cover border border-gray-200"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmH7iyUBUViL5VWw0pTbWX1dj3h9e6_Z2JWIXh8SPsuFtAEDEvE7CIxQCCBRCokzcZPIpzDY5m-eXG-9-pl3bIrXt-5EXWUUWPrPul8iobgU6PJ4_bO6p9CDORDeblunbLJlMqzBENJsXxZ4xKQkP1G0sbGjtAytt4wHXNtoU4S9SLGHE2XtEHvIc82wCDal0VH0Fo7tcRUj5OA9yQhLze8WnvPScmQaAQjc-rEjny7ON4CV50W9RItzHGQwPrLOxsQIbUDBxvw6nR"
            />
            <span className="text-xs font-semibold text-gray-700">John Doe</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-30">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
              >
                My Profile
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
              >
                Preferences
              </a>
              <hr className="my-1 border-gray-100" />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-xs text-red-500 hover:bg-red-50 font-medium"
              >
                Log Out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
