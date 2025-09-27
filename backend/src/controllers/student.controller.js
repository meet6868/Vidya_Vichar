// Student Controller for handling student-specific operations
const Student = require('../models/Students');
const Course = require('../models/Courses');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Lecture = require('../models/Lecture');

const studentController = {
  // Get student dashboard overview
  getStudentOverview: async (req, res) => {
    try {
      const studentId = req.user.id; // From JWT token
      
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get enrolled courses count
      const enrolledCourses = await Course.find({ _id: { $in: student.courses_id } });
      
      // Get questions asked by student
      const questionsAsked = await Question.find({ student_id: studentId }).countDocuments();
      
      // Get answered questions
      const answeredQuestions = await Question.find({ 
        student_id: studentId,
        is_answered: true 
      }).countDocuments();

      res.status(200).json({
        success: true,
        data: {
          student: {
            name: student.name,
            roll_no: student.roll_no,
            batch: student.batch,
            branch: student.branch
          },
          stats: {
            enrolledCourses: enrolledCourses.length,
            questionsAsked,
            answeredQuestions,
            averageGrade: 4.5 // Mock data for now
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get enrolled courses
  getEnrolledCourses: async (req, res) => {
    try {
      const studentId = req.user.id;
      
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      const courses = await Course.find({ _id: { $in: student.courses_id } })
        .populate('teacher_id', 'name');

      res.status(200).json({
        success: true,
        data: {
          courses: courses.map(course => ({
            id: course._id,
            course_name: course.course_name,
            course_code: course.course_code,
            teacher: course.teacher_id?.name,
            schedule: course.schedule,
            students_enrolled: course.students_enrolled?.length || 0
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get course details
  getCourseDetails: async (req, res) => {
    try {
      const { courseId } = req.params;
      const studentId = req.user.id;

      const course = await Course.findById(courseId).populate('teacher_id', 'name');
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if student is enrolled
      const student = await Student.findById(studentId);
      const isEnrolled = student.courses_id.includes(courseId);

      res.status(200).json({
        success: true,
        data: {
          course: {
            id: course._id,
            course_name: course.course_name,
            course_code: course.course_code,
            description: course.description,
            teacher: course.teacher_id?.name,
            schedule: course.schedule,
            students_enrolled: course.students_enrolled?.length || 0,
            isEnrolled
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get student classes/lectures
  getStudentClasses: async (req, res) => {
    try {
      const studentId = req.user.id;
      
      const student = await Student.findById(studentId);
      const lectures = await Lecture.find({ 
        course_id: { $in: student.courses_id }
      }).populate('course_id', 'course_name course_code');

      res.status(200).json({
        success: true,
        data: {
          lectures: lectures.map(lecture => ({
            id: lecture._id,
            lecture_title: lecture.lecture_title,
            course_name: lecture.course_id?.course_name,
            course_code: lecture.course_id?.course_code,
            scheduled_time: lecture.scheduled_time,
            duration: lecture.duration,
            is_live: lecture.is_live
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Join a class
  joinClass: async (req, res) => {
    try {
      const { lectureId } = req.body;
      const studentId = req.user.id;

      const lecture = await Lecture.findById(lectureId);
      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found'
        });
      }

      // Add student to joined students if not already joined
      if (!lecture.joined_students.includes(studentId)) {
        lecture.joined_students.push(studentId);
        await lecture.save();
      }

      res.status(200).json({
        success: true,
        message: 'Successfully joined the class',
        data: {
          lecture: {
            id: lecture._id,
            lecture_title: lecture.lecture_title,
            joined_students_count: lecture.joined_students.length
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Ask a doubt/question
  askDoubt: async (req, res) => {
    try {
      const { question_text, course_id } = req.body;
      const studentId = req.user.id;

      const newQuestion = new Question({
        question_text,
        student_id: studentId,
        course_id,
        is_answered: false
      });

      await newQuestion.save();

      res.status(201).json({
        success: true,
        message: 'Question asked successfully',
        data: {
          question: {
            id: newQuestion._id,
            question_text: newQuestion.question_text,
            course_id: newQuestion.course_id,
            created_at: newQuestion.createdAt
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get all doubts by student
  getAllDoubts: async (req, res) => {
    try {
      const studentId = req.user.id;

      const questions = await Question.find({ student_id: studentId })
        .populate('course_id', 'course_name course_code')
        .populate('answers');

      res.status(200).json({
        success: true,
        data: {
          questions: questions.map(question => ({
            id: question._id,
            question_text: question.question_text,
            course: question.course_id?.course_name,
            course_code: question.course_id?.course_code,
            is_answered: question.is_answered,
            answers_count: question.answers?.length || 0,
            created_at: question.createdAt
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get answered doubts
  getAnsweredDoubts: async (req, res) => {
    try {
      const studentId = req.user.id;

      const questions = await Question.find({ 
        student_id: studentId,
        is_answered: true 
      })
      .populate('course_id', 'course_name course_code')
      .populate('answers');

      res.status(200).json({
        success: true,
        data: {
          questions: questions.map(question => ({
            id: question._id,
            question_text: question.question_text,
            course: question.course_id?.course_name,
            answers: question.answers?.map(answer => ({
              answer_text: answer.answer_text,
              teacher_id: answer.teacher_id,
              created_at: answer.createdAt
            })),
            created_at: question.createdAt
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Join a course
  joinCourse: async (req, res) => {
    try {
      const { courseId } = req.body;
      const studentId = req.user.id;

      const student = await Student.findById(studentId);
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if already enrolled
      if (student.courses_id.includes(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'Already enrolled in this course'
        });
      }

      // Add course to student
      student.courses_id.push(courseId);
      await student.save();

      // Add student to course
      if (!course.students_enrolled.includes(studentId)) {
        course.students_enrolled.push(studentId);
        await course.save();
      }

      res.status(200).json({
        success: true,
        message: 'Successfully joined the course',
        data: {
          course: {
            id: course._id,
            course_name: course.course_name,
            course_code: course.course_code
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get available courses
  getAvailableCourses: async (req, res) => {
    try {
      const studentId = req.user.id;
      const student = await Student.findById(studentId);

      // Get courses not enrolled by student
      const availableCourses = await Course.find({ 
        _id: { $nin: student.courses_id }
      }).populate('teacher_id', 'name');

      res.status(200).json({
        success: true,
        data: {
          courses: availableCourses.map(course => ({
            id: course._id,
            course_name: course.course_name,
            course_code: course.course_code,
            description: course.description,
            teacher: course.teacher_id?.name,
            students_enrolled: course.students_enrolled?.length || 0
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
};

module.exports = studentController;