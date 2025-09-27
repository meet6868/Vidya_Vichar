// API Configuration
const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? (import.meta.env.VITE_PRODUCTION_API_URL || 'https://your-production-domain.com/api')  // Production API URL from env
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'),                    // Development API URL from env
  
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
    
    // Student endpoints
    STUDENT: {
      BATCH_OPTIONS: '/auth/student/batch-options',
      BRANCH_OPTIONS: '/auth/student/branch-options',
      DASHBOARD: '/student/dashboard',
      COURSES: '/student/courses',
      DOUBTS: '/student/doubts',
      PROFILE: '/student/profile',
    },
    
    // Teacher endpoints
    TEACHER: {
      DASHBOARD: '/teacher/dashboard',
      COURSES: '/teacher/courses',
      STUDENTS: '/teacher/students',
      DOUBTS: '/teacher/doubts',
      PROFILE: '/teacher/profile',
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
  // Since token is in cookies, we don't need to get it from localStorage
  // But we keep the default headers
  return {
    ...API_CONFIG.DEFAULT_HEADERS
  };
};

// API request wrapper with error handling
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const config = {
    headers: getAuthHeaders(),
    credentials: 'include', // Include cookies in all requests
    ...options
  };

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
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
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
  },
  
  // Teacher methods
  teacher: {
    getDashboard: () => 
      apiRequest(API_CONFIG.ENDPOINTS.TEACHER.DASHBOARD),
  }
};

export default API_CONFIG;
