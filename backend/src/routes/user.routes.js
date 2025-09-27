const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// User profile routes
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

// Student specific routes
router.get('/students', userController.getAllStudents);
router.get('/student/:id', userController.getStudentById);

// Teacher specific routes
router.get('/teachers', userController.getAllTeachers);
router.get('/teacher/:id', userController.getTeacherById);

module.exports = router;