import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import API configuration
import './config/api.js';

// Import pages
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/auth/StudentLogin';
import TeacherLogin from './pages/auth/TeacherLogin';
import StudentRegister from './pages/auth/StudentRegister';
import TeacherRegister from './pages/auth/TeacherRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

// Student Dashboard Components (these will be created later)
import StudentOverview from './pages/student/StudentOverview';
import EnrolledCourses from './pages/student/EnrolledCourses';
import CourseDetails from './pages/student/CourseDetails';
import StudentClasses from './pages/student/StudentClasses';
import AllDoubts from './pages/student/AllDoubts';
import AnsweredDoubts from './pages/student/AnsweredDoubts';
import AskDoubt from './pages/student/AskDoubt';
import JoinCourse from './pages/student/JoinCourse';
import AvailableCourses from './pages/student/AvailableCourses';

// Teacher Dashboard Components (these will be created later)
import TeacherOverview from './pages/teacher/TeacherOverview';
import TeacherProfile from './pages/teacher/TeacherProfile';
import CreateCourse from './pages/teacher/CreateCourse';
import YourCourses from './pages/teacher/YourCourses';
import TeacherCourseDetails from './pages/teacher/TeacherCourseDetails';
import CreateClass from './pages/teacher/CreateClass';
import ClassPage from './pages/teacher/ClassPage';
import JoinedStudents from './pages/teacher/JoinedStudents';
import AllDoubtsTeacher from './pages/teacher/AllDoubtsTeacher';
import UnansweredDoubts from './pages/teacher/UnansweredDoubts';
import AnsweredDoubtsTeacher from './pages/teacher/AnsweredDoubtsTeacher';

const App = () => {
  // Global app configurations can go here
  React.useEffect(() => {
    // Set up global error handling
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    // Set up global fetch interceptor for API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Handle 401 responses globally (token expiry)
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
          window.location.href = '/';
        }
        
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    };

    return () => {
      window.removeEventListener('unhandledrejection', () => {});
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />
        
        {/* Main Dashboard Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        
        {/* Student Dashboard Sub-Routes */}
        <Route path="/student/dashboard/overview" element={<StudentOverview />} />
        <Route path="/student/dashboard/enrolled-courses" element={<EnrolledCourses />} />
        <Route path="/student/dashboard/course/:courseId" element={<CourseDetails />} />
        <Route path="/student/dashboard/classes" element={<StudentClasses />} />
        <Route path="/student/dashboard/all-doubts" element={<AllDoubts />} />
        <Route path="/student/dashboard/answered-doubts" element={<AnsweredDoubts />} />
        <Route path="/student/dashboard/ask-doubt" element={<AskDoubt />} />
        <Route path="/student/dashboard/join-course" element={<JoinCourse />} />
        <Route path="/student/dashboard/available-courses" element={<AvailableCourses />} />
        
        {/* Teacher Dashboard Sub-Routes */}
        <Route path="/teacher/dashboard/overview" element={<TeacherOverview />} />
        <Route path="/teacher/dashboard/profile" element={<TeacherProfile />} />
        <Route path="/teacher/dashboard/create-course" element={<CreateCourse />} />
        <Route path="/teacher/dashboard/your-courses" element={<YourCourses />} />
        <Route path="/teacher/dashboard/course/:courseId" element={<TeacherCourseDetails />} />
        <Route path="/teacher/dashboard/create-class" element={<CreateClass />} />
        <Route path="/teacher/dashboard/class-page/:classId" element={<ClassPage />} />
        <Route path="/teacher/dashboard/joined-students/:classId" element={<JoinedStudents />} />
        <Route path="/teacher/dashboard/doubts-tabs/all" element={<AllDoubtsTeacher />} />
        <Route path="/teacher/dashboard/doubts-tabs/unanswered" element={<UnansweredDoubts />} />
        <Route path="/teacher/dashboard/doubts-tabs/answered" element={<AnsweredDoubtsTeacher />} />
      </Routes>
    </Router>
  );
};

export default App;
