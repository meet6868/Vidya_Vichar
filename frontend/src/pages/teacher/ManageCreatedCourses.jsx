import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const ManageCreatedCourses = ({ userData }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);

  useEffect(() => {
    if (userData) {
      fetchCourses();
    }
  }, [userData]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Use real API call to get teacher's courses
      const response = await api.teacher.getAllCourses();
      
      if (response.success && response.data && response.data.courses) {
        // For each course, we need additional data like enrolled count and pending count
        const coursesWithStats = await Promise.all(
          response.data.courses.map(async (course) => {
            try {
              // Get students for enrolled count
              const studentsResponse = await api.teacher.getAllStudents(course.course_id);
              const enrolledCount = studentsResponse.success ? studentsResponse.data.students.length : 0;
              
              // Get pending requests count
              const pendingResponse = await api.teacher.getPendingRequests(course.course_id);
              const pendingCount = pendingResponse.success ? pendingResponse.data.pending_students.length : 0;
              
              return {
                ...course,
                enrolled_count: enrolledCount,
                pending_count: pendingCount
              };
            } catch (error) {
              console.error(`Error fetching stats for course ${course.course_id}:`, error);
              return {
                ...course,
                enrolled_count: 0,
                pending_count: 0
              };
            }
          })
        );
        
        setCourses(coursesWithStats);
      } else {
        console.error('Failed to fetch courses:', response.message);
        setCourses([]);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      setLoading(true);
      // Use real API call to get students in course
      const response = await api.teacher.getAllStudents(courseId);
      
      if (response.success && response.data && response.data.students) {
        setStudents(response.data.students.map(student => ({
          id: student.id,
          name: student.name,
          roll_no: student.roll_no || 'N/A', // Backend might not have roll_no in this endpoint
          is_TA: student.is_TA || false
        })));
      } else {
        console.error('Failed to fetch students:', response.message);
        setStudents([]);
      }
      setShowStudents(true);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents([]);
      setShowStudents(true);
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (studentId, courseId) => {
    try {
      // API call to remove student
      const response = await api.teacher.removeStudent(courseId, studentId);
      
      if (response.success) {
        // Refresh students list
        fetchStudents(courseId);
      } else {
        console.error('Failed to remove student:', response.message);
        alert('Failed to remove student: ' + response.message);
      }
    } catch (error) {
      console.error('Failed to remove student:', error);
      alert('Failed to remove student: ' + error.message);
    }
  };

  if (loading && !showStudents) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (showStudents) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowStudents(false)}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <span>←</span>
            Back to Courses
          </button>
          <h2 className="text-2xl font-bold text-slate-900">
            Students in {selectedCourse?.course_name}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Enrolled Students</h3>
          </div>
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
                      TA
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeStudent(student.id, selectedCourse.course_id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Manage Your Courses</h2>
        <p className="text-slate-600">View and manage students in your courses</p>
      </div>

      <div className="grid gap-6">
        {courses.map((course) => (
          <div key={course.course_id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{course.course_name}</h3>
                <p className="text-slate-600">{course.course_id}</p>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    <span>🎓</span>
                    {course.batch}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    <span>🏢</span>
                    {course.branch}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    fetchStudents(course.course_id);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Students
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span>{course.enrolled_count} enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⏳</span>
                <span>{course.pending_count} pending</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCreatedCourses;