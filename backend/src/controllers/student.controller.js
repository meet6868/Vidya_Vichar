


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

      // Number of courses enrolled - count from Course collection where student is in student_list
      const numCoursesEnrolled = await Course.countDocuments({ student_list: studentId });

      // Unanswered questions
      const unansweredQuestions = await Question.countDocuments({
        student_id: studentId,
        is_answered: false
      });

      // Pending course requests - use exactly the same logic as getPendingCourses
      let pendingCourses = 0;
      try {
        const coursesWithPendingRequests = await Course.find({ request_list: studentId }).lean();
        // Apply the exact same filtering as getPendingCourses
        pendingCourses = coursesWithPendingRequests.filter(course => {
          // Skip courses with missing essential data (same logic as getPendingCourses)
          if (!course || !course._id) return false;
          // Only count courses with valid essential fields (same logic as getPendingCourses)
          return course.course_id || course.course_name;
        }).length;
      } catch (error) {
        console.error('Error counting pending courses:', error);
        pendingCourses = 0;
      }

      res.status(200).json({
        success: true,
        data: {
          name: student.name,
          roll_no: student.roll_no,
          batch: student.batch,
          branch: student.branch,
          numCoursesEnrolled,
          unansweredQuestions,
          pendingCourses
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

      // Find all courses where student is in student_list
      const courses = await Course.find({ student_list: studentId })
        .lean();

      // For each course, calculate duration, remaining time, instructor, and TAs
      const now = new Date();
      const courseDetails = await Promise.all(courses.map(async course => {
        // Duration (in ms) - using valid_time as end time for now
        let duration = null;
        let remainingTime = null;
        if (course.valid_time) {
          remainingTime = new Date(course.valid_time) - now;
          // Assume course duration is 3 months (for display purposes)
          duration = 90 * 24 * 60 * 60 * 1000; // 90 days in ms
        }

        // Get instructor name from Teacher collection
        let instructorName = 'Unknown';
        if (Array.isArray(course.teacher_id) && course.teacher_id.length > 0) {
          const Teacher = require('../models/Teachers');
          const teacher = await Teacher.findOne({ teacher_id: course.teacher_id[0] });
          if (teacher) {
            instructorName = teacher.name;
          }
        }

        // Get TAs (students in student_list with is_TA field set)
        let TAs = [];
        if (Array.isArray(course.student_list) && course.student_list.length > 0) {
          TAs = await Student.find({ 
            _id: { $in: course.student_list }, 
            is_TA: { $exists: true, $ne: null, $ne: '' }
          }, 'name roll_no');
        }

        return {
          id: course._id,
          course_name: course.course_name,
          duration, // in ms
          remainingTime, // in ms
          instructor: instructorName,
          TAs: TAs.map(ta => ({ name: ta.name, roll_no: ta.roll_no }))
        };
      }));

      res.status(200).json({
        success: true,
        data: {
          courses: courseDetails
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

  getPendingCourses: async (req, res) => {
    try {
      const studentId = req.user.id;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Find all courses where student id is present in request_list
      const courses = await Course.find({ request_list: studentId })
        .lean();

      const now = new Date();
      const courseDetails = [];

      // Process each course individually with error handling
      for (const course of courses) {
        try {
          // Skip courses with missing essential data
          if (!course || !course._id) {
            console.warn('Skipping invalid course:', course);
            continue;
          }

          // Duration (in ms) - using valid_time as end time for now
          let duration = null;
          let remainingTime = null;
          if (course.valid_time) {
            remainingTime = new Date(course.valid_time) - now;
            duration = 90 * 24 * 60 * 60 * 1000; // 90 days in ms
          }

          // Get instructor name from Teacher collection with better error handling
          let instructorName = 'Unknown';
          if (Array.isArray(course.teacher_id) && course.teacher_id.length > 0) {
            try {
              const Teacher = require('../models/Teachers');
              const teacher = await Teacher.findOne({ teacher_id: course.teacher_id[0] });
              if (teacher && teacher.name) {
                instructorName = teacher.name;
              }
            } catch (teacherError) {
              // Silently handle teacher lookup errors
              instructorName = 'Unknown';
            }
          }

          // Get TAs with better error handling
          let TAs = [];
          if (Array.isArray(course.student_list) && course.student_list.length > 0) {
            try {
              TAs = await Student.find({ 
                _id: { $in: course.student_list }, 
                is_TA: { $exists: true, $ne: null, $ne: '' }
              }, 'name roll_no');
            } catch (taError) {
              // Silently handle TA lookup errors
              TAs = [];
            }
          }

          // Only add courses with valid essential fields
          if (course.course_id || course.course_name) {
            const courseDetail = {
              id: course._id,
              course_id: course.course_id || `Course_${course._id}`,
              course_name: course.course_name || 'Unnamed Course',
              batch: course.batch || 'Unknown',
              branch: course.branch || 'Unknown',
              duration,
              remainingTime,
              instructor: instructorName,
              TAs: TAs.map(ta => ({ name: ta.name || 'Unknown', roll_no: ta.roll_no || 'N/A' }))
            };
            
            courseDetails.push(courseDetail);
          }
        } catch (courseError) {
          console.error(`Error processing course ${course?.course_id || 'unknown'}:`, courseError.message);
          // Skip this course instead of adding fallback data
          continue;
        }
      }

      res.status(200).json({
        success: true,
        data: {
          courses: courseDetails
        }
      });
    } 
    catch (error) {
      console.error('Error in getPendingCourses:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get courses for student by batch and branch
  getCoursesForStudents: async (req, res) => {
    try {
      const studentId = req.user.id;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get courses for student's batch and branch
      const courses = await Course.find({
        batch: student.batch,
        branch: student.branch
      }).lean();

      // Format course data for frontend
      const now = new Date();
      const courseDetails = await Promise.all(courses.map(async course => {
        // Calculate remaining time using valid_time
        let remainingTime = null;
        let duration = null;
        if (course.valid_time) {
          remainingTime = new Date(course.valid_time) - now;
          duration = 90 * 24 * 60 * 60 * 1000; // Assume 90 days duration
        }

        // Get instructor name from Teacher collection
        let instructorName = 'Unknown';
        if (Array.isArray(course.teacher_id) && course.teacher_id.length > 0) {
          const Teacher = require('../models/Teachers');
          const teacher = await Teacher.findOne({ teacher_id: course.teacher_id[0] });
          if (teacher) {
            instructorName = teacher.name;
          }
        }

        return {
          id: course.course_id,
          course_id: course.course_id, // Include both for compatibility
          name: course.course_name,
          course_name: course.course_name, // Include both for compatibility
          duration: duration,
          remainingTime: remainingTime,
          instructor: instructorName,
          batch: course.batch,
          branch: course.branch,
          TAs: [] // Empty for now since we'd need to check enrolled students
        };
      }));

      res.status(200).json({
        success: true,
        data: {
          courses: courseDetails
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

  // Get student classes/lectures
  getStudentLectures: async (req, res) => {
    try {
      const studentId = req.user.id;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get lectures for courses the student is enrolled in
      const now = new Date();
      const lectures = await Lecture.find({
        course_id: { $in: student.courses_id_enrolled }
      }).populate('course_id', 'course_name');

      // Filter lectures: only those starting within 15 min from now and not ended
      const filteredLectures = lectures.filter(lecture => {
        if (!lecture.class_start || !lecture.class_end) return false;
        const start = new Date(lecture.class_start);
        const end = new Date(lecture.class_end);
        // Show if now >= (start - 15min) and now <= end
        return now >= new Date(start.getTime() - 15 * 60 * 1000) && now <= end;
      });

      res.status(200).json({
        success: true,
        data: {
          lectures: filteredLectures.map(lecture => ({
            lecture_id: lecture._id,
            course_id: lecture.course_id?._id || lecture.course_id,
            course_name: lecture.course_id?.course_name,
            class_start: lecture.class_start,
            lec_num: lecture.lec_num
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

    // Get previous lectures for student (lectures that have ended)
  getPrevStudentLectures: async (req, res) => {
    try {
      const studentId = req.user.id;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get lectures for courses the student is enrolled in
      const now = new Date();
      const lectures = await Lecture.find({
        course_id: { $in: student.courses_id_enrolled }
      }).populate('course_id', 'course_name');

      // Filter lectures: only those where now > end time
      const filteredLectures = lectures.filter(lecture => {
        if (!lecture.class_end) return false;
        const end = new Date(lecture.class_end);
        return now > end;
      });

      res.status(200).json({
        success: true,
        data: {
          lectures: filteredLectures.map(lecture => ({
            lecture_id: lecture._id,
            course_id: lecture.course_id?._id || lecture.course_id,
            course_name: lecture.course_id?.course_name,
            class_start: lecture.class_start,
            lec_num: lecture.lec_num
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

    // Get all questions for a lecture
  getAllQuestions: async (req, res) => {
    try {
      const { lectureId } = req.body;
      if (!lectureId) {
        return res.status(400).json({
          success: false,
          message: 'lecture_id is required in req.user'
        });
      }

      // Find all questions for this lecture
      const questions = await Question.find({ lecture_id: lectureId })
        .populate('answer');

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

  // Get all questions for a lecture asked by the current student
  getMyQuestions: async (req, res) => {
    try {
      const studentId = req.user.id;
      const { lectureId } = req.body;
      if (!lectureId) {
        return res.status(400).json({
          success: false,
          message: 'lecture_id is required in req.user'
        });
      }

      // Find all questions for this lecture asked by this student
      const questions = await Question.find({ lecture_id: lectureId, student_id: studentId })
        .populate('answer');

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

    // Join a course
  joinCourse: async (req, res) => {
    try {
      const { course_id } = req.body; // course_id as per Courses.js
      const studentId = req.user.id;

      const student = await Student.findById(studentId);
      const course = await Course.findOne({ course_id });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if already enrolled in course (student is in course's student_list)
      if (course.student_list && course.student_list.includes(studentId)) {
        return res.status(400).json({
          success: false,
          message: 'Already enrolled in this course'
        });
      }

      // Check if already requested (student is in course's request_list)
      if (course.request_list && course.request_list.includes(studentId)) {
        return res.status(400).json({
          success: false,
          message: 'Already requested to join this course'
        });
      }

      // ENSURE BOTH-SIDE CONSISTENCY: Update both student and course documents
      
      // 1. Add course_id to student's request list (if not already there)
      if (!student.courses_id_request) {
        student.courses_id_request = [];
      }
      if (!student.courses_id_request.includes(course_id)) {
        student.courses_id_request.push(course_id);
      }

      // 2. Add student ObjectId to course's request_list (if not already there)  
      if (!course.request_list) {
        course.request_list = [];
      }
      if (!course.request_list.includes(studentId)) {
        course.request_list.push(studentId);
      }

      // Save both documents to ensure consistency
      await Promise.all([
        student.save(),
        course.save()
      ]);

      console.log(`✅ Course join request created: Student ${student.name} requested ${course_id}`);
      console.log(`   - Added ${course_id} to student.courses_id_request`);
      console.log(`   - Added ${studentId} to course.request_list`);

      res.status(200).json({
        success: true,
        message: 'Successfully requested to join the course',
        data: {
          course: {
            course_id: course.course_id,
            course_name: course.course_name,
            batch: course.batch,
            branch: course.branch
          }
        }
      });
    } catch (error) {
      console.error('Error in joinCourse:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Join a class
  joinLecture: async (req, res) => {
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
  askQuestion: async (req, res) => {
    try {
      console.log('🔍 askQuestion: Request body:', req.body);
      console.log('🔍 askQuestion: User:', req.user);
      
      const { 
        question_text, 
        lecture_id, 
        referenced_resources, 
        resource_context 
      } = req.body;
      const studentId = req.user.id;

      // Validate required fields
      if (!question_text || !lecture_id) {
        return res.status(400).json({
          success: false,
          message: 'Question text and lecture ID are required'
        });
      }

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: 'Student not authenticated'
        });
      }

      console.log('🔍 askQuestion: Creating question with data:', {
        question_text,
        lecture_id,
        studentId
      });

      // Generate a unique question_id
      const question_id = `Q_${lecture_id}_${studentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date();

      const newQuestion = new Question({
        question_id,
        question_text,
        student_id: studentId,
        lecture_id,
        timestamp,
        is_answered: false,
        is_important: false,
        upvotes: 1, // Auto upvote by asker
        upvoted_by: [studentId],
        answer: [],
        referenced_resources: referenced_resources || [], // Array of resource IDs
        resource_context: resource_context || null // Additional context about resource relation
      });

      console.log('🔍 askQuestion: Attempting to save question...');
      const savedQuestion = await newQuestion.save();
      console.log('🔍 askQuestion: Question saved successfully:', savedQuestion._id);

      // Update lecture's query_id array to include this question
      try {
        await Lecture.findOneAndUpdate(
          { lecture_id: lecture_id },
          { $addToSet: { query_id: question_id } },
          { new: true }
        );
        console.log('🔍 askQuestion: Updated lecture query_id array with new question:', question_id);
      } catch (lectureUpdateError) {
        console.warn('⚠️ askQuestion: Failed to update lecture query_id:', lectureUpdateError.message);
        // Don't fail the request if lecture update fails
      }

      res.status(201).json({
        success: true,
        message: 'Question asked successfully',
        data: {
          question: savedQuestion
        }
      });
    } catch (error) {
      console.error('❌ askQuestion: Error occurred:', error);
      console.error('❌ askQuestion: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  answerQuestion: async (req, res) => {
    try {
      const { question_id, answer_text, answer_type } = req.body;
      const studentId = req.user.id;

      // Only allow if student is TA
      const student = await Student.findById(studentId);
      if (!student || !student.is_TA || student.is_TA === '') {
        return res.status(403).json({
          success: false,
          message: 'Only TAs can answer questions.'
        });
      }

      const question = await Question.findOne({ question_id });
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      // Create answer according to Answer.js
      const newAnswer = new Answer({
        answerer_name: student.name,
        answer: answer_text,
        answer_type
      });
      await newAnswer.save();

      // Link answer to question
      question.answer.push(newAnswer._id);
      question.is_answered = true;
      await question.save();

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
    }
     catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get lectures for a specific course
  getCourseLectures: async (req, res) => {
    try {
      const { courseId } = req.params;
      const studentId = req.user.id;
      
      // Debug logging
      console.log('🔍 getCourseLectures DEBUG:');
      console.log('Course ID:', courseId);
      console.log('Student ID from JWT:', studentId);
      console.log('Student ID type:', typeof studentId);
      
      if (!courseId) {
        return res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
      }

      // Verify student is enrolled in this course (courseId is the MongoDB _id)
      const course = await Course.findOne({ _id: courseId, student_list: studentId });
      console.log('Course found:', !!course);
      if (course) {
        console.log('Course name:', course.course_name);
        console.log('Student list:', course.student_list);
      }
      
      if (!course) {
        return res.status(403).json({
          success: false,
          message: 'You are not enrolled in this course'
        });
      }

      // Get all lectures for this course using the course_id field
      const lectures = await Lecture.find({ course_id: course.course_id })
        .sort({ lec_num: 1 });

      console.log('Lectures found:', lectures.length);

      res.status(200).json({
        success: true,
        data: {
          lectures: lectures
        }
      });
    } catch (error) {
      console.error('Error fetching course lectures:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get doubts for a specific lecture
  getLectureDoubts: async (req, res) => {
    try {
      const { lectureId } = req.params;
      const studentId = req.user.id;
      
      if (!lectureId) {
        return res.status(400).json({
          success: false,
          message: 'Lecture ID is required'
        });
      }

      // Verify lecture exists and student has access
      const lecture = await Lecture.findOne({ lecture_id: lectureId });
      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found'
        });
      }

      // Check if student is enrolled in the course
      const course = await Course.findOne({ course_id: lecture.course_id, student_list: studentId });
      if (!course) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this lecture'
        });
      }

      // Get questions for this lecture
      const questions = await Question.find({ lecture_id: lectureId })
        .populate('referenced_resources', 'title resource_type')
        .populate('answer')
        .sort({ timestamp: -1 });

      // Format questions with mock student names
      const mockStudentNames = ['Alice Johnson', 'Bob Smith', 'Charlie Davis', 'Diana Wilson', 'Emma Brown', 'Frank Miller'];
      
      const formattedQuestions = questions.map((question, index) => {
        const randomName = mockStudentNames[index % mockStudentNames.length];
        const hasAnswer = question.answer && question.answer.length > 0;
        
        return {
          _id: question._id,
          question_id: question.question_id,
          question: question.question_text,
          student_id: question.student_id,
          student_name: randomName,
          lecture_id: question.lecture_id,
          timestamp: question.timestamp,
          is_answered: question.is_answered,
          answer: hasAnswer ? question.answer[0].answer : null,
          answered_by: hasAnswer ? 'teacher' : null,
          answered_at: hasAnswer ? question.answer[0].answered_at || new Date() : null,
          referenced_resources: question.referenced_resources || [],
          resource_context: question.resource_context
        };
      });

      res.status(200).json({
        success: true,
        data: {
          questions: formattedQuestions,
          lecture: {
            lecture_id: lecture.lecture_id,
            course_id: lecture.course_id,
            lec_num: lecture.lec_num,
            class_start: lecture.class_start,
            class_end: lecture.class_end,
            lecture_title: lecture.lecture_title
          },
          totalCount: formattedQuestions.length
        }
      });
    } catch (error) {
      console.error('Error fetching lecture doubts:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get available classes for joining
  getAvailableClasses: async (req, res) => {
    try {
      const studentId = req.user.id;
      
      // Get student to find their enrolled courses
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Find courses where student is enrolled
      const enrolledCourses = await Course.find({ student_list: studentId });
      const courseIds = enrolledCourses.map(course => course.course_id);

      // Get lectures from enrolled courses that are available to join
      // (lectures that are either live or recently ended)
      const now = new Date();
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

      const availableLectures = await Lecture.find({
        course_id: { $in: courseIds },
        class_start: { $lte: now },
        class_end: { $gte: fifteenMinutesAgo }
      }).sort({ class_start: -1 });

      // Format lectures with course information
      const formattedLectures = await Promise.all(availableLectures.map(async lecture => {
        const course = enrolledCourses.find(c => c.course_id === lecture.course_id);
        
        return {
          _id: lecture._id,
          lecture_id: lecture.lecture_id,
          course_id: lecture.course_id,
          course_name: course?.course_name || 'Unknown Course',
          lec_num: lecture.lec_num,
          lecture_title: lecture.lecture_title,
          class_start: lecture.class_start,
          class_end: lecture.class_end,
          joined_students_count: lecture.joined_students ? lecture.joined_students.length : 0,
          is_joined: lecture.joined_students ? lecture.joined_students.includes(studentId) : false
        };
      }));

      res.status(200).json({
        success: true,
        data: {
          lectures: formattedLectures
        }
      });
    } catch (error) {
      console.error('Error fetching available classes:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get questions for a specific lecture (for class doubts)
  getLectureQuestions: async (req, res) => {
    try {
      const { lectureId } = req.params;
      const studentId = req.user.id;
      
      if (!lectureId) {
        return res.status(400).json({
          success: false,
          message: 'Lecture ID is required'
        });
      }

      console.log('🔍 getLectureQuestions: lectureId received:', lectureId);

      // Try to find lecture by both _id (ObjectId) and lecture_id (string)
      let lecture;
      try {
        // First try as MongoDB ObjectId
        lecture = await Lecture.findById(lectureId);
      } catch (error) {
        console.log('🔍 Not a valid ObjectId, trying as lecture_id string');
      }
      
      // If not found by ObjectId, try by lecture_id string
      if (!lecture) {
        lecture = await Lecture.findOne({ lecture_id: lectureId });
      }

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found'
        });
      }

      console.log('🔍 Found lecture:', {
        _id: lecture._id,
        lecture_id: lecture.lecture_id,
        course_id: lecture.course_id
      });

      // Check if student is enrolled in the course
      const course = await Course.findOne({ 
        course_id: lecture.course_id, 
        student_list: studentId 
      });
      if (!course) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this lecture'
        });
      }

      // Get questions for this lecture using the MongoDB _id (since questions store lecture ObjectId)
      const questions = await Question.find({ lecture_id: lecture._id.toString() })
        .populate('answer')
        .sort({ timestamp: -1 });

      console.log('🔍 Found questions count:', questions.length);

      // Get unique student IDs to fetch student names
      const studentIds = [...new Set(questions.map(q => q.student_id))];
      const students = await Student.find({ _id: { $in: studentIds } }).select('name username');
      
      // Create a map of student ID to student info for quick lookup
      const studentMap = {};
      students.forEach(student => {
        studentMap[student._id.toString()] = {
          name: student.name,
          username: student.username
        };
      });
      
      const formattedQuestions = questions.map((question) => {
        const hasAnswer = question.answer && question.answer.length > 0;
        const studentInfo = studentMap[question.student_id] || { name: 'Unknown Student', username: 'unknown' };
        
        return {
          _id: question._id,
          question_id: question.question_id,
          question_text: question.question_text,
          content: question.question_text, // Frontend expects 'content'
          studentName: studentInfo.name, // Frontend expects 'studentName'
          student_name: studentInfo.name, // Keep original for compatibility
          timestamp: question.timestamp,
          createdAt: question.timestamp, // Frontend expects 'createdAt'
          is_answered: question.is_answered,
          status: question.is_answered ? 'answered' : 'pending', // Frontend expects 'status' string
          upvotes: question.upvotes || 0,
          answer: hasAnswer ? question.answer[0].answer : null,
          answeredAt: hasAnswer ? question.answer[0].timestamp : null
        };
      });

      res.status(200).json({
        success: true,
        data: {
          questions: formattedQuestions,
          lecture: {
            _id: lecture._id,
            lecture_id: lecture.lecture_id,
            course_id: lecture.course_id,
            lec_num: lecture.lec_num,
            class_start: lecture.class_start,
            class_end: lecture.class_end,
            lecture_title: lecture.lecture_title
          },
          totalCount: formattedQuestions.length
        }
      });
    } catch (error) {
      console.error('Error fetching lecture questions:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get course information
  getCourseInfo: async (req, res) => {
    try {
      const { courseId } = req.params;
      const studentId = req.user.id;
      
      const course = await Course.findOne({ 
        course_id: courseId,
        student_list: studentId 
      });
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or access denied'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          course_id: course.course_id,
          course_name: course.course_name,
          batch: course.batch,
          branch: course.branch
        }
      });
    } catch (error) {
      console.error('Error fetching course info:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }    

};

module.exports = studentController;