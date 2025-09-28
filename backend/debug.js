const mongoose = require('mongoose');
const Student = require('./src/models/Students');
const Course = require('./src/models/Courses');

async function debugEnrolledCourses() {
  try {
    await mongoose.connect('mongodb://localhost:27017/vidya_vichar');
    console.log('🔍 Debugging enrolled courses API...');
    
    // Get student ID (simulating the logged-in user)
    const student = await Student.findOne({ username: 'abc@gmail.com' });
    if (!student) {
      console.log('❌ Student not found');
      return;
    }
    
    console.log('👤 Student found:', student.name);
    console.log('📋 Student ID:', student._id.toString());
    
    // Find courses where this student is enrolled (same logic as API)
    console.log('\n🔍 Searching for courses with student_list containing:', student._id.toString());
    const courses = await Course.find({ student_list: student._id.toString() });
    
    console.log('📚 Courses found:', courses.length);
    
    if (courses.length === 0) {
      console.log('\n❌ No courses found! Let\'s check what\'s in the database:');
      const allCourses = await Course.find({});
      allCourses.forEach(course => {
        console.log(`Course: ${course.course_name}`);
        console.log(`Student list:`, course.student_list);
        console.log(`Student list type:`, typeof course.student_list[0]);
        console.log(`Our student ID:`, student._id.toString());
        console.log(`Match?`, course.student_list.includes(student._id.toString()));
        console.log('---');
      });
    } else {
      courses.forEach(course => {
        console.log(`✅ Found: ${course.course_name} (${course.course_id})`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

debugEnrolledCourses();
