import SRMAcademiaAPI from './src/index';

async function testSRMScraper() {
  console.log('🚀 Starting SRM Academia Scraper Test...\n');
  
  const api = new SRMAcademiaAPI();
  
  try {
    // Test Login
    console.log('📝 Testing Login...');
    const loginResult = await api.login('jm7531', 'Dharun-07');
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.error);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🍪 Session cookies:', loginResult.cookies?.substring(0, 50) + '...\n');
    
    // Test User Profile
    console.log('👤 Fetching User Profile...');
    const profile = await api.getUserProfile();
    if (profile.success && profile.data) {
      console.log('✅ User Profile:');
      console.log('   Name:', profile.data.personalInfo.fullName);
      console.log('   Student ID:', profile.data.academicInfo.studentId);
      console.log('   Course:', profile.data.academicInfo.course);
      console.log('   Semester:', profile.data.academicInfo.semester);
      console.log('   Email:', profile.data.contactInfo.email);
      console.log('   Phone:', profile.data.contactInfo.phoneNumber);
    } else {
      console.log('❌ User Profile failed:', profile.error);
    }
    console.log('');
    
    // Test Basic User Info
    console.log('📋 Fetching Basic User Info...');
    const basicInfo = await api.getUserBasicInfo();
    if (basicInfo) {
      console.log('✅ Basic Info:', basicInfo);
    } else {
      console.log('❌ Basic Info failed');
    }
    console.log('');
    
    // Test Academic Info
    console.log('🎓 Fetching Academic Info...');
    const academicInfo = await api.getUserAcademicInfo();
    if (academicInfo) {
      console.log('✅ Academic Info:', academicInfo);
    } else {
      console.log('❌ Academic Info failed');
    }
    console.log('');
    
    // Test Timetable
    console.log('📅 Fetching Timetable...');
    const timetable = await api.getTimetable({
      semester: '6',
      section: 'A',
      academicYear: '2023-24'
    });
    if (timetable.success) {
      console.log('✅ Timetable fetched:', timetable.data.length, 'entries');
      if (timetable.data.length > 0) {
        console.log('   Sample entry:', {
          day: timetable.data[0].dayOfWeek,
          time: timetable.data[0].timeSlot.startTime + '-' + timetable.data[0].timeSlot.endTime,
          subject: timetable.data[0].subject.subjectCode,
          faculty: timetable.data[0].subject.facultyName,
          room: timetable.data[0].subject.roomNumber
        });
      }
    } else {
      console.log('❌ Timetable failed:', timetable.error);
    }
    console.log('');
    
    // Test Attendance
    console.log('📊 Fetching Attendance...');
    const attendance = await api.getAttendance();
    if (attendance.success) {
      console.log('✅ Attendance fetched:', attendance.data.length, 'subjects');
      console.log('   Overall Attendance:', attendance.summary.overallAttendance + '%');
      console.log('   Subjects above 75%:', attendance.summary.subjectsAbove75);
      console.log('   Warning subjects:', attendance.summary.warningSubjects.length);
      if (attendance.data.length > 0) {
        console.log('   Sample subject:', {
          code: attendance.data[0].subjectCode,
          name: attendance.data[0].subjectName,
          percentage: attendance.data[0].attendancePercentage + '%',
          status: attendance.data[0].status
        });
      }
    } else {
      console.log('❌ Attendance failed:', attendance.error);
    }
    console.log('');
    
    // Test Marks
    console.log('📈 Fetching Marks...');
    const marks = await api.getMarks();
    if (marks.success) {
      console.log('✅ Marks fetched:', marks.data.length, 'subjects');
      console.log('   Overall CGPA:', marks.summary.overallCGPA);
      console.log('   Semester GPA:', marks.summary.semesterGPA);
      console.log('   Passed subjects:', marks.summary.passedSubjects);
      console.log('   Failed subjects:', marks.summary.failedSubjects);
      if (marks.data.length > 0) {
        console.log('   Sample subject:', {
          code: marks.data[0].subjectCode,
          name: marks.data[0].subjectName,
          grade: marks.data[0].finalGrade,
          credits: marks.data[0].credits
        });
      }
    } else {
      console.log('❌ Marks failed:', marks.error);
    }
    console.log('');
    
    // Test Calendar Events
    console.log('📆 Fetching Calendar Events...');
    const events = await api.getUpcomingEvents(30);
    if (events.length > 0) {
      console.log('✅ Calendar events fetched:', events.length, 'events');
      console.log('   Sample event:', {
        title: events[0].title,
        type: events[0].eventType,
        date: events[0].startDate,
        priority: events[0].priority
      });
    } else {
      console.log('❌ Calendar events failed or no events found');
    }
    console.log('');
    
    // Test Course Details
    console.log('📚 Fetching Course Details...');
    const courses = await api.getCourseDetails();
    if (courses.success) {
      console.log('✅ Course details fetched:', courses.data.length, 'courses');
      if (courses.data.length > 0) {
        console.log('   Sample course:', {
          code: courses.data[0].courseDetails.courseCode,
          name: courses.data[0].courseDetails.courseName,
          credits: courses.data[0].courseDetails.credits,
          type: courses.data[0].courseDetails.courseType,
          faculty: courses.data[0].facultyInfo.name
        });
      }
    } else {
      console.log('❌ Course details failed:', courses.error);
    }
    console.log('');
    
    // Test Statistics
    console.log('📊 Fetching Statistics...');
    const attendanceStats = await api.getAttendanceStatistics();
    const marksStats = await api.getMarksStatistics();
    const courseStats = await api.getCourseStatistics();
    const userStats = await api.getUserStatistics();
    
    console.log('✅ Attendance Stats:', attendanceStats);
    console.log('✅ Marks Stats:', marksStats);
    console.log('✅ Course Stats:', courseStats);
    console.log('✅ User Stats:', userStats);
    console.log('');
    
    // Test Session Validation
    console.log('🔍 Testing Session Validation...');
    const sessionCheck = await api.validateSession();
    console.log('✅ Session valid:', sessionCheck.isValid);
    console.log('   User ID:', sessionCheck.userId);
    console.log('');
    
    // Test Logout
    console.log('🚪 Testing Logout...');
    const logoutResult = await api.logout();
    console.log('✅ Logout:', logoutResult.success ? 'Success' : 'Failed');
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Run the test
testSRMScraper().catch(console.error);
