import { Month } from "@/SRM-SCRAPPER";

/**
 * Gets the current day order from calendar data
 * @param calendarData - Array of months from calendar
 * @returns Current day order number (1-5) or 0 if not found
 */
export function getCurrentDayOrder(calendarData: Month[]): number {
  if (!calendarData || !Array.isArray(calendarData) || calendarData.length === 0) {
    console.log("No calendar data available");
    return 0;
  }

  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Find the current month in calendar data
  const currentMonthData = calendarData.find(month => {
    const monthName = month.month.toLowerCase();
    const monthNumber = getMonthNumber(monthName);
    return monthNumber === currentMonth;
  });

  if (!currentMonthData) {
    return 0;
  }

  // Find today's date in the calendar
  const todayData = currentMonthData.days.find(day => {
    const dayDate = parseInt(day.date);
    return dayDate === currentDate;
  });

  if (!todayData) {
    return 0;
  }

  // Extract day order from the dayOrder field
  const dayOrderText = todayData.dayOrder;
  if (!dayOrderText) {
    return 0;
  }

  // Parse day order number (e.g., "Day 3" -> 3, "3" -> 3, "Day3" -> 3)
  const dayOrderMatch = dayOrderText.match(/(?:day\s*)?(\d+)/i);
  if (!dayOrderMatch) {
    return 0;
  }

  const dayOrder = parseInt(dayOrderMatch[1]);

  return dayOrder;
}

/**
 * Converts month name to month number
 * @param monthName - Month name (e.g., "Jan", "January")
 * @returns Month number (1-12)
 */
function getMonthNumber(monthName: string): number {
  const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  
  const monthIndex = months.findIndex(month => 
    monthName.toLowerCase().includes(month)
  );
  
  return monthIndex + 1; // Return 1-12 instead of 0-11
}
