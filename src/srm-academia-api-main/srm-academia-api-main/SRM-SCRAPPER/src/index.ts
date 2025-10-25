import { authenticateUser, validateSession, logoutUser, getSessionCookies } from './login';
import { setCookieJar as setTimetableCookieJar, fetchTimetableData, getTimetableForDay, getTimetableForSubject } from './timetable';
import { setCookieJar as setAttendanceCookieJar, fetchAttendanceData, getAttendanceForSubject, getLowAttendanceSubjects, getAttendanceStatistics } from './attendance';
import { setCookieJar as setMarksCookieJar, fetchMarksData, getMarksForSubject, getFailedSubjects, getMarksStatistics } from './marks';
import { setCookieJar as setCalendarCookieJar, fetchCalendarEvents, getUpcomingEvents, getExamSchedule, getAssignmentDeadlines, getHolidayList, getCalendarStatistics } from './calendar';
import { setCookieJar as setUserInfoCookieJar, fetchUserProfile, getUserBasicInfo, getUserAcademicInfo, getUserContactInfo, getUserStatistics } from './userinfo';
import { setCookieJar as setCourseCookieJar, fetchCourseDetails, getCourseByCode, getCoursesBySemester, getCoursesByType, getLabCourses, getCoreCourses, getElectiveCourses, getCourseStatistics } from './course';
import { initializeCookieJar, getCookieJar, clearCookieJar, formatDate, getCurrentSemester, getAcademicYear, calculateCGPA, calculatePercentage, createApiResponse } from './utils';

// Main API class
export class SRMAcademiaAPI {
  private cookieJar: any = null;

  constructor() {
    this.cookieJar = initializeCookieJar();
    this.setupCookieJars();
  }

  private setupCookieJars(): void {
    setTimetableCookieJar(this.cookieJar);
    setAttendanceCookieJar(this.cookieJar);
    setMarksCookieJar(this.cookieJar);
    setCalendarCookieJar(this.cookieJar);
    setUserInfoCookieJar(this.cookieJar);
    setCourseCookieJar(this.cookieJar);
  }

  // Authentication methods
  async login(username: string, password: string) {
    return await authenticateUser({ username, password });
  }

  async validateSession() {
    return await validateSession();
  }

  async logout() {
    return await logoutUser();
  }

  getCookies() {
    return getSessionCookies();
  }

  // Timetable methods
  async getTimetable(batchInfo: { semester: string; section: string; academicYear: string }) {
    return await fetchTimetableData(batchInfo);
  }

  async getTimetableForDay(dayOfWeek: string, batchInfo: { semester: string; section: string; academicYear: string }) {
    return await getTimetableForDay(dayOfWeek, batchInfo);
  }

  async getTimetableForSubject(subjectCode: string, batchInfo: { semester: string; section: string; academicYear: string }) {
    return await getTimetableForSubject(subjectCode, batchInfo);
  }

  // Attendance methods
  async getAttendance(filters?: { semester?: string; subjectCode?: string; minPercentage?: number; maxPercentage?: number }) {
    return await fetchAttendanceData(filters);
  }

  async getAttendanceForSubject(subjectCode: string) {
    return await getAttendanceForSubject(subjectCode);
  }

  async getLowAttendanceSubjects(minPercentage: number = 75) {
    return await getLowAttendanceSubjects(minPercentage);
  }

  async getAttendanceStatistics() {
    return await getAttendanceStatistics();
  }

  // Marks methods
  async getMarks(filters?: { semester?: string; examType?: string; subjectCode?: string }) {
    return await fetchMarksData(filters);
  }

  async getMarksForSubject(subjectCode: string) {
    return await getMarksForSubject(subjectCode);
  }

  async getFailedSubjects() {
    return await getFailedSubjects();
  }

  async getMarksStatistics() {
    return await getMarksStatistics();
  }

  // Calendar methods
  async getCalendarEvents(filters?: { startDate?: string; endDate?: string; eventType?: string; semester?: string; priority?: string }) {
    return await fetchCalendarEvents(filters);
  }

  async getUpcomingEvents(days: number = 30) {
    return await getUpcomingEvents(days);
  }

  async getExamSchedule() {
    return await getExamSchedule();
  }

  async getAssignmentDeadlines() {
    return await getAssignmentDeadlines();
  }

  async getHolidayList() {
    return await getHolidayList();
  }

  async getCalendarStatistics() {
    return await getCalendarStatistics();
  }

  // User info methods
  async getUserProfile() {
    return await fetchUserProfile();
  }

  async getUserBasicInfo() {
    return await getUserBasicInfo();
  }

  async getUserAcademicInfo() {
    return await getUserAcademicInfo();
  }

  async getUserContactInfo() {
    return await getUserContactInfo();
  }

  async getUserStatistics() {
    return await getUserStatistics();
  }

  // Course methods
  async getCourseDetails(filters?: { semester?: string; courseType?: string; courseCode?: string; facultyId?: string }) {
    return await fetchCourseDetails(filters);
  }

  async getCourseByCode(courseCode: string) {
    return await getCourseByCode(courseCode);
  }

  async getCoursesBySemester(semester: string) {
    return await getCoursesBySemester(semester);
  }

  async getCoursesByType(courseType: string) {
    return await getCoursesByType(courseType);
  }

  async getLabCourses() {
    return await getLabCourses();
  }

  async getCoreCourses() {
    return await getCoreCourses();
  }

  async getElectiveCourses() {
    return await getElectiveCourses();
  }

  async getCourseStatistics() {
    return await getCourseStatistics();
  }

  // Utility methods
  clearSession() {
    clearCookieJar();
  }

  getCurrentSemester() {
    return getCurrentSemester();
  }

  getAcademicYear() {
    return getAcademicYear();
  }
}

// Export individual modules for direct usage
export { authenticateUser, validateSession, logoutUser, getSessionCookies } from './login';
export { fetchTimetableData, getTimetableForDay, getTimetableForSubject } from './timetable';
export { fetchAttendanceData, getAttendanceForSubject, getLowAttendanceSubjects, getAttendanceStatistics } from './attendance';
export { fetchMarksData, getMarksForSubject, getFailedSubjects, getMarksStatistics } from './marks';
export { fetchCalendarEvents, getUpcomingEvents, getExamSchedule, getAssignmentDeadlines, getHolidayList, getCalendarStatistics } from './calendar';
export { fetchUserProfile, getUserBasicInfo, getUserAcademicInfo, getUserContactInfo, getUserStatistics } from './userinfo';
export { fetchCourseDetails, getCourseByCode, getCoursesBySemester, getCoursesByType, getLabCourses, getCoreCourses, getElectiveCourses, getCourseStatistics } from './course';
export { initializeCookieJar, getCookieJar, clearCookieJar, formatDate, getCurrentSemester, getAcademicYear, calculateCGPA, calculatePercentage, createApiResponse } from './utils';

// Default export
export default SRMAcademiaAPI;
