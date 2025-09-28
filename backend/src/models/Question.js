// Question.js
const mongoose = require('mongoose');
const Answer = require('./Answer');

const QuestionSchema = new mongoose.Schema({
  question_id: {
    type: String,
    required: true,
    unique: true
  },
  question_text: {
    type: String,
    required: true
  },
  student_id: {
    type: String,
    required: true
  },
  lecture_id: {
    type: String,
    required: true,
    unique:true
  },
  timestamp: {
    type: Date,
    required: true
  },
  is_answered: {
    type: Boolean,
    default: false
  },
  is_important: {
    type: Boolean,
    default: false
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvoted_by: [{
    type: String
  }],
  answer: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  referenced_resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  resource_context: {
    type: String // Additional context about how the question relates to resources
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
