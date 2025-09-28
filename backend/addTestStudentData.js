const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./src/models/Students');
const Teacher = require('./src/models/Teachers');
const Course = require('./src/models/Courses');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/midsem_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  addTestStudentAndCourse();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function addTestStudentAndCourse() {
  try {
    // Create a test student first
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testStudent = new Student({
      student_id: 'TEST_STU_001',
      name: 'Test Student',
      email: 'teststudent@vidyavichar.com',
      password: hashedPassword,
      batch: 'B.Tech',  // Same as the course
      branch: 'CSE',    // Same as the course
      courses_id_enrolled: [],
      courses_id_pending: []
    });

    const savedStudent = await testStudent.save();
    console.log('Test student created:', {
      name: savedStudent.name,
      email: savedStudent.email,
      batch: savedStudent.batch,
      branch: savedStudent.branch
    });

    // Create a test teacher
    const testTeacher = new Teacher({
      teacher_id: 'TEST_TEACHER_002',
      name: 'Test Teacher 2',
      email: 'testteacher2@vidyavichar.com',
      password: hashedPassword,
      courses_id: ['TEST_COURSE_001']
    });

    const savedTeacher = await testTeacher.save();
    console.log('Test teacher created:', {
      name: savedTeacher.name,
      email: savedTeacher.email,
      courses_id: savedTeacher.courses_id
    });

    // Create a test course that matches the student's batch and branch
    const testCourse = new Course({
      course_id: 'TEST_COURSE_001',
      course_name: 'Test Course for Students',
      teacher_id: [savedTeacher.teacher_id],
      TA: [],
      batch: 'B.Tech',  // Matching student batch
      branch: 'CSE',    // Matching student branch
      valid_time: new Date('2024-12-31'),
      request_list: [],
      student_list: [],
      lecture_id: []
    });

    const savedCourse = await testCourse.save();
    console.log('Test course created:', {
      course_id: savedCourse.course_id,
      course_name: savedCourse.course_name,
      batch: savedCourse.batch,
      branch: savedCourse.branch
    });

    console.log('\n=== TEST CREDENTIALS ===');
    console.log('Student Login:');
    console.log('Email: teststudent@vidyavichar.com');
    console.log('Password: password123');
    console.log('\nTeacher Login:');
    console.log('Email: testteacher2@vidyavichar.com'); 
    console.log('Password: password123');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
