import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function testFormLogin() {
  console.log('🔐 Testing Form-Based Login...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // Step 1: Get the login page and analyze the form
    console.log('1️⃣ Getting login page and analyzing form...');
    const loginPageResponse = await got.get('https://academia.srmist.edu.in/', {
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

    console.log('✅ Login page loaded - Status:', loginPageResponse.statusCode);
    
    // Parse the HTML to analyze the form
    const html = parse(loginPageResponse.body);
    
    // Find the login form
    const loginForm = html.querySelector('form');
    if (loginForm) {
      console.log('✅ Login form found');
      console.log('   Form action:', loginForm.getAttribute('action') || 'current page');
      console.log('   Form method:', loginForm.getAttribute('method') || 'GET');
    } else {
      console.log('❌ No login form found');
    }
    
    // Extract all form fields
    const formFields = html.querySelectorAll('input');
    console.log('\n📋 Form fields found:');
    formFields.forEach((field, index) => {
      const name = field.getAttribute('name');
      const type = field.getAttribute('type');
      const value = field.getAttribute('value');
      const id = field.getAttribute('id');
      console.log(`   ${index + 1}. ${name || 'no-name'} (${type || 'text'}) = ${value || 'no-value'} [id: ${id || 'no-id'}]`);
    });
    
    // Look for specific fields
    const loginIdField = html.querySelector('input[name="LOGIN_ID"]');
    const passwordField = html.querySelector('input[name="PASSWORD"]');
    const csrfField = html.querySelector('input[name="iamcsrcoo"]');
    
    console.log('\n🔍 Key fields:');
    console.log('   LOGIN_ID field:', loginIdField ? 'Found' : 'Not found');
    console.log('   PASSWORD field:', passwordField ? 'Found' : 'Not found');
    console.log('   CSRF field:', csrfField ? 'Found' : 'Not found');
    
    if (csrfField) {
      console.log('   CSRF value:', csrfField.getAttribute('value'));
    }
    
    // Try to submit just the username first
    console.log('\n2️⃣ Testing username submission...');
    
    const formData: any = {};
    
    // Add all hidden fields
    formFields.forEach(field => {
      const name = field.getAttribute('name');
      const value = field.getAttribute('value');
      const type = field.getAttribute('type');
      
      if (name && value && type === 'hidden') {
        formData[name] = value;
        console.log(`   Adding hidden field: ${name} = ${value}`);
      }
    });
    
    // Add the username
    formData.LOGIN_ID = 'jm7531';
    
    console.log('   Submitting form data:', formData);
    
    const usernameResponse = await got.post('https://academia.srmist.edu.in/', {
      cookieJar,
      form: formData,
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

    console.log('✅ Username submission - Status:', usernameResponse.statusCode);
    console.log('   Response URL:', usernameResponse.url);
    
    // Check if we got the password field
    const passwordPageHtml = parse(usernameResponse.body);
    const passwordFieldAfter = passwordPageHtml.querySelector('input[name="PASSWORD"]');
    
    if (passwordFieldAfter) {
      console.log('✅ Username accepted, password field found');
      
      // Try password submission
      console.log('\n3️⃣ Testing password submission...');
      
      const passwordFormData = { ...formData };
      passwordFormData.PASSWORD = 'Dharun-07';
      
      const passwordResponse = await got.post('https://academia.srmist.edu.in/', {
        cookieJar,
        form: passwordFormData,
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

      console.log('✅ Password submission - Status:', passwordResponse.statusCode);
      console.log('   Response URL:', passwordResponse.url);
      
      // Check if login was successful
      const finalHtml = parse(passwordResponse.body);
      const isLoggedIn = !finalHtml.querySelector('input[name="LOGIN_ID"]') && 
                        !finalHtml.querySelector('input[name="PASSWORD"]');
      
      if (isLoggedIn) {
        console.log('🎉 LOGIN SUCCESSFUL!');
        const cookieString = await cookieJar.getCookieString('https://academia.srmist.edu.in');
        console.log('🍪 Session cookies:', cookieString.substring(0, 100) + '...');
      } else {
        console.log('❌ Login failed - still showing login form');
      }
      
    } else {
      console.log('❌ Username not accepted - no password field found');
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
testFormLogin().catch(console.error);

