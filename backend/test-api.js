const http = require('http');
const jwt = require('jsonwebtoken');

async function testAPI() {
  try {
    // Create a JWT token for the student (simulating login)
    const payload = {
      id: '68d8fc7f75f46a54d2813900',
      email: 'abc@gmail.com',
      role: 'student'
    };
    
    // Use same secret as in backend
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '24h' });
    
    console.log('🔑 Generated token for testing');
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/student/dashboard/enrolled-courses',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📦 Response:', data);
        try {
          const parsed = JSON.parse(data);
          console.log('✅ Parsed response:', parsed);
        } catch (e) {
          console.log('❌ Could not parse JSON response');
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
    });

    req.end();
    
  } catch (error) {
    console.error('Error creating token:', error);
  }
}

testAPI();
