const mongoose = require('mongoose');
const Course = require('./src/models/Courses');
const Student = require('./src/models/Students');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vidya_vichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  debugRequestList();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

async function debugRequestList() {
  try {
    // Find CS103 course
    const course = await Course.findOne({ course_id: 'CS103' });
    
    if (!course) {
      console.log('❌ CS103 course not found');
      return;
    }

    console.log('=== CS103 COURSE DATA ===');
    console.log('Course ID:', course.course_id);
    console.log('Course Name:', course.course_name);
    console.log('Request List:', course.request_list);
    console.log('Request List Type:', typeof course.request_list);
    console.log('Request List Length:', course.request_list ? course.request_list.length : 0);

    if (course.request_list && course.request_list.length > 0) {
      console.log('\n=== ANALYZING REQUEST LIST ===');
      for (let i = 0; i < course.request_list.length; i++) {
        const requestId = course.request_list[i];
        console.log(`Request ${i + 1}:`, {
          value: requestId,
          type: typeof requestId,
          isObjectId: mongoose.Types.ObjectId.isValid(requestId)
        });

        // Try to find the student
        try {
          const student = await Student.findById(requestId);
          if (student) {
            console.log(`  ✅ Found student: ${student.name} (${student.username})`);
          } else {
            console.log(`  ❌ Student not found for ID: ${requestId}`);
          }
        } catch (error) {
          console.log(`  ❌ Error finding student: ${error.message}`);
        }
      }
    } else {
      console.log('No pending requests in course.request_list');
    }

    // Test the getPendingRequests query directly
    console.log('\n=== TESTING getPendingRequests QUERY ===');
    const students = await Student.find({ _id: { $in: course.request_list } }, 'name _id username');
    console.log(`Query returned ${students.length} students:`);
    students.forEach((student, index) => {
      console.log(`Student ${index + 1}:`, {
        id: student._id,
        name: student.name,
        username: student.username
      });
    });

  } catch (error) {
    console.error('Error debugging request list:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}
