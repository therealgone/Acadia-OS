import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function testExactCredentials() {
  console.log('🔐 Testing Exact Credentials: jm7531 / Dharun-07\n');
  
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
    console.log('\n2️⃣ Submitting username: jm7531');
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
    
    // Check for specific messages
    const responseText = usernameResponse.body;
    const hasPasswordNotSetMessage = responseText.includes('You have not set a password for this account');
    const hasPasswordExpiredMessage = responseText.includes('Password expired');
    const hasAccessDeniedMessage = responseText.includes('Access denied');
    
    console.log('\n🔍 System messages:');
    console.log('   Password not set:', hasPasswordNotSetMessage ? 'Yes' : 'No');
    console.log('   Password expired:', hasPasswordExpiredMessage ? 'Yes' : 'No');
    console.log('   Access denied:', hasAccessDeniedMessage ? 'Yes' : 'No');
    
    if (hasPasswordNotSetMessage) {
      console.log('\n💡 DIAGNOSIS: Account jm7531 exists but has no password set.');
      console.log('   The account is valid but needs a password to be set up first.');
      console.log('   SOLUTION: Go to https://academia.srmist.edu.in/ and click "Forgot Password?" to set up a password.');
      return;
    }
    
    if (hasPasswordExpiredMessage) {
      console.log('\n💡 DIAGNOSIS: Account jm7531 exists but password has expired.');
      console.log('   SOLUTION: Go to https://academia.srmist.edu.in/ and click "Forgot Password?" to reset the password.');
      return;
    }
    
    if (hasAccessDeniedMessage) {
      console.log('\n💡 DIAGNOSIS: Account jm7531 is locked or restricted.');
      console.log('   SOLUTION: Contact SRM support to unlock the account.');
      return;
    }
    
    // If password field exists, try to submit password
    if (passwordField) {
      console.log('\n3️⃣ Submitting password: Dharun-07');
      
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
        
        // Test accessing a protected page
        console.log('\n4️⃣ Testing access to protected page...');
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
            console.log('   The scraper is ready to use!');
          }
          
        } catch (protectedError: any) {
          console.log('❌ Protected page access failed:', protectedError.message);
        }
        
      } else {
        console.log('❌ Login failed - check credentials');
        
        // Check for specific error messages
        const finalResponseText = passwordResponse.body;
        if (finalResponseText.includes('incorrect') || finalResponseText.includes('invalid')) {
          console.log('💡 The password appears to be incorrect.');
        }
      }
    }
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
testExactCredentials().catch(console.error);

