const mongoose = require('mongoose');
const Student = require('./src/models/Students');
const Course = require('./src/models/Courses');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vidya_vichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  checkStudentAndCourses();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function checkStudentAndCourses() {
  try {
    console.log('Checking database collections...');
    
    // Check database collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Check all students with more verbose logging
    const studentCount = await Student.countDocuments();
    console.log(`Total students in database: ${studentCount}`);
    
    const students = await Student.find({});
    console.log('=== STUDENTS ===');
    if (students.length === 0) {
      console.log('No students found in database');
    } else {
      students.forEach((student, index) => {
        console.log(`Student ${index + 1}:`, {
          name: student.name,
          email: student.email,
          username: student.username,
          batch: student.batch,
          branch: student.branch,
          student_id: student.student_id
        });
      });
    }

    // Check all courses with more verbose logging
    const courseCount = await Course.countDocuments();
    console.log(`\nTotal courses in database: ${courseCount}`);
    
    const courses = await Course.find({});
    console.log('\n=== COURSES ===');
    if (courses.length === 0) {
      console.log('No courses found in database');
    } else {
      courses.forEach((course, index) => {
        console.log(`Course ${index + 1}:`, {
          course_id: course.course_id,
          course_name: course.course_name,
          batch: course.batch,
          branch: course.branch,
          teacher_id: course.teacher_id
        });
      });
    }

    console.log('\n=== FILTERING CHECK ===');
    if (students.length > 0) {
      const student = students[0];
      console.log(`Checking courses for student: ${student.name} (Batch: ${student.batch}, Branch: ${student.branch})`);
      
      const matchingCourses = await Course.find({
        batch: student.batch,
        branch: student.branch
      });
      
      console.log(`Found ${matchingCourses.length} matching courses`);
      if (matchingCourses.length > 0) {
        console.log('Matching courses:', matchingCourses.map(c => ({
          course_id: c.course_id,
          course_name: c.course_name,
          batch: c.batch,
          branch: c.branch
        })));
      } else {
        console.log('No courses match this student\'s batch and branch');
      }
    }

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
