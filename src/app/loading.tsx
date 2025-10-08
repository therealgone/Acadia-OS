"use client";
import { GlobalLoader } from "./app/components/loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-dvw h-dvh">
      <GlobalLoader className="w-28 h-28 text-[color:var(--accent-secondary)]" />
    </div>
  );
}


