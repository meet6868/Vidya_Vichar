const mongoose = require('mongoose');
const Course = require('./src/models/Courses');
const Teacher = require('./src/models/Teachers');

async function fixTeacherIds() {
  try {
    await mongoose.connect('mongodb://localhost:27017/vidya_vichar');
    
    // Get real teachers
    const teachers = await Teacher.find({});
    console.log('Found teachers:');
    teachers.forEach(teacher => {
      console.log(`- ${teacher.name} (${teacher._id})`);
    });
    
    if (teachers.length === 0) {
      console.log('No teachers found! Creating a sample teacher...');
      const sampleTeacher = new Teacher({
        username: 'teacher@gmail.com',
        password: '$2b$10$hashedpassword', // placeholder
        name: 'Dr. Sample Teacher',
        department: 'Computer Science'
      });
      await sampleTeacher.save();
      console.log('Created sample teacher:', sampleTeacher._id);
    }
    
    // Update courses with real teacher ID
    const courses = await Course.find({});
    const teacherId = teachers.length > 0 ? teachers[0]._id : await Teacher.findOne({})._id;
    
    for (const course of courses) {
      console.log(`Updating ${course.course_name} teacher ID...`);
      await Course.updateOne(
        { _id: course._id },
        { teacher_id: [teacherId.toString()] }
      );
    }
    
    console.log('✅ All courses updated with real teacher IDs');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

fixTeacherIds();
