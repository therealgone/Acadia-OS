"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Icon from "@/../public/favicon.svg";
import {
  Timer,
  Percent,
  SquarePen,
  School,
  Calendar,
  UserPen,
} from "lucide-react";

export const CommandCenter = () => {
  const items = [
    { name: "Timetable", href: "/app/timetable", icon: Timer },
    { name: "Attendance", href: "/app/attendance", icon: Percent },
    { name: "Marks", href: "/app/marks", icon: SquarePen },
    { name: "Course", href: "/app/course", icon: School },
    { name: "Calendar", href: "/app/calendar", icon: Calendar },
    { name: "Profile", href: "/app/profile", icon: UserPen },
  ];

  return (
    <div className="fixed inset-x-0 bottom-10 flex justify-center items-end z-50">
      <div className="flex flex-col items-center">

        {/* Floating macOS-style dock */}
        <div className="flex rounded-3xl dock-glass px-6 py-4 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
          {items.map((i) => {
            const IconComp = i.icon;
            return (
              <Link key={i.name} href={i.href}>
                <div
                  className="
                    group flex flex-col items-center justify-center mx-4
                    transition-all duration-200 ease-out
                    hover:scale-125 hover:-translate-y-2
                  "
                >
                  <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-lg hover-glow">
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

        {/* Floating header/logo */}
        <div className="fixed top-6 flex items-center justify-center gap-3 text-white">
          <Image
            loading="lazy"
            src={Icon}
            width={25}
            height={25}
            alt="Acadia OS Logo"
          />
          <span className="leading-none text-lg font-medium">Acadia OS</span>
        </div>
      </div>
    </div>
  );
};
