import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Dashboard.css';


const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const storedUserData = localStorage.getItem('userData');

    if (!token || userRole !== 'student') {
      navigate('/student/login');
      return;
    }

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (!userData) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" className="dashboard-logo">Vidya Vichar</Link>
            <span className="user-role">Student Dashboard</span>
          </div>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {userData.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <span className="nav-icon">📊</span>
              Overview
            </button>
            <button 
              className={`nav-item ${activeSection === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveSection('classes')}
            >
              <span className="nav-icon">📚</span>
              My Classes
            </button>
            <button 
              className={`nav-item ${activeSection === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveSection('questions')}
            >
              <span className="nav-icon">❓</span>
              Questions
            </button>
            <button 
              className={`nav-item ${activeSection === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveSection('assignments')}
            >
              <span className="nav-icon">📝</span>
              Assignments
            </button>
            <button 
              className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="nav-icon">👤</span>
              Profile
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {activeSection === 'overview' && (
            <div className="dashboard-section">
              <h2 className="section-title">Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <h3>3</h3>
                    <p>Active Classes</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❓</div>
                  <div className="stat-info">
                    <h3>12</h3>
                    <p>Questions Asked</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>8</h3>
                    <p>Assignments Completed</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>4.5</h3>
                    <p>Average Grade</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">📚</span>
                    <div className="activity-content">
                      <p><strong>Joined</strong> Computer Science 101</p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">❓</span>
                    <div className="activity-content">
                      <p><strong>Asked a question</strong> in Mathematics</p>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">✅</span>
                    <div className="activity-content">
                      <p><strong>Completed</strong> Physics Assignment #3</p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'classes' && (
            <div className="dashboard-section">
              <h2 className="section-title">My Classes</h2>
              <div className="classes-grid">
                <div className="class-card">
                  <div className="class-header">
                    <h3>Computer Science 101</h3>
                    <span className="class-code">CS101</span>
                  </div>
                  <p className="class-teacher">Prof. John Smith</p>
                  <p className="class-schedule">Mon, Wed, Fri - 10:00 AM</p>
                  <div className="class-stats">
                    <span>25 Students</span>
                    <span>8 Assignments</span>
                  </div>
                  <button className="class-btn">View Class</button>
                </div>
                <div className="class-card">
                  <div className="class-header">
                    <h3>Mathematics</h3>
                    <span className="class-code">MATH201</span>
                  </div>
                  <p className="class-teacher">Prof. Sarah Johnson</p>
                  <p className="class-schedule">Tue, Thu - 2:00 PM</p>
                  <div className="class-stats">
                    <span>30 Students</span>
                    <span>6 Assignments</span>
                  </div>
                  <button className="class-btn">View Class</button>
                </div>
                <div className="class-card">
                  <div className="class-header">
                    <h3>Physics</h3>
                    <span className="class-code">PHY301</span>
                  </div>
                  <p className="class-teacher">Prof. David Wilson</p>
                  <p className="class-schedule">Mon, Wed - 3:00 PM</p>
                  <div className="class-stats">
                    <span>20 Students</span>
                    <span>5 Assignments</span>
                  </div>
                  <button className="class-btn">View Class</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'questions' && (
            <div className="dashboard-section">
              <h2 className="section-title">My Questions</h2>
              <button className="primary-btn mb-4">Ask New Question</button>
              <div className="questions-list">
                <div className="question-item">
                  <div className="question-header">
                    <h4>How do I solve quadratic equations?</h4>
                    <span className="question-status answered">Answered</span>
                  </div>
                  <p className="question-meta">Mathematics • 2 days ago • 3 answers</p>
                  <p className="question-preview">I'm having trouble understanding the quadratic formula...</p>
                </div>
                <div className="question-item">
                  <div className="question-header">
                    <h4>What is object-oriented programming?</h4>
                    <span className="question-status pending">Pending</span>
                  </div>
                  <p className="question-meta">Computer Science 101 • 1 day ago • 0 answers</p>
                  <p className="question-preview">Can someone explain OOP concepts with examples?</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'assignments' && (
            <div className="dashboard-section">
              <h2 className="section-title">Assignments</h2>
              <div className="assignments-container">
                <div className="assignment-filters">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Pending</button>
                  <button className="filter-btn">Completed</button>
                  <button className="filter-btn">Overdue</button>
                </div>
                <div className="assignments-list">
                  <div className="assignment-item">
                    <div className="assignment-header">
                      <h4>Programming Assignment #4</h4>
                      <span className="assignment-status pending">Pending</span>
                    </div>
                    <p className="assignment-meta">Computer Science 101 • Due: Oct 5, 2025</p>
                    <p className="assignment-description">Create a simple calculator using Python</p>
                    <button className="assignment-btn">Start Assignment</button>
                  </div>
                  <div className="assignment-item">
                    <div className="assignment-header">
                      <h4>Physics Lab Report</h4>
                      <span className="assignment-status completed">Completed</span>
                    </div>
                    <p className="assignment-meta">Physics • Submitted: Sep 28, 2025</p>
                    <p className="assignment-description">Analyze the motion of projectiles</p>
                    <button className="assignment-btn secondary">View Submission</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="dashboard-section">
              <h2 className="section-title">Profile Settings</h2>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span className="avatar-initial">{userData.name.charAt(0)}</span>
                  </div>
                  <div className="profile-info">
                    <h3>{userData.name}</h3>
                    <p className="profile-role">Student</p>
                    <p className="profile-id">ID: {userData.universityId}</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{userData.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>University ID</label>
                    <p>{userData.universityId}</p>
                  </div>
                  <div className="detail-item">
                    <label>Member Since</label>
                    <p>September 2025</p>
                  </div>
                </div>
                <button className="primary-btn">Edit Profile</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;