import * as cheerio from 'cheerio';

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
    const match = htmlResponse.match(/pageSanitizer\.sanitize\('(.*)'\);/s);
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

    // Parse HTML using cheerio
    const $ = cheerio.load(decodedHtml);

    // Find the marks table - try different selectors
    let table = $("table:nth-child(7)");
    
    // If 7th table not found, try to find table with marks data
    if (table.length === 0) {
      const tables = $("table");
      
      // Look for table that contains marks data
      for (let i = 0; i < tables.length; i++) {
        const currentTable = tables.eq(i);
        const hasMarksData = currentTable.find("td").toArray().some(td => {
          const text = $(td).text();
          return text.includes("/") && /\d+/.test(text);
        });
        
        if (hasMarksData) {
          table = currentTable;
          break;
        }
      }
    }
    
    if (table.length === 0) {
      return { error: "Marks table not found", status: 404 };
    }

    const marksDetails: MarkDetail[] = [];
    const tableRows = table.find("tr");

    tableRows.each((i, row) => {
      if (i === 0) return; // Skip header row

      const cols = $(row).find("td");
      if (cols.length < 3) return;

      const course = $(cols[0]).text().trim();
      const category = $(cols[1]).text().trim();

      const marksTable = $(cols[2]).find("table");
      if (!course || !category || marksTable.length === 0) return;

      const marks: Mark[] = [];
      const total = { obtained: 0, maxMark: 0 };

      marksTable.find("td").each((j, markTd) => {
        const strongText = $(markTd).find("strong").text().trim();
        const [examType, maxMarkStr] = strongText.split("/");
        
        if (!examType || !maxMarkStr) return;

        const obtainedText = $(markTd)
          .text()
          .replace(strongText, "")
          .trim()
          .replace(/^\n+|\n+$/g, "");

        const obtained = Number(obtainedText);
        const maxMark = Number(maxMarkStr.trim());

        if (!isNaN(obtained) && !isNaN(maxMark)) {
          marks.push({
            exam: examType.trim(),
            obtained,
            maxMark,
          });
        }

        const obtainedMarks = parseFloat(obtainedText);
        if (!isNaN(obtainedMarks)) {
          total.obtained += obtainedMarks;
        }
        const maxMarks = parseFloat(maxMarkStr);
        if (!isNaN(maxMarks)) {
          total.maxMark += maxMarks;
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
