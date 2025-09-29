# Vidya Vichar - System Architecture Flow

## Team 5 Project Overview
**Project Name**: Vidya Vichar  
**Team Number**: 5  
**Tagline**: Learn. Ask. Grow.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              VIDYA VICHAR SYSTEM                               │
│                            Educational Q&A Platform                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│  React + Vite + Tailwind CSS                                                   │
│                                                                                 │
│  ┌────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐            │
│  │  Landing   │ │     Auth     │ │   Student   │ │   Teacher    │            │
│  │   Pages    │ │    System    │ │  Dashboard  │ │  Dashboard   │            │
│  └────────────┘ └──────────────┘ └─────────────┘ └──────────────┘            │
│                                                                                 │
│  Student Features:              │  Teacher Features:                          │
│  • Course Enrollment           │  • Course Management                        │
│  • Live Class Joining         │  • Lecture Creation                         │
│  • Question Asking            │  • Question Answering                       │
│  • Resource Access            │  • Student Management                       │
│                               │  • Analytics & Reports                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                    HTTP/HTTPS
                                   REST API Calls
                                        │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                BACKEND LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Node.js + Express.js + JWT Authentication                                     │
│                                                                                 │
│  ┌────────────────┐ ┌─────────────────┐ ┌──────────────────┐                 │
│  │   Auth Routes  │ │  Student Routes │ │  Teacher Routes  │                 │
│  │                │ │                 │ │                  │                 │
│  │ • Register     │ │ • Dashboard     │ │ • Dashboard      │                 │
│  │ • Login        │ │ • Courses       │ │ • Course Mgmt    │                 │
│  │ • Logout       │ │ • Classes       │ │ • Lecture Mgmt   │                 │
│  │ • JWT Token    │ │ • Questions     │ │ • Q&A Mgmt       │                 │
│  └────────────────┘ └─────────────────┘ └──────────────────┘                 │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                        CONTROLLERS                                       │ │
│  │                                                                          │ │
│  │  AuthController    StudentController    TeacherController                │ │
│  │  • User Registration & Authentication                                    │ │
│  │  • JWT Token Management                                                  │ │
│  │  • Role-Based Access Control                                             │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                   Mongoose ODM
                                        │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               DATABASE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  MongoDB (NoSQL Document Database)                                             │
│                                                                                 │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │   Students  │ │   Teachers   │ │   Courses    │ │   Lectures   │         │
│  └─────────────┘ └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                                                 │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐                           │
│  │  Questions  │ │   Answers    │ │  Resources   │                           │
│  └─────────────┘ └──────────────┘ └──────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## User Flow Diagrams

### Student User Journey
```
START → Landing Page → Student Login/Register → Student Dashboard
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    │                                 │                                 │
                    ▼                                 ▼                                 ▼
            ┌───────────────┐              ┌─────────────────┐                ┌──────────────────┐
            │   My Courses  │              │   Join Class    │                │   All Doubts     │
            │               │              │                 │                │                  │
            │ • Enrolled    │              │ • Available     │                │ • My Questions   │
            │ • Pending     │              │ • Live Classes  │                │ • All Questions  │
            │ • Attended    │              │ • Join & Ask    │                │ • View Answers   │
            └───────────────┘              └─────────────────┘                └──────────────────┘
                    │                              │                                 │
                    ▼                              ▼                                 ▼
            Course Details                 Class Q&A Session                Ask New Question
            • Lectures                     • Real-time Q&A                  • Reference Resources
            • Resources                    • Multiple Answers               • Get Teacher Response
            • Questions                    • Teacher Interaction
```

### Teacher User Journey
```
START → Landing Page → Teacher Login/Register → Teacher Dashboard
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    │                                 │                                 │
                    ▼                                 ▼                                 ▼
            ┌───────────────┐              ┌─────────────────┐                ┌──────────────────┐
            │  My Courses   │              │ Live Classes    │                │  All Doubts      │
            │               │              │                 │                │                  │
            │ • Create      │              │ • Create Class  │                │ • All Questions  │
            │ • Manage      │              │ • Manage Live   │                │ • Answer Mgmt    │
            │ • Students    │              │ • Q&A Session   │                │ • Student Help   │
            └───────────────┘              └─────────────────┘                └──────────────────┘
                    │                              │                                 │
                    ▼                              ▼                                 ▼
            Course Management              Live Class Session              Question & Answer Mgmt
            • Accept Requests              • Monitor Questions             • Multiple Answers
            • Add Resources                • Real-time Response            • Detailed Explanations
            • Track Progress               • Student Interaction           • Resource References
```

## Data Flow Architecture

### Question & Answer Flow
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          QUESTION & ANSWER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────────────┘

Student Asks Question
        │
        ▼
┌─────────────────┐
│   Question      │ ────► MongoDB Questions Collection
│   Created       │       • question_text
│                 │       • student_id  
│                 │       • lecture_id
│                 │       • timestamp
│                 │       • referenced_resources
└─────────────────┘       • is_answered: false
        │
        ▼
Question appears in Teacher Dashboard
        │
        ▼
┌─────────────────┐
│   Teacher       │ ────► MongoDB Answers Collection  
│   Provides      │       • answerer_name
│   Answer        │       • answer (text/file)
│                 │       • answer_type
└─────────────────┘       • linked to question_id
        │
        ▼
┌─────────────────┐
│   Question      │ ────► Update Question Document
│   Updated       │       • is_answered: true
│                 │       • answer: [ObjectId references]
└─────────────────┘       • multiple answers supported
        │
        ▼
Student sees answer in Dashboard
```

### Course Enrollment Flow
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         COURSE ENROLLMENT WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────────────────┘

Student Requests Enrollment
        │
        ▼
┌─────────────────┐
│   Request       │ ────► Student.courses_id_request.push(course_id)
│   Submitted     │       Course.request_list.push(student_id)
└─────────────────┘
        │
        ▼
Teacher sees request in Dashboard
        │
        ▼
┌─────────────────┐
│   Teacher       │ ────► Course.request_list.remove(student_id)
│   Approves      │       Course.student_list.push(student_id)  
│                 │       Student.courses_id_enrolled.push(course_id)
└─────────────────┘       Student.courses_id_request.remove(course_id)
        │
        ▼
Student enrolled successfully
```

## API Endpoint Structure

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

## Security & Authentication

### JWT Token Flow
```
1. User Login → Server validates credentials
2. Server generates JWT with payload: {id, role, iat, exp}
3. Client stores token in localStorage
4. Client sends token in Authorization header: "Bearer <token>"
5. Server middleware validates token on protected routes
6. Route access based on role (student/teacher)
```

### Role-Based Access Control
```
Student Access:
- Can ask questions
- Can join courses (with approval)
- Can view own questions and answers
- Can access enrolled course content

Teacher Access:
- Can answer questions
- Can create and manage courses
- Can create live classes
- Can accept/reject student requests
- Can view all student questions
```

## Database Schema Relationships

```
Students ←→ Courses (Many-to-Many via student_list, courses_id_enrolled)
Teachers ←→ Courses (Many-to-Many via teacher_id, courses_id)
Courses ←→ Lectures (One-to-Many via lecture_id)
Students ←→ Questions (One-to-Many via student_id)
Questions ←→ Answers (One-to-Many via answer array)
Questions ←→ Resources (Many-to-Many via referenced_resources)
Lectures ←→ Questions (One-to-Many via lecture_id)
```

## Technology Stack Summary

### Frontend Stack
- **React 18** - UI Library
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Utility-First Styling
- **React Router** - Client-Side Routing
- **Fetch API** - HTTP Client for API calls

### Backend Stack
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Application Framework
- **MongoDB** - NoSQL Document Database
- **Mongoose** - MongoDB Object Modeling
- **JWT** - Authentication & Authorization
- **bcrypt** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing

### Development Tools
- **Git** - Version Control
- **npm** - Package Management
- **VS Code** - Code Editor
- **Postman/Thunder Client** - API Testing

This architecture ensures scalability, maintainability, and clear separation of concerns between the frontend presentation layer, backend business logic, and database persistence layer.