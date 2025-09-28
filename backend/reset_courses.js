const mongoose = require('mongoose');
require('./src/config/db');

const Course = require('./src/models/Courses');
const Student = require('./src/models/Students');
const Teacher = require('./src/models/Teachers');

async function resetCoursesData() {
  try {
    // Wait for database connection
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔄 Starting course data reset...');
    
    // 1. Delete all existing courses
    console.log('🗑️ Removing all existing courses...');
    const deletedCourses = await Course.deleteMany({});
    console.log(`✅ Deleted ${deletedCourses.deletedCount} courses`);
    
    // 2. Clear course references from all students
    console.log('🧹 Clearing course references from student documents...');
    const studentsUpdate = await Student.updateMany(
      {},
      {
        $set: {
          courses_id_enrolled: [],
          courses_id_request: []
        }
      }
    );
    console.log(`✅ Updated ${studentsUpdate.modifiedCount} student documents`);
    
    // 3. Find teachers to assign to courses
    const teachers = await Teacher.find({}).limit(3);
    if (teachers.length === 0) {
      console.log('⚠️ No teachers found, courses will have empty teacher_id arrays');
    }
    
    // 4. Create new fresh courses
    console.log('➕ Adding new courses...');
    
    const newCourses = [
      {
        course_id: 'CSE101',
        course_name: 'Introduction to Programming',
        batch: 'M.Tech',
        branch: 'CSE',
        teacher_id: teachers.length > 0 ? [teachers[0]._id] : [],
        student_list: [],
        request_list: [],
        valid_time: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      },
      {
        course_id: 'CSE201',
        course_name: 'Data Structures and Algorithms',
        batch: 'M.Tech',
        branch: 'CSE',
        teacher_id: teachers.length > 1 ? [teachers[1]._id] : teachers.length > 0 ? [teachers[0]._id] : [],
        student_list: [],
        request_list: [],
        valid_time: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        course_id: 'CSE301',
        course_name: 'Database Management Systems',
        batch: 'M.Tech',
        branch: 'CSE',
        teacher_id: teachers.length > 2 ? [teachers[2]._id] : teachers.length > 0 ? [teachers[0]._id] : [],
        student_list: [],
        request_list: [],
        valid_time: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        course_id: 'ECE101',
        course_name: 'Circuit Analysis',
        batch: 'M.Tech',
        branch: 'ECE',
        teacher_id: teachers.length > 0 ? [teachers[0]._id] : [],
        student_list: [],
        request_list: [],
        valid_time: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        course_id: 'CSE401',
        course_name: 'Machine Learning',
        batch: 'B.Tech',
        branch: 'CSE',
        teacher_id: teachers.length > 1 ? [teachers[1]._id] : teachers.length > 0 ? [teachers[0]._id] : [],
        student_list: [],
        request_list: [],
        valid_time: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    ];
    
    const createdCourses = await Course.insertMany(newCourses);
    console.log(`✅ Created ${createdCourses.length} new courses:`);
    
    createdCourses.forEach(course => {
      console.log(`   - ${course.course_id}: ${course.course_name} (${course.batch}, ${course.branch})`);
    });
    
    console.log('\n🎉 Course data reset completed successfully!');
    console.log('✅ All students now have clean course arrays');
    console.log('✅ All new courses are ready for enrollment');
    console.log('✅ Data consistency issues resolved');
    
  } catch (error) {
    console.error('❌ Error during course reset:', error);
  } finally {
    process.exit(0);
  }
}

resetCoursesData();
