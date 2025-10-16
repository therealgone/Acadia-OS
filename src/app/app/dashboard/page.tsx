"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  useAttendance,
  useDayOrder,
  useTimetable,
  useMarks,
  useCourse,
} from "@/hooks/query";
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Users,
  ExternalLink,
  Clock,
  MapPin,
  BarChart3,
  Calculator,
} from "lucide-react";

// ✅ Utility function to check current time range (same as isCurrentClass)
const isCurrentClass = (timeRange: string) => {
  const [start, end] = timeRange.split(" - ");
  const parseTimeToDate = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );
  };
  const now = new Date();
  return now >= parseTimeToDate(start) && now <= parseTimeToDate(end);
};

const Page = () => {
  const { data } = useTimetable();
  const { data: attendanceData } = useAttendance();
  const { data: marks } = useMarks();

  // ✅ dynamically get current day order from API
  const { data: dayOrderData } = useDayOrder();
  const [today, setToday] = useState<number>(0);

  useEffect(() => {
    if (dayOrderData && typeof dayOrderData === "object" && "dayOrder" in dayOrderData) {
      const todayDayOrder = Number(dayOrderData.dayOrder);
      if (!isNaN(todayDayOrder)) {
        setToday(todayDayOrder);
      }
    }
  }, [dayOrderData]);

  const [showlink, setShowlink] = useState(false);

  // ✅ dynamically get current day’s classes
  const currentDayClasses = useMemo(() => {
    return data?.[today - 1]?.class.filter((c) => c.isClass) || [];
  }, [data, today]);

  // ✅ dynamically find current class by time
  const currentClass = useMemo(() => {
    return currentDayClasses.find((c) => isCurrentClass(c.time));
  }, [currentDayClasses]);

  const currentMark = useMemo(() => {
    return marks?.find(
      (m) =>
        m.course === currentClass?.courseCode &&
        ((m.category === "Practical" && currentClass?.slot?.startsWith("P")) ||
          (m.category === "Theory" && !currentClass?.slot?.startsWith("P")))
    );
  }, [marks, currentClass]);

  const totalAttendance = useMemo(() => {
    return attendanceData?.reduce(
      (acc, item) => {
        acc.courseConducted += Number(item.courseConducted) || 0;
        acc.courseAbsent += Number(item.courseAbsent) || 0;
        return acc;
      },
      { courseConducted: 0, courseAbsent: 0 }
    );
  }, [attendanceData]);

  const currentAttendance = useMemo(() => {
    if (!currentClass || !attendanceData) return null;
    return (
      attendanceData.find(
        (a) =>
          a.courseCode === currentClass.courseCode &&
          ((currentClass.slot.startsWith("P") && a.courseSlot === "LAB") ||
            !currentClass.slot.startsWith("P"))
      ) || null
    );
  }, [currentClass, attendanceData]);

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

  const totalAttendancePercentage = useMemo(() => {
    const total =
      (totalAttendance?.courseConducted || 0) -
      (totalAttendance?.courseAbsent || 0);
    const conducted = totalAttendance?.courseConducted || 0;
    return conducted > 0 ? ((total / conducted) * 100).toFixed(2) : "0.00";
  }, [totalAttendance]);

  const marksPercentage = useMemo(() => {
    return markstotal && markstotal.maxMark > 0
      ? ((markstotal.obtained / markstotal.maxMark) * 100).toFixed(2)
      : "0.00";
  }, [markstotal]);

  const usefulLinks = [
    {
      name: "Staff Finder",
      url: "https://www.srmist.edu.in/staff-finder/",
      icon: Users,
    },
    {
      name: "WhatsInMess",
      url: "https://whatsinmess.vercel.app/",
      icon: BookOpen,
    },
    {
      name: "SRM Reddit",
      url: "https://www.reddit.com/r/SRMUNIVERSITY/",
      icon: ExternalLink,
    },
    {
      name: "WhatsApp Group",
      url: "https://chat.whatsapp.com/BsIHwgrahSoHvVNVV9OHkA",
      icon: ExternalLink,
    },
    { name: "SRM OD Link", url: "http://10.1.105.62/srmleaveapp", icon: Calendar },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
        <h1 className="text-2xl font-extrabold mb-4 -mt-5   text-center  ">Welcome To Acadia OS</h1>
      <div className="max-w-7xl mx-auto space-y-6">
       

        {currentClass ? (
          <div className={`relative   rounded-xl    p-6 ${currentClass.slot.startsWith("P") ? " panel panel-orange-muted-bg     ":"  panel-blue-bg panel  " }`}>
          
            
            <div className="flex items-center text-center justify-center gap-3 mb-4">
             
            
            
                <h2 className=" font-bold tag-font tag-yellow text-sm">Current Class</h2>
            
              
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">{currentClass.courseTitle}</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.04)] ">
                  <Clock size={18}  />
                  <div>
                    <p className="text-white/60 font-bold" >Time</p>
                    <p className="text-white/60 font-extrabold">{currentClass.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl  bg-[rgba(255,255,255,0.04)]">
                  <MapPin size={18} />
                  <div>
                    <p className="text-white/60 font-bold"> Room</p>
                    <p className="text-white/60 font-extrabold">{currentClass.courseRoomNo}</p>
                  </div>
                </div>
                <div className="flex flex-row w-full   justify-between items-center">
                <div className={`flex gap-3 p-3 rounded-xl ${Number(currentMark?.total.obtained ?? 0) >= (Number(currentMark?.total.maxMark ?? 0)/2) ? " tag-success": " tag-error" }  `}>
                  <BarChart3 size={18} />
                  <div>
                    <p>Marks</p>
                    <p className="font-semibold text-center">
                      {currentMark?.total.obtained || 0} / {currentMark?.total.maxMark || 0}
                    </p>
                  </div>
                </div>
              
               

                <div className={`flex gap-3 p-3 rounded-xl ${Number(currentAttendance?.courseAttendance ?? 0) > 75 ? " tag-success": " tag-error" }  `}>
                  <TrendingUp size={18} />
                  <div>
                    <p>Attendance</p>
                    <p className="font-semibold text-center">{currentAttendance?.courseAttendance || 0}%</p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="panel  p-12 text-center">
            <Clock size={48} className="mx-auto mb-4" />
            <p className="text-xl">No class is happening right now</p>
            <p className="mt-2">Enjoy your free time!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className=" panel panel-graphite-bg  p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Overall Attendance</h3>
                <p>All courses combined</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="pt-3">
                <div className="w-full rounded-full h-3 overflow-hidden bg-[rgba(255,255,255,0.08)]">
                  <div className="h-3 transition-all duration-700 ease-out" style={{ width: `${totalAttendancePercentage}%`, backgroundColor: '#10B98177' }} />
                 
                </div>
                <p className="text-center text-2xl font-bold mt-2">{totalAttendancePercentage}%</p>
              </div>
              <div className="flex  justify-center">
              
                <span className="font-extrabold  tag-font">
                  {(totalAttendance?.courseConducted || 0) - (totalAttendance?.courseAbsent || 0)  } / {totalAttendance?.courseConducted || 0}
                </span>
              </div>
             
              
            </div>
          </div>

          <div className=" panel panel-graphite-bg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Overall Marks</h3>
                <p>All assessments combined</p>
              </div>
            </div>

            <div className="space-y-3">
               <div className="pt-3">
                <div className="w-full rounded-full h-3 overflow-hidden bg-[rgba(255,255,255,0.08)]">
                  <div className="h-3 transition-all duration-700 ease-out" style={{ width: `${marksPercentage}%`,  backgroundColor: '#10B98177' }} />
                 
                </div>
                <p className="text-center text-2xl font-bold mt-2">{marksPercentage}%</p>
              </div>
              <div className="flex justify-center">
               
                <span className="font-extrabold  tag-font">{markstotal?.obtained || 0} / {markstotal?.maxMark || 0}</span>
              </div>
             

             
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/app/dashboard/Mark" className=" panel panel-slate-bg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold ">Mark Calculator</h3>
                  <p className="text-[var(--text-secondary)]">Calculate required external marks</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/app/dashboard/GPA" className=" panel panel-green-muted-bg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">GPA Calculator</h3>
                  <p className="text-[var(--text-secondary)]">Calculate your semester GPA</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        
      
        <div className="panel panel-smoke-bg p-4 md:text-center">
        
          <div className="flex items-center  md:text-center  mb-6">
              <button onClick={() => setShowlink(!showlink)}
                className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] flex justify-center items-center">
              <ExternalLink size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold justify-start text-start flex">Useful Links</h3>
              <p>Quick access to important resources</p>
              
            </div>
            </button>
          </div>
          
          { showlink ? (<> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usefulLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 panel  "
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center">
                  <link.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{link.name}</p>
                </div>
                <ExternalLink size={16} />
              </a>
            ))}
          </div></>) : (<> </>)}
          
        </div>
      </div>
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