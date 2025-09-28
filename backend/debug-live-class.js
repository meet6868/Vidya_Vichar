const mongoose = require('mongoose');
const Teacher = require('./src/models/Teachers');
const Lecture = require('./src/models/Lecture');

const DB_URI = 'mongodb://localhost:27017/vidya_vichar';

async function debugLiveClasses() {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        // First, let's check what's in the Teachers collection
        console.log('\n=== CHECKING TEACHERS COLLECTION ===');
        const teachers = await Teacher.find({}).limit(5);
        console.log(`Found ${teachers.length} teachers`);
        teachers.forEach(teacher => {
            console.log(`- Teacher: ${teacher.name} (${teacher.teacher_id}) | _id: ${teacher._id}`);
        });

        // Check for the specific teacher ID from JWT
        const jwtTeacherId = '68d94afde4e2052d71609c6d';
        console.log(`\n=== LOOKING FOR TEACHER WITH ID: ${jwtTeacherId} ===`);
        const specificTeacher = await Teacher.findById(jwtTeacherId);
        console.log('Teacher found:', specificTeacher ? {
            _id: specificTeacher._id,
            name: specificTeacher.name,
            teacher_id: specificTeacher.teacher_id
        } : 'NOT FOUND');

        // Also check for teacher with teacher_id "TEST_TEACHER_001"
        console.log(`\n=== LOOKING FOR TEACHER WITH teacher_id: TEST_TEACHER_001 ===`);
        const testTeacher = await Teacher.findOne({ teacher_id: "TEST_TEACHER_001" });
        console.log('Test teacher found:', testTeacher ? {
            _id: testTeacher._id,
            name: testTeacher.name,
            teacher_id: testTeacher.teacher_id
        } : 'NOT FOUND');

        // Check lectures collection
        console.log('\n=== CHECKING LECTURES COLLECTION ===');
        const lectures = await Lecture.find({}).limit(5);
        console.log(`Found ${lectures.length} lectures`);
        lectures.forEach(lecture => {
            console.log(`- Lecture: ${lecture.lecture_title} (${lecture.course_id}) | teacher_id: ${lecture.teacher_id}`);
        });

        // If we found the teacher, let's look for their lectures
        if (specificTeacher) {
            console.log(`\n=== CHECKING LECTURES FOR TEACHER: ${specificTeacher.teacher_id} ===`);
            const teacherLectures = await Lecture.find({ teacher_id: specificTeacher.teacher_id });
            console.log(`Found ${teacherLectures.length} lectures for this teacher`);
            teacherLectures.forEach(lecture => {
                console.log(`- ${lecture.lecture_title} | Start: ${lecture.class_start} | End: ${lecture.class_end} | Ended: ${lecture.is_teacher_ended}`);
            });

            // Check for live lectures
            const now = new Date();
            console.log(`\nCurrent time: ${now}`);
            const liveLectures = await Lecture.find({
                teacher_id: specificTeacher.teacher_id,
                class_start: { $lte: now },
                is_teacher_ended: { $ne: true }
            });
            console.log(`Found ${liveLectures.length} live lectures`);
        }

        console.log('\n=== DEBUG COMPLETE ===');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

debugLiveClasses();
