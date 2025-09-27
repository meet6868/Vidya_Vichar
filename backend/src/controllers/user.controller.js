// User Controller for handling user-related operations

// Mock user data - same as auth controller for now
let users = [];

const userController = {
  // Get user profile
  getUserProfile: (req, res) => {
    try {
      // In a real app, you'd get user ID from JWT token
      const userId = req.params.id || 1; // Mock for now
      
      const user = users.find(user => user.id === parseInt(userId));
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...(user.role === 'student' ? { universityId: user.universityId } : {}),
            ...(user.role === 'teacher' ? { department: user.department, universityId: user.universityId } : {})
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  },

  // Update user profile
  updateUserProfile: (req, res) => {
    try {
      const userId = req.params.id || 1; // Mock for now
      const updates = req.body;

      const userIndex = users.findIndex(user => user.id === parseInt(userId));
      if (userIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Update user
      users[userIndex] = { ...users[userIndex], ...updates };

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: users[userIndex].id,
            name: users[userIndex].name,
            email: users[userIndex].email,
            role: users[userIndex].role
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  },

  // Get all students
  getAllStudents: (req, res) => {
    try {
      const students = users.filter(user => user.role === 'student')
        .map(student => ({
          id: student.id,
          name: student.name,
          email: student.email,
          universityId: student.universityId,
          createdAt: student.createdAt
        }));

      res.status(200).json({
        success: true,
        data: {
          students,
          count: students.length
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  },

  // Get student by ID
  getStudentById: (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const student = users.find(user => user.id === studentId && user.role === 'student');

      if (!student) {
        return res.status(404).json({ 
          success: false, 
          message: 'Student not found' 
        });
      }

      res.status(200).json({
        success: true,
        data: {
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            universityId: student.universityId,
            createdAt: student.createdAt
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  },

  // Get all teachers
  getAllTeachers: (req, res) => {
    try {
      const teachers = users.filter(user => user.role === 'teacher')
        .map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          universityId: teacher.universityId,
          createdAt: teacher.createdAt
        }));

      res.status(200).json({
        success: true,
        data: {
          teachers,
          count: teachers.length
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  },

  // Get teacher by ID
  getTeacherById: (req, res) => {
    try {
      const teacherId = parseInt(req.params.id);
      const teacher = users.find(user => user.id === teacherId && user.role === 'teacher');

      if (!teacher) {
        return res.status(404).json({ 
          success: false, 
          message: 'Teacher not found' 
        });
      }

      res.status(200).json({
        success: true,
        data: {
          teacher: {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            department: teacher.department,
            universityId: teacher.universityId,
            createdAt: teacher.createdAt
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  }
};

module.exports = userController;