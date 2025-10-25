import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

// Types
interface CourseDetails {
  courseCode: string;
  courseName: string;
  credits: number;
  semester: string;
  courseType: 'Core' | 'Elective' | 'Lab' | 'Project' | 'Internship';
  prerequisites: string[];
  description: string;
  objectives: string[];
  outcomes: string[];
  syllabus: string[];
}

interface FacultyInfo {
  facultyId: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phoneNumber?: string;
  qualifications: string[];
  experience: number;
}

interface CourseSchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  buildingName: string;
  isLab: boolean;
}

interface CourseResources {
  textbooks: string[];
  references: string[];
  onlineResources: string[];
  software: string[];
}

interface CourseInfo {
  courseDetails: CourseDetails;
  facultyInfo: FacultyInfo;
  schedule: CourseSchedule[];
  resources: CourseResources;
  assessmentPattern: {
    continuousAssessment: number;
    midTerm: number;
    endTerm: number;
    assignments: number;
    projects: number;
  };
  lastUpdated: string;
}

interface CourseResponse {
  success: boolean;
  data: CourseInfo[];
  totalCourses: number;
  semester: string;
  error?: string;
}

interface CourseFilters {
  semester?: string;
  courseType?: string;
  courseCode?: string;
  facultyId?: string;
}

// Global cookie jar reference
let globalCookieJar: CookieJar | null = null;

export function setCookieJar(cookieJar: CookieJar): void {
  globalCookieJar = cookieJar;
}

export async function fetchCourseDetails(filters?: CourseFilters): Promise<CourseResponse> {
  try {
    if (!globalCookieJar) {
      throw new Error('Cookie jar not initialized. Please authenticate first.');
    }

    // Generate dynamic URL for course details
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const academicYearString = `${currentYear - 2}_${(currentYear - 1).toString().slice(-2)}`;
    const coursesUrl = `https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_${academicYearString}`;
    
    const response = await got.get(coursesUrl, {
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
        totalCourses: 0,
        semester: filters?.semester || 'Current',
        error: 'Session expired. Please login again.'
      };
    }

    const parsedCourses = parseCourseData(responseHtml);
    
    return {
      success: true,
      data: parsedCourses,
      totalCourses: parsedCourses.length,
      semester: filters?.semester || 'Current'
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      totalCourses: 0,
      semester: filters?.semester || 'Current',
      error: error.message
    };
  }
}

function parseCourseData(html: any): CourseInfo[] {
  const courseInfo: CourseInfo[] = [];
  
  // Look for courses container or course list
  const coursesContainer = html.querySelector('.courses-container') || 
                          html.querySelector('.course-list') ||
                          html.querySelector('.subjects-list') ||
                          html.querySelector('[class*="course"]');
  
  if (!coursesContainer) {
    return courseInfo;
  }

  // Look for individual course elements
  const courseElements = coursesContainer.querySelectorAll('.course-item') ||
                        coursesContainer.querySelectorAll('.course-card') ||
                        coursesContainer.querySelectorAll('.subject-item') ||
                        coursesContainer.querySelectorAll('.card') ||
                        coursesContainer.querySelectorAll('tr');
  
  for (const courseElement of courseElements) {
    try {
      const titleElement = courseElement.querySelector('.course-title') ||
                          courseElement.querySelector('.subject-name') ||
                          courseElement.querySelector('h3') ||
                          courseElement.querySelector('h4') ||
                          courseElement.querySelector('td');
      
      const codeElement = courseElement.querySelector('.course-code') ||
                         courseElement.querySelector('.subject-code') ||
                         courseElement.querySelector('[class*="code"]');
      
      const creditsElement = courseElement.querySelector('.credits') ||
                            courseElement.querySelector('[class*="credit"]');
      
      const facultyElement = courseElement.querySelector('.faculty-name') ||
                            courseElement.querySelector('[class*="faculty"]') ||
                            courseElement.querySelector('[class*="instructor"]');
      
      const descriptionElement = courseElement.querySelector('.course-description') ||
                                courseElement.querySelector('.description') ||
                                courseElement.querySelector('p');

      const title = titleElement?.textContent?.trim() || '';
      const code = codeElement?.textContent?.trim() || '';
      const creditsText = creditsElement?.textContent?.trim() || '0';
      const facultyName = facultyElement?.textContent?.trim() || '';
      const description = descriptionElement?.textContent?.trim() || '';

      // Parse course code and name from title if code is not separate
      let courseCode = code;
      let courseName = title;
      
      if (!code && title) {
        const titleMatch = title.match(/([A-Z0-9]+)\s*-\s*(.+)/);
        if (titleMatch) {
          courseCode = titleMatch[1];
          courseName = titleMatch[2];
        }
      }

      const credits = parseInt(creditsText) || 0;

      const courseDetails: CourseDetails = {
        courseCode,
        courseName,
        credits,
        semester: '',
        courseType: determineCourseType('', courseName),
        prerequisites: [],
        description,
        objectives: [],
        outcomes: [],
        syllabus: []
      };

      const facultyInfo: FacultyInfo = {
        facultyId: '',
        name: facultyName,
        designation: '',
        department: '',
        email: '',
        phoneNumber: undefined,
        qualifications: [],
        experience: 0
      };

      const course: CourseInfo = {
        courseDetails,
        facultyInfo,
        schedule: [],
        resources: {
          textbooks: [],
          references: [],
          onlineResources: [],
          software: []
        },
        assessmentPattern: {
          continuousAssessment: 0,
          midTerm: 0,
          endTerm: 0,
          assignments: 0,
          projects: 0
        },
        lastUpdated: new Date().toISOString()
      };

      courseInfo.push(course);
    } catch (parseError) {
      console.warn('Failed to parse course data:', parseError);
    }
  }
  
  return courseInfo;
}

function determineCourseType(courseType: string, courseName: string): 'Core' | 'Elective' | 'Lab' | 'Project' | 'Internship' {
  const type = courseType?.toLowerCase() || '';
  const name = courseName?.toLowerCase() || '';
  
  if (type.includes('lab') || name.includes('lab')) return 'Lab';
  if (type.includes('project') || name.includes('project')) return 'Project';
  if (type.includes('internship') || name.includes('internship')) return 'Internship';
  if (type.includes('elective') || name.includes('elective')) return 'Elective';
  
  return 'Core';
}

export async function getCourseByCode(courseCode: string): Promise<CourseInfo | null> {
  const courseResponse = await fetchCourseDetails({ courseCode });
  
  if (!courseResponse.success || courseResponse.data.length === 0) {
    return null;
  }
  
  return courseResponse.data[0];
}

export async function getCoursesBySemester(semester: string): Promise<CourseInfo[]> {
  const courseResponse = await fetchCourseDetails({ semester });
  
  if (!courseResponse.success) {
    return [];
  }
  
  return courseResponse.data;
}

export async function getCoursesByType(courseType: string): Promise<CourseInfo[]> {
  const courseResponse = await fetchCourseDetails({ courseType });
  
  if (!courseResponse.success) {
    return [];
  }
  
  return courseResponse.data;
}

export async function getLabCourses(): Promise<CourseInfo[]> {
  return getCoursesByType('Lab');
}

export async function getCoreCourses(): Promise<CourseInfo[]> {
  return getCoursesByType('Core');
}

export async function getElectiveCourses(): Promise<CourseInfo[]> {
  return getCoursesByType('Elective');
}

export async function getCourseStatistics(): Promise<{
  totalCourses: number;
  coreCourses: number;
  electiveCourses: number;
  labCourses: number;
  projectCourses: number;
  totalCredits: number;
}> {
  const courseResponse = await fetchCourseDetails();
  
  if (!courseResponse.success) {
    return {
      totalCourses: 0,
      coreCourses: 0,
      electiveCourses: 0,
      labCourses: 0,
      projectCourses: 0,
      totalCredits: 0
    };
  }
  
  const courses = courseResponse.data;
  const totalCourses = courses.length;
  
  const coreCourses = courses.filter(c => c.courseDetails.courseType === 'Core').length;
  const electiveCourses = courses.filter(c => c.courseDetails.courseType === 'Elective').length;
  const labCourses = courses.filter(c => c.courseDetails.courseType === 'Lab').length;
  const projectCourses = courses.filter(c => c.courseDetails.courseType === 'Project').length;
  
  const totalCredits = courses.reduce((sum, course) => sum + course.courseDetails.credits, 0);

  return {
    totalCourses,
    coreCourses,
    electiveCourses,
    labCourses,
    projectCourses,
    totalCredits
  };
}
