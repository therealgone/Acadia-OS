"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { UseQueryResult } from "@tanstack/react-query";
import { Loader } from "./loader";
import { getTime } from "@/utils/getLastUpdated";
import {
  useAttendance,
  useCalendar,
  useCourse,
  useMarks,
  useTimetable,
  useUserInfo,
} from "@/hooks/query";

type ItemType =
  | "timetable"
  | "attendance"
  | "marks"
  | "calendar"
  | "course"
  | "profile";

const TimetableLastUpdated = () => {
  const query = useTimetable();
  return <LastUpdatedContent query={query} />;
};

const AttendanceLastUpdated = () => {
  const query = useAttendance();
  return <LastUpdatedContent query={query} />;
};

const MarksLastUpdated = () => {
  const query = useMarks();
  return <LastUpdatedContent query={query} />;
};

const CourseLastUpdated = () => {
  const query = useCourse();
  return <LastUpdatedContent query={query} />;
};

const CalendarLastUpdated = () => {
  const query = useCalendar();
  return <LastUpdatedContent query={query} />;
};

const ProfileLastUpdated = () => {
  const query = useUserInfo();
  return <LastUpdatedContent query={query} />;
};

// Shared content component
const LastUpdatedContent = ({
  query,
}: {
  query: UseQueryResult<unknown, Error>;
}) => {
  const date = Date.now();

  const lastUpdated =
    !query.isLoading && query.dataUpdatedAt > 0
      ? getTime(date - query.dataUpdatedAt)
      : null;

  return (
    <div className="px-4 border-b border-slate-400/10 py-2 flex flex-col gap-2 ">
      <div className="w-full flex items-center justify-start gap-3">
        {query.isRefetching ? (
          <>
            <Loader className="w-4 h-4 text-[color:var(--accent-secondary)]" />
            <span className="text-white/60 text-sm">Fetching…</span>
          </>
        ) : query.isLoading ? (
          <span className="text-white/50 text-sm">Loading…</span>
        ) : lastUpdated ? (
          <span className="text-white/50 text-sm">Last updated {lastUpdated} ago</span>
        ) : (
          <span className="text-white/50 text-sm">No data available</span>
        )}
      </div>
      {query.isError && (
        <div className="bg-red-400/20 text-red-400  w-full justify-center items-center min-h-8 flex border border-red-400/60 rounded-lg text-sm ">
          {query.error.message}
        </div>
      )}
    </div>
  );
};

const LastUpdated = () => {
  const pathArr = usePathname().split("/");
  const path = pathArr[pathArr.length - 1] as ItemType;

  switch (path) {
    case "timetable":
      return <TimetableLastUpdated />;
    case "attendance":
      return <AttendanceLastUpdated />;
    case "marks":
      return <MarksLastUpdated />;
    case "course":
      return <CourseLastUpdated />;
    case "calendar":
      return <CalendarLastUpdated />;
    case "profile":
      return <ProfileLastUpdated />;
    default:
      return;
  }
};

export default LastUpdated;
