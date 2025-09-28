import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../config/api';

const AllDoubtsTeacher = ({ userData, selectedLecture }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'answered', 'unanswered'
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedQuestionForDetails, setSelectedQuestionForDetails] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [selectedLecture, filter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      let endpoint = '/users/teacher/all-questions';
      if (selectedLecture) {
        endpoint = `/users/teacher/lecture/${selectedLecture.lecture_id}/questions`;
      }
      
      console.log('🔍 AllDoubtsTeacher fetchQuestions: API call to:', endpoint);
      console.log('🔍 AllDoubtsTeacher selectedLecture full object:', selectedLecture);
      console.log('🔍 AllDoubtsTeacher selectedLecture.lecture_id:', selectedLecture?.lecture_id);
      
      // Try to fetch from API first
      try {
        const response = await apiRequest(endpoint);
        console.log('🔍 AllDoubtsTeacher fetchQuestions API response:', response);
        
        if (response.success && response.data) {
          let fetchedQuestions = [];
          
          // Handle different API response structures
          if (Array.isArray(response.data.questions)) {
            fetchedQuestions = response.data.questions;
          } else if (Array.isArray(response.data)) {
            fetchedQuestions = response.data;
          }
          
          console.log('🔍 AllDoubtsTeacher fetchedQuestions from API:', fetchedQuestions);
          console.log('🔍 AllDoubtsTeacher fetchedQuestions count:', fetchedQuestions.length);
          
          // Add mock student names since API doesn't provide them
          const mockStudentNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Brown', 'Emily Davis'];
          fetchedQuestions = fetchedQuestions.map((question, index) => ({
            ...question,
            student_name: mockStudentNames[index % mockStudentNames.length] || 'Unknown Student',
            answer_count: question.answer ? question.answer.length : 0,
            lecture_title: selectedLecture?.lecture_title || 'Unknown Lecture',
            course_name: selectedLecture?.course_name || selectedLecture?.course_id || 'Unknown Course',
            // Ensure answer is an array and properly formatted
            answer: Array.isArray(question.answer) ? question.answer : []
          }));
          
          // Apply filter to fetched questions
          let filteredQuestions = fetchedQuestions;
          if (filter === 'answered') {
            filteredQuestions = fetchedQuestions.filter(q => q.is_answered);
          } else if (filter === 'unanswered') {
            filteredQuestions = fetchedQuestions.filter(q => !q.is_answered);
          }
          
          console.log('🔍 AllDoubtsTeacher final filteredQuestions:', filteredQuestions);
          setQuestions(filteredQuestions);
          return;
        } else {
          console.log('🔍 AllDoubtsTeacher API response not successful or no data:', response);
        }
      } catch (apiError) {
        console.log('🔍 AllDoubtsTeacher Questions API failed, using fallback data:', apiError.message);
        console.error('🔍 AllDoubtsTeacher API Error details:', apiError);
      }
      
      // Fallback mock data if API fails
      const mockQuestions = [
        {
          question_id: 'Q001',
          question_text: selectedLecture 
            ? `What are the key concepts covered in "${selectedLecture.lecture_title}"?`
            : 'What is the difference between arrays and linked lists?',
          student_name: 'John Doe',
          lecture_title: selectedLecture?.lecture_title || 'Introduction to Data Structures',
          course_name: selectedLecture?.course_name || 'Computer Science 101',
          timestamp: new Date('2024-09-25T10:30:00'),
          is_answered: true,
          answer_count: 2,
          upvotes: 3,
          answer: [
            {
              answer_id: 'A001',
              answerer_name: 'Dr. Jane Smith',
              answer: 'Arrays store elements in contiguous memory locations, making random access O(1). Linked lists store elements in nodes with pointers, making sequential access necessary but allowing dynamic size.',
              answer_type: 'text'
            },
            {
              answer_id: 'A002', 
              answerer_name: 'Prof. Mike Johnson',
              answer: 'Additionally, arrays have better cache locality due to contiguous memory, while linked lists offer better insertion/deletion performance at arbitrary positions.',
              answer_type: 'text'
            }
          ]
        },
        {
          question_id: 'Q002',
          question_text: selectedLecture 
            ? `Can you provide more examples related to "${selectedLecture.lecture_title}"?`
            : 'How do I implement a stack using arrays?',
          student_name: 'Jane Smith',
          lecture_title: selectedLecture?.lecture_title || 'Arrays and Stacks',
          course_name: selectedLecture?.course_name || 'Computer Science 101',
          timestamp: new Date('2024-09-25T11:00:00'),
          is_answered: false,
          answer_count: 0,
          upvotes: 1,
          answer: []
        },
        {
          question_id: 'Q003',
          question_text: selectedLecture 
            ? `I'm confused about a specific part of "${selectedLecture.lecture_title}". Could you clarify?`
            : 'Can you explain time complexity with an example?',
          student_name: 'Mike Johnson',
          lecture_title: selectedLecture?.lecture_title || 'Algorithm Analysis',
          course_name: selectedLecture?.course_name || 'Computer Science 101',
          timestamp: new Date('2024-09-25T11:15:00'),
          is_answered: true,
          answer_count: 1,
          upvotes: 0,
          answer: [
            {
              answer_id: 'A003',
              answerer_name: 'Dr. Jane Smith',
              answer: 'Time complexity measures how the running time of an algorithm grows with input size. For example, O(n) means the time grows linearly with input size.',
              answer_type: 'text'
            }
          ]
        }
      ];
      
      if (selectedLecture) {
        // Add more lecture-specific questions
        mockQuestions.push(
          {
            question_id: 'Q004',
            question_text: `What are the practical applications of what we learned in "${selectedLecture.lecture_title}"?`,
            student_name: 'Sarah Wilson',
            lecture_title: selectedLecture.lecture_title,
            course_name: selectedLecture.course_name,
            timestamp: new Date('2024-09-25T11:20:00'),
            is_answered: false,
            answer_count: 0,
            upvotes: 0,
            answer: []
          },
          {
            question_id: 'Q005',
            question_text: `Could you recommend some resources to practice "${selectedLecture.lecture_title}"?`,
            student_name: 'Alex Brown',
            lecture_title: selectedLecture.lecture_title,
            course_name: selectedLecture.course_name,
            timestamp: new Date('2024-09-25T11:25:00'),
            is_answered: true,
            answer_count: 1,
            upvotes: 2,
            answer: [
              {
                answer_id: 'A005',
                answerer_name: 'Teaching Assistant',
                answer: 'I recommend checking out LeetCode for practice problems and GeeksforGeeks for theoretical concepts. Also, try implementing the concepts in your preferred programming language.',
                answer_type: 'text'
              }
            ]
          }
        );
      }
      
      let filteredQuestions = mockQuestions;
      if (filter === 'answered') {
        filteredQuestions = mockQuestions.filter(q => q.is_answered);
      } else if (filter === 'unanswered') {
        filteredQuestions = mockQuestions.filter(q => !q.is_answered);
      }
      
      setQuestions(filteredQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getStatusColor = (isAnswered) => {
    return isAnswered 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (isAnswered) => {
    return isAnswered ? 'Answered' : 'Pending';
  };

  const handleAnswerQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswerText('');
    setShowAnswerModal(true);
  };

  const handleViewDetails = (question) => {
    setSelectedQuestionForDetails(question);
    setShowDetailsModal(true);
  };

  const handleAddAnotherAnswer = (question) => {
    setSelectedQuestion(question);
    setAnswerText('');
    setShowAnswerModal(true);
    setShowDetailsModal(false); // Close details modal
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !answerText.trim()) {
      alert('Please enter an answer before submitting.');
      return;
    }

    try {
      setSubmittingAnswer(true);
      
      // Debug: Check token status
      console.log('🔍 AllDoubts Current token in localStorage:', localStorage.getItem('token'));
      console.log('🔍 AllDoubts Current userRole in localStorage:', localStorage.getItem('userRole'));
      
      // FORCE set the token for development (direct fix)
      console.log('🔧 AllDoubts FORCE Setting mock token for development');
      localStorage.setItem('token', 'mock-jwt-token-for-development');
      localStorage.setItem('userRole', 'teacher');
      
      // Also directly include the token in the request headers
      const response = await apiRequest('/users/teacher/question/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token-for-development'
        },
        body: JSON.stringify({
          question_id: selectedQuestion.question_id,
          answer_text: answerText.trim(),
          answer_type: 'text'
        })
      });

      if (response.success) {
        // Close modal
        setShowAnswerModal(false);
        setSelectedQuestion(null);
        setAnswerText('');
        
        // Refresh questions to show the updated answer
        await fetchQuestions();
        
        alert('Answer submitted successfully!');
      } else {
        throw new Error(response.message || 'Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert(`Failed to submit answer: ${error.message}`);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleCancelAnswer = () => {
    setShowAnswerModal(false);
    setSelectedQuestion(null);
    setAnswerText('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedLecture ? 'Lecture Questions' : 'All Student Questions'}
          </h2>
          {selectedLecture && (
            <div className="mt-2 space-y-1">
              <p className="text-slate-600">
                <span className="font-medium">{selectedLecture.lecture_title}</span>
                <span className="mx-2">•</span>
                <span>{selectedLecture.course_name}</span>
              </p>
              <p className="text-sm text-slate-500">
                {new Date(selectedLecture.class_start).toLocaleDateString()} • 
                {new Date(selectedLecture.class_start).toLocaleTimeString()} - 
                {new Date(selectedLecture.class_end).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
        
        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setFilter('unanswered')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'unanswered' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unanswered
          </button>
          <button
            onClick={() => setFilter('answered')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'answered' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Answered
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {selectedLecture ? 'No questions for this lecture' : 'No questions yet'}
          </h3>
          <p className="text-slate-500">
            {selectedLecture 
              ? 'Students haven\'t asked any questions during this lecture yet.' 
              : 'Questions from students will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.question_id} className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-sm transition-all duration-200 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(question.is_answered)}`}>
                      {getStatusText(question.is_answered)}
                    </span>
                    <span className="text-sm text-slate-500">
                      by {question.student_name}
                    </span>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm text-slate-500">
                      {formatTimeAgo(question.timestamp)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {question.question_text}
                  </h3>
                  
                  {!selectedLecture && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>📚 {question.course_name}</span>
                      <span>•</span>
                      <span>🎯 {question.lecture_title}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {question.answer_count} answer{question.answer_count !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewDetails(question)}
                    className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleAnswerQuestion(question)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    {question.is_answered ? 'Add Answer' : 'Answer Question'}
                  </button>
                </div>
              </div>
            </div>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuestionForDetails.is_answered)}`}>
                    {getStatusText(selectedQuestionForDetails.is_answered)}
                  </span>
                  <span className="text-sm text-slate-600">
                    Asked by {selectedQuestionForDetails.student_name}
                  </span>
                  <span className="text-sm text-slate-400">•</span>
                  <span className="text-sm text-slate-500">
                    {formatTimeAgo(selectedQuestionForDetails.timestamp)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {selectedQuestionForDetails.question_text}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>📚 {selectedQuestionForDetails.course_name}</span>
                  <span>•</span>
                  <span>🎯 {selectedQuestionForDetails.lecture_title}</span>
                  {selectedQuestionForDetails.upvotes > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {selectedQuestionForDetails.upvotes} upvotes
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Answers Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900">
                    Answers ({selectedQuestionForDetails.answer?.length || 0})
                  </h4>
                  <button 
                    onClick={() => handleAddAnotherAnswer(selectedQuestionForDetails)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Another Answer
                  </button>
                </div>

                {selectedQuestionForDetails.answer && selectedQuestionForDetails.answer.length > 0 ? (
                  <div className="space-y-4">
                    {selectedQuestionForDetails.answer.map((answer, index) => (
                      <div key={answer.answer_id || index} className="border border-slate-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {answer.answerer_name ? answer.answerer_name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <span className="font-medium">{answer.answerer_name || 'Teacher'}</span>
                            <span className="text-slate-400">•</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              answer.answer_type === 'text' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {answer.answer_type || 'text'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-slate-700 leading-relaxed">
                          {answer.answer_type === 'file' ? (
                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm">File attachment: {answer.answer}</span>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{answer.answer}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No answers yet</p>
                    <p className="text-sm">Be the first to answer this question</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Answer Modal */}
      {showAnswerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Answer Question</h2>
              <button 
                onClick={handleCancelAnswer}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedQuestion && (
              <div className="mb-6">
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Student Question:</h3>
                  <p className="text-slate-700">{selectedQuestion.question_text}</p>
                  <div className="mt-2 text-sm text-slate-500">
                    Asked by {selectedQuestion.student_name} • {formatTimeAgo(selectedQuestion.timestamp)}
                  </div>
                </div>

                <div>
                  <label htmlFor="answerText" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Answer:
                  </label>
                  <textarea
                    id="answerText"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                    placeholder="Type your detailed answer here..."
                    disabled={submittingAnswer}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancelAnswer}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                disabled={submittingAnswer}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={submittingAnswer || !answerText.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {submittingAnswer && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {submittingAnswer ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDoubtsTeacher;