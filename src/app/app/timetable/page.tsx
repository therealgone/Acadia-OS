"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";

import { useAttendance, useDayOrder, useTimetable } from "@/hooks/query";
import { AttendanceDetail, DaySchedule } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { isCurrentClass } from "@/utils/currentClass";

const Page = React.memo(() => {
  const { data, isPending } = useTimetable();

  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;
  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center text-white/70">
        No data found
      </div>
    );

  return (
    <Suspense fallback={<GlobalLoader className="h-8 w-8 text-blue-400" />}>
      <DayChange data={data} />
    </Suspense>
  );
});

Page.displayName = 'TimetablePage';

export default Page;

const DayChange = React.memo(({ data }: { data: DaySchedule[] }) => {
  // Memoize day extraction to prevent recalculation
  const day = useMemo(() => data?.map((i) => i.dayOrder.split(" ")[1]), [data]);
  const [today, setToday] = useState<number>(0);
  const [dayOrder, setDayOrder] = useState<number>(0);

  const { data: dayOrderData, isLoading, isError, refetch, isFetching } =
    useDayOrder();

  // Memoize day order update effect
  useEffect(() => {
    if (dayOrderData) {
      const todayDayOrder = Number(dayOrderData.dayOrder);
      if (!isNaN(todayDayOrder)) {
        setToday(todayDayOrder);
        setDayOrder(todayDayOrder - 1);
      }
    }
  }, [dayOrderData]);

  // Memoize current day data
  const isActive = useMemo(() => data[dayOrder], [data, dayOrder]);

  // Memoize day order click handler
  const handleDayOrderClick = useCallback((index: number) => {
    setDayOrder(index);
  }, []);

  // Memoize today click handler
  const handleTodayClick = useCallback(() => {
    if (today && today !== 0) setDayOrder(today - 1);
  }, [today]);

  return (
    <div className="w-full h-full flex flex-col  scrollbar-none">
      {/* Header */}
      <div className="w-full flex justify-center py-4">
  <div
    onClick={handleTodayClick}
    className="
      relative flex items-center justify-between gap-4
      w-[200px] sm:w-[300px] px-4 py-2
      tag-orange
      backdrop-blur-md
      rounded-xl
      glow-orange 
      cursor-pointer
      transition-all duration-300
      hover:scale-105
    "
  >
    {/* Label */}
    <span className="text-sm text-white/70 font-medium tracking-wider whitespace-nowrap">
      Today&apos;s DO
    </span>

    {/* Day Order */}
    <span
      className={`
        xl:lg:md:px-3 xl:lg:md:py-1.5 px-3 py-1 rounded-lg text-sm font-semibold
        flex items-center justify-center
        
        ${
          isLoading
            ? "  tag-warning tag "
            : today === 0 || isError
            ? ""
            : ""
        }
      `}
    >
      {isLoading || isFetching ? (
        <GlobalLoader className="w-4 h-4 text-yellow-400" />
      ) : isError ? (
        <div className="flex  items-center gap-1">
          <span>Failed</span>
          <button
            onClick={() => refetch()}
            className="flex  items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/30 hover:bg-red-500/50 text-xs text-white"
          >
           
          </button>
        </div>
      ) : today === 0 ? (
        "Hoilday"
      ) : (
        today
      )}
    </span>

    {/* Glow effect */}
    {today  !== 0 && !isError && (
      <span className="absolute -inset-1 rounded-xl  blur-md text-yellow-500 pointer-events-none"></span>
    )}
  </div>
</div>

      {/* Day order navigation */}
      
      <div className="flex justify-center xl:lg:md:gap-50 gap-6  p-3  items-center   md:text-4xl font-extrabold tracking-wide  ">
     {Array.from({ length: 5 }).map((_, index) => (
    <button
      key={index}
      onClick={() => handleDayOrderClick(index)}
      className={`px-4 py-2 rounded-2xl  hover-glow hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]  transition-all duration-300 shadow-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 
        ${dayOrder === index ? "panel-red-bg -translate-y-1 " : "bg-white/10"}
      `}
    >
      {index + 1}
    </button>
  ))}
    
      </div>

      <div className="flex-1  scrollbar-none">
        <Data data={data} dayorder={dayOrder} today={today} />
      </div>
    </div>
  );
});

DayChange.displayName = 'DayChange';

const Data = React.memo(({
  data,
  dayorder,
  today,
}: {
  data: DaySchedule[];
  dayorder: number;
  today: number;
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

  

  // Memoize current day classes
  const currentDayClasses = useMemo(() => {
    if (!data[dayorder]) return [];
    return data[dayorder].class.filter(item => item.isClass);
  }, [data, dayorder]);

  

  return (
    <div className="flex flex-col gap-4 px-5 py-3 w-full">
      {currentDayClasses.map((item) => {
     
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
                <div className={`flex justify-between items-center mb-2  pb-2 ${item.courseType?.includes("Theory") &&  !item.slot.startsWith("P")
             ?" text-blue-300"
            : item.courseType?.includes("Lab") || item.courseType?.includes("Theory") && item.slot.startsWith("P")
             ?" text-orange-300"
            :"panel"}`}>

                  <div className="items-center "> 
                    <span className="tag tag-lime">
                      {item.courseType?.charAt(0)}
                    </span>
                    </div>
                    
                    <div className="items-center "> 
                   
                    <span className="tag text-white  tracking-wider font-bold">
                      
                      {item.time}</span>
                    </div>
                  
                  
                  
                </div>
               
                 <div className="border-b border-white/20 flex  pb-2 text-center mb-2">
                <span className=" font-extrabold truncate w-auto  ">
                      {item.courseTitle}
                    </span>
                  </div>

                <div className="flex justify-between items-center ">
                  <h2 className="text-sm  tag tag-purple  rounded-full px-1 backdrop-blur-3xl ">
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
             <div className="sm:hidden "></div>
            )}
          </div>
        );
      })
      }
      
    </div>
  );
});

Data.displayName = 'TimetableData';


const AttendanceData = React.memo(({ attendance }: { attendance: AttendanceDetail }) => {
  // Memoize attendance percentage calculation
  const attendancePct = useMemo(() => Number(attendance.courseAttendance), [attendance.courseAttendance]);
  const isLow = useMemo(() => attendancePct <= 75, [attendancePct]);

  return (
    <div className="flex items-center gap-3">
      <span
        className={`px-3 py-1 rounded-full text-sm bg-black border ${
          isLow ? "tag tag-error" : "tag tag-success"
        }`}
      >
        {attendancePct}%
      </span>
      
    </div>
  );
});

AttendanceData.displayName = 'AttendanceData';
