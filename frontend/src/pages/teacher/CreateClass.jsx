import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../config/api';

const CreateClass = ({ userData, onClassCreated }) => {
  const [formData, setFormData] = useState({
    lecture_id: '',
    lecture_title: '',
    course_id: '',
    class_start: '',
    class_end: ''
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [createdLecture, setCreatedLecture] = useState(null);

  // Fetch teacher's courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, [userData]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      console.log('🔍 fetchCourses: Starting API call for CreateClass...');
      
      const response = await apiRequest('/users/teacher/courses/detailed');
      console.log('🔍 fetchCourses API response:', response);
      
      if (response.success) {
        const coursesData = response.data || [];
        // Transform the data to match our expected format
        const formattedCourses = coursesData.map(course => ({
          course_id: course.course_id,
          course_name: course.course_name
        }));
        setCourses(formattedCourses);
      } else {
        console.error('Failed to fetch courses:', response.message);
        // Fallback to empty array if API fails
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to empty array on error
      setCourses([]);
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

      console.log('🔍 Creating lecture with data:', {
        lecture_title: formData.lecture_title,
        course_id: formData.course_id,
        class_start: formData.class_start,
        class_end: formData.class_end
      });

      const response = await apiRequest('/users/teacher/lecture', {
        method: 'POST',
        body: JSON.stringify({
          lecture_title: formData.lecture_title,
          course_id: formData.course_id,
          class_start: formData.class_start,
          class_end: formData.class_end
        })
      });

      if (response.success) {
        setMessage({ text: 'Lecture created successfully!', type: 'success' });
        
        // Prepare lecture data for the ClassPage
        const lectureData = {
          lecture_id: response.data?.lecture?.lecture_id,
          lecture_title: formData.lecture_title,
          course_id: formData.course_id,
          class_start: formData.class_start,
          class_end: formData.class_end,
          lec_num: response.data?.lecture?.lec_num
        };
        
        console.log('🔍 Created lecture data:', lectureData);
        
        // Store the created lecture data to show join option
        setCreatedLecture(lectureData);
        
        // Reset form
        setFormData({
          lecture_id: '',
          lecture_title: '',
          course_id: '',
          class_start: '',
          class_end: ''
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

  const handleJoinClass = () => {
    if (createdLecture && onClassCreated) {
      onClassCreated(createdLecture);
    }
  };

  const handleCreateAnother = () => {
    setCreatedLecture(null);
    setMessage({ text: '', type: '' });
  };

  const isClassLive = () => {
    if (!createdLecture) return false;
    const now = new Date();
    const startTime = new Date(createdLecture.class_start);
    const endTime = new Date(createdLecture.class_end);
    return now >= startTime && now <= endTime;
  };

  const getClassStatus = () => {
    if (!createdLecture) return 'Unknown';
    const now = new Date();
    const startTime = new Date(createdLecture.class_start);
    const endTime = new Date(createdLecture.class_end);
    
    if (now < startTime) return 'Scheduled';
    if (now >= startTime && now <= endTime) return 'Live Now';
    if (now > endTime) return 'Completed';
    return 'Unknown';
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

  // Show success view with join options after lecture creation
  if (createdLecture) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Lecture Created Successfully!</h1>
          <p className="text-slate-600">Your lecture has been scheduled. You can now join the class or create another lecture.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Created Lecture Info Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Lecture Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{createdLecture.lecture_title}</h3>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  isClassLive() ? 'bg-green-100 text-green-800' : 
                  getClassStatus() === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                  'bg-slate-100 text-slate-600'
                }`}>
                  {isClassLive() ? '🔴 Live Now' : getClassStatus()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Course:</span> {createdLecture.course_id}
                </div>
                <div>
                  <span className="font-medium">Lecture:</span> {createdLecture.lec_num || 'New'}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {new Date(createdLecture.class_start).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {
                    `${new Date(createdLecture.class_start).toLocaleTimeString()} - ${new Date(createdLecture.class_end).toLocaleTimeString()}`
                  }
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={handleJoinClass}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {isClassLive() ? 'Join Live Class' : 'Go to Class Page'}
              </button>
              
              <button
                onClick={handleCreateAnother}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Another Lecture
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">✨ What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">🎥</span>
                <span><strong>Join Class:</strong> Click "Join Live Class" to start managing your lecture and interact with students</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">❓</span>
                <span><strong>Manage Doubts:</strong> Answer student questions and doubts during the live session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">📚</span>
                <span><strong>View All:</strong> Check your completed lectures to see all past sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">➕</span>
                <span><strong>Create More:</strong> Schedule additional lectures for your courses</span>
              </li>
            </ul>
          </div>
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

            {/* Course Selection */}
            <div>
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