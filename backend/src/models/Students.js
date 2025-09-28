// Students.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	roll_no: {
		type: String,
		required: true,
		unique: true
	},
	is_TA: {
		type: Boolean,
		default: false
	},
    courses_id_request: {
		type: [String],
		default: []
	},
	courses_id_enrolled: {
		type: [String],
		default: []
	},
	batch: {
		type: String,
		enum: ['M.Tech', 'B.Tech', 'PhD', 'MS'],
		required: true
	},
	branch: {
		type: String,
		enum: ['CSE', 'ECE'],
		required: true
	}
});

module.exports = mongoose.model('Student', StudentSchema);
