"use client";
import { useAttendance } from "@/hooks/query";
import React from "react";
import { AttendanceDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { computePredict } from "@/utils/attendancePredict";
import { PredictModal, PredictSelection } from "./PredictModal";

const Page = () => {
  const { data, isPending } = useAttendance();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selection, setSelection] = React.useState<PredictSelection | null>(null);

  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;

  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center text-white/70">
        No attendance data found
      </div>
    );

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between  px-3 lg:px-6 gap-2">
        <div className="text-sm text-white/70">
          {selection ? (
            <>
              Scenario: <span className="font-medium">{selection.scenario}</span> •
              Range: <span className="font-medium">{selection.count}</span>
            </>
          ) : (
            "Predict attendance based on date range"
          )}
        </div>
        <div className="flex items-center  gap-2">
          {selection && (
            <button
              className="px-3 py-1.5 rounded  bg-white/10 border border-white/20 hover:bg-white/20 transition"
              onClick={() => setSelection(null)}
            >
              Reset
            </button>
          )}
          <button
            className="px-3 py-1.5 rounded bg-blue-500/80 hover:bg-blue-500 text-white font-medium transition"
            onClick={() => setModalOpen(true)}
          >
            Predict
          </button>
        </div>
      </div>

      {/* Sections */}
      <Section title="Theory" data={data} category="theory" selection={selection} />
      <Section title="Practical" data={data} category="practical" selection={selection} />

      <PredictModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={(sel) => setSelection(sel)}
      />
    </div>
  );
};

export default Page;

const Section = ({
  title,
  data,
  category,
  selection,
}: {
  title: string;
  data: AttendanceDetail[];
  category: string;
  selection: PredictSelection | null;
}) => {
  const filtered = data.filter(
    (i) => i.courseCategory.toLowerCase() === category
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg text-white/80 font-semibold px-3 lg:px-6">{title}</h2>
      <div className="flex flex-col gap-3 px-3 lg:px-6">
        {filtered.map((item, i) => (
          <Card key={i} item={item} selection={selection} />
        ))}
      </div>
    </div>
  );
};

const Card = ({
  item,
  selection,
}: {
  item: AttendanceDetail;
  selection: PredictSelection | null;
}) => {
  const attended = item.courseConducted - item.courseAbsent;
  const total = item.courseConducted;
  const required = 75;

  let futureAttendInc = 0;
  let futureTotalInc = 0;

  if (selection) {
    futureTotalInc = selection.count;
    if (selection.scenario === "attend") futureAttendInc = selection.count;
  }

  const predict = computePredict({
    attended: attended + futureAttendInc,
    total: total + futureTotalInc,
    requiredPercentage: required,
    windowSize: 10,
  });

  const attendancePct = Number(item.courseAttendance);
  const isTheory = item.courseCategory.toLowerCase() === "theory";
  const color = isTheory ? "#3B82F6" : "#FB923C"; // blue or orange

  return (
    <div className="w-full bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/[0.06] transition-all duration-300">
      <div className="flex flex-col gap-2 p-4">
        {/* Top Row */}
        <div className="flex flex-wrap justify-between items-center text-white/80 text-sm">
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-white/90">{item.courseCode}</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                isTheory
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-orange-500/20 text-orange-300"
              }`}
            >
              {item.courseCategory}
            </span>
          </div>
          <div>
            <span className="font-semibold">
              {attended}/{total}
            </span>
            <span
              className={`ml-2 font-semibold ${
                attendancePct >= 75 ? "text-green-400" : "text-red-400"
              }`}
            >
              {attendancePct}%
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-white/90 font-medium">{item.courseTitle}</div>

        {/* Attendance Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(attendancePct, 100)}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>

        {/* Prediction Info */}
        <div className="flex justify-between text-xs text-white/70 mt-2">
          <div>
            <p className="text-[10px]">Predicted</p>
            <span className="font-semibold text-yellow-400">
              {predict.currentPct}%
            </span>
          </div>
          <div>
            <p className="text-[10px]">Margin</p>
            <span className="font-semibold text-green-400">
              {Math.max(0, predict.mMaxSkipsAllowed)}
            </span>
          </div>
          <div>
            <p className="text-[10px]">Need to Attend</p>
            <span className="font-semibold text-red-400">
              {predict.xMinConsecutiveToReachR ?? "∞"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
