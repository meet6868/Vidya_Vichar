import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const PendingCourses = ({ userData }) => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format duration from milliseconds
  const formatDuration = (durationMs) => {
    if (!durationMs) return 'N/A';
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  // Helper function to format remaining time
  const formatRemainingTime = (remainingTimeMs) => {
    if (!remainingTimeMs || remainingTimeMs < 0) return 'Expired';
    const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days remaining`;
    const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
    return `${hours} hours remaining`;
  };

  useEffect(() => {
    if (userData?.id) {
      fetchPendingCourses();
    } else {
      console.log('Waiting for user data...');
    }
  }, [userData]);

  const fetchPendingCourses = async () => {
    if (!userData?.id) {
      console.log('No user data available, skipping pending courses fetch');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log('Fetching pending courses for user:', userData);
    
    try {
      // The backend gets user ID from authentication token, no need to pass it
      const response = await api.student.getPendingCourses();

      console.log('Pending courses API response:', response);

      if (response.success && response.data && response.data.courses) {
        // Format pending courses data similar to enrolled courses
        const coursesWithFormattedData = response.data.courses.map(course => ({
          ...course,
          // Ensure we have both id formats for compatibility
          id: course.id || course._id,
          course_id: course.course_id || course.id,
          // Format duration and remaining time
          durationText: course.duration ? formatDuration(course.duration) : 'N/A',
          remainingTimeText: course.remainingTime ? formatRemainingTime(course.remainingTime) : 'N/A',
          // Ensure TAs is always an array
          TAs: course.TAs || []
        }));
        
        setPendingCourses(coursesWithFormattedData);
        console.log('Pending courses loaded successfully:', coursesWithFormattedData);
      } else {
        console.error('API returned unsuccessful response:', response);
        // Show empty array when API doesn't return proper data
        setPendingCourses([]);
      }
    } catch (error) {
      console.error('Error fetching pending courses:', error);
      // Show empty array when API call fails
      setPendingCourses([]);
    } finally {
      console.log('Setting loading to false for pending courses');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading pending course requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pending Course Requests</h1>
        <p className="text-slate-600">Course join requests awaiting teacher approval</p>
      </div>

      {/* Pending Courses Grid */}
      {pendingCourses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingCourses.map((course) => (
            <div
              key={course.id}
              className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm"
            >
              {/* Pending Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-orange-800 bg-orange-200">
                  Pending Approval
                </span>
              </div>

              <div className="pr-8">
                <h3 className="text-xl font-bold text-orange-900 mb-2">{course.course_name}</h3>
                <p className="text-slate-600 text-sm mb-1">Instructor: {course.instructor || 'Not assigned'}</p>
                <p className="text-slate-600 text-sm mb-1">Course ID: {course.course_id || course.id}</p>
                <p className="text-slate-600 text-sm mb-4">
                  Batch: {course.batch} | Branch: {course.branch}
                </p>
                
                {/* Status */}
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Waiting for teacher approval</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Pending Requests</h3>
          <p className="text-slate-600 mb-6">You don't have any course join requests pending approval.</p>
          <p className="text-slate-500 text-sm">
            When you request to join a course, it will appear here until approved by the instructor.
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">About Course Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">How it works:</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>• You request to join a course using the course code</p>
              <p>• Your request is sent to the course instructor</p>
              <p>• The instructor reviews and approves/denies requests</p>
              <p>• Once approved, you'll be enrolled in the course</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Request Status:</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>• <span className="font-medium text-orange-600">Pending:</span> Awaiting instructor approval</p>
              <p>• <span className="font-medium text-green-600">Approved:</span> You're enrolled in the course</p>
              <p>• <span className="font-medium text-red-600">Denied:</span> Request was not approved</p>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingCourses.length}</div>
            <div className="text-sm text-slate-600">Pending Requests</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingCourses;
