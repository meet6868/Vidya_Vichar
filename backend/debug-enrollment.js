const mongoose = require('mongoose');
const Course = require('./src/models/Courses');
const Student = require('./src/models/Students');

async function debugEnrollmentCheck() {
  try {
    await mongoose.connect('mongodb://localhost:27017/vidya_vichar');
    
    const courseId = '68d920d410d14c3e40ed711e';
    const studentId = '68d8fc7f75f46a54d2813900';
    
    console.log('🔍 Debugging enrollment check...');
    console.log('Course ID (MongoDB _id):', courseId);
    console.log('Student ID:', studentId);
    console.log('Student ID type:', typeof studentId);
    
    // Get the course
    const course = await Course.findById(courseId);
    if (!course) {
      console.log('❌ Course not found');
      return;
    }
    
    console.log('✅ Course found:', course.course_name);
    console.log('📋 Student list length:', course.student_list.length);
    console.log('📋 Student list contents:', course.student_list);
    console.log('📋 Student list types:', course.student_list.map(id => typeof id));
    
    // Check different ways to find the student
    console.log('\n🔍 Testing different enrollment checks:');
    
    // Method 1: Direct string comparison
    const method1 = course.student_list.includes(studentId);
    console.log('Method 1 (string includes):', method1);
    
    // Method 2: Convert to strings and compare
    const method2 = course.student_list.map(id => id.toString()).includes(studentId);
    console.log('Method 2 (toString includes):', method2);
    
    // Method 3: Using MongoDB query with string
    const query1 = await Course.findOne({ _id: courseId, student_list: studentId });
    console.log('Method 3 (MongoDB query with string):', !!query1);
    
    // Method 4: Using MongoDB query with ObjectId
    const query2 = await Course.findOne({ _id: courseId, student_list: new mongoose.Types.ObjectId(studentId) });
    console.log('Method 4 (MongoDB query with ObjectId):', !!query2);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

debugEnrollmentCheck();
