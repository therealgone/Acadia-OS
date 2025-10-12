"use client";
import { useCourse } from "@/hooks/query";
import React from "react";
import { CourseDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";

const Page = () => {
  const { data, isPending } = useCourse();

  if (isPending)
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <GlobalLoader className="h-10 w-10 text-yellow-400" />
      </div>
    );

  if (!data || !Array.isArray(data) || data.length === 0)
    return (
      <div className="flex h-screen w-full justify-center items-center text-white/70">
        No data found
      </div>
    );

  return <Data data={data} />;
};

export default Page;

const Data = ({ data }: { data: CourseDetail[] }) => {
  return (
    <div className="w-full h-full flex flex-col gap-6 py-5 px-4 lg:px-8 overflow-hidden mt-10">
      {data.map((item, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl   hover:scale-[1.02] transition-all duration-200"
        >
          {/* Left: Course Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            {/* Course Code & Type */}
            <div className="flex justify-between items-center w-full sm:w-auto gap-2">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full apply-border-sm">
              <span className="text-white font-semibold">{item.courseCode}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-3xl ${
                  item.courseType.includes("Project")
                    ? "bg-orange-400 text-orange-900"
                    : item.courseType.includes("Theory")
                    ? "bg-blue-400 text-blue-900"
                    : "bg-green-500/30 text-green-400"
                }`}
              >
                {item.courseType.charAt(0)}
              </span>
              
            </div>
            <div className="sm:hidden flex "><Tag label="Credit" value={item.courseCredit.toString()} typeColor="credit" /></div>
            </div>

            {/* Course Title */}
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">{item.courseTitle}</span>
              <span className="text-white/60 text-sm">{item.courseFaculty.split("(")[0]}</span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-wrap items-center gap-3">
            <Tag label="Type" value={item.courseType} typeColor={item.courseType} />
            <Tag label="Slot" value={item.courseSlot.join(" , ")} typeColor="slot" />
            <Tag label="Class Room" value={item.courseRoomNo} typeColor="room" />
            <div className="hidden md:block">
            <Tag label="Credit" value={item.courseCredit.toString()} typeColor="credit" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Tag = ({
  label,
  value,
  typeColor,


}: {
  label: string;
  value: string;
  typeColor: string;


}) => {
  let bgColor = "bg-white/10 text-white/70";

  if (typeColor === "Theory") bgColor = "bg-blue-500/20 text-blue-300";
  else if (typeColor.includes("Lab")) bgColor = "bg-orange-500/20 text-orange-300";
  else if (typeColor.includes("Project")) bgColor = "bg-green-400 text-green-900";
  else if (typeColor === "slot") bgColor = "bg-yellow-400/20 text-yellow-300";
  else if (typeColor === "room") bgColor = "bg-purple-400/20 text-purple-300";
  else if (typeColor === "credit") bgColor = "bg-black text-green-400";

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} backdrop-blur-3xl`}>
      <span className="font-semibold mr-1">{label}:</span>
      <span>{value}</span>
    </div>
  );
};

