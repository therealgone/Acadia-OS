"use client";

import React, { useState, useEffect, useRef } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useAttendance, useDayOrder, useTimetable } from "@/hooks/query";
import { AttendanceDetail, DaySchedule } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { isCurrentClass } from "@/utils/currentClass";

export default function Page() {
  const { data, isPending } = useTimetable();

  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;
  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center text-white/70">
        No data found
      </div>
    );

  return <DayChange data={data} />;
}

function DayChange({ data }: { data: DaySchedule[] }) {
  const day = data?.map((i) => i.dayOrder.split(" ")[1]);
  const [today, setToday] = useState<number>(0);
  const [dayOrder, setDayOrder] = useState<number>(0);

  const { data: dayOrderData, isLoading, isError, refetch, isFetching } =
    useDayOrder();

  useEffect(() => {
    if (dayOrderData) {
      const todayDayOrder = Number(dayOrderData.dayOrder);
      if (!isNaN(todayDayOrder)) {
        setToday(todayDayOrder);
        setDayOrder(todayDayOrder - 1);
      }
    }
  }, [dayOrderData]);

  return (
    <div className="w-full h-full flex flex-col  scrollbar-none">
      {/* Header */}
      <div className="w-full flex justify-center py-4">
  <div
    onClick={() => {
      if (today && today !== 0) setDayOrder(today - 1);
    }}
    className="
      relative flex items-center justify-between gap-4
      w-[180px] sm:w-[220px] px-4 py-2
      bg-gradient-to-r from-white/5 to-white/10
      backdrop-blur-md
      rounded-xl
      shadow-md hover:shadow-yellow-400/50
      cursor-pointer
      transition-all duration-300
      hover:scale-105
    "
  >
    {/* Label */}
    <span className="text-sm text-white/70 font-medium tracking-wide">
      Today&apos;s DO
    </span>

    {/* Day Order */}
    <span
      className={`
        px-3 py-1.5 rounded-lg text-sm font-semibold
        flex items-center justify-center
        backdrop-blur-sm
        ${
          isLoading
            ? "bg-white/10 text-yellow-400 glow-yellow animate-pulse"
            : today === 0 || isError
            ? "bg-red-600/20 text-red-400"
            : ""
        }
      `}
    >
      {isLoading || isFetching ? (
        <GlobalLoader className="w-4 h-4 text-yellow-400" />
      ) : isError ? (
        <div className="flex items-center gap-1">
          <span>Failed</span>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/30 hover:bg-red-500/50 text-xs text-white"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      ) : today === 0 ? (
        "Holiday"
      ) : (
        today
      )}
    </span>

    {/* Glow effect */}
    {today && today !== 0 && !isError && (
      <span className="absolute -inset-1 rounded-xl bg-yellow-400/20 blur-md animate-pulse pointer-events-none"></span>
    )}
  </div>
</div>

      {/* Day order navigation */}
      <div className="flex justify-center items-center relative h-[10%] text-5xl font-extrabold tracking-wide">
        <span className="text-white/80">{day[dayOrder]}</span>
        <button
          onClick={() =>
            setDayOrder(dayOrder > 0 ? dayOrder - 1 : day.length - 1)
          }
          className="absolute left-10 bg-white/10 p-1 rounded-lg cursor-pointer hover:scale-105 transition"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            setDayOrder(dayOrder < day.length - 1 ? dayOrder + 1 : 0)
          }
          className="absolute right-10 bg-white/10 p-1 rounded-lg cursor-pointer hover:scale-105 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1  scrollbar-none">
        <Data data={data} dayorder={dayOrder} today={today} />
      </div>
    </div>
  );
}

function Data({
  data,
  dayorder,
  today,
}: {
  data: DaySchedule[];
  dayorder: number;
  today: number;
}) {
  const { data: attendanceData, isError } = useAttendance();
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRef.current && today !== 0) {
      currentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [today, dayorder]);

  return (
    <div className="flex flex-col gap-4 px-5 py-3 w-full">
      {data[dayorder].class.map((item) => {
        const attendance = attendanceData?.find(
          (i) =>
            i.courseCode === item.courseCode &&
            ((item.slot.startsWith("P") && i.courseSlot === "LAB") ||
              !item.slot.startsWith("P"))
        );

        const current =
          today && today !== 0 && dayorder === today - 1
            ? isCurrentClass(item.time)
            : undefined;

        return (
          <div
            key={item.time}
            ref={current ? currentRef : undefined}
            className={`w-full flex flex-col p-4 rounded-2xl  transition-all duration-300 shadow-lg ${
              current
                ? "border-yellow-400 glow-yellow scale-[1.02]"
                : "hover:scale-[1.01]"
            } ${item.courseType?.includes("Theory") &&  !item.slot.startsWith("P")
             ?"bg-blue-500/20 text-blue-300"
            : item.courseType?.includes("Lab") || item.courseType?.includes("Theory") && item.slot.startsWith("P")
             ?"bg-orange-500/20 text-orange-300"
            :"panel"}`}>
            {item.isClass ? (
              <>
                <div className={`flex justify-between items-center mb-2 border-b border-white/20 pb-2 ${item.courseType?.includes("Theory") &&  !item.slot.startsWith("P")
             ?" text-blue-300"
            : item.courseType?.includes("Lab") || item.courseType?.includes("Theory") && item.slot.startsWith("P")
             ?" text-orange-300"
            :"panel"}`}>
                  <div className="flex items-center gap-2">
                    <span className="tag tag-success">
                      {item.courseType?.charAt(0)}
                    </span>
                    <span className=" font-semibold">
                      {item.courseTitle}
                    </span>
                  </div>
                  <span className="tag tag-success">{item.time}</span>
                </div>

                <div className="flex justify-between items-center">
                  <h2 className="text-sm ">
                    <span className="">Room</span> -{" "}
                    <span className="">
                      {item.courseRoomNo}
                    </span>
                  </h2>

                  {attendance ? (
                    <AttendanceData attendance={attendance} />
                  ) : !isError ? (
                    <span className="tag tag-info animate-pulse">
                      Loading Attendance...
                    </span>
                  ) : (
                    <span className="tag tag-error">
                      Failed to get data
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center text-white/60">
                <span>{item.time}</span>
                <span className="tag tag-error">No class</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AttendanceData({ attendance }: { attendance: AttendanceDetail }) {
  const isLow = Number(attendance.courseAttendance) <= 75;

  return (
    <div className="flex items-center gap-3">
      <span
        className={`px-3 py-1 rounded-full text-sm bg-black border ${
          isLow ? "text-red-400 border-red-500" : "text-green-400 border-green-500"
        }`}
      >
        {attendance.courseAttendance}%
      </span>
      
    </div>
  );
}
