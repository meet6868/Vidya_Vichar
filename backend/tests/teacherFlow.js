#!/usr/bin/env node
/**
 * Automated Teacher Flow Smoke Test
 * Steps:
 * 1. Ensure server running (or start it) on PORT (default 5000)
 * 2. Login teacher; if not exists register then login
 * 3. Create course (idempotent)
 * 4. List courses
 * 5. Create lecture
 * 6. List lectures
 */

const DEFAULT_PORT = process.env.PORT || 5000;
const BASE = `http://localhost:${DEFAULT_PORT}/api`;
const TEACHER = {
  teacher_id: 'TTEST1',
  name: 'Test Teacher',
  username: 'test.teacher1@example.com',
  password: 'Pass1234'
};
const COURSE = {
  course_id: 'CSE500',
  course_name: 'Advanced Systems',
  batch: 'M.Tech',
  branch: 'CSE',
  valid_time: new Date('2025-12-31T00:00:00.000Z').toISOString()
};

async function safeFetch(url, options = {}, retries = 2) {
  try {
    const res = await fetch(url, options);
    return res;
  } catch (e) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 500));
      return safeFetch(url, options, retries - 1);
    }
    throw e;
  }
}

async function jsonOrText(res) {
  try { return await res.json(); } catch { return await res.text(); }
}

async function ensureServer() {
  try {
    const res = await safeFetch(`${BASE}/auth/logout`);
    if (res.status === 404 || res.status === 200) {
      console.log('Server reachable.');
      return true;
    }
  } catch (e) {
    console.log('Server not reachable, attempting to start inline...');
    try {
      const app = require('../src/app');
      app.listen(DEFAULT_PORT, () => console.log(`(Inline) Server started on ${DEFAULT_PORT}`));
      await new Promise(r => setTimeout(r, 1500));
      return true;
    } catch (err) {
      console.error('Failed to start inline server:', err.message);
      return false;
    }
  }
}

async function registerTeacher() {
  const res = await safeFetch(`${BASE}/auth/teacher/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEACHER)
  });
  const data = await jsonOrText(res);
  if (res.ok) console.log('Registered teacher (or already exists).');
  else console.log('Teacher register response:', data);
}

async function loginTeacher() {
  const res = await safeFetch(`${BASE}/auth/teacher/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: TEACHER.username, password: TEACHER.password })
  });
  const data = await jsonOrText(res);
  if (!res.ok || !data.token) {
    throw new Error(`Login failed: ${JSON.stringify(data)}`);
  }
  console.log('Login success.');
  return data.token;
}

async function createCourse(token) {
  const res = await safeFetch(`${BASE}/users/teacher/course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(COURSE)
  });
  const data = await jsonOrText(res);
  if (res.ok) console.log('Course creation response OK');
  else console.log('Course creation response (possibly duplicate):', data);
}

async function listCourses(token) {
  const res = await safeFetch(`${BASE}/users/teacher/courses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await jsonOrText(res);
  if (!res.ok) throw new Error('List courses failed: ' + JSON.stringify(data));
  console.log('Courses:', JSON.stringify(data, null, 2));
  return data.data?.courses || [];
}

function futureISO(minutes) {
  return new Date(Date.now() + minutes * 60000).toISOString();
}

async function createLecture(token) {
  const body = {
    course_id: COURSE.course_id,
    lecture_title: 'Intro Lecture',
    class_start: futureISO(60),
    class_end: futureISO(120)
  };
  const res = await safeFetch(`${BASE}/users/teacher/lecture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  const data = await jsonOrText(res);
  if (res.ok) console.log('Lecture created.');
  else console.log('Lecture create response:', data);
}

async function listLectures(token) {
  const res = await safeFetch(`${BASE}/users/teacher/course/${COURSE.course_id}/lectures`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await jsonOrText(res);
  if (!res.ok) throw new Error('List lectures failed: ' + JSON.stringify(data));
  console.log('Lectures:', JSON.stringify(data, null, 2));
}

(async () => {
  console.log('== Teacher Flow Smoke Test ==');
  const ok = await ensureServer();
  if (!ok) process.exit(1);
  await registerTeacher();
  const token = await loginTeacher();
  await createCourse(token);
  await listCourses(token);
  await createLecture(token);
  await listLectures(token);
  console.log('✅ Flow Completed');
  process.exit(0);
})();
