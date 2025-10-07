"use client";
import { useCourse } from "@/hooks/query";
import React from "react";
import { CourseDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";

const Page = () => {
  const { data, isPending } = useCourse();
  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;
  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center text-white/70">
        No data found
      </div>
    );

  return <Data data={data} />;
};

export default Page;

const Data = ({ data }: { data: CourseDetail[] }) => {
  return (
    <div className="py-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 lg:px-5">
      {data.map((item, i) => (
        <div
          key={i}
          className="flex flex-col rounded-2xl panel p-4 shadow-2xl hover-glow transition-all duration-200"
        >
          {/* Header: Course Code & Type */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-full apply-border-sm">
              <span className="text-sm font-semibold">{item.courseCode}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-3xl ${item.courseType.includes("Project")
                  ? "bg-orange-400 text-orange-900"
                  : item.courseType.includes("Theory")
                    ? "bg-blue-400 text-blue-900"
                    : "bg-green-500/30 text-green-400"
                  }`}
              >
                {item.courseType.charAt(0)}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-full apply-border-sm">
              <span className="text-xs font-medium">Credit</span>
              <span className="px-2 py-0.5 rounded-full bg-black text-green-400 font-semibold">
                {item.courseCredit}
              </span>
            </div>
          </div>

          {/* Course Details */}
          <div className="flex flex-col gap-2 text-sm">
            <DetailRow
              className="text-white font-semibold"
              label="Course"
              value={item.courseTitle}
            />
            <DetailRow
              className="text-sky-300"
              label="Faculty"
              value={item.courseFaculty.split("(")[0]}
            />
            <DetailRow
              className={
                item.courseType === "Theory"
                  ? "text-blue-400"
                  : item.courseType === "Lab Based Theory"
                    ? "text-green-400"
                    : item.courseType === "Project Based Theory"
                      ? "text-orange-400"
                      : "text-gray-400"
              }
              label="Type"
              value={item.courseType}
            />
            <DetailRow
              className="text-purple-300"
              label="Slot"
              value={item.courseSlot.join(" , ")}
            />
            <DetailRow
              className="text-amber-300"
              label="Class Room"
              value={item.courseRoomNo}
            />
          </div>


        </div>
      ))}
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
      <span className="font-semibold text-white/70 min-w-[100px]">{label}</span>
      <span className={`break-words w-full sm:w-[70%]${className ? " " + className : ""}`}>{value}</span>
    </div>
  );
};
