import React from 'react';

const AvailableCourses = ({ userData }) => {
  // Mock data for attended/completed courses
  const attendedCourses = [
    {
      id: 1,
      name: 'Introduction to Computer Science',
      instructor: 'Prof. Alan Smith',
      completedDate: '2024-12-15',
      grade: 'A',
      totalClasses: 24,
      attendedClasses: 22,
      color: 'emerald'
    },
    {
      id: 2,
      name: 'Calculus I',
      instructor: 'Dr. Maria Rodriguez',
      completedDate: '2024-11-30',
      grade: 'A-',
      totalClasses: 20,
      attendedClasses: 19,
      color: 'blue'
    },
    {
      id: 3,
      name: 'English Literature',
      instructor: 'Prof. James Wilson',
      completedDate: '2024-10-20',
      grade: 'B+',
      totalClasses: 16,
      attendedClasses: 14,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: 'from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        grade: 'bg-emerald-600',
        button: 'bg-emerald-600 hover:bg-emerald-700'
      },
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-900',
        grade: 'bg-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-900',
        grade: 'bg-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getAttendancePercentage = (attended, total) => {
    return Math.round((attended / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Attended Courses</h1>
        <p className="text-slate-600">Review your completed courses and academic performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-slate-900">{attendedCourses.length}</div>
          <div className="text-sm text-slate-600">Completed Courses</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(
              attendedCourses.reduce((acc, course) => 
                acc + getAttendancePercentage(course.attendedClasses, course.totalClasses), 0
              ) / attendedCourses.length
            )}%
          </div>
          <div className="text-sm text-slate-600">Avg Attendance</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-slate-900">3.7</div>
          <div className="text-sm text-slate-600">Overall GPA</div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {attendedCourses.map((course) => {
          const colors = getColorClasses(course.color);
          const attendancePercentage = getAttendancePercentage(course.attendedClasses, course.totalClasses);
          
          return (
            <div
              key={course.id}
              className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border ${colors.border} transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${colors.text} mb-1`}>{course.name}</h3>
                  <p className="text-slate-600 text-sm">Instructor: {course.instructor}</p>
                  <p className="text-slate-600 text-sm">Completed: {new Date(course.completedDate).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${colors.grade}`}>
                  Grade: {course.grade}
                </div>
              </div>

              {/* Attendance Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Attendance</span>
                  <span className="text-sm font-medium text-slate-700">
                    {course.attendedClasses}/{course.totalClasses} ({attendancePercentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/70 rounded-full h-2">
                  <div
                    className={`${colors.grade} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Course Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎓</span>
                  <span className="text-sm text-slate-700">Course completed successfully</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span className="text-sm text-slate-700">Final Grade: {course.grade}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className={`flex-1 py-2 px-4 ${colors.button} text-white rounded-lg font-medium transition-colors duration-200 text-sm`}>
                  View Certificate
                </button>
                <button className="px-4 py-2 bg-white/70 text-slate-700 rounded-lg font-medium hover:bg-white transition-colors duration-200 text-sm">
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {attendedCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Completed Courses Yet</h3>
          <p className="text-slate-600 mb-6">You haven't completed any courses yet. Keep learning to build your academic record!</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
            Explore Current Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;