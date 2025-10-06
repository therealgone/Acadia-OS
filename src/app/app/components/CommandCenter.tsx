"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Icon from "@/../public/favicon.svg";

export const CommandCenter = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="fixed inset-x-0 top-6 mx-auto z-40 flex items-center justify-center">
      <div
        className={`transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${
          open ? "w-[92%] max-w-3xl" : "w-64"
        }`}
      >
        <div
          onClick={() => setOpen((v) => !v)}
          className={`panel cursor-pointer rounded-full px-6 py-2 flex items-center text-white shadow-2xl ${
            open ? "rounded-2xl" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <Image loading="lazy" src={Icon} width={20} height={20} alt="Acadia OS Logo" />
            <span className="leading-none">Acadia OS</span>
          </div>
            
          
        </div>
        {open && (
          <div className=" bg-primary mt-3 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: "Timetable", href: "/app/timetable" },
              { name: "Attendance", href: "/app/attendance" },
              { name: "Marks", href: "/app/marks" },
              { name: "Course", href: "/app/course" },
              { name: "Calendar", href: "/app/calendar" },
              { name: "Profile", href: "/app/profile" },
            ].map((i) => (
              <Link
                key={i.name}
                href={i.href}
                className="panel rounded-xl p-4 text-center hover:scale-[0.99] transition-transform hover-glow-blue"
              >
                <div className="text-sm text-white/80">{i.name}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



