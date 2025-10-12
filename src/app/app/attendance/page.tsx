"use client";
import { useAttendance } from "@/hooks/query";
import React, { useMemo, useCallback, Suspense, useState, useEffect,useRef } from "react";
import { AttendanceDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { computePredict } from "@/utils/attendancePredict";
import { PredictSelection } from "./PredictModal";
import dynamic from "next/dynamic";
import { attendance } from "@/server/action";

// Lazy load PredictModal for better performance
const PredictModal = dynamic(() => import("./PredictModal").then(mod => ({ default: mod.PredictModal })), {
  loading: () => <GlobalLoader className="h-6 w-6 text-blue-400" />,
  ssr: false, // Disable SSR for this component since it's modal
});

const Page = React.memo(() => {
  const { data, isPending } = useAttendance();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selection, setSelection] = React.useState<PredictSelection | null>(null);
  

  // Memoize modal handlers to prevent unnecessary re-renders
  const handleModalOpen = useCallback(() => setModalOpen(true), []);
  const handleModalClose = useCallback(() => setModalOpen(false), []);
  const handleSelectionReset = useCallback(() => setSelection(null), []);
  const handleSelectionApply = useCallback((sel: PredictSelection) => setSelection(sel), []);



  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;

  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center text-white/70">
        No Attendance Data Found
      </div>
    );

  return (
    <div className="flex flex-col gap-6 py-4 ">
      {/* Header */}
      <div className="flex flex-wrap  items-center justify-between  px-3 lg:px-6 gap-2 ">
        
        <div className=" flex">
          {selection && (
            <button
              className="px-3 py-1.5 rounded-full  bg-white/10 border border-white/20 hover:bg-white/20 transition"
              onClick={handleSelectionReset}
            >
              Reset
            </button>
          )}
          </div>
         <div className=" flex-10 text-sm text-white/70 items-center  text-center  hidden md:block px-5 py-5 -mb-5   ">
          {selection ? (
            <>
              Scenario: <span className="font-extrabold text-blue-500">{selection.scenario}</span> •
              No of Days: <span className="font-extrabold text-blue-500">{selection.count}</span>
            </>
          ) : (
            ""
          )}
        </div>
          <div className="  absolute right-5 top-20 lg:static xl:static md:static md:flex-11  md:flex ">
          <button
            className="px-3 py-1.5  bg-blue-500/80 hover:bg-blue-500 text-white font-medium transition rounded-full  "
            onClick={handleModalOpen}
          >
            Predict
          </button>
          </div>
          <div className="text-sm text-white/70 flex  sm:hidden px-5 py-5 -mb-5  ">
          {selection ? (
            <>
              Scenario: <span className="font-extrabold text-blue-500">{selection.scenario}</span> •
              No of Days: <span className="font-extrabold text-blue-500">{selection.count}</span>
            </>
          ) : (
            ""
          )}
        </div>
        
        
      </div>

      {/* Sections */}
      <Suspense fallback={<GlobalLoader className="h-8 w-8 text-blue-400" />}>
        <Section title="Theory" data={data} category="theory" selection={selection} />
        <Section title="Practical" data={data} category="practical" selection={selection} />
      </Suspense>

      <PredictModal
        open={modalOpen}
        onClose={handleModalClose}
        onApply={handleSelectionApply}
      />
    </div>
  );
});

Page.displayName = 'AttendancePage';

export default Page;

const Section = React.memo(({
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
  // Memoize filtered data to prevent recalculation on every render
  const filtered = useMemo(() => 
    data.filter((i) => i.courseCategory.toLowerCase() === category),
    [data, category]
  );

  return (
    <div className="flex flex-col gap-3 ">
      <h2 className="text-lg text-white/80 font-semibold px-3 lg:px-6">{title}</h2>
      <div className="flex flex-col gap-3 px-3 lg:px-6">
        {filtered.map((item, i) => (
          <Card key={i} item={item} selection={selection} />
        ))}
      </div>
    </div>
  );
});

Section.displayName = 'AttendanceSection';

const Card = React.memo(({
  item,
  selection,
}: {
  item: AttendanceDetail;
  selection: PredictSelection | null;
}) => {
  // Memoize calculations to prevent recalculation on every render
  const { attended, total, required } = useMemo(() => ({
    attended: item.courseConducted - item.courseAbsent,
    total: item.courseConducted,
    required: 75,
  }), [item.courseConducted, item.courseAbsent]);

  const { futureAttendInc, futureTotalInc } = useMemo(() => {
    if (!selection) return { futureAttendInc: 0, futureTotalInc: 0 };
    return {
      futureTotalInc: selection.count,
      futureAttendInc: selection.scenario === "Assume Present" ? selection.count : 0,
    };
  }, [selection]);

  const predict = useMemo(() => computePredict({
    attended: attended + futureAttendInc,
    total: total + futureTotalInc,
    requiredPercentage: required,
    windowSize: 10,
  }), [attended, futureAttendInc, total, futureTotalInc, required]);

  const { attendancePct, isTheory, color } = useMemo(() => ({
    attendancePct: Number(item.courseAttendance),
    isTheory: item.courseCategory.toLowerCase() === "theory",
    color: item.courseCategory.toLowerCase() === "theory" ? "#3B82F6" : "#FB923C",
  }), [item.courseAttendance, item.courseCategory]);



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
            <span className=" tag-orange px-1.5 py-0.5 rounded-full">
              {attended}/{total}
            </span>
            </div>
            <div className=" ">
            <span
              className={`ml-2 font-semibold rounded-full px-1.5 py-0.5 ${
                attendancePct >= 75 ? "tag-success" : "tag-warning"
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
            className={`h-full rounded-full transition-all duration-700  ${attendancePct >= 75 ? "bg-green-500" : 'bg-red-500'}`}
            style={{
              width: `${Math.min(attendancePct, 100)}%`
              
            }}
          ></div>
        </div>

        {/* Prediction Info */}
        <div className="flex justify-between text-xs text-white/70 mt-2 text-center ">
          <div>
            <p className="text-[10px]">Predicted</p>
            <span className={`font-extrabold text-blue-500 ${selection ? predict.currentPct >= 75 ? "text-green-500": "text-red-500" : ""} `}>
              {selection ? predict.currentPct : " - " }
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
});

Card.displayName = 'AttendanceCard';
