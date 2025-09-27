import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Dashboard.css';


const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const storedUserData = localStorage.getItem('userData');

    if (!token || userRole !== 'teacher') {
      navigate('/teacher/login');
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
    <div className="dashboard teacher-dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" className="dashboard-logo">Vidya Vichar</Link>
            <span className="user-role">Teacher Dashboard</span>
          </div>
          <div className="header-actions">
            <span className="welcome-text">Welcome, Prof. {userData.name}</span>
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
              <span className="nav-icon">🏫</span>
              My Classes
            </button>
            <button 
              className={`nav-item ${activeSection === 'students' ? 'active' : ''}`}
              onClick={() => setActiveSection('students')}
            >
              <span className="nav-icon">👨‍🎓</span>
              Students
            </button>
            <button 
              className={`nav-item ${activeSection === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveSection('questions')}
            >
              <span className="nav-icon">❓</span>
              Q&A Center
            </button>
            <button 
              className={`nav-item ${activeSection === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveSection('assignments')}
            >
              <span className="nav-icon">📝</span>
              Assignments
            </button>
            <button 
              className={`nav-item ${activeSection === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveSection('materials')}
            >
              <span className="nav-icon">📚</span>
              Materials
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
              <h2 className="section-title">Teaching Overview</h2>
              <div className="stats-grid">
                <div className="stat-card teacher-stat">
                  <div className="stat-icon">🏫</div>
                  <div className="stat-info">
                    <h3>4</h3>
                    <p>Active Classes</p>
                  </div>
                </div>
                <div className="stat-card teacher-stat">
                  <div className="stat-icon">👨‍🎓</div>
                  <div className="stat-info">
                    <h3>85</h3>
                    <p>Total Students</p>
                  </div>
                </div>
                <div className="stat-card teacher-stat">
                  <div className="stat-icon">❓</div>
                  <div className="stat-info">
                    <h3>23</h3>
                    <p>Pending Questions</p>
                  </div>
                </div>
                <div className="stat-card teacher-stat">
                  <div className="stat-icon">📝</div>
                  <div className="stat-info">
                    <h3>12</h3>
                    <p>Assignments to Grade</p>
                  </div>
                </div>
              </div>

              <div className="teacher-quick-actions">
                <h3>Quick Actions</h3>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn">
                    <span className="action-icon">📚</span>
                    <span>Create New Class</span>
                  </button>
                  <button className="quick-action-btn">
                    <span className="action-icon">📝</span>
                    <span>Create Assignment</span>
                  </button>
                  <button className="quick-action-btn">
                    <span className="action-icon">📄</span>
                    <span>Upload Material</span>
                  </button>
                  <button className="quick-action-btn">
                    <span className="action-icon">💬</span>
                    <span>Send Announcement</span>
                  </button>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">👨‍🎓</span>
                    <div className="activity-content">
                      <p><strong>New student enrolled</strong> in Computer Science 101</p>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">❓</span>
                    <div className="activity-content">
                      <p><strong>Question answered</strong> in Mathematics class</p>
                      <span className="activity-time">3 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📝</span>
                    <div className="activity-content">
                      <p><strong>Assignment graded</strong> for Physics 301</p>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'classes' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">My Classes</h2>
                <button className="primary-btn">Create New Class</button>
              </div>
              <div className="classes-grid teacher-classes">
                <div className="class-card teacher-class">
                  <div className="class-header">
                    <h3>Computer Science 101</h3>
                    <span className="class-code">CS101</span>
                  </div>
                  <p className="class-schedule">Mon, Wed, Fri - 10:00 AM</p>
                  <div className="class-stats">
                    <span>25 Students</span>
                    <span>8 Assignments</span>
                    <span>12 Questions</span>
                  </div>
                  <div className="class-actions">
                    <button className="class-btn">Manage Class</button>
                    <button className="class-btn secondary">View Analytics</button>
                  </div>
                </div>
                <div className="class-card teacher-class">
                  <div className="class-header">
                    <h3>Advanced Programming</h3>
                    <span className="class-code">CS301</span>
                  </div>
                  <p className="class-schedule">Tue, Thu - 2:00 PM</p>
                  <div className="class-stats">
                    <span>18 Students</span>
                    <span>6 Assignments</span>
                    <span>8 Questions</span>
                  </div>
                  <div className="class-actions">
                    <button className="class-btn">Manage Class</button>
                    <button className="class-btn secondary">View Analytics</button>
                  </div>
                </div>
                <div className="class-card teacher-class">
                  <div className="class-header">
                    <h3>Data Structures</h3>
                    <span className="class-code">CS201</span>
                  </div>
                  <p className="class-schedule">Mon, Wed - 3:00 PM</p>
                  <div className="class-stats">
                    <span>22 Students</span>
                    <span>10 Assignments</span>
                    <span>15 Questions</span>
                  </div>
                  <div className="class-actions">
                    <button className="class-btn">Manage Class</button>
                    <button className="class-btn secondary">View Analytics</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'students' && (
            <div className="dashboard-section">
              <h2 className="section-title">Student Management</h2>
              <div className="students-overview">
                <div className="students-stats">
                  <div className="students-summary">
                    <h3>All Students: 85</h3>
                    <p>Across all classes</p>
                  </div>
                </div>
                <div className="students-list">
                  <div className="student-item">
                    <div className="student-avatar">JS</div>
                    <div className="student-info">
                      <h4>John Smith</h4>
                      <p>Computer Science 101, Advanced Programming</p>
                      <span className="student-grade">Average: 4.2/5</span>
                    </div>
                    <button className="student-btn">View Details</button>
                  </div>
                  <div className="student-item">
                    <div className="student-avatar">AD</div>
                    <div className="student-info">
                      <h4>Alice Davis</h4>
                      <p>Data Structures, Computer Science 101</p>
                      <span className="student-grade">Average: 4.8/5</span>
                    </div>
                    <button className="student-btn">View Details</button>
                  </div>
                  <div className="student-item">
                    <div className="student-avatar">MB</div>
                    <div className="student-info">
                      <h4>Mike Brown</h4>
                      <p>Advanced Programming</p>
                      <span className="student-grade">Average: 3.9/5</span>
                    </div>
                    <button className="student-btn">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'questions' && (
            <div className="dashboard-section">
              <h2 className="section-title">Q&A Center</h2>
              <div className="questions-filters">
                <button className="filter-btn active">All Questions (23)</button>
                <button className="filter-btn">Unanswered (15)</button>
                <button className="filter-btn">Answered (8)</button>
              </div>
              <div className="teacher-questions-list">
                <div className="teacher-question-item urgent">
                  <div className="question-header">
                    <h4>How do I implement a binary search tree?</h4>
                    <span className="question-tag">Urgent</span>
                  </div>
                  <p className="question-meta">Data Structures • John Smith • 2 hours ago</p>
                  <p className="question-preview">I'm struggling with the implementation of BST insert method...</p>
                  <button className="answer-btn">Answer Question</button>
                </div>
                <div className="teacher-question-item">
                  <div className="question-header">
                    <h4>Explain polymorphism in OOP</h4>
                    <span className="question-tag answered">Answered</span>
                  </div>
                  <p className="question-meta">Computer Science 101 • Alice Davis • 1 day ago</p>
                  <p className="question-preview">Can you provide examples of polymorphism?</p>
                  <button className="answer-btn secondary">View Answer</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'assignments' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Assignment Management</h2>
                <button className="primary-btn">Create Assignment</button>
              </div>
              <div className="assignments-overview">
                <div className="assignment-stats">
                  <div className="stat-item">
                    <h4>12</h4>
                    <p>To Grade</p>
                  </div>
                  <div className="stat-item">
                    <h4>8</h4>
                    <p>Active</p>
                  </div>
                  <div className="stat-item">
                    <h4>25</h4>
                    <p>Completed</p>
                  </div>
                </div>
                <div className="teacher-assignments-list">
                  <div className="teacher-assignment-item">
                    <div className="assignment-info">
                      <h4>Programming Project #3</h4>
                      <p>Computer Science 101 • Due: Oct 10, 2025</p>
                      <span className="submissions-count">18/25 submissions</span>
                    </div>
                    <div className="assignment-actions">
                      <button className="grade-btn">Grade Submissions (7)</button>
                      <button className="view-btn">View Assignment</button>
                    </div>
                  </div>
                  <div className="teacher-assignment-item">
                    <div className="assignment-info">
                      <h4>Algorithm Analysis</h4>
                      <p>Data Structures • Due: Oct 8, 2025</p>
                      <span className="submissions-count">22/22 submissions</span>
                    </div>
                    <div className="assignment-actions">
                      <button className="grade-btn">Grade Submissions (5)</button>
                      <button className="view-btn">View Assignment</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'materials' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Course Materials</h2>
                <button className="primary-btn">Upload Material</button>
              </div>
              <div className="materials-grid">
                <div className="material-category">
                  <h3>Computer Science 101</h3>
                  <div className="materials-list">
                    <div className="material-item">
                      <span className="material-icon">📄</span>
                      <span className="material-name">Introduction to Programming.pdf</span>
                      <button className="material-btn">Edit</button>
                    </div>
                    <div className="material-item">
                      <span className="material-icon">🎥</span>
                      <span className="material-name">OOP Concepts Video</span>
                      <button className="material-btn">Edit</button>
                    </div>
                  </div>
                </div>
                <div className="material-category">
                  <h3>Data Structures</h3>
                  <div className="materials-list">
                    <div className="material-item">
                      <span className="material-icon">📄</span>
                      <span className="material-name">Trees and Graphs.pdf</span>
                      <button className="material-btn">Edit</button>
                    </div>
                    <div className="material-item">
                      <span className="material-icon">💻</span>
                      <span className="material-name">Code Examples</span>
                      <button className="material-btn">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="dashboard-section">
              <h2 className="section-title">Profile Settings</h2>
              <div className="profile-card teacher-profile">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span className="avatar-initial">{userData.name.charAt(0)}</span>
                  </div>
                  <div className="profile-info">
                    <h3>Prof. {userData.name}</h3>
                    <p className="profile-role">Teacher</p>
                    <p className="profile-department">{userData.department}</p>
                    <p className="profile-id">ID: {userData.universityId}</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{userData.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <p>{userData.department}</p>
                  </div>
                  <div className="detail-item">
                    <label>University ID</label>
                    <p>{userData.universityId}</p>
                  </div>
                  <div className="detail-item">
                    <label>Teaching Since</label>
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

export default TeacherDashboard;