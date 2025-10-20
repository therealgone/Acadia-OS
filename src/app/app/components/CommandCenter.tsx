"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Timer,
  Percent,
  SquarePen,
  LayoutDashboard,
  Calendar,
  UserPen,
} from "lucide-react";

const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Timetable", href: "/app/timetable", icon: Timer },
  { name: "Attendance", href: "/app/attendance", icon: Percent },
  { name: "Marks", href: "/app/marks", icon: SquarePen },
  { name: "Calendar", href: "/app/calendar", icon: Calendar },
  { name: "Profile", href: "/app/profile", icon: UserPen },
] as const;

export const CommandCenter = React.memo(() => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = useMemo(() => NAVIGATION_ITEMS, []);
  const activeItem = items.find((i) => pathname?.startsWith(i.href));

  return (
    <>
      {/* ===== MOBILE DOCK ===== */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div
          className="px-2 pb-2 pt-2 transition-transform duration-300 ease-in-out"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
        >
          <nav>
            <ul>
              <div
                className={` transition-transform duration-300 ease-out ${
                  open ? "scale-100 opacity-100 flex items-stretch justify-between mx-auto rounded-2xl px-2 max-w-md w-full dock-glass backdrop-blur-md border border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.25)]" : "scale-95 opacity-95"
                }`}
              >
                {open ? (
                  items.map((i) => {
                    const IconComp = i.icon;
                    const isActive = pathname?.startsWith(i.href);
                    return (
                      <li key={i.name}>
                        <Link
                          href={i.href}
                          prefetch={true}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setOpen(false)}
                          className="flex flex-col items-center justify-center gap-1 py-2 focus:outline-none transition-transform duration-200 ease-in-out"
                        >
                          <div
                            className={`rounded-xl p-2 transform transition-all duration-200 ease-in-out ${
                              isActive
                                ? "bg-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-110"
                                : "bg-white/10 scale-100 hover:scale-105"
                            }`}
                          >
                            <IconComp className="w-6 h-6" />
                          </div>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <>
                    {activeItem && (
                      <li key={activeItem.name} className="flex justify-center w-full">
                        <Link
                          href={activeItem.href}
                          prefetch={true}
                          onClick={() => setOpen(true)}
                          className="transition-transform duration-200 ease-in-out"
                        >
                          <div className="rounded-xl p-2 bg-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] flex gap-2 items-center justify-center scale-105 hover:scale-110">
                            <activeItem.icon className="w-6 h-6" />
                            {activeItem.name}
                          </div>
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </div>
            </ul>
          </nav>
        </div>
      </div>

      {/* ===== DESKTOP DOCK ===== */}
      <div className="hidden md:flex fixed inset-x-0 bottom-6 justify-center items-end z-40 transition-transform duration-300 ease-in-out">
        <div
          className={`transition-transform duration-300 ease-out ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-90"
          }`}
        >
          {open ? (
            <div className="flex rounded-3xl dock-glass px-6 py-4 transition-all duration-300 ease-out hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
              {items.map((i) => {
                const IconComp = i.icon;
                const isActive = pathname?.startsWith(i.href);
                return (
                  <Link
                    key={i.name}
                    href={i.href}
                    prefetch={true}
                    onClick={() => setOpen(false)}
                  >
                    <div className="group flex flex-col items-center justify-center mx-4 transform transition-transform duration-200 ease-out hover:scale-110">
                      <div
                        className={`rounded-xl p-2 transition-all duration-200 ease-out ${
                          isActive
                            ? "bg-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] -translate-y-1"
                            : "bg-white/10"
                        }`}
                      >
                        <IconComp className="w-6 h-6 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <span className="text-xs text-gray-200 mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                        {i.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            activeItem && (
              <li key={activeItem.name} className="flex justify-center">
                <Link
                  href={activeItem.href}
                  prefetch={true}
                  onClick={() => setOpen(true)}
                >
                  <div className="rounded-xl p-2 bg-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] flex gap-2 items-center justify-center scale-105 hover:scale-110 transition-transform duration-200 ease-out">
                    <activeItem.icon className="w-6 h-6" />
                    {activeItem.name}
                  </div>
                </Link>
              </li>
            )
          )}
        </div>
      </div>
    </>
  );
});

CommandCenter.displayName = "CommandCenter";
