# Teacher Dashboard Data & ID Flow

This document describes how teacher-related identifiers and dashboard endpoints work after recent fixes.

## Identifier Strategy

- Authentication JWT: contains `{ id: <Mongo ObjectId>, role: 'teacher' }`.
- Teacher model fields:
  - `_id`: Mongo ObjectId, used only for auth/session lookups.
  - `teacher_id`: human / external string (e.g., `T001`) used for course & lecture linkage.
  - `courses_id`: array of `course_id` strings referencing `Course.course_id`.
- Course model fields:
  - `course_id`: external string id (unique).
  - `teacher_id`: array of `teacher.teacher_id` string(s) (not ObjectIds).
  - `request_list`, `student_list`, `TA`: store **stringified Student `_id`** values.
- Lecture model fields:
  - `lecture_id`: generated unique string.
  - `course_id`: string referencing course.
  - `teacher_id`: string equal to `teacher.teacher_id`.

## Why This Split?

Using string-based external identifiers (`teacher_id`, `course_id`, etc.) allows readable references while keeping Mongo `_id` stable for authentication. We avoid mixing ObjectIds and external IDs in the same array.

## Core Teacher Endpoints

| Endpoint | Purpose | Notes |
|----------|---------|-------|
| `GET /api/users/teacher/dashboard/overview` | Basic teacher profile & pending requests count | Aggregates pending counts via courses listed in `Teacher.courses_id` |
| `GET /api/users/teacher/courses` | Returns enriched list of teacher courses | Includes student/pending/lecture counts & arrays |
| `GET /api/users/teacher/course/:course_id/lectures` | All lectures in a course | Authorization checks teacher owns course |
| `POST /api/users/teacher/course` | Create new course | Adds `course_id` to all involved teachers' `courses_id` arrays |
| `POST /api/users/teacher/lecture` | Create lecture | Accepts either `(lecture_title,class_start,class_end)` or `(title,start_time,end_time)` |
| `GET /api/users/teacher/course/:course_id/pending-requests` | Pending student join requests | Now returns enriched student objects |
| `POST /api/users/teacher/course/accept-requests` | Accept multiple students | Body: `{ course_id, student_ids: [] }` |
| `POST /api/users/teacher/course/reject-requests` | Reject multiple students | Same body structure |

## Response Shapes

### /teacher/courses
```
{
  success: true,
  data: {
    courses: [
      {
        course_id,
        course_name,
        batch,
        branch,
        valid_time,
        request_list: [studentIdStr],
        student_list: [studentIdStr],
        TA: [studentIdStr],
        lecture_id: [lectureIdStr],
        lecture_count: Number
      }
    ]
  }
}
```

### /teacher/course/:course_id/lectures
```
{
  success: true,
  data: {
    lectures: [
      { lecture_id, lecture_title, course_id, class_start, class_end, lec_num, topic }
    ]
  }
}
```

### /teacher/course/:course_id/pending-requests
```
{
  success: true,
  data: {
    pending_students: [ { id, name, roll_no, batch, branch } ]
  }
}
```

## Frontend Consumption Pattern

- Dashboard Overview calls `/teacher/dashboard/overview` then `/teacher/courses` once to compute aggregated stats (students, lectures, pending requests).
- MyCourses, CreateLecture, CompletedLectures reuse the enriched `/teacher/courses` response for selection and counts.
- CompletedLectures loads lectures via `/teacher/course/:course_id/lectures`.
- AcceptRequests loads pending via `/teacher/course/:course_id/pending-requests` and acts with accept/reject endpoints (single-student helpers wrap array version).

## Common Pitfalls Avoided

| Pitfall | Fix |
|---------|-----|
| Mixing ObjectId and string IDs in course.teacher_id | Always store `teacher.teacher_id` strings |
| Using `Teacher.findById(course.teacher_id[0])` | Replaced with `Teacher.findOne({ teacher_id: ... })` when needed |
| Route clash `/teacher/:teacher_id` capturing `/teacher/courses` | Reordered to declare static `/teacher/courses` first |
| Lecture creation failing due to naming mismatch | Added dual field name support |

## Future Improvements
- Consider migrating student id arrays in `Course` to `ObjectId` types for better population capability.
- Add indexing on frequently queried fields: `Course.course_id`, `Teacher.teacher_id`, `Lecture.course_id`.
- Add soft-delete flags instead of deletions for audit.

## Quick Test Checklist
1. Register teacher → login → store token
2. Create course → verify it appears in `/teacher/courses`
3. Create lecture → verify in `/teacher/course/:course_id/lectures`
4. Simulate student join request (student side) → check `/pending-requests`
5. Accept request → student moves from `request_list` to `student_list`

All above now align with current implementation.
