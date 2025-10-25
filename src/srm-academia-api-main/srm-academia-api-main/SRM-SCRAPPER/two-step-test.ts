import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function testTwoStepLogin() {
  console.log('🔐 Testing Two-Step Login Process...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // Step 1: Get login form page
    console.log('1️⃣ Getting login form page...');
    const loginPageResponse = await got.get('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
      cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
      },
      timeout: { request: 10000 }
    });

    console.log('✅ Login form page loaded - Status:', loginPageResponse.statusCode);
    
    const html = parse(loginPageResponse.body);
    const csrfToken = html.querySelector('input[name="iamcsrcoo"]')?.getAttribute('value') || '3dea6395-0540-44ea-8de7-544256dd7549';
    
    // Step 2: Submit username (Step 1)
    console.log('\n2️⃣ Submitting username (Step 1)...');
    const usernameResponse = await got.post('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
      cookieJar,
      form: {
        LOGIN_ID: 'jm7531',
        iamcsrcoo: csrfToken
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://academia.srmist.edu.in',
        'Referer': 'https://academia.srmist.edu.in/accounts/p/40-10002227248/signin',
      },
      timeout: { request: 10000 }
    });

    console.log('✅ Username submitted - Status:', usernameResponse.statusCode);
    
    // Analyze the response after username submission
    const passwordPageHtml = parse(usernameResponse.body);
    const passwordField = passwordPageHtml.querySelector('input[name="PASSWORD"]');
    const loginIdField = passwordPageHtml.querySelector('input[name="LOGIN_ID"]');
    
    console.log('\n🔍 After username submission:');
    console.log('   LOGIN_ID field present:', loginIdField ? 'Yes' : 'No');
    console.log('   PASSWORD field present:', passwordField ? 'Yes' : 'No');
    
    if (loginIdField) {
      console.log('   LOGIN_ID value:', loginIdField.getAttribute('value') || 'empty');
    }
    
    if (passwordField) {
      console.log('   PASSWORD field placeholder:', passwordField.getAttribute('placeholder') || 'no placeholder');
    }
    
    // Check for any error messages
    const hasPasswordNotSetMessage = usernameResponse.body.includes('You have not set a password for this account');
    console.log('   Password not set message:', hasPasswordNotSetMessage ? 'Yes' : 'No');
    
    if (hasPasswordNotSetMessage) {
      console.log('\n💡 DIAGNOSIS: The account jm7531 is valid but has no password set.');
      console.log('   SOLUTION: Go to https://academia.srmist.edu.in/ and click "Forgot Password?" to set up a password.');
      return;
    }
    
    // Step 3: Submit password (Step 2) - only if password field exists
    if (passwordField) {
      console.log('\n3️⃣ Submitting password (Step 2)...');
      
      const updatedCsrfToken = passwordPageHtml.querySelector('input[name="iamcsrcoo"]')?.getAttribute('value') || csrfToken;
      
      const passwordResponse = await got.post('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
        cookieJar,
        form: {
          LOGIN_ID: 'jm7531',
          PASSWORD: 'Dharun-07',
          iamcsrcoo: updatedCsrfToken
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://academia.srmist.edu.in',
          'Referer': 'https://academia.srmist.edu.in/accounts/p/40-10002227248/signin',
        },
        timeout: { request: 10000 }
      });

      console.log('✅ Password submitted - Status:', passwordResponse.statusCode);
      console.log('   Response URL:', passwordResponse.url);
      
      // Check if login was successful
      const finalHtml = parse(passwordResponse.body);
      const isLoggedIn = !finalHtml.querySelector('input[name="LOGIN_ID"]') && 
                        !finalHtml.querySelector('input[name="PASSWORD"]') &&
                        (passwordResponse.url.includes('portal') ||
                         passwordResponse.url.includes('dashboard'));
      
      console.log('\n🔍 After password submission:');
      console.log('   Still on login page:', finalHtml.querySelector('input[name="LOGIN_ID"]') ? 'Yes' : 'No');
      console.log('   Was redirected:', passwordResponse.url.includes('portal') ? 'Yes' : 'No');
      console.log('   Login successful:', isLoggedIn ? 'Yes' : 'No');
      
      if (isLoggedIn) {
        console.log('🎉 LOGIN SUCCESSFUL!');
        const cookieString = await cookieJar.getCookieString('https://academia.srmist.edu.in');
        console.log('🍪 Session cookies:', cookieString.substring(0, 100) + '...');
      } else {
        console.log('❌ Login failed - check credentials');
      }
    }
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
testTwoStepLogin().catch(console.error);
