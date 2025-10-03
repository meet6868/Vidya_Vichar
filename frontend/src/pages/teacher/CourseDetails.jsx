import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const CourseDetails = ({ userData, selectedCourse, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courseData, setCourseData] = useState(selectedCourse || {});
  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (selectedCourse && selectedCourse.course_id) {
      fetchCourseData();
    }
  }, [selectedCourse]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course students
      const studentsResponse = await api.teacher.getCourseStudents(selectedCourse.course_id);
      if (studentsResponse.success) {
        setStudents(studentsResponse.data || []);
      }

      // Fetch pending requests
      const requestsResponse = await api.teacher.getPendingRequests();
      if (requestsResponse.success) {
        const courseRequests = requestsResponse.data.filter(req => 
          req.course_id === selectedCourse.course_id
        );
        setPendingRequests(courseRequests);
      }

      // Fetch all teachers for adding to course
      const teachersResponse = await api.teacher.getAllTeachers();
      if (teachersResponse.success) {
        setAvailableTeachers(teachersResponse.data || []);
      }

    } catch (error) {
      console.error('Failed to fetch course data:', error);
      setMessage({ type: 'error', text: 'Failed to load course data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (studentId) => {
    try {
      const response = await api.teacher.acceptPendingRequests({
        course_id: selectedCourse.course_id,
        student_ids: [studentId]
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Request accepted successfully!' });
        fetchCourseData(); // Refresh data
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to accept request' });
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      setMessage({ type: 'error', text: 'Failed to accept request' });
    }
  };

  const handleRejectRequest = async (studentId) => {
    try {
      const response = await api.teacher.rejectPendingRequests({
        course_id: selectedCourse.course_id,
        student_ids: [studentId]
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Request rejected successfully!' });
        fetchCourseData(); // Refresh data
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to reject request' });
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      setMessage({ type: 'error', text: 'Failed to reject request' });
    }
  };

  const handleMakeTA = async (studentId) => {
    try {
      const response = await api.teacher.makeStudentTA({
        course_id: selectedCourse.course_id,
        student_id: studentId
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Student assigned as TA successfully!' });
        fetchCourseData(); // Refresh data
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to assign TA' });
      }
    } catch (error) {
      console.error('Failed to make TA:', error);
      setMessage({ type: 'error', text: 'Failed to assign TA' });
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const response = await api.teacher.removeStudentFromCourse({
        course_id: selectedCourse.course_id,
        student_id: studentId
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Student removed successfully!' });
        fetchCourseData(); // Refresh data
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to remove student' });
      }
    } catch (error) {
      console.error('Failed to remove student:', error);
      setMessage({ type: 'error', text: 'Failed to remove student' });
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Course Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedCourse.course_name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Course ID</p>
            <p className="text-lg font-semibold text-slate-900">{selectedCourse.course_id}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Batch</p>
            <p className="text-lg font-semibold text-slate-900">{selectedCourse.batch}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Branch</p>
            <p className="text-lg font-semibold text-slate-900">{selectedCourse.branch}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Valid Till</p>
            <p className="text-lg font-semibold text-slate-900">
              {new Date(selectedCourse.valid_time).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Enrolled Students</p>
              <p className="text-3xl font-bold text-green-900">
                {selectedCourse.student_list?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <span className="text-amber-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-amber-600">Pending Requests</p>
              <p className="text-3xl font-bold text-amber-900">
                {selectedCourse.request_list?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <span className="text-indigo-600 text-xl">👨‍🎓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-indigo-600">Teaching Assistants</p>
              <p className="text-3xl font-bold text-indigo-900">
                {selectedCourse.TA?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Enrolled Students</h3>
        <span className="text-sm text-slate-500">
          {students.length} student{students.length !== 1 ? 's' : ''}
        </span>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">👥</span>
          <p className="text-slate-600">No students enrolled yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {students.map((student, index) => (
                  <tr key={student.student_id || index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{student.name}</div>
                      <div className="text-sm text-slate-500">{student.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {student.roll_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedCourse.TA?.includes(student.student_id)
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedCourse.TA?.includes(student.student_id) ? 'TA' : 'Student'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {!selectedCourse.TA?.includes(student.student_id) && (
                        <button
                          onClick={() => handleMakeTA(student.student_id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Make TA
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveStudent(student.student_id)}
                        className="text-red-600 hover:text-red-900 font-medium ml-4"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Pending Requests</h3>
        <span className="text-sm text-slate-500">
          {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''}
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">✅</span>
          <p className="text-slate-600">No pending requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request, index) => (
            <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-slate-900">{request.student_name}</h4>
                  <p className="text-sm text-slate-600">Roll No: {request.roll_no}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Requested: {new Date(request.requested_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAcceptRequest(request.student_id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.student_id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Back to Courses
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{selectedCourse.course_name}</h1>
            <p className="text-slate-600">{selectedCourse.course_id}</p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'students', name: 'Students & TAs', icon: '👥' },
            { id: 'requests', name: 'Requests', icon: '⏳' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="ml-3 text-slate-600">Loading...</span>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'students' && renderStudents()}
            {activeTab === 'requests' && renderRequests()}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;