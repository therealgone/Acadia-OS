import got from 'got';
import { CookieJar } from 'tough-cookie';

async function testSRMConnectivity() {
  console.log('🌐 Testing SRM Academia Website Connectivity...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // Test 1: Basic connectivity to main site
    console.log('1️⃣ Testing main site connectivity...');
    const mainSiteResponse = await got.get('https://academia.srmist.edu.in', {
      cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: { request: 10000 }
    });
    
    console.log('✅ Main site accessible - Status:', mainSiteResponse.statusCode);
    console.log('   Response length:', mainSiteResponse.body.length, 'characters');
    
    // Test 2: Login page accessibility
    console.log('\n2️⃣ Testing login page accessibility...');
    const loginPageResponse = await got.get('https://academia.srmist.edu.in/accounts/signin', {
      cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: { request: 10000 }
    });
    
    console.log('✅ Login page accessible - Status:', loginPageResponse.statusCode);
    console.log('   Response length:', loginPageResponse.body.length, 'characters');
    
    // Extract CSRF token
    const csrfMatch = loginPageResponse.body.match(/iamcsrcoo=([a-f0-9-]+)/);
    if (csrfMatch) {
      console.log('✅ CSRF token found:', csrfMatch[1]);
    } else {
      console.log('❌ CSRF token not found in login page');
    }
    
    // Test 3: Academic services portal
    console.log('\n3️⃣ Testing academic services portal...');
    const portalResponse = await got.get('https://academia.srmist.edu.in/portal/academia-academic-services', {
      cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: { request: 10000 }
    });
    
    console.log('✅ Portal accessible - Status:', portalResponse.statusCode);
    console.log('   Response length:', portalResponse.body.length, 'characters');
    
    // Test 4: Try username lookup endpoint
    console.log('\n4️⃣ Testing username lookup endpoint...');
    try {
      const lookupResponse = await got.post(
        `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/lookup/jm7531`,
        {
          form: {
            mode: "primary",
            cli_time: Date.now(),
            servicename: "ZohoCreator",
            service_language: "en",
            serviceurl: "https://academia.srmist.edu.in/portal/academia-academic-services/redirectFromLogin",
          },
          headers: {
            "x-zcsrf-token": csrfMatch ? `iamcsrcoo=${csrfMatch[1]}` : 'iamcsrcoo=test',
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          cookieJar,
          responseType: "json",
          timeout: { request: 10000 }
        }
      );
      
      console.log('✅ Username lookup successful - Status:', lookupResponse.statusCode);
      console.log('   Response:', JSON.stringify(lookupResponse.body, null, 2));
      
    } catch (lookupError: any) {
      console.log('❌ Username lookup failed:', lookupError.response?.statusCode || lookupError.message);
      if (lookupError.response?.body) {
        console.log('   Error response:', lookupError.response.body);
      }
    }
    
    console.log('\n🎯 Connectivity test completed!');
    
  } catch (error: any) {
    console.error('💥 Connectivity test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.statusCode);
      console.error('   Response:', error.response.body?.substring(0, 500) + '...');
    }
  }
}

// Run the connectivity test
testSRMConnectivity().catch(console.error);

