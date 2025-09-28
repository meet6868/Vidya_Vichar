import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api, apiRequest } from '../../config/api';

// Import separate component files
import TeacherOverview from './TeacherOverview.jsx';
import CreateCourse from './CreateCourse.jsx';
import CreateClass from './CreateClass.jsx';
import YourCourses from './YourCourses.jsx';
import JoinedStudents from './JoinedStudents.jsx';
import AllDoubtsTeacher from './AllDoubtsTeacher.jsx';
import UnansweredDoubts from './UnansweredDoubts.jsx';
import AnsweredDoubtsTeacher from './AnsweredDoubtsTeacher.jsx';
import TeacherCourseDetails from './TeacherCourseDetails.jsx';
import TeacherProfile from './TeacherProfile.jsx';

// MyCourse component for displaying courses with create button
const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await apiRequest(`/teacher/courses/${userData.teacherId}`);
      
      if (response.success) {
        setCourses(response.data || []);
      } else {
        // Mock courses for fallback
        setCourses([
          {
            course_id: 'CS101',
            course_name: 'Introduction to Computer Science',
            description: 'Basic concepts of programming and computer science',
            batch: 'B.Tech CSE',
            branch: 'Computer Science',
            students_count: 45,
            lectures_count: 12,
            created_at: new Date('2024-09-01')
          },
          {
            course_id: 'CS201',
            course_name: 'Data Structures and Algorithms',
            description: 'Advanced data structures and algorithm design',
            batch: 'B.Tech CSE',
            branch: 'Computer Science',
            students_count: 38,
            lectures_count: 15,
            created_at: new Date('2024-09-10')
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback mock data
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create New Course</h2>
          <button
            onClick={() => setShowCreateForm(false)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 flex items-center gap-2"
          >
            ← Back to My Courses
          </button>
        </div>
        <CreateCourse onSuccess={() => {
          setShowCreateForm(false);
          fetchCourses();
        }} />
      </div>
    );
  }

  if (loading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
          <p className="text-slate-600">Manage your courses and create new ones</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-md"
        >
          <span className="text-lg">➕</span>
          Create Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No courses yet</h3>
          <p className="text-slate-500 mb-6">Create your first course to start teaching</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.course_id} className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{course.course_name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{course.course_id}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Batch:</span>
                  <span className="font-medium text-slate-700">{course.batch}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Branch:</span>
                  <span className="font-medium text-slate-700">{course.branch}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-indigo-600">{course.students_count || 0}</div>
                    <div className="text-xs text-slate-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{course.lectures_count || 0}</div>
                    <div className="text-xs text-slate-500">Lectures</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <button className="w-full py-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [overviewData, setOverviewData] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('=== TEACHER DASHBOARD LOADED ===');
    console.log('Current location:', location.pathname);
    console.log('User:', userData?.name, '| Role:', localStorage.getItem('userRole'));
    
    // Check if auth bypass is enabled
    const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true';
    console.log('Bypass auth enabled:', bypassAuth);
    
    if (bypassAuth) {
      console.log('Using auth bypass with mock data');
      // Mock user data for development
      setUserData({
        id: 'TEACH001',
        name: 'Dr. Jane Smith',
        teacher_id: 'TEACH001',
        username: 'jane.smith@university.edu',
        courses_id: ['CS101', 'CS201']
      });
      setLoading(false);
      return;
    }

    // Check localStorage contents
    const userRole = localStorage.getItem('userRole');
    const storedUserData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');
    
    console.log('=== LOCALSTORAGE STATUS ===');
    console.log('userRole:', userRole);
    console.log('storedUserData exists:', !!storedUserData);
    console.log('storedUserData length:', storedUserData ? storedUserData.length : 0);
    console.log('token exists:', !!token);
    console.log('token preview:', token ? token.substring(0, 20) + '...' : 'None');
    console.log('Raw storedUserData:', storedUserData);
    
    // Check for cookie (if accessible)
    console.log('Document cookies:', document.cookie);

    // Add small delay to prevent race conditions during navigation
    const timeoutId = setTimeout(() => {
      console.log('=== AUTHENTICATION VALIDATION ===');
      
      // Check user role
      if (!userRole) {
        console.log('❌ No userRole found in localStorage');
        navigate('/teacher/login');
        return;
      }
      
      if (userRole !== 'teacher') {
        console.log('❌ Invalid user role:', userRole);
        navigate('/teacher/login');
        return;
      }
      
      console.log('✅ User role is valid:', userRole);

      // Check user data
      if (!storedUserData || storedUserData === 'undefined' || storedUserData === 'null') {
        console.log('❌ No valid userData found in localStorage');
        navigate('/teacher/login');
        return;
      }

      // Parse user data
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log('✅ Parsed user data:', parsedData);
        setUserData(parsedData);
        setLoading(false);
      } catch (error) {
        console.log('❌ Error parsing user data:', error);
        localStorage.removeItem('userData');
        navigate('/teacher/login');
        return;
      }
    }, 200);

    return () => {
      console.log('Cleaning up authentication timeout');
      clearTimeout(timeoutId);
    };
  }, [navigate, location.pathname]);

  // Fetch overview data when user data is available
  useEffect(() => {
    if (userData?.id && activeSection === 'overview') {
      fetchOverviewData();
    }
  }, [userData, activeSection]);

  const fetchOverviewData = async () => {
    if (!userData?.id) return;
    
    setLoadingOverview(true);
    try {
      const response = await apiRequest('/teacher/dashboard/overview', {
        method: 'GET'
      });
      
      if (response.success) {
        setOverviewData(response.data);
      } else {
        console.error('Failed to fetch overview data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoadingOverview(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await apiRequest('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.log('Logout API call failed, but continuing with client-side cleanup');
    }
    
    // Clear client-side data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return <TeacherOverview overviewData={overviewData} loading={loadingOverview} />;
      case 'my-course':
        return <MyCourse />;
      case 'completed-lectures':
        return <CompletedLectures userData={userData} />;
      case 'create-lecture':
        return <CreateClass userData={userData} />;
      case 'your-courses':
        return <YourCourses userData={userData} />;
      case 'joined-students':
        return <JoinedStudents userData={userData} />;
      case 'all-doubts':
        return <AllDoubtsTeacher userData={userData} />;
      case 'unanswered-doubts':
        return <UnansweredDoubts userData={userData} />;
      case 'answered-doubts':
        return <AnsweredDoubtsTeacher userData={userData} />;
      case 'course-details':
        return <TeacherCourseDetails userData={userData} />;
      case 'profile':
        return <TeacherProfile userData={userData} />;
      default:
        return <TeacherOverview overviewData={overviewData} loading={loadingOverview} />;
    }
  };

  // Completed Lectures Component
  const CompletedLectures = ({ userData }) => {
    const [completedLectures, setCompletedLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchCompletedLectures();
    }, [userData]);

    const fetchCompletedLectures = async () => {
      try {
        setLoading(true);
        // This would be an API call to get completed lectures
        // For now, using mock data
        const mockLectures = [
          {
            id: 'LEC001',
            lecture_title: 'Introduction to Data Structures',
            course_name: 'Computer Science 101',
            class_start: new Date('2024-09-25T10:00:00'),
            class_end: new Date('2024-09-25T11:30:00'),
            students_attended: 45,
            questions_asked: 12,
            questions_answered: 10
          },
          {
            id: 'LEC002',
            lecture_title: 'Arrays and Linked Lists',
            course_name: 'Computer Science 101',
            class_start: new Date('2024-09-27T10:00:00'),
            class_end: new Date('2024-09-27T11:30:00'),
            students_attended: 42,
            questions_asked: 8,
            questions_answered: 8
          }
        ];
        setCompletedLectures(mockLectures);
      } catch (error) {
        console.error('Error fetching completed lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading completed lectures...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Completed Lectures</h2>
          <div className="text-sm text-slate-500">
            Total: {completedLectures.length} lectures
          </div>
        </div>

        {completedLectures.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No completed lectures</h3>
            <p className="text-slate-500">You haven't conducted any lectures yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {completedLectures.map((lecture) => (
              <div key={lecture.id} className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{lecture.lecture_title}</h3>
                    <p className="text-slate-600 text-sm mb-2">{lecture.course_name}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>📅 {lecture.class_start.toLocaleDateString()}</span>
                      <span>🕒 {lecture.class_start.toLocaleTimeString()} - {lecture.class_end.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{lecture.students_attended}</div>
                    <div className="text-xs text-slate-500">Students Attended</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{lecture.questions_asked}</div>
                    <div className="text-xs text-slate-500">Questions Asked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{lecture.questions_answered}</div>
                    <div className="text-xs text-slate-500">Questions Answered</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-x-hidden">
      {/* Global background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200/60 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-28 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-purple-200/60 to-transparent blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand/logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white grid place-items-center shadow-sm">
                <span className="text-sm font-bold">VV</span>
              </div>
              <div className="leading-tight">
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">Vidya Vichar</div>
                <div className="hidden sm:block text-[13px] text-slate-500">Teacher Dashboard</div>
              </div>
            </Link>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-slate-900">Welcome, {userData?.name || 'Teacher'}</div>
              <div className="text-xs text-slate-500">{userData?.teacher_id || 'Teacher ID'}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white/50 backdrop-blur border-r border-slate-200 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {/* Overview */}
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === 'overview'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-700'
              }`}
            >
              <span className="text-lg">📊</span>
              <span className="font-medium">Overview</span>
            </button>

            {/* My Course */}
            <button
              onClick={() => setActiveSection('my-course')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === 'my-course'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-700'
              }`}
            >
              <span className="text-lg">📚</span>
              <span className="font-medium">My Course</span>
            </button>

            {/* Completed Lectures */}
            <button
              onClick={() => setActiveSection('completed-lectures')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === 'completed-lectures'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-700'
              }`}
            >
              <span className="text-lg">✅</span>
              <span className="font-medium">Completed Lectures</span>
            </button>

            {/* Create Lecture */}
            <button
              onClick={() => setActiveSection('create-lecture')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === 'create-lecture'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-700'
              }`}
            >
              <span className="text-lg">🏫</span>
              <span className="font-medium">Create Lecture</span>
            </button>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/60 backdrop-blur rounded-2xl border border-slate-200 shadow-sm min-h-[calc(100vh-8rem)] p-8">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
