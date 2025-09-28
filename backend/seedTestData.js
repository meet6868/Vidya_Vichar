const mongoose = require('mongoose');
const Course = require('./src/models/Courses');
const Lecture = require('./src/models/Lecture');
const Question = require('./src/models/Question');
const Answer = require('./src/models/Answer');
const Student = require('./src/models/Students');
const Resource = require('./src/models/Resource');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidya_vichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedTestData = async () => {
  try {
    console.log('🌱 Starting to seed test data...');

    // Clear existing data (optional - comment out to keep existing data)
    // await Course.deleteMany({});
    // await Lecture.deleteMany({});
    // await Question.deleteMany({});
    // await Answer.deleteMany({});
    // await Resource.deleteMany({});

    // Create test courses
    const testCourses = [
      {
        course_id: 'CS101',
        course_name: 'Introduction to Computer Science',
        teacher_id: ['TEACHER001'],
        batch: 'B.Tech',
        branch: 'CSE',
        valid_time: new Date('2024-05-15'),
        student_list: ['STU001', 'STU002', 'STU003', 'STU004'],
        request_list: [],
        lecture_id: ['LEC_CS101_001', 'LEC_CS101_002', 'LEC_CS101_003']
      },
      {
        course_id: 'DS202',
        course_name: 'Data Structures and Algorithms',
        teacher_id: ['TEACHER002'],
        batch: 'B.Tech',
        branch: 'CSE',
        valid_time: new Date('2024-06-20'),
        student_list: ['STU001', 'STU002', 'STU003'],
        request_list: ['STU005'],
        lecture_id: ['LEC_DS202_001', 'LEC_DS202_002']
      },
      {
        course_id: 'WEB301',
        course_name: 'Web Development',
        teacher_id: ['TEACHER003'],
        batch: 'B.Tech',
        branch: 'CSE',
        valid_time: new Date('2024-07-01'),
        student_list: ['STU002', 'STU004'],
        request_list: [],
        lecture_id: []
      }
    ];

    for (const courseData of testCourses) {
      const existingCourse = await Course.findOne({ course_id: courseData.course_id });
      if (!existingCourse) {
        const course = new Course(courseData);
        await course.save();
        console.log(`✅ Created course: ${courseData.course_name}`);
      }
    }

    // Create test lectures
    const testLectures = [
      // CS101 Lectures
      {
        lecture_id: 'LEC_CS101_001',
        course_id: 'CS101',
        class_start: new Date('2024-01-15T09:00:00Z'),
        class_end: new Date('2024-01-15T10:30:00Z'),
        lec_num: 1,
        topic: 'Introduction to Programming',
        query_id: ['Q_CS101_001', 'Q_CS101_002'],
        joined_students: ['STU001', 'STU002', 'STU003'],
        teacher_id: 'TEACHER001'
      },
      {
        lecture_id: 'LEC_CS101_002',
        course_id: 'CS101',
        class_start: new Date('2024-01-17T09:00:00Z'),
        class_end: new Date('2024-01-17T10:30:00Z'),
        lec_num: 2,
        topic: 'Algorithm Complexity',
        query_id: ['Q_CS101_003'],
        joined_students: ['STU001', 'STU002', 'STU003', 'STU004'],
        teacher_id: 'TEACHER001'
      },
      {
        lecture_id: 'LEC_CS101_003',
        course_id: 'CS101',
        class_start: new Date('2024-01-20T09:00:00Z'),
        class_end: new Date('2024-01-20T10:30:00Z'),
        lec_num: 3,
        topic: 'Data Types and Variables',
        query_id: ['Q_CS101_004', 'Q_CS101_005'],
        joined_students: ['STU001', 'STU002'],
        teacher_id: 'TEACHER001'
      },
      // DS202 Lectures
      {
        lecture_id: 'LEC_DS202_001',
        course_id: 'DS202',
        class_start: new Date('2024-01-22T14:00:00Z'),
        class_end: new Date('2024-01-22T15:30:00Z'),
        lec_num: 1,
        topic: 'Binary Search Algorithm',
        query_id: ['Q_DS202_001', 'Q_DS202_002'],
        joined_students: ['STU001', 'STU002', 'STU003'],
        teacher_id: 'TEACHER002'
      },
      {
        lecture_id: 'LEC_DS202_002',
        course_id: 'DS202',
        class_start: new Date('2024-01-25T14:00:00Z'),
        class_end: new Date('2024-01-25T15:30:00Z'),
        lec_num: 2,
        topic: 'Sorting Algorithms - Quick Sort',
        query_id: ['Q_DS202_003'],
        joined_students: ['STU001', 'STU003'],
        teacher_id: 'TEACHER002'
      }
    ];

    for (const lectureData of testLectures) {
      const existingLecture = await Lecture.findOne({ lecture_id: lectureData.lecture_id });
      if (!existingLecture) {
        const lecture = new Lecture(lectureData);
        await lecture.save();
        console.log(`✅ Created lecture: ${lectureData.lecture_id}`);
      }
    }

    // Create test resources
    const testResources = [
      {
        resource_id: 'RES_CS101_001',
        course_id: 'CS101',
        title: 'Introduction to Programming',
        description: 'Basic concepts of programming and computer science',
        resource_type: 'text',
        content: 'Programming is the process of creating a set of instructions that tell a computer how to perform a task.',
        tags: ['programming', 'basics', 'introduction'],
        topic: 'Programming Fundamentals',
        lecture_ids: ['LEC_CS101_001'],
        added_by: 'TEACHER001',
        added_by_role: 'teacher',
        access_level: 'enrolled_only'
      },
      {
        resource_id: 'RES_CS101_002',
        course_id: 'CS101',
        title: 'Algorithm Complexity Guide',
        description: 'Understanding Big O notation and algorithm analysis',
        resource_type: 'pdf',
        content: 'This guide covers Big O notation, time complexity analysis, and space complexity concepts with examples.',
        file_url: 'https://example.com/complexity-guide.pdf',
        tags: ['algorithms', 'complexity', 'big-o'],
        topic: 'Algorithm Analysis',
        lecture_ids: ['LEC_CS101_002'],
        added_by: 'TEACHER001',
        added_by_role: 'teacher',
        access_level: 'enrolled_only'
      },
      {
        resource_id: 'RES_DS202_001',
        course_id: 'DS202',
        title: 'Binary Search Implementation',
        description: 'Step-by-step implementation of binary search algorithm',
        resource_type: 'text',
        content: 'Binary search is a search algorithm that finds the position of a target value within a sorted array.',
        tags: ['binary-search', 'algorithms', 'searching'],
        topic: 'Search Algorithms',
        lecture_ids: ['LEC_DS202_001'],
        added_by: 'TEACHER002',
        added_by_role: 'teacher',
        access_level: 'enrolled_only'
      },
      {
        resource_id: 'RES_DS202_002',
        course_id: 'DS202',
        title: 'Sorting Algorithms Comparison',
        description: 'Comparative analysis of different sorting algorithms',
        resource_type: 'pdf',
        content: 'This document compares various sorting algorithms including bubble sort, merge sort, quick sort, and their time complexities.',
        file_url: 'https://example.com/sorting-comparison.pdf',
        tags: ['sorting', 'comparison', 'algorithms'],
        topic: 'Sorting Algorithms',
        lecture_ids: ['LEC_DS202_002'],
        added_by: 'TEACHER002',
        added_by_role: 'teacher',
        access_level: 'enrolled_only'
      }
    ];

    for (const resourceData of testResources) {
      const existingResource = await Resource.findOne({ resource_id: resourceData.resource_id });
      if (!existingResource) {
        const resource = new Resource(resourceData);
        await resource.save();
        console.log(`✅ Created resource: ${resourceData.title}`);
      }
    }

    // Create test questions and answers
    const testQuestions = [
      {
        question_id: 'Q_CS101_001',
        question_text: 'What is the difference between a compiler and an interpreter?',
        student_id: 'STU001',
        lecture_id: 'LEC_CS101_001',
        timestamp: new Date('2024-01-15T09:15:00Z'),
        is_answered: true,
        referenced_resources: [],
        resource_context: null
      },
      {
        question_id: 'Q_CS101_002',
        question_text: 'Can you explain what variables are in programming?',
        student_id: 'STU002',
        lecture_id: 'LEC_CS101_001',
        timestamp: new Date('2024-01-15T09:25:00Z'),
        is_answered: true,
        referenced_resources: [],
        resource_context: null
      },
      {
        question_id: 'Q_CS101_003',
        question_text: 'What is Big O notation and why is it important?',
        student_id: 'STU003',
        lecture_id: 'LEC_CS101_002',
        timestamp: new Date('2024-01-17T09:20:00Z'),
        is_answered: false,
        referenced_resources: [],
        resource_context: null
      },
      {
        question_id: 'Q_DS202_001',
        question_text: 'What is the time complexity of binary search algorithm?',
        student_id: 'STU001',
        lecture_id: 'LEC_DS202_001',
        timestamp: new Date('2024-01-22T14:15:00Z'),
        is_answered: true,
        referenced_resources: [],
        resource_context: 'Referenced from algorithm complexity notes'
      },
      {
        question_id: 'Q_DS202_002',
        question_text: 'Can you explain the difference between merge sort and quick sort?',
        student_id: 'STU002',
        lecture_id: 'LEC_DS202_001',
        timestamp: new Date('2024-01-22T14:25:00Z'),
        is_answered: false,
        referenced_resources: [],
        resource_context: 'Following the comparison table in the resource'
      }
    ];

    // First create questions
    const createdQuestions = [];
    for (const questionData of testQuestions) {
      const existingQuestion = await Question.findOne({ question_id: questionData.question_id });
      if (!existingQuestion) {
        // Find resource references if any
        const resourceRefs = [];
        if (questionData.question_id === 'Q_DS202_001') {
          const resource = await Resource.findOne({ resource_id: 'RES_DS202_001' });
          if (resource) resourceRefs.push(resource._id);
        }
        if (questionData.question_id === 'Q_DS202_002') {
          const resource = await Resource.findOne({ resource_id: 'RES_DS202_002' });
          if (resource) resourceRefs.push(resource._id);
        }

        const question = new Question({
          ...questionData,
          referenced_resources: resourceRefs
        });
        await question.save();
        createdQuestions.push(question);
        console.log(`✅ Created question: ${questionData.question_id}`);
      }
    }

    // Create answers for answered questions
    const testAnswers = [
      {
        answer_id: 'ANS_CS101_001',
        question_id: 'Q_CS101_001',
        answer: 'A compiler translates the entire source code into machine code before execution, while an interpreter executes code line by line during runtime. Compiled programs generally run faster, but interpreted programs are more flexible for debugging.',
        answerer_id: 'TEACHER001',
        answerer_name: 'teacher',
        answered_at: new Date('2024-01-15T09:20:00Z'),
        answer_type: 'text'
      },
      {
        answer_id: 'ANS_CS101_002',
        question_id: 'Q_CS101_002',
        answer: 'Variables are containers that store data values. In programming, you can think of them as labeled boxes where you can store different types of information like numbers, text, or boolean values. They allow you to store, modify, and retrieve data throughout your program.',
        answerer_id: 'TEACHER001',
        answerer_name: 'teacher',
        answered_at: new Date('2024-01-15T09:30:00Z'),
        answer_type: 'text'
      },
      {
        answer_id: 'ANS_DS202_001',
        question_id: 'Q_DS202_001',
        answer: 'The time complexity of binary search is O(log n) because we eliminate half of the search space in each iteration. This makes it much more efficient than linear search for sorted data.',
        answerer_id: 'TEACHER002',
        answerer_name: 'teacher',
        answered_at: new Date('2024-01-22T14:20:00Z'),
        answer_type: 'text'
      }
    ];

    for (const answerData of testAnswers) {
      const existingAnswer = await Answer.findOne({ answer_id: answerData.answer_id });
      if (!existingAnswer) {
        const answer = new Answer(answerData);
        await answer.save();
        
        // Update the corresponding question to reference this answer
        await Question.findOneAndUpdate(
          { question_id: answerData.question_id },
          { 
            $push: { answer: answer._id },
            is_answered: true 
          }
        );
        
        console.log(`✅ Created answer: ${answerData.answer_id}`);
      }
    }

    console.log('🎉 Test data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Courses: ${testCourses.length}`);
    console.log(`   - Lectures: ${testLectures.length}`);
    console.log(`   - Resources: ${testResources.length}`);
    console.log(`   - Questions: ${testQuestions.length}`);
    console.log(`   - Answers: ${testAnswers.length}`);

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
seedTestData();
