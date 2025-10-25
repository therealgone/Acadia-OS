import got from 'got';

async function testDifferentCredentials() {
  console.log('🔐 Testing Different Credentials...\n');
  
  const testCredentials = [
    { username: 'jm7531', password: 'Dharun-07' },
    { username: 'testuser', password: 'testpass' },
    { username: 'admin', password: 'admin' }
  ];
  
  for (const creds of testCredentials) {
    console.log(`\n🧪 Testing credentials: ${creds.username} / ${creds.password}`);
    
    try {
      const userRes = await got.post(
        `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/lookup/${creds.username}`,
        {
          form: {
            mode: "primary",
            cli_time: Date.now(),
            servicename: "ZohoCreator",
            service_language: "en",
            serviceurl: "https://academia.srmist.edu.in/portal/academia-academic-services/redirectFromLogin",
          },
          headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            "referer": "https://academia.srmist.edu.in/",
            "origin": "https://academia.srmist.edu.in",
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          },
          responseType: "json",
          timeout: { request: 10000 }
        }
      );
      
      console.log(`✅ Username lookup successful - Status: ${userRes.statusCode}`);
      console.log('   Response:', JSON.stringify(userRes.body, null, 2));
      
      const lookup = (userRes.body as any).lookup;
      if (lookup?.identifier && lookup?.digest) {
        console.log('✅ Username validated - Identifier:', lookup.identifier);
        
        // Try password validation
        try {
          const passwordRes = await got.post(
            `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/primary/${lookup.identifier}/password?digest=${lookup.digest}&cli_time=${Date.now()}&servicename=ZohoCreator&service_language=en&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin`,
            {
              json: { passwordauth: { password: creds.password } },
              headers: {
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
                "referer": "https://academia.srmist.edu.in/",
                "origin": "https://academia.srmist.edu.in",
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
              },
              responseType: "json",
              timeout: { request: 10000 }
            }
          );
          
          console.log(`✅ Password validation - Status: ${passwordRes.statusCode}`);
          console.log('   Response:', JSON.stringify(passwordRes.body, null, 2));
          
          const passwordResponse = passwordRes.body as any;
          
          if (passwordResponse.status_code === 201) {
            console.log('🎉 LOGIN SUCCESSFUL!');
            return; // Exit on first success
          } else {
            console.log('❌ Login failed:', passwordResponse.localized_message || 'Unknown error');
          }
          
        } catch (passwordError: any) {
          console.log('❌ Password validation failed:', passwordError.message);
        }
        
      } else {
        console.log('❌ Username lookup failed - no identifier/digest found');
      }
      
    } catch (error: any) {
      console.log('❌ Username lookup failed:', error.message);
      if (error.response) {
        console.log(`   Status: ${error.response.statusCode}`);
      }
    }
  }
  
  console.log('\n💡 All credential tests completed. If none worked, the issue might be:');
  console.log('   - Invalid endpoint URL');
  console.log('   - Changed authentication method');
  console.log('   - Service is down or restricted');
  console.log('   - Need different headers or request format');
}

// Run the test
testDifferentCredentials().catch(console.error);
