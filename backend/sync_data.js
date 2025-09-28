const Student = require('./src/models/Students');
const Course = require('./src/models/Courses');
require('./src/config/db');

async function syncPendingCourseRequests() {
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔄 Starting data synchronization for pending course requests...');
    
    // Find the test student
    const student = await Student.findOne({ username: 'test@example.com' });
    if (!student) {
      console.log('❌ Student not found');
      return;
    }
    
    console.log(`👤 Found student: ${student.name} (${student.username})`);
    console.log(`📋 Student courses_id_request: [${student.courses_id_request.join(', ')}]`);
    
    // Process each course ID in student's request list
    for (const courseId of student.courses_id_request) {
      console.log(`\n🔍 Checking course: ${courseId}`);
      
      // Find the course by course_id
      const course = await Course.findOne({ course_id: courseId });
      
      if (!course) {
        console.log(`❌ Course ${courseId} not found in database!`);
        console.log(`🔧 Removing ${courseId} from student's request list...`);
        
        // Remove non-existent course from student's request list
        student.courses_id_request = student.courses_id_request.filter(id => id !== courseId);
        await student.save();
        
        console.log(`✅ Removed ${courseId} from student document`);
      } else {
        console.log(`✅ Course ${courseId} exists: ${course.course_name}`);
        
        // Check if student is in course's request_list
        if (!course.request_list.includes(student._id)) {
          console.log(`🔧 Adding student to ${courseId} request_list...`);
          course.request_list.push(student._id);
          await course.save();
          console.log(`✅ Added student to course ${courseId} request_list`);
        } else {
          console.log(`✅ Student already in ${courseId} request_list`);
        }
      }
    }
    
    // Verify final state
    console.log('\n📊 Final verification:');
    const updatedStudent = await Student.findById(student._id);
    console.log(`Student courses_id_request: [${updatedStudent.courses_id_request.join(', ')}]`);
    
    const coursesWithRequest = await Course.find({ request_list: student._id }).select('course_id course_name');
    console.log(`Courses with student in request_list: [${coursesWithRequest.map(c => c.course_id).join(', ')}]`);
    
    console.log('\n🎉 Data synchronization completed!');
    
  } catch (error) {
    console.error('❌ Error during synchronization:', error);
  } finally {
    process.exit(0);
  }
}

syncPendingCourseRequests();
