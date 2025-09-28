const express = require('express');
const router = express.Router();

const studentController = require('../controllers/student.controller');
const teacherController = require('../controllers/teacher.controller');
const resourceController = require('../controllers/resource.controller');
const { authenticate } = require('../controllers/auth.controller');


// Student Dashboard Routes
//GET
router.get('/student/dashboard/overview', authenticate(['student']), studentController.getStudentOverview);
router.get('/student/dashboard/enrolled-courses', authenticate(['student']), studentController.getEnrolledCourses);
router.get('/student/dashboard/pending-courses', authenticate(['student']), studentController.getPendingCourses);
router.get('/student/dashboard/all-courses', authenticate(['student']), studentController.getCoursesForStudents);
router.get('/student/dashboard/all-lectures', authenticate(['student']), studentController.getStudentLectures);
router.get('/student/dashboard/course-lectures/:courseId', authenticate(['student']), studentController.getCourseLectures);
router.get('/student/dashboard/lecture-doubts/:lectureId', authenticate(['student']), studentController.getLectureDoubts);
router.get('/student/dashboard/prev-lectures', authenticate(['student']), studentController.getPrevStudentLectures);
router.get('/student/dashboard/all-questions', authenticate(['student']), studentController.getAllQuestions);
router.get('/student/dashboard/my-questions', authenticate(['student']), studentController.getMyQuestions);
// Join Class Routes
router.get('/student/dashboard/available-classes', authenticate(['student']), studentController.getAvailableClasses);
router.get('/student/dashboard/lecture-questions/:lectureId', authenticate(['student']), studentController.getLectureQuestions);
router.get('/student/dashboard/course-info/:courseId', authenticate(['student']), studentController.getCourseInfo);
//POST
router.post('/student/dashboard/join-course', authenticate(['student']), studentController.joinCourse);
router.post('/student/dashboard/join-class', authenticate(['student']), studentController.joinLecture);
router.post('/student/dashboard/ask-question', authenticate(['student']), studentController.askQuestion);
router.post('/student/dashboard/answer-question', authenticate(['student']), studentController.answerQuestion);



// Teacher Dashboard Overview and Profile
router.get('/teacher/dashboard/overview', authenticate(['teacher']), teacherController.getTeacherOverview);
router.get('/teacher/courses/detailed', authenticate(['teacher']), teacherController.getTeacherCourses);
router.get('/teacher/all', authenticate(['teacher']), teacherController.getAllTeachers);
router.get('/teacher/:teacher_id', authenticate(['teacher']), teacherController.getTeacherByid);
router.get('/teacher/courses', authenticate(['teacher']), teacherController.getAllCourses);
router.get('/teacher/course/:course_id/pending-requests', authenticate(['teacher']), teacherController.getPendingRequests);
router.get('/teacher/course/:course_id/students', authenticate(['teacher']), teacherController.getAllStudents);
router.get('/teacher/course/:course_id/student/:student_id', authenticate(['teacher']), teacherController.getStudentById);
router.get('/teacher/lecture/:lecture_id/questions', authenticate(['teacher']), teacherController.getAllQuestions);
router.get('/teacher/question/:question_id/answers', authenticate(['teacher']), teacherController.getAllAnswers);
//PUT
router.put('/teacher/dashboard/profile', authenticate(['teacher']), teacherController.updateTeacherProfile);
//POST
router.post('/teacher/course', authenticate(['teacher']), teacherController.createCourse);
router.post('/teacher/lecture', authenticate(['teacher']), teacherController.createLecture);
router.post('/teacher/course/make-ta', authenticate(['teacher']), teacherController.makeStudentTA);
router.post('/teacher/course-request/:requestId/:action', authenticate(['teacher']), teacherController.handleCourseRequest);
router.post('/teacher/question/answer', authenticate(['teacher']), teacherController.answerQuestion);
router.post('/teacher/course/accept-requests', authenticate(['teacher']), teacherController.acceptPendingRequests);
router.post('/teacher/course/reject-requests', authenticate(['teacher']), teacherController.rejectPendingRequests);
//DELETE
router.delete('/teacher/course/:course_id/remove-student', authenticate(['teacher']), teacherController.removeStudentFromCourse);
router.delete('/teacher/lecture/:lecture_id', authenticate(['teacher']), teacherController.deleteLecture);
router.delete('/teacher/question/:question_id', authenticate(['teacher']), teacherController.deleteQuestion);
router.delete('/teacher/answer/:answer_id', authenticate(['teacher']), teacherController.deleteAnswer);

// Resource Management Routes (for both teachers and TAs)
// Teacher and TA routes
router.post('/resources/add', authenticate(['teacher', 'student']), resourceController.addResource);
router.get('/resources/course/:courseId', authenticate(['teacher', 'student']), resourceController.getCourseResources);
router.get('/resources/course/:courseId/lecture/:lectureId', authenticate(['teacher', 'student']), resourceController.getLectureResources);
router.put('/resources/:resourceId', authenticate(['teacher', 'student']), resourceController.updateResource);
router.delete('/resources/:resourceId', authenticate(['teacher', 'student']), resourceController.deleteResource);
router.get('/resources/course/:courseId/search', authenticate(['teacher', 'student']), resourceController.searchResources);


module.exports = router;