import got from 'got';
import { CookieJar } from 'tough-cookie';

async function findAJAXLogin() {
  console.log('🔍 Looking for AJAX Login Endpoints...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // First, get the main page to establish session
    console.log('1️⃣ Getting main page to establish session...');
    const mainPageResponse = await got.get('https://academia.srmist.edu.in/', {
      cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: { request: 10000 }
    });

    console.log('✅ Main page loaded - Status:', mainPageResponse.statusCode);
    
    // Try common AJAX endpoints that might load the login form
    const ajaxEndpoints = [
      'https://academia.srmist.edu.in/api/login',
      'https://academia.srmist.edu.in/ajax/login',
      'https://academia.srmist.edu.in/login/form',
      'https://academia.srmist.edu.in/accounts/signin/form',
      'https://academia.srmist.edu.in/portal/login',
      'https://academia.srmist.edu.in/srm_university/academia-academic-services/login',
      'https://academia.srmist.edu.in/accounts/p/40-10002227248/signin',
      'https://academia.srmist.edu.in/accounts/p/10002227248/signin'
    ];
    
    for (const endpoint of ajaxEndpoints) {
      console.log(`\n🔍 Trying AJAX endpoint: ${endpoint}`);
      
      try {
        const response = await got.get(endpoint, {
          cookieJar,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Referer': 'https://academia.srmist.edu.in/',
          },
          timeout: { request: 10000 }
        });

        console.log(`✅ Status: ${response.statusCode} - Length: ${response.body.length} chars`);
        
        // Check if this contains login form
        if (response.body.includes('LOGIN_ID') || response.body.includes('PASSWORD') || response.body.includes('login_id')) {
          console.log('🎉 Found login form!');
          console.log('   Response preview:', response.body.substring(0, 500) + '...');
          
          // Try to parse and extract form fields
          const { parse } = require('node-html-parser');
          const html = parse(response.body);
          
          const loginIdField = html.querySelector('input[name="LOGIN_ID"]') || html.querySelector('#login_id');
          const passwordField = html.querySelector('input[name="PASSWORD"]') || html.querySelector('#password');
          
          console.log('   LOGIN_ID field:', loginIdField ? 'Found' : 'Not found');
          console.log('   PASSWORD field:', passwordField ? 'Found' : 'Not found');
          
          if (loginIdField && passwordField) {
            console.log('✅ Complete login form found!');
            return endpoint;
          }
        }
        
      } catch (error: any) {
        console.log(`❌ Failed: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.statusCode}`);
        }
      }
    }
    
    // Try POST requests to see if there's a different login flow
    console.log('\n🔍 Trying POST requests to login endpoints...');
    
    const postEndpoints = [
      'https://academia.srmist.edu.in/accounts/signin',
      'https://academia.srmist.edu.in/login',
      'https://academia.srmist.edu.in/portal/login'
    ];
    
    for (const endpoint of postEndpoints) {
      console.log(`\n🔍 Trying POST to: ${endpoint}`);
      
      try {
        const response = await got.post(endpoint, {
          cookieJar,
          form: {
            LOGIN_ID: 'jm7531',
            PASSWORD: 'Dharun-07'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://academia.srmist.edu.in',
            'Referer': 'https://academia.srmist.edu.in/',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          timeout: { request: 10000 }
        });

        console.log(`✅ Status: ${response.statusCode} - Length: ${response.body.length} chars`);
        console.log('   Response URL:', response.url);
        
        // Check if we got redirected or if login was successful
        if (response.url.includes('portal') || response.url.includes('dashboard')) {
          console.log('🎉 Possible login success - redirected to portal!');
        }
        
      } catch (error: any) {
        console.log(`❌ Failed: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.statusCode}`);
        }
      }
    }
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
findAJAXLogin().catch(console.error);

