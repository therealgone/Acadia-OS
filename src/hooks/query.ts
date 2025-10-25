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
} from "@/SRM-SCRAPPER";
import { getCookie } from "@/utils/getCookieClient";

// ------------------ ETag-based APIs - OPTIMIZED for static rendering ------------------
function useETagQuery<T>(key: string, fetchFn: () => Promise<T>) {
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Prevent unnecessary refetches
    staleTime: Infinity, // ETag handles freshness
    gcTime: Infinity,
    retry: 1, // Reduced retries to minimize server load
    retryDelay: 5000, // Fixed delay instead of exponential backoff
    networkMode: 'online', // Only run when online
  });
}

export function useTimetable() {
  return useETagQuery("timetable", async () => {
    try {
      const { data } = await timetable(getCookie());
      if (data.error) throw new Error(data.error);
      return data.timetable as DaySchedule[];
    } catch (error) {
      console.error('Timetable fetch error:', error);
      throw error;
    }
  });
}

export function useMarks() {
  return useETagQuery("marks", async () => {
    try {
      const { data } = await marks(getCookie());
      if (data.error) throw new Error(data.error);
      return data.markList as MarkDetail[];
    } catch (error) {
      console.error('Marks fetch error:', error);
      throw error;
    }
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

// ------------------ StaleTime-based APIs - OPTIMIZED for static rendering ------------------
export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      try {
        const { data } = await attendance(getCookie());
        if (data.error) throw new Error(data.error);
        return data.attendance as AttendanceDetail[];
      } catch (error) {
        console.error('Attendance fetch error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour - increased to reduce server calls
    gcTime: 1000 * 60 * 60 * 4, // 4 hours - increased garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Prevent unnecessary refetches
    retry: 1, // Reduced retries
    retryDelay: 5000, // Fixed delay
    networkMode: 'online',
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
    staleTime: 1000 * 60 * 15, // 15 minutes - reduced for real-time updates
    gcTime: 1000 * 60 * 30, // 30 minutes - reduced garbage collection
    refetchOnWindowFocus: false, // Disabled to reduce server calls
    refetchInterval: false, // Disabled auto refresh to reduce server load
    retry: 1, // Reduced retries
    retryDelay: 3000, // Fixed delay
    networkMode: 'online',
  });
}
