"use client";
import { useAttendance, useDayOrder, useTimetable } from "@/hooks/query";
import React, { useState, useRef, useEffect } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { AttendanceDetail, DaySchedule } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { isCurrentClass } from "@/utils/currentClass";

const Page = () => {
  const { data, isPending } = useTimetable();
  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;
  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center ">
        No data found
      </div>
    );
  return <DayChange data={data} />;
};

export default Page;

const DayChange = ({ data }: { data: DaySchedule[] }) => {
  const day = data?.map((i) => i.dayOrder.split(" ")[1]);
  const [today, setToday] = useState<number>();
  const [dayOrder, setDayOrder] = useState<number>(0);

  const {
    data: dayOrderData,
    isLoading: dayOrderLoading,
    isError: dayOrderError,
    refetch: dayOrderRefetch,
    isFetching: dayOrderIsFetching,
  } = useDayOrder();

  useEffect(() => {
    if (dayOrderData) {
      const todayDayOrder = Number(dayOrderData.dayOrder);
      if (!isNaN(todayDayOrder)) {
        setToday(todayDayOrder);
        setDayOrder(todayDayOrder - 1);
        return;
      }
      setToday(0);
    }
  }, [dayOrderData]);

  return (
    <div className="w-full h-full flex flex-col overflow-auto scrollbar-none">
      <div className="w-full flex items-center justify-center gap-6 overflow-auto scrollbar-none">
        {/* Today */}
        <div
          onClick={() => {
            if (today && today !== 0) {
              setDayOrder(today - 1);
              return;
            }
          }}
          className="flex bg-white/10 pl-2 pr-1 py-0.5 rounded-full text-sm apply-border-sm items-center justify-center gap-3 cursor-pointer"
        >
          
          <h1>Todays DO</h1>
          <span
            className={`px-2.5 py-0.5 rounded-full text-sm apply-border-sm backdrop-blur-3xl bg-yellow-900 items-center flex ${
              dayOrderLoading
                ? "text-yellow-400"
                : today === 0 || dayOrderError
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {dayOrderLoading || dayOrderIsFetching ? (
              <GlobalLoader className="w-4 h-4 text-[color:var(--accent-secondary)]" />
            ) : dayOrderError ? (
              <span className="flex gap-2 items-center justify-center">
                <h1>Failed</h1>
                <button
                  onClick={() => dayOrderRefetch()}
                  className="px-2 py-0.5 btn-danger flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reload
                </button>
              </span>
            ) : today === 0 ? (
              "Holiday"
            ) : (
              today
            )}
          </span>
        </div>
      </div>

      <div className="w-full flex-shrink-0 h-[15%] py-5 scrollbar-none">
        <div className="relative max-w-100 mx-auto h-full flex items-center justify-center text-5xl lg:text-6xl font-extrabold tracking-wide">
          <span className="text-white/80">{day[dayOrder]}</span>
          <div
            onClick={() => {
              setDayOrder(dayOrder > 0 ? dayOrder - 1 : day.length - 1);
            }}
            className="absolute top-1/2 -translate-y-1/2 left-15 bg-white/10 p-1 apply-border-sm rounded-lg cursor-pointer shadow-2xl"
          >
            <Minus className="w-5 h-5" />
          </div>
          <div
            onClick={() => {
              setDayOrder(dayOrder < day.length - 1 ? dayOrder + 1 : 0);
            }}
            className="absolute top-1/2 -translate-y-1/2 right-15 bg-white/10 p-1 apply-border-sm rounded-lg cursor-pointer shadow-2xl"
          >
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-none h-[calc(100vh-200px)]">
        <Data data={data} dayorder={dayOrder} today={today} />
      </div>
    </div>
  );
};

const Data = ({
  data,
  dayorder,
  today,
}: {
  data: DaySchedule[];
  dayorder: number;
  today: number | undefined;
}) => {
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
    <div className="py-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-2 lg:px-5 overflow-auto scrollbar-none">
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
            className={`flex flex-col items-center gap-3 rounded-2xl panel min-h-50 shadow-2xl hover-glow-white ${
              current ? "border-yellow-400 glow-yellow panel-yellow scale-[1.05] " : ""
            }`}
          >
            {item.isClass ? (
              <div className="w-full h-full text-white/70 flex flex-col gap-4">
                <div className="flex justify-between w-full px-2 min-h-12 items-center border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="tag tag-info">
                      {item.courseType?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                   
                    <span className="tag tag-info">{item.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center w-[80%] h-full mx-auto  flex-col gap-3">
                  <h1 className="w-full text-white font-extrabold">{item.courseTitle}</h1>
                  <h2 className="text-sm text-white/60 flex gap-2 w-full">
                    <span className="text-white/80">Class Room</span> -
                    <span className="text-yellow-300">{item.courseRoomNo}</span>
                  </h2>
                </div>

                {attendance ? (
                  <AttendanceData attendance={attendance} />
                ) : !isError ? (
                  <div className="w-full min-h-12 flex justify-center items-center animate-pulse">
                    <span className="tag tag-info">
                      Getting Attendance data
                    </span>
                  </div>
                ) : (
                  <div className="w-full min-h-12 flex justify-center items-center">
                    <span className="tag tag-error">
                      Failed to get Attendance data
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="justify-between h-full w-full flex flex-col">
                <div className="w-full h-12 flex items-center justify-between px-2">
                  <div>
                    {current && (
                      <span className="background-rounded apply-border-sm  flex gap-2 items-center justify-center">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute animate-ping inset-0 rounded-full bg-blue-400 opacity-75"></span>
                          <span className="rounded-full h-1.5 w-1.5 bg-blue-500 apply-inner-shadow-sm m-auto"></span>
                        </span>
                        <h1>Now</h1>
                      </span>
                    )}
                  </div>
                  <div className="background-rounded apply-border-sm">
                    {item.time}
                  </div>
                </div>
                <div className="h-full flex justify-center items-center att-red">
                  No class
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const AttendanceData = ({ attendance }: { attendance: AttendanceDetail }) => {
  return (
    <div className="justify-between flex">
    <div className="flex w-full px-2 min-h-12 items-center overflow-auto scrollbar-none ">
      <h1
        className={`px-3 py-1 rounded-full text-sm apply-border-sm bg-black ${
          Number(attendance.courseAttendance) <= 75
            ? "text-red-400"
            : "text-green-400"
        }`}
      >
        {attendance.courseAttendance} %
      </h1>
      </div>

      <div className=" px-2 rounded-full text-sm gap-2 flex items-center">
        <h1 className="capitalize">
          {attendance.courseAttendanceStatus?.status}
        </h1>
        <span
          className={`px-2 py-0.5 rounded-full text-sm apply-border-sm bg-black ${
            attendance.courseAttendanceStatus?.status === "required"
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {attendance.courseAttendanceStatus?.classes}
        </span>
      </div>
    
    </div>
  );
};
