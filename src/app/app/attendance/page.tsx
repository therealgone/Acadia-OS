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
      <div className="flex h-full w-full justify-center items-center">
        No data found
      </div>
    );

  return (
    <div className="flex flex-col gap-6 py-4 ">
      <div className="flex items-center justify-between px-2 lg:px-5">
        <h1 className="text-2xl neon-underline" style={{fontWeight:700}}>Attendance</h1>
        <button className="px-3 py-1.5 rounded btn-modern" onClick={() => setModalOpen(true)}>
          Predict
        </button>
      </div>
      <h2 className="text-lg text-white/60 px-2 lg:px-5" style={{fontWeight:500}}>Theory</h2>
      <Data data={data} category="theory" selection={selection} />
      <h2 className="text-lg text-white/60 px-2 lg:px-5" style={{fontWeight:500}}>Practical</h2>
      <Data data={data} category="practical" selection={selection} />

      <PredictModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={(sel) => setSelection(sel)}
      />
    </div>
  );
};

export default Page;

const Data = ({
  data,
  category,
  selection = null,
}: {
  data: AttendanceDetail[];
  category: string;
  selection: PredictSelection | null;
}) => {
  const filteredData = data.filter(
    (i) => i.courseCategory.toLowerCase() === category
  );
  return (
    <div className="py-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 lg:px-5">
      {filteredData.map((item, i) => {
        const attended = item.courseConducted - item.courseAbsent;
        const total = item.courseConducted;
        const r = 75;
        let futureAttendInc = 0;
        let futureTotalInc = 0;
        if (selection) {
          futureTotalInc = selection.count;
          if (selection.scenario === "attend") futureAttendInc = selection.count;
        }
        const predict = computePredict({
          attended: attended + futureAttendInc,
          total: total + futureTotalInc,
          requiredPercentage: r,
          windowSize: 10,
        });
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-2xl panel min-h-50 shadow-2xl hover-glow-white"
          >
            <div className="w-full h-full text-white/70  flex flex-col gap-4 ">
              <div className="flex justify-between w-full px-3 min-h-12 items-center border-b border-dotted border-[color:var(--border-strong)]/40">
                <div className="flex gap-1 px-1 py-0.5 rounded-full text-sm">
                  <h1 className="tag tag-info">
                    {item.courseConducted}
                  </h1>
                  <span className="tag tag-success ">
                    {item.courseConducted - item.courseAbsent}
                  </span>
                </div>
                {item.courseCode}
                <span
                  className={`tag ${
                    Number(item.courseAttendance) >= 75
                      ? "tag-success"
                      : "tag-error"
                  }`}
                >
                  {item.courseAttendance} %
                </span>
              </div>
              <div className=" flex items-center justify-center w-[92%] h-full mx-auto ">
                {item.courseTitle}
              </div>
              <div className="flex justify-between w-full px-3 min-h-12 items-center  ">
                <h1 className=" tag tag-info">
                  {item.courseCategory}
                </h1>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="tag tag-info px-2 py-1 text-center">
                    <div className="text-[10px] text-[var(--text-muted)]">Pred</div>
                    <div className="font-medium att-yellow">{predict.currentPct}%</div>
                  </div>
                  <div className="tag tag-success px-2 py-1 text-center">
                    <div className="text-[10px] text-[var(--text-muted)]">Margin</div>
                    <div className="font-medium att-green">{Math.max(0, predict.mMaxSkipsAllowed)}</div>
                  </div>
                  <div className="tag tag-error px-2 py-1 text-center">
                    <div className="text-[10px] text-[var(--text-muted)]">Req</div>
                    <div className="font-medium att-red">{predict.xMinConsecutiveToReachR ?? "∞"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
