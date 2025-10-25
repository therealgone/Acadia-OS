import got from 'got';
import { CookieJar } from 'tough-cookie';

async function testLoginWithFreshTokens() {
  console.log('🔐 Testing Login with Fresh CSRF Tokens...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // Step 1: Get the login page to extract fresh CSRF tokens
    console.log('1️⃣ Getting login page for fresh CSRF tokens...');
    const loginPageResponse = await got.get('https://academia.srmist.edu.in/accounts/signin', {
      cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
      },
      timeout: { request: 10000 }
    });
    
    console.log('✅ Login page accessible - Status:', loginPageResponse.statusCode);
    
    // Extract CSRF token from the page
    const csrfMatch = loginPageResponse.body.match(/iamcsrcoo=([a-f0-9-]+)/);
    const csrfToken = csrfMatch ? `iamcsrcoo=${csrfMatch[1]}` : 'iamcsrcoo=3dea6395-0540-44ea-8de7-544256dd7549';
    
    console.log('✅ CSRF token found:', csrfMatch ? csrfMatch[1] : 'Using fallback token');
    
    // Step 2: Test username lookup with fresh token
    console.log('\n2️⃣ Testing username lookup with fresh token...');
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
          "x-zcsrf-token": csrfToken,
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
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
    
    // Step 3: Test password validation
    console.log('\n3️⃣ Testing password validation...');
    const passwordRes = await got.post(
      `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/primary/${lookup.identifier}/password?digest=${lookup.digest}&cli_time=${Date.now()}&servicename=ZohoCreator&service_language=en&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin`,
      {
        json: { passwordauth: { password: "Dharun-07" } },
        headers: {
          "content-type": "application/json",
          "x-zcsrf-token": csrfToken,
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
testLoginWithFreshTokens().catch(console.error);

