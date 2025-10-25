import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

// Types
interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
}

interface SubjectInfo {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  roomNumber: string;
  buildingName: string;
}

interface ScheduleEntry {
  dayOfWeek: string;
  timeSlot: TimeSlot;
  subject: SubjectInfo;
  isLab: boolean;
  semester: string;
  section: string;
}

interface TimetableResponse {
  success: boolean;
  data: ScheduleEntry[];
  semester: string;
  academicYear: string;
  error?: string;
}

interface BatchInfo {
  semester: string;
  section: string;
  academicYear: string;
}

// Global cookie jar reference
let globalCookieJar: CookieJar | null = null;

export function setCookieJar(cookieJar: CookieJar): void {
  globalCookieJar = cookieJar;
}

export async function fetchTimetableData(batchInfo: BatchInfo): Promise<TimetableResponse> {
  try {
    if (!globalCookieJar) {
      throw new Error('Cookie jar not initialized. Please authenticate first.');
    }

    // Generate dynamic URL for timetable
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const academicYearString = `${currentYear - 2}_${(currentYear - 1).toString().slice(-2)}`;
    const timetableUrl = `https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_${academicYearString}`;
    
    const response = await got.get(timetableUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://academia.srmist.edu.in/',
        'x-requested-with': 'XMLHttpRequest',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      cookieJar: globalCookieJar,
      timeout: {
        request: 15000
      }
    });

    const responseHtml = parse(response.body);
    
    // Check if we're still logged in
    if (responseHtml.querySelector('.login-form') !== null) {
      return {
        success: false,
        data: [],
        semester: batchInfo.semester,
        academicYear: batchInfo.academicYear,
        error: 'Session expired. Please login again.'
      };
    }

    const parsedSchedule = parseTimetableData(responseHtml);
    
    return {
      success: true,
      data: parsedSchedule,
      semester: batchInfo.semester,
      academicYear: batchInfo.academicYear
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      semester: batchInfo.semester,
      academicYear: batchInfo.academicYear,
      error: error.message
    };
  }
}

function parseTimetableData(html: any): ScheduleEntry[] {
  const scheduleEntries: ScheduleEntry[] = [];
  
  // Look for timetable table or schedule container
  const timetableTable = html.querySelector('.timetable-table') || 
                        html.querySelector('.schedule-table') ||
                        html.querySelector('table[class*="timetable"]') ||
                        html.querySelector('table[class*="schedule"]');
  
  if (!timetableTable) {
    return scheduleEntries;
  }

  // Parse table rows
  const rows = timetableTable.querySelectorAll('tr');
  
  for (let i = 1; i < rows.length; i++) { // Skip header row
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    
    if (cells.length >= 6) { // Assuming: Day, Time, Subject, Faculty, Room, Building
      try {
        const dayOfWeek = cells[0]?.textContent?.trim() || '';
        const timeSlot = cells[1]?.textContent?.trim() || '';
        const subjectInfo = cells[2]?.textContent?.trim() || '';
        const facultyName = cells[3]?.textContent?.trim() || '';
        const roomNumber = cells[4]?.textContent?.trim() || '';
        const buildingName = cells[5]?.textContent?.trim() || '';

        // Parse time slot
        const timeMatch = timeSlot.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
        const startTime = timeMatch ? timeMatch[1] : '00:00';
        const endTime = timeMatch ? timeMatch[2] : '00:00';

        // Parse subject code and name
        const subjectMatch = subjectInfo.match(/([A-Z0-9]+)\s*-\s*(.+)/);
        const subjectCode = subjectMatch ? subjectMatch[1] : subjectInfo;
        const subjectName = subjectMatch ? subjectMatch[2] : subjectInfo;

        const timeSlotObj: TimeSlot = {
          startTime,
          endTime,
          duration: calculateDuration(startTime, endTime)
        };

        const subject: SubjectInfo = {
          subjectCode,
          subjectName,
          facultyName,
          roomNumber,
          buildingName
        };

        const entry: ScheduleEntry = {
          dayOfWeek,
          timeSlot: timeSlotObj,
          subject,
          isLab: subjectName.toLowerCase().includes('lab') || 
                subjectCode.toLowerCase().includes('lab'),
          semester: '', // Will be filled by caller
          section: '' // Will be filled by caller
        };

        scheduleEntries.push(entry);
      } catch (parseError) {
        console.warn('Failed to parse timetable row:', parseError);
      }
    }
  }
  
  return scheduleEntries;
}

function calculateDuration(startTime: string, endTime: string): number {
  try {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  } catch {
    return 0;
  }
}

export async function getTimetableForDay(dayOfWeek: string, batchInfo: BatchInfo): Promise<ScheduleEntry[]> {
  const timetableResponse = await fetchTimetableData(batchInfo);
  
  if (!timetableResponse.success) {
    return [];
  }
  
  return timetableResponse.data.filter(entry => 
    entry.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
  );
}

export async function getTimetableForSubject(subjectCode: string, batchInfo: BatchInfo): Promise<ScheduleEntry[]> {
  const timetableResponse = await fetchTimetableData(batchInfo);
  
  if (!timetableResponse.success) {
    return [];
  }
  
  return timetableResponse.data.filter(entry => 
    entry.subject.subjectCode.toLowerCase() === subjectCode.toLowerCase()
  );
}
