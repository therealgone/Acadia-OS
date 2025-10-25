import got from 'got';

async function extractCSRFToken() {
  console.log('🔍 Extracting CSRF Token from Main Page...\n');
  
  try {
    const mainPageResponse = await got.get('https://academia.srmist.edu.in/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
      },
      timeout: { request: 10000 }
    });
    
    console.log('✅ Main page accessible - Status:', mainPageResponse.statusCode);
    console.log('📄 Page length:', mainPageResponse.body.length, 'chars');
    
    // Look for various CSRF token patterns
    const patterns = [
      /iamcsrcoo=([a-f0-9-]+)/g,
      /csrf[_-]?token["\s]*[:=]["\s]*([a-f0-9-]+)/gi,
      /_token["\s]*[:=]["\s]*([a-f0-9-]+)/gi,
      /authenticity_token["\s]*[:=]["\s]*([a-f0-9-]+)/gi,
      /token["\s]*[:=]["\s]*([a-f0-9-]+)/gi
    ];
    
    console.log('\n🔍 Searching for CSRF tokens...');
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const matches = [...mainPageResponse.body.matchAll(pattern)];
      
      if (matches.length > 0) {
        console.log(`✅ Pattern ${i + 1} found ${matches.length} matches:`);
        matches.forEach((match, index) => {
          console.log(`   ${index + 1}. ${match[1]}`);
        });
      } else {
        console.log(`❌ Pattern ${i + 1}: No matches`);
      }
    }
    
    // Look for any token-like strings
    console.log('\n🔍 Looking for any token-like strings...');
    const tokenLikePattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g;
    const tokenMatches = [...mainPageResponse.body.matchAll(tokenLikePattern)];
    
    if (tokenMatches.length > 0) {
      console.log(`✅ Found ${tokenMatches.length} UUID-like tokens:`);
      tokenMatches.forEach((match, index) => {
        console.log(`   ${index + 1}. ${match[0]}`);
      });
    } else {
      console.log('❌ No UUID-like tokens found');
    }
    
    // Look for meta tags
    console.log('\n🔍 Looking for meta tags...');
    const metaPattern = /<meta[^>]*name=["']csrf-token["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
    const metaMatches = [...mainPageResponse.body.matchAll(metaPattern)];
    
    if (metaMatches.length > 0) {
      console.log(`✅ Found ${metaMatches.length} CSRF meta tags:`);
      metaMatches.forEach((match, index) => {
        console.log(`   ${index + 1}. ${match[1]}`);
      });
    } else {
      console.log('❌ No CSRF meta tags found');
    }
    
    // Look for hidden input fields
    console.log('\n🔍 Looking for hidden input fields...');
    const inputPattern = /<input[^>]*type=["']hidden["'][^>]*name=["']([^"']*token[^"']*)["'][^>]*value=["']([^"']+)["'][^>]*>/gi;
    const inputMatches = [...mainPageResponse.body.matchAll(inputPattern)];
    
    if (inputMatches.length > 0) {
      console.log(`✅ Found ${inputMatches.length} hidden token inputs:`);
      inputMatches.forEach((match, index) => {
        console.log(`   ${index + 1}. ${match[1]} = ${match[2]}`);
      });
    } else {
      console.log('❌ No hidden token inputs found');
    }
    
    // Show a sample of the page content
    console.log('\n📄 Sample page content (first 1000 chars):');
    console.log(mainPageResponse.body.substring(0, 1000));
    
  } catch (error: any) {
    console.error('💥 Failed to extract CSRF token:', error.message);
  }
}

// Run the test
extractCSRFToken().catch(console.error);

