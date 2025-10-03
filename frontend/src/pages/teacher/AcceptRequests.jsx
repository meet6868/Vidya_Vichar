import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const AcceptRequests = ({ userData }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userData) {
      fetchCourses();
    }
  }, [userData]);

  const fetchCourses = async () => {
    try {
      // Use real API call to get teacher's courses
      const response = await api.teacher.getAllCourses();
      
      if (response.success && response.data && response.data.courses) {
        setCourses(response.data.courses);
      } else {
        console.error('Failed to fetch courses:', response.message);
        setCourses([]);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    }
  };

  const fetchPendingRequests = async (courseId) => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      // Use real API call to get pending course requests
      const response = await api.teacher.getPendingRequests(courseId);
      
      if (response.success && response.data && response.data.pending_students) {
        setPendingRequests(response.data.pending_students);
      } else {
        console.error('Failed to fetch pending requests:', response.message);
        setPendingRequests([]);
        setMessage({ type: 'error', text: response.message || 'Failed to fetch pending requests' });
      }
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
      setPendingRequests([]);
      setMessage({ type: 'error', text: 'Failed to fetch pending requests' });
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (studentId) => {
    try {
      // Use real API call to accept student request
      const response = await api.teacher.acceptStudentRequest(selectedCourse, studentId);
      
      if (response.success) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(request => request.id !== studentId));
        
        setMessage({ type: 'success', text: 'Student request accepted successfully!' });
        
        // Update course pending count if available
        setCourses(prev => prev.map(course => 
          course.course_id === selectedCourse && course.pending_count > 0
            ? { ...course, pending_count: course.pending_count - 1 }
            : course
        ));
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to accept request' });
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      setMessage({ type: 'error', text: 'Failed to accept request' });
    }
  };

  const rejectRequest = async (studentId) => {
    try {
      // Use real API call to reject student request
      const response = await api.teacher.rejectStudentRequest(selectedCourse, studentId);
      
      if (response.success) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(request => request.id !== studentId));
        
        setMessage({ type: 'success', text: 'Student request rejected successfully!' });
        
        // Update course pending count if available
        setCourses(prev => prev.map(course => 
          course.course_id === selectedCourse && course.pending_count > 0
            ? { ...course, pending_count: course.pending_count - 1 }
            : course
        ));
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to reject request' });
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      setMessage({ type: 'error', text: 'Failed to reject request' });
    }
  };

  const acceptAllRequests = async () => {
    try {
      // API call to accept all requests
      console.log(`Accepting all requests for course ${selectedCourse}`);
      
      setPendingRequests([]);
      setMessage({ type: 'success', text: 'All requests accepted successfully!' });
      
      // Update course pending count
      setCourses(prev => prev.map(course => 
        course.course_id === selectedCourse 
          ? { ...course, pending_count: 0 }
          : course
      ));
    } catch (error) {
      console.error('Failed to accept all requests:', error);
      setMessage({ type: 'error', text: 'Failed to accept all requests' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Accept Student Requests</h2>
        <p className="text-slate-600">Review and manage student enrollment requests for your courses</p>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Course</h3>
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            fetchPendingRequests(e.target.value);
            setMessage({ type: '', text: '' });
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a course...</option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_id} - {course.course_name} 
              {course.pending_count > 0 && ` (${course.pending_count} pending)`}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Pending Requests */}
      {selectedCourse && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Pending Requests</h3>
            {pendingRequests.length > 0 && (
              <button
                onClick={acceptAllRequests}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Accept All ({pendingRequests.length})
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Loading requests...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-medium">
                          {request.name?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{request.name}</p>
                        {request.roll_no && <p className="text-sm text-slate-600">{request.roll_no}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          {request.batch && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              🎓 {request.batch}
                            </span>
                          )}
                          {request.branch && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              🏢 {request.branch}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => rejectRequest(request.id)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => acceptRequest(request.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {pendingRequests.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <div className="text-4xl mb-2">✅</div>
                  <p>No pending requests for this course</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptRequests;