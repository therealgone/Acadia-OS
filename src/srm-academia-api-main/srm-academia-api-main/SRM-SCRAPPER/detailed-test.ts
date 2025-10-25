import SRMAcademiaAPI from './src/index';

async function detailedTest() {
  console.log('🔍 Detailed SRM Academia Scraper Test...\n');
  
  const api = new SRMAcademiaAPI();
  
  try {
    // Test Login with detailed error reporting
    console.log('📝 Testing Login with credentials: jm7531 / Dharun-07');
    const loginResult = await api.login('jm7531', 'Dharun-07');
    
    console.log('Login Result:', JSON.stringify(loginResult, null, 2));
    
    if (!loginResult.success) {
      console.log('❌ Login failed:', loginResult.error);
      console.log('💡 This could be due to:');
      console.log('   - Invalid credentials');
      console.log('   - Website structure changes');
      console.log('   - CSRF token issues');
      console.log('   - Network connectivity');
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🍪 Session cookies:', loginResult.cookies?.substring(0, 100) + '...\n');
    
    // Test User Profile
    console.log('👤 Fetching User Profile...');
    const profile = await api.getUserProfile();
    console.log('Profile Result:', JSON.stringify(profile, null, 2));
    
    if (profile.success && profile.data) {
      console.log('✅ User Profile Data:');
      console.log('   Name:', profile.data.personalInfo.fullName);
      console.log('   Student ID:', profile.data.academicInfo.studentId);
      console.log('   Course:', profile.data.academicInfo.course);
      console.log('   Email:', profile.data.contactInfo.email);
    } else {
      console.log('❌ User Profile failed:', profile.error);
    }
    console.log('');
    
    // Test Timetable
    console.log('📅 Fetching Timetable...');
    const timetable = await api.getTimetable({
      semester: '6',
      section: 'A',
      academicYear: '2023-24'
    });
    console.log('Timetable Result:', JSON.stringify(timetable, null, 2));
    
    if (timetable.success) {
      console.log('✅ Timetable Data:');
      console.log('   Total entries:', timetable.data.length);
      if (timetable.data.length > 0) {
        console.log('   Sample entry:', {
          day: timetable.data[0].dayOfWeek,
          time: timetable.data[0].timeSlot.startTime + '-' + timetable.data[0].timeSlot.endTime,
          subject: timetable.data[0].subject.subjectCode,
          faculty: timetable.data[0].subject.facultyName
        });
      }
    } else {
      console.log('❌ Timetable failed:', timetable.error);
    }
    console.log('');
    
    // Test Attendance
    console.log('📊 Fetching Attendance...');
    const attendance = await api.getAttendance();
    console.log('Attendance Result:', JSON.stringify(attendance, null, 2));
    
    if (attendance.success) {
      console.log('✅ Attendance Data:');
      console.log('   Total subjects:', attendance.data.length);
      console.log('   Overall attendance:', attendance.summary.overallAttendance + '%');
      console.log('   Warning subjects:', attendance.summary.warningSubjects.length);
    } else {
      console.log('❌ Attendance failed:', attendance.error);
    }
    console.log('');
    
    // Test Marks
    console.log('📈 Fetching Marks...');
    const marks = await api.getMarks();
    console.log('Marks Result:', JSON.stringify(marks, null, 2));
    
    if (marks.success) {
      console.log('✅ Marks Data:');
      console.log('   Total subjects:', marks.data.length);
      console.log('   Overall CGPA:', marks.summary.overallCGPA);
      console.log('   Passed subjects:', marks.summary.passedSubjects);
    } else {
      console.log('❌ Marks failed:', marks.error);
    }
    console.log('');
    
    // Test Calendar Events
    console.log('📆 Fetching Calendar Events...');
    const events = await api.getUpcomingEvents(30);
    console.log('Events Result:', JSON.stringify(events, null, 2));
    
    if (events.length > 0) {
      console.log('✅ Calendar Events Data:');
      console.log('   Total events:', events.length);
      console.log('   Sample event:', {
        title: events[0].title,
        type: events[0].eventType,
        date: events[0].startDate
      });
    } else {
      console.log('❌ Calendar events failed or no events found');
    }
    console.log('');
    
    // Test Course Details
    console.log('📚 Fetching Course Details...');
    const courses = await api.getCourseDetails();
    console.log('Courses Result:', JSON.stringify(courses, null, 2));
    
    if (courses.success) {
      console.log('✅ Course Details Data:');
      console.log('   Total courses:', courses.data.length);
      if (courses.data.length > 0) {
        console.log('   Sample course:', {
          code: courses.data[0].courseDetails.courseCode,
          name: courses.data[0].courseDetails.courseName,
          credits: courses.data[0].courseDetails.credits
        });
      }
    } else {
      console.log('❌ Course details failed:', courses.error);
    }
    console.log('');
    
    console.log('🎉 Detailed test completed!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Run the detailed test
detailedTest().catch(console.error);

