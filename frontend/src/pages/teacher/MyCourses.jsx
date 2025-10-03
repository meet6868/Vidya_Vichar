import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const MyCourses = ({ userData, onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData) {
      fetchCourses();
    }
  }, [userData]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all courses where teacher is creator or member
      const response = await api.teacher.getAllCourses();
      
      if (response.success && response.data) {
        setCourses(response.data.courses || []);
      } else {
        setError(response.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    onCourseSelect(course);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="ml-3 text-slate-600">Loading courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
          <span className="text-xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Courses</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 mb-6">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">No Courses Found</h3>
        <p className="text-slate-600 mb-6 max-w-sm mx-auto">
          You haven't created any courses yet or aren't assigned to any courses.
        </p>
        <button
          onClick={() => onCourseSelect({ action: 'create-new' })}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-lg mr-2">➕</span>
          Create Your First Course
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-600 mt-1">
            Manage your courses, students, and teaching assistants
          </p>
        </div>
        <button
          onClick={() => onCourseSelect({ action: 'create-new' })}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-lg mr-2">➕</span>
          Create New Course
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-lg">📚</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Courses</p>
              <p className="text-2xl font-bold text-blue-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-lg">👥</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Total Students</p>
              <p className="text-2xl font-bold text-green-900">
                {courses.reduce((total, course) => total + ((course.student_list || []).length), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <span className="text-amber-600 text-lg">⏳</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-600">Pending Requests</p>
              <p className="text-2xl font-bold text-amber-900">
                {courses.reduce((total, course) => total + (course.request_list?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={course.course_id || index}
            className="group cursor-pointer"
            onClick={() => handleCourseClick(course)}
          >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 group-hover:shadow-md group-hover:border-indigo-200 transition-all duration-200 transform group-hover:-translate-y-1">
              {/* Course Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors duration-200">
                    {course.course_name}
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    {course.course_id}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-200">
                  <span className="text-lg">📖</span>
                </div>
              </div>

              {/* Course Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-16 font-medium">Batch:</span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 font-medium">
                    {course.batch}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-16 font-medium">Branch:</span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 font-medium">
                    {course.branch}
                  </span>
                </div>

                {course.valid_time && (
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-16 font-medium">Valid till:</span>
                    <span className="text-slate-700">
                      {new Date(course.valid_time).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">
                      {(course.student_list || []).length}
                    </div>
                    <div className="text-slate-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-600">
                      {(course.request_list || []).length}
                    </div>
                    <div className="text-slate-500">Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">
                      {(course.TA || []).length}
                    </div>
                    <div className="text-slate-500">TAs</div>
                  </div>
                </div>
              </div>

              {/* Action Hint */}
              <div className="mt-4 text-center">
                <span className="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors duration-200">
                  Click to manage course →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;