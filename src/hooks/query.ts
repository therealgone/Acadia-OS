import {
  attendance,
  Calendar,
  Course,
  dayOrder,
  marks,
  timetable,
  userInfo,
} from "@/server/action";
import { useQuery } from "@tanstack/react-query";
import {
  DaySchedule,
  AttendanceDetail,
  MarkDetail,
  UserInfo,
  CourseDetail,
  Month,
  DayOrderResponse,
} from "srm-academia-api";
import { getCookie } from "@/utils/getCookieClient";

// ------------------ ETag-based APIs ------------------
function useETagQuery<T>(key: string, fetchFn: () => Promise<T>) {
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // ETag handles freshness
    gcTime: Infinity,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useTimetable() {
  return useETagQuery("timetable", async () => {
    const { data } = await timetable(getCookie());
    if (data.error) throw new Error(data.error);
    return data.timetable as DaySchedule[];
  });
}

export function useMarks() {
  return useETagQuery("marks", async () => {
    const { data } = await marks(getCookie());
    if (data.error) throw new Error(data.error);
    return data.markList as MarkDetail[];
  });
}

export function useUserInfo() {
  return useETagQuery("userInfo", async () => {
    const { data } = await userInfo(getCookie());
    if (data.error) throw new Error(data.error);
    return data.userInfo as UserInfo;
  });
}

export function useCourse() {
  return useETagQuery("course", async () => {
    const { data } = await Course(getCookie());
    if (data.error) throw new Error(data.error);
    return data.courseList as CourseDetail[];
  });
}

export function useCalendar() {
  return useETagQuery("calendar", async () => {
    const { data } = await Calendar(getCookie());
    if (data.error) throw new Error(data.error);
    return data.calendar as Month[];
  });
}

// ------------------ StaleTime-based APIs ------------------
export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const { data } = await attendance(getCookie());
      if (data.error) throw new Error(data.error);
      return data.attendance as AttendanceDetail[];
    },
    staleTime: 1000 * 60 * 50, // 50 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useDayOrder() {
  return useQuery({
    queryKey: ["dayOrder"],
    queryFn: async () => {
      const { data } = await dayOrder(getCookie());
      if (data.error) throw new Error(data.error);
      return data as DayOrderResponse;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 30, // auto refresh every 30 min
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
