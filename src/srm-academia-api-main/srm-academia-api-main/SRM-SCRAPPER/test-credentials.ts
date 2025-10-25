import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function testDifferentCredentials() {
  console.log('🔐 Testing Different Credentials...\n');
  
  const testCredentials = [
    { username: 'jm7531', password: 'Dharun-07' },
    { username: 'jm7531', password: 'dharun-07' },
    { username: 'jm7531', password: 'Dharun07' },
    { username: 'jm7531', password: 'dharun07' },
    { username: 'testuser', password: 'testpass' }
  ];
  
  for (const creds of testCredentials) {
    console.log(`\n🧪 Testing: ${creds.username} / ${creds.password}`);
    
    const cookieJar = new CookieJar();
    
    try {
      // Get login form page
      const loginPageResponse = await got.get('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
        cookieJar,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        },
        timeout: { request: 10000 }
      });

      const html = parse(loginPageResponse.body);
      const csrfToken = html.querySelector('input[name="iamcsrcoo"]')?.getAttribute('value') || '3dea6395-0540-44ea-8de7-544256dd7549';
      
      // Submit login form
      const loginResponse = await got.post('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
        cookieJar,
        form: {
          LOGIN_ID: creds.username,
          PASSWORD: creds.password,
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

      console.log(`   Status: ${loginResponse.statusCode}`);
      
      // Parse response
      const responseHtml = parse(loginResponse.body);
      
      // Check form state
      const loginIdField = responseHtml.querySelector('input[name="LOGIN_ID"]');
      const passwordField = responseHtml.querySelector('input[name="PASSWORD"]');
      
      const loginIdValue = loginIdField?.getAttribute('value') || '';
      const passwordValue = passwordField?.getAttribute('value') || '';
      
      console.log(`   LOGIN_ID value: ${loginIdValue}`);
      console.log(`   PASSWORD value: ${passwordValue ? '[filled]' : '[empty]'}`);
      
      // Check if we're still on login page
      const isStillOnLoginPage = loginIdField && passwordField;
      console.log(`   Still on login page: ${isStillOnLoginPage ? 'Yes' : 'No'}`);
      
      // Check for any error indicators
      const hasErrorText = loginResponse.body.toLowerCase().includes('invalid') || 
                          loginResponse.body.toLowerCase().includes('incorrect') ||
                          loginResponse.body.toLowerCase().includes('failed');
      
      console.log(`   Has error indicators: ${hasErrorText ? 'Yes' : 'No'}`);
      
      // Check if we got redirected
      const wasRedirected = !loginResponse.url.includes('signin');
      console.log(`   Was redirected: ${wasRedirected ? 'Yes' : 'No'}`);
      
      if (wasRedirected) {
        console.log(`   Redirected to: ${loginResponse.url}`);
      }
      
      // Check cookies
      const cookieString = await cookieJar.getCookieString('https://academia.srmist.edu.in');
      console.log(`   Session cookies: ${cookieString ? 'Present' : 'None'}`);
      
    } catch (error: any) {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n💡 Summary:');
  console.log('   - If LOGIN_ID is filled but PASSWORD is empty, username is valid');
  console.log('   - If both fields are empty, credentials are invalid');
  console.log('   - If redirected, login was successful');
  console.log('   - If still on login page, need additional steps (MFA, OTP, etc.)');
}

// Run the test
testDifferentCredentials().catch(console.error);

