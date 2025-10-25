import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function analyzeLoginResponse() {
  console.log('🔍 Analyzing Login Response...\n');
  
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
        LOGIN_ID: 'jm7531',
        PASSWORD: 'Dharun-07',
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

    console.log('✅ Login response - Status:', loginResponse.statusCode);
    console.log('   Response URL:', loginResponse.url);
    
    // Parse the response
    const responseHtml = parse(loginResponse.body);
    
    // Look for any error messages or alerts
    console.log('\n🔍 Looking for error messages...');
    
    // Check for various error selectors
    const errorSelectors = [
      '.error', '.alert', '.warning', '.danger', '.message',
      '[class*="error"]', '[class*="alert"]', '[class*="warning"]',
      '.form-error', '.login-error', '.validation-error',
      '#error', '#alert', '#message'
    ];
    
    let errorFound = false;
    errorSelectors.forEach(selector => {
      const elements = responseHtml.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} elements with selector: ${selector}`);
        elements.forEach((element, index) => {
          const text = element.textContent?.trim();
          if (text && text.length > 0) {
            console.log(`   ${index + 1}. ${text}`);
            errorFound = true;
          }
        });
      }
    });
    
    if (!errorFound) {
      console.log('❌ No error messages found with standard selectors');
    }
    
    // Look for any text that might indicate an error
    console.log('\n🔍 Looking for error-related text...');
    const errorKeywords = ['error', 'invalid', 'incorrect', 'failed', 'wrong', 'denied', 'unauthorized'];
    
    errorKeywords.forEach(keyword => {
      if (loginResponse.body.toLowerCase().includes(keyword)) {
        console.log(`✅ Found "${keyword}" in response`);
        
        // Try to extract the context around the keyword
        const bodyLower = loginResponse.body.toLowerCase();
        const keywordIndex = bodyLower.indexOf(keyword);
        const start = Math.max(0, keywordIndex - 100);
        const end = Math.min(loginResponse.body.length, keywordIndex + 100);
        const context = loginResponse.body.substring(start, end);
        
        console.log(`   Context: ...${context}...`);
      }
    });
    
    // Check if there are any JavaScript alerts or messages
    console.log('\n🔍 Looking for JavaScript alerts...');
    const scriptTags = responseHtml.querySelectorAll('script');
    scriptTags.forEach((script, index) => {
      const content = script.textContent;
      if (content && (content.includes('alert') || content.includes('error') || content.includes('message'))) {
        console.log(`✅ Script ${index + 1} contains alert/error/message`);
        console.log(`   Content: ${content.substring(0, 200)}...`);
      }
    });
    
    // Check the form state
    console.log('\n🔍 Checking form state...');
    const loginIdField = responseHtml.querySelector('input[name="LOGIN_ID"]');
    const passwordField = responseHtml.querySelector('input[name="PASSWORD"]');
    
    if (loginIdField) {
      const value = loginIdField.getAttribute('value');
      console.log(`   LOGIN_ID field value: ${value || 'empty'}`);
    }
    
    if (passwordField) {
      const value = passwordField.getAttribute('value');
      console.log(`   PASSWORD field value: ${value || 'empty'}`);
    }
    
    // Check if there are any additional fields that appeared
    console.log('\n🔍 Checking for additional fields...');
    const allInputs = responseHtml.querySelectorAll('input');
    const newFields = allInputs.filter(input => {
      const name = input.getAttribute('name');
      return name && !['LOGIN_ID', 'PASSWORD', 'iamcsrcoo'].includes(name);
    });
    
    if (newFields.length > 0) {
      console.log(`✅ Found ${newFields.length} additional fields:`);
      newFields.forEach((field, index) => {
        const name = field.getAttribute('name');
        const type = field.getAttribute('type');
        const placeholder = field.getAttribute('placeholder');
        console.log(`   ${index + 1}. ${name} (${type}) - ${placeholder || 'no placeholder'}`);
      });
    } else {
      console.log('❌ No additional fields found');
    }
    
    // Show a sample of the response HTML
    console.log('\n📄 Response HTML sample (first 1000 chars):');
    console.log(loginResponse.body.substring(0, 1000));
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
analyzeLoginResponse().catch(console.error);

