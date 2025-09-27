// Answer.js
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  answerer_name: {
    type: String,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // can be text or file reference
    required: true
  },
  answer_type: {
    type: String,
    enum: ['text', 'file'],
    required: true
  }
});

module.exports = mongoose.model('Answer', AnswerSchema);
