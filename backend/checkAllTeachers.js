const mongoose = require('mongoose');
const Teacher = require('./src/models/Teachers');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/midsem_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  checkTeachers();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function checkTeachers() {
  try {
    const teachers = await Teacher.find({});
    console.log('All teachers in database:');
    teachers.forEach((teacher, index) => {
      console.log(`Teacher ${index + 1}:`, {
        name: teacher.name,
        email: teacher.email,
        courses_id: teacher.courses_id
      });
    });
    
    if (teachers.length === 0) {
      console.log('No teachers found in database');
    }
  } catch (error) {
    console.error('Error checking teachers:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
