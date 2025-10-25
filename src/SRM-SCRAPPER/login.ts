// Local type definitions
interface UserLookupResponse {
  lookup?: {
    identifier: string;
    digest: string;
  };
  status_code: number;
  message: string;
  error?: string;
}

interface UserValidationResult {
  data?: {
    identifier?: string;
    digest?: string;
    status_code: number;
    message: string;
  };
  error?: string;
  errorReason?: unknown;
}

interface PasswordAuthResponse {
  status_code: number;
  localized_message?: string;
  cdigest?: string;
}

interface AuthResult {
  data?: {
    cookies?: string;
    statusCode: number;
    message?: string;
    captcha?: {
      required: boolean;
      digest: string | null | undefined;
    };
  };
  isAuthenticated?: boolean;
  error?: string;
  errorReason?: unknown;
}

interface LogoutResponse {
  message: string;
  status: number;
}

/**
 * Validates a username and returns user lookup information
 * @param username - The username to validate
 * @returns Promise<UserValidationResult>
 */
export async function validateUsername(username: string): Promise<UserValidationResult> {
  try {
    const response = await fetch(
      `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/lookup/${username}`,
      {
        method: 'POST',
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "sec-ch-ua": '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-zcsrf-token": "iamcsrcoo=3dea6395-0540-44ea-8de7-544256dd7549",
          cookie: "zalb_74c3a1eecc=50830239914cba1225506e915a665a91; zccpn=68703e7d-ccf0-42ba-92b2-9c87c7a0c8ae; JSESSIONID=739937C3826C1F58C37186170B4F4B36; cli_rgn=IN; _ga=GA1.3.1846200817.1748679237; _gid=GA1.3.734795940.1748679237; _gat=1; _ga_HQWPLLNMKY=GS2.3.s1748679237$o1$g0$t1748679237$j60$l0$h0; zalb_f0e8db9d3d=983d6a65b2f29022f18db52385bfc639; iamcsr=3dea6395-0540-44ea-8de7-544256dd7549; _zcsr_tmp=3dea6395-0540-44ea-8de7-544256dd7549; stk=4ec13d42454007681bd4337cf126baec",
          Referer: "https://academia.srmist.edu.in/accounts/p/10002227248/signin?hide_fp=true&servicename=ZohoCreator&service_language=en&css_url=/49910842/academia-academic-services/downloadPortalCustomCss/login&dcc=true&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `mode=primary&cli_time=${Date.now()}&servicename=ZohoCreator&service_language=en&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin`,
      }
    );

    const responseData = await response.json() as UserLookupResponse;

    const data = {
      identifier: responseData.lookup?.identifier,
      digest: responseData.lookup?.digest,
      status_code: responseData.status_code,
      message: responseData.message,
    };

    return { data };
  } catch (error) {
    console.error('Error validating username:', error);
    return {
      error: "Internal Server Error",
      errorReason: error,
    };
  }
}

/**
 * Authenticates user with password and returns cookies if successful
 * @param identifier - User identifier from username validation
 * @param digest - Digest from username validation
 * @param password - User password
 * @returns Promise<AuthResult>
 */
export async function authenticateUser(
  identifier: string,
  digest: string,
  password: string
): Promise<AuthResult> {
  try {
    const response = await fetch(
      `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/primary/${identifier}/password?digest=${digest}&cli_time=${Date.now()}&servicename=ZohoCreator&service_language=en&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin`,
      {
        method: 'POST',
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-zcsrf-token": "iamcsrcoo=fae2d8fa-e5a1-4cb0-a5ee-cc40af87e89f",
          cookie: "zalb_74c3a1eecc=4cad43ac9848cc7edd20d2313fcde774; zccpn=a6fa7bc8-11c7-44ad-8be8-0aa6b04fad8a; JSESSIONID=3BD0053672AF3D628D983A15AA469D07; cli_rgn=IN; _ga=GA1.3.2061081340.1748689001; _gid=GA1.3.1677956689.1748689001; _ga_HQWPLLNMKY=GS2.3.s1748689001$o1$g0$t1748689001$j60$l0$h0; zalb_f0e8db9d3d=7ad3232c36fdd9cc324fb86c2c0a58ad; iamcsr=fae2d8fa-e5a1-4cb0-a5ee-cc40af87e89f; _zcsr_tmp=fae2d8fa-e5a1-4cb0-a5ee-cc40af87e89f; stk=d6559e9a58e77dbea9e24adf3bb57941",
          Referer: "https://academia.srmist.edu.in/accounts/p/10002227248/signin?hide_fp=true&servicename=ZohoCreator&service_language=en&css_url=/49910842/academia-academic-services/downloadPortalCustomCss/login&dcc=true&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `{"passwordauth":{"password":"${password}"}}`,
      }
    );

    const responseData = await response.json() as PasswordAuthResponse;

    if (responseData.status_code === 201) {
      // Extract cookies from set-cookie header
      const setCookieHeader = response.headers.get('set-cookie');
      if (!setCookieHeader) {
        throw new Error("Couldn't get cookie from response header");
      }
      
      const cookieString = setCookieHeader;
      
      const matches = [
        ...cookieString.matchAll(
          /(_(?:iamadt|iambdt)_client_\d+|_z_identity)=[^;]+/g
        ),
      ];
      const extractedCookies = matches.map((m) => m[0]).join("; ") + ";";
      
      const data = {
        cookies: extractedCookies,
        statusCode: 201,
      };
      return { data, isAuthenticated: true };
    }

    const captchaRequired = responseData.localized_message
      ?.toLowerCase()
      ?.includes("captcha")
      ? true
      : false;

    const data = {
      statusCode: responseData.status_code,
      message: responseData.localized_message,
      captcha: captchaRequired
        ? { required: true, digest: responseData.cdigest }
        : { required: false, digest: null },
    };

    return { data, isAuthenticated: false };
  } catch (error) {
    return { error: "Internal Server Error", errorReason: error };
  }
}

/**
 * Complete login flow - validates username and authenticates with password
 * @param username - The username to login with
 * @param password - The password to authenticate with
 * @returns Promise<AuthResult>
 */
export async function loginUser(username: string, password: string): Promise<AuthResult> {
  try {
    // First validate the username
    const userValidation = await validateUsername(username);
    if (userValidation.error || !userValidation.data) {
      return {
        error: userValidation.error || "Username validation failed",
        errorReason: userValidation.errorReason,
      };
    }

    const { identifier, digest } = userValidation.data;
    if (!identifier || !digest) {
      return {
        error: "Invalid username or username not found",
      };
    }

    // Then authenticate with password
    return await authenticateUser(identifier, digest, password);
  } catch (error) {
    return { error: "Internal Server Error", errorReason: error };
  }
}

