const mongoose = require('mongoose');
const Teacher = require('./src/models/Teachers');
const Course = require('./src/models/Courses');
const Student = require('./src/models/Students');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vidya_vichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  testBothEndpoints();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function testBothEndpoints() {
  try {
    // Find the teacher
    const teacher = await Teacher.findOne({ teacher_id: 'TEST_TEACHER_001' });
    
    if (!teacher) {
      console.log('❌ Teacher not found');
      return;
    }

    console.log('=== TEACHER DATA ===');
    console.log('Teacher:', teacher.name);
    console.log('Courses ID:', teacher.courses_id);

    // Simulate getTeacherCourses endpoint
    console.log('\n=== TESTING getTeacherCourses (Overview) ===');
    const courses = await Course.find({ course_id: { $in: teacher.courses_id } });
    
    const formattedCourses = courses.map(course => ({
      course_id: course.course_id,
      course_name: course.course_name,
      description: course.description || 'No description available',
      batch: course.batch || 'Not specified',
      branch: course.branch || 'Not specified',
      students_enrolled: Array.isArray(course.student_list) ? course.student_list.length : 0,
      pending_requests: Array.isArray(course.request_list) ? course.request_list.length : 0,
      created_at: course.createdAt || new Date()
    }));

    formattedCourses.forEach(course => {
      console.log(`Course: ${course.course_id} - ${course.pending_requests} pending requests`);
    });

    // Test CS103 specifically
    console.log('\n=== TESTING getPendingRequests for CS103 ===');
    const cs103Course = await Course.findOne({ course_id: 'CS103' });
    
    if (cs103Course) {
      console.log('CS103 request_list:', cs103Course.request_list);
      
      // Simulate getPendingRequests endpoint
      const students = await Student.find({ _id: { $in: cs103Course.request_list } }, 'name _id username');
      
      const pendingStudents = students.map(s => ({
        id: s._id,
        name: s.name,
        username: s.username
      }));

      console.log('Found pending students:', pendingStudents.length);
      pendingStudents.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.username})`);
      });

      // This is what the API should return
      console.log('\n=== EXPECTED API RESPONSE ===');
      console.log(JSON.stringify({
        success: true,
        data: {
          pending_students: pendingStudents
        }
      }, null, 2));

    } else {
      console.log('❌ CS103 course not found');
    }

  } catch (error) {
    console.error('Error testing endpoints:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
