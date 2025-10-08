"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Icon from "@/../public/favicon.svg";

const Header = ({ value }: { value: string }) => {
  return (
    <header className="fixed top-2 left-0 w-full px-2 z-50">
      <div className="relative max-w-6xl mx-auto flex items-center justify-between   shadow-lg px-3 py-2 transition-all duration-300 hover:shadow-xl ">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative w-7 h-7 transition-transform duration-500 hover:scale-110 hover:rotate-[10deg]">
            <Image loading="lazy" src={Icon} alt="Acadia OS Logo" fill style={{ objectFit: "contain" }} />
          </div>
          <h1 className="text-sm font-bold text-white tracking-wide cursor-pointer transition-colors duration-300 group-hover:text-[color:var(--accent-secondary)]">
            Acadia OS
          </h1>
        </div>

        {/* Navigation / CTA */}
        <div className="flex items-center">
          {value === "root" ? (
            <Link
              href="/auth/login"
              className="relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 btn-accent hover-glow text-xs"
            >
              Login
              <span className="ml-0.5 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full font-semibold bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all duration-300 hover:scale-105 text-xs"
            >
              Back
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
