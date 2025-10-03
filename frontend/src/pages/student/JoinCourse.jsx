import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const JoinCourse = ({ userData }) => {
  const [courseCode, setCourseCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  
  // State for available courses (automatically filtered by backend)
  const [availableCourses, setAvailableCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  // Effect to load available courses when component mounts
  useEffect(() => {
    if (userData?.id) {
      loadAvailableCourses();
    }
  }, [userData]);

  const loadAvailableCourses = async () => {
    setIsLoadingCourses(true);
    
    // Quick authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found! User needs to login again.');
      setMessage('Authentication failed. Please login again.');
      setMessageType('error');
      setAvailableCourses([]);
      setIsLoadingCourses(false);
      return;
    }
    
    try {
      // Backend automatically filters by student's branch and batch
      const response = await api.student.getAllCourses();
      
      if (response.success && response.data && response.data.courses) {
        setAvailableCourses(response.data.courses);
        console.log('Available courses loaded:', response.data.courses.length, 'courses');
      } else {
        console.error('Failed to load available courses:', response.message);
        setAvailableCourses([]);
      }
    } catch (error) {
      console.error('Failed to load courses:', error.message);
      
      // Check if it's an authentication error
      if (error.message.includes('No token provided') || error.message.includes('Invalid token')) {
        setMessage('Authentication failed. Please login again.');
        setMessageType('error');
      }
      
      setAvailableCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleJoinCourse = async (e) => {
    e.preventDefault();
    if (!courseCode.trim()) {
      setMessage('Please enter a course code');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Use the backend endpoint for joining courses - pass course_id
      const response = await api.student.joinCourse(courseCode.trim());

      if (response.success) {
        setMessage(`Successfully requested to join course ${courseCode}! Your request is pending approval.`);
        setMessageType('success');
        setCourseCode('');
        // Refresh available courses
        loadAvailableCourses();
      } else {
        // Show the specific backend error message
        setMessage(response.message || 'Failed to join course. Please check the course code.');
        setMessageType('error');
      }
    } catch (error) {
      console.log('Join course API error:', error);
      
      // Show the specific error message from the backend API
      let errorMessage = 'Failed to join course. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Already requested to join this course')) {
          errorMessage = 'You have already requested to join this course. Please wait for teacher approval.';
        } else if (error.message.includes('Already enrolled in this course')) {
          errorMessage = 'You are already enrolled in this course.';
        } else if (error.message.includes('Course not found')) {
          errorMessage = 'Course not found. Please check the course code and try again.';
        } else if (error.message.includes('Authentication failed') || error.message.includes('Invalid token')) {
          errorMessage = 'Authentication failed. Please login again.';
        } else {
          // Use the exact backend error message
          errorMessage = error.message;
        }
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickJoin = (code) => {
    setCourseCode(code);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Join New Course</h1>
        <p className="text-slate-600">Enter a course code to join or browse suggested courses below</p>
      </div>

      {/* Join Course Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Join with Course Code</h2>
        
        <form onSubmit={handleJoinCourse} className="space-y-4">
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-slate-700 mb-2">
              Course Code
            </label>
            <input
              type="text"
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              placeholder="e.g., CS301, MATH201"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              disabled={isLoading}
            />
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !courseCode.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Requesting to Join...
              </div>
            ) : (
              'Request to Join Course'
            )}
          </button>
        </form>
      </div>

      {/* Available Courses for Your Branch & Batch */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Available Courses</h2>
          <p className="text-slate-600 text-sm mt-1">Courses available for your branch and batch</p>
        </div>

        {/* Authentication Error Display */}
        {message && messageType === 'error' && message.includes('Authentication') && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{message}</span>
            </div>
            <p className="text-sm mt-2">Please refresh the page and try logging in again.</p>
          </div>
        )}

        {/* Loading State */}
        {isLoadingCourses && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600">Loading courses...</span>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoadingCourses && (
          <>
            {availableCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableCourses.map((course) => (
                    <div key={course.id || course.course_id} className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {course.name || course.course_name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {course.course_id || course.id}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Instructor: {course.instructor || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {course.batch}
                        </span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          {course.branch}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickJoin(course.course_id || course.id)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Quick Join
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Courses Available</h3>
                <p className="text-slate-600">
                  No courses are currently available for your branch and batch.
                </p>
                <button 
                  onClick={loadAvailableCourses}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Refresh Courses
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Need Help?</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p>• Course codes are typically provided by your instructors</p>
          <p>• Available courses are automatically filtered for your branch and batch</p>
          <p>• Joining a course creates a request that needs teacher approval</p>
          <p>• You'll be notified once your course request is approved</p>
          <p>• Contact your instructor if you're having trouble with course requests</p>
          <p>• You can only request courses that match your academic program</p>
        </div>
      </div>
    </div>
  );
};

export default JoinCourse;