const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const studentController = require('../controllers/student.controller');
const teacherController = require('../controllers/teacher.controller');

// User profile routes (general)
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

// Student specific routes
router.get('/students', userController.getAllStudents);
router.get('/student/:id', userController.getStudentById);

// Teacher specific routes
router.get('/teachers', userController.getAllTeachers);
router.get('/teacher/:id', userController.getTeacherById);

// Student Dashboard Routes
router.get('/student/dashboard/overview', studentController.getStudentOverview);
router.get('/student/dashboard/enrolled-courses', studentController.getEnrolledCourses);
router.get('/student/dashboard/course/:courseId', studentController.getCourseDetails);
router.get('/student/dashboard/classes', studentController.getStudentClasses);
router.post('/student/dashboard/join-class', studentController.joinClass);
router.post('/student/dashboard/ask-doubt', studentController.askDoubt);
router.get('/student/dashboard/all-doubts', studentController.getAllDoubts);
router.get('/student/dashboard/answered-doubts', studentController.getAnsweredDoubts);
router.post('/student/dashboard/join-course', studentController.joinCourse);
router.get('/student/dashboard/available-courses', studentController.getAvailableCourses);

// Teacher Dashboard Routes
router.get('/teacher/dashboard/overview', teacherController.getTeacherOverview);
router.get('/teacher/dashboard/profile', teacherController.getTeacherProfile);
router.put('/teacher/dashboard/profile', teacherController.updateTeacherProfile);
router.post('/teacher/dashboard/create-course', teacherController.createCourse);
router.get('/teacher/dashboard/your-courses', teacherController.getYourCourses);
router.get('/teacher/dashboard/course/:courseId', teacherController.getTeacherCourseDetails);
router.post('/teacher/dashboard/create-class', teacherController.createClass);
router.get('/teacher/dashboard/class-page/:classId', teacherController.getClassPage);
router.get('/teacher/dashboard/joined-students/:classId', teacherController.getJoinedStudents);
router.get('/teacher/dashboard/doubts-tabs/all', teacherController.getAllDoubtsForTeacher);
router.get('/teacher/dashboard/doubts-tabs/unanswered', teacherController.getUnansweredDoubts);
router.get('/teacher/dashboard/doubts-tabs/answered', teacherController.getAnsweredDoubtsForTeacher);
router.post('/teacher/dashboard/end-class/:classId', teacherController.endClass);

module.exports = router;