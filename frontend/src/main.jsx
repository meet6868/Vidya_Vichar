import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/index.css'

// Import pages
import LandingPage from './pages/LandingPage'
import StudentLogin from './pages/auth/StudentLogin'
import TeacherLogin from './pages/auth/TeacherLogin'
import StudentRegister from './pages/auth/StudentRegister'
import TeacherRegister from './pages/auth/TeacherRegister'
import StudentDashboard from './pages/student/StudentDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)