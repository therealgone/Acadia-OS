"use client";
import { useCourse, useMarks } from "@/hooks/query";
import React from "react";
import { MarkDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";

const Page = () => {
  const { data, isPending } = useMarks();

  if (isPending)
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <GlobalLoader className="h-10 w-10 text-yellow-400" />
      </div>
    );

  if (!data || !Array.isArray(data) || data.length === 0)
    return (
      <div className="flex h-screen w-full justify-center items-center text-gray-400">
        No data found
      </div>
    );

  return (
    <div className="flex flex-col gap-8 py-6 px-4 lg:px-8">
      <h1 className="text-2xl font-semibold text-white">Theory</h1>
      <Data data={data} category="theory" />

      <h1 className="text-2xl font-semibold text-white">Practical</h1>
      <Data data={data} category="practical" />
    </div>
  );
};

export default Page;

const Data = ({ data, category }: { data: MarkDetail[]; category: string }) => {
  const courseList = useCourse().data;
  const filteredData = data.filter((i) => i.category.toLowerCase() === category);

  return (
    <div className="w-full flex flex-col gap-4">
      {filteredData.map((item, idx) => {
        const course = courseList && Array.isArray(courseList) ? courseList.find((c) => c.courseCode === item.course) : undefined;

        return (
          <div
            key={idx}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-3xl hover:scale-[1.02] transition-all duration-200 ${category === "theory"
                ? "bg-blue-500/20 text-blue-300"
                : "panel panel-orange-muted-bg"
              }`}
          >
            {/* Left: Course Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
              {/* Course code badge + total marks (mobile) */}
              <div className="flex justify-between items-center w-full sm:w-auto gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-3xl whitespace-nowrap ${category === "theory"
                      ? "tag tag-blue"
                      : "tag tag-orange"
                    }`}
                >
                  {course?.courseCode} - {course?.courseType?.charAt(0)}
                </div>

                {/* Total Marks for mobile */}
                <div className="px-3 py-1 rounded-full text-sm font-semibold bg-black text-green-400 flex sm:hidden gap-1">
                  <span>{item.total.obtained}</span>
                  <span>/</span>
                  <span>{item.total.maxMark}</span>
                </div>
              </div>

              {/* Course title and faculty */}
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <span className="text-white font-bold text-lg truncate">
                  {course?.courseTitle}
                </span>
                <span className="text-white/60 text-sm truncate">
                  {course?.courseFaculty.split("(")[0]}
                </span>
              </div>
            </div>

            {/* Right: Marks */}
            <div className="flex flex-wrap sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
              {item.marks.length === 0 ? (
                <span className="text-red-400 font-medium">No Marks</span>
              ) : (
                item.marks.map((m, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-3xl flex gap-1 sm:gap-2 items-center flex-shrink-0"
                  >
                    <span
                      className="text-white/70 truncate max-w-[80px]"
                      title={m.exam}
                    >
                      {m.exam}
                    </span>
                    <span className="text-sky-300">{m.obtained}</span>
                    <span className="text-amber-300">/</span>
                    <span className="text-amber-300">{m.maxMark}</span>
                  </div>
                ))
              )}

              {/* Total Marks for desktop */}
              <div className="px-3 py-1 rounded-full text-sm font-semibold bg-black text-green-400 flex hidden sm:flex gap-1 items-center flex-shrink-0">
                <span>{item.total.obtained}</span>
                <span>/</span>
                <span>{item.total.maxMark}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
