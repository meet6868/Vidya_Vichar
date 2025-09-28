import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../config/api';

const CreateClass = ({ userData }) => {
  const [formData, setFormData] = useState({
    lecture_id: '',
    lecture_title: '',
    course_id: '',
    class_start: '',
    class_end: '',
    lec_num: 1
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch teacher's courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, [userData]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      // Mock data for now - replace with actual API call
      const mockCourses = [
        { course_id: 'CS101', course_name: 'Introduction to Computer Science' },
        { course_id: 'CS201', course_name: 'Data Structures and Algorithms' },
        { course_id: 'CS301', course_name: 'Database Management Systems' }
      ];
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateLectureId = () => {
    const courseId = formData.course_id;
    const lecNum = formData.lec_num;
    if (courseId) {
      return `${courseId}_LEC_${lecNum.toString().padStart(2, '0')}_${Date.now()}`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Validate required fields
      if (!formData.lecture_title || !formData.course_id || !formData.class_start || !formData.class_end) {
        throw new Error('Please fill in all required fields');
      }

      // Validate that end time is after start time
      const startTime = new Date(formData.class_start);
      const endTime = new Date(formData.class_end);
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }

      const lectureId = generateLectureId();
      
      const response = await apiRequest('/teacher/lecture', {
        method: 'POST',
        body: JSON.stringify({
          lecture_id: lectureId,
          lecture_title: formData.lecture_title,
          course_id: formData.course_id,
          class_start: formData.class_start,
          class_end: formData.class_end,
          lec_num: parseInt(formData.lec_num)
        })
      });

      if (response.success) {
        setMessage({ text: 'Lecture created successfully!', type: 'success' });
        // Reset form
        setFormData({
          lecture_id: '',
          lecture_title: '',
          course_id: '',
          class_start: '',
          class_end: '',
          lec_num: 1
        });
      } else {
        throw new Error(response.message || 'Failed to create lecture');
      }
    } catch (error) {
      console.error('Error creating lecture:', error);
      setMessage({ text: error.message || 'Failed to create lecture', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    // Add 1 hour to current time as default start time
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const getEndDateTime = (startDateTime) => {
    if (!startDateTime) return '';
    const start = new Date(startDateTime);
    // Add 1.5 hours as default duration
    start.setHours(start.getHours() + 1);
    start.setMinutes(start.getMinutes() + 30);
    return start.toISOString().slice(0, 16);
  };

  if (loadingCourses) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Lecture</h1>
        <p className="text-slate-600">Schedule a new lecture session for your students.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={handleChange}
                placeholder="e.g., Introduction to Arrays and Linked Lists"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Course Selection and Lecture Number */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="course_id" className="block text-sm font-medium text-slate-700 mb-2">
                  Course *
                </label>
                <select
                  id="course_id"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_id} - {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="lec_num" className="block text-sm font-medium text-slate-700 mb-2">
                  Lecture Number *
                </label>
                <input
                  type="number"
                  id="lec_num"
                  name="lec_num"
                  value={formData.lec_num}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Start and End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="class_start" className="block text-sm font-medium text-slate-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  id="class_start"
                  name="class_start"
                  value={formData.class_start}
                  onChange={(e) => {
                    handleChange(e);
                    // Auto-set end time when start time changes
                    if (!formData.class_end) {
                      setFormData(prev => ({
                        ...prev,
                        class_end: getEndDateTime(e.target.value)
                      }));
                    }
                  }}
                  min={getCurrentDateTime()}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="class_end" className="block text-sm font-medium text-slate-700 mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  id="class_end"
                  name="class_end"
                  value={formData.class_end}
                  onChange={handleChange}
                  min={formData.class_start}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Generated Lecture ID Display */}
            {formData.course_id && formData.lec_num && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Generated Lecture ID
                </label>
                <code className="text-sm text-slate-600 bg-white px-3 py-2 rounded border">
                  {generateLectureId()}
                </code>
              </div>
            )}

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
                    Creating Lecture...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Schedule Lecture
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">📝 Lecture Scheduling Tips</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Title:</strong> Use descriptive titles that help students understand the topic</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Course:</strong> Select from your created courses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Timing:</strong> Schedule lectures at least 1 hour in advance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span><strong>Duration:</strong> Typical lectures are 1-2 hours long</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;