import * as cheerio from 'cheerio';

// Local type definitions
interface CourseDetail {
  courseCode: string;
  courseTitle: string;
  courseCredit: string;
  courseCategory: string;
  courseType: string;
  courseFaculty: string;
  courseSlot: string[];
  courseRoomNo: string;
}

interface CourseResponse {
  courseList?: CourseDetail[];
  batch?: string;
  error?: string;
  status: number;
}

/**
 * Generates dynamic URL for course details based on current academic year
 * @returns Promise<string>
 */
async function generateCourseUrl(): Promise<string> {
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
 * Fetches course details data from SRM Academia portal
 * @param cookies - Authentication cookies
 * @returns Promise<string> - Raw HTML response
 */
async function fetchCourseData(cookies: string): Promise<string> {
  try {
    const url = await generateCourseUrl();
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
      error instanceof Error ? error.message : "Failed to fetch course details"
    );
  }
}

/**
 * Parses course details HTML and extracts structured data
 * @param htmlResponse - Raw HTML response from course details page
 * @returns Promise<CourseResponse>
 */
async function parseCourseHtml(htmlResponse: string): Promise<CourseResponse> {
  try {
    // Extract encoded HTML from JavaScript
    const match = htmlResponse.match(/pageSanitizer\.sanitize\('(.*)'\);/s);
    if (!match || !match[1]) {
      return { error: "Failed to extract course details", status: 404 };
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

    // Extract batch information
    let batch = "";
    try {
      batch = $("td:contains('Batch:')").next("td").find("font").text().trim();
    } catch {
      batch = "";
    }

    // Extract course information
    const courseList: CourseDetail[] = Array.from($(".course_tbl tr").slice(1)).map((row) => {
      const columns = $(row).find("td");
      const get = (idx: number) =>
        columns[idx] ? $(columns[idx]).text().trim() : "";
      const getFormat = (idx: number) =>
        get(idx).length === 0 ? "NA" : get(idx);

      const slotRaw = get(8);
      const sortedSlots = slotRaw
        ? slotRaw
            .split("-")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const roomNo = getFormat(10).startsWith("AY")
        ? getFormat(9)
        : getFormat(10);

      return {
        courseCode: getFormat(1),
        courseTitle: getFormat(2),
        courseCredit: getFormat(3),
        courseCategory: getFormat(5),
        courseType: getFormat(6),
        courseFaculty: getFormat(7),
        courseSlot: sortedSlots,
        courseRoomNo: roomNo,
      };
    });

    return { courseList, batch, status: 200 };
  } catch (error) {
    console.error("Error parsing course details:", error);
    return { error: "Failed to parse course details", status: 500 };
  }
}

/**
 * Main function to get course details data
 * @param cookies - Authentication cookies
 * @returns Promise<CourseResponse>
 */
export async function getCourseDetails(cookies: string): Promise<CourseResponse> {
  try {
    const htmlResponse = await fetchCourseData(cookies);
    return await parseCourseHtml(htmlResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch course details",
      status: 500,
    };
  }
}
