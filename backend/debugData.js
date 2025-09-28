// Debug script to check the database state
const mongoose = require('mongoose');
const Course = require('./src/models/Courses');
const Teacher = require('./src/models/Teachers');

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

const debugData = async () => {
  try {
    // Find the test teacher
    const testTeacher = await Teacher.findOne({ teacher_id: 'TEST_TEACHER_001' });
    console.log('Test Teacher:', JSON.stringify(testTeacher, null, 2));

    if (testTeacher) {
      console.log('Teacher courses_id:', testTeacher.courses_id);
      
      // Find courses that should match
      const courses = await Course.find({ course_id: { $in: testTeacher.courses_id } });
      console.log(`Found ${courses.length} courses for teacher:`, courses.map(c => ({
        course_id: c.course_id,
        course_name: c.course_name,
        teacher_id: c.teacher_id
      })));
    }

    // Also check all courses
    const allCourses = await Course.find({});
    console.log('\nAll courses in database:', allCourses.map(c => ({
      course_id: c.course_id,
      course_name: c.course_name,
      teacher_id: c.teacher_id
    })));

  } catch (error) {
    console.error('Error:', error);
  }
};

const main = async () => {
  await connectDB();
  await debugData();
  mongoose.connection.close();
  console.log('Database connection closed');
};

main();
