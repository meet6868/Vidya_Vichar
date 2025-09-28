// Lecture.js
const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  lecture_id: {
    type: String,
    required: true,
    unique: true
  },
  lecture_title:{
    type: String,
    required: true

  },
  course_id: {
    type: String,
    required: true
  },
  class_start: {
    type: Date,
    required: true
  },
  class_end: {
    type: Date,
    required: true
  },
  lec_num: {
    type: Number,
    required: true
  },

  query_id: [{
    type: String
  }],
  joined_students: [{
    type: String
  }],
  teacher_id: {
    type: String,
    required: true
  },
  is_teacher_ended: {
    type: Boolean,
    default: false
  },
  teacher_ended_at: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Lecture', LectureSchema);
