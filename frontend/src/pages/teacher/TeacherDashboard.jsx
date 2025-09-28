import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../config/api.js';
import '../Dashboard.css';

const TeacherDashboard = () => {
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
        name: 'Dr. Jane Smith',
        teacherId: 'TEACH001',
        email: 'jane.smith@university.edu',
        role: 'teacher'
      });
      setLoading(false);
    } else {
      // Check if user is logged in (cookie-based authentication)
      // Token is stored in HTTP-only cookies, so we check userRole and userData
      const userRole = localStorage.getItem('userRole');
      const storedUserData = localStorage.getItem('userData');

      if (userRole !== 'teacher') {
        navigate('/teacher/login');
        return;
      }

      if (storedUserData && storedUserData !== 'undefined') {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch (error) {
          console.error('Error parsing userData:', error);
          // Clear invalid userData and redirect to login
          localStorage.removeItem('userData');
          navigate('/teacher/login');
          return;
        }
      } else {
        // No user data available, set a default or redirect to login
        console.log('No userData found, using default');
        setUserData({
          name: 'Teacher User',
          role: 'teacher'
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
      <h3>Teacher Overview</h3>
      <p>Welcome to your teaching dashboard, {userData?.name}!</p>
      <div className="overview-stats">
        <div className="stat-card">
          <h4>Total Courses</h4>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h4>Active Students</h4>
          <p>120</p>
        </div>
        <div className="stat-card">
          <h4>Pending Doubts</h4>
          <p>8</p>
        </div>
      </div>
    </div>
  );

  const renderYourCourses = () => (
    <div>
      <h3>Your Courses</h3>
      <p>Manage and view all your courses</p>
      <div className="course-list">
        <div className="course-card">Mathematics 101</div>
        <div className="course-card">Physics 201</div>
        <div className="course-card">Chemistry 301</div>
      </div>
    </div>
  );

  const renderCreateCourse = () => (
    <div>
      <h3>Create New Course</h3>
      <p>Create a new course for your students</p>
      <form className="create-form">
        <input type="text" placeholder="Course Name" />
        <input type="text" placeholder="Course Code" />
        <textarea placeholder="Course Description"></textarea>
        <button type="submit" className="primary-btn">Create Course</button>
      </form>
    </div>
  );

  const renderCreateClass = () => (
    <div>
      <h3>Create New Class</h3>
      <p>Schedule a new class session</p>
      <form className="create-form">
        <input type="text" placeholder="Class Title" />
        <input type="datetime-local" placeholder="Date & Time" />
        <textarea placeholder="Class Description"></textarea>
        <button type="submit" className="primary-btn">Create Class</button>
      </form>
    </div>
  );

  const renderClassPage = () => (
    <div>
      <h3>Class Page</h3>
      <p>Manage your class sessions and materials</p>
      <div className="class-list">
        <div className="class-item">
          <h4>Mathematics - Algebra</h4>
          <p>Today, 10:00 AM</p>
        </div>
        <div className="class-item">
          <h4>Physics - Mechanics</h4>
          <p>Tomorrow, 2:00 PM</p>
        </div>
      </div>
    </div>
  );

  const renderJoinedStudents = () => (
    <div>
      <h3>Joined Students</h3>
      <p>View all students enrolled in your courses</p>
      <div className="student-list">
        <div className="student-item">
          <h4>John Doe</h4>
          <p>Mathematics 101</p>
        </div>
        <div className="student-item">
          <h4>Jane Smith</h4>
          <p>Physics 201</p>
        </div>
      </div>
    </div>
  );

  const renderAllDoubts = () => (
    <div>
      <h3>All Doubts</h3>
      <p>View all student questions and doubts</p>
      <div className="doubt-list">
        <div className="doubt-item">
          <h4>Question about Integration</h4>
          <p>From: John Doe | Subject: Mathematics</p>
        </div>
        <div className="doubt-item">
          <h4>Physics Lab Procedure</h4>
          <p>From: Jane Smith | Subject: Physics</p>
        </div>
      </div>
    </div>
  );

  const renderUnansweredDoubts = () => (
    <div>
      <h3>Unanswered Doubts</h3>
      <p>Questions waiting for your response</p>
      <div className="doubt-list">
        <div className="doubt-item urgent">
          <h4>Chemistry Equation Balancing</h4>
          <p>From: Alice Johnson | Posted: 2 hours ago</p>
          <button className="primary-btn">Answer</button>
        </div>
      </div>
    </div>
  );

  const renderAnsweredDoubts = () => (
    <div>
      <h3>Answered Doubts</h3>
      <p>Previously answered student questions</p>
      <div className="doubt-list">
        <div className="doubt-item answered">
          <h4>Calculus Derivative</h4>
          <p>From: Bob Wilson | Answered: Yesterday</p>
        </div>
      </div>
    </div>
  );

  const renderCourseDetails = () => (
    <div>
      <h3>Course Details</h3>
      <p>Detailed information about your courses</p>
      <div className="course-details">
        <h4>Mathematics 101</h4>
        <p>Students: 45 | Duration: 16 weeks</p>
        <p>Next Class: Monday, 10:00 AM</p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div>
      <h3>Teacher Profile</h3>
      <p>Manage your profile information</p>
      <div className="profile-info">
        <p><strong>Name:</strong> {userData?.name}</p>
        <p><strong>Teacher ID:</strong> {userData?.teacherId}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
        <button className="primary-btn">Edit Profile</button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return renderOverview();
      case 'your-courses': return renderYourCourses();
      case 'create-course': return renderCreateCourse();
      case 'create-class': return renderCreateClass();
      case 'class-page': return renderClassPage();
      case 'joined-students': return renderJoinedStudents();
      case 'all-doubts': return renderAllDoubts();
      case 'unanswered-doubts': return renderUnansweredDoubts();
      case 'answered-doubts': return renderAnsweredDoubts();
      case 'course-details': return renderCourseDetails();
      case 'profile': return renderProfile();
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
            <span className="user-role">Teacher Dashboard</span>
          </div>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {userData?.name || 'Teacher'}</span>
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
              onClick={() => setActiveSection('your-courses')} 
              className={`nav-item ${activeSection === 'your-courses' ? 'active' : ''}`}
            >
              <span className="nav-icon">📚</span>
              Your Courses
            </div>
            <div 
              onClick={() => setActiveSection('create-course')} 
              className={`nav-item ${activeSection === 'create-course' ? 'active' : ''}`}
            >
              <span className="nav-icon">➕</span>
              Create Course
            </div>
            <div 
              onClick={() => setActiveSection('create-class')} 
              className={`nav-item ${activeSection === 'create-class' ? 'active' : ''}`}
            >
              <span className="nav-icon">🏫</span>
              Create Class
            </div>
            <div 
              onClick={() => setActiveSection('class-page')} 
              className={`nav-item ${activeSection === 'class-page' ? 'active' : ''}`}
            >
              <span className="nav-icon">📝</span>
              Class Page
            </div>
            <div 
              onClick={() => setActiveSection('joined-students')} 
              className={`nav-item ${activeSection === 'joined-students' ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              Joined Students
            </div>
            <div 
              onClick={() => setActiveSection('all-doubts')} 
              className={`nav-item ${activeSection === 'all-doubts' ? 'active' : ''}`}
            >
              <span className="nav-icon">❓</span>
              All Doubts
            </div>
            <div 
              onClick={() => setActiveSection('unanswered-doubts')} 
              className={`nav-item ${activeSection === 'unanswered-doubts' ? 'active' : ''}`}
            >
              <span className="nav-icon">⏳</span>
              Unanswered Doubts
            </div>
            <div 
              onClick={() => setActiveSection('answered-doubts')} 
              className={`nav-item ${activeSection === 'answered-doubts' ? 'active' : ''}`}
            >
              <span className="nav-icon">✅</span>
              Answered Doubts
            </div>
            <div 
              onClick={() => setActiveSection('course-details')} 
              className={`nav-item ${activeSection === 'course-details' ? 'active' : ''}`}
            >
              <span className="nav-icon">📋</span>
              Course Details
            </div>
            <div 
              onClick={() => setActiveSection('profile')} 
              className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            >
              <span className="nav-icon">👤</span>
              Profile
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

export default TeacherDashboard;
