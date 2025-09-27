// Teacher Controller for handling teacher-specific operations
const Teacher = require('../models/Teachers');
const Student = require('../models/Students');
const Course = require('../models/Courses');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Lecture = require('../models/Lecture');

const teacherController = {
  // Get teacher dashboard overview
  getTeacherOverview: async (req, res) => {
    try {
      const teacherId = req.user.id; // From JWT token
      
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Get teacher's courses
      const courses = await Course.find({ teacher_id: teacherId });
      
      // Get total students across all courses
      const totalStudents = await Student.find({ 
        courses_id: { $in: teacher.courses_id }
      }).countDocuments();
      
      // Get pending questions
      const pendingQuestions = await Question.find({ 
        course_id: { $in: teacher.courses_id },
        is_answered: false 
      }).countDocuments();

      res.status(200).json({
        success: true,
        data: {
          teacher: {
            teacher_id: teacher.teacher_id,
            username: teacher.username,
            courses_count: courses.length
          },
          stats: {
            activeCourses: courses.length,
            totalStudents,
            pendingQuestions,
            assignmentsToGrade: 12 // Mock data for now
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

  // Get teacher profile
  getTeacherProfile: async (req, res) => {
    try {
      const teacherId = req.user.id;
      
      const teacher = await Teacher.findById(teacherId).select('-password');
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          teacher: {
            id: teacher._id,
            teacher_id: teacher.teacher_id,
            username: teacher.username,
            courses_id: teacher.courses_id
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

  // Update teacher profile
  updateTeacherProfile: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const updates = req.body;

      // Remove sensitive fields from updates
      delete updates.password;
      delete updates.teacher_id;

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        updates,
        { new: true }
      ).select('-password');

      if (!updatedTeacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          teacher: updatedTeacher
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

  // Create course
  createCourse: async (req, res) => {
    try {
      const { course_name, course_code, description, schedule } = req.body;
      const teacherId = req.user.id;

      const newCourse = new Course({
        course_name,
        course_code,
        description,
        teacher_id: teacherId,
        schedule,
        students_enrolled: []
      });

      await newCourse.save();

      // Add course to teacher's courses
      await Teacher.findByIdAndUpdate(
        teacherId,
        { $push: { courses_id: newCourse._id } }
      );

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: {
          course: {
            id: newCourse._id,
            course_name: newCourse.course_name,
            course_code: newCourse.course_code,
            description: newCourse.description
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

  // Get teacher's courses
  getYourCourses: async (req, res) => {
    try {
      const teacherId = req.user.id;
      
      const courses = await Course.find({ teacher_id: teacherId });

      res.status(200).json({
        success: true,
        data: {
          courses: courses.map(course => ({
            id: course._id,
            course_name: course.course_name,
            course_code: course.course_code,
            description: course.description,
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

  // Get teacher course details
  getTeacherCourseDetails: async (req, res) => {
    try {
      const { courseId } = req.params;
      const teacherId = req.user.id;

      const course = await Course.findOne({ 
        _id: courseId, 
        teacher_id: teacherId 
      }).populate('students_enrolled', 'name roll_no branch batch');

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or unauthorized'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          course: {
            id: course._id,
            course_name: course.course_name,
            course_code: course.course_code,
            description: course.description,
            schedule: course.schedule,
            students: course.students_enrolled
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

  // Create class/lecture
  createClass: async (req, res) => {
    try {
      const { lecture_title, course_id, scheduled_time, duration } = req.body;
      const teacherId = req.user.id;

      // Verify course belongs to teacher
      const course = await Course.findOne({ _id: course_id, teacher_id: teacherId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or unauthorized'
        });
      }

      const newLecture = new Lecture({
        lecture_title,
        course_id,
        teacher_id: teacherId,
        scheduled_time,
        duration,
        is_live: false,
        joined_students: []
      });

      await newLecture.save();

      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: {
          lecture: {
            id: newLecture._id,
            lecture_title: newLecture.lecture_title,
            course_id: newLecture.course_id,
            scheduled_time: newLecture.scheduled_time,
            duration: newLecture.duration
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

  // Get class page details
  getClassPage: async (req, res) => {
    try {
      const { classId } = req.params;
      const teacherId = req.user.id;

      const lecture = await Lecture.findOne({ 
        _id: classId, 
        teacher_id: teacherId 
      })
      .populate('course_id', 'course_name course_code')
      .populate('joined_students', 'name roll_no');

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Class not found or unauthorized'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          lecture: {
            id: lecture._id,
            lecture_title: lecture.lecture_title,
            course: lecture.course_id,
            scheduled_time: lecture.scheduled_time,
            duration: lecture.duration,
            is_live: lecture.is_live,
            joined_students: lecture.joined_students,
            joined_count: lecture.joined_students.length
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

  // Get joined students
  getJoinedStudents: async (req, res) => {
    try {
      const { classId } = req.params;
      const teacherId = req.user.id;

      const lecture = await Lecture.findOne({ 
        _id: classId, 
        teacher_id: teacherId 
      }).populate('joined_students', 'name roll_no branch batch');

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Class not found or unauthorized'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          students: lecture.joined_students,
          count: lecture.joined_students.length
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

  // Get all doubts for teacher
  getAllDoubtsForTeacher: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const teacher = await Teacher.findById(teacherId);

      const questions = await Question.find({ 
        course_id: { $in: teacher.courses_id }
      })
      .populate('student_id', 'name roll_no')
      .populate('course_id', 'course_name course_code');

      res.status(200).json({
        success: true,
        data: {
          questions: questions.map(question => ({
            id: question._id,
            question_text: question.question_text,
            student: question.student_id,
            course: question.course_id,
            is_answered: question.is_answered,
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

  // Get unanswered doubts
  getUnansweredDoubts: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const teacher = await Teacher.findById(teacherId);

      const questions = await Question.find({ 
        course_id: { $in: teacher.courses_id },
        is_answered: false
      })
      .populate('student_id', 'name roll_no')
      .populate('course_id', 'course_name course_code');

      res.status(200).json({
        success: true,
        data: {
          questions: questions.map(question => ({
            id: question._id,
            question_text: question.question_text,
            student: question.student_id,
            course: question.course_id,
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

  // Get answered doubts for teacher
  getAnsweredDoubtsForTeacher: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const teacher = await Teacher.findById(teacherId);

      const questions = await Question.find({ 
        course_id: { $in: teacher.courses_id },
        is_answered: true
      })
      .populate('student_id', 'name roll_no')
      .populate('course_id', 'course_name course_code')
      .populate('answers');

      res.status(200).json({
        success: true,
        data: {
          questions: questions.map(question => ({
            id: question._id,
            question_text: question.question_text,
            student: question.student_id,
            course: question.course_id,
            answers: question.answers,
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

  // End class
  endClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const teacherId = req.user.id;

      const lecture = await Lecture.findOneAndUpdate(
        { _id: classId, teacher_id: teacherId },
        { is_live: false },
        { new: true }
      );

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Class not found or unauthorized'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Class ended successfully',
        data: {
          lecture: {
            id: lecture._id,
            is_live: lecture.is_live,
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
  }
};

module.exports = teacherController;