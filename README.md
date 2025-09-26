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
└── docs/                           # documentation (API specs, DB schema)
