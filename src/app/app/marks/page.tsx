"use client";
import { useCourse, useMarks } from "@/hooks/query";
import React from "react";
import { MarkDetail } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";

const Page = () => {
  const { data, isPending } = useMarks();

  if (isPending) return <GlobalLoader className="h-10 w-10 text-blue-400" />;

  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center text-gray-400">
        No data found
      </div>
    );

  return (
    <div className="flex flex-col gap-8 py-6 px-2">
      <h1 className="text-2xl font-semibold text-white">Theory</h1>
      <Data data={data} category="theory" />

      <h1 className="text-2xl font-semibold text-white">Practical</h1>
      <Data data={data} category="practical" />
    </div>
  );
};

export default Page;

const Data = ({ data, category }: { data: MarkDetail[]; category: string }) => {
  const course = useCourse().data;
  const filteredData = data.filter(
    (i) => i.category.toLowerCase() === category
  );

  return (
    <div className="py-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredData.map((item, i) => {
        const courseList = course?.find((c) => c.courseCode === item.course);

        return (
          <div
            key={i}
            className="flex flex-col items-center gap-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-4 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <div className="w-full text-white/80 flex flex-col gap-5">
              {/* Header Section */}
              <div className="flex justify-between w-full items-center border-b border-white/10 pb-2">
                <div className="truncate text-white font-semibold w-[65%]" title={courseList?.courseTitle}>
                  {courseList?.courseTitle || "Unknown Course"}
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1 text-xs">
                  <span className="text-gray-300">Credit</span>
                  <span className="text-green-300 font-semibold">
                    {courseList?.courseCredit || "-"}
                  </span>
                </div>
              </div>

              {/* Marks Section */}
              <div className="flex items-center justify-center w-[95%] mx-auto">
                {item.marks.length === 0 ? (
                  <div className="text-red-400">No Marks</div>
                ) : (
                  <MarkData data={item} />
                )}
              </div>

              {/* Footer Section */}
              <div className="flex justify-between w-full items-center text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                  <h1 className="text-sky-300 font-medium">
                    {courseList?.courseCode}
                  </h1>
                  <span className="text-gray-400">
                    {courseList?.courseType?.charAt(0)}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                  <h1 className="text-purple-300 font-medium">
                    {item.total.obtained}
                  </h1>
                  <span className="text-amber-300">/</span>
                  <h1 className="text-amber-300 font-medium">
                    {item.total.maxMark}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MarkData = ({ data }: { data: MarkDetail }) => {
  return (
    <div className="w-full flex flex-col px-2 text-sm text-gray-300 gap-2">
      {data.marks.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-white/5 rounded-lg p-2"
        >
          <div className="truncate w-[60%]" title={item.exam}>
            {item.exam}
          </div>
          <div className="flex gap-2 text-white/80">
            <h1 className="text-sky-300">{item.obtained}</h1>
            <span className="text-gray-500">|</span>
            <h1 className="text-amber-300">{item.maxMark}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};
