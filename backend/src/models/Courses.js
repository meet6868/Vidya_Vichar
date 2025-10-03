// Courses.js
const mongoose = require('mongoose');

const CoursesSchema = new mongoose.Schema({
  course_id: {
    type: String,
    required: true,
    unique: true
  },
  course_name: {
    type: String,
    required: true
  },
  teacher_id: [{
    type: String
    
  }],
  TA:[{
    type: String,
  }],
  batch: {
    type: String,
    enum: ['M.Tech', 'B.Tech', 'PHD', 'MS'],
    required: true
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE'],
    required: true
  },
  valid_time: {
    type: Date,
    required: true
  },
  request_list: [{
    type: String
  }],
  student_list: [{
    type: String
  }],
  lecture_id: [{
    type: String
  }]
});

module.exports = mongoose.model('Course', CoursesSchema);
