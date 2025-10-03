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

const App = () => {
  // Global app configurations can go here
  React.useEffect(() => {
    // Set up localStorage monitoring for debugging
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;
    
    localStorage.removeItem = function(key) {
      console.log('🗑️ localStorage.removeItem called:', key);
      console.trace('Call stack:');
      return originalRemoveItem.call(this, key);
    };
    
    localStorage.clear = function() {
      console.log('🗑️ localStorage.clear called');
      console.trace('Call stack:');
      return originalClear.call(this);
    };
    
    // Set up global error handling
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    // Set up global fetch interceptor for API calls - TEMPORARILY DISABLED FOR DEBUGGING
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Log all requests for debugging
        const url = args[0];
        console.log('=== FETCH REQUEST ===');
        console.log('URL:', url);
        console.log('Status:', response.status);
        console.log('OK:', response.ok);
        
        // Handle 401 responses globally (token expiry) - TEMPORARILY DISABLED FOR DEBUGGING
        if (response.status === 401) {
          console.log('=== 401 UNAUTHORIZED RESPONSE ===');
          console.log('URL that failed:', url);
          console.log('Response headers:', [...response.headers.entries()]);
          console.log('Current localStorage token exists:', !!localStorage.getItem('token'));
          console.log('Current localStorage userRole:', localStorage.getItem('userRole'));
          
          // TEMPORARILY DISABLED - DO NOT CLEAR SESSION
          console.log('🚫 INTERCEPTOR DISABLED - NOT CLEARING SESSION');
          console.log('🚫 This would normally clear localStorage and redirect to home');
          console.log('🚫 If you see this message, it means API calls are failing with 401');
          
          /*
          // Clear session for API endpoints that return 401 (token expired/invalid)
          if (typeof url === 'string' && (url.includes('/api/') || url.includes('/auth/'))) {
            console.log('API endpoint returned 401, clearing session and redirecting');
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
            window.location.href = '/';
          } else {
            console.log('Non-API request returned 401, not clearing session');
          }
          */
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
      localStorage.removeItem = originalRemoveItem;
      localStorage.clear = originalClear;
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
        
        {/* Note: StudentDashboard and TeacherDashboard handle their own internal routing */}
        {/* Sub-routes are managed internally within the dashboard components */}
      </Routes>
    </Router>
  );
};

export default App;
