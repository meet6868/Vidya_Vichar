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
    try {
      // Backend automatically filters by student's branch and batch
      const response = await api.student.getAllCourses();
      
      if (response.success && response.data && response.data.courses) {
        setAvailableCourses(response.data.courses);
        console.log('Available courses loaded:', response.data.courses);
        console.log('First course structure:', response.data.courses[0]);
      } else {
        console.error('Failed to load available courses:', response.message);
        setAvailableCourses([]);
      }
    } catch (error) {
      console.log('Failed to load courses:', error);
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
        setMessage(`Successfully joined course ${courseCode}!`);
        setMessageType('success');
        setCourseCode('');
        // Refresh available courses
        loadAvailableCourses();
      } else {
        setMessage(response.message || 'Failed to join course. Please check the course code.');
        setMessageType('error');
      }
    } catch (error) {
      console.log('Join course API error:', error);
      setMessage('Failed to join course. Please try again.');
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
                Joining Course...
              </div>
            ) : (
              'Join Course'
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
                    <div key={course.id}
                      className="border border-slate-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2">{course.name}</h3>
                          <p className="text-indigo-600 font-semibold text-sm mb-1">Code: {course.id}</p>
                          {course.instructor && (
                            <p className="text-slate-600 text-sm">Instructor: {course.instructor}</p>
                          )}
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Available
                        </span>
                      </div>

                      <button
                        onClick={() => handleQuickJoin(course.id)}
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Joining...' : 'Join Course'}
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
          <p>• Make sure you have the correct course code before joining</p>
          <p>• Contact your instructor if you're having trouble joining a course</p>
          <p>• You can only join courses that match your academic program</p>
        </div>
      </div>
    </div>
  );
};

export default JoinCourse;