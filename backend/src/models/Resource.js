// Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  resource_id: {
    type: String,
    required: true,
    unique: true
  },
  course_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  resource_type: {
    type: String,
    enum: ['text', 'pdf', 'video', 'link', 'image', 'document'],
    required: true
  },
  content: {
    type: String, // For text content or file URLs/paths
    required: true
  },
  file_url: {
    type: String // For uploaded files
  },
  tags: [{
    type: String
  }],
  topic: {
    type: String // Topic/chapter this resource belongs to
  },
  lecture_ids: [{
    type: String // Which lectures this resource is relevant for
  }],
  added_by: {
    type: String, // Teacher or TA who added this
    required: true
  },
  added_by_role: {
    type: String,
    enum: ['teacher', 'ta'],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  },
  access_level: {
    type: String,
    enum: ['public', 'enrolled_only'],
    default: 'enrolled_only'
  }
}, {
  timestamps: true
});

// Index for efficient queries
ResourceSchema.index({ course_id: 1, is_active: 1 });
ResourceSchema.index({ course_id: 1, topic: 1 });
ResourceSchema.index({ course_id: 1, resource_type: 1 });

module.exports = mongoose.model('Resource', ResourceSchema);
