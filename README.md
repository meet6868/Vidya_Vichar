project-root/
│
├── frontend/                       # React / Next.js / Vite app
│   ├── public/                     # static assets (logos, icons)
│   ├── src/
│   │   ├── api/                    # API call wrappers (axios/fetch)
│   │   ├── assets/                 # images, css
│   │   ├── components/             # reusable UI components
│   │   ├── context/                # React context providers
│   │   ├── hooks/                  # custom hooks
│   │   ├── layouts/                # page layouts
│   │   ├── pages/                  # routes/pages
│   │   │   ├── auth/               # login, register pages
│   │   │   ├── admin/              # admin dashboard
│   │   │   ├── teacher/            # teacher dashboard
│   │   │   ├── student/            # student dashboard
│   │   │   └── class/              # class pages, question/answer views
│   │   ├── store/                  # Redux / Zustand state mgmt
│   │   ├── styles/                 # global css/tailwind config
│   │   ├── utils/                  # frontend helpers
│   │   └── main.tsx / index.tsx    # entry
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/                 # DB config, env loader
│   │   │   └── db.js
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── University.js
│   │   │   ├── User.js
│   │   │   ├── Class.js
│   │   │   ├── ClassMembership.js
│   │   │   ├── Question.js
│   │   │   ├── Answer.js
│   │   │   └── Notification.js
│   │   ├── routes/                 # Express routes
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── class.routes.js
│   │   │   ├── question.routes.js
│   │   │   └── notification.routes.js
│   │   ├── controllers/            # Business logic for routes
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── class.controller.js
│   │   │   ├── question.controller.js
│   │   │   └── notification.controller.js
│   │   ├── services/               # Services (mail, notifications, AI)
│   │   │   ├── mail.service.js
│   │   │   ├── notify.service.js
│   │   │   └── search.service.js
│   │   ├── middlewares/            # auth, error handlers
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── utils/                  # helpers
│   │   │   ├── generateCode.js
│   │   │   └── logger.js
│   │   └── app.js                  # main Express app
│   ├── tests/                      # Jest / Mocha tests
│   ├── .env
│   ├── package.json
│   └── server.js                   # entry point
│


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
