"use client";
import Link from "next/link";

import React, { useMemo,  } from "react";

import { usePathname } from "next/navigation";
import {
  Timer,
  Percent,
  SquarePen,
  School,
  Calendar,
  UserPen,
} from "lucide-react";

// Memoized navigation items to prevent recreation on every render
const NAVIGATION_ITEMS = [
  { name: "Timetable", href: "/app/timetable", icon: Timer },
  { name: "Attendance", href: "/app/attendance", icon: Percent },
  { name: "Marks", href: "/app/marks", icon: SquarePen },
  { name: "Course", href: "/app/course", icon: School },
  { name: "Calendar", href: "/app/calendar", icon: Calendar },
  { name: "Profile", href: "/app/profile", icon: UserPen },
] as const;

export const CommandCenter = React.memo(() => {
  const pathname = usePathname();
  
  // Memoize the items to prevent recreation
  const items = useMemo(() => NAVIGATION_ITEMS, []);

  return (
    <>
      {/* Mobile bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden" role="navigation" aria-label="Bottom Navigation">
        <div
          className="px-2 pb-2 pt-2"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
        >
          <nav className="mx-auto rounded-2xl px-2 max-w-md w-full lg:rounded-t-2xl dock-glass backdrop-blur-md border border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.25)]">
            <ul className="flex items-stretch justify-between">
              {items.map((i) => {
                const IconComp = i.icon;
                const isActive = pathname?.startsWith(i.href);
                return (
                  <li key={i.name}>
                    <Link
                      href={i.href}
                      prefetch={true} // Prefetch routes for faster navigation
                      aria-current={isActive ? "page" : undefined}
                      className="flex flex-col items-center justify-center gap-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      <div
                        className={
                          "rounded-xl p-2 transition-colors " +
                          (isActive ? " panel-red-bg " : "bg-white/10 ")
                        }
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                     
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop dock  */}
      <div className="hidden md:flex fixed inset-x-0 bottom-6 justify-center items-end z-40">
        <div className="flex rounded-3xl dock-glass px-6 py-4 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
          {items.map((i) => {
            const IconComp = i.icon;
            const isActive = pathname?.startsWith(i.href);
            return (
              <Link key={i.name} href={i.href} prefetch={true}>
                <div
                  className="group flex flex-col items-center justify-center mx-4 transition-all duration-200 ease-out hover:scale-110"
                >
                  <div className={`bg-white/10 rounded-2xl p-3 backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-lg hover-glow ${isActive ? "panel-red-bg -translate-y-1 transition-transform" : ""}`}>
                    <IconComp className="w-6 h-6 icon-default group-hover:text-white" />
                  </div>
                  
                  <span className="text-xs text-gray-200 mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {i.name}
                  </span>
                  
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating header/logo for desktop */}
      
    </>
  );
});

CommandCenter.displayName = 'CommandCenter';
