import * as cheerio from 'cheerio';

// Local type definitions
interface AttendanceStatus {
  status: "required" | "margin";
  classes: number;
}

interface AttendanceDetail {
  courseCode: string;
  courseTitle: string;
  courseCategory: string;
  courseFaculty: string;
  courseSlot: string;
  courseConducted: number;
  courseAbsent: number;
  courseAttendance: number;
  courseAttendanceStatus: AttendanceStatus;
}

interface AttendanceResponse {
  attendance?: AttendanceDetail[];
  error?: string;
  status: number;
}

/**
 * Calculates attendance status based on conducted and absent classes
 * @param conducted - Number of classes conducted
 * @param absent - Number of classes absent
 * @returns AttendanceStatus
 */
function calculateAttendanceStatus(conducted: number, absent: number): AttendanceStatus {
  const target = 0.75;

  if (conducted === 0) {
    return { status: "margin", classes: 0 };
  }

  const present = conducted - absent;
  const currentRatio = present / conducted;

  if (currentRatio < target) {
    const requiredClasses = Math.ceil((target * conducted - present) / (1 - target));
    return {
      status: "required",
      classes: requiredClasses,
    };
  } else {
    const marginClasses = Math.floor(present / target - conducted);
    return {
      status: "margin",
      classes: marginClasses,
    };
  }
}

/**
 * Fetches attendance data from SRM Academia portal
 * @param cookies - Authentication cookies
 * @returns Promise<string> - Raw HTML response
 */
async function fetchAttendanceData(cookies: string): Promise<string> {
  try {
    const response = await fetch(
      "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Attendance",
      {
        method: "GET",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie: cookies,
          Referer: "https://academia.srmist.edu.in/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );

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
      error instanceof Error ? error.message : "Failed to fetch attendance data"
    );
  }
}

/**
 * Parses attendance HTML and extracts structured data
 * @param htmlResponse - Raw HTML response from attendance page
 * @returns Promise<AttendanceResponse>
 */
async function parseAttendanceHtml(htmlResponse: string): Promise<AttendanceResponse> {
  try {
    // Extract encoded HTML from JavaScript
    const match = htmlResponse.match(/pageSanitizer\.sanitize\('(.*)'\);/s);
    if (!match || !match[1]) {
      return { error: "Failed to extract attendance data", status: 404 };
    }

    const encodedHtml = match[1];

    // Decode the HTML
    const decodedHtml = encodedHtml
      .replace(/\\x([0-9A-Fa-f]{2})/g, (_: string, hex: string) =>
        String.fromCharCode(parseInt(hex, 16))
      )
      .replace(/\\\\/g, "")
      .replace(/\\'/g, "'");

    // Parse HTML using cheerio
    const $ = cheerio.load(decodedHtml);
    const table = $('table[style*="font-size :16px;"][bgcolor="#FAFAD2"]');

    const rows = table.find("tr").slice(1).toArray();
    const attendanceDetails: AttendanceDetail[] = rows.map((row) => {
      const cols = $(row).find("td");
      const get = (idx: number) =>
        cols[idx] ? $(cols[idx]).text().trim() : "";

      const courseConducted = Number(get(6)) || 0;
      const courseAbsent = Number(get(7)) || 0;

      const courseAttendanceStatus = calculateAttendanceStatus(courseConducted, courseAbsent);
      const courseAttendance = Number(
        ((courseConducted - courseAbsent) / courseConducted) * 100
      );

      return {
        courseCode: cols[0]
          ? $(cols[0]).contents().first().text().trim()
          : "",
        courseTitle: get(1),
        courseCategory: get(2),
        courseFaculty: get(3).split("(")[0].trim(),
        courseSlot: get(4),
        courseConducted,
        courseAbsent,
        courseAttendance,
        courseAttendanceStatus,
      };
    });

    return { attendance: attendanceDetails, status: 200 };
  } catch (error) {
    console.error("Error parsing attendance:", error);
    return { error: "Failed to parse attendance", status: 500 };
  }
}


/**
 * Main function to get attendance data
 * @param cookies - Authentication cookies
 * @returns Promise<AttendanceResponse>
 */
export async function getAttendance(cookies: string): Promise<AttendanceResponse> {
  try {
    const htmlResponse = await fetchAttendanceData(cookies);
    return await parseAttendanceHtml(htmlResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch attendance",
      status: 500,
    };
  }
}
