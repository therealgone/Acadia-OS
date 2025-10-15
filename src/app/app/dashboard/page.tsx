"use client";

import React, { useState, useMemo } from "react";
import { useAttendance, useDayOrder, useTimetable, useMarks } from "@/hooks/query";
import { isCurrentClass as originalIsCurrentClass } from "@/utils/currentClass";

const Page = () => {
  const { data } = useTimetable();
  const { data: attendanceData } = useAttendance();
  const { data: marks } = useMarks();

  const today = 1; // FORCE day order to 2

  // Override isCurrentClass for testing: always treat now as 08:20 AM
  const isCurrentClass = (timeRange: string) => {
    const [start, end] = timeRange.split(" - ");
    const parseTimeToDate = (timeStr: string) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    };
    const fixedNow = parseTimeToDate("01:30 PM"); // FORCE time
    return fixedNow >= parseTimeToDate(start) && fixedNow <= parseTimeToDate(end);
  };

  // Current day classes
  const currentDayClasses = useMemo(
    () => data?.[today - 1]?.class.filter((c) => c.isClass) || [],
    [data, today]
  );

  // Pick current class at forced time
  const currentClass = useMemo(
    () => currentDayClasses.find((c) => isCurrentClass(c.time)),
    [currentDayClasses]
  );
   console.log(currentClass?.courseCategory)

  const {data:course} = useMarks()

  
  // Marks for the current class
  const currentMark = useMemo(
   
    () =>
      
        marks?.find((m) => m.course === currentClass?.courseCode && currentClass.courseType === m.category),
    [marks, currentClass]

    
  );

  // Attendance for current class
  const currentAttendance = useMemo(() => {
    if (!currentClass || !attendanceData) return null;
    return (
      attendanceData.find(
        (a) =>
          a.courseCode === currentClass.courseCode &&
          ((currentClass.slot.startsWith("P") && a.courseSlot === "LAB") || !currentClass.slot.startsWith("P"))
      ) || null
    );
  }, [currentClass, attendanceData]);

  // Total marks (all subjects)

  const markstotal = useMemo(() => {
    return marks?.reduce(
      (acc, item) => {
        acc.obtained += item.total.obtained;
        acc.maxMark += item.total.maxMark;
        return acc;
      },
      { obtained: 0, maxMark: 0 }
    );
  }, [marks]);
   console.log()
  return (

 
    <div className="flex flex-col items-center justify-center mt-10 gap-4">
      {currentClass ? (
        <div className="p-6 rounded-xl bg-gray-800 text-white w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-2">{currentClass.courseTitle}</h2>
          <p className="mb-1">Time: {currentClass.time}</p>
          <p className="mb-1">Slot: {currentClass.slot}</p>
         
          <p>
            Current Marks: {currentMark?.total.obtained} / {currentMark?.total.maxMark}
          </p>
          <p>Attendance: {currentAttendance?.courseAttendance}%</p>
        </div>
      ) : (
        <p>No class is happening right now ⏳</p>
      )}
      <p>Total Obtained: {markstotal?.obtained}</p>
      <p>Total Max Mark: {markstotal?.maxMark}</p>
    </div>
  );
};

export default Page;


{/*
    "use client";



import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";

import { useAttendance, useDayOrder, useTimetable, useMarks, useCourse } from "@/hooks/query";
import { AttendanceDetail, DaySchedule, MarkDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { isCurrentClass } from "@/utils/currentClass";


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
            <Day data={data} />
        </Suspense>
    );
});




export default Page;




const Day = React.memo(({ data }: { data: DaySchedule[] }) => {

    const [today, setToday] = useState<number>(0);

    const { data: dayOrderData, isLoading, isError, refetch, isFetching } = useDayOrder();


    const { data: attendanceData, isError: attendanceError } = useAttendance();
    useEffect(() => {
        if (dayOrderData && typeof dayOrderData === 'object' && 'dayOrder' in dayOrderData) {
            const todayDayOrder = Number(dayOrderData.dayOrder);
            if (!isNaN(todayDayOrder)) {
                setToday(todayDayOrder);

            }
        }
    }, [dayOrderData]);
    const { data: marks } = useMarks();



    
    const markstotal = useMemo(() => {
        if (!marks || !Array.isArray(marks)) return { obtained: 0, maxMark: 0 };
        return marks.reduce(
            (acc, item) => {
                acc.obtained += item.total.obtained;
                acc.maxMark += item.total.maxMark;
                return acc;
            },
            { obtained: 0, maxMark: 0 }
        );
    }, [marks]);



    const currentDayClasses = useMemo(() => {

        if (!data[today - 1]) return [];
        return data[today - 1].class.filter(item => item.isClass);
    }, [data, today])


    const currentClass = useMemo(() => {
        return currentDayClasses.find(item => isCurrentClass(item.time))

    }, [currentDayClasses])

    const CurrnetMark = useMemo(() => {

        return marks?.find( a=> a.course === currentClass?.courseCode && a.category === currentClass.courseCategory)
    } , [currentClass , marks])


    const currentAttendance: AttendanceDetail | null = useMemo(() => {
        if (!currentClass || !attendanceData) return null;

        return attendanceData.find(a =>
            a.courseCode === currentClass.courseCode &&
            ((currentClass.slot.startsWith("P") && a.courseSlot === "LAB") ||
                !currentClass.slot.startsWith("P"))
        ) || null;
    }, [currentClass, attendanceData]);


    // Example JSX return, replace with your actual UI
    return (
        <div className="flex flex-col items-center justify-center mt-10">
            {isLoading || isFetching ? (
                <GlobalLoader className="w-6 h-6" />
            ) : isError ? (
                <button onClick={() => refetch()}>Failed to fetch day order. Retry</button>
            ) : today === 0 ? (
                <p>Holiday Today 🎉</p>
            ) : currentClass ? (
                <div className="p-6 rounded-xl bg-gray-800 text-white w-full max-w-md shadow-lg">
                    <h2 className="text-xl font-bold mb-2">{currentClass.courseTitle}</h2>
                    <p className="mb-1">Time: {currentClass.time}</p>
                    <p className="mb-1">Slot: {currentClass.slot}</p>
                       <p>Current : {CurrnetMark?.total.obtained} / {CurrnetMark?.total.maxMark} </p>
                    {currentAttendance ? (
                        <>
                            <p>Attendance: {currentAttendance.courseAttendance}%</p>

                        </>
                    ) : attendanceError ? (
                        <p>Failed to load attendance 😕</p>
                    ) : (
                        <p>Loading attendance...</p>
                    )}
                </div>
            ) : (
                <p>No class is happening right now ⏳</p>
            )}
            <p>Total Obtained: {markstotal.obtained}</p>
            <p>Total Max Mark: {markstotal.maxMark}</p>
         

        </div>
    );





});


    
    */}