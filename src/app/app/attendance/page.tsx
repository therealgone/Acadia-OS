"use client";
import { useAttendance } from "@/hooks/query";
import React, { useMemo, useCallback, Suspense } from "react";
import { AttendanceDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { computePredict } from "@/utils/attendancePredict";
import { PredictSelection } from "./PredictModal";
import dynamic from "next/dynamic";

// Lazy load PredictModal for better performance
const PredictModal = dynamic(() => import("./PredictModal").then(mod => ({ default: mod.PredictModal })), {
  loading: () => <GlobalLoader className="h-6 w-6 text-blue-400" />,
  ssr: false,
});

const Page = React.memo(() => {
  const { data, isPending } = useAttendance();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selection, setSelection] = React.useState<PredictSelection | null>(null);

  const handleModalOpen = useCallback(() => setModalOpen(true), []);
  const handleModalClose = useCallback(() => setModalOpen(false), []);
  const handleSelectionReset = useCallback(() => setSelection(null), []);
  const handleSelectionApply = useCallback((sel: PredictSelection) => setSelection(sel), []);

  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;

  if (!data || !Array.isArray(data) || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center text-white/70">
        No Attendance Data Found
      </div>
    );


  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex flex-row md:flex-row items-center justify-between w-full px-4 lg:px-6 gap-3">
        {/* Scenario Info */}
        <div className="order-2 text-center text-sm text-white/70 w-full md:w-auto">
          {selection ? (
            <>
              Scenario:{" "}
              <span className="font-extrabold tag tag-orange">
                {selection.scenario}
              </span>{" "}
              Total Classes:{" "}
              <span className="font-bold m-1 tag-warning">
                {Object.values(selection.classCountsPerCourse).reduce((sum, count) => sum + count, 0)}
              </span>
            </>
          ) : (
            ""
          )}
        </div>

        {/* Left: Reset button */}
        <div className="order-1">
          {selection && (
            <button
              className="px-3 py-1.5 rounded-full btn transition"
              onClick={handleSelectionReset}
            >
              Reset
            </button>
          )}
        </div>

        {/* Right: Predict button */}
        <div className="order-3">
          <button
            className="px-3 py-1.5 btn text-white font-medium transition rounded-full"
            onClick={handleModalOpen}
          >
            Predict
          </button>
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
  const filtered = useMemo(() => 
    data.filter((i) => {
      if (category === "theory") {
        // Theory: courseSlot is not "LAB"
        return i.courseSlot !== "LAB";
      } else if (category === "practical") {
        // Practical: courseSlot is "LAB"
        return i.courseSlot === "LAB";
      }
      return false;
    }),
    [data, category]
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg text-white font-semibold px-3 lg:px-6">{title}</h2>
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
  const { attended, total, required } = useMemo(() => ({
    attended: item.courseConducted - item.courseAbsent,
    total: item.courseConducted,
    required: 75,
  }), [item.courseConducted, item.courseAbsent]);

  // Get the class count for THIS specific course with proper theory/lab distinction
  const { futureAttendInc, futureTotalInc } = useMemo(() => {
    if (!selection) return { futureAttendInc: 0, futureTotalInc: 0 };

    // Use the same key generation logic as PredictModal
    // This should match exactly what PredictModal generates
    const key = item.courseSlot === "LAB" ? `${item.courseCode}Lab` : `${item.courseCode}Theory`;
    
    // Get class count ONLY for this specific component (theory or lab)
    // Theory and lab are completely separate - no sharing of values
    const classCount = selection.classCountsPerCourse[key] || 0;
    
    // Removed dev logs for performance

    return {
      futureTotalInc: classCount,
      futureAttendInc: selection.scenario === "Assume Present" ? classCount : 0,
    };
  }, [selection, item.courseCode, item.courseSlot]);

  const predict = useMemo(() => computePredict({
    attended: attended + futureAttendInc,
    total: total + futureTotalInc,
    requiredPercentage: required,
    windowSize: 10,
  }), [attended, futureAttendInc, total, futureTotalInc, required]);

  const { attendancePct, isTheory } = useMemo(() => ({
    attendancePct: Number(item.courseAttendance),
    isTheory: item.courseSlot !== "LAB",
  }), [item.courseAttendance, item.courseSlot]);

  return (
    <div className={`w-full backdrop-blur-sm rounded-2xl transition-all duration-300
    ${isTheory
      ? " panel panel-blue-slate-bg"
      : "panel-orange-muted-bg panel"}`}>
      <div className="flex flex-col gap-2 p-4">
        {/* Top Row */}
        <div className="flex flex-wrap justify-between items-center text-white/80 text-sm">
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-white/90">{item.courseCode}</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                isTheory
                  ? " panel panel-blue-slate-bg"
                  : "panel-orange-muted-bg panel"
              }`}
            >
              {item.courseCategory}
            </span>
          </div>
          <div>
            <span className="tag-orange px-1.5 py-0.5 rounded-full">
              {attended}/{total}
            </span>
          </div>
          <div>
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
            className={`h-full rounded-full transition-all duration-700 ${
              attendancePct >= 75 ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              width: `${Math.min(attendancePct, 100)}%`
            }}
          ></div>
        </div>
              
        {/* Prediction Info */}
        <div className="flex justify-between text-xs text-white mt-2 text-center">
          <div>
            <p className="text-[10px]">Predicted</p>
            <span className={`font-extrabold text-blue-500 ${
              selection ? predict.currentPct >= 75 ? "text-green-500" : "text-red-500" : ""
            }`}>
              {selection ? predict.currentPct : "-"}
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
      <div className="seo-hidden">SRM, SRM KTR, Acadia OS, AcadiaOS, acadiaos srm, Acadia, Acadia SRM, Acadia Asia SRM, SRM Acadia, Student Dashboard, Attendance, Timetable, Calendar, Exam Schedule, GPA Calculator, Marks Calculator, College Timetable, College Attendance Tracker, SRM Students, Academia, academia.srmist, academia.srmist.edu.in, Acadia Design, Acadia Dashboard, College Calendar, SRM Timetable, SRM Attendance, Acadia Portal, SRM Portal, Acadia OS Features, College Management, Student Tools, Academic Planner, Acadia OS SRM KTR, SRM University Tools, Student Performance Tracker, Semester GPA, SRM Academic Dashboard,exam schedule acadia,acadia design </div>
     
    </div>
  );
});

Card.displayName = 'AttendanceCard';