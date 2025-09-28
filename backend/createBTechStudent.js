const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./src/models/Students');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vidya_vichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  createBTechStudent();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function createBTechStudent() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const btechStudent = new Student({
      student_id: 'BTECH_STU_001',
      name: 'B.Tech Student',
      username: 'btechstudent@vidyavichar.com',
      password: hashedPassword,
      roll_no: 'BT001',
      is_TA: false,
      batch: 'B.Tech',  // This will match cs101 course
      branch: 'CSE',    // This will match cs101 course  
      courses_id_request: [],
      courses_id_enrolled: []
    });

    const savedStudent = await btechStudent.save();
    console.log('B.Tech student created successfully!');
    console.log({
      name: savedStudent.name,
      username: savedStudent.username, 
      batch: savedStudent.batch,
      branch: savedStudent.branch,
      student_id: savedStudent.student_id
    });

    console.log('\n=== NEW LOGIN CREDENTIALS ===');
    console.log('Username: btechstudent@vidyavichar.com');
    console.log('Password: password123');
    console.log('\nThis student should be able to see course: cs101 (B.Tech, CSE)');

  } catch (error) {
    console.error('Error creating student:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
