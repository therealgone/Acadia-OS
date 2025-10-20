"use client";
import { GlobalLoader } from "./app/components/loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <GlobalLoader className="w-28 h-28 text-[color:var(--accent-secondary)]" />
    </div>
  );
}


