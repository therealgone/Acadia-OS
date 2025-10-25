import * as cheerio from 'cheerio';

// Local type definitions
interface UserInfo {
  regNumber: string;
  name: string;
  mobile: string;
  section: string;
  program: string;
  department: string;
  semester: string;
  batch: string;
}

interface UserInfoResponse {
  userInfo?: UserInfo;
  error?: string;
  status: number;
}

/**
 * Fetches user info data from SRM Academia portal
 * @param cookies - Authentication cookies
 * @returns Promise<string> - Raw HTML response
 */
async function fetchUserInfoData(cookies: string): Promise<string> {
  try {
    const response = await fetch(
      "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_2023_24",
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
      error instanceof Error ? error.message : "Failed to fetch user info data"
    );
  }
}

/**
 * Parses user info HTML and extracts structured data
 * @param htmlResponse - Raw HTML response from user info page
 * @returns Promise<UserInfoResponse>
 */
async function parseUserInfoHtml(htmlResponse: string): Promise<UserInfoResponse> {
  try {
    // Extract encoded HTML from JavaScript
    const match = htmlResponse.match(/pageSanitizer\.sanitize\('([\s\S]*)'\);/);
    if (!match || !match[1]) {
      return { error: "Failed to extract user details", status: 404 };
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

    // Helper function to get text content
    const getText = (selector: string): string => {
      return $(selector).text().trim();
    };

    // Extract user information
    const regNumber = getText('td:contains("Registration Number:") + td strong');
    const name = getText('td:contains("Name:") + td strong');
    const mobile = getText('td:contains("Mobile:") + td strong');
    
    const departmentText = getText('td:contains("Department:") + td strong');
    const section = departmentText
      .split("-")[1]
      ?.replace("(", "")
      ?.replace(")", "")
      ?.replace("Section", "")
      ?.trim() || "";
    
    const program = getText('td:contains("Program:") + td strong');
    const department = departmentText.split("-")[0]?.trim() || "";
    const semester = getText('td:contains("Semester:") + td strong');
    const batch = getText('td:contains("Batch:") + td strong font');

    const userInfo: UserInfo = {
      regNumber,
      name,
      mobile,
      section,
      program,
      department,
      semester,
      batch,
    };

    return { userInfo, status: 200 };
  } catch (error) {
    console.error("Error parsing user info:", error);
    return { error: "Failed to parse user info", status: 500 };
  }
}

/**
 * Main function to get user info data
 * @param cookies - Authentication cookies
 * @returns Promise<UserInfoResponse>
 */
export async function getUserInfo(cookies: string): Promise<UserInfoResponse> {
  try {
    const htmlResponse = await fetchUserInfoData(cookies);
    return await parseUserInfoHtml(htmlResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch user info",
      status: 500,
    };
  }
}
