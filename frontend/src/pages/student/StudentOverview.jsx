import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const StudentOverview = ({ userData }) => {
  const [overviewData, setOverviewData] = useState({
    name: userData?.name || 'Student',
    roll_no: userData?.roll_no || '',
    batch: userData?.batch || '',
    branch: userData?.branch || '',
    numCoursesEnrolled: 0,
    unansweredQuestions: 0,
    pendingCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!userData?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.student.getOverview();
        
        if (response.success && response.data) {
          setOverviewData({
            ...response.data,
            // Keep the name from userData if not provided by backend
            name: response.data.name || userData.name || 'Student'
          });
        } else {
          console.error('Failed to fetch overview:', response.message);
          // Keep default data with userData fallback
          setOverviewData(prev => ({
            ...prev,
            name: userData?.name || 'Student',
            roll_no: userData?.roll_no || '',
            batch: userData?.batch || '',
            branch: userData?.branch || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching overview:', error);
        // Keep default data with userData fallback
        setOverviewData(prev => ({
          ...prev,
          name: userData?.name || 'Student',
          roll_no: userData?.roll_no || '',
          batch: userData?.batch || '',
          branch: userData?.branch || ''
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading overview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{overviewData.name}!</span>
        </h1>
        <p className="text-slate-600 text-lg">Here's what's happening with your studies today.</p>
        {overviewData.batch && overviewData.branch && (
          <p className="text-slate-500 text-sm mt-2">
            {overviewData.batch} • {overviewData.branch} • Roll No: {overviewData.roll_no}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Enrolled Courses</p>
              <p className="text-3xl font-bold text-blue-900">{overviewData.numCoursesEnrolled}</p>
            </div>
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📚</span>
            </div>
          </div>
          <p className="text-blue-700 text-sm mt-2">{overviewData.numCoursesEnrolled > 0 ? 'Active courses' : 'No courses yet'}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold text-sm uppercase tracking-wider">Unanswered Questions</p>
              <p className="text-3xl font-bold text-green-900">{overviewData.unansweredQuestions}</p>
            </div>
            <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">❓</span>
            </div>
          </div>
          <p className="text-green-700 text-sm mt-2">{overviewData.unansweredQuestions > 0 ? 'Awaiting responses' : 'All questions answered'}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border border-orange-200 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Pending Requests</p>
              <p className="text-3xl font-bold text-orange-900">{overviewData.pendingCourses}</p>
            </div>
            <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">⏳</span>
            </div>
          </div>
          <p className="text-orange-700 text-sm mt-2">{overviewData.pendingCourses > 0 ? 'Course join requests' : 'No pending requests'}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors duration-200 group">
            <div className="h-10 w-10 bg-indigo-600 group-hover:bg-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📝</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">Ask Question</div>
              <div className="text-xs text-slate-600">Get help with doubts</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
            <div className="h-10 w-10 bg-green-600 group-hover:bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎯</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">Join Course</div>
              <div className="text-xs text-slate-600">Enroll in new courses</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
            <div className="h-10 w-10 bg-blue-600 group-hover:bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📺</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">View Classes</div>
              <div className="text-xs text-slate-600">Check schedule</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-purple-50 rounded-lg transition-colors duration-200 group">
            <div className="h-10 w-10 bg-purple-600 group-hover:bg-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">Progress</div>
              <div className="text-xs text-slate-600">Track learning</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">📚</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">Enrolled in Mathematics Course</div>
              <div className="text-sm text-slate-600">2 hours ago</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">❓</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">Question answered in Physics</div>
              <div className="text-sm text-slate-600">5 hours ago</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600">🎯</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">Attended Chemistry Class</div>
              <div className="text-sm text-slate-600">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;