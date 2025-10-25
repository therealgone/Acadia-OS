# SRM Academia HTML Scraper

A comprehensive Node.js + TypeScript web scraper for SRM Academia that scrapes HTML pages to provide structured access to student data including timetables, attendance, marks, calendar events, user profiles, and course details.

## Features

- **HTML Scraping**: Uses `node-html-parser` to scrape actual HTML pages
- **Authentication**: Secure login with automatic cookie management using `tough-cookie`
- **Timetable**: Fetch and parse class schedules from HTML tables
- **Attendance**: Track attendance records and statistics
- **Marks**: Retrieve exam results and grades
- **Calendar**: Access academic calendar and events
- **User Profile**: Get student information and academic details
- **Course Details**: Fetch comprehensive course information

## Installation

```bash
npm install
```

## Dependencies

- `got`: HTTP client for web requests
- `tough-cookie`: Cookie management for session handling
- `node-html-parser`: Fast HTML parsing with jQuery-like selectors
- `typescript`: TypeScript support

## Quick Test

Run the test script to verify everything works:

```bash
npm run test
```

This will test login with credentials `jm7531` / `Dharun-07` and fetch all available data.

## Usage in Your Project

### Import the Main API Class

```typescript
import SRMAcademiaAPI from './path/to/SRM-SCRAPPER/src/index';

const api = new SRMAcademiaAPI();

// Login
const loginResult = await api.login('username', 'password');
if (loginResult.success) {
  console.log('Login successful');
  
  // Fetch timetable
  const timetable = await api.getTimetable({
    semester: '6',
    section: 'A',
    academicYear: '2023-24'
  });
  
  // Get attendance
  const attendance = await api.getAttendance();
  
  // Get marks
  const marks = await api.getMarks();
  
  // Get calendar events
  const events = await api.getUpcomingEvents(30);
  
  // Get user profile
  const profile = await api.getUserProfile();
  
  // Get course details
  const courses = await api.getCourseDetails();
}
```

### Import Individual Modules

```typescript
import { authenticateUser } from './path/to/SRM-SCRAPPER/src/login';
import { fetchTimetableData } from './path/to/SRM-SCRAPPER/src/timetable';
import { fetchAttendanceData } from './path/to/SRM-SCRAPPER/src/attendance';

// Login first
const loginResult = await authenticateUser({ username: 'user', password: 'pass' });

if (loginResult.success) {
  // Use other modules
  const timetable = await fetchTimetableData({
    semester: '6',
    section: 'A',
    academicYear: '2023-24'
  });
  
  const attendance = await fetchAttendanceData();
}
```

## API Reference

### Authentication
- `login(username, password)` - Authenticate user (scrapes login form)
- `validateSession()` - Check session validity by accessing dashboard
- `logout()` - End session

### Timetable
- `getTimetable(batchInfo)` - Fetch complete timetable from HTML table
- `getTimetableForDay(day, batchInfo)` - Get schedule for specific day
- `getTimetableForSubject(subjectCode, batchInfo)` - Get schedule for specific subject

### Attendance
- `getAttendance(filters?)` - Fetch attendance records from HTML table
- `getAttendanceForSubject(subjectCode)` - Get attendance for specific subject
- `getLowAttendanceSubjects(minPercentage?)` - Get subjects with low attendance
- `getAttendanceStatistics()` - Get attendance summary

### Marks
- `getMarks(filters?)` - Fetch marks/grades from HTML results table
- `getMarksForSubject(subjectCode)` - Get marks for specific subject
- `getFailedSubjects()` - Get failed subjects
- `getMarksStatistics()` - Get marks summary

### Calendar
- `getCalendarEvents(filters?)` - Fetch calendar events from HTML
- `getUpcomingEvents(days?)` - Get upcoming events
- `getExamSchedule()` - Get exam schedule
- `getAssignmentDeadlines()` - Get assignment deadlines
- `getHolidayList()` - Get holiday list

### User Profile
- `getUserProfile()` - Fetch complete user profile from HTML
- `getUserBasicInfo()` - Get basic user information
- `getUserAcademicInfo()` - Get academic details
- `getUserContactInfo()` - Get contact information

### Course Details
- `getCourseDetails(filters?)` - Fetch course information from HTML
- `getCourseByCode(courseCode)` - Get specific course details
- `getCoursesBySemester(semester)` - Get courses for semester
- `getCoursesByType(courseType)` - Get courses by type

## Error Handling

All methods return structured responses with success flags and error messages:

```typescript
{
  success: boolean;
  data: any;
  error?: string;
}
```

## HTML Scraping Features

- **Flexible Selectors**: Uses multiple CSS selectors to find elements
- **Error Handling**: Graceful handling of missing elements
- **Session Validation**: Checks for login forms to detect expired sessions
- **Data Extraction**: Robust parsing of text content and attributes
- **Fallback Logic**: Multiple ways to find the same information

## TypeScript Support

Full TypeScript support with comprehensive type definitions for all data structures.

## License

MIT
