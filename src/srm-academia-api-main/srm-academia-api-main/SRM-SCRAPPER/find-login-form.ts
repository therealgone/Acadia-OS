import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

async function findLoginForm() {
  console.log('🔍 Finding Login Form...\n');
  
  const cookieJar = new CookieJar();
  
  try {
    // Check different possible login pages
    const loginPages = [
      'https://academia.srmist.edu.in/',
      'https://academia.srmist.edu.in/accounts/signin',
      'https://academia.srmist.edu.in/login',
      'https://academia.srmist.edu.in/portal/academia-academic-services'
    ];
    
    for (const url of loginPages) {
      console.log(`\n🔍 Checking: ${url}`);
      
      try {
        const response = await got.get(url, {
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

        console.log(`✅ Status: ${response.statusCode} - Length: ${response.body.length} chars`);
        
        const html = parse(response.body);
        
        // Look for login form
        const loginForm = html.querySelector('form');
        if (loginForm) {
          console.log('✅ Login form found!');
          console.log('   Form action:', loginForm.getAttribute('action') || 'current page');
          console.log('   Form method:', loginForm.getAttribute('method') || 'GET');
        }
        
        // Look for login fields
        const loginIdField = html.querySelector('input[name="LOGIN_ID"]');
        const passwordField = html.querySelector('input[name="PASSWORD"]');
        const loginIdById = html.querySelector('#login_id');
        const passwordById = html.querySelector('#password');
        
        console.log('   LOGIN_ID field (by name):', loginIdField ? 'Found' : 'Not found');
        console.log('   PASSWORD field (by name):', passwordField ? 'Found' : 'Not found');
        console.log('   LOGIN_ID field (by id):', loginIdById ? 'Found' : 'Not found');
        console.log('   PASSWORD field (by id):', passwordById ? 'Found' : 'Not found');
        
        // Look for any input fields
        const allInputs = html.querySelectorAll('input');
        console.log(`   Total input fields: ${allInputs.length}`);
        
        if (allInputs.length > 0) {
          console.log('   Input fields found:');
          allInputs.forEach((field, index) => {
            const name = field.getAttribute('name');
            const type = field.getAttribute('type');
            const value = field.getAttribute('value');
            const id = field.getAttribute('id');
            const placeholder = field.getAttribute('placeholder');
            console.log(`     ${index + 1}. ${name || 'no-name'} (${type || 'text'}) = ${value || 'no-value'} [id: ${id || 'no-id'}] [placeholder: ${placeholder || 'no-placeholder'}]`);
          });
        }
        
        // Look for buttons
        const buttons = html.querySelectorAll('button');
        console.log(`   Total buttons: ${buttons.length}`);
        
        if (buttons.length > 0) {
          console.log('   Buttons found:');
          buttons.forEach((button, index) => {
            const text = button.textContent?.trim();
            const id = button.getAttribute('id');
            const className = button.getAttribute('class');
            console.log(`     ${index + 1}. "${text}" [id: ${id || 'no-id'}] [class: ${className || 'no-class'}]`);
          });
        }
        
        // Check if this looks like a login page
        const hasLoginText = response.body.toLowerCase().includes('login') || 
                           response.body.toLowerCase().includes('signin') ||
                           response.body.toLowerCase().includes('password');
        
        if (hasLoginText) {
          console.log('✅ This appears to be a login page');
        } else {
          console.log('❌ This does not appear to be a login page');
        }
        
      } catch (error: any) {
        console.log(`❌ Failed: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.statusCode}`);
        }
      }
    }
    
    // Check if there are any JavaScript files that might load the login form
    console.log('\n🔍 Checking for JavaScript-loaded login forms...');
    
    try {
      const mainPageResponse = await got.get('https://academia.srmist.edu.in/', {
        cookieJar,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        },
        timeout: { request: 10000 }
      });

      const html = parse(mainPageResponse.body);
      
      // Look for script tags
      const scripts = html.querySelectorAll('script');
      console.log(`   Total script tags: ${scripts.length}`);
      
      // Look for any script that might contain login-related code
      scripts.forEach((script, index) => {
        const src = script.getAttribute('src');
        const content = script.textContent;
        
        if (src) {
          console.log(`   Script ${index + 1}: ${src}`);
        } else if (content && content.includes('login')) {
          console.log(`   Script ${index + 1}: Contains login-related code`);
        }
      });
      
    } catch (error: any) {
      console.log(`❌ Failed to analyze scripts: ${error.message}`);
    }
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
findLoginForm().catch(console.error);

