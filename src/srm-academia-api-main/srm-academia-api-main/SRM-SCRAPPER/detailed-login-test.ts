import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function testDetailedLogin() {
  console.log('🔐 Testing Detailed Login Process...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // Step 1: Get the login form page
    console.log('1️⃣ Getting login form page...');
    const loginPageResponse = await got.get('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
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

    console.log('✅ Login form page loaded - Status:', loginPageResponse.statusCode);
    
    // Parse the HTML to extract form data
    const html = parse(loginPageResponse.body);
    
    // Extract CSRF token
    const csrfToken = html.querySelector('input[name="iamcsrcoo"]')?.getAttribute('value') || 
                     html.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                     '3dea6395-0540-44ea-8de7-544256dd7549';
    
    console.log('✅ CSRF token extracted:', csrfToken.substring(0, 20) + '...');
    
    // Extract all form fields
    const allInputs = html.querySelectorAll('input');
    console.log('\n📋 All form fields:');
    allInputs.forEach((input, index) => {
      const name = input.getAttribute('name');
      const type = input.getAttribute('type');
      const value = input.getAttribute('value');
      const id = input.getAttribute('id');
      const placeholder = input.getAttribute('placeholder');
      console.log(`   ${index + 1}. ${name || 'no-name'} (${type || 'text'}) = ${value || 'no-value'} [id: ${id || 'no-id'}] [placeholder: ${placeholder || 'no-placeholder'}]`);
    });
    
    // Extract all hidden fields
    const hiddenFields: any = {};
    const hiddenInputs = html.querySelectorAll('input[type="hidden"]');
    hiddenInputs.forEach(input => {
      const name = input.getAttribute('name');
      const value = input.getAttribute('value');
      if (name && value) {
        hiddenFields[name] = value;
      }
    });
    
    console.log('\n✅ Hidden fields extracted:', Object.keys(hiddenFields).length, 'fields');
    console.log('   Hidden fields:', hiddenFields);
    
    // Step 2: Submit the login form
    console.log('\n2️⃣ Submitting login form...');
    const loginResponse = await got.post('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
      cookieJar,
      form: {
        LOGIN_ID: 'jm7531',
        PASSWORD: 'Dharun-07',
        iamcsrcoo: csrfToken,
        ...hiddenFields
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://academia.srmist.edu.in',
        'Referer': 'https://academia.srmist.edu.in/accounts/p/40-10002227248/signin',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: { request: 10000 }
    });

    console.log('✅ Login form submitted - Status:', loginResponse.statusCode);
    console.log('   Response URL:', loginResponse.url);
    console.log('   Response length:', loginResponse.body.length, 'chars');
    
    // Analyze the response
    const finalHtml = parse(loginResponse.body);
    
    // Check for login form fields
    const loginIdField = finalHtml.querySelector('input[name="LOGIN_ID"]');
    const passwordField = finalHtml.querySelector('input[name="PASSWORD"]');
    
    console.log('\n🔍 Post-submission analysis:');
    console.log('   LOGIN_ID field present:', loginIdField ? 'Yes' : 'No');
    console.log('   PASSWORD field present:', passwordField ? 'Yes' : 'No');
    
    // Check for error messages
    const errorElements = finalHtml.querySelectorAll('.error, .alert, .warning, .danger');
    console.log('   Error elements found:', errorElements.length);
    
    if (errorElements.length > 0) {
      console.log('   Error messages:');
      errorElements.forEach((error, index) => {
        console.log(`     ${index + 1}. ${error.textContent?.trim()}`);
      });
    }
    
    // Check for success indicators
    const successIndicators = ['dashboard', 'portal', 'academic-services', 'welcome', 'logout'];
    const hasSuccessIndicator = successIndicators.some(indicator => 
      loginResponse.body.toLowerCase().includes(indicator)
    );
    
    console.log('   Success indicators found:', hasSuccessIndicator ? 'Yes' : 'No');
    
    // Check if we're still on the login page
    const isStillOnLoginPage = loginIdField && passwordField;
    console.log('   Still on login page:', isStillOnLoginPage ? 'Yes' : 'No');
    
    // Check cookies
    const cookieString = await cookieJar.getCookieString('https://academia.srmist.edu.in');
    console.log('   Session cookies:', cookieString ? 'Present' : 'None');
    if (cookieString) {
      console.log('   Cookie preview:', cookieString.substring(0, 100) + '...');
    }
    
    // Try to access a protected page to test if login worked
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
        console.log('⚠️  Page still shows login - authentication failed');
      } else {
        console.log('🎉 Successfully accessed protected content!');
      }
      
    } catch (protectedError: any) {
      console.log('❌ Protected page access failed:', protectedError.message);
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
testDetailedLogin().catch(console.error);

