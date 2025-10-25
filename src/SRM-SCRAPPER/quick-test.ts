import { loginUser, getUserInfo } from './index';

async function quickTest() {
  console.log('🔐 Testing login with provided credentials...');
  
  try {
    const result = await loginUser('jm7531', 'Dharun-07');
    
    if (result.error) {
      console.log('❌ Login failed:', result.error);
      return;
    }
    
    if (!result.isAuthenticated) {
      console.log('❌ Authentication failed');
      console.log('Response:', result);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🍪 Cookies:', result.data?.cookies?.substring(0, 100) + '...');
    
    // Test user info
    console.log('\n👤 Testing user info...');
    const userInfo = await getUserInfo(result.data?.cookies || '');
    
    if (userInfo.error) {
      console.log('❌ User info failed:', userInfo.error);
    } else {
      console.log('✅ User info successful!');
      console.log('📋 User:', userInfo.userInfo?.name);
      console.log('🎓 Program:', userInfo.userInfo?.program);
      console.log('🏫 Department:', userInfo.userInfo?.department);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

quickTest();
