const mongoose = require('mongoose');
const Course = require('./src/models/Courses');

async function checkTeacherIds() {
  try {
    await mongoose.connect('mongodb://localhost:27017/vidya_vichar');
    
    const courses = await Course.find({});
    courses.forEach(course => {
      console.log(`Course: ${course.course_name}`);
      console.log(`Teacher IDs:`, course.teacher_id);
      console.log('---');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

checkTeacherIds();
