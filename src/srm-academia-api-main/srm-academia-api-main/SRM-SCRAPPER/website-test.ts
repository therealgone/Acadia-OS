import got from 'got';

async function testSRMAcademiaAccess() {
  console.log('🌐 Testing SRM Academia Website Access...\n');
  
  const testUrls = [
    'https://academia.srmist.edu.in/',
    'https://academia.srmist.edu.in/accounts/signin',
    'https://academia.srmist.edu.in/portal/academia-academic-services',
    'https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Attendance'
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`🔍 Testing: ${url}`);
      const response = await got.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        },
        timeout: { request: 10000 }
      });
      
      console.log(`✅ Status: ${response.statusCode} - Length: ${response.body.length} chars`);
      
      // Check if it's a login page
      if (response.body.includes('login') || response.body.includes('signin')) {
        console.log('   📝 This appears to be a login page');
      }
      
      // Check if it's the main portal
      if (response.body.includes('academic-services') || response.body.includes('dashboard')) {
        console.log('   🏠 This appears to be the main portal');
      }
      
      console.log('');
      
    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.statusCode}`);
      }
      console.log('');
    }
  }
  
  // Test the specific login endpoint
  console.log('🔐 Testing specific login endpoint...');
  try {
    const loginResponse = await got.post(
      'https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/lookup/testuser',
      {
        form: {
          mode: "primary",
          cli_time: Date.now(),
          servicename: "ZohoCreator",
          service_language: "en",
          serviceurl: "https://academia.srmist.edu.in/portal/academia-academic-services/redirectFromLogin",
        },
        headers: {
          "x-zcsrf-token": "iamcsrcoo=test-token",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        },
        timeout: { request: 10000 }
      }
    );
    
    console.log(`✅ Login endpoint accessible - Status: ${loginResponse.statusCode}`);
    console.log('   Response:', JSON.stringify(loginResponse.body, null, 2));
    
  } catch (error: any) {
    console.log(`❌ Login endpoint failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.statusCode}`);
      console.log(`   Response: ${error.response.body?.substring(0, 200)}...`);
    }
  }
}

// Run the test
testSRMAcademiaAccess().catch(console.error);

