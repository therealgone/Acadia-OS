import { parse } from 'node-html-parser';

// Local type definitions
interface Mark {
  exam: string;
  obtained: number;
  maxMark: number;
}

interface MarkDetail {
  course: string;
  category: string;
  marks: Mark[];
  total: { obtained: number; maxMark: number };
}

interface MarksResponse {
  markList?: MarkDetail[];
  error?: string;
  status: number;
}

/**
 * Fetches marks data from SRM Academia portal
 * @param cookies - Authentication cookies
 * @returns Promise<string> - Raw HTML response
 */
async function fetchMarksData(cookies: string): Promise<string> {
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
      error instanceof Error ? error.message : "Failed to fetch marks data"
    );
  }
}

/**
 * Parses marks HTML and extracts structured data
 * @param htmlResponse - Raw HTML response from marks page
 * @returns Promise<MarksResponse>
 */
async function parseMarksHtml(htmlResponse: string): Promise<MarksResponse> {
  try {
    // Extract encoded HTML from JavaScript
    const match = htmlResponse.match(/pageSanitizer\.sanitize\('([\s\S]*)'\);/);
    if (!match || !match[1]) {
      console.error("Failed to extract sanitized content from response");
      return { error: "Failed to extract marks data", status: 404 };
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

    // Find the marks table (7th table)
    const tables = root.querySelectorAll("table");
    const marksTable = tables[6]; // 7th table (0-indexed)
    
    if (!marksTable) {
      return { error: "Marks table not found", status: 404 };
    }

    const marksDetails: MarkDetail[] = [];
    const tableRows = marksTable.querySelectorAll("tr");

    tableRows.forEach((row, index) => {
      if (index === 0) return; // Skip header row

      const columns = row.querySelectorAll("td");
      if (columns.length < 3) return;

      const course = columns[0]?.text?.trim() || "";
      const category = columns[1]?.text?.trim() || "";

      const marksTableElement = columns[2]?.querySelector("table");
      if (!course || !category || !marksTableElement) return;

      const marks: Mark[] = [];
      const total = { obtained: 0, maxMark: 0 };

      const markCells = marksTableElement.querySelectorAll("td");
      markCells.forEach((markCell) => {
        const strongElement = markCell.querySelector("strong");
        if (!strongElement) return;

        const strongText = strongElement.text?.trim() || "";
        const [examType, maxMarkStr] = strongText.split("/");
        
        if (!examType || !maxMarkStr) return;

        const obtainedText = markCell.text
          ?.replace(strongText, "")
          ?.trim()
          ?.replace(/^\n+|\n+$/g, "") || "";

        const obtained = Number(obtainedText);
        const maxMark = Number(maxMarkStr.trim());

        if (!isNaN(obtained) && !isNaN(maxMark)) {
          marks.push({
            exam: examType.trim(),
            obtained,
            maxMark,
          });

          total.obtained += obtained;
          total.maxMark += maxMark;
        }
      });

      total.obtained = Number(total.obtained.toFixed(2));
      total.maxMark = Number(total.maxMark.toFixed(2));
      
      marksDetails.push({ course, category, marks, total });
    });

    return { markList: marksDetails, status: 200 };
  } catch (error) {
    console.error("Error parsing marks:", error);
    return { error: "Failed to parse marks", status: 500 };
  }
}

/**
 * Main function to get marks data
 * @param cookies - Authentication cookies
 * @returns Promise<MarksResponse>
 */
export async function getMarks(cookies: string): Promise<MarksResponse> {
  try {
    const htmlResponse = await fetchMarksData(cookies);
    return await parseMarksHtml(htmlResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch marks",
      status: 500,
    };
  }
}
