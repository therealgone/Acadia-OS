// Export all authentication functions
export {
  validateUsername as verifyUser,
  authenticateUser as verifyPassword,
  loginUser,
} from './login';

// Export all data fetching functions
export { getTimetable } from './timetable';
export { getAttendance } from './attendance';
export { getMarks } from './marks';
export { getUserInfo } from './userInfo';
export { getCourseDetails as getCourse } from './course';
export { getCalendar } from './calendar';
export { getDayOrder } from './dayOrder';

// Export logout function
export { logoutUser } from './logout';

// Export all types
export * from './types';