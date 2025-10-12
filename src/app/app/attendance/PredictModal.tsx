"use client";
import React from "react";
import { useCalendar } from "@/hooks/query";

import { GlobalLoader } from "../components/loader";
import { Calendar, TrendingUp, X, CheckCircle, XCircle } from "lucide-react";

export type PredictSelection = {
  start: string;
  end: string;
  scenario: "Assume Present" | "Assume Absent";
  count: number;
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
  const [scenario, setScenario] = React.useState<"Assume Present" | "Assume Absent">(
    "Assume Absent"
  );
  const [touched, setTouched] = React.useState(false);

  const { data: calendar, isPending } = useCalendar();

  if (!open) return null;

  // ✅ Compute working day count using valid date comparison
  function computeCount(): number {
    if (!calendar || !Array.isArray(calendar)) return 0;
    if (!start || !end) return 0;

    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) return 0;

    // Flatten all calendar days with correct YYYY-MM-DD format
    const allDays = calendar.flatMap((month) =>
      month.days.map((d) => {
        // Build proper date string: e.g., "2025-10-14"
        const monthIndex = new Date(`${month.month} 1, ${new Date().getFullYear()}`).getMonth() + 1;
        const paddedMonth = monthIndex.toString().padStart(2, "0");
        const paddedDay = d.date.toString().padStart(2, "0");
        const fullDateStr = `${new Date().getFullYear()}-${paddedMonth}-${paddedDay}`;
        return {
          date: new Date(fullDateStr),
          dayOrder: d.dayOrder,
        };
      })
    );

    // Filter valid working days in the selected range
    const workingDays = allDays.filter(
      (d) =>
        d.date >= s &&
        d.date <= e &&
        d.dayOrder !== "-" &&
        d.dayOrder.trim() !== ""
    );

    return workingDays.length;
  }

  const count = computeCount();

  const isInvalidRange = (() => {
    if (!start || !end) return true;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Number.isNaN(s) || Number.isNaN(e) || e < s;
  })();

  const handleApply = () => {
    if (isInvalidRange) return;
    onApply({
      start,
      end,
      scenario,
      count,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center card-surface z-50 px-4">
      <div className="relative w-full max-w-lg rounded-3xl border card-surface backdrop-blur-xl shadow-2xl">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl z-10">
            <GlobalLoader className="h-10 w-10 text-[#F59E0B]" />
          </div>
        )}

        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#E1E1E3]">Predict Attendance</h2>
              <p className="text-sm text-[#A5A6AA]">Simulate attendance scenarios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300 flex items-center justify-center"
          >
            <X size={18} className="text-[#A5A6AA]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#E1E1E3]">
                <Calendar size={16} className="text-[#22D3EE]" />
                Start Date
              </label>
              <input
                type="date"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  setTouched(true);
                }}
                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#E1E1E3] outline-none transition-all duration-300 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#E1E1E3]">
                <Calendar size={16} className="text-[#7C3AED]" />
                End Date
              </label>
              <input
                type="date"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                  setTouched(true);
                }}
                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#E1E1E3] outline-none transition-all duration-300 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
              />
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#E1E1E3]">Select Scenario</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScenario("Assume Present")}
                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                  scenario === "Assume Present"
                    ? "border-[#10B981] bg-[#10B981]/10"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle 
                    size={18} 
                    className={scenario === "Assume Present" ? "text-[#10B981]" : "text-[#A5A6AA]"} 
                  />
                  <span className={`font-semibold text-sm ${
                    scenario === "Assume Present" ? "text-[#10B981]" : "text-[#E1E1E3]"
                  }`}>
                    Present
                  </span>
                </div>
                <p className="text-xs text-[#A5A6AA] text-left">
                  Assume you attend all classes
                </p>
                {scenario === "Assume Present" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setScenario("Assume Absent")}
                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                  scenario === "Assume Absent"
                    ? "border-[#EF4444] bg-[#EF4444]/10"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <XCircle 
                    size={18} 
                    className={scenario === "Assume Absent" ? "text-[#EF4444]" : "text-[#A5A6AA]"} 
                  />
                  <span className={`font-semibold text-sm ${
                    scenario === "Assume Absent" ? "text-[#EF4444]" : "text-[#E1E1E3]"
                  }`}>
                    Absent
                  </span>
                </div>
                <p className="text-xs text-[#A5A6AA] text-left">
                  Assume you miss all classes
                </p>
                {scenario === "Assume Absent" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Working Days Result */}
          {touched && (
            <div className={`p-4 rounded-xl border ${
              isInvalidRange 
                ? "border-[#EF4444]/30 bg-[#EF4444]/10" 
                : "border-[#F59E0B]/30 bg-[#F59E0B]/10"
            }`}>
              {isInvalidRange ? (
                <div className="flex items-center gap-2">
                  <XCircle size={18} className="text-[#EF4444]" />
                  <p className="text-sm font-medium text-[#EF4444]">
                    Invalid date range selected
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#F59E0B]" />
                    <span className="text-sm font-medium text-[#E1E1E3]">
                      Working Days Found:
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#F59E0B]">{count}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-[rgba(255,255,255,0.1)]">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-[#E1E1E3] font-medium transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isInvalidRange || count === 0}
            className="flex-1 px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F59E0B] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            Apply Prediction
          </button>
        </div>
      </div>
    </div>
  );
}