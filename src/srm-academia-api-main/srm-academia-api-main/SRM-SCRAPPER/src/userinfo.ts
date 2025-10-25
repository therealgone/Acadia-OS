import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

// Types
interface PersonalInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  nationality: string;
  religion?: string;
}

interface ContactInfo {
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

interface AcademicInfo {
  studentId: string;
  registrationNumber: string;
  rollNumber: string;
  course: string;
  branch: string;
  semester: string;
  academicYear: string;
  admissionYear: string;
  expectedGraduationYear: string;
  currentCGPA: number;
  totalCredits: number;
}

interface UserProfile {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  academicInfo: AcademicInfo;
  profilePicture?: string;
  lastUpdated: string;
}

interface UserInfoResponse {
  success: boolean;
  data: UserProfile | null;
  error?: string;
}

// Global cookie jar reference
let globalCookieJar: CookieJar | null = null;

export function setCookieJar(cookieJar: CookieJar): void {
  globalCookieJar = cookieJar;
}

export async function fetchUserProfile(): Promise<UserInfoResponse> {
  try {
    if (!globalCookieJar) {
      throw new Error('Cookie jar not initialized. Please authenticate first.');
    }

    const profileUrl = 'https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_2023_24';
    
    const response = await got.get(profileUrl, {
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
        request: 10000
      }
    });

    const responseHtml = parse(response.body);
    
    // Check if we're still logged in
    if (responseHtml.querySelector('.login-form') !== null) {
      return {
        success: false,
        data: null,
        error: 'Session expired. Please login again.'
      };
    }

    const parsedProfile = parseUserProfile(responseHtml);
    
    return {
      success: true,
      data: parsedProfile
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

function parseUserProfile(html: any): UserProfile {
  // Extract personal information
  const nameElement = html.querySelector('.user-name') ||
                     html.querySelector('.profile-name') ||
                     html.querySelector('h1') ||
                     html.querySelector('h2');
  
  const emailElement = html.querySelector('.user-email') ||
                      html.querySelector('[class*="email"]') ||
                      html.querySelector('a[href^="mailto:"]');
  
  const phoneElement = html.querySelector('.user-phone') ||
                      html.querySelector('[class*="phone"]') ||
                      html.querySelector('[class*="mobile"]');
  
  const studentIdElement = html.querySelector('.student-id') ||
                          html.querySelector('[class*="student"]') ||
                          html.querySelector('[class*="id"]');
  
  const courseElement = html.querySelector('.course-info') ||
                       html.querySelector('[class*="course"]') ||
                       html.querySelector('[class*="program"]');
  
  const semesterElement = html.querySelector('.semester-info') ||
                         html.querySelector('[class*="semester"]');

  const fullName = nameElement?.textContent?.trim() || '';
  const email = emailElement?.textContent?.trim() || 
               emailElement?.getAttribute('href')?.replace('mailto:', '') || '';
  const phoneNumber = phoneElement?.textContent?.trim() || '';
  const studentId = studentIdElement?.textContent?.trim() || '';
  const course = courseElement?.textContent?.trim() || '';
  const semester = semesterElement?.textContent?.trim() || '';

  // Parse name into first and last name
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const personalInfo: PersonalInfo = {
    firstName,
    lastName,
    fullName,
    dateOfBirth: '',
    gender: 'Other',
    bloodGroup: undefined,
    nationality: 'Indian',
    religion: undefined
  };

  const contactInfo: ContactInfo = {
    email,
    phoneNumber,
    alternatePhone: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    }
  };

  const academicInfo: AcademicInfo = {
    studentId,
    registrationNumber: '',
    rollNumber: '',
    course,
    branch: '',
    semester,
    academicYear: '',
    admissionYear: '',
    expectedGraduationYear: '',
    currentCGPA: 0,
    totalCredits: 0
  };

  return {
    personalInfo,
    contactInfo,
    academicInfo,
    profilePicture: undefined,
    lastUpdated: new Date().toISOString()
  };
}

export async function getUserBasicInfo(): Promise<{ name: string; studentId: string; course: string } | null> {
  const userResponse = await fetchUserProfile();
  
  if (!userResponse.success || !userResponse.data) {
    return null;
  }
  
  return {
    name: userResponse.data.personalInfo.fullName,
    studentId: userResponse.data.academicInfo.studentId,
    course: userResponse.data.academicInfo.course
  };
}

export async function getUserAcademicInfo(): Promise<AcademicInfo | null> {
  const userResponse = await fetchUserProfile();
  
  if (!userResponse.success || !userResponse.data) {
    return null;
  }
  
  return userResponse.data.academicInfo;
}

export async function getUserContactInfo(): Promise<ContactInfo | null> {
  const userResponse = await fetchUserProfile();
  
  if (!userResponse.success || !userResponse.data) {
    return null;
  }
  
  return userResponse.data.contactInfo;
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; message: string }> {
  try {
    if (!globalCookieJar) {
      throw new Error('Cookie jar not initialized. Please authenticate first.');
    }

    const updateEndpoint = 'https://srmap.edu.in/api/v1/user/profile/update';
    
    const response = await got.put(updateEndpoint, {
      json: updates,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      cookieJar: globalCookieJar,
      timeout: {
        request: 10000
      }
    });

    const responseData = JSON.parse(response.body);
    
    if (responseData.success) {
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } else {
      return {
        success: false,
        message: responseData.message || 'Failed to update profile'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Update failed: ' + error.message
    };
  }
}

export async function getUserStatistics(): Promise<{ 
  totalSemesters: number; 
  completedCredits: number; 
  remainingCredits: number; 
  yearsCompleted: number 
} | null> {
  const userResponse = await fetchUserProfile();
  
  if (!userResponse.success || !userResponse.data) {
    return null;
  }
  
  const academicInfo = userResponse.data.academicInfo;
  const admissionYear = parseInt(academicInfo.admissionYear);
  const currentYear = new Date().getFullYear();
  const yearsCompleted = currentYear - admissionYear;
  
  // Assuming 4-year course with 8 semesters
  const totalSemesters = 8;
  const totalCredits = 160; // Typical for 4-year engineering course
  const completedCredits = academicInfo.totalCredits;
  const remainingCredits = totalCredits - completedCredits;

  return {
    totalSemesters,
    completedCredits,
    remainingCredits,
    yearsCompleted
  };
}
