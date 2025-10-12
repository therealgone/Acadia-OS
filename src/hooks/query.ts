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

export function useTimetable() {
  return useQuery({
    queryKey: ["timetable"],
    queryFn: async () => {
      const { data } = await timetable(getCookie());
      if (data.error) throw new Error(data.error);
      return data.timetable as DaySchedule[];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - long cache for timetable
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache longer
    enabled: !!getCookie(), // Only fetch if user is authenticated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const cookie = getCookie();
      console.log('Fetching attendance with cookie:', !!cookie); // Debug log
      const { data } = await attendance(cookie);
      if (data.error) throw new Error(data.error);
      return data.attendance as AttendanceDetail[];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - medium cache for attendance
    gcTime: 1000 * 60 * 60 * 2, // 2 hours - keep in cache
    enabled: !!getCookie(), // Only fetch if user is authenticated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useMarks() {
  return useQuery({
    queryKey: ["marks"],
    queryFn: async () => {
      const { data } = await marks(getCookie());
      if (data.error) throw new Error(data.error);
      return data.markList as MarkDetail[];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - medium cache for marks
    gcTime: 1000 * 60 * 60 * 2, // 2 hours - keep in cache
    enabled: !!getCookie(), // Only fetch if user is authenticated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useUserInfo() {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const { data } = await userInfo(getCookie());
      if (data.error) throw new Error(data.error);
      return data.userInfo as UserInfo;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - long cache for user info
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache longer
    enabled: !!getCookie(), // Only fetch if user is authenticated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useCourse() {
  return useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const { data } = await Course(getCookie());
      if (data.error) throw new Error(data.error);
      return data.courseList as CourseDetail[];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - long cache for course info
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache longer
    enabled: !!getCookie(), // Only fetch if user is authenticated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useCalendar() {
  return useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      const { data } = await Calendar(getCookie());
      if (data.error) throw new Error(data.error);
      return data.calendar as Month[];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - long cache for calendar
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache longer
    enabled: !!getCookie(), // Only fetch if user is authenticated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
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
    staleTime: 1000 * 60 * 5, // 5 minutes - short cache for day order (changes frequently)
    gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache
    enabled: !!getCookie(), // Only fetch if user is authenticated
    refetchOnWindowFocus: true, // Refetch on focus for real-time updates
    refetchOnMount: true, // Always refetch on mount for current day
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes for day order updates
  });
}
