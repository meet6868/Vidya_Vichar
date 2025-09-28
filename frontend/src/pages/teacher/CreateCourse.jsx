import React, { useState } from 'react';
import { apiRequest } from '../../config/api';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    batch: 'B.Tech',
    branch: 'CSE',
    valid_time: '',
    additional_teachers: '',
    tas: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Validate required fields
      if (!formData.course_id || !formData.course_name || !formData.valid_time) {
        throw new Error('Please fill in all required fields');
      }

      const response = await apiRequest('/users/teacher/course', {
        method: 'POST',
        body: JSON.stringify({
          course_id: formData.course_id,
          course_name: formData.course_name,
          batch: formData.batch,
          branch: formData.branch,
          valid_time: formData.valid_time,
          additional_teachers: formData.additional_teachers ? 
            formData.additional_teachers.split(',').map(id => id.trim()).filter(id => id) : [],
          tas: formData.tas ? 
            formData.tas.split(',').map(id => id.trim()).filter(id => id) : []
        })
      });

      if (response.success) {
        setMessage({ text: 'Course created successfully!', type: 'success' });
        // Reset form
        setFormData({
          course_id: '',
          course_name: '',
          batch: 'B.Tech',
          branch: 'CSE',
          valid_time: '',
          additional_teachers: '',
          tas: ''
        });
      } else {
        throw new Error(response.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage({ text: error.message || 'Failed to create course', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Course</h1>
        <p className="text-slate-600">Set up a new course for your students to join.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course ID */}
            <div>
              <label htmlFor="course_id" className="block text-sm font-medium text-slate-700 mb-2">
                Course ID *
              </label>
              <input
                type="text"
                id="course_id"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                placeholder="e.g., CS101, MATH201"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Unique identifier for the course (e.g., CS101, MATH201)
              </p>
            </div>

            {/* Course Name */}
            <div>
              <label htmlFor="course_name" className="block text-sm font-medium text-slate-700 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                id="course_name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                placeholder="e.g., Introduction to Computer Science"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Batch and Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-slate-700 mb-2">
                  Batch *
                </label>
                <select
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="PHD">PHD</option>
                  <option value="MS">MS</option>
                </select>
              </div>

              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-slate-700 mb-2">
                  Branch *
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>
            </div>

            {/* Valid Until Date */}
            <div>
              <label htmlFor="valid_time" className="block text-sm font-medium text-slate-700 mb-2">
                Course Valid Until *
              </label>
              <input
                type="datetime-local"
                id="valid_time"
                name="valid_time"
                value={formData.valid_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Students can enroll in this course until this date
              </p>
            </div>

            {/* Additional Teachers */}
            <div>
              <label htmlFor="additional_teachers" className="block text-sm font-medium text-slate-700 mb-2">
                Additional Teachers
              </label>
              <input
                type="text"
                id="additional_teachers"
                name="additional_teachers"
                value={formData.additional_teachers}
                onChange={handleChange}
                placeholder="e.g., TEACHER_001, TEACHER_002"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                Comma-separated teacher IDs. You will be added automatically as the primary teacher.
              </p>
            </div>

            {/* TAs */}
            <div>
              <label htmlFor="tas" className="block text-sm font-medium text-slate-700 mb-2">
                Teaching Assistants (TAs)
              </label>
              <input
                type="text"
                id="tas"
                name="tas"
                value={formData.tas}
                onChange={handleChange}
                placeholder="e.g., TA_001, TA_002"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                Comma-separated TA IDs who will assist with this course.
              </p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">💡 Tips for Creating Courses</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Course ID:</strong> Use a clear, unique identifier like "CS101" or "MATH201"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Course Name:</strong> Be descriptive so students understand the course content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Batch & Branch:</strong> Select the appropriate student category for enrollment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Valid Until:</strong> Set a reasonable deadline for student enrollment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;