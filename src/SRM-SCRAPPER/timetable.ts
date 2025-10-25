import { parse } from 'node-html-parser';

// Local type definitions
interface CourseSlotInfo {
  courseTitle: string;
  courseCode: string;
  courseType: string;
  courseCategory: string;
  courseRoomNo: string;
}

interface TimetableSlot {
  slot: string;
  isClass: boolean;
  courseTitle?: string;
  courseCode?: string;
  courseType?: string;
  courseCategory?: string;
  courseRoomNo?: string;
  time: string;
}

interface DaySchedule {
  dayOrder: string;
  class: TimetableSlot[];
}

interface TimetableResponse {
  timetable?: DaySchedule[];
  error?: string;
  status: number;
}

// Time slots configuration
const timeSlots = [
  "08:00 AM - 08:50 AM",
  "08:50 AM - 09:40 AM",
  "09:45 AM - 10:35 AM",
  "10:40 AM - 11:30 AM",
  "11:35 AM - 12:25 PM",
  "12:30 PM - 01:20 PM",
  "01:25 PM - 02:15 PM",
  "02:20 PM - 03:10 PM",
  "03:10 PM - 04:00 PM",
  "04:00 PM - 04:50 PM",
];

// Batch slots configuration
const batchSlotsConfig = {
  1: {
    slots: [
      {
        dayOrder: "Day 1",
        slots: ["A", "A", "F", "F", "G", "P6", "P7", "P8", "P9", "P10"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 2",
        slots: ["P11", "P12", "P13", "P14", "P15", "B", "B", "G", "G", "A"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 3",
        slots: ["C", "C", "A", "D", "B", "P26", "P27", "P28", "P29", "P30"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 4",
        slots: ["P31", "P32", "P33", "P34", "P35", "D", "D", "B", "E", "C"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 5",
        slots: ["E", "E", "C", "F", "D", "P46", "P47", "P48", "P49", "P50"],
        time: timeSlots,
      },
    ],
  },
  2: {
    slots: [
      {
        dayOrder: "Day 1",
        slots: ["P1", "P2", "P3", "P4", "P5", "A", "A", "F", "F", "G"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 2",
        slots: ["B", "B", "G", "G", "A", "P16", "P17", "P18", "P19", "P20"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 3",
        slots: ["P21", "P22", "P23", "P24", "P25", "C", "C", "A", "D", "B"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 4",
        slots: ["D", "D", "B", "E", "C", "P36", "P37", "P38", "P39", "P40"],
        time: timeSlots,
      },
      {
        dayOrder: "Day 5",
        slots: ["P41", "P42", "P43", "P44", "P45", "E", "E", "C", "F", "D"],
        time: timeSlots,
      },
    ],
  },
};

/**
 * Generates dynamic URL for timetable based on current academic year
 * @returns Promise<string>
 */
async function generateTimetableUrl(): Promise<string> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  const academicYearString = `${currentYear - 2}_${(currentYear - 1)
    .toString()
    .slice(-2)}`;

  const baseUrl =
    "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_";
  return `${baseUrl}${academicYearString}`;
}

/**
 * Fetches timetable data from SRM Academia portal
 * @param cookies - Authentication cookies
 * @returns Promise<string> - Raw HTML response
 */
async function fetchTimetableData(cookies: string): Promise<string> {
  try {
    const url = await generateTimetableUrl();
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
      error instanceof Error ? error.message : "Failed to fetch timetable data"
    );
  }
}

/**
 * Parses timetable HTML and extracts structured data
 * @param htmlResponse - Raw HTML response from timetable page
 * @returns Promise<TimetableResponse>
 */
async function parseTimetableHtml(htmlResponse: string): Promise<TimetableResponse> {
  try {
    // Extract encoded HTML from JavaScript
    const match = htmlResponse.match(/pageSanitizer\.sanitize\('([\s\S]*)'\);/);
    if (!match || !match[1]) {
      return { error: "Failed to extract timetable details", status: 404 };
    }

    const encodedHtml = match[1];

    // Decode the HTML
    const decodedHtml = encodedHtml
      .replace(/\\x([0-9A-Fa-f]{2})/g, (_: string, hex: string) =>
        String.fromCharCode(parseInt(hex, 16))
      )
      .replace(/\\\\/g, "")
      .replace(/\\'/g, "'");

    // Parse HTML using node-html-parser
    const root = parse(decodedHtml);

    // Extract batch information
    const batchElement = root.querySelector("td:contains('Batch:')");
    const batch = batchElement?.nextElementSibling?.querySelector("font")?.text?.trim() || "1";
    const batchNumber = parseInt(batch);

    // Extract course information
    const courseRows = root.querySelectorAll(".course_tbl tr").slice(1);
    const courseList = courseRows.map((row) => {
      const columns = row.querySelectorAll("td");
      const getText = (index: number) => columns[index]?.text?.trim() || "";
      
      const slotRaw = getText(8);
      const sortedSlots = slotRaw
        ? slotRaw
            .split("-")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      return {
        courseCode: getText(1),
        courseTitle: getText(2),
        courseCredit: getText(3),
        courseCategory: getText(5),
        courseType: getText(6),
        courseFaculty: getText(7),
        courseSlot: sortedSlots,
        courseRoomNo: getText(10).startsWith("AY")
          ? getText(9).length === 0
            ? "N/A"
            : getText(9)
          : getText(10),
      };
    });

    // Get batch configuration
    const batchData = batchSlotsConfig[batchNumber as keyof typeof batchSlotsConfig];
    if (!batchData) {
      return { error: "Invalid batch configuration", status: 500 };
    }

    // Create slot mapping
    const slotMap: Record<string, CourseSlotInfo> = {};
    courseList.forEach((course) => {
      course.courseSlot.forEach((slot) => {
        if (slot) {
          slotMap[slot] = {
            courseTitle: course.courseTitle,
            courseCode: course.courseCode,
            courseType: course.courseType,
            courseCategory: course.courseCategory,
            courseRoomNo: course.courseRoomNo,
          };
        }
      });
    });

    // Generate timetable structure
    const timetable: DaySchedule[] = batchData.slots.map((day) => ({
      dayOrder: day.dayOrder,
      class: day.slots.map((slot, index): TimetableSlot => {
        const slotInfo = slotMap[slot]
          ? {
              slot,
              isClass: true,
              courseTitle: slotMap[slot].courseTitle,
              courseCode: slotMap[slot].courseCode,
              courseType: slotMap[slot].courseType,
              courseCategory: slotMap[slot].courseCategory,
              courseRoomNo: slotMap[slot].courseRoomNo,
            }
          : { slot, isClass: false };
        
        return {
          ...slotInfo,
          time: day.time[index],
        };
      }),
    }));

    return { timetable, status: 200 };
  } catch (error) {
    console.error("Error parsing timetable:", error);
    return { error: "Failed to parse timetable", status: 500 };
  }
}

/**
 * Main function to get timetable data
 * @param cookies - Authentication cookies
 * @returns Promise<TimetableResponse>
 */
export async function getTimetable(cookies: string): Promise<TimetableResponse> {
  try {
    const htmlResponse = await fetchTimetableData(cookies);
    return await parseTimetableHtml(htmlResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch timetable",
      status: 500,
    };
  }
}
