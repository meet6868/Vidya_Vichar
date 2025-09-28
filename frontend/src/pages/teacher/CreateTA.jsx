import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const CreateTA = ({ userData }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
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

  const fetchStudents = async (courseId) => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      // Use real API call to get course students
      const response = await api.teacher.getCourseStudents(courseId);
      
      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        console.error('Failed to fetch students:', response.message);
        setStudents([]);
        setMessage({ type: 'error', text: response.message || 'Failed to fetch students' });
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents([]);
      setMessage({ type: 'error', text: 'Failed to fetch students' });
    } finally {
      setLoading(false);
    }
  };

  const makeTA = async (studentId) => {
    try {
      // Use real API call to make student a TA
      const response = await api.teacher.assignTA(selectedCourse, studentId);
      
      if (response.success) {
        // Update local state
        setStudents(prev => prev.map(student => 
          student.id === studentId || student.student_id === studentId
            ? { ...student, is_TA: true }
            : student
        ));
        setMessage({ type: 'success', text: 'Student successfully made TA!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to make student TA' });
      }
    } catch (error) {
      console.error('Failed to make student TA:', error);
      setMessage({ type: 'error', text: 'Failed to make student TA' });
    }
  };

  const removeTA = async (studentId) => {
    try {
      // Use real API call to remove TA status
      const response = await api.teacher.removeTA(selectedCourse, studentId);
      
      if (response.success) {
        // Update local state
        setStudents(prev => prev.map(student => 
          student.id === studentId || student.student_id === studentId
            ? { ...student, is_TA: false }
            : student
        ));
        setMessage({ type: 'success', text: 'TA status removed successfully!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to remove TA status' });
      }
    } catch (error) {
      console.error('Failed to remove TA status:', error);
      setMessage({ type: 'error', text: 'Failed to remove TA status' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Manage Teaching Assistants</h2>
        <p className="text-slate-600">Assign or remove TA status for students in your courses</p>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Course</h3>
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            fetchStudents(e.target.value);
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a course...</option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_id} - {course.course_name}
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

      {/* Students List */}
      {selectedCourse && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Students in Course</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Loading students...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {students.map((student) => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="text-sm text-slate-600">{student.roll_no}</p>
                    </div>
                    {student.is_TA && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Current TA
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {student.is_TA ? (
                      <button
                        onClick={() => removeTA(student.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Remove TA
                      </button>
                    ) : (
                      <button
                        onClick={() => makeTA(student.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Make TA
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {students.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No students found in this course
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateTA;