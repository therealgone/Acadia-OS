"use client";
import React from "react";

export type PredictSelection = {
  scenario: "attend" | "absent";
  count: number; // number of occurrences in the selected date range
};

export function PredictModal({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (sel: PredictSelection) => void;
}) {
  const [start, setStart] = React.useState<string>("");
  const [end, setEnd] = React.useState<string>("");
  const [scenario, setScenario] = React.useState<"attend" | "absent">(
    "absent"
  );
  const [countOverride, setCountOverride] = React.useState<number | "">("");

  if (!open) return null;

  function computeCount(): number {
    if (typeof countOverride === "number" && !Number.isNaN(countOverride)) {
      return Math.max(0, Math.floor(countOverride));
    }
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
    const diffDays = Math.floor(
      (e.setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );
    // inclusive range
    return diffDays >= 0 ? diffDays + 1 : 0;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4 text-white/90">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Predict Attendance</h2>
          <button
            className="px-2 py-1 rounded bg-white/10 apply-border-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Start date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 outline-none border border-white/10 text-white/80"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">End date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 outline-none border border-white/10 text-white/80"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <button
            className={`px-3 py-1 rounded apply-border-sm ${
              scenario === "absent" ? "btn-accent" : "bg-white/10"
            }`}
            onClick={() => setScenario("absent")}
          >
            Assume Absent
          </button>
          <button
            className={`px-3 py-1 rounded apply-border-sm ${
              scenario === "attend" ? "btn-accent" : "bg-white/10"
            }`}
            onClick={() => setScenario("attend")}
          >
            Assume Attend
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm text-white/70">Occurrences in range</label>
          <input
            type="number"
            min={0}
            value={countOverride}
            onChange={(e) =>
              setCountOverride(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            placeholder={String(computeCount())}
            className="w-28 bg-white/5 rounded-lg px-3 py-1 outline-none border border-white/10 text-white/80"
          />
          <span className="text-xs text-white/50">
            Leave empty to auto-calc by date range
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1.5 rounded apply-border-sm bg-white/10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 rounded btn-accent"
            onClick={() => {
              onApply({ scenario, count: computeCount() });
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}



