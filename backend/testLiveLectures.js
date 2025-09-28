const mongoose = require('mongoose');
const Lecture = require('./src/models/Lecture');
require('dotenv').config();

const testLiveLectures = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vidyavichar');
    console.log('✅ Connected to database');

    // Create some test live lectures
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later

    const testLectures = [
      {
        lecture_id: 'LIVE_TEST_001',
        lecture_title: 'Advanced Database Concepts - Live',
        course_id: 'CS103',
        teacher_id: 'TEST_TEACHER_001',
        class_start: oneHourAgo,
        class_end: oneHourLater,
        lec_num: 7,
        joined_students: ['student1', 'student2'],
        is_teacher_ended: false
      },
      {
        lecture_id: 'LIVE_TEST_002', 
        lecture_title: 'Data Structures - Live Session',
        course_id: 'CS104',
        teacher_id: 'TEST_TEACHER_001',
        class_start: oneHourAgo,
        class_end: oneHourLater,
        lec_num: 3,
        joined_students: ['student3'],
        is_teacher_ended: false
      }
    ];

    // Delete any existing test lectures first
    await Lecture.deleteMany({ lecture_id: { $in: ['LIVE_TEST_001', 'LIVE_TEST_002'] } });
    console.log('🧹 Cleaned up old test lectures');

    // Insert new test lectures
    await Lecture.insertMany(testLectures);
    console.log('✅ Created test live lectures');

    // Verify they were created
    const liveLectures = await Lecture.find({
      class_start: { $lte: now },
      class_end: { $gte: now },
      is_teacher_ended: { $ne: true }
    });

    console.log(`📊 Found ${liveLectures.length} live lectures:`);
    liveLectures.forEach(lecture => {
      console.log(`- ${lecture.lecture_title} (${lecture.course_id}) - ${lecture.lecture_id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLiveLectures();
