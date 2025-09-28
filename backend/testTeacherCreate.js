const mongoose = require('mongoose');
const Teacher = require('./src/models/Teachers');
const Course = require('./src/models/Courses');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/midsem_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  testTeacherCreation();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function testTeacherCreation() {
  try {
    // First, let's check if a teacher already exists
    const existingTeacher = await Teacher.findOne({ email: 'testteacher@vidyavichar.com' });
    if (existingTeacher) {
      console.log('Found existing teacher:', existingTeacher);
      mongoose.connection.close();
      return;
    }

    // Create a simple teacher first
    const teacherData = {
      teacher_id: 'TEST_TEACHER_001',
      name: 'Dr. Test Teacher',
      email: 'testteacher@vidyavichar.com',
      password: '$2b$10$hash', // Simple hash for testing
      courses_id: ['CS101', 'CS201', 'MATH101'] // Flat array, not nested
    };

    console.log('Creating teacher with data:', teacherData);
    
    const teacher = new Teacher(teacherData);
    const savedTeacher = await teacher.save();
    
    console.log('Teacher saved successfully!');
    console.log('Saved teacher data:', {
      id: savedTeacher._id,
      teacher_id: savedTeacher.teacher_id,
      name: savedTeacher.name,
      email: savedTeacher.email,
      courses_id: savedTeacher.courses_id
    });

    // Verify by fetching it back
    const fetchedTeacher = await Teacher.findOne({ email: 'testteacher@vidyavichar.com' });
    console.log('Fetched teacher:', fetchedTeacher);

  } catch (error) {
    console.error('Error creating teacher:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
