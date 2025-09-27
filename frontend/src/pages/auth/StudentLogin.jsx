import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../config/api.js';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
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
    
    if (!formData.username.trim()) newErrors.push('Email is required');
    if (!formData.password) newErrors.push('Password is required');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const data = await api.auth.studentLogin({
        username: formData.username, // Send as username to match backend
        password: formData.password
      });

      if (data.success) {
        // Token is automatically stored in cookies by the backend
        // Store user data and role for client-side use
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        localStorage.setItem('userRole', 'student');
        
        // Show success message
        console.log('Login successful:', data.message);
        console.log('Token stored in cookies with expiration time');
        
        // Redirect to student dashboard
        navigate('/student/dashboard');
      } else {
        setErrors([data.message || 'Login failed']);
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
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] ring-1 ring-slate-200/50 hover:ring-indigo-200/50 hover:bg-white/98">
          {/* Subtle inner glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none transition-all duration-500 hover:from-indigo-500/10 hover:to-purple-500/10"></div>
          
          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Student <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Login</span>
              </h1>
              <p className="text-slate-600 mt-3">Welcome back! Please sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-6">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-50/80 backdrop-blur border border-red-200 rounded-xl p-4 shadow-sm">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm font-medium">{error}</p>
                ))}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none bg-white/80 backdrop-blur shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none bg-white/80 backdrop-blur shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="relative mt-8 pt-6 border-t border-slate-200/60 text-center space-y-3">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/student/register" 
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Register here
              </Link>
            </p>
            <p className="text-slate-600 text-sm">
              Are you a teacher?{' '}
              <Link 
                to="/teacher/login" 
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Teacher Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLogin;