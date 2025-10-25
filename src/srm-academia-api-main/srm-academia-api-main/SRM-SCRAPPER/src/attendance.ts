import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

// Types
interface AttendanceRecord {
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  attendancePercentage: number;
  status: 'Present' | 'Absent' | 'On Leave' | 'Late';
  lastUpdated: string;
}

interface AttendanceSummary {
  overallAttendance: number;
  totalSubjects: number;
  subjectsAbove75: number;
  subjectsBelow75: number;
  warningSubjects: string[];
}

interface AttendanceResponse {
  success: boolean;
  data: AttendanceRecord[];
  summary: AttendanceSummary;
  semester: string;
  error?: string;
}

interface AttendanceFilters {
  semester?: string;
  subjectCode?: string;
  minPercentage?: number;
  maxPercentage?: number;
}

// Global cookie jar reference
let globalCookieJar: CookieJar | null = null;

export function setCookieJar(cookieJar: CookieJar): void {
  globalCookieJar = cookieJar;
}

export async function fetchAttendanceData(filters?: AttendanceFilters): Promise<AttendanceResponse> {
  try {
    if (!globalCookieJar) {
      throw new Error('Cookie jar not initialized. Please authenticate first.');
    }

    const attendanceUrl = 'https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Attendance';
    
    const response = await got.get(attendanceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://academia.srmist.edu.in/',
        'x-requested-with': 'XMLHttpRequest',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
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
        summary: createEmptySummary(),
        semester: filters?.semester || 'Current',
        error: 'Session expired. Please login again.'
      };
    }

    const parsedAttendance = parseAttendanceData(responseHtml);
    const summary = calculateAttendanceSummary(parsedAttendance);
    
    return {
      success: true,
      data: parsedAttendance,
      summary,
      semester: filters?.semester || 'Current'
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      summary: createEmptySummary(),
      semester: filters?.semester || 'Current',
      error: error.message
    };
  }
}

function parseAttendanceData(html: any): AttendanceRecord[] {
  const attendanceRecords: AttendanceRecord[] = [];
  
  // Look for attendance table or records container
  const attendanceTable = html.querySelector('.attendance-table') || 
                         html.querySelector('.records-table') ||
                         html.querySelector('table[class*="attendance"]') ||
                         html.querySelector('table[class*="record"]');
  
  if (!attendanceTable) {
    return attendanceRecords;
  }

  // Parse table rows
  const rows = attendanceTable.querySelectorAll('tr');
  
  for (let i = 1; i < rows.length; i++) { // Skip header row
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    
    if (cells.length >= 5) { // Assuming: Subject, Total Classes, Attended, Absent, Percentage
      try {
        const subjectInfo = cells[0]?.textContent?.trim() || '';
        const totalClassesText = cells[1]?.textContent?.trim() || '0';
        const attendedClassesText = cells[2]?.textContent?.trim() || '0';
        const absentClassesText = cells[3]?.textContent?.trim() || '0';
        const percentageText = cells[4]?.textContent?.trim() || '0';

        // Parse subject code and name
        const subjectMatch = subjectInfo.match(/([A-Z0-9]+)\s*-\s*(.+)/);
        const subjectCode = subjectMatch ? subjectMatch[1] : subjectInfo;
        const subjectName = subjectMatch ? subjectMatch[2] : subjectInfo;

        const totalClasses = parseInt(totalClassesText) || 0;
        const attendedClasses = parseInt(attendedClassesText) || 0;
        const absentClasses = parseInt(absentClassesText) || 0;
        const attendancePercentage = parseFloat(percentageText.replace('%', '')) || 0;

        const record: AttendanceRecord = {
          subjectCode,
          subjectName,
          totalClasses,
          attendedClasses,
          absentClasses,
          attendancePercentage,
          status: determineAttendanceStatus(attendancePercentage),
          lastUpdated: new Date().toISOString()
        };

        attendanceRecords.push(record);
      } catch (parseError) {
        console.warn('Failed to parse attendance row:', parseError);
      }
    }
  }
  
  return attendanceRecords;
}

function determineAttendanceStatus(percentage: number): 'Present' | 'Absent' | 'On Leave' | 'Late' {
  if (percentage >= 75) return 'Present';
  if (percentage >= 50) return 'Late';
  if (percentage > 0) return 'On Leave';
  return 'Absent';
}

function calculateAttendanceSummary(records: AttendanceRecord[]): AttendanceSummary {
  if (records.length === 0) {
    return createEmptySummary();
  }

  const totalSubjects = records.length;
  const subjectsAbove75 = records.filter(r => r.attendancePercentage >= 75).length;
  const subjectsBelow75 = totalSubjects - subjectsAbove75;
  
  const overallAttendance = records.reduce((sum, record) => 
    sum + record.attendancePercentage, 0) / totalSubjects;
  
  const warningSubjects = records
    .filter(r => r.attendancePercentage < 75)
    .map(r => r.subjectCode);

  return {
    overallAttendance: Math.round(overallAttendance * 100) / 100,
    totalSubjects,
    subjectsAbove75,
    subjectsBelow75,
    warningSubjects
  };
}

function createEmptySummary(): AttendanceSummary {
  return {
    overallAttendance: 0,
    totalSubjects: 0,
    subjectsAbove75: 0,
    subjectsBelow75: 0,
    warningSubjects: []
  };
}

export async function getAttendanceForSubject(subjectCode: string): Promise<AttendanceRecord | null> {
  const attendanceResponse = await fetchAttendanceData({ subjectCode });
  
  if (!attendanceResponse.success || attendanceResponse.data.length === 0) {
    return null;
  }
  
  return attendanceResponse.data[0];
}

export async function getLowAttendanceSubjects(minPercentage: number = 75): Promise<AttendanceRecord[]> {
  const attendanceResponse = await fetchAttendanceData();
  
  if (!attendanceResponse.success) {
    return [];
  }
  
  return attendanceResponse.data.filter(record => 
    record.attendancePercentage < minPercentage
  );
}

export async function getAttendanceStatistics(): Promise<AttendanceSummary> {
  const attendanceResponse = await fetchAttendanceData();
  
  if (!attendanceResponse.success) {
    return createEmptySummary();
  }
  
  return attendanceResponse.summary;
}
