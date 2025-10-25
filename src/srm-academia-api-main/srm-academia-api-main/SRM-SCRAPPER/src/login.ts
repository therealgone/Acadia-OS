import got from "got";
import { CookieJar } from "tough-cookie";
import { parse } from "node-html-parser";

// Types
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  cookies?: string;
  error?: string;
}

interface AuthSession {
  isValid: boolean;
  cookies: string;
  userId?: string;
  sessionToken?: string;
}

// Global cookie jar for session management
const sessionJar = new CookieJar();

export async function authenticateUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    console.log('🔐 Starting SRM Academia login...');
    
    // Step 1: Get the actual login page with the form
    console.log('1️⃣ Getting login form page...');
    const loginPageResponse = await got.get('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
      cookieJar: sessionJar,
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
    
    // Extract CSRF token and other form data
    const csrfToken = html.querySelector('input[name="iamcsrcoo"]')?.getAttribute('value') || 
                     html.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                     '3dea6395-0540-44ea-8de7-544256dd7549'; // fallback
    
    console.log('✅ CSRF token extracted:', csrfToken.substring(0, 20) + '...');
    
    // Extract all hidden form fields
    const hiddenFields: any = {};
    const hiddenInputs = html.querySelectorAll('input[type="hidden"]');
    hiddenInputs.forEach(input => {
      const name = input.getAttribute('name');
      const value = input.getAttribute('value');
      if (name && value) {
        hiddenFields[name] = value;
      }
    });
    
    console.log('✅ Hidden fields extracted:', Object.keys(hiddenFields).length, 'fields');
    
    // Step 2: Submit username first (Step 1 of two-step login)
    console.log('2️⃣ Submitting username (Step 1)...');
    const usernameResponse = await got.post('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
      cookieJar: sessionJar,
      form: {
        LOGIN_ID: credentials.username,
        iamcsrcoo: csrfToken,
        ...hiddenFields // Include all hidden fields
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

    console.log('✅ Username submitted - Status:', usernameResponse.statusCode);
    
    // Check if password field appeared (indicating username was accepted)
    const passwordPageHtml = parse(usernameResponse.body);
    const passwordField = passwordPageHtml.querySelector('input[name="PASSWORD"]');
    
    if (!passwordField) {
      return {
        success: false,
        message: "Username not accepted",
        error: "The username was not recognized by the system"
      };
    }
    
    console.log('✅ Username accepted, password field appeared');
    
    // Extract updated CSRF token and hidden fields from the password page
    const updatedCsrfToken = passwordPageHtml.querySelector('input[name="iamcsrcoo"]')?.getAttribute('value') || csrfToken;
    const updatedHiddenFields: any = {};
    const updatedHiddenInputs = passwordPageHtml.querySelectorAll('input[type="hidden"]');
    updatedHiddenInputs.forEach(input => {
      const name = input.getAttribute('name');
      const value = input.getAttribute('value');
      if (name && value) {
        updatedHiddenFields[name] = value;
      }
    });
    
    console.log('✅ Updated CSRF token and hidden fields extracted');
    
    // Step 3: Submit password (Step 2 of two-step login)
    console.log('3️⃣ Submitting password (Step 2)...');
    const loginResponse = await got.post('https://academia.srmist.edu.in/accounts/p/40-10002227248/signin', {
      cookieJar: sessionJar,
      form: {
        LOGIN_ID: credentials.username,
        PASSWORD: credentials.password,
        iamcsrcoo: updatedCsrfToken,
        ...updatedHiddenFields // Include updated hidden fields
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
    
    // Check if login was successful by looking for redirect or success indicators
    const finalHtml = parse(loginResponse.body);
    const isLoggedIn = !finalHtml.querySelector('input[name="LOGIN_ID"]') && 
                      !finalHtml.querySelector('input[name="PASSWORD"]') &&
                      (loginResponse.url.includes('portal') ||
                       loginResponse.url.includes('dashboard') ||
                       finalHtml.textContent.includes('academic-services') ||
                       finalHtml.textContent.includes('dashboard'));
    
    if (isLoggedIn) {
      const cookieString = await sessionJar.getCookieString('https://academia.srmist.edu.in');
      console.log('🎉 Login successful!');
      console.log('   Redirected to:', loginResponse.url);
      return {
        success: true,
        message: "Authentication successful",
        cookies: cookieString
      };
    } else {
      // Check for specific error conditions
      const responseText = loginResponse.body;
      
      // Check if password is not set
      if (responseText.includes('You have not set a password for this account')) {
        return {
          success: false,
          message: "Password not set for this account",
          error: "Please go to https://academia.srmist.edu.in/ and click 'Forgot Password?' to set up a password first"
        };
      }
      
      // Check if password is expired
      if (responseText.includes('Password expired')) {
        return {
          success: false,
          message: "Password has expired",
          error: "Please go to https://academia.srmist.edu.in/ and click 'Forgot Password?' to reset your password"
        };
      }
      
      // Check if account is locked or restricted
      if (responseText.includes('Access denied') || responseText.includes('account is locked')) {
        return {
          success: false,
          message: "Account access denied",
          error: "Your account may be locked or restricted. Please contact SRM support"
        };
      }
      
      // Check for invalid credentials
      const loginIdField = finalHtml.querySelector('input[name="LOGIN_ID"]');
      const passwordField = finalHtml.querySelector('input[name="PASSWORD"]');
      
      if (loginIdField && !passwordField) {
        return {
          success: false,
          message: "Invalid username",
          error: "The username is not recognized by the system"
        };
      }
      
      if (loginIdField && passwordField) {
        return {
          success: false,
          message: "Invalid password",
          error: "The password is incorrect. Please check your credentials"
        };
      }
      
      // Generic error message
      const errorMessage = finalHtml.querySelector('.error')?.textContent || 
                          finalHtml.querySelector('.alert')?.textContent ||
                          'Login failed';
      
      return {
        success: false,
        message: "Login failed",
        error: errorMessage
      };
    }
    
  } catch (error: any) {
    console.error('💥 Login error:', error.message);
    return {
      success: false,
      message: "Network error",
      error: error.message
    };
  }
}

export async function validateSession(): Promise<AuthSession> {
  try {
    const dashboardUrl = 'https://academia.srmist.edu.in/portal/academia-academic-services';
    
    const response = await got.get(dashboardUrl, {
      cookieJar: sessionJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: {
        request: 5000
      }
    });

    const cookieString = await sessionJar.getCookieString('https://academia.srmist.edu.in');
    
    // Check if user is logged in by looking for dashboard elements
    const isLoggedIn = response.body.includes('dashboard') || 
                      response.body.includes('academic-services') ||
                      !response.body.includes('login');
    
    return {
      isValid: isLoggedIn,
      cookies: cookieString,
      userId: undefined,
      sessionToken: undefined
    };
  } catch (error: any) {
    return {
      isValid: false,
      cookies: '',
      userId: undefined,
      sessionToken: undefined
    };
  }
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    const logoutUrl = 'https://academia.srmist.edu.in/accounts/logout';
    
    await got.post(logoutUrl, {
      cookieJar: sessionJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://academia.srmist.edu.in/portal/academia-academic-services'
      },
      timeout: {
        request: 5000
      }
    });

    sessionJar.removeAllCookiesSync();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error: any) {
    sessionJar.removeAllCookiesSync();
    return {
      success: false,
      message: 'Logout failed: ' + error.message
    };
  }
}

export function getSessionCookies(): string {
  return sessionJar.getCookieStringSync('https://academia.srmist.edu.in');
}

export function clearSession(): void {
  sessionJar.removeAllCookiesSync();
}
