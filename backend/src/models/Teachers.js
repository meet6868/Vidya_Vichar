// Teachers.js
const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  teacher_id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
<<<<<<< HEAD
  name:{
    type: String,
    required: true,
    unique: true,
  },
=======
  name: {
		type: String,
		required: true
	},
>>>>>>> meet_side
  password: {
    type: String,
    required: true
  },
  courses_id: [{
    type: String,
    unique: true
  }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);
