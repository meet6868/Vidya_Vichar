const http = require('http');
const jwt = require('jsonwebtoken');

async function testCourseLecturesAPI() {
  try {
    // Create a JWT token for the student
    const payload = {
      id: '68d8fc7f75f46a54d2813900',
      email: 'abc@gmail.com',
      role: 'student'
    };
    
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '24h' });
    console.log('🔑 Generated token for testing course lectures API');
    
    // Test with the first course ID (CS101)
    const courseId = '68d920d410d14c3e40ed711e'; // CS101 course ID
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/users/student/dashboard/course-lectures/${courseId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    console.log(`🔍 Testing course lectures API for course ID: ${courseId}`);

    const req = http.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📦 Response:', data);
        try {
          const parsed = JSON.parse(data);
          console.log('✅ Parsed response:', JSON.stringify(parsed, null, 2));
          
          if (parsed.success && parsed.data?.lectures) {
            console.log(`📚 Found ${parsed.data.lectures.length} lectures`);
          } else {
            console.log('❌ No lectures found or API error');
          }
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

testCourseLecturesAPI();
