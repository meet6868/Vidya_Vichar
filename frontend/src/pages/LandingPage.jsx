import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <h1 className="logo">Vidya Vichar</h1>
          <nav>
            <Link to="/student/login" className="nav-link">Student Login</Link>
            <Link to="/teacher/login" className="nav-link">Teacher Login</Link>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="container">
            <h2 className="hero-title">Welcome to Vidya Vichar</h2>
            <p className="hero-subtitle">
              A platform connecting students and teachers for better learning experiences
            </p>
            
            <div className="cta-buttons">
              <Link to="/student/register" className="cta-button primary">
                Join as Student
              </Link>
              <Link to="/teacher/register" className="cta-button secondary">
                Join as Teacher
              </Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h3>Why Choose Vidya Vichar?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <h4>For Students</h4>
                <ul>
                  <li>Ask questions and get answers</li>
                  <li>Join classes and discussions</li>
                  <li>Access learning resources</li>
                  <li>Connect with teachers</li>
                </ul>
              </div>
              <div className="feature-card">
                <h4>For Teachers</h4>
                <ul>
                  <li>Create and manage classes</li>
                  <li>Answer student questions</li>
                  <li>Share learning materials</li>
                  <li>Track student progress</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2025 Vidya Vichar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;