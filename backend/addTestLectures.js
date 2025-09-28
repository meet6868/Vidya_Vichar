const mongoose = require('mongoose');
const Lecture = require('./src/models/Lecture');
const Course = require('./src/models/Courses');
const Teacher = require('./src/models/Teachers');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/VidyaVichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  addTestLectures();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function addTestLectures() {
  try {
    // Get a teacher and their courses
    const teacher = await Teacher.findOne();
    if (!teacher) {
      console.log('No teacher found. Please create a teacher first.');
      process.exit(1);
    }

    console.log('Found teacher:', teacher.name, 'Teacher ID:', teacher.teacher_id);
    console.log('Teacher courses:', teacher.courses_id);

    // Get one of the teacher's courses
    if (!teacher.courses_id || teacher.courses_id.length === 0) {
      console.log('Teacher has no courses. Please assign courses to teacher first.');
      process.exit(1);
    }

    const courseId = teacher.courses_id[0];
    const course = await Course.findOne({ course_id: courseId });
    if (!course) {
      console.log('Course not found:', courseId);
      process.exit(1);
    }

    console.log('Found course:', course.course_name, 'Course ID:', course.course_id);

    // Create test lectures (completed - in the past)
    const testLectures = [
      {
        lecture_id: `LEC_${courseId}_1_completed`,
        lecture_title: 'Introduction to Programming Concepts',
        course_id: courseId,
        class_start: new Date('2024-09-20T10:00:00Z'),
        class_end: new Date('2024-09-20T11:30:00Z'),
        lec_num: 1,
        query_id: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
        joined_students: ['STU001', 'STU002', 'STU003', 'STU004', 'STU005'],
        teacher_id: teacher.teacher_id
      },
      {
        lecture_id: `LEC_${courseId}_2_completed`,
        lecture_title: 'Variables and Data Types',
        course_id: courseId,
        class_start: new Date('2024-09-22T10:00:00Z'),
        class_end: new Date('2024-09-22T11:30:00Z'),
        lec_num: 2,
        query_id: ['Q6', 'Q7', 'Q8'],
        joined_students: ['STU001', 'STU002', 'STU003'],
        teacher_id: teacher.teacher_id
      },
      {
        lecture_id: `LEC_${courseId}_3_completed`,
        lecture_title: 'Control Structures - Loops and Conditions',
        course_id: courseId,
        class_start: new Date('2024-09-25T10:00:00Z'),
        class_end: new Date('2024-09-25T11:30:00Z'),
        lec_num: 3,
        query_id: ['Q9', 'Q10', 'Q11', 'Q12'],
        joined_students: ['STU001', 'STU002', 'STU003', 'STU004'],
        teacher_id: teacher.teacher_id
      }
    ];

    // Add lectures to database
    for (const lectureData of testLectures) {
      const existingLecture = await Lecture.findOne({ lecture_id: lectureData.lecture_id });
      if (existingLecture) {
        console.log('Lecture already exists:', lectureData.lecture_title);
        continue;
      }

      const lecture = new Lecture(lectureData);
      await lecture.save();
      console.log('✅ Added lecture:', lectureData.lecture_title);
    }

    console.log('\n🎉 Test lectures added successfully!');
    console.log('Now try clicking "Completed Lectures" in the teacher dashboard.');
    
  } catch (error) {
    console.error('Error adding test lectures:', error);
  } finally {
    mongoose.connection.close();
  }
}
