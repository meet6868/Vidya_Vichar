// API Configuration
const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? (import.meta.env.VITE_PRODUCTION_API_URL || 'https://your-production-domain.com/api')  // Production API URL from env
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'),                     // Development API URL - using localhost
  
  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      STUDENT_LOGIN: '/auth/student/login',
      STUDENT_REGISTER: '/auth/student/register',
      TEACHER_LOGIN: '/auth/teacher/login',
      TEACHER_REGISTER: '/auth/teacher/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh',
    },
    
    // Student endpoints - matching backend routes exactly
    STUDENT: {
      BATCH_OPTIONS: '/auth/student/batch-options',
      BRANCH_OPTIONS: '/auth/student/branch-options',
      DASHBOARD: '/users/student/dashboard',
      OVERVIEW: '/users/student/dashboard/overview',
      ENROLLED_COURSES: '/users/student/dashboard/enrolled-courses',
      PENDING_COURSES: '/users/student/dashboard/pending-courses',
      ALL_COURSES: '/users/student/dashboard/all-courses',
      ALL_LECTURES: '/users/student/dashboard/all-lectures',
      PREV_LECTURES: '/users/student/dashboard/prev-lectures',
      ALL_QUESTIONS: '/users/student/dashboard/all-questions',
      MY_QUESTIONS: '/users/student/dashboard/my-questions',
      JOIN_COURSE: '/users/student/dashboard/join-course',
      JOIN_CLASS: '/users/student/dashboard/join-class',
      ASK_QUESTION: '/users/student/dashboard/ask-question',
      ANSWER_QUESTION: '/users/student/dashboard/answer-question',
    },
    
    // Teacher endpoints - matching backend routes exactly
    TEACHER: {
      // Dashboard and Profile
      OVERVIEW: '/users/teacher/dashboard/overview',
      PROFILE: '/users/teacher/dashboard/profile',
      COURSES_DETAILED: '/users/teacher/courses/detailed',
      ALL_TEACHERS: '/users/teacher/all',
      TEACHER_BY_ID: '/users/teacher/:teacher_id',
      ALL_COURSES: '/users/teacher/courses',
      
      // Course Management
      CREATE_COURSE: '/users/teacher/course',
      PENDING_REQUESTS: '/users/teacher/course/:course_id/pending-requests',
      COURSE_STUDENTS: '/users/teacher/course/:course_id/students',
      STUDENT_BY_ID: '/users/teacher/course/:course_id/student/:student_id',
      COMPLETED_LECTURES: '/users/teacher/completed-lectures',
      COURSE_COMPLETED_LECTURES: '/users/teacher/course/:course_id/completed-lectures',
      LIVE_CLASSES: '/users/teacher/live-classes',
      
      // Lecture Management
      CREATE_LECTURE: '/users/teacher/lecture',
      LECTURE_QUESTIONS: '/users/teacher/lecture/:lecture_id/questions',
      END_LECTURE: '/users/teacher/lecture/end',
      DELETE_LECTURE: '/users/teacher/lecture/:lecture_id',
      
      // Question/Answer Management
      QUESTION_ANSWERS: '/users/teacher/question/:question_id/answers',
      ANSWER_QUESTION: '/users/teacher/question/answer',
      DELETE_QUESTION: '/users/teacher/question/:question_id',
      DELETE_ANSWER: '/users/teacher/answer/:answer_id',
      
      // Course Requests
      ACCEPT_REQUESTS: '/users/teacher/course/accept-requests',
      REJECT_REQUESTS: '/users/teacher/course/reject-requests',
      HANDLE_COURSE_REQUEST: '/users/teacher/course-request/:requestId/:action',
      REMOVE_STUDENT: '/users/teacher/course/:course_id/remove-student',
      MAKE_TA: '/users/teacher/course/make-ta',
    },
    
    // Course endpoints
    COURSES: {
      LIST: '/courses',
      CREATE: '/courses/create',
      DETAILS: '/courses/:id',
      JOIN: '/courses/:id/join',
      LEAVE: '/courses/:id/leave',
    },
    
    // Class endpoints
    CLASSES: {
      LIST: '/classes',
      CREATE: '/classes/create',
      JOIN: '/classes/:id/join',
      DETAILS: '/classes/:id',
    }
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get API URL with parameters
export const getApiUrlWithParams = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return getApiUrl(url);
};

// Helper function for authenticated requests
export const getAuthHeaders = () => {
  const headers = {
    ...API_CONFIG.DEFAULT_HEADERS
  };
  
  // Add Authorization header if token exists in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Added Authorization header with token');
  } else {
    console.log('❌ No authentication token found in localStorage');
  }
  
  return headers;
};

// API request wrapper with error handling and cross-origin support
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  
  const config = {
    credentials: 'include', // Include cookies in all requests
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  // For cross-origin requests, also try with CORS headers
  if (url.includes('localhost:5000')) {
    config.mode = 'cors';
    config.headers = {
      ...config.headers,
      'Access-Control-Allow-Credentials': 'true'
    };
  }

  console.log('API Request:', { url, method: config.method || 'GET', hasToken: !!localStorage.getItem('token') });

  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.TIMEOUT);
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(url, config),
      timeoutPromise
    ]);
    
    console.log('API Response:', { url, status: response.status, ok: response.ok });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', { url, status: response.status, error: errorData });
      
      // Provide more specific error messages for common issues
      if (response.status === 401) {
        const message = errorData.message || 'Authentication failed';
        throw new Error(message);
      } else if (response.status === 403) {
        throw new Error('Access forbidden - insufficient permissions');
      } else if (response.status === 404) {
        throw new Error('Requested resource not found');
      } else if (response.status >= 500) {
        throw new Error('Server error - please try again later');
      } else {
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Specific API methods
export const api = {
  // Auth methods
  auth: {
    // Registration options
    getBatchOptions: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.BATCH_OPTIONS),
    
    getBranchOptions: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.BRANCH_OPTIONS),
    
    studentLogin: (credentials) => 
      apiRequest(API_CONFIG.ENDPOINTS.AUTH.STUDENT_LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    
    studentRegister: (userData) => 
      apiRequest(API_CONFIG.ENDPOINTS.AUTH.STUDENT_REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    
    teacherLogin: (credentials) => 
      apiRequest(API_CONFIG.ENDPOINTS.AUTH.TEACHER_LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    
    teacherRegister: (userData) => 
      apiRequest(API_CONFIG.ENDPOINTS.AUTH.TEACHER_REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
  },
  
  // Student methods
  student: {
    getBatchOptions: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.BATCH_OPTIONS),
    
    getBranchOptions: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.BRANCH_OPTIONS),
    
    getDashboard: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.DASHBOARD),
    
    // Dashboard specific endpoints - using exact backend route matches
    getOverview: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.OVERVIEW),
    
    getEnrolledCourses: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.ENROLLED_COURSES),
    
    getPendingCourses: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.PENDING_COURSES),
    
    getAllCourses: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.ALL_COURSES),
    
    getAllLectures: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.ALL_LECTURES),
    
    getPrevLectures: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.PREV_LECTURES),
    
    getAllQuestions: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.ALL_QUESTIONS),
    
    getMyQuestions: () => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.MY_QUESTIONS),
    
    // Get lectures for a specific course
    getCourseLectures: (courseId) => 
      apiRequest(`/users/student/dashboard/course-lectures/${courseId}`),

    // Get doubts for a specific lecture
    getLectureDoubts: (lectureId) => 
      apiRequest(`/users/student/dashboard/lecture-doubts/${lectureId}`),
    
    // Join class / lecture functions
    getAvailableClasses: () => 
      apiRequest('/users/student/dashboard/available-classes'),

    joinClass: (lectureId) => 
      apiRequest('/users/student/dashboard/join-class', {
        method: 'POST',
        body: JSON.stringify({ lectureId })
      }),

    getLectureQuestions: (lectureId) => 
      apiRequest(`/users/student/dashboard/lecture-questions/${lectureId}`),

    getCourseInfo: (courseId) => 
      apiRequest(`/users/student/dashboard/course-info/${courseId}`),
    
    joinCourse: (course_id) => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.JOIN_COURSE, {
        method: 'POST',
        body: JSON.stringify({ course_id })
      }),
    
    joinLecture: (lectureId) => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.JOIN_CLASS, {
        method: 'POST',
        body: JSON.stringify({ lectureId })
      }),
    
    askQuestion: (question_text, lecture_id) => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.ASK_QUESTION, {
        method: 'POST',
        body: JSON.stringify({ question_text, lecture_id })
      }),
    
    answerQuestion: (question_id, answer_text, answer_type) => 
      apiRequest(API_CONFIG.ENDPOINTS.STUDENT.ANSWER_QUESTION, {
        method: 'POST',
        body: JSON.stringify({ question_id, answer_text, answer_type })
      }),
  },
  
  // Teacher methods
  teacher: {
    // Dashboard and Profile
    getOverview: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.OVERVIEW),
    
    getProfile: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.PROFILE),
    
    updateProfile: (profileData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      }),
    
    // Course Management
    getCoursesDetailed: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.COURSES_DETAILED),
    
    getAllCourses: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.ALL_COURSES),
    
    getAllTeachers: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.ALL_TEACHERS),
    
    getTeacherById: (teacherId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.TEACHER_BY_ID.replace(':teacher_id', teacherId)),
    
    createCourse: (courseData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.CREATE_COURSE, {
        method: 'POST',
        body: JSON.stringify(courseData)
      }),
    
    getPendingRequests: (courseId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.PENDING_REQUESTS.replace(':course_id', courseId)),
    
    getCourseStudents: (courseId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.COURSE_STUDENTS.replace(':course_id', courseId)),
    
    getStudentById: (courseId, studentId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.STUDENT_BY_ID.replace(':course_id', courseId).replace(':student_id', studentId)),
    
    getCompletedLectures: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.COMPLETED_LECTURES),
    
    getCourseCompletedLectures: (courseId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.COURSE_COMPLETED_LECTURES.replace(':course_id', courseId)),
    
    getLiveClasses: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.LIVE_CLASSES),
    
    // Lecture Management
    createLecture: (lectureData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.CREATE_LECTURE, {
        method: 'POST',
        body: JSON.stringify(lectureData)
      }),
    
    getLectureQuestions: (lectureId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.LECTURE_QUESTIONS.replace(':lecture_id', lectureId)),
    
    endLecture: (lectureData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.END_LECTURE, {
        method: 'POST',
        body: JSON.stringify(lectureData)
      }),
    
    deleteLecture: (lectureId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.DELETE_LECTURE.replace(':lecture_id', lectureId), {
        method: 'DELETE'
      }),
    
    // Question/Answer Management
    getQuestionAnswers: (questionId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.QUESTION_ANSWERS.replace(':question_id', questionId)),
    
    answerQuestion: (questionData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.ANSWER_QUESTION, {
        method: 'POST',
        body: JSON.stringify(questionData)
      }),
    
    deleteQuestion: (questionId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.DELETE_QUESTION.replace(':question_id', questionId), {
        method: 'DELETE'
      }),
    
    deleteAnswer: (answerId) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.DELETE_ANSWER.replace(':answer_id', answerId), {
        method: 'DELETE'
      }),
    
    // Course Requests
    acceptRequests: (requestData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.ACCEPT_REQUESTS, {
        method: 'POST',
        body: JSON.stringify(requestData)
      }),
    
    rejectRequests: (requestData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.REJECT_REQUESTS, {
        method: 'POST',
        body: JSON.stringify(requestData)
      }),
    
    handleCourseRequest: (requestId, action) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.HANDLE_COURSE_REQUEST.replace(':requestId', requestId).replace(':action', action), {
        method: 'POST'
      }),
    
    removeStudent: (courseId, studentData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.REMOVE_STUDENT.replace(':course_id', courseId), {
        method: 'DELETE',
        body: JSON.stringify(studentData)
      }),
    
    makeTA: (taData) => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.MAKE_TA, {
        method: 'POST',
        body: JSON.stringify(taData)
      }),
  }
};

export default API_CONFIG;
