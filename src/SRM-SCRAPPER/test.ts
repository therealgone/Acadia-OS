import { loginUser, getTimetable, getAttendance, getMarks, getUserInfo, getCourseDetails, getCalendar, logoutUser } from './index';

// Test configuration
const TEST_USERNAME = 'jm7531';
const TEST_PASSWORD = 'Dharun-07';

// Helper function to format output
function formatOutput(title: string, data: unknown, error?: string) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📋 ${title}`);
  console.log(`${'='.repeat(50)}`);
  
  if (error) {
    console.log(`❌ Error: ${error}`);
    return;
  }
  
  if (!data) {
    console.log('❌ No data received');
    return;
  }
  
  console.log('✅ Data received successfully');
  console.log(JSON.stringify(data, null, 2));
}

// Test function
async function runTests() {
  console.log('🚀 Starting SRM Academia Scrapper Tests');
  console.log(`👤 Testing with username: ${TEST_USERNAME}`);
  
  let cookies: string | undefined;
  
  try {
    // Test 1: Login
    console.log('\n🔐 Testing Login...');
    const loginResult = await loginUser(TEST_USERNAME, TEST_PASSWORD);
    
    if (loginResult.error) {
      console.log(`❌ Login failed: ${loginResult.error}`);
      if (loginResult.errorReason) {
        console.log('Error details:', loginResult.errorReason);
      }
      return;
    }
    
    if (!loginResult.isAuthenticated || !loginResult.data?.cookies) {
      console.log('❌ Login failed: Authentication unsuccessful');
      console.log('Response:', loginResult);
      return;
    }
    
    cookies = loginResult.data.cookies;
    console.log('✅ Login successful!');
    console.log(`🍪 Cookies received: ${cookies.substring(0, 50)}...`);
    
    // Test 2: User Info
    console.log('\n👤 Testing User Info...');
    const userInfoResult = await getUserInfo(cookies);
    formatOutput('USER INFO', userInfoResult.userInfo, userInfoResult.error);
    
    // Test 3: Timetable
    console.log('\n📅 Testing Timetable...');
    const timetableResult = await getTimetable(cookies);
    formatOutput('TIMETABLE', timetableResult.timetable, timetableResult.error);
    
    // Test 4: Attendance
    console.log('\n📊 Testing Attendance...');
    const attendanceResult = await getAttendance(cookies);
    formatOutput('ATTENDANCE', attendanceResult.attendance, attendanceResult.error);
    
    // Test 5: Marks
    console.log('\n📈 Testing Marks...');
    const marksResult = await getMarks(cookies);
    formatOutput('MARKS', marksResult.markList, marksResult.error);
    
    // Test 6: Course Details
    console.log('\n📚 Testing Course Details...');
    const courseResult = await getCourseDetails(cookies);
    formatOutput('COURSE DETAILS', courseResult.courseList, courseResult.error);
    
    // Test 7: Calendar
    console.log('\n🗓️ Testing Calendar...');
    const calendarResult = await getCalendar(cookies);
    formatOutput('CALENDAR', calendarResult.calendar, calendarResult.error);
    
    // Test 8: Logout
    console.log('\n🚪 Testing Logout...');
    const logoutResult = await logoutUser(cookies);
    console.log(`✅ Logout: ${logoutResult.message} (Status: ${logoutResult.status})`);
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Run the tests
runTests().catch(console.error);
