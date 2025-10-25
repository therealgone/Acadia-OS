# SRM Academia Scrapper

A modern TypeScript scrapper for the SRMIST KTR Academia portal using `got` for HTTP requests and `node-html-parser` for HTML parsing. This package provides clean, modular functions to fetch student data including timetables, attendance, marks, user information, and course details.

## Features

- 🔐 **Authentication**: Complete login flow with username validation and password authentication
- 📅 **Timetable**: Get structured timetable data with course details and time slots
- 📊 **Attendance**: Get attendance data with status calculations
- 📈 **Marks**: Get marks data with exam details and totals
- 📚 **Course Details**: Get comprehensive course information
- 🗓️ **Calendar**: Get academic calendar with events and day orders
- 👤 **User Info**: Get student profile information
- 🛡️ **TypeScript Support**: Full TypeScript definitions included
- ⚡ **Modern Libraries**: Built with `got` and `node-html-parser`

## Installation

```bash
npm install got node-html-parser
npm install -D typescript @types/node ts-node
```

## Quick Start

```typescript
import {
  loginUser,
  getTimetable,
  getAttendance,
  getMarks,
  getUserInfo,
  getCalendar,
  getCourseDetails,
  logoutUser,
} from './index';
```

## Authentication

### Complete Login Flow

```typescript
// Login with username and password
const { data, error, isAuthenticated } = await loginUser("USERNAME", "PASSWORD");

if (isAuthenticated && data?.cookies) {
  console.log("Login successful!");
  console.log("Cookies:", data.cookies);
} else {
  console.log("Login failed:", error);
}
```

### Individual Authentication Steps

```typescript
// Step 1: Validate username
const userValidation = await validateUsername("USERNAME");
if (userValidation.data) {
  const { identifier, digest } = userValidation.data;
  
  // Step 2: Authenticate with password
  const authResult = await authenticateUser(identifier, digest, "PASSWORD");
  if (authResult.isAuthenticated && authResult.data?.cookies) {
    console.log("Authentication successful!");
  }
}
```

## Data Fetching

All data fetching functions require authentication cookies from the login process.

### Timetable

```typescript
const { timetable, error, status } = await getTimetable(cookies);

if (timetable) {
  timetable.forEach(day => {
    console.log(`${day.dayOrder}:`);
    day.class.forEach(slot => {
      if (slot.isClass) {
        console.log(`  ${slot.time}: ${slot.courseTitle} (${slot.courseCode})`);
      }
    });
  });
}
```

### Attendance

```typescript
const { attendance, error, status } = await getAttendance(cookies);

if (attendance) {
  attendance.forEach(course => {
    console.log(`${course.courseTitle}: ${course.courseAttendance}%`);
    console.log(`Status: ${course.courseAttendanceStatus.status}`);
  });
}
```

### Marks

```typescript
const { markList, error, status } = await getMarks(cookies);

if (markList) {
  markList.forEach(course => {
    console.log(`${course.course}: ${course.total.obtained}/${course.total.maxMark}`);
    course.marks.forEach(mark => {
      console.log(`  ${mark.exam}: ${mark.obtained}/${mark.maxMark}`);
    });
  });
}
```

### User Information

```typescript
const { userInfo, error, status } = await getUserInfo(cookies);

if (userInfo) {
  console.log(`Name: ${userInfo.name}`);
  console.log(`Registration: ${userInfo.regNumber}`);
  console.log(`Department: ${userInfo.department}`);
  console.log(`Program: ${userInfo.program}`);
}
```

### Course Details

```typescript
const { courseList, batch, error, status } = await getCourseDetails(cookies);

if (courseList) {
  console.log(`Batch: ${batch}`);
  courseList.forEach(course => {
    console.log(`${course.courseCode}: ${course.courseTitle}`);
    console.log(`Faculty: ${course.courseFaculty}`);
    console.log(`Slots: ${course.courseSlot.join(', ')}`);
  });
}
```

### Calendar

```typescript
const { calendar, error, status } = await getCalendar(cookies);

if (calendar) {
  calendar.forEach(month => {
    console.log(`\n${month.month}:`);
    month.days.forEach(day => {
      if (day.event) {
        console.log(`  ${day.date} (${day.day}): ${day.event}`);
      }
    });
  });
}
```

## Logout

```typescript
const { message, status } = await logoutUser(cookies);
console.log(message); // "Logout successful"
```

## Error Handling

All functions return consistent error responses:

```typescript
interface Response {
  data?: any;
  error?: string;
  status: number;
}
```

Common status codes:
- `200`: Success
- `401`: Unauthorized (invalid cookies)
- `404`: Data not found
- `500`: Internal server error

## TypeScript Support

All functions include full TypeScript definitions. Each file contains its own local type definitions, making it easy to use in any TypeScript project.

## File Structure

```
SRM-SCRAPPER/
├── index.ts          # Main exports
├── login.ts          # Authentication functions
├── timetable.ts      # Timetable fetching and parsing
├── attendance.ts     # Attendance fetching and parsing
├── marks.ts          # Marks fetching and parsing
├── userInfo.ts       # User info fetching and parsing
├── course.ts         # Course details fetching and parsing
├── calendar.ts       # Calendar fetching and parsing
├── logout.ts         # Logout function
├── package.json      # Dependencies
└── README.md         # This file
```

## Usage in React/Next.js

Each file is designed to be modular and can be imported individually:

```typescript
// In a React component
import { loginUser, getTimetable } from './SRM-SCRAPPER';

const MyComponent = () => {
  const handleLogin = async () => {
    const result = await loginUser(username, password);
    if (result.isAuthenticated) {
      const timetable = await getTimetable(result.data.cookies);
      // Use timetable data
    }
  };

  return (
    <button onClick={handleLogin}>
      Login and Get Timetable
    </button>
  );
};
```

## License

This project is licensed under the MIT License.

## Disclaimer

This package is not officially affiliated with SRM Institute of Science and Technology. Use responsibly and in accordance with the institution's terms of service.
