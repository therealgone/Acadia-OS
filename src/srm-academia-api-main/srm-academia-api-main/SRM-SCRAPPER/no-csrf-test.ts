import got from 'got';
import { CookieJar } from 'tough-cookie';

async function testLoginWithoutCSRF() {
  console.log('🔐 Testing Login Without CSRF Token...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // Step 1: Try username lookup without CSRF token
    console.log('1️⃣ Testing username lookup without CSRF token...');
    const userRes = await got.post(
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
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
          "referer": "https://academia.srmist.edu.in/",
          "origin": "https://academia.srmist.edu.in",
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        cookieJar,
        responseType: "json",
        timeout: { request: 10000 }
      }
    );
    
    console.log('✅ Username lookup successful - Status:', userRes.statusCode);
    console.log('   Response:', JSON.stringify(userRes.body, null, 2));
    
    const lookup = (userRes.body as any).lookup;
    if (!lookup?.identifier || !lookup?.digest) {
      console.log('❌ Username lookup failed - no identifier/digest found');
      return;
    }
    
    console.log('✅ Username validated - Identifier:', lookup.identifier);
    
    // Step 2: Try password validation without CSRF token
    console.log('\n2️⃣ Testing password validation without CSRF token...');
    const passwordRes = await got.post(
      `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/primary/${lookup.identifier}/password?digest=${lookup.digest}&cli_time=${Date.now()}&servicename=ZohoCreator&service_language=en&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin`,
      {
        json: { passwordauth: { password: "Dharun-07" } },
        headers: {
          "content-type": "application/json",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
          "referer": "https://academia.srmist.edu.in/",
          "origin": "https://academia.srmist.edu.in",
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        cookieJar,
        responseType: "json",
        timeout: { request: 10000 }
      }
    );
    
    console.log('✅ Password validation - Status:', passwordRes.statusCode);
    console.log('   Response:', JSON.stringify(passwordRes.body, null, 2));
    
    const passwordResponse = passwordRes.body as any;
    
    if (passwordResponse.status_code === 201) {
      console.log('🎉 LOGIN SUCCESSFUL!');
      const cookieString = await cookieJar.getCookieString(passwordRes.url);
      console.log('🍪 Session cookies:', cookieString.substring(0, 100) + '...');
      
      // Test accessing a protected page
      console.log('\n3️⃣ Testing access to protected page...');
      try {
        const protectedResponse = await got.get('https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Attendance', {
          cookieJar,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'Referer': 'https://academia.srmist.edu.in/',
            'x-requested-with': 'XMLHttpRequest',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin'
          },
          timeout: { request: 10000 }
        });
        
        console.log('✅ Protected page accessible - Status:', protectedResponse.statusCode);
        console.log('   Page length:', protectedResponse.body.length, 'chars');
        
        if (protectedResponse.body.includes('login') || protectedResponse.body.includes('signin')) {
          console.log('⚠️  Page still shows login - might need additional authentication');
        } else {
          console.log('🎉 Successfully accessed protected content!');
        }
        
      } catch (protectedError: any) {
        console.log('❌ Protected page access failed:', protectedError.message);
      }
      
    } else {
      console.log('❌ Login failed:', passwordResponse.localized_message || 'Unknown error');
    }
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.statusCode);
      console.error('   Response:', error.response.body?.substring(0, 500) + '...');
    }
  }
}

// Run the test
testLoginWithoutCSRF().catch(console.error);

