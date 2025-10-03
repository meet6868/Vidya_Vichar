import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const CreateLecture = ({ userData }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_id: '',
    lecture_title: '',
    class_start: '',
    class_end: ''
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.course_id || !formData.lecture_title || !formData.class_start || !formData.class_end) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    // Validate time
    const startTime = new Date(formData.class_start);
    const endTime = new Date(formData.class_end);
    
    if (startTime >= endTime) {
      setMessage({ type: 'error', text: 'End time must be after start time' });
      return;
    }

    if (startTime <= new Date()) {
      setMessage({ type: 'error', text: 'Start time must be in the future' });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare lecture data for API call
      const lectureData = {
        course_id: formData.course_id,
        lecture_title: formData.lecture_title,
        class_start: formData.class_start,
        class_end: formData.class_end
      };

      // Use real API call to create lecture
      const response = await api.teacher.createLecture(lectureData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Lecture created successfully!' });
        
        // Reset form
        setFormData({
          course_id: '',
          lecture_title: '',
          class_start: '',
          class_end: ''
        });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to create lecture' });
      }
      
    } catch (error) {
      console.error('Failed to create lecture:', error);
      setMessage({ type: 'error', text: 'Failed to create lecture. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get current datetime-local format
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Lecture</h2>
        <p className="text-slate-600">Schedule a new lecture session for your students</p>
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

      {/* Create Lecture Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection */}
          <div>
            <label htmlFor="course_id" className="block text-sm font-medium text-slate-700 mb-2">
              Select Course *
            </label>
            <select
              id="course_id"
              name="course_id"
              value={formData.course_id}
              onChange={handleInputChange}
              required
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

          {/* Lecture Title */}
          <div>
            <label htmlFor="lecture_title" className="block text-sm font-medium text-slate-700 mb-2">
              Lecture Title *
            </label>
            <input
              type="text"
              id="lecture_title"
              name="lecture_title"
              value={formData.lecture_title}
              onChange={handleInputChange}
              placeholder="e.g., Binary Search Trees - Implementation"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="class_start" className="block text-sm font-medium text-slate-700 mb-2">
              Start Time *
            </label>
            <input
              type="datetime-local"
              id="class_start"
              name="class_start"
              value={formData.class_start}
              onChange={handleInputChange}
              min={getCurrentDateTime()}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="class_end" className="block text-sm font-medium text-slate-700 mb-2">
              End Time *
            </label>
            <input
              type="datetime-local"
              id="class_end"
              name="class_end"
              value={formData.class_end}
              onChange={handleInputChange}
              min={formData.class_start || getCurrentDateTime()}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </span>
              ) : (
                'Create Lecture'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({
                course_id: '',
                lecture_title: '',
                class_start: '',
                class_end: ''
              })}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Creating Lectures</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Make sure to schedule lectures at least 15 minutes in advance</li>
          <li>• Use descriptive titles that help students understand the topic</li>
          <li>• Consider appropriate duration (typically 50-90 minutes)</li>
          <li>• Check for conflicts with other scheduled lectures</li>
          <li>• Students will be able to join 15 minutes before the start time</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateLecture;