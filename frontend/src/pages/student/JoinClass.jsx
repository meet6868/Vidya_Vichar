import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const JoinClass = ({ userData, onClassJoined }) => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningClass, setJoiningClass] = useState(null);

  useEffect(() => {
    if (userData?.id) {
      fetchAvailableClasses();
    }
  }, [userData]);

  const fetchAvailableClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.student.getAvailableClasses();
      
      if (response.success && response.data?.lectures) {
        setAvailableClasses(response.data.lectures);
      } else {
        setError(response.message || 'Failed to fetch available classes');
        setAvailableClasses([]);
      }
    } catch (error) {
      console.error('Error fetching available classes:', error);
      setError('Failed to load available classes. Please try again.');
      setAvailableClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (lecture) => {
    try {
      setJoiningClass(lecture._id);
      
      const response = await api.student.joinClass(lecture._id);
      
      if (response.success) {
        // Refresh available classes
        await fetchAvailableClasses();
        
        // Navigate to doubt page
        onClassJoined(lecture);
      } else {
        setError(response.message || 'Failed to join class');
      }
    } catch (error) {
      console.error('Error joining class:', error);
      setError('Failed to join class. Please try again.');
    } finally {
      setJoiningClass(null);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getClassStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', text: 'Upcoming' };
    } else if (now >= start && now <= end) {
      return { status: 'live', color: 'bg-green-100 text-green-800', text: 'Live Now' };
    } else {
      return { status: 'ended', color: 'bg-gray-100 text-gray-800', text: 'Ended' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Join Live Class</h2>
            <p className="text-slate-600 mt-1">Join ongoing or recent classes from your enrolled courses</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-slate-600 font-medium">Searching for available classes...</p>
            <p className="text-slate-500 text-sm">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Join Live Class</h2>
            <p className="text-slate-600 mt-1">Join ongoing or recent classes from your enrolled courses</p>
          </div>
          <button
            onClick={fetchAvailableClasses}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 text-red-500">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Unable to Load Classes</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchAvailableClasses}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <p className="text-sm text-slate-500">
                If the problem persists, please check your internet connection or contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Join Live Class</h2>
          <p className="text-slate-600 mt-1">Join ongoing or recent classes from your enrolled courses</p>
        </div>
        <button
          onClick={fetchAvailableClasses}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {availableClasses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-slate-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Classes Available</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            There are no live or recently ended classes available to join at the moment. 
            Classes become available 15 minutes before they start.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-medium text-slate-700 mb-2">💡 Tip</h4>
            <p className="text-sm text-slate-600">
              You can only join classes from courses you're enrolled in. Check your "My Courses" section to see your enrolled courses.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {availableClasses.map((lecture) => {
            const classStatus = getClassStatus(lecture.class_start, lecture.class_end);
            
            return (
              <div
                key={lecture._id}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {lecture.course_name || 'Course Name'}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classStatus.color}`}>
                        {classStatus.status === 'live' && (
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                            {classStatus.text}
                          </span>
                        )}
                        {classStatus.status !== 'live' && classStatus.text}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-600 text-sm mb-1">
                          <span className="font-medium">Course Code:</span> {lecture.course_id}
                        </p>
                        <p className="text-slate-600 text-sm">
                          <span className="font-medium">Lecture:</span> {lecture.lec_num}
                          {lecture.topic && <span className="text-slate-500"> - {lecture.topic}</span>}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-slate-600 text-sm mb-1">
                          <span className="font-medium">Date:</span> {formatDate(lecture.class_start)}
                        </p>
                        <p className="text-slate-600 text-sm">
                          <span className="font-medium">Time:</span> {formatTime(lecture.class_start)} - {formatTime(lecture.class_end)}
                        </p>
                      </div>
                    </div>
                    
                    {lecture.joined_students_count > 0 && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                        <span>{lecture.joined_students_count} students joined</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    {classStatus.status === 'live' && (
                      <span className="text-green-600 font-medium">🎥 Class is live now</span>
                    )}
                    {classStatus.status === 'ended' && (
                      <span className="text-slate-600">📚 Class has ended - View doubts</span>
                    )}
                    {classStatus.status === 'upcoming' && (
                      <span className="text-blue-600">⏰ Class hasn't started yet</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleJoinClass(lecture)}
                    disabled={joiningClass === lecture._id || classStatus.status === 'upcoming'}
                    className={`px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                      classStatus.status === 'ended'
                        ? 'bg-slate-600 text-white hover:bg-slate-700'
                        : classStatus.status === 'live'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  >
                    {joiningClass === lecture._id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {classStatus.status === 'ended' ? 'Loading...' : 'Joining...'}
                      </div>
                    ) : (
                      <>
                        {classStatus.status === 'upcoming' && 'Class Not Started'}
                        {classStatus.status === 'live' && 'Join Live Class'}
                        {classStatus.status === 'ended' && 'View Class Doubts'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">How to Join Classes</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>• <strong>Live Classes:</strong> Join ongoing classes to participate in real-time discussions</p>
              <p>• <strong>Recent Classes:</strong> View doubts and questions from recently ended classes</p>
              <p>• <strong>Availability:</strong> Classes appear 15 minutes before start time and remain available for 15 minutes after ending</p>
              <p>• <strong>Access:</strong> You can only join classes from courses you're enrolled in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;
