# Vidya Vichar
**Team 5 Educational Q&A Platform**

![Vidya Vichar](https://img.shields.io/badge/Vidya%20Vichar-Learn%20Ask%20Grow-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![License](https://img.shields.io/badge/License-MIT-yellow)


## 🎓 Project Overview

**Vidya Vichar** is a comprehensive educational Q&A platform designed to facilitate seamless interaction between students and teachers in an academic environment. The platform enables students to ask questions during live classes, access course materials, and receive detailed answers from instructors, while providing teachers with powerful tools to manage courses, conduct live sessions, and track student engagement.

### 🏷️ Tagline: "Learn. Ask. Grow."


[github](https://github.com/PranjalSK03/Vidya_Vichar_group5.git)

---

## 📋 Table of Contents
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [User Roles & Permissions](#-user-roles--permissions)
- [Usage Examples](#-usage-examples)
- [Contributing](#-contributing)
- [Team Information](#-team-information)
- [License](#-license)

---

## ✨ Features

### 👨‍🎓 Student Features
- **User Registration & Authentication**: Secure signup with email verification and JWT-based authentication
- **Course Enrollment**: Browse available courses and request enrollment with teacher approval
- **Live Class Participation**: Join real-time classes and participate in Q&A sessions
- **Question Management**: Ask questions during lectures with resource references and context
- **Answer Viewing**: View detailed answers from teachers with support for multiple responses
- **Course Dashboard**: Track enrolled courses, pending requests, and academic progress
- **Resource Access**: Access course materials, documents, and supplementary resources

### 👩‍🏫 Teacher Features
- **Course Creation & Management**: Create courses, set enrollment criteria, and manage student lists
- **Live Class Hosting**: Conduct live sessions with real-time student interaction
- **Question & Answer System**: View student questions and provide comprehensive answers
- **Student Request Management**: Approve or decline course enrollment requests
- **Analytics Dashboard**: Monitor student engagement and course performance
- **Resource Management**: Upload and organize course materials and resources
- **Multi-Answer Support**: Provide multiple answers to complex questions

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Separate permissions for students and teachers
- **Password Encryption**: bcrypt hashing for secure password storage
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Comprehensive data validation and sanitization

---

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    MongoDB    ┌─────────────────┐
│                 │ ──────────────────► │                 │ ──────────── ► │                 │
│  React Frontend │                     │  Express.js     │                │    Database     │
│  (Port: 3000)   │ ◄────────────────── │  Backend        │ ◄──────────── │   (Port: 27017) │
│                 │    JSON Response    │  (Port: 5000)   │                │                 │
└─────────────────┘                     └─────────────────┘                └─────────────────┘
```

### Component Architecture
- **Frontend**: React with Vite for fast development and build processes
- **Backend**: Node.js with Express.js for RESTful API development
- **Database**: MongoDB with Mongoose ODM for flexible document storage
- **Authentication**: JWT-based stateless authentication
- **Styling**: Tailwind CSS for utility-first styling approach

### 🔧 System Assumptions & Constraints

#### Core System Behaviors
- **Educational Environment**: University/college setting with structured courses and formal learning
- **Live Class Persistence**: Teachers cannot leave live classes after creating them - they must stay until the class is officially ended
- **Browser Separation**: Teachers and students must use different browsers/browser sessions for optimal performance and to avoid conflicts
- **Question-Centric Learning**: Platform focuses on doubt clearing and academic support through structured Q&A
- **Approval-Based Enrollment**: Teachers have complete control over course access and student enrollment

#### User Role Specifications
- **TA Authentication**: Teaching Assistants (TAs) register and login as Teachers with full teacher-level permissions
- **Multi-Modal Answers**: Support for both text and file-based responses from instructors
- **Real-time Interaction**: Live classes support synchronous learning with immediate teacher-student interaction
- **Resource Integration**: Questions can reference course materials with contextual information

#### Technical Constraints
- **Session Management**: Separate authentication sessions required for different user roles
- **Live Class Continuity**: No mechanism for teachers to exit mid-class - designed for complete session attendance
- **Role-Based Access**: Strict separation of student and teacher functionalities with no role switching

---

## 💻 Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | User Interface Library |
| Vite | Latest | Build Tool & Dev Server |
| Tailwind CSS | 3+ | Utility-First CSS Framework |
| React Router | 6+ | Client-Side Routing |
| Fetch API | Native | HTTP Client |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript Runtime |
| Express.js | 4+ | Web Application Framework |
| MongoDB | Latest | NoSQL Document Database |
| Mongoose | Latest | MongoDB Object Modeling |
| JWT | Latest | Authentication Tokens |
| bcrypt | Latest | Password Hashing |
| CORS | Latest | Cross-Origin Resource Sharing |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/PranjalSK03/Vidya_Vichar_group5.git
cd Vidya_Vichar_group5
```

2. **Navigate to backend directory**
```bash
cd backend
```

3. **Install dependencies**
```bash
npm install
```

4. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vidya-vichar

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

5. **Start the backend server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the frontend directory:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PRODUCTION_API_URL=https://your-production-domain.com/api
```

4. **Start the frontend development server**
```bash
npm run dev
```

### Database Setup

1. **MongoDB Local Installation**
```bash
# Install MongoDB on Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

2. **MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get connection string and update `MONGODB_URI` in `.env`

### Running the Complete Application

1. **Start MongoDB** (if using local installation)
```bash
sudo systemctl start mongodb
```

2. **Start Backend** (Terminal 1)
```bash
cd backend
npm run dev
```

3. **Start Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api

### ⚠️ Important Setup Notes

#### Browser Session Requirements
- **Teachers and Students**: Must use separate browsers or incognito/private sessions
- **Reason**: Different authentication tokens and session management
- **Recommended**: 
  - Teachers: Use Chrome/Firefox normal session
  - Students: Use Chrome/Firefox incognito session or different browser

#### Live Class Constraints
- **Teachers cannot leave**: Once a live class is created and started, teachers must stay until the class is officially ended
- **No exit mechanism**: System is designed for complete session attendance
- **Class management**: Teachers should plan accordingly before starting live sessions

#### TA (Teaching Assistant) Setup
- TAs register using the **Teacher Registration** form
- TAs receive full teacher permissions in the system
- No separate TA role - they function as regular teachers

---

## 📁 Project Structure

```
Vidya_Vichar_group5/
├── README.md
├── SYSTEM_FLOW.md
├── INTEGRATION_COMPLETE.md
├── setup_backend_integration.sh
├── docs/
│   └── teacher_dashboard.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                    # API integration utilities
│   │   ├── assets/                 # Static assets
│   │   ├── components/             # Reusable React components
│   │   │   ├── AuthDebug.jsx
│   │   │   ├── BackendTest.jsx
│   │   │   └── QuestionForm.jsx
│   │   ├── config/
│   │   │   └── api.js              # API configuration
│   │   ├── context/                # React Context providers
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── layouts/                # Page layout components
│   │   ├── pages/                  # Application pages
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── StudentLogin.jsx
│   │   │   │   ├── StudentRegister.jsx
│   │   │   │   ├── TeacherLogin.jsx
│   │   │   │   └── TeacherRegister.jsx
│   │   │   ├── student/            # Student dashboard pages
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── EnrolledCourses.jsx
│   │   │   │   ├── JoinClass.jsx
│   │   │   │   ├── ClassDoubts.jsx
│   │   │   │   ├── LectureDoubts.jsx
│   │   │   │   └── ResourceManager.jsx
│   │   │   ├── teacher/            # Teacher dashboard pages
│   │   │   │   ├── TeacherDashboard.jsx
│   │   │   │   ├── CreateCourse.jsx
│   │   │   │   ├── ManageCreatedCourses.jsx
│   │   │   │   ├── AllDoubtsTeacher.jsx
│   │   │   │   └── ClassPage.jsx
│   │   │   └── LandingPage.jsx     # Main landing page
│   │   ├── store/                  # State management
│   │   ├── styles/                 # Global CSS styles
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # Main App component
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
└── backend/
    ├── src/
    │   ├── config/
    │   │   └── db.js               # Database configuration
    │   ├── controllers/            # Request handlers
    │   │   ├── auth.controller.js
    │   │   ├── student.controller.js
    │   │   └── teacher.controller.js
    │   ├── models/                 # Mongoose schemas
    │   │   ├── Students.js
    │   │   ├── Teachers.js
    │   │   ├── Courses.js
    │   │   ├── Lecture.js
    │   │   ├── Question.js
    │   │   ├── Answer.js
    │   │   └── Resource.js
    │   ├── routes/                 # API routes
    │   │   ├── auth.routes.js
    │   │   └── user.routes.js
    │   ├── middlewares/            # Custom middleware
    │   ├── services/               # Business logic services
    │   ├── utils/                  # Utility functions
    │   └── app.js                  # Express app configuration
    ├── tests/                      # Test files
    ├── package.json
    └── server.js                   # Server entry point
```

---

## 🗄️ Database Schema

### Student Model
```javascript
{
  username: String,        // Email address (unique)
  password: String,        // Hashed password
  name: String,           // Student full name
  roll_no: String,        // Roll number (unique)
  is_TA: String,          // Teaching Assistant status
  courses_id_request: [String], // Pending course requests
  courses_id_enrolled: [String], // Enrolled courses
  batch: String,          // M.Tech | B.Tech | PHD | MS
  branch: String          // CSE | ECE
}
```

### Teacher Model
```javascript
{
  teacher_id: String,     // Unique teacher identifier
  username: String,       // Email address (unique)
  name: String,          // Teacher full name (unique)
  password: String,      // Hashed password
  courses_id: [String]   // Array of course IDs
}
```

### Course Model
```javascript
{
  course_id: String,      // Unique course identifier
  course_name: String,    // Course title
  teacher_id: [String],   // Array of teacher IDs
  TA: [String],          // Teaching assistants
  batch: String,         // Target batch
  branch: String,        // Target branch
  valid_time: Date,      // Course validity period
  request_list: [String], // Pending student requests
  student_list: [String], // Enrolled students
  lecture_id: [String]   // Associated lectures
}
```

### Lecture Model
```javascript
{
  lecture_id: String,     // Unique lecture identifier
  lecture_title: String,  // Lecture title
  course_id: String,      // Associated course
  class_start: Date,      // Start time
  class_end: Date,        // End time
  lec_num: Number,        // Lecture number
  query_id: [String],     // Associated questions
  joined_students: [String], // Students who joined
  teacher_id: String,     // Lecture teacher
  is_teacher_ended: Boolean, // Teacher end status
  teacher_ended_at: Date  // End timestamp
}
```

### Question Model
```javascript
{
  question_id: String,    // Unique question identifier
  question_text: String,  // Question content
  student_id: String,     // Student who asked
  lecture_id: String,     // Associated lecture
  timestamp: Date,        // Question timestamp
  is_answered: Boolean,   // Answer status
  is_important: Boolean,  // Importance flag
  upvotes: Number,        // Upvote count
  upvoted_by: [String],   // Students who upvoted
  answer: [ObjectId],     // References to Answer documents
  referenced_resources: [ObjectId], // Referenced resources
  resource_context: String // Context of resource reference
}
```

### Answer Model
```javascript
{
  answerer_name: String,  // Name of person who answered
  answer: Mixed,          // Answer content (text or file)
  answer_type: String     // 'text' | 'file'
}
```

### Resource Model
```javascript
{
  resource_id: String,    // Unique resource identifier
  course_id: String,      // Associated course
  title: String,          // Resource title
  description: String,    // Resource description
  resource_type: String,  // 'text' | 'pdf' | 'video' | 'link' | 'image' | 'document'
  content: String,        // Content or file URL
  file_url: String,       // File URL for uploads
  tags: [String],         // Resource tags
  topic: String,          // Topic/chapter
  lecture_ids: [String],  // Associated lectures
  added_by: String,       // Creator ID
  added_by_role: String,  // 'teacher' | 'ta'
  created_at: Date,       // Creation timestamp
  updated_at: Date        // Last update timestamp
}
```

---

## 📡 API Endpoints

### Authentication Endpoints
```
POST /api/auth/student/register     - Student Registration
POST /api/auth/student/login        - Student Login
POST /api/auth/teacher/register     - Teacher Registration  
POST /api/auth/teacher/login        - Teacher Login
POST /api/auth/logout               - User Logout
GET  /api/auth/student/batch-options - Get Batch Options
GET  /api/auth/student/branch-options - Get Branch Options
```

### Student Endpoints
```
GET  /api/users/student/dashboard/overview        - Dashboard Overview
GET  /api/users/student/dashboard/enrolled-courses - Enrolled Courses
GET  /api/users/student/dashboard/pending-courses  - Pending Course Requests
GET  /api/users/student/dashboard/all-courses      - Available Courses
GET  /api/users/student/dashboard/available-classes - Available Live Classes
GET  /api/users/student/lecture/:lectureId/questions - Lecture Questions
POST /api/users/student/dashboard/join-course      - Join Course Request
POST /api/users/student/dashboard/join-class       - Join Live Class
POST /api/users/student/dashboard/ask-question     - Ask Question
```

### Teacher Endpoints
```
GET  /api/users/teacher/dashboard/overview         - Dashboard Overview
GET  /api/users/teacher/dashboard/your-courses     - Teacher's Courses
GET  /api/users/teacher/dashboard/course/:courseId - Course Details
GET  /api/users/teacher/all-questions              - All Questions
GET  /api/users/teacher/lecture/:lectureId/questions - Lecture Questions
POST /api/users/teacher/dashboard/create-course    - Create Course
POST /api/users/teacher/dashboard/create-class     - Create Live Class
POST /api/users/teacher/answer-question            - Answer Question
PUT  /api/users/teacher/course/:courseId/accept-request - Accept Student Request
```

---

## 👥 User Roles & Permissions & Assumptionns

### Student Permissions
- ✅ Register and login to the system
- ✅ Browse and request course enrollment
- ✅ Join live classes after enrollment approval
- ✅ Ask questions during lectures
- ✅ View all questions and answers in enrolled courses
- ✅ Access course resources and materials
- ✅ Track enrollment status and course progress
- ❌ Cannot answer questions from other students
- ❌ Cannot approve course enrollment requests
- ❌ Cannot create courses or lectures

### Teacher Permissions
- ✅ Register and login to the system
- ✅ Create and manage courses
- ✅ Accept or reject student enrollment requests
- ✅ Create and conduct live lectures (cannot leave mid-class)
- ✅ View all student questions across courses
- ✅ Provide multiple answers to student questions
- ✅ Upload and manage course resources
- ✅ Access student engagement analytics
- ✅ Manage teaching assistants (TAs)
- ❌ Cannot enroll in courses as a student
- ❌ Cannot delete other teachers' courses
- ❌ Cannot leave live classes once started


### Teaching Assistant (TA) Permissions
- ✅ Join the application with Teacher role and permissions
- ✅ All teacher-level functionalities available
- ✅ Can create and manage courses
- ✅ Can answer student questions
- ✅ Can conduct live lectures
- ℹ️ **Note**: TAs are treated as Teachers in the system - no separate TA role exists

### Session & Browser Requirements
- 🔒 **Teachers and Students**: Must use separate browsers or browser sessions
- 🔒 **Live Classes**: Teachers cannot exit once class is created and started
- 🔒 **Authentication**: Separate login sessions required for different user types

---

## 👥 Team Information

**Team Number**: 5  
**Project Name**: Vidya Vichar  
**Course**: SSD 

### Team Members
- **Member 1**: 2025201037 Prateek Tiwari     - Frontend Development & UI/UX  & Backend Integration & Testing
- **Member 2**: 2025201096 Meet Ghelani       - Backend Development & API Design  & Frontend Development & UI/UX & Testing
- **Member 3**: 2025201079 Pranjal Katiyar    - Database Design & API Integration  & Authentication & Security
- **Member 4**: 2025204040 Peri Sri Charan    - Frontend Development & UI/UX
- **Member 5**: 2025201049 Pavan Kumar Reddy  - Frontend Modules and Backend Modules 


---



## Backend Model Schemas

### Student
| Field        | Type    | Description                                  |
|--------------|---------|----------------------------------------------|
| username     | String  | Email, unique, required                      |
| password     | String  | Hashed password, required                    |
| name         | String  | Student's name, required                     |
| roll_no      | String  | Roll number, required                        |
| is_TA        | Boolean | Is Teaching Assistant, default: false         |
| courses_id   | String  | Course ID(s), required                       |
| batch        | String  | MT/BT/PH/MS, required                        |
| branch       | String  | CSE/ECE, required                            |

### Teacher
| Field        | Type    | Description                                  |
|--------------|---------|----------------------------------------------|
| teacher_id   | String  | Unique, required                             |
| username     | String  | Email, unique, required                      |
| password     | String  | Hashed password, required                    |
| courses_id   | [String]| Array of unique course IDs                   |

### Course
| Field         | Type      | Description                                 |
|---------------|-----------|---------------------------------------------|
| course_id     | String    | Unique, required                            |
| course_name   | String    | Required                                    |
| teacher_id    | [String]  | Array of unique teacher IDs                 |
| batch         | String    | MT/BT/PH/MS, required                       |
| branch        | String    | CSE/ECE, required                           |
| valid_time    | Date      | Course valid until (date/time), required    |
| request_list  | [String]  | Student IDs requesting enrollment           |
| student_list  | [String]  | Enrolled student IDs                        |
| lecture_id    | [String]  | Array of lecture IDs                        |

### Lecture
| Field         | Type      | Description                                 |
|---------------|-----------|---------------------------------------------|
| lecture_id    | String    | Unique, required                            |
| course_id     | String    | Unique, required (course this lecture is in)|
| class_date_time| Date     | Date and time of the class                  |
| lec_num       | Number    | Lecture number for the course               |
| query_id      | [String]  | Array of unique query IDs                   |
| teacher_id    | String    | Teacher for the lecture                     |

### Question
| Field         | Type      | Description                                 |
|---------------|-----------|---------------------------------------------|
| question_id   | String    | Unique, required                            |
| student_id    | String    | Unique, required (who asked)                |
| lecture_id    | String    | Unique, required (which lecture)            |
| timestamp     | Date      | Date and time of question                   |
| is_answered   | Boolean   | Whether answered                            |
| is_teacher_answer | Boolean| Whether answered by teacher                 |
| upvotes       | Number    | Upvote count                                |
| upvoted_by    | [String]  | Array of unique student IDs                 |
| answer        | [Answer]  | Array of answers (see below)                |

### Answer
| Field         | Type      | Description                                 |
|---------------|-----------|---------------------------------------------|
| answerer_name | String    | Name of the answerer                        |
| answer        | Mixed     | Text or file reference                      |
| answer_type   | String    | 'text' or 'file'                            |
