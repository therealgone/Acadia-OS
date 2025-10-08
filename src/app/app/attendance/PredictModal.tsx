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
  const [touched, setTouched] = React.useState(false);

  if (!open) return null;

  function computeCount(): number {
    if (!start || !end) return 0;
    // Normalize to local midnight to avoid TZ drift
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
    const startMs = s.getTime();
    const endMs = e.getTime();
    if (endMs < startMs) return 0;
    const diffDays = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
    // inclusive range
    return diffDays + 1;
  }

  const isInvalidRange = (() => {
    if (!start || !end) return true;
    const s = new Date(start + "T00:00:00").getTime();
    const e = new Date(end + "T00:00:00").getTime();
    return Number.isNaN(s) || Number.isNaN(e) || e < s;
  })();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full md:max-w-lg bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 text-white/90"
        style={{ paddingBottom: "1rem" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Predict Attendance</h2>
          <button
            className="px-3 py-1.5 rounded bg-white/10 apply-border-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Start date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                if (!touched) setTouched(true);
              }}
              className="bg-white/5 rounded-lg px-3 py-2 outline-none border border-white/10 text-white/80"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">End date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
                if (!touched) setTouched(true);
              }}
              className="bg-white/5 rounded-lg px-3 py-2 outline-none border border-white/10 text-white/80"
            />
          </div>
        </div>
        {touched && isInvalidRange && (
          <div className="text-xs text-red-300 mb-3">End date must be on or after start date.</div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <button
            className={`flex-1 px-3 py-2 rounded apply-border-sm ${
              scenario === "absent" ? "btn-accent" : "bg-white/10"
            }`}
            onClick={() => setScenario("absent")}
          >
            Assume Absent
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded apply-border-sm ${
              scenario === "attend" ? "btn-accent" : "bg-white/10"
            }`}
            onClick={() => setScenario("attend")}
          >
            Assume Attend
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded apply-border-sm bg-white/10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={isInvalidRange}
            className={`px-4 py-2 rounded ${isInvalidRange ? "bg-white/10 text-white/40" : "btn-accent"}`}
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



