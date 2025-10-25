import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

// Types
interface ExamResult {
  examType: string;
  examDate: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Absent' | 'Pending';
}

interface SubjectMarks {
  subjectCode: string;
  subjectName: string;
  credits: number;
  examResults: ExamResult[];
  totalMarks: number;
  averagePercentage: number;
  finalGrade: string;
  semester: string;
}

interface MarksSummary {
  totalSubjects: number;
  totalCredits: number;
  overallCGPA: number;
  semesterGPA: number;
  passedSubjects: number;
  failedSubjects: number;
  pendingResults: number;
}

interface MarksResponse {
  success: boolean;
  data: SubjectMarks[];
  summary: MarksSummary;
  semester: string;
  error?: string;
}

interface MarksFilters {
  semester?: string;
  examType?: string;
  subjectCode?: string;
}

// Global cookie jar reference
let globalCookieJar: CookieJar | null = null;

export function setCookieJar(cookieJar: CookieJar): void {
  globalCookieJar = cookieJar;
}

export async function fetchMarksData(filters?: MarksFilters): Promise<MarksResponse> {
  try {
    if (!globalCookieJar) {
      throw new Error('Cookie jar not initialized. Please authenticate first.');
    }

    const marksUrl = 'https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Marks';
    
    const response = await got.get(marksUrl, {
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

    const parsedMarks = parseMarksData(responseHtml);
    const summary = calculateMarksSummary(parsedMarks);
    
    return {
      success: true,
      data: parsedMarks,
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

function parseMarksData(html: any): SubjectMarks[] {
  const subjectMarks: SubjectMarks[] = [];
  
  // Look for marks table or results container
  const marksTable = html.querySelector('.marks-table') || 
                    html.querySelector('.results-table') ||
                    html.querySelector('table[class*="marks"]') ||
                    html.querySelector('table[class*="result"]');
  
  if (!marksTable) {
    return subjectMarks;
  }

  // Parse table rows
  const rows = marksTable.querySelectorAll('tr');
  
  for (let i = 1; i < rows.length; i++) { // Skip header row
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    
    if (cells.length >= 6) { // Assuming: Subject, Credits, Mid-term, End-term, Assignment, Final Grade
      try {
        const subjectInfo = cells[0]?.textContent?.trim() || '';
        const creditsText = cells[1]?.textContent?.trim() || '0';
        const midTermText = cells[2]?.textContent?.trim() || '0';
        const endTermText = cells[3]?.textContent?.trim() || '0';
        const assignmentText = cells[4]?.textContent?.trim() || '0';
        const finalGradeText = cells[5]?.textContent?.trim() || 'F';

        // Parse subject code and name
        const subjectMatch = subjectInfo.match(/([A-Z0-9]+)\s*-\s*(.+)/);
        const subjectCode = subjectMatch ? subjectMatch[1] : subjectInfo;
        const subjectName = subjectMatch ? subjectMatch[2] : subjectInfo;

        const credits = parseInt(creditsText) || 0;
        const midTermMarks = parseInt(midTermText) || 0;
        const endTermMarks = parseInt(endTermText) || 0;
        const assignmentMarks = parseInt(assignmentText) || 0;
        const finalGrade = finalGradeText;

        // Create exam results
        const examResults: ExamResult[] = [];
        
        if (midTermMarks > 0) {
          examResults.push({
            examType: 'Mid-term',
            examDate: '',
            maxMarks: 50,
            obtainedMarks: midTermMarks,
            percentage: Math.round((midTermMarks / 50) * 100 * 100) / 100,
            grade: calculateGrade((midTermMarks / 50) * 100),
            status: determineExamStatus((midTermMarks / 50) * 100)
          });
        }
        
        if (endTermMarks > 0) {
          examResults.push({
            examType: 'End-term',
            examDate: '',
            maxMarks: 100,
            obtainedMarks: endTermMarks,
            percentage: Math.round((endTermMarks / 100) * 100 * 100) / 100,
            grade: calculateGrade((endTermMarks / 100) * 100),
            status: determineExamStatus((endTermMarks / 100) * 100)
          });
        }
        
        if (assignmentMarks > 0) {
          examResults.push({
            examType: 'Assignment',
            examDate: '',
            maxMarks: 20,
            obtainedMarks: assignmentMarks,
            percentage: Math.round((assignmentMarks / 20) * 100 * 100) / 100,
            grade: calculateGrade((assignmentMarks / 20) * 100),
            status: determineExamStatus((assignmentMarks / 20) * 100)
          });
        }

        const totalMarks = examResults.reduce((sum, exam) => sum + exam.obtainedMarks, 0);
        const averagePercentage = examResults.length > 0 ? 
          examResults.reduce((sum, exam) => sum + exam.percentage, 0) / examResults.length : 0;

        const subject: SubjectMarks = {
          subjectCode,
          subjectName,
          credits,
          examResults,
          totalMarks,
          averagePercentage: Math.round(averagePercentage * 100) / 100,
          finalGrade,
          semester: '' // Will be filled by caller
        };

        subjectMarks.push(subject);
      } catch (parseError) {
        console.warn('Failed to parse marks row:', parseError);
      }
    }
  }
  
  return subjectMarks;
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

function determineExamStatus(percentage: number, status?: string): 'Pass' | 'Fail' | 'Absent' | 'Pending' {
  if (status) {
    switch (status.toLowerCase()) {
      case 'pass': return 'Pass';
      case 'fail': return 'Fail';
      case 'absent': return 'Absent';
      case 'pending': return 'Pending';
    }
  }
  
  if (percentage >= 40) return 'Pass';
  if (percentage === 0) return 'Absent';
  return 'Fail';
}

function calculateMarksSummary(subjects: SubjectMarks[]): MarksSummary {
  if (subjects.length === 0) {
    return createEmptySummary();
  }

  const totalSubjects = subjects.length;
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  
  const passedSubjects = subjects.filter(s => s.finalGrade !== 'F').length;
  const failedSubjects = subjects.filter(s => s.finalGrade === 'F').length;
  const pendingResults = subjects.filter(s => 
    s.examResults.some(exam => exam.status === 'Pending')
  ).length;

  const overallCGPA = calculateCGPA(subjects);
  const semesterGPA = calculateSemesterGPA(subjects);

  return {
    totalSubjects,
    totalCredits,
    overallCGPA: Math.round(overallCGPA * 100) / 100,
    semesterGPA: Math.round(semesterGPA * 100) / 100,
    passedSubjects,
    failedSubjects,
    pendingResults
  };
}

function calculateCGPA(subjects: SubjectMarks[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const subject of subjects) {
    const gradePoints = getGradePoints(subject.finalGrade);
    totalPoints += gradePoints * subject.credits;
    totalCredits += subject.credits;
  }

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function calculateSemesterGPA(subjects: SubjectMarks[]): number {
  const currentSemester = subjects[0]?.semester;
  const semesterSubjects = subjects.filter(s => s.semester === currentSemester);
  
  if (semesterSubjects.length === 0) return 0;
  
  return calculateCGPA(semesterSubjects);
}

function getGradePoints(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0
  };
  return gradeMap[grade] || 0;
}

function createEmptySummary(): MarksSummary {
  return {
    totalSubjects: 0,
    totalCredits: 0,
    overallCGPA: 0,
    semesterGPA: 0,
    passedSubjects: 0,
    failedSubjects: 0,
    pendingResults: 0
  };
}

export async function getMarksForSubject(subjectCode: string): Promise<SubjectMarks | null> {
  const marksResponse = await fetchMarksData({ subjectCode });
  
  if (!marksResponse.success || marksResponse.data.length === 0) {
    return null;
  }
  
  return marksResponse.data[0];
}

export async function getFailedSubjects(): Promise<SubjectMarks[]> {
  const marksResponse = await fetchMarksData();
  
  if (!marksResponse.success) {
    return [];
  }
  
  return marksResponse.data.filter(subject => subject.finalGrade === 'F');
}

export async function getMarksStatistics(): Promise<MarksSummary> {
  const marksResponse = await fetchMarksData();
  
  if (!marksResponse.success) {
    return createEmptySummary();
  }
  
  return marksResponse.summary;
}
