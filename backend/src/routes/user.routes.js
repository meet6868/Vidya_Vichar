const express = require('express');
const router = express.Router();

const studentController = require('../controllers/student.controller');
const teacherController = require('../controllers/teacher.controller');
const { authenticate } = require('../controllers/auth.controller');


// Student Dashboard Routes
//GET
router.get('/student/dashboard/overview', authenticate(['student']), studentController.getStudentOverview);
router.get('/student/dashboard/enrolled-courses', authenticate(['student']), studentController.getEnrolledCourses);
router.get('/student/dashboard/pending-courses', authenticate(['student']), studentController.getPendingCourses);
router.get('/student/dashboard/all-courses', authenticate(['student']), studentController.getCoursesForStudents);
router.get('/student/dashboard/all-lectures', authenticate(['student']), studentController.getStudentLectures);
router.get('/student/dashboard/prev-lectures', authenticate(['student']), studentController.getPrevStudentLectures);
router.get('/student/dashboard/all-questions', authenticate(['student']), studentController.getAllQuestions);
router.get('/student/dashboard/my-questions', authenticate(['student']), studentController.getMyQuestions);
//POST
router.post('/student/dashboard/join-course', authenticate(['student']), studentController.joinCourse);
router.post('/student/dashboard/join-class', authenticate(['student']), studentController.joinLecture);
router.post('/student/dashboard/ask-question', authenticate(['student']), studentController.askQuestion);
router.post('/student/dashboard/answer-question', authenticate(['student']), studentController.answerQuestion);



// Teacher Dashboard Routes
router.get('/teacher/dashboard/overview', authenticate(['teacher']), teacherController.getTeacherOverview);
router.get('/teacher/dashboard/profile', authenticate(['teacher']), teacherController.getTeacherProfile);
router.put('/teacher/dashboard/profile', authenticate(['teacher']), teacherController.updateTeacherProfile);
router.post('/teacher/dashboard/create-course', authenticate(['teacher']), teacherController.createCourse);
router.get('/teacher/dashboard/your-courses', authenticate(['teacher']), teacherController.getYourCourses);
router.get('/teacher/dashboard/course/:courseId', authenticate(['teacher']), teacherController.getTeacherCourseDetails);
router.post('/teacher/dashboard/create-class', authenticate(['teacher']), teacherController.createClass);
router.get('/teacher/dashboard/class-page/:classId', authenticate(['teacher']), teacherController.getClassPage);
router.get('/teacher/dashboard/joined-students/:classId', authenticate(['teacher']), teacherController.getJoinedStudents);
router.get('/teacher/dashboard/doubts-tabs/all', authenticate(['teacher']), teacherController.getAllDoubtsForTeacher);
router.get('/teacher/dashboard/doubts-tabs/unanswered', authenticate(['teacher']), teacherController.getUnansweredDoubts);
router.get('/teacher/dashboard/doubts-tabs/answered', authenticate(['teacher']), teacherController.getAnsweredDoubtsForTeacher);
router.post('/teacher/dashboard/end-class/:classId', authenticate(['teacher']), teacherController.endClass);


module.exports = router;