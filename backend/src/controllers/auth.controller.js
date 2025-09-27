// Auth Controller for handling authentication
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock user data for now - replace with database later
let users = [];
let nextId = 1;

const authController = {
  // Register Student
  registerStudent: async (req, res) => {
    try {
      const { name, email, password, universityId } = req.body;
      
      // Check if student already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Student already exists with this email' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new student
      const newStudent = {
        id: nextId++,
        name,
        email,
        password: hashedPassword,
        role: 'student',
        universityId,
        createdAt: new Date()
      };

      users.push(newStudent);

      // Generate JWT token
      const token = jwt.sign(
        { id: newStudent.id, email: newStudent.email, role: 'student' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: {
          user: {
            id: newStudent.id,
            name: newStudent.name,
            email: newStudent.email,
            role: newStudent.role,
            universityId: newStudent.universityId
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error during registration',
        error: error.message 
      });
    }
  },

  // Register Teacher
  registerTeacher: async (req, res) => {
    try {
      const { name, email, password, department, universityId } = req.body;
      
      // Check if teacher already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Teacher already exists with this email' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new teacher
      const newTeacher = {
        id: nextId++,
        name,
        email,
        password: hashedPassword,
        role: 'teacher',
        department,
        universityId,
        createdAt: new Date()
      };

      users.push(newTeacher);

      // Generate JWT token
      const token = jwt.sign(
        { id: newTeacher.id, email: newTeacher.email, role: 'teacher' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Teacher registered successfully',
        data: {
          user: {
            id: newTeacher.id,
            name: newTeacher.name,
            email: newTeacher.email,
            role: newTeacher.role,
            department: newTeacher.department,
            universityId: newTeacher.universityId
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error during registration',
        error: error.message 
      });
    }
  },

  // Login Student
  loginStudent: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find student
      const student = users.find(user => user.email === email && user.role === 'student');
      if (!student) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid student credentials' 
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, student.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid student credentials' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: student.id, email: student.email, role: 'student' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Student login successful',
        data: {
          user: {
            id: student.id,
            name: student.name,
            email: student.email,
            role: student.role,
            universityId: student.universityId
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error during login',
        error: error.message 
      });
    }
  },

  // Login Teacher
  loginTeacher: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find teacher
      const teacher = users.find(user => user.email === email && user.role === 'teacher');
      if (!teacher) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid teacher credentials' 
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, teacher.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid teacher credentials' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: teacher.id, email: teacher.email, role: 'teacher' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Teacher login successful',
        data: {
          user: {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            role: teacher.role,
            department: teacher.department,
            universityId: teacher.universityId
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error during login',
        error: error.message 
      });
    }
  },

  // Logout
  logout: (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
};

module.exports = authController;