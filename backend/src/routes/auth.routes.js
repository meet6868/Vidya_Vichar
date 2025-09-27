const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Student routes
router.post('/student/register', authController.registerStudent);
router.post('/student/login', authController.loginStudent);

// Teacher routes
router.post('/teacher/register', authController.registerTeacher);
router.post('/teacher/login', authController.loginTeacher);

// Common routes
router.post('/logout', authController.logout);

module.exports = router;