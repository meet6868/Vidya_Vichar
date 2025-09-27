const express = require('express');
const router = express.Router();

const studentController = require('../controllers/student.controller');
const teacherController = require('../controllers/teacher.controller');
const { authenticate } = require('../controllers/auth.controller');


// Student Dashboard Routes
router.get('/student/dashboard/overview', authenticate(['student']), studentController.getStudentOverview);
router.get('/student/dashboard/enrolled-courses', authenticate(['student']), studentController.getEnrolledCourses);
router.get('/student/dashboard/pending-courses', authenticate(['student']), studentController.getPendingCourses);
router.get('/student/dashboard/classes', authenticate(['student']), studentController.getStudentClasses);
router.post('/student/dashboard/join-class', authenticate(['student']), studentController.joinClass);
router.post('/student/dashboard/ask-doubt', authenticate(['student']), studentController.askDoubt);
router.get('/student/dashboard/all-doubts', authenticate(['student']), studentController.getAllDoubts);
router.get('/student/dashboard/answered-doubts', authenticate(['student']), studentController.getAnsweredDoubts);
router.post('/student/dashboard/join-course', authenticate(['student']), studentController.joinCourse);
router.get('/student/dashboard/available-courses', authenticate(['student']), studentController.getAvailableCourses);


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