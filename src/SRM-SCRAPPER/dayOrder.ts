import * as cheerio from 'cheerio';

// Local type definitions
export interface DayOrderResponse {
  dayOrder?: string;
  error?: string;
  status: number;
}

/**
 * Generates dynamic URL for day order based on current academic year
 * @returns Promise<string>
 */
async function generateDayOrderUrl(): Promise<string> {
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
 * Fetches day order data from SRM Academia portal
 * @param cookies - Authentication cookies
 * @returns Promise<string> - Raw HTML response
 */
async function fetchDayOrderData(cookies: string): Promise<string> {
  try {
    const url = await generateDayOrderUrl();
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
      error instanceof Error ? error.message : "Failed to fetch day order data"
    );
  }
}

/**
 * Parses day order HTML and extracts structured data
 * @param htmlResponse - Raw HTML response from day order page
 * @returns Promise<DayOrderResponse>
 */
async function parseDayOrderHtml(htmlResponse: string): Promise<DayOrderResponse> {
  try {
    // Extract encoded HTML from JavaScript
    const match = htmlResponse.match(/pageSanitizer\.sanitize\('(.*)'\);/s);
    if (!match || !match[1]) {
      return { error: "Failed to extract day order details", status: 404 };
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


    // Extract day order information - try multiple approaches
    let dayOrder = "0";
    
    // Try the original approach
    const dayOrderFromFont = $("td:contains('Day Order:')")
      .next("td")
      .find("font")
      .text()
      .trim();
    
    if (dayOrderFromFont) {
      dayOrder = dayOrderFromFont;
    } else {
      // Try without font tag
      const dayOrderFromTd = $("td:contains('Day Order:')")
        .next("td")
        .text()
        .trim();
      
      if (dayOrderFromTd) {
        dayOrder = dayOrderFromTd;
      } else {
        // Try finding any cell that contains a number after "Day Order:"
        const allCells = $("td");
        for (let i = 0; i < allCells.length; i++) {
          const cellText = $(allCells[i]).text().trim();
          if (cellText.includes("Day Order:")) {
            const nextCell = $(allCells[i + 1]);
            if (nextCell.length > 0) {
              const nextCellText = nextCell.text().trim();
              const numberMatch = nextCellText.match(/\d+/);
              if (numberMatch) {
                dayOrder = numberMatch[0];
                break;
              }
            }
          }
        }
      }
    }
    

    return { dayOrder, status: 200 };
  } catch (error) {
    console.error("Error parsing day order:", error);
    return { error: "Failed to parse day order", status: 500 };
  }
}

/**
 * Main function to get day order data
 * @param cookies - Authentication cookies
 * @returns Promise<DayOrderResponse>
 */
export async function getDayOrder(cookies: string): Promise<DayOrderResponse> {
  try {
    const htmlResponse = await fetchDayOrderData(cookies);
    return await parseDayOrderHtml(htmlResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch day order",
      status: 500,
    };
  }
}
