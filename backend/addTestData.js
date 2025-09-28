// Test data script to add sample courses and teacher data
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Course = require('./src/models/Courses');
const Teacher = require('./src/models/Teachers');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/vidya_vichar', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const addTestData = async () => {
  try {
    // Create a specific test teacher
    const testTeacherData = {
      teacher_id: 'TEST_TEACHER_001',
      username: 'testteacher@vidyavichar.com',
      name: 'Dr. Test Teacher',
      password: await bcrypt.hash('password123', 10), // Hash the password
      courses_id: [] // Will be updated after creating courses
    };

    // Delete existing test teacher if exists
    await Teacher.deleteOne({ teacher_id: testTeacherData.teacher_id });

    // Sample courses data
    const sampleCourses = [
      {
        course_id: 'CS101',
        course_name: 'Introduction to Computer Science',
        teacher_id: [testTeacherData.teacher_id], // Assign to our test teacher
        TA: [],
        batch: 'B.Tech',
        branch: 'CSE',
        valid_time: new Date('2024-12-31'),
        request_list: ['STU001', 'STU002'], // Sample pending requests
        student_list: ['STU003', 'STU004', 'STU005'],
        lecture_id: []
      },
      {
        course_id: 'CS201',
        course_name: 'Data Structures and Algorithms',
        teacher_id: [testTeacherData.teacher_id],
        TA: [],
        batch: 'B.Tech',
        branch: 'CSE',
        valid_time: new Date('2024-12-31'),
        request_list: ['STU006'], // Sample pending requests
        student_list: ['STU007', 'STU008', 'STU009', 'STU010'],
        lecture_id: []
      },
      {
        course_id: 'MATH101',
        course_name: 'Linear Algebra',
        teacher_id: [testTeacherData.teacher_id],
        TA: [],
        batch: 'B.Tech',
        branch: 'CSE',
        valid_time: new Date('2024-12-31'),
        request_list: ['STU011', 'STU012', 'STU013'], // Sample pending requests
        student_list: ['STU014', 'STU015', 'STU016'],
        lecture_id: []
      }
    ];

    // Delete existing test courses first (to avoid duplicates)
    await Course.deleteMany({ 
      course_id: { $in: sampleCourses.map(c => c.course_id) } 
    });

    // Insert sample courses
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log('Sample courses added successfully:', insertedCourses.length);

    // Update teacher's courses_id array with the course IDs
    testTeacherData.courses_id = sampleCourses.map(c => c.course_id);

    // Create the test teacher
    const testTeacher = await Teacher.create(testTeacherData);
    console.log('Test teacher created successfully:', testTeacher.name);

    // Display the test credentials
    console.log('\n=== TEST TEACHER CREDENTIALS ===');
    console.log('Email/Username:', testTeacherData.username);
    console.log('Password:', 'password123');
    console.log('Teacher ID:', testTeacherData.teacher_id);
    console.log('Name:', testTeacherData.name);
    console.log('Assigned Courses:', testTeacherData.courses_id);
    console.log('================================\n');

    // Display the courses that were added
    insertedCourses.forEach(course => {
      console.log(`- ${course.course_id}: ${course.course_name} (${course.request_list?.length || 0} pending requests, ${course.student_list?.length || 0} students)`);
    });

    console.log('\nYou can now login with:');
    console.log('Username: testteacher@vidyavichar.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error adding test data:', error);
  }
};

const main = async () => {
  await connectDB();
  await addTestData();
  mongoose.connection.close();
  console.log('Database connection closed');
};

main();
