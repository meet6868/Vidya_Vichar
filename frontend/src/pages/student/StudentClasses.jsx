import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const StudentClasses = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch upcoming classes (available classes to join)
      const availableResponse = await api.student.getAvailableClasses();
      if (availableResponse && availableResponse.success) {
        setUpcomingClasses(availableResponse.data || []);
      }
      
      // Fetch past lectures (attended lectures)
      const pastResponse = await api.student.getPrevLectures();
      if (pastResponse && pastResponse.success) {
        setPastClasses(pastResponse.data || []);
      }
      
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again.');
      setUpcomingClasses([]);
      setPastClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchClasses();
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-slate-600">Loading classes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchClasses}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const getTypeColor = (type) => {
    return type === 'Lab' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status, attendance) => {
    if (status === 'scheduled') return 'bg-green-100 text-green-800';
    if (attendance === 'Present') return 'bg-emerald-100 text-emerald-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Classes</h1>
        <p className="text-slate-600">Stay updated with your class schedule and attendance</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
              activeTab === 'upcoming'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Classes
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
              activeTab === 'past'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Classes
          </button>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {(activeTab === 'upcoming' ? upcomingClasses : pastClasses).map((classItem) => (
          <div
            key={classItem.id}
            className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
              isToday(classItem.date) && activeTab === 'upcoming' 
                ? 'border-indigo-300 bg-indigo-50/30' 
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{classItem.courseName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(classItem.type)}`}>
                    {classItem.type}
                  </span>
                  {activeTab === 'past' && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classItem.status, classItem.attendance)}`}>
                      {classItem.attendance}
                    </span>
                  )}
                </div>
                
                <p className="text-lg text-slate-800 mb-3 font-medium">{classItem.topic}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👨‍🏫</span>
                    <span>{classItem.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span>{formatDate(classItem.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">⏰</span>
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏫</span>
                    <span>{classItem.room}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {activeTab === 'upcoming' && (
                <div className="ml-4 flex flex-col gap-2">
                  {isToday(classItem.date) && (
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm">
                      Join Now
                    </button>
                  )}
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-200 text-sm">
                    View Details
                  </button>
                </div>
              )}
            </div>

            {/* Today's class highlight */}
            {isToday(classItem.date) && activeTab === 'upcoming' && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 text-indigo-700">
                  <span className="text-lg">🔔</span>
                  <span className="font-medium text-sm">Today's class - Don't miss it!</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {((activeTab === 'upcoming' && upcomingClasses.length === 0) || 
        (activeTab === 'past' && pastClasses.length === 0)) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {activeTab === 'upcoming' ? '📅' : '📚'}
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {activeTab === 'upcoming' ? 'No Upcoming Classes' : 'No Past Classes'}
          </h3>
          <p className="text-slate-600 mb-6">
            {activeTab === 'upcoming' 
              ? 'You have no classes scheduled for now. Check back later!'
              : 'Your class history will appear here once you attend some classes.'
            }
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Class Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{upcomingClasses.length}</div>
            <div className="text-sm text-slate-600">Upcoming Classes</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{pastClasses.length}</div>
            <div className="text-sm text-slate-600">Attended Classes</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">95%</div>
            <div className="text-sm text-slate-600">Attendance Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentClasses;