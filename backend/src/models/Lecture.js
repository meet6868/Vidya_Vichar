// Lecture.js
const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  lecture_id: {
    type: String,
    required: true,
    unique: true
  },
  course_id: {
    type: String,
    required: true,
    unique: true
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
    type: String,
    unique: true
  }],
  joined_students: [{
    type: String,
    unique: true
  }],
  teacher_id: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Lecture', LectureSchema);
