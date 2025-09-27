import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../config/api.js';

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '', // email ID
    teacherId: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.name.trim()) newErrors.push('Name is required');
    if (!formData.username.trim()) newErrors.push('Email is required');
    if (!formData.teacherId.trim()) newErrors.push('Teacher ID is required');
    if (!formData.password) newErrors.push('Password is required');
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.username && !emailRegex.test(formData.username)) {
      newErrors.push('Please enter a valid email address');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const data = await api.auth.teacherRegister({
        name: formData.name,
        username: formData.username, // using username as email
        teacher_id: formData.teacherId,
        password: formData.password
      });

      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        localStorage.setItem('userRole', 'student');
        
        // Show success message
        console.log('Registration successful:', data.message);
        
        // Redirect to student dashboard
        navigate('/teacher/login');
      } else {
        setErrors([data.message]);
      }
    } catch (error) {
      setErrors([error.message || 'Network error. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-x-hidden">
      {/* Background accents matching landing page */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200/60 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-28 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-purple-200/60 to-transparent blur-3xl" />
      </div>
      
      {/* Header matching landing page */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand/logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white grid place-items-center shadow-sm">
              <span className="text-sm font-bold">VV</span>
            </div>
            <div className="leading-tight">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">Vidya Vichar</div>
              <div className="hidden sm:block text-[13px] text-slate-500">Learn. Ask. Grow.</div>
            </div>
          </div>

          {/* Back to Home Link */}
          <Link 
            to="/" 
            className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:text-indigo-700 hover:bg-indigo-50 hover:shadow-sm ring-1 ring-transparent hover:ring-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-2 py-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] ring-1 ring-slate-200/50 hover:ring-purple-200/50 hover:bg-white/98">
          {/* Subtle inner glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 pointer-events-none transition-all duration-500 hover:from-purple-500/10 hover:to-indigo-500/10"></div>
          
          {/* Header */}
          <div className="relative text-center mb-6">
            <div className="mb-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Teacher <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Registration</span>
              </h1>
              <p className="text-slate-600 mt-2 text-sm">Join Vidya Vichar as a Teacher</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-4">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-50/80 backdrop-blur border border-red-200 rounded-xl p-3 shadow-sm">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-600 text-xs font-medium">{error}</p>
                ))}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none bg-white/80 backdrop-blur shadow-sm hover:shadow-md focus:shadow-lg text-sm"
              />
            </div>

            {/* Teacher ID Field */}
            <div className="space-y-1">
              <label htmlFor="teacherId" className="block text-xs font-semibold text-slate-700">
                Teacher ID
              </label>
              <input
                type="text"
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleInputChange}
                placeholder="Enter your teacher ID"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none bg-white/80 backdrop-blur shadow-sm hover:shadow-md focus:shadow-lg text-sm"
              />
            </div>

            {/* Email/Username Field */}
            <div className="space-y-1">
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none bg-white/80 backdrop-blur shadow-sm hover:shadow-md focus:shadow-lg text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password (min 6 characters)"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none bg-white/80 backdrop-blur shadow-sm hover:shadow-md focus:shadow-lg text-sm"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="relative mt-6 pt-4 border-t border-slate-200/60 text-center">
            <p className="text-slate-600 text-xs">
              Already have an account?{' '}
              <Link 
                to="/teacher/login" 
                className="text-purple-600 hover:text-purple-700 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherRegister;