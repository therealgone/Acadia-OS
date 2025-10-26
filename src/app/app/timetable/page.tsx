"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";

import { useAttendance, useDayOrder, useTimetable, useCalendar } from "@/hooks/query";
import { AttendanceDetail, DaySchedule  } from "@/SRM-SCRAPPER";

import { GlobalLoader } from "../components/loader";
import { isCurrentClass } from "@/utils/currentClass";
import { getCurrentDayOrder } from "@/utils/getCurrentDayOrder";
import { getDayOrderFromTimetable } from "@/utils/getDayOrderFromTimetable";
import { attendance } from "@/server/action";
const Page = React.memo(() => {
  const { data, isPending } = useTimetable();



  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;
  if (!data || !Array.isArray(data) || data.length === 0)
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
  const [today, setToday] = useState<number>(0);
  const [dayOrder, setDayOrder] = useState<number>(0);

  const { data: dayOrderData, isLoading, isError, refetch, isFetching } =
    useDayOrder();
  
  const { data: calendarData, isLoading: calendarLoading } = useCalendar();

  // Memoize day order update effect - try multiple sources
  useEffect(() => {
    let currentDayOrder = 0;
    
    // First try to get day order from calendar data
    if (calendarData && Array.isArray(calendarData) && calendarData.length > 0) {
      currentDayOrder = getCurrentDayOrder(calendarData);
    }
    
    // If calendar didn't work, try timetable data
    if (currentDayOrder === 0 && data && Array.isArray(data) && data.length > 0) {
      currentDayOrder = getDayOrderFromTimetable(data);
    }
    
    // If timetable didn't work, try the API
    if (currentDayOrder === 0 && dayOrderData && typeof dayOrderData === 'object' && 'dayOrder' in dayOrderData) {
      const todayDayOrder = Number(dayOrderData.dayOrder);
      if (!isNaN(todayDayOrder)) {
        currentDayOrder = todayDayOrder;
      }
    }
    
    // Final fallback - if it's a weekday, assume it's day 3 for testing
    if (currentDayOrder === 0) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        currentDayOrder = 3; // Default to day 3 for testing
      }
    }
    
    if (currentDayOrder > 0) {
      setToday(currentDayOrder);
      setDayOrder(currentDayOrder - 1);
    }
  }, [dayOrderData, calendarData, data]);

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
      panel
     panel-whitegrey-bg
     
    
     
    "
        >
          {/* Label */}
          <span className="text-sm text-white font-medium tracking-wider whitespace-nowrap">
            Today&apos;s DO
          </span>

          {/* Day Order */}
          <span
            className={`
        xl:lg:md:px-3 xl:lg:md:py-1.5 px-3 py-1 rounded-lg text-sm font-semibold
        flex items-center justify-center
        
        ${isLoading
                ? "  tag-warning tag "
                : today === 0 || isError
                  ? ""
                  : ""
              }
      `}
          >
            {isLoading || isFetching || calendarLoading ? (
              <GlobalLoader className="w-4 h-4 " />
            ) : isError ? (
              <div className="flex  items-center gap-1">

                <button
                  onClick={() => refetch()}

                >
                  <span>Failed</span>
                </button>
              </div>
            ) : today === 0 ? (
              <p className="">Hoilday</p>
            ) : (
              today
            )}
          </span>

          {/* Glow effect */}
          {today !== 0 && !isError && (
            <span className=""></span>
          )}
        </div>
      </div>

      {/* Day order navigation */}

      <div className="flex justify-center xl:lg:md:gap-50 gap-6  p-3  items-center   md:text-4xl font-extrabold tracking-wide  ">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDayOrderClick(index)}
            className={`md:w-12 md:h-12 w-10 h-10 rounded-xl font-bold text-lg transition-all duration-300 
        ${dayOrder === index ? "panel-red-bg  -translate-y-1.5 " : "panel-pruplegrey-bg"}
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

        const attendance = attendanceData && Array.isArray(attendanceData) ? attendanceData.find(
          (i) =>
            i.courseCode === item.courseCode &&
            ((item.slot.startsWith("P") && i.courseSlot === "LAB") ||
              !item.slot.startsWith("P"))
        ) : undefined;





        const current =
          today && today !== 0 && dayorder === today - 1
            ? isCurrentClass(item.time)
            : undefined;

        return (
          <div
            key={item.time}
            ref={current ? currentRef : undefined}
            className={`w-full flex flex-col p-4 rounded-2xl  transition-all duration-300 shadow-lg ${current
                ? " b-glow-yellow    scale-[1.02]   "
                : " "
              } ${item.courseType?.includes("Theory") && !item.slot.startsWith("P")
                ? "panel-blue-bg panel "
                : item.courseType?.includes("Lab") || item.courseType?.includes("Theory") && item.slot.startsWith("P")
                  ? "panel-orange-bg "
                  : "panel"}`}>
            {item.isClass ? (
              <>
                <div className="flex justify-between items-center mb-2  pb-2">

                  <div className={`${item.courseType?.includes("Theory") && !item.slot.startsWith("P")
                    ? "  "
                    : item.courseType?.includes("Lab") || item.courseType?.includes("Theory") && item.slot.startsWith("P")
                      ? " "
                      : ""}`}>
                    <span className="">
                      {item.courseType?.includes("Theory") && !item.slot.startsWith("P") ? "T" : "P"}
                    </span>
                  </div>

                  <div className="items-center ">

                    <span className=" text-white  tracking-wider font-bold ">

                      {item.time}</span>
                  </div>



                </div>

                <div className="border-b border-white/20 flex  pb-2 text-center mb-2">
                  <span className=" font-extrabold truncate w-auto  ">
                    {item.courseTitle}
                  </span>

                </div>

                <div className="flex justify-between items-center ">
                  <div className="text-sm flex      ">
                    <span className="  ">Room -{" "}
                      <span className="">
                        {item.courseRoomNo}
                      </span>
                     
                    </span>

                    


                  </div>







                  {attendance ? (
                    <AttendanceData attendance={attendance} />
                  ) : !isError ? (
                    <span className="tag tag-info">
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
 <div className="seo-hidden">SRM, SRM KTR, Acadia OS, AcadiaOS, acadiaos srm, Acadia, Acadia SRM, Acadia Asia SRM, SRM Acadia, Student Dashboard, Attendance, Timetable, Calendar, Exam Schedule, GPA Calculator, Marks Calculator, College Timetable, College Attendance Tracker, SRM Students, Academia, academia.srmist, academia.srmist.edu.in, Acadia Design, Acadia Dashboard, College Calendar, SRM Timetable, SRM Attendance, Acadia Portal, SRM Portal, Acadia OS Features, College Management, Student Tools, Academic Planner, Acadia OS SRM KTR, SRM University Tools, Student Performance Tracker, Semester GPA, SRM Academic Dashboard,exam schedule acadia,acadia design </div>
    </div>
  );
});





const AttendanceData = React.memo(({ attendance }: { attendance: AttendanceDetail } ) => {
  // Memoize attendance percentage calculation
 const {courseAttendanceStatus} = useMemo(() => (attendance), [attendance]);
  const attendancePct = useMemo(() => Number(attendance.courseAttendance), [attendance.courseAttendance]);
  const isLow = useMemo(() => attendancePct < 75, [attendancePct]);

  return (
    <div className="flex items-center gap-3">
      <span
        className={`px-3 py-1 rounded-full text-sm bg-black border ${isLow ? "tag tag-error" : "tag tag-success"
          }`}
      >
        {(attendancePct).toFixed(2)}%
      </span>
        { courseAttendanceStatus.classes >  0 ? ( <> {courseAttendanceStatus.status === "required" ? (
        <span className="tag tag-error">
          Required : {courseAttendanceStatus.classes} 
        </span>
      ) :
      courseAttendanceStatus.status === "margin" ? (
        <span className="tag tag-success">
          Margin : {courseAttendanceStatus.classes} 
        </span>
      )  
      : ( "") 
     } </> ) : ( "")}
      
    </div>
  );
});

AttendanceData.displayName = 'AttendanceData';

