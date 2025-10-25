// Export all types for the local SRM-SCRAPPER package

// Attendance types
export interface AttendanceStatus {
  status: "required" | "margin";
  classes: number;
}

export interface AttendanceDetail {
  courseCode: string;
  courseTitle: string;
  courseCategory: string;
  courseFaculty: string;
  courseSlot: string;
  courseConducted: number;
  courseAbsent: number;
  courseAttendance: number;
  courseAttendanceStatus: AttendanceStatus;
}

export interface AttendanceResponse {
  attendance?: AttendanceDetail[];
  error?: string;
  status: number;
}

// Marks types
export interface Mark {
  exam: string;
  obtained: number;
  maxMark: number;
}

export interface MarkDetail {
  course: string;
  category: string;
  marks: Mark[];
  total: { obtained: number; maxMark: number };
}

export interface MarksResponse {
  markList?: MarkDetail[];
  error?: string;
  status: number;
}

// Timetable types
export interface CourseSlotInfo {
  courseTitle: string;
  courseCode: string;
  courseType: string;
  courseCategory: string;
  courseRoomNo: string;
}

export interface TimetableSlot {
  slot: string;
  isClass: boolean;
  courseTitle?: string;
  courseCode?: string;
  courseType?: string;
  courseCategory?: string;
  courseRoomNo?: string;
  time: string;
}

export interface DaySchedule {
  dayOrder: string;
  class: TimetableSlot[];
}

export interface TimetableResponse {
  timetable?: DaySchedule[];
  error?: string;
  status: number;
}

// User Info types
export interface UserInfo {
  regNumber: string;
  name: string;
  mobile: string;
  section: string;
  program: string;
  department: string;
  semester: string;
  batch: string;
}

export interface UserInfoResponse {
  userInfo?: UserInfo;
  error?: string;
  status: number;
}

// Course types
export interface CourseDetail {
  courseCode: string;
  courseTitle: string;
  courseCredit: string;
  courseCategory: string;
  courseType: string;
  courseFaculty: string;
  courseSlot: string[];
  courseRoomNo: string;
}

export interface CourseResponse {
  courseList?: CourseDetail[];
  batch?: string;
  error?: string;
  status: number;
}

// Calendar types
export interface CalendarDay {
  date: string;
  day: string;
  event: string;
  dayOrder: string;
}

export interface Month {
  month: string;
  days: CalendarDay[];
}

export interface CalendarResponse {
  calendar?: Month[];
  error?: string;
  status: number;
}

// Day Order types
export interface DayOrderResponse {
  dayOrder?: string;
  error?: string;
  status: number;
}

// Login types
export interface PasswordInput {
  digest: string;
  identifier: string;
  password: string;
}

export interface UserLookupResponse {
  lookup?: {
    identifier: string;
    digest: string;
  };
  status_code: number;
  message: string;
  error?: string;
}

export interface UserValidationResult {
  data?: {
    identifier?: string;
    digest?: string;
    status_code: number;
    message: string;
  };
  error?: string;
  errorReason?: unknown;
}

export interface PasswordAuthResponse {
  status_code: number;
  localized_message?: string;
  cdigest?: string;
}

export interface AuthResult {
  data?: {
    cookies?: string;
    statusCode: number;
    message?: string;
    captcha?: {
      required: boolean;
      digest: string | null | undefined;
    };
  };
  isAuthenticated?: boolean;
  error?: string;
  errorReason?: unknown;
}

export interface LogoutResponse {
  message: string;
  status: number;
}

