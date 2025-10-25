import { parse } from 'node-html-parser';

// Local type definitions
interface CalendarDay {
  date: string;
  day: string;
  event: string;
  dayOrder: string;
}

interface CalendarMonth {
  month: string;
  days: CalendarDay[];
}

interface CalendarResponse {
  calendar?: CalendarMonth[];
  error?: string;
  status: number;
}

/**
 * Generates dynamic URL for calendar based on current academic year and semester
 * @returns Promise<string>
 */
async function generateCalendarUrl(): Promise<string> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let academicYearString: string;
  let semesterType: string;

  if (currentMonth >= 1 && currentMonth <= 6) {
    semesterType = "EVEN";
    academicYearString = `${currentYear - 1}_${currentYear
      .toString()
      .slice(-2)}`;
  } else {
    semesterType = "ODD";
    academicYearString = `${currentYear}_${(currentYear + 1)
      .toString()
      .slice(-2)}`;
  }

  const baseUrl =
    "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/Academic_Planner_";
  return `${baseUrl}${academicYearString}_${semesterType}`;
}

/**
 * Fetches calendar data from SRM Academia portal
 * @param cookies - Authentication cookies
 * @returns Promise<string> - Raw HTML response
 */
async function fetchCalendarData(cookies: string): Promise<string> {
  try {
    const url = await generateCalendarUrl();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: cookies,
        Referer: "https://academia.srmist.edu.in/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Unauthorized");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error: unknown) {
    if (error instanceof Error && 'status' in error && error.status === 500) {
      throw new Error("Unauthorized");
    }
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch calendar data"
    );
  }
}

/**
 * Parses calendar HTML and extracts structured data
 * @param htmlResponse - Raw HTML response from calendar page
 * @returns Promise<CalendarResponse>
 */
async function parseCalendarHtml(htmlResponse: string): Promise<CalendarResponse> {
  try {
    // Parse the outer HTML to find the zmlvalue
    const outerRoot = parse(htmlResponse);
    const placeholderElement = outerRoot.querySelector("div.zc-pb-embed-placeholder-content");
    const zmlValue = placeholderElement?.getAttribute("zmlvalue");

    if (!zmlValue) {
      return { error: "Failed to extract calendar details", status: 404 };
    }

    // Parse the inner HTML from zmlvalue
    const innerRoot = parse(zmlValue);
    const mainTable = innerRoot.querySelector("table[bgcolor='#FAFCFE']");
    
    if (!mainTable) {
      return { error: "Could not find the main calendar table.", status: 500 };
    }

    // Extract months from header row
    const headerRow = mainTable.querySelector("tr");
    if (!headerRow) {
      return { error: "Could not find header row", status: 500 };
    }

    const headerCells = headerRow.querySelectorAll("th");
    const monthsData: CalendarMonth[] = [];

    // Extract month names from header cells
    for (let i = 0; ; i++) {
      const monthNameThIndex = i * 5 + 2;
      if (monthNameThIndex >= headerCells.length) break;
      
      const monthCell = headerCells[monthNameThIndex];
      const strongElement = monthCell?.querySelector("strong");
      const monthName = strongElement?.text?.trim();
      
      if (monthName) {
        monthsData.push({ month: monthName, days: [] });
      } else {
        break;
      }
    }

    // Extract calendar data from data rows
    const dataRows = mainTable.querySelectorAll("tr").slice(1);
    
    dataRows.forEach((rowElement) => {
      const cells = rowElement.querySelectorAll("td");
      
      monthsData.forEach((month, monthIndex) => {
        const offset = monthIndex * 5;
        if (offset + 3 >= cells.length) return;
        
        const dateCell = cells[offset];
        const dayCell = cells[offset + 1];
        const eventCell = cells[offset + 2];
        const dayOrderCell = cells[offset + 3];
        
        const date = dateCell?.text?.trim();
        if (!date) return;
        
        const day = dayCell?.text?.trim() || "";
        const eventStrong = eventCell?.querySelector("strong");
        const event = eventStrong?.text?.trim() || "";
        const dayOrder = dayOrderCell?.text?.trim() || "";
        
        month.days.push({ date, day, event, dayOrder });
      });
    });

    return { calendar: monthsData, status: 200 };
  } catch (error) {
    console.error("Error parsing calendar:", error);
    return { error: "Failed to parse calendar", status: 500 };
  }
}

/**
 * Main function to get calendar data
 * @param cookies - Authentication cookies
 * @returns Promise<CalendarResponse>
 */
export async function getCalendar(cookies: string): Promise<CalendarResponse> {
  try {
    const htmlResponse = await fetchCalendarData(cookies);
    return await parseCalendarHtml(htmlResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch calendar",
      status: 500,
    };
  }
}
