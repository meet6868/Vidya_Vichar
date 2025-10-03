import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const AttendedCourses = ({ userData, onCourseSelect }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData?.id) {
      fetchEnrolledCourses();
    }
  }, [userData]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.student.getEnrolledCourses();
      
      if (response.success && response.data?.courses) {
        setEnrolledCourses(response.data.courses);
      } else {
        setError(response.message || 'Failed to fetch enrolled courses');
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError('Failed to load enrolled courses. Please try again.');
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Attended Courses</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-600">Loading your attended courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Attended Courses</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={fetchEnrolledCourses}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Attended Courses</h2>
        <p className="text-slate-600">Click on any course to view lectures and doubts</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Enrolled Courses</h3>
          <p className="text-slate-600 mb-6">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onCourseSelect && onCourseSelect(course)}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                    {course.course_name || 'Unnamed Course'}
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">
                    <span className="font-medium">Course ID:</span> {course.course_id || 'N/A'}
                  </p>
                  <p className="text-slate-600 text-sm">
                    <span className="font-medium">Instructor:</span> {course.instructor || 'Not assigned'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
                    ✓ Enrolled
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  {course.student_list && (
                    <span>
                      <span className="font-medium">Students:</span> {course.student_list.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-indigo-600 group-hover:text-indigo-700 font-medium">
                  <span className="text-sm">View Lectures</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendedCourses;
