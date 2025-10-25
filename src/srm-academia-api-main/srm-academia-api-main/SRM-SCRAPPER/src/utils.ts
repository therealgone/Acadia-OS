import { CookieJar } from 'tough-cookie';

// Types
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  timestamp: string;
}

interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Global cookie jar instance
let globalCookieJar: CookieJar | null = null;

export function initializeCookieJar(): CookieJar {
  globalCookieJar = new CookieJar();
  return globalCookieJar;
}

export function getCookieJar(): CookieJar | null {
  return globalCookieJar;
}

export function setCookieJar(cookieJar: CookieJar): void {
  globalCookieJar = cookieJar;
}

export function clearCookieJar(): void {
  if (globalCookieJar) {
    globalCookieJar.removeAllCookiesSync();
  }
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  
  if (month >= 1 && month <= 6) {
    return 'Even';
  } else {
    return 'Odd';
  }
}

export function getAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  if (month >= 7) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

export function generateDateRange(startDate: string, endDate: string): DateRange {
  return {
    startDate: formatDate(parseDate(startDate)),
    endDate: formatDate(parseDate(endDate))
  };
}

export function getUpcomingDays(days: number): DateRange {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + days);
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const phoneRegex = /^[6-9]\d{9}$/;
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phone)) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateStudentId(studentId: string): ValidationResult {
  const errors: string[] = [];
  
  if (!studentId) {
    errors.push('Student ID is required');
  } else if (studentId.length < 6) {
    errors.push('Student ID must be at least 6 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function calculateCGPA(grades: string[], credits: number[]): number {
  if (grades.length !== credits.length || grades.length === 0) {
    return 0;
  }
  
  const gradePoints: { [key: string]: number } = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0
  };
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  for (let i = 0; i < grades.length; i++) {
    const points = gradePoints[grades[i]] || 0;
    totalPoints += points * credits[i];
    totalCredits += credits[i];
  }
  
  return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
}

export function calculatePercentage(obtained: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100;
}

export function formatTime(timeString: string): string {
  try {
    const time = new Date(`2000-01-01 ${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } catch {
    return timeString;
  }
}

export function getDayOfWeek(dateString: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = parseDate(dateString);
  return days[date.getDay()];
}

export function isWeekend(dateString: string): boolean {
  const date = parseDate(dateString);
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export function getTimeDifference(startTime: string, endTime: string): number {
  try {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
  } catch {
    return 0;
  }
}

export function sortByDate<T extends { [key: string]: any }>(items: T[], dateField: string): T[] {
  return items.sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return dateA.getTime() - dateB.getTime();
  });
}

export function filterByDateRange<T extends { [key: string]: any }>(
  items: T[], 
  dateField: string, 
  startDate: string, 
  endDate: string
): T[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return items.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end;
  });
}

export function groupBy<T>(items: T[], key: keyof T): { [key: string]: T[] } {
  return items.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as { [key: string]: T[] });
}

export function createApiResponse<T>(
  success: boolean, 
  data: T | null, 
  error?: string
): ApiResponse<T> {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await operation();
        resolve(result);
        return;
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries) {
          await sleep(delay * Math.pow(2, i)); // Exponential backoff
        }
      }
    }
    
    reject(lastError!);
  });
}

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .trim();
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

