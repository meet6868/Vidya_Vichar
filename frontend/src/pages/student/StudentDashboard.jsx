import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../config/api.js';
import '../Dashboard.css';

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if auth bypass is enabled
    const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true';
    
    if (bypassAuth) {
      // Mock user data for development
      setUserData({
        name: 'John Doe',
        universityId: 'STU001',
        email: 'john.doe@university.edu',
        role: 'student'
      });
      setLoading(false);
    } else {
      // Check if user is logged in (cookie-based authentication)
      // Token is stored in HTTP-only cookies, so we check userRole and userData
      const userRole = localStorage.getItem('userRole');
      const storedUserData = localStorage.getItem('userData');

      if (userRole !== 'student') {
        navigate('/student/login');
        return;
      }

      // Safely parse user data with error handling
      if (storedUserData && storedUserData !== 'undefined') {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Set fallback user data if JSON parsing fails
          setUserData({
            name: 'Student',
            universityId: 'Unknown',
            email: 'student@university.edu',
            role: 'student'
          });
        }
      } else {
        console.log('No valid user data found in localStorage');
        // Set fallback user data
        setUserData({
          name: 'Student',
          universityId: 'Unknown',
          email: 'student@university.edu',
          role: 'student'
        });
      }
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookie using the API helper
      await apiRequest('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.log('Logout API call failed, but continuing with client-side cleanup');
    }
    
    // Clear client-side data
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/');
  };

  // Section rendering functions
  const renderOverview = () => (
    <div>
      <h3>Student Overview</h3>
      <p>Welcome to your dashboard, {userData?.name}!</p>
      <div className="overview-stats">
        <div className="stat-card">
          <h4>Enrolled Courses</h4>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h4>Completed Assignments</h4>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h4>Pending Doubts</h4>
          <p>2</p>
        </div>
      </div>
    </div>
  );

  const renderEnrolledCourses = () => (
    <div>
      <h3>Enrolled Courses</h3>
      <p>View all your enrolled courses</p>
      <div className="course-list">
        <div className="course-card">
          <h4>Mathematics 101</h4>
          <p>Progress: 75%</p>
        </div>
        <div className="course-card">
          <h4>Physics 201</h4>
          <p>Progress: 60%</p>
        </div>
        <div className="course-card">
          <h4>Chemistry 301</h4>
          <p>Progress: 90%</p>
        </div>
      </div>
    </div>
  );

  const renderAvailableCourses = () => (
    <div>
      <h3>Available Courses</h3>
      <p>Discover new courses to enroll in</p>
      <div className="course-list">
        <div className="course-card">
          <h4>Advanced Calculus</h4>
          <p>Instructor: Dr. Johnson | Duration: 12 weeks</p>
          <button className="primary-btn">Enroll Now</button>
        </div>
        <div className="course-card">
          <h4>Data Structures</h4>
          <p>Instructor: Prof. Davis | Duration: 16 weeks</p>
          <button className="primary-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );

  const renderClasses = () => (
    <div>
      <h3>My Classes</h3>
      <p>View your upcoming and past classes</p>
      <div className="class-list">
        <div className="class-item">
          <h4>Mathematics - Integration</h4>
          <p>Today, 10:00 AM | Room: 101</p>
        </div>
        <div className="class-item">
          <h4>Physics - Mechanics</h4>
          <p>Tomorrow, 2:00 PM | Room: 205</p>
        </div>
      </div>
    </div>
  );

  const renderAllDoubts = () => (
    <div>
      <h3>All Doubts</h3>
      <p>View all your submitted questions</p>
      <div className="doubt-list">
        <div className="doubt-item">
          <h4>Question about Integration by Parts</h4>
          <p>Subject: Mathematics | Status: Pending</p>
        </div>
        <div className="doubt-item answered">
          <h4>Physics Lab Equipment</h4>
          <p>Subject: Physics | Status: Answered</p>
        </div>
      </div>
    </div>
  );

  const renderAnsweredDoubts = () => (
    <div>
      <h3>Answered Doubts</h3>
      <p>Your questions that have been answered</p>
      <div className="doubt-list">
        <div className="doubt-item answered">
          <h4>Chemistry Equation Balancing</h4>
          <p>Answered by: Dr. Smith | Yesterday</p>
        </div>
      </div>
    </div>
  );

  const renderAskDoubt = () => (
    <div>
      <h3>Ask a Question</h3>
      <p>Submit your doubts and get help from teachers</p>
      <form className="create-form">
        <select>
          <option>Select Subject</option>
          <option>Mathematics</option>
          <option>Physics</option>
          <option>Chemistry</option>
        </select>
        <input type="text" placeholder="Question Title" />
        <textarea placeholder="Describe your doubt in detail"></textarea>
        <button type="submit" className="primary-btn">Submit Question</button>
      </form>
    </div>
  );

  const renderJoinCourse = () => (
    <div>
      <h3>Join Course</h3>
      <p>Enter course code to join a new course</p>
      <form className="create-form">
        <input type="text" placeholder="Course Code" />
        <button type="submit" className="primary-btn">Join Course</button>
      </form>
    </div>
  );

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return renderOverview();
      case 'enrolled-courses': return renderEnrolledCourses();
      case 'available-courses': return renderAvailableCourses();
      case 'classes': return renderClasses();
      case 'all-doubts': return renderAllDoubts();
      case 'answered-doubts': return renderAnsweredDoubts();
      case 'ask-doubt': return renderAskDoubt();
      case 'join-course': return renderJoinCourse();
      default: return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" className="dashboard-logo">Vidya Vichar</Link>
            <span className="user-role">Student Dashboard</span>
          </div>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {userData?.name || 'Student'}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div 
              onClick={() => setActiveSection('overview')} 
              className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              Overview
            </div>
            <div 
              onClick={() => setActiveSection('enrolled-courses')} 
              className={`nav-item ${activeSection === 'enrolled-courses' ? 'active' : ''}`}
            >
              <span className="nav-icon">📚</span>
              Enrolled Courses
            </div>
            <div 
              onClick={() => setActiveSection('available-courses')} 
              className={`nav-item ${activeSection === 'available-courses' ? 'active' : ''}`}
            >
              <span className="nav-icon">🔍</span>
              Available Courses
            </div>
            <div 
              onClick={() => setActiveSection('classes')} 
              className={`nav-item ${activeSection === 'classes' ? 'active' : ''}`}
            >
              <span className="nav-icon">🏫</span>
              My Classes
            </div>
            <div 
              onClick={() => setActiveSection('all-doubts')} 
              className={`nav-item ${activeSection === 'all-doubts' ? 'active' : ''}`}
            >
              <span className="nav-icon">❓</span>
              All Doubts
            </div>
            <div 
              onClick={() => setActiveSection('answered-doubts')} 
              className={`nav-item ${activeSection === 'answered-doubts' ? 'active' : ''}`}
            >
              <span className="nav-icon">✅</span>
              Answered Doubts
            </div>
            <div 
              onClick={() => setActiveSection('ask-doubt')} 
              className={`nav-item ${activeSection === 'ask-doubt' ? 'active' : ''}`}
            >
              <span className="nav-icon">💭</span>
              Ask Doubt
            </div>
            <div 
              onClick={() => setActiveSection('join-course')} 
              className={`nav-item ${activeSection === 'join-course' ? 'active' : ''}`}
            >
              <span className="nav-icon">➕</span>
              Join Course
            </div>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-section">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
