const mongoose = require('mongoose');
const Teacher = require('./src/models/Teachers');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/midsem_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  fixTeacherData();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function fixTeacherData() {
  try {
    // Find the test teacher
    const teacher = await Teacher.findOne({ email: 'testteacher@vidyavichar.com' });
    
    if (teacher) {
      console.log('Found teacher:', teacher.name);
      console.log('Current courses_id:', teacher.courses_id);
      
      // Fix the nested array issue
      if (teacher.courses_id && teacher.courses_id.length > 0) {
        // Check if it's a nested array
        if (Array.isArray(teacher.courses_id[0])) {
          console.log('Found nested array, flattening...');
          teacher.courses_id = teacher.courses_id.flat();
        }
      }
      
      // Save the corrected data
      await teacher.save();
      console.log('Updated courses_id:', teacher.courses_id);
      console.log('Teacher data fixed successfully!');
    } else {
      console.log('Test teacher not found');
    }
  } catch (error) {
    console.error('Error fixing teacher data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
