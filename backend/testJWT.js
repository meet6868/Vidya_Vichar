// Simple test to verify JWT token functionality
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Same as in auth.controller.js

// Create a test student token (like what loginStudent creates)
const studentToken = jwt.sign({ 
  id: '507f1f77bcf86cd799439011', // Mock student ID 
  role: 'student' 
}, JWT_SECRET, { expiresIn: '1d' });

console.log('=== JWT TOKEN TEST ===');
console.log('Generated student token:', studentToken);

// Verify the token (like what authenticate middleware does)
try {
  const decoded = jwt.verify(studentToken, JWT_SECRET);
  console.log('Decoded token:', decoded);
  
  // Check role validation (like authenticate middleware does)
  const requiredRoles = ['student'];
  const hasPermission = requiredRoles.includes(decoded.role);
  console.log('Role check result:', hasPermission);
  
  if (hasPermission) {
    console.log('✅ Student authentication should work!');
  } else {
    console.log('❌ Student authentication would fail - wrong role');
  }
  
} catch (error) {
  console.log('❌ Token verification failed:', error.message);
}

// Test what happens with wrong role
const teacherToken = jwt.sign({ 
  id: '507f1f77bcf86cd799439011', 
  role: 'teacher' 
}, JWT_SECRET, { expiresIn: '1d' });

console.log('\n=== WRONG ROLE TEST ===');
try {
  const decoded = jwt.verify(teacherToken, JWT_SECRET);
  const hasPermission = ['student'].includes(decoded.role);
  console.log('Teacher token accessing student endpoint:', hasPermission);
  if (!hasPermission) {
    console.log('This would return: 403 Forbidden: Insufficient role.');
  }
} catch (error) {
  console.log('Error:', error.message);
}
