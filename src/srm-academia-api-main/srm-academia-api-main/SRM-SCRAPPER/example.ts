import SRMAcademiaAPI from './src/index';

// Example usage in your project
async function exampleUsage() {
  console.log('📚 SRM Academia Scraper - Example Usage\n');
  
  // Initialize the API
  const api = new SRMAcademiaAPI();
  
  try {
    // Login with your credentials
    console.log('🔐 Logging in...');
    const loginResult = await api.login('jm7531', 'Dharun-07');
    
    if (!loginResult.success) {
      console.log('❌ Login failed:', loginResult.error);
      console.log('💡 Note: This is expected since we\'re using placeholder URLs for demonstration');
      return;
    }
    
    console.log('✅ Login successful!');
    
    // Get user profile
    console.log('\n👤 Fetching user profile...');
    const profile = await api.getUserProfile();
    if (profile.success) {
      console.log('✅ Profile data structure:', {
        name: profile.data?.personalInfo.fullName,
        studentId: profile.data?.academicInfo.studentId,
        course: profile.data?.academicInfo.course,
        email: profile.data?.contactInfo.email
      });
    }
    
    // Get timetable
    console.log('\n📅 Fetching timetable...');
    const timetable = await api.getTimetable({
      semester: '6',
      section: 'A',
      academicYear: '2023-24'
    });
    if (timetable.success) {
      console.log('✅ Timetable data structure:', {
        totalEntries: timetable.data.length,
        sampleEntry: timetable.data[0] ? {
          day: timetable.data[0].dayOfWeek,
          time: timetable.data[0].timeSlot.startTime + '-' + timetable.data[0].timeSlot.endTime,
          subject: timetable.data[0].subject.subjectCode,
          faculty: timetable.data[0].subject.facultyName
        } : 'No entries'
      });
    }
    
    // Get attendance
    console.log('\n📊 Fetching attendance...');
    const attendance = await api.getAttendance();
    if (attendance.success) {
      console.log('✅ Attendance data structure:', {
        totalSubjects: attendance.data.length,
        overallAttendance: attendance.summary.overallAttendance + '%',
        warningSubjects: attendance.summary.warningSubjects.length
      });
    }
    
    // Get marks
    console.log('\n📈 Fetching marks...');
    const marks = await api.getMarks();
    if (marks.success) {
      console.log('✅ Marks data structure:', {
        totalSubjects: marks.data.length,
        overallCGPA: marks.summary.overallCGPA,
        passedSubjects: marks.summary.passedSubjects
      });
    }
    
    // Get calendar events
    console.log('\n📆 Fetching calendar events...');
    const events = await api.getUpcomingEvents(30);
    console.log('✅ Calendar events structure:', {
      totalEvents: events.length,
      sampleEvent: events[0] ? {
        title: events[0].title,
        type: events[0].eventType,
        date: events[0].startDate
      } : 'No events'
    });
    
    // Get course details
    console.log('\n📚 Fetching course details...');
    const courses = await api.getCourseDetails();
    if (courses.success) {
      console.log('✅ Course details structure:', {
        totalCourses: courses.data.length,
        sampleCourse: courses.data[0] ? {
          code: courses.data[0].courseDetails.courseCode,
          name: courses.data[0].courseDetails.courseName,
          credits: courses.data[0].courseDetails.credits
        } : 'No courses'
      });
    }
    
    console.log('\n🎉 All data structures are ready for your project!');
    console.log('\n📋 Next steps:');
    console.log('1. Update the URLs in each module to point to your actual SRM Academia website');
    console.log('2. Adjust the HTML selectors based on your website\'s structure');
    console.log('3. Test with real credentials');
    console.log('4. Import and use in your React/Next.js project');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Run the example
exampleUsage().catch(console.error);

