import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const CompletedLectures = ({ userData }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchLectures = async (courseId) => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      // Use real API call to get course lectures
      const response = await api.teacher.getCourseLectures(courseId);
      if (response.success && response.data && response.data.lectures) {
        const now = new Date();
        const completedLectures = response.data.lectures.filter(lecture => {
          const endTime = new Date(lecture.class_end);
          return endTime < now;
        });
        setLectures(completedLectures);
      } else {
        console.error('Failed to fetch lectures:', response.message);
        setLectures([]);
      }
    } catch (error) {
      console.error('Failed to fetch lectures:', error);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (lectureId) => {
    try {
      setLoading(true);
      // Use real API call to get lecture questions
      const response = await api.teacher.getLectureQuestions(lectureId);
      
      if (response.success && response.data) {
        setQuestions(response.data);
      } else {
        console.error('Failed to fetch questions:', response.message);
        setQuestions([]);
      }
      setShowQuestions(true);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
      setShowQuestions(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showQuestions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowQuestions(false)}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <span>←</span>
            Back to Lectures
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Questions from: {selectedLecture?.lecture_title}
            </h2>
            <p className="text-slate-600">
              {formatDate(selectedLecture?.class_start)} • {formatTime(selectedLecture?.class_start)} - {formatTime(selectedLecture?.class_end)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 text-sm font-medium">
                      {question.student_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{question.student_name}</p>
                    <p className="text-sm text-slate-600">
                      {formatTime(question.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm text-slate-600">
                    <span>👍</span>
                    {question.upvotes}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    question.is_answered 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {question.is_answered ? 'Answered' : 'Unanswered'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-slate-900">{question.question_text}</p>
                
                {question.is_answered && question.answer && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-800 mb-1">Your Answer:</p>
                    <p className="text-green-700">{question.answer}</p>
                  </div>
                )}
                
                {!question.is_answered && (
                  <div className="border-t pt-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                      Answer Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Completed Lectures</h2>
        <p className="text-slate-600">View past lectures and manage student questions</p>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Course</h3>
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            fetchLectures(e.target.value);
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

      {/* Lectures List */}
      {selectedCourse && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Loading lectures...</p>
            </div>
          ) : (
            <>
              {lectures.map((lecture) => (
                <div key={lecture.id} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-slate-900">{lecture.lecture_title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>📅 {formatDate(lecture.class_start)}</span>
                        <span>🕐 {formatTime(lecture.class_start)} - {formatTime(lecture.class_end)}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <span>👥</span>
                          {lecture.students_joined} students joined
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <span>❓</span>
                          {lecture.questions_count} questions asked
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedLecture(lecture);
                          fetchQuestions(lecture.id);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        View Questions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {lectures.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                  <div className="text-4xl mb-2">🎓</div>
                  <p>No completed lectures found for this course</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CompletedLectures;