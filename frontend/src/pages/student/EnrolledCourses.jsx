import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const EnrolledCourses = ({ userData }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporarily bypass API and show mock data for testing
    const bypassAPI = false; // Set to true to skip API call

    console.log(userData)
    
    if (bypassAPI) {
      console.log('Bypassing API, showing mock data');
      setEnrolledCourses([
        {
          id: 1,
          course_name: 'Mathematics 101',
          instructor: 'Dr. Sarah Johnson',
          duration: 10368000000,
          remainingTime: 2592000000,
          TAs: [{ name: 'John Smith', roll_no: 'TA001' }]
        }
      ]);
      setLoading(false);
      return;
    }

    if (userData?.id) {
      fetchEnrolledCourses();
    } else {
      console.log('Waiting for user data...');
    }
  }, [userData]);

  const fetchEnrolledCourses = async () => {
    if (!userData?.id) {
      console.log('No user data available, skipping enrolled courses fetch');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log('Fetching enrolled courses for user:', userData);
    
    try {
      // The backend gets user ID from authentication token, no need to pass it
      const response = await api.student.getEnrolledCourses();

      console.log('Enrolled courses API response:', response);

      if (response.success && response.data && response.data.courses) {
        setEnrolledCourses(response.data.courses);
        console.log('Enrolled courses loaded successfully:', response.data.courses);
        console.log('First course structure:', response.data.courses[0]);
      } else {
        console.error('API returned unsuccessful response:', response);
        // Show mock data when API doesn't return proper data
        setEnrolledCourses([
          {
            id: 1,
            course_name: 'Mathematics 101',
            instructor: 'Dr. Sarah Johnson',
            duration: 10368000000, // 4 months in ms
            remainingTime: 2592000000, // 1 month remaining in ms
            TAs: [
              { name: 'John Smith', roll_no: 'TA001' },
              { name: 'Alice Brown', roll_no: 'TA002' }
            ]
          },
          {
            id: 2,
            course_name: 'Physics 201',
            instructor: 'Prof. Michael Davis', 
            duration: 12960000000, // 5 months in ms
            remainingTime: 5184000000, // 2 months remaining in ms
            TAs: [
              { name: 'Bob Wilson', roll_no: 'TA003' }
            ]
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      // Show mock data when API call fails
      setEnrolledCourses([
        {
          id: 1,
          course_name: 'Mathematics 101',
          instructor: 'Dr. Sarah Johnson',
          duration: 10368000000, // 4 months in ms
          remainingTime: 2592000000, // 1 month remaining in ms
          TAs: [
            { name: 'John Smith', roll_no: 'TA001' },
            { name: 'Alice Brown', roll_no: 'TA002' }
          ]
        },
        {
          id: 2,
          course_name: 'Physics 201',
          instructor: 'Prof. Michael Davis', 
          duration: 12960000000, // 5 months in ms
          remainingTime: 5184000000, // 2 months remaining in ms
          TAs: [
            { name: 'Bob Wilson', roll_no: 'TA003' }
          ]
        }
      ]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };  const calculateProgress = (duration, remainingTime) => {
    if (!duration || duration <= 0) return 0;
    if (!remainingTime || remainingTime <= 0) return 100;
    
    const elapsed = duration - remainingTime;
    const progress = Math.round((elapsed / duration) * 100);
    
    // Ensure progress is between 0 and 100
    return Math.max(0, Math.min(100, progress));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading enrolled courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Enrolled Courses</h1>
        <p className="text-slate-600">Track your progress and stay up to date with your courses</p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => {
          const progress = calculateProgress(course.duration, course.remainingTime);
          
          return (
            <div
              key={course.id}
              className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              {/* TA Hover Tooltip */}
              {course.TAs && course.TAs.length > 0 && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="relative">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-help">
                      TA
                    </div>
                    <div className="absolute top-8 right-0 w-56 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="font-medium mb-1">Teaching Assistants:</div>
                      <div className="space-y-1">
                        {course.TAs.map((ta, index) => (
                          <div key={index} className="flex justify-between">
                            <span>• {ta.name}</span>
                            <span className="text-slate-300">({ta.roll_no})</span>
                          </div>
                        ))}
                      </div>
                      <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-8">
                  <h3 className="text-xl font-bold text-blue-900 mb-1">{course.name || course.course_name}</h3>
                  <p className="text-slate-600 text-sm">Instructor: {course.instructor}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold text-blue-900 bg-white/70">
                  {progress}% Complete
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-sm font-medium text-slate-700">{progress}%</span>
                </div>
                <div className="w-full bg-white/70 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (if no courses) */}
      {enrolledCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Enrolled Courses</h3>
          <p className="text-slate-600 mb-6">You haven't enrolled in any courses yet. Browse available courses to get started!</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
            Browse Courses
          </button>
        </div>
      )}

      {/* Course Statistics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Course Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</div>
            <div className="text-sm text-slate-600">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">
              {enrolledCourses.length > 0 
                ? Math.round(enrolledCourses.reduce((acc, course) => {
                    const progress = calculateProgress(course.duration, course.remainingTime);
                    return acc + progress;
                  }, 0) / enrolledCourses.length) 
                : 0}%
            </div>
            <div className="text-sm text-slate-600">Average Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses;