import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';
import QuestionForm from '../../components/QuestionForm.jsx';

const LectureDoubts = ({ userData, selectedLecture, selectedCourse, onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [allDoubts, setAllDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedQuestionForDetails, setSelectedQuestionForDetails] = useState(null);
  
  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleViewDetails = (doubt) => {
    setSelectedQuestionForDetails(doubt);
    setShowDetailsModal(true);
  };
  
  // Ask question form state
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  useEffect(() => {
    if (selectedLecture && userData?.id) {
      fetchLectureDoubts();
    }
  }, [selectedLecture, userData]);

  const fetchLectureDoubts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 LectureDoubts fetchLectureDoubts: selectedLecture', selectedLecture);
      console.log('🔍 LectureDoubts fetchLectureDoubts: selectedLecture._id', selectedLecture?._id);
      
      // Use the same API endpoint as ClassDoubts component
      const response = await api.student.getLectureQuestions(selectedLecture._id);
      
      console.log('🔍 LectureDoubts fetchLectureDoubts: API response', response);
      console.log('🔍 LectureDoubts fetchLectureDoubts: response.data', response?.data);
      console.log('🔍 LectureDoubts fetchLectureDoubts: response.data.questions', response?.data?.questions);
      
      if (response.success && response.data?.questions) {
        console.log('🔍 LectureDoubts fetchLectureDoubts: Setting questions', response.data.questions);
        setAllDoubts(response.data.questions);
      } else {
        console.log('🔍 LectureDoubts fetchLectureDoubts: No questions or error', response.message);
        setError(response.message || 'Failed to fetch lecture doubts');
        setAllDoubts([]);
      }
      
    } catch (error) {
      console.error('🔍 LectureDoubts fetchLectureDoubts: Error', error);
      setError('Failed to load lecture doubts. Please try again.');
      setAllDoubts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceToggle = (resourceId) => {
    // Resource functionality removed
  };

  const handleQuestionSubmit = async (questionText) => {
    try {
      setSubmittingQuestion(true);
      
      // Use the same API as ClassDoubts component
      const response = await api.student.askQuestion(questionText, selectedLecture._id);
      
      if (response.success) {
        // Close form and refresh doubts list
        setShowQuestionForm(false);
        fetchLectureDoubts();
      } else {
        setError(response.message || 'Failed to submit question');
      }
      
    } catch (error) {
      console.error('Error submitting question:', error);
      setError('Failed to submit question. Please try again.');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const getFilteredDoubts = () => {
    switch (activeTab) {
      case 'answered':
        return allDoubts.filter(doubt => doubt.is_answered);
      case 'pending':
        return allDoubts.filter(doubt => !doubt.is_answered);
      default:
        return allDoubts;
    }
  };

  const getTabCounts = () => {
    return {
      all: allDoubts.length,
      answered: allDoubts.filter(d => d.is_answered).length,
      pending: allDoubts.filter(d => !d.is_answered).length
    };
  };

  const TabButton = ({ tabKey, label, count, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabKey)}
      className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
    >
      <span>{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'bg-slate-200 text-slate-600'
      }`}>
        {count}
      </span>
    </button>
  );

  const DoubtCard = ({ doubt }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              doubt.is_answered 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {doubt.is_answered ? 'Answered' : 'Pending'}
            </span>
            <span className="text-sm text-slate-500">
              by {doubt.student_name}
            </span>
            <span className="text-sm text-slate-400">•</span>
            <span className="text-sm text-slate-500">
              {formatTimestamp(doubt.timestamp)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {doubt.question_text}
          </h3>
          
          {/* Brief answer preview for backward compatibility */}
          {doubt.is_answered && doubt.answer && !doubt.answers && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800 text-sm">Answer Available</span>
              </div>
              <p className="text-green-700 text-sm">Click "View Details" to see the complete answer</p>
            </div>
          )}

          {/* Brief multiple answers preview */}
          {doubt.answers && doubt.answers.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800 text-sm">
                  {doubt.answers.length} Answer{doubt.answers.length !== 1 ? 's' : ''} Available
                </span>
              </div>
              <p className="text-green-700 text-sm">Click "View Details" to see all answers</p>
            </div>
          )}
        </div>
      </div>

      {/* Question stats and actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {doubt.answers ? doubt.answers.length : (doubt.answer ? 1 : 0)} answer{((doubt.answers ? doubt.answers.length : (doubt.answer ? 1 : 0)) !== 1) ? 's' : ''}
          </span>
        </div>
        
        <button 
          onClick={() => handleViewDetails(doubt)}
          className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lectures
          </button>
          <div className="h-6 w-px bg-slate-300"></div>
          <h2 className="text-2xl font-bold text-slate-800">Lecture {selectedLecture?.lec_num} - Doubts</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-600">Loading lecture doubts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lectures
          </button>
          <div className="h-6 w-px bg-slate-300"></div>
          <h2 className="text-2xl font-bold text-slate-800">Lecture {selectedLecture?.lec_num} - Doubts</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={fetchLectureDoubts}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const counts = getTabCounts();
  const filteredDoubts = getFilteredDoubts();

  return (
    <div className="space-y-6">
      {/* Header with back navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lectures
        </button>
        <div className="h-6 w-px bg-slate-300"></div>
        <h2 className="text-2xl font-bold text-slate-800">Lecture {selectedLecture?.lec_num} - Doubts</h2>
      </div>

      {/* Lecture Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Lecture Information</h3>
          <button
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ask Question
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-600">Course:</span>
            <p className="text-slate-800">{selectedCourse?.course_name}</p>
          </div>
          <div>
            <span className="font-medium text-slate-600">Lecture:</span>
            <p className="text-slate-800">Lecture {selectedLecture?.lec_num}</p>
          </div>
          <div>
            <span className="font-medium text-slate-600">Date:</span>
            <p className="text-slate-800">{new Date(selectedLecture?.class_start).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Question Form - Show when button is clicked */}
      {showQuestionForm && (
        <QuestionForm 
          onSubmit={handleQuestionSubmit}
          onCancel={() => setShowQuestionForm(false)}
          submitting={submittingQuestion}
        />
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <TabButton
          tabKey="all"
          label="All Doubts"
          count={counts.all}
          isActive={activeTab === 'all'}
          onClick={setActiveTab}
        />
        <TabButton
          tabKey="answered"
          label="Answered"
          count={counts.answered}
          isActive={activeTab === 'answered'}
          onClick={setActiveTab}
        />
        <TabButton
          tabKey="pending"
          label="Pending"
          count={counts.pending}
          isActive={activeTab === 'pending'}
          onClick={setActiveTab}
        />
      </div>

      {/* Doubts List */}
      {filteredDoubts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Doubts Found</h3>
          <p className="text-slate-600 mb-4">
            {activeTab === 'all' && 'No doubts were raised for this lecture.'}
            {activeTab === 'answered' && 'No doubts were answered for this lecture.'}
            {activeTab === 'pending' && 'No pending doubts for this lecture.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <DoubtCard key={doubt._id} doubt={doubt} />
          ))}
        </div>
      )}

      {/* Question Details Modal */}
      {showDetailsModal && selectedQuestionForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Question Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Question Details */}
            <div className="mb-6">
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedQuestionForDetails.is_answered 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedQuestionForDetails.is_answered ? 'Answered' : 'Pending'}
                  </span>
                  <span className="text-sm text-slate-600">
                    Asked by {selectedQuestionForDetails.student_name}
                  </span>
                  <span className="text-sm text-slate-400">•</span>
                  <span className="text-sm text-slate-500">
                    {formatTimestamp(selectedQuestionForDetails.timestamp)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {selectedQuestionForDetails.question_text}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>📚 {selectedCourse?.course_name}</span>
                  <span>•</span>
                  <span>🎯 {selectedLecture?.lecture_title}</span>
                </div>
              </div>

              {/* All Answers Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    All Answers ({selectedQuestionForDetails.answers ? selectedQuestionForDetails.answers.length : (selectedQuestionForDetails.answer ? 1 : 0)})
                  </h4>
                </div>

                {/* Show single answer if using old format */}
                {selectedQuestionForDetails.is_answered && selectedQuestionForDetails.answer && !selectedQuestionForDetails.answers && (
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50 mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                          T
                        </div>
                        <span className="font-medium">Teacher</span>
                      </div>
                    </div>
                    <div className="text-green-900 leading-relaxed">
                      <p className="whitespace-pre-wrap">{selectedQuestionForDetails.answer}</p>
                    </div>
                  </div>
                )}

                {/* Show multiple answers if available */}
                {selectedQuestionForDetails.answers && selectedQuestionForDetails.answers.length > 0 ? (
                  <div className="space-y-4">
                    {selectedQuestionForDetails.answers.map((answer, index) => (
                      <div key={answer.answer_id || index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-green-800">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {answer.answerer_name ? answer.answerer_name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <span className="font-medium">{answer.answerer_name || 'Teacher'}</span>
                            {answer.answer_type && (
                              <>
                                <span className="text-green-600">•</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  answer.answer_type === 'text' ? 'bg-green-200 text-green-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {answer.answer_type}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-green-900 leading-relaxed">
                          {answer.answer_type === 'file' ? (
                            <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-medium">File attachment: {answer.answer}</span>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{answer.answer}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !selectedQuestionForDetails.is_answered && (
                    <div className="text-center py-8 text-slate-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No answers yet</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureDoubts;
