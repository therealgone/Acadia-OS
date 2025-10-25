import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function checkPasswordError() {
  console.log('🔍 Checking Password Error Message...\n');
  
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
    
    // Submit login form with the exact credentials
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
    
    // Look for specific error messages
    console.log('\n🔍 Looking for password-related error messages...');
    
    // Check for password error patterns
    const passwordErrorPatterns = [
      'password',
      'incorrect',
      'invalid',
      'wrong',
      'failed',
      'denied',
      'error'
    ];
    
    passwordErrorPatterns.forEach(pattern => {
      if (loginResponse.body.toLowerCase().includes(pattern)) {
        console.log(`✅ Found "${pattern}" in response`);
        
        // Extract context around the pattern
        const bodyLower = loginResponse.body.toLowerCase();
        const patternIndex = bodyLower.indexOf(pattern);
        const start = Math.max(0, patternIndex - 200);
        const end = Math.min(loginResponse.body.length, patternIndex + 200);
        const context = loginResponse.body.substring(start, end);
        
        console.log(`   Context: ...${context}...`);
        console.log('');
      }
    });
    
    // Look for any visible error messages in the HTML
    console.log('\n🔍 Looking for visible error messages...');
    const responseHtml = parse(loginResponse.body);
    
    // Check for error divs, spans, or other elements
    const errorElements = responseHtml.querySelectorAll('div, span, p, label');
    errorElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 200) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('password') || lowerText.includes('incorrect') || 
            lowerText.includes('invalid') || lowerText.includes('error')) {
          console.log(`✅ Found error text: "${text}"`);
        }
      }
    });
    
    // Check if there are any JavaScript error messages
    console.log('\n🔍 Looking for JavaScript error messages...');
    const scripts = responseHtml.querySelectorAll('script');
    scripts.forEach((script, index) => {
      const content = script.textContent;
      if (content && content.includes('password')) {
        console.log(`✅ Script ${index + 1} contains password-related code`);
        console.log(`   Content: ${content.substring(0, 300)}...`);
      }
    });
    
    // Check the form state again
    console.log('\n🔍 Final form state:');
    const loginIdField = responseHtml.querySelector('input[name="LOGIN_ID"]');
    const passwordField = responseHtml.querySelector('input[name="PASSWORD"]');
    
    console.log(`   LOGIN_ID value: ${loginIdField?.getAttribute('value') || 'empty'}`);
    console.log(`   PASSWORD value: ${passwordField?.getAttribute('value') || 'empty'}`);
    
    // Check if password field has any special attributes
    if (passwordField) {
      const attributes = passwordField.attributes;
      console.log('   Password field attributes:');
      Object.keys(attributes).forEach(key => {
        console.log(`     ${key}: ${attributes[key]}`);
      });
    }
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
checkPasswordError().catch(console.error);

