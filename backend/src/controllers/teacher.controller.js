
// Teacher Controller for handling teacher-specific operations
const Teacher = require('../models/Teachers');
const Student = require('../models/Students');
const Course = require('../models/Courses');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Lecture = require('../models/Lecture');
const { answerQuestion } = require('./student.controller');

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

      // Find all courses taught by this teacher (by teacher.courses_id)
      const courses = await Course.find({ course_id: { $in: teacher.courses_id } });

      // Calculate total pending requests (sum of request_list lengths)
      let totalPendingRequests = 0;
      courses.forEach(course => {
        if (Array.isArray(course.request_list)) {
          totalPendingRequests += course.request_list.length;
        }
      });

      res.status(200).json({
        success: true,
        data: {
          teacher_id: teacher.teacher_id,
          username: teacher.username,
          name: teacher.name,
          courses_id: teacher.courses_id,
          total_pending_requests: totalPendingRequests
        }
      });
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  getAllTeachers: async (req, res) => {
    try {
      const teachers = await Teacher.find({}, 'name teacher_id');
      res.status(200).json({
        success: true,
        data: {
          teachers: teachers.map(t => ({
            name: t.name,
            teacher_id: t.teacher_id
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

  getTeacherByid: async (req, res) => {
    try {
      const teacher_id = req.params.teacher_id;
      if (!teacher_id) {
        return res.status(400).json({
          success: false,
          message: 'teacher_id is required.'
        });
      }
      const teacher = await Teacher.findOne({ teacher_id }, 'name teacher_id');
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found.'
        });
      }
      res.status(200).json({
        success: true,
        data: {
          name: teacher.name,
          teacher_id: teacher.teacher_id
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

  getAllCourses: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Find all courses where course_id is in teacher.courses_id
      const courses = await Course.find({ course_id: { $in: teacher.courses_id } }, 'course_id course_name');

      res.status(200).json({
        success: true,
        data: {
          courses: courses.map(course => ({
            course_id: course.course_id,
            course_name: course.course_name
          }))
        }
      });
    }
    catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get teacher's courses with detailed information for overview
  getTeacherCourses: async (req, res) => {
    try {
    console.log('�🔥 getLiveClasses: FUNCTION ENTRY - REQUEST RECEIVED 🔥🔥🔥');
    console.log('🔍 JWT req.user:', req.user);
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Request query:', req.query);
    console.log('🔍 Looking for teacher with ID:', req.user ? req.user.id : 'NO REQ.USER');      const teacherId = req.user.id;
      console.log('🔍 Teacher ID from JWT:', teacherId);
      
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        console.log('🔍 Teacher not found in database');
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      console.log('🔍 Teacher found:', teacher.name, 'Courses:', teacher.courses_id);

      // Find all courses where course_id is in teacher.courses_id with full details
      const courses = await Course.find({ course_id: { $in: teacher.courses_id } });
      console.log('🔍 Courses found:', courses.length);

      // Format courses for frontend with additional information
      const formattedCourses = courses.map(course => ({
        course_id: course.course_id,
        course_name: course.course_name,
        description: course.description || 'No description available',
        batch: course.batch || 'Not specified',
        branch: course.branch || 'Not specified',
        students_enrolled: Array.isArray(course.student_list) ? course.student_list.length : 0,
        pending_requests: Array.isArray(course.request_list) ? course.request_list.length : 0,
        created_at: course.createdAt || new Date()
      }));

      console.log('🔍 Formatted courses:', formattedCourses);

      res.status(200).json({
        success: true,
        data: formattedCourses
      });
    }
    catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  getPendingRequests: async (req, res) => {
    try {
      const course_id = req.params.course_id;
      if (!course_id) {
        return res.status(400).json({
          success: false,
          message: 'course_id is required as a URL parameter.'
        });
      }

      // Find the course by course_id
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.'
        });
      }

      // Get all students whose _id is in course.request_list
      const students = await Student.find({ _id: { $in: course.request_list } }, 'name _id');

      res.status(200).json({
        success: true,
        data: {
          pending_students: students.map(s => ({
            id: s._id,
            name: s.name
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

  // Update teacher profile
  updateTeacherProfile: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const { name, username } = req.body;

      // Only allow updating name and username
      const updateFields = {};
      if (name) updateFields.name = name;
      if (username) updateFields.username = username;

      // Check for uniqueness of username and name if being updated
      if (username) {
        const existing = await Teacher.findOne({ username, _id: { $ne: teacherId } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'Username already in use.'
          });
        }
          
      }
      if (name) {
        const existing = await Teacher.findOne({ name, _id: { $ne: teacherId } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'Name already in use.'
          });
        }
      }

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        updateFields,
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
      const { course_id, course_name, batch, branch, valid_time, teacher_ids } = req.body;
      const mainTeacher = await Teacher.findById(req.user.id);
      if (!mainTeacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Combine main teacher and additional teacher_ids (ensure uniqueness)
      let allTeacherIds = [mainTeacher.teacher_id];
      if (Array.isArray(teacher_ids)) {
        allTeacherIds = Array.from(new Set([mainTeacher.teacher_id, ...teacher_ids]));
      }

      // Create new course with all teachers
      const newCourse = new Course({
        course_id,
        course_name,
        teacher_id: allTeacherIds,
        batch,
        branch,
        valid_time,
        request_list: [],
        student_list: [],
        lecture_id: []
      });

      await newCourse.save();

      // Add course_id to each teacher's courses_id array
      const teachersToUpdate = await Teacher.find({ teacher_id: { $in: allTeacherIds } });
      for (const t of teachersToUpdate) {
        if (!t.courses_id.includes(course_id)) {
          t.courses_id.push(course_id);
          await t.save();
        }
      }

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: {
          course: {
            course_id: newCourse.course_id,
            course_name: newCourse.course_name,
            batch: newCourse.batch,
            branch: newCourse.branch,
            valid_time: newCourse.valid_time,
            teacher_id: newCourse.teacher_id
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
  createLecture: async (req, res) => {
    try {
      const { course_id, class_start, class_end, lecture_title } = req.body;

      if (!lecture_title || typeof lecture_title !== 'string' || !lecture_title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'lecture_title is required.'
        });
      }
      const teacher = await Teacher.findById(req.user.id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Verify course exists and teacher is assigned
      const course = await Course.findOne({ course_id, teacher_id: { $in: [teacher.teacher_id] } });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or unauthorized'
        });
      }


      // Validate class_start and class_end
      if (new Date(class_start) >= new Date(class_end)) {
        return res.status(400).json({
          success: false,
          message: 'class_start must be before class_end.'
        });
      }

      // Find the current max lec_num for this course and increment
      const lastLecture = await Lecture.find({ course_id }).sort({ lec_num: -1 }).limit(1);
      let nextLecNum = 1;
      if (lastLecture.length > 0 && lastLecture[0].lec_num) {
        nextLecNum = lastLecture[0].lec_num + 1;
      }

      // Generate a unique lecture_id that includes the course_id
      let uniqueLectureId;
      let isUnique = false;
      // Sanitize course_id for use in ID (remove spaces, special chars)
      const safeCourseId = String(course_id).replace(/[^a-zA-Z0-9]/g, '');
      const generateLectureId = () => `LEC_${safeCourseId}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      while (!isUnique) {
        uniqueLectureId = generateLectureId();
        const existing = await Lecture.findOne({ lecture_id: uniqueLectureId });
        if (!existing) isUnique = true;
      }


      // Create new lecture with auto-incremented lec_num
      const newLecture = new Lecture({
        lecture_id: uniqueLectureId,
        lecture_title,
        course_id,
        class_start,
        class_end,
        lec_num: nextLecNum,
        query_id: [],
        joined_students: [],
        teacher_id: teacher.teacher_id
      });
      await newLecture.save();

      // Add lecture_id to course's lecture_id array
      course.lecture_id.push(uniqueLectureId);
      await course.save();

      res.status(201).json({
        success: true,
        message: 'Lecture created successfully',
        data: {
          lecture: {
            lecture_id: newLecture.lecture_id,
            course_id: newLecture.course_id,
            class_start: newLecture.class_start,
            class_end: newLecture.class_end,
            lec_num: newLecture.lec_num
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

  getAllStudents: async (req, res) => {
    try {
      const { course_id } = req.params;
      if (!course_id) {
        return res.status(400).json({
          success: false,
          message: 'course_id is required as a URL parameter.'
        });
      }

      // Find the course by course_id
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.'
        });
      }

      // Get all students whose _id is in course.student_list
      const students = await Student.find({ _id: { $in: course.student_list } }, 'name _id');

      // Mark TA status for each student (if their _id is in course.TA)
      const taSet = new Set((course.TA || []).map(id => String(id)));

      res.status(200).json({
        success: true,
        data: {
          students: students.map(s => ({
            id: s._id,
            name: s.name,
            is_TA: taSet.has(String(s._id))
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

  getStudentById: async (req, res) => {
    try {
      const { course_id, student_id } = req.params;
      if (!course_id || !student_id) {
        return res.status(400).json({
          success: false,
          message: 'course_id and student_id are required as URL parameters.'
        });
      }

      // Find the course by course_id
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.'
        });
      }

      // Check if student_id is in course.student_list
      if (!course.student_list.includes(student_id)) {
        return res.status(404).json({
          success: false,
          message: 'Student not found in this course.'
        });
      }

      // Find the student by _id
      const student = await Student.findById(student_id, 'name _id');
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: student._id,
          name: student.name
        }
      });
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  getAllQuestions: async (req, res) => {
    try {
      const lectureId = req.params.lecture_id;
      console.log('🔍 getAllQuestions: lectureId from params:', lectureId);
      
      if (!lectureId) {
        return res.status(400).json({
          success: false,
          message: 'lecture_id is required in req.user'
        });
      }

      // First, find the lecture using the custom lecture_id
      const lecture = await Lecture.findOne({ lecture_id: lectureId });
      
      console.log('🔍 getAllQuestions: Found lecture:', lecture ? lecture.lecture_id : 'Not found');
      
      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found'
        });
      }

      // Find all questions for this lecture using the lecture's MongoDB ObjectId
      // Questions store lecture_id as the MongoDB ObjectId string
      const questions = await Question.find({ 
        lecture_id: lecture._id.toString()
      }).populate('answer');
      
      console.log('🔍 getAllQuestions: Found questions:', questions.length);

      res.status(200).json({
        success: true,
        data: {
          questions: questions.map(q => ({
            question_id: q.question_id,
            question_text: q.question_text,
            student_id: q.student_id,
            lecture_id: q.lecture_id,
            timestamp: q.timestamp,
            is_answered: q.is_answered,
            is_important: q.is_important,
            upvotes: q.upvotes,
            upvoted_by: q.upvoted_by,
            answer: (q.answer || []).map(a => ({
              answer_id: a._id,
              answerer_name: a.answerer_name,
              answer: a.answer,
              answer_type: a.answer_type
            }))
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

  makeStudentTA: async (req, res) => {//POST type
    try {
      const { student_id, course_id } = req.body;
      if (!student_id || !course_id) {
        return res.status(400).json({
          success: false,
          message: 'student_id and course_id are required in the request body.'
        });
      }

      // Find the student
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found.'
        });
      }

      // Find the course
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.'
        });
      }

      // Add course_id to student's is_TA array if not already present
      if (!student.is_TA.includes(course_id)) {
        student.is_TA.push(course_id);
        await student.save();
      }

      // Add student_id to course.TA array if not already present
      if (!course.TA) course.TA = [];
      if (!course.TA.map(id => String(id)).includes(String(student._id))) {
        course.TA.push(student._id);
        await course.save();
      }

      res.status(200).json({
        success: true,
        message: 'Student is now a TA for the course.',
        data: {
          student_id: student._id,
          is_TA: student.is_TA,
          course_TA: course.TA
        }
      });
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  answerQuestion: async (req, res) => {
    try {
      console.log('🔍 answerQuestion: Request body:', req.body);
      console.log('🔍 answerQuestion: User:', req.user);
      
      const { question_id, answer_text, answer_type } = req.body;
      const teacherId = req.user.id;

      console.log('🔍 answerQuestion: Looking for teacher with ID:', teacherId);

      // Find teacher
      const teacher = await Teacher.findById(teacherId);
      console.log('🔍 answerQuestion: Teacher found:', !!teacher);
      if (!teacher) {
        console.log('❌ answerQuestion: Teacher not found');
        return res.status(404).json({ success: false, message: 'Teacher not found.' });
      }

      console.log('🔍 answerQuestion: Looking for question with ID:', question_id);
      
      // Find question
      const question = await Question.findOne({ question_id });
      console.log('🔍 answerQuestion: Question found:', !!question);
      if (!question) {
        console.log('❌ answerQuestion: Question not found');
        return res.status(404).json({ success: false, message: 'Question not found.' });
      }

      console.log('🔍 answerQuestion: Creating answer...');
      
      // Create answer
      const newAnswer = new Answer({
        answerer_name: teacher.name,
        answer: answer_text,
        answer_type
      });
      
      console.log('🔍 answerQuestion: Saving answer...');
      await newAnswer.save();
      console.log('🔍 answerQuestion: Answer saved:', newAnswer._id);

      // Link answer to question
      if (!Array.isArray(question.answer)) question.answer = [];
      question.answer.push(newAnswer._id);
      question.is_answered = true;
      
      console.log('🔍 answerQuestion: Updating question...');
      await question.save();
      console.log('🔍 answerQuestion: Question updated successfully');

      res.status(201).json({
        success: true,
        message: 'Answer submitted successfully',
        data: {
          answer: {
            answer_id: newAnswer._id,
            answerer_name: newAnswer.answerer_name,
            answer: newAnswer.answer,
            answer_type: newAnswer.answer_type
          }
        }
      });
    } catch (error) {
      console.error('❌ answerQuestion: Error occurred:', error);
      console.error('❌ answerQuestion: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },


  getAllAnswers: async (req, res) => {
    try {
      const { question_id } = req.params;
      if (!question_id) {
        return res.status(400).json({
          success: false,
          message: 'question_id is required as a URL parameter.'
        });
      }

      // Find the question and populate answers
      const question = await Question.findOne({ question_id }).populate('answer');
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found.'
        });
      }

      // Return all answer content
      res.status(200).json({
        success: true,
        data: {
          answers: (question.answer || []).map(ans => ({
            answer_id: ans._id,
            answerer_name: ans.answerer_name,
            answer: ans.answer,
            answer_type: ans.answer_type
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

  // Accept pending requests for a course
  acceptPendingRequests: async (req, res) => {
    try {
      const { course_id, student_ids } = req.body;
      if (!course_id || !Array.isArray(student_ids) || student_ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'course_id and student_ids (array) are required.'
        });
      }

      // Find the course
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.'
        });
      }

      // For each student: remove from request_list, add to student_list
      for (const studentId of student_ids) {
        // Remove from course.request_list if present
        const reqIdx = course.request_list.indexOf(studentId);
        if (reqIdx !== -1) course.request_list.splice(reqIdx, 1);
        // Add to course.student_list if not already present
        if (!course.student_list.includes(studentId)) course.student_list.push(studentId);

        // Update student model
        const student = await Student.findById(studentId);
        if (student) {
          // Remove course_id from courses_id_request
          const reqCourseIdx = student.courses_id_request.indexOf(course_id);
          if (reqCourseIdx !== -1) student.courses_id_request.splice(reqCourseIdx, 1);
          // Add course_id to courses_id_enrolled if not already present
          if (!student.courses_id_enrolled.includes(course_id)) student.courses_id_enrolled.push(course_id);
          await student.save();
        }
      }
      await course.save();

      res.status(200).json({
        success: true,
        message: 'Pending requests accepted and students enrolled.',
        data: {
          course_id,
          enrolled_students: student_ids
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

    // Reject pending requests for a course
  rejectPendingRequests: async (req, res) => {
    try {
      const { course_id, student_ids } = req.body;
      if (!course_id || !Array.isArray(student_ids) || student_ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'course_id and student_ids (array) are required.'
        });
      }

      // Find the course
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.'
        });
      }

      // For each student: remove from request_list (do not add to student_list)
      for (const studentId of student_ids) {
        // Remove from course.request_list if present
        const reqIdx = course.request_list.indexOf(studentId);
        if (reqIdx !== -1) course.request_list.splice(reqIdx, 1);

        // Update student model
        const student = await Student.findById(studentId);
        if (student) {
          // Remove course_id from courses_id_request
          const reqCourseIdx = student.courses_id_request.indexOf(course_id);
          if (reqCourseIdx !== -1) student.courses_id_request.splice(reqCourseIdx, 1);
          await student.save();
        }
      }
      await course.save();

      res.status(200).json({
        success: true,
        message: 'Pending requests rejected.',
        data: {
          course_id,
          rejected_students: student_ids
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

    // Remove a student from a course
  removeStudentFromCourse: async (req, res) => {
    try {
      const { course_id } = req.params;
      const { student_id } = req.body;
      if (!course_id || !student_id) {
        return res.status(400).json({ success: false, message: 'course_id and student_id are required.' });
      }
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }
      // Remove student from student_list
      course.student_list = course.student_list.filter(id => String(id) !== String(student_id));
      await course.save();
      // Remove course from student's enrolled list
      const student = await Student.findById(student_id);
      if (student) {
        student.courses_id_enrolled = student.courses_id_enrolled.filter(cid => cid !== course_id);
        await student.save();
      }
      res.status(200).json({ success: true, message: 'Student removed from course.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Delete a lecture
  deleteLecture: async (req, res) => {
    try {
      const { lecture_id } = req.params;
      if (!lecture_id) {
        return res.status(400).json({ success: false, message: 'lecture_id is required.' });
      }
      const lecture = await Lecture.findOneAndDelete({ lecture_id });
      if (!lecture) {
        return res.status(404).json({ success: false, message: 'Lecture not found.' });
      }
      // Remove lecture from course's lecture_id array
      await Course.updateOne({ course_id: lecture.course_id }, { $pull: { lecture_id: lecture_id } });
      res.status(200).json({ success: true, message: 'Lecture deleted.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Delete a question
  deleteQuestion: async (req, res) => {
    try {
      const { question_id } = req.params;
      if (!question_id) {
        return res.status(400).json({ success: false, message: 'question_id is required.' });
      }
      // Remove all answers associated with this question
      const question = await Question.findOne({ question_id });
      if (!question) {
        return res.status(404).json({ success: false, message: 'Question not found.' });
      }
      if (Array.isArray(question.answer) && question.answer.length > 0) {
        await Answer.deleteMany({ _id: { $in: question.answer } });
      }
      await Question.deleteOne({ question_id });
      res.status(200).json({ success: true, message: 'Question and its answers deleted.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Delete an answer
  deleteAnswer: async (req, res) => {
    try {
      const { answer_id } = req.params;
      if (!answer_id) {
        return res.status(400).json({ success: false, message: 'answer_id is required.' });
      }
      // Remove answer from all questions' answer arrays
      await Question.updateMany({ answer: answer_id }, { $pull: { answer: answer_id } });
      await Answer.deleteOne({ _id: answer_id });
      res.status(200).json({ success: true, message: 'Answer deleted.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Create a new course
  createCourse: async (req, res) => {
    try {
      const teacherId = req.user.id; // From JWT token
      const { course_id, course_name, batch, branch, valid_time, additional_teachers, tas } = req.body;

      // Validate required fields
      if (!course_id || !course_name || !batch || !branch || !valid_time) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: course_id, course_name, batch, branch, valid_time'
        });
      }

      // Check if course_id already exists
      const existingCourse = await Course.findOne({ course_id });
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: 'Course ID already exists'
        });
      }

      // Get the current teacher's details
      const currentTeacher = await Teacher.findById(teacherId);
      if (!currentTeacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Prepare teacher_id array (current teacher + additional teachers)
      let teacher_ids = [currentTeacher.teacher_id];
      if (additional_teachers && Array.isArray(additional_teachers)) {
        // Validate additional teachers exist
        for (const teacherId of additional_teachers) {
          const teacher = await Teacher.findOne({ teacher_id: teacherId });
          if (!teacher) {
            return res.status(400).json({
              success: false,
              message: `Teacher with ID ${teacherId} not found`
            });
          }
        }
        teacher_ids = [...teacher_ids, ...additional_teachers];
      }

      // Remove duplicates
      teacher_ids = [...new Set(teacher_ids)];

      // Create the new course
      const newCourse = new Course({
        course_id,
        course_name,
        teacher_id: teacher_ids,
        TA: tas && Array.isArray(tas) ? tas : [],
        batch,
        branch,
        valid_time: new Date(valid_time),
        request_list: [],
        student_list: [],
        lecture_id: []
      });

      const savedCourse = await newCourse.save();

      // Update all involved teachers' courses_id arrays
      await Teacher.updateMany(
        { teacher_id: { $in: teacher_ids } },
        { $addToSet: { courses_id: course_id } }
      );

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: {
          course_id: savedCourse.course_id,
          course_name: savedCourse.course_name,
          teacher_id: savedCourse.teacher_id,
          TA: savedCourse.TA,
          batch: savedCourse.batch,
          branch: savedCourse.branch,
          valid_time: savedCourse.valid_time
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

  // Handle course join request (accept/deny)
  handleCourseRequest: async (req, res) => {
    try {
      const { requestId, action } = req.params; // requestId is the student's _id, action is 'accept' or 'deny'
      const teacherId = req.user.id; // From JWT token

      // Validate action
      if (!['accept', 'deny'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be either "accept" or "deny"'
        });
      }

      // Find the student
      const student = await Student.findById(requestId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Find the course that has this student in its request_list
      const course = await Course.findOne({ request_list: requestId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'No pending request found for this student'
        });
      }

      // Verify the teacher has access to this course
      const teacher = await Teacher.findById(teacherId);
      if (!teacher || !teacher.courses_id.includes(course.course_id)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to manage this course'
        });
      }

      if (action === 'accept') {
        // Accept: Move student from request_list to student_list
        await Course.updateOne(
          { _id: course._id },
          { 
            $pull: { request_list: requestId },
            $addToSet: { student_list: requestId }
          }
        );

        // Update student: Move course from courses_id_request to courses_id_enrolled
        await Student.updateOne(
          { _id: requestId },
          { 
            $pull: { courses_id_request: course.course_id },
            $addToSet: { courses_id_enrolled: course.course_id }
          }
        );

        res.status(200).json({
          success: true,
          message: `Successfully accepted ${student.name}'s request to join ${course.course_name}`,
          action: 'accepted'
        });

      } else { // action === 'deny'
        // Deny: Remove student from request_list only
        await Course.updateOne(
          { _id: course._id },
          { $pull: { request_list: requestId } }
        );

        // Update student: Remove course from courses_id_request
        await Student.updateOne(
          { _id: requestId },
          { $pull: { courses_id_request: course.course_id } }
        );

        res.status(200).json({
          success: true,
          message: `Successfully denied ${student.name}'s request to join ${course.course_name}`,
          action: 'denied'
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get all completed lectures for teacher's courses
  getCompletedLectures: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Get all lectures for teacher's courses that have ended (class_end < now)
      const now = new Date();
      const lectures = await Lecture.find({
        course_id: { $in: teacher.courses_id },
        class_end: { $lt: now }
      }).sort({ class_end: -1 });

      // Get course details for each lecture
      const courses = await Course.find({ course_id: { $in: teacher.courses_id } });
      const courseMap = courses.reduce((acc, course) => {
        acc[course.course_id] = course;
        return acc;
      }, {});

      // Get question counts for each lecture dynamically from Question collection
      // Note: Questions reference lecture ObjectId, but we need to count by lecture_id string
      const questionCounts = await Question.aggregate([
        {
          $lookup: {
            from: 'lectures',
            let: { questionLectureId: '$lecture_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$questionLectureId' }]
                  },
                  course_id: { $in: teacher.courses_id }
                }
              }
            ],
            as: 'lecture'
          }
        },
        { $unwind: '$lecture' },
        { $group: { _id: '$lecture.lecture_id', count: { $sum: 1 } } }
      ]);
      
      // Create a map for quick lookup of question counts
      const questionCountMap = {};
      questionCounts.forEach(item => {
        questionCountMap[item._id] = item.count;
      });

      // Format lectures with course information and dynamic question counts
      const formattedLectures = lectures.map(lecture => ({
        lecture_id: lecture.lecture_id,
        lecture_title: lecture.lecture_title,
        course_id: lecture.course_id,
        course_name: courseMap[lecture.course_id]?.course_name || 'Unknown Course',
        class_start: lecture.class_start,
        class_end: lecture.class_end,
        lec_num: lecture.lec_num,
        students_attended: lecture.joined_students ? lecture.joined_students.length : 0,
        questions_count: questionCountMap[lecture.lecture_id] || 0
      }));

      res.status(200).json({
        success: true,
        data: formattedLectures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get completed lectures for a specific course
  getCourseCompletedLectures: async (req, res) => {
    try {
      const { course_id } = req.params;
      const teacherId = req.user.id;

      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Check if teacher teaches this course
      if (!teacher.courses_id.includes(course_id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not teaching this course.'
        });
      }

      // Get course details
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Get completed lectures for this course
      const now = new Date();
      const lectures = await Lecture.find({
        course_id,
        class_end: { $lt: now }
      }).sort({ class_end: -1 });

      // Get question counts for each lecture dynamically from Question collection
      // Note: Questions reference lecture ObjectId, but we need to count by lecture_id string
      const questionCounts = await Question.aggregate([
        {
          $lookup: {
            from: 'lectures',
            let: { questionLectureId: '$lecture_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$questionLectureId' }]
                  },
                  course_id: course_id
                }
              }
            ],
            as: 'lecture'
          }
        },
        { $unwind: '$lecture' },
        { $group: { _id: '$lecture.lecture_id', count: { $sum: 1 } } }
      ]);
      
      // Create a map for quick lookup of question counts
      const questionCountMap = {};
      questionCounts.forEach(item => {
        questionCountMap[item._id] = item.count;
      });

      // Format lectures with dynamic question counts
      const formattedLectures = lectures.map(lecture => ({
        lecture_id: lecture.lecture_id,
        lecture_title: lecture.lecture_title,
        course_id: lecture.course_id,
        course_name: course.course_name,
        class_start: lecture.class_start,
        class_end: lecture.class_end,
        lec_num: lecture.lec_num,
        students_attended: lecture.joined_students ? lecture.joined_students.length : 0,
        questions_count: questionCountMap[lecture.lecture_id] || 0
      }));

      res.status(200).json({
        success: true,
        data: {
          course: {
            course_id: course.course_id,
            course_name: course.course_name,
            description: course.description
          },
          lectures: formattedLectures
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

  // Get live/active classes for teacher
  getLiveClasses: async (req, res) => {
    console.log('�🔥🔥 getLiveClasses: FUNCTION ENTRY - REQUEST RECEIVED 🔥🔥🔥');
    console.log('🔍 JWT req.user:', req.user);
    console.log('🔍 Looking for teacher with ID:', req.user ? req.user.id : 'NO REQ.USER');
    
    if (!req.user || !req.user.id) {
      console.log('❌ No user or user ID in request');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - no user ID'
      });
    }
    
    try {
      let teacherId;
      let teacher = null;

      // Check if teacher_id is provided in request body or query params
      const providedTeacherId = req.body.teacher_id || req.query.teacher_id;
      
      if (providedTeacherId) {
        console.log('🔍 Using provided teacher_id:', providedTeacherId);
        teacherId = providedTeacherId;
        
        // Verify teacher exists in database
        teacher = await Teacher.findOne({ teacher_id: teacherId });
        if (teacher) {
          console.log('🔍 Teacher found by provided teacher_id:', teacher.name);
        } else {
          console.log('⚠️ Teacher not found in Teacher collection for provided teacher_id:', teacherId);
        }
      } else {
        // Fallback to JWT-based lookup
        console.log('🔍 No teacher_id provided, using JWT-based lookup');
        
        // Try to find teacher by MongoDB ObjectId first (for real JWT tokens)
        if (req.user.id.match(/^[0-9a-fA-F]{24}$/)) {
          console.log('🔍 Searching by ObjectId:', req.user.id);
          teacher = await Teacher.findById(req.user.id);
          if (teacher) {
            teacherId = teacher.teacher_id; // Use the teacher_id from Teacher document
            console.log('🔍 Teacher found by ObjectId:', teacher.name, 'teacher_id:', teacherId);
          } else {
            console.log('❌ No teacher found with ObjectId:', req.user.id);
            return res.status(404).json({
              success: false,
              message: 'Teacher not found.'
            });
          }
        } else {
          // If not ObjectId, try to find by teacher_id field (for mock tokens or string IDs)
          console.log('🔍 Searching by teacher_id field:', req.user.id);
          teacher = await Teacher.findOne({ teacher_id: req.user.id });
          if (teacher) {
            teacherId = teacher.teacher_id;
            console.log('🔍 Teacher found by teacher_id field:', teacher.name);
          } else {
            // If still not found, use the ID directly as fallback
            console.log('🔍 Teacher not found in Teacher collection, using req.user.id directly as teacher_id:', req.user.id);
            teacherId = req.user.id;
          }
        }
      }

      const now = new Date();
      console.log('🔍 Current time:', now);
      console.log('🔍 Final teacher_id for lecture search:', teacherId);

      // Find lectures that are currently active (started but not ended by teacher)
      const liveLectures = await Lecture.find({
        teacher_id: teacherId,
        class_start: { $lte: now },
        is_teacher_ended: { $ne: true }
      }).sort({ class_start: -1 });

      console.log('🔍 Found live lectures:', liveLectures.length);

      // Get course information for each lecture
      const liveClasses = await Promise.all(liveLectures.map(async (lecture) => {
        const course = await Course.findOne({ course_id: lecture.course_id });
        
        console.log(`🔍 Processing lecture: ${lecture.lecture_title} (${lecture.course_id})`);
        
        return {
          lecture_id: lecture.lecture_id,
          lecture_title: lecture.lecture_title,
          course_id: lecture.course_id,
          course_name: course ? course.course_name : lecture.course_id,
          class_start: lecture.class_start,
          class_end: lecture.class_end,
          lec_num: lecture.lec_num,
          students_joined: lecture.joined_students ? lecture.joined_students.length : 0,
          total_students: course ? course.student_list.length : 0,
          is_teacher_ended: lecture.is_teacher_ended || false,
          is_live: !lecture.is_teacher_ended,
          status: lecture.is_teacher_ended ? 'Ended by Teacher' : 'Available to Join'
        };
      }));

      console.log('🔍 Returning live classes:', liveClasses.length);
      
      res.status(200).json({
        success: true,
        message: 'Live classes retrieved successfully',
        data: liveClasses
      });
    } catch (error) {
      console.error('❌ Error in getLiveClasses:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // End lecture by teacher
  endLecture: async (req, res) => {
    try {
      const { lecture_id } = req.body;
      const teacherId = req.user.id;

      if (!lecture_id) {
        return res.status(400).json({
          success: false,
          message: 'lecture_id is required'
        });
      }

      // Find the lecture
      const lecture = await Lecture.findOne({ lecture_id });
      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found'
        });
      }

      // Verify teacher has permission to end this lecture
      let teacher = null;
      if (req.user.id.match(/^[0-9a-fA-F]{24}$/)) {
        teacher = await Teacher.findById(req.user.id);
        if (teacher && teacher.teacher_id !== lecture.teacher_id) {
          return res.status(403).json({
            success: false,
            message: 'You do not have permission to end this lecture'
          });
        }
      } else {
        // For mock tokens or string IDs
        if (req.user.id !== lecture.teacher_id) {
          return res.status(403).json({
            success: false,
            message: 'You do not have permission to end this lecture'
          });
        }
      }

      // End the lecture
      lecture.is_teacher_ended = true;
      lecture.teacher_ended_at = new Date();
      await lecture.save();

      res.status(200).json({
        success: true,
        message: 'Lecture ended successfully',
        data: {
          lecture_id: lecture.lecture_id,
          ended_at: lecture.teacher_ended_at
        }
      });
    } catch (error) {
      console.error('❌ Error in endLecture:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

};

module.exports = teacherController;