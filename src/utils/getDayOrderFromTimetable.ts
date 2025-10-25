import { DaySchedule } from "@/SRM-SCRAPPER";

/**
 * Gets the current day order from timetable data by checking which day has classes
 * This is a fallback method when calendar data is not available
 * @param timetableData - Array of day schedules from timetable
 * @returns Current day order number (1-5) or 0 if not found
 */
export function getDayOrderFromTimetable(timetableData: DaySchedule[]): number {
  if (!timetableData || !Array.isArray(timetableData) || timetableData.length === 0) {
    console.log("No timetable data available");
    return 0;
  }

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Map day of week to day order (this is a rough approximation)
  // You might need to adjust this based on your academic calendar
  const dayOrderMap: { [key: number]: number } = {
    1: 1, // Monday -> Day 1
    2: 2, // Tuesday -> Day 2  
    3: 3, // Wednesday -> Day 3
    4: 4, // Thursday -> Day 4
    5: 5, // Friday -> Day 5
    0: 0, // Sunday -> Holiday
    6: 0, // Saturday -> Holiday
  };
  
  const dayOrder = dayOrderMap[dayOfWeek] || 0;
  
  return dayOrder;
}
