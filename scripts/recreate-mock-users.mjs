#!/usr/bin/env node
/**
 * recreate-mock-users.mjs
 *
 * Deletes SQL-inserted mock users (which cause 500 on login) and recreates
 * them via the Supabase Admin API. Then re-inserts all domain data using
 * the PostgREST API with new UUIDs.
 *
 * Usage: node scripts/recreate-mock-users.mjs
 */

// ─── Configuration ───────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://iitimehvkmtmreyaxrbj.supabase.co';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGltZWh2a210bXJleWF4cmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTA0OTksImV4cCI6MjA5MTMyNjQ5OX0.WByom0t9VeHR57-nPZrKgts-IHf7_kIq4DR_2W9lK9A';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGltZWh2a210bXJleWF4cmJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc1MDQ5OSwiZXhwIjoyMDkxMzI2NDk5fQ.RDs--A5nQgVipTtkv7A2Y4W1wMhXgzVXOzKXaGsGFio';

// ─── Fixed IDs (not tied to auth.users) ──────────────────────────────────────

const SCHOOL1 = 'f0000001-0000-4000-a000-000000000001';
const SCHOOL2 = 'f0000001-0000-4000-a000-000000000002';

const CLASS = {
  'X-IPA-1':    'e0000001-0000-4000-a000-000000000001',
  'X-IPA-2':    'e0000001-0000-4000-a000-000000000002',
  'XI-IPA-1':   'e0000001-0000-4000-a000-000000000003',
  'X-Bahasa-1': 'e0000001-0000-4000-a000-000000000004',
};

const ARCH = {
  THINKER:     'a0000001-0000-4000-a000-000000000001',
  ENGINEER:    'a0000001-0000-4000-a000-000000000002',
  GUARDIAN:    'a0000001-0000-4000-a000-000000000003',
  STRATEGIST:  'a0000001-0000-4000-a000-000000000004',
  CREATOR:     'a0000001-0000-4000-a000-000000000005',
  SHAPER:      'a0000001-0000-4000-a000-000000000006',
  STORYTELLER: 'a0000001-0000-4000-a000-000000000007',
  PERFORMER:   'a0000001-0000-4000-a000-000000000008',
  HEALER:      'a0000001-0000-4000-a000-000000000009',
  DIPLOMAT:    'a0000001-0000-4000-a000-00000000000a',
  EXPLORER:    'a0000001-0000-4000-a000-00000000000b',
  MENTOR:      'a0000001-0000-4000-a000-00000000000c',
  VISIONARY:   'a0000001-0000-4000-a000-00000000000d',
};

// ─── User Definitions ────────────────────────────────────────────────────────

const TEACHERS = [
  { key: 'teacher1', email: 'teacher1@uniqcall.test', password: 'Teacher@123', full_name: 'Sari Rahayu',    oldUuid: 'f0000002-0000-4000-a000-000000000001', school: SCHOOL1, specialization: 'Matematika',       employee_id: 'NIP-198501012010' },
  { key: 'teacher2', email: 'teacher2@uniqcall.test', password: 'Teacher@123', full_name: 'Denny Kurniawan', oldUuid: 'f0000002-0000-4000-a000-000000000002', school: SCHOOL1, specialization: 'Fisika',           employee_id: 'NIP-198703152011' },
  { key: 'teacher3', email: 'teacher3@uniqcall.test', password: 'Teacher@123', full_name: 'Rina Wijaya',     oldUuid: 'f0000002-0000-4000-a000-000000000003', school: SCHOOL2, specialization: 'Bahasa Indonesia', employee_id: 'NIP-199002202012' },
];

const STUDENTS = [
  { key: 'student1',  email: 'student1@uniqcall.test',  password: 'Student@123', full_name: 'Ahmad Fauzan',      oldUuid: 'f0000003-0000-4000-a000-000000000001', school: SCHOOL1, cls: 'X-IPA-1',    archetype: 'THINKER',     vark: {visual:20,auditory:15,read_write:40,kinesthetic:25}, cognitive: {analytical:45,creative:8,linguistic:12,kinesthetic:5,social:8,observation:12,intuition:10}, level: 3, xp: 3200, streak: 7,  best: 14, onboarding: true },
  { key: 'student2',  email: 'student2@uniqcall.test',  password: 'Student@123', full_name: 'Putri Amelia Sari', oldUuid: 'f0000003-0000-4000-a000-000000000002', school: SCHOOL1, cls: 'X-IPA-1',    archetype: 'CREATOR',     vark: {visual:40,auditory:10,read_write:20,kinesthetic:30}, cognitive: {analytical:10,creative:35,linguistic:10,kinesthetic:15,social:10,observation:12,intuition:8}, level: 2, xp: 1800, streak: 3,  best: 7,  onboarding: true },
  { key: 'student3',  email: 'student3@uniqcall.test',  password: 'Student@123', full_name: 'Rizky Pratama',     oldUuid: 'f0000003-0000-4000-a000-000000000003', school: SCHOOL1, cls: 'X-IPA-1',    archetype: 'ENGINEER',    vark: {visual:25,auditory:20,read_write:25,kinesthetic:30}, cognitive: {analytical:30,creative:12,linguistic:5,kinesthetic:20,social:8,observation:18,intuition:7},  level: 4, xp: 4500, streak: 14, best: 21, onboarding: true },
  { key: 'student4',  email: 'student4@uniqcall.test',  password: 'Student@123', full_name: 'Nadia Fitriani',    oldUuid: 'f0000003-0000-4000-a000-000000000004', school: SCHOOL1, cls: 'X-IPA-1',    archetype: 'STORYTELLER', vark: {visual:15,auditory:35,read_write:30,kinesthetic:20}, cognitive: {analytical:8,creative:12,linguistic:35,kinesthetic:5,social:22,observation:10,intuition:8},  level: 2, xp: 1500, streak: 0,  best: 5,  onboarding: true },
  { key: 'student5',  email: 'student5@uniqcall.test',  password: 'Student@123', full_name: 'Dimas Aditya',      oldUuid: 'f0000003-0000-4000-a000-000000000005', school: SCHOOL1, cls: 'X-IPA-2',    archetype: 'STRATEGIST',  vark: {visual:30,auditory:25,read_write:20,kinesthetic:25}, cognitive: {analytical:25,creative:8,linguistic:10,kinesthetic:5,social:20,observation:15,intuition:17}, level: 3, xp: 2800, streak: 5,  best: 10, onboarding: true },
  { key: 'student6',  email: 'student6@uniqcall.test',  password: 'Student@123', full_name: 'Siti Aisyah',       oldUuid: 'f0000003-0000-4000-a000-000000000006', school: SCHOOL1, cls: 'X-IPA-2',    archetype: 'HEALER',      vark: {visual:20,auditory:30,read_write:25,kinesthetic:25}, cognitive: {analytical:12,creative:5,linguistic:10,kinesthetic:8,social:30,observation:25,intuition:10}, level: 2, xp: 2100, streak: 2,  best: 8,  onboarding: true },
  { key: 'student7',  email: 'student7@uniqcall.test',  password: 'Student@123', full_name: 'Bayu Setiawan',     oldUuid: 'f0000003-0000-4000-a000-000000000007', school: SCHOOL1, cls: 'X-IPA-2',    archetype: 'EXPLORER',    vark: {visual:20,auditory:15,read_write:15,kinesthetic:50}, cognitive: {analytical:10,creative:10,linguistic:5,kinesthetic:20,social:5,observation:30,intuition:20},  level: 3, xp: 3500, streak: 10, best: 15, onboarding: true },
  { key: 'student8',  email: 'student8@uniqcall.test',  password: 'Student@123', full_name: 'Maya Anggraini',    oldUuid: 'f0000003-0000-4000-a000-000000000008', school: SCHOOL1, cls: 'X-IPA-2',    archetype: 'DIPLOMAT',    vark: {visual:25,auditory:25,read_write:30,kinesthetic:20}, cognitive: {analytical:10,creative:5,linguistic:20,kinesthetic:5,social:30,observation:10,intuition:20},  level: 2, xp: 1200, streak: 1,  best: 4,  onboarding: true },
  { key: 'student9',  email: 'student9@uniqcall.test',  password: 'Student@123', full_name: 'Fajar Nugroho',     oldUuid: 'f0000003-0000-4000-a000-000000000009', school: SCHOOL1, cls: 'XI-IPA-1',   archetype: 'GUARDIAN',    vark: {visual:20,auditory:20,read_write:35,kinesthetic:25}, cognitive: {analytical:25,creative:5,linguistic:10,kinesthetic:5,social:25,observation:15,intuition:15},  level: 3, xp: 2600, streak: 4,  best: 12, onboarding: true },
  { key: 'student10', email: 'student10@uniqcall.test', password: 'Student@123', full_name: 'Anisa Rahma',       oldUuid: 'f0000003-0000-4000-a000-00000000000a', school: SCHOOL1, cls: 'XI-IPA-1',   archetype: 'MENTOR',      vark: {visual:25,auditory:30,read_write:25,kinesthetic:20}, cognitive: {analytical:15,creative:5,linguistic:20,kinesthetic:5,social:30,observation:15,intuition:10},  level: 4, xp: 4200, streak: 12, best: 30, onboarding: true },
  { key: 'student11', email: 'student11@uniqcall.test', password: 'Student@123', full_name: 'Galih Prasetyo',    oldUuid: 'f0000003-0000-4000-a000-00000000000b', school: SCHOOL1, cls: 'XI-IPA-1',   archetype: 'PERFORMER',   vark: {visual:30,auditory:30,read_write:15,kinesthetic:25}, cognitive: {analytical:5,creative:30,linguistic:10,kinesthetic:15,social:10,observation:15,intuition:15},  level: 2, xp: 1600, streak: 0,  best: 3,  onboarding: false },
  { key: 'student12', email: 'student12@uniqcall.test', password: 'Student@123', full_name: 'Dewi Lestari',      oldUuid: 'f0000003-0000-4000-a000-00000000000c', school: SCHOOL1, cls: 'XI-IPA-1',   archetype: 'VISIONARY',   vark: {visual:35,auditory:20,read_write:20,kinesthetic:25}, cognitive: {analytical:15,creative:20,linguistic:5,kinesthetic:5,social:10,observation:15,intuition:30},   level: 3, xp: 3000, streak: 6,  best: 9,  onboarding: true },
  { key: 'student13', email: 'student13@uniqcall.test', password: 'Student@123', full_name: 'Rendi Saputra',     oldUuid: 'f0000003-0000-4000-a000-00000000000d', school: SCHOOL2, cls: 'X-Bahasa-1', archetype: 'SHAPER',      vark: {visual:40,auditory:15,read_write:20,kinesthetic:25}, cognitive: {analytical:20,creative:30,linguistic:5,kinesthetic:15,social:5,observation:15,intuition:10},   level: 1, xp: 400,  streak: 0,  best: 2,  onboarding: false },
  { key: 'student14', email: 'student14@uniqcall.test', password: 'Student@123', full_name: 'Laila Nur',         oldUuid: 'f0000003-0000-4000-a000-00000000000e', school: SCHOOL2, cls: 'X-Bahasa-1', archetype: 'STORYTELLER', vark: {visual:15,auditory:25,read_write:40,kinesthetic:20}, cognitive: {analytical:5,creative:10,linguistic:35,kinesthetic:5,social:25,observation:10,intuition:10},   level: 2, xp: 1900, streak: 3,  best: 7,  onboarding: true },
  { key: 'student15', email: 'student15@uniqcall.test', password: 'Student@123', full_name: 'Arka Maulana',      oldUuid: 'f0000003-0000-4000-a000-00000000000f', school: SCHOOL2, cls: 'X-Bahasa-1', archetype: 'THINKER',     vark: {visual:20,auditory:20,read_write:30,kinesthetic:30}, cognitive: {analytical:40,creative:10,linguistic:15,kinesthetic:10,social:5,observation:10,intuition:10},   level: 1, xp: 600,  streak: 1,  best: 3,  onboarding: false },
];

const PARENTS = [
  { key: 'parent1', email: 'parent1@uniqcall.test', password: 'Parent@123', full_name: 'Hendra Fauzan',  oldUuid: 'f0000004-0000-4000-a000-000000000001', school: SCHOOL1, phone: '+6281234567001', childKey: 'student1' },
  { key: 'parent2', email: 'parent2@uniqcall.test', password: 'Parent@123', full_name: 'Wati Amelia',    oldUuid: 'f0000004-0000-4000-a000-000000000002', school: SCHOOL1, phone: '+6281234567002', childKey: 'student2' },
  { key: 'parent3', email: 'parent3@uniqcall.test', password: 'Parent@123', full_name: 'Budi Pratama',   oldUuid: 'f0000004-0000-4000-a000-000000000003', school: SCHOOL1, phone: '+6281234567003', childKey: 'student3' },
  { key: 'parent4', email: 'parent4@uniqcall.test', password: 'Parent@123', full_name: 'Sinta Fitriani', oldUuid: 'f0000004-0000-4000-a000-000000000004', school: SCHOOL1, phone: '+6281234567004', childKey: 'student4' },
  { key: 'parent5', email: 'parent5@uniqcall.test', password: 'Parent@123', full_name: 'Agus Setiawan',  oldUuid: 'f0000004-0000-4000-a000-000000000005', school: SCHOOL2, phone: '+6281234567005', childKey: 'student7' },
];

const ALL_USERS = [...TEACHERS, ...STUDENTS, ...PARENTS];

// UUID map populated after Admin API creation
const newUuids = {};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function uid(key) {
  if (!newUuids[key]) throw new Error(`UUID not found for key: ${key}`);
  return newUuids[key];
}

const s = (n) => uid(`student${n}`);
const t = (n) => uid(`teacher${n}`);
const p = (n) => uid(`parent${n}`);

/** Supabase Auth Admin API call */
async function adminApi(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: ANON_KEY,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, opts);
  const text = await res.text();
  if (!res.ok) throw new Error(`Auth ${method} ${path} -> ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

/** Supabase PostgREST API call */
async function restApi(table, method, query = '', body = null, prefer = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`;
  const headers = {
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    apikey: ANON_KEY,
    'Content-Type': 'application/json',
  };
  if (prefer) headers['Prefer'] = prefer;
  const opts = { method, headers };
  if (body !== null) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`REST ${method} /${table} -> ${res.status}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('json') && res.status !== 204) {
    return res.json();
  }
  return null;
}

/** Insert rows via REST API with ignore-duplicates */
async function insertRows(table, rows, upsert = false) {
  const prefer = upsert
    ? 'resolution=merge-duplicates,return=minimal'
    : 'resolution=ignore-duplicates,return=minimal';
  await restApi(table, 'POST', '', rows, prefer);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Uniqcall Mock User Recreation Script ===\n');

  // ── Step 0: Pre-cleanup ────────────────────────────────────────────────
  console.log('Step 0: Pre-cleanup (null teacher_ids on classes, delete tasks)...');
  const oldTeacherUuids = TEACHERS.map((tc) => tc.oldUuid).join(',');

  // Null out teacher_id on classes that reference old mock teachers
  await restApi('classes', 'PATCH',
    `teacher_id=in.(${oldTeacherUuids})`,
    { teacher_id: null },
    'return=minimal'
  );
  console.log('  Nulled classes.teacher_id');

  // Delete tasks referencing old teachers (cascades to task_submissions)
  await restApi('tasks', 'DELETE', `teacher_id=in.(${oldTeacherUuids})`);
  console.log('  Deleted tasks (cascades task_submissions)');
  console.log('  Pre-cleanup done.\n');

  // ── Step 1: Find testlogin@uniqcall.test ───────────────────────────────
  console.log('Step 1: Looking up testlogin@uniqcall.test...');
  let testLoginId = null;
  try {
    const listing = await adminApi('/admin/users?page=1&per_page=200');
    const found = listing.users?.find((u) => u.email === 'testlogin@uniqcall.test');
    if (found) {
      testLoginId = found.id;
      console.log(`  Found: ${testLoginId}`);
    } else {
      console.log('  Not found.');
    }
  } catch (e) {
    console.log(`  Warning: ${e.message}`);
  }

  // ── Step 2: Delete all old mock users via Admin API ────────────────────
  console.log('\nStep 2: Deleting old mock users via Admin API...');

  if (testLoginId) {
    try {
      await adminApi(`/admin/users/${testLoginId}`, 'DELETE');
      console.log('  Deleted testlogin@uniqcall.test');
    } catch (e) {
      console.log(`  (skip testlogin) ${e.message}`);
    }
  }

  for (const user of ALL_USERS) {
    try {
      await adminApi(`/admin/users/${user.oldUuid}`, 'DELETE');
      console.log(`  Deleted ${user.email}`);
    } catch (e) {
      console.log(`  (skip ${user.email}) ${e.message}`);
    }
  }
  console.log('  Deletion complete.\n');

  // ── Step 3: Wait ───────────────────────────────────────────────────────
  console.log('Step 3: Waiting 2s for cleanup to propagate...');
  await sleep(2000);
  console.log('  Done.\n');

  // ── Step 4: Create new users via Admin API ─────────────────────────────
  console.log('Step 4: Creating users via Admin API...');
  for (const user of ALL_USERS) {
    const result = await adminApi('/admin/users', 'POST', {
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.full_name },
    });
    newUuids[user.key] = result.id;
    console.log(`  Created ${user.email.padEnd(30)} -> ${result.id}`);
  }
  console.log('  All users created.\n');

  // Give the trigger a moment to create profiles
  await sleep(1000);

  // ── Step 5: Re-insert domain data via REST API ─────────────────────────
  console.log('Step 5: Re-inserting domain data...');

  // 5a. Profiles (upsert — trigger already created rows with role=NULL)
  console.log('  5a. Profiles (upsert)...');
  await insertRows('profiles', [
    ...TEACHERS.map((tc) => ({ id: uid(tc.key), role: 'teacher', full_name: tc.full_name, avatar_url: null, school_id: tc.school })),
    ...STUDENTS.map((st) => ({ id: uid(st.key), role: 'student', full_name: st.full_name, avatar_url: null, school_id: st.school })),
    ...PARENTS.map((pr) => ({ id: uid(pr.key), role: 'parent',  full_name: pr.full_name,  avatar_url: null, school_id: pr.school })),
  ], true);

  // 5b. Teachers
  console.log('  5b. Teachers...');
  await insertRows('teachers', TEACHERS.map((tc) => ({
    id: uid(tc.key),
    specialization: tc.specialization,
    employee_id: tc.employee_id,
  })));

  // 5c. Update classes.teacher_id
  console.log('  5c. Classes teacher_id...');
  const classTeacherMap = [
    [CLASS['X-IPA-1'],    'teacher1'],
    [CLASS['X-IPA-2'],    'teacher2'],
    [CLASS['XI-IPA-1'],   'teacher1'],
    [CLASS['X-Bahasa-1'], 'teacher3'],
  ];
  for (const [classId, teacherKey] of classTeacherMap) {
    await restApi('classes', 'PATCH', `id=eq.${classId}`, { teacher_id: uid(teacherKey) }, 'return=minimal');
  }

  // 5d. Students
  console.log('  5d. Students...');
  await insertRows('students', STUDENTS.map((st) => ({
    id: uid(st.key),
    class_id: CLASS[st.cls],
    archetype_id: ARCH[st.archetype],
    vark_profile: st.vark,
    cognitive_params: st.cognitive,
    mastery_level: st.level,
    total_xp: st.xp,
    current_streak: st.streak,
    best_streak: st.best,
    onboarding_completed: st.onboarding,
  })));

  // 5e. Parents + parent_student
  console.log('  5e. Parents...');
  await insertRows('parents', PARENTS.map((pr) => ({
    id: uid(pr.key),
    phone: pr.phone,
  })));

  console.log('  5e. Parent-student links...');
  await insertRows('parent_student', PARENTS.map((pr) => ({
    parent_id: uid(pr.key),
    student_id: uid(pr.childKey),
  })));

  // 5f. Tasks (6)
  console.log('  5f. Tasks...');
  await insertRows('tasks', [
    { id: 'e0000002-0000-4000-a000-000000000001', teacher_id: t(1), class_id: CLASS['X-IPA-1'],
      title: 'Tugas Individu: Deret Aritmetika',
      description: 'Selesaikan 10 soal deret aritmetika dan geometri. Tunjukkan langkah penyelesaian lengkap.',
      task_type: 'individual', target_archetype: 'THINKER',
      vark_adaptations: {V:"Buat diagram visual deret",A:"Jelaskan pola secara lisan",R:"Tulis rumus dan langkah",K:"Gunakan manipulatif fisik"},
      due_date: '2026-04-15T23:59:00+07:00', xp_reward: 30, knowledge_field: 'ALAM' },
    { id: 'e0000002-0000-4000-a000-000000000002', teacher_id: t(1), class_id: CLASS['X-IPA-1'],
      title: 'Proyek Kelompok: Statistika Kelas',
      description: 'Kumpulkan data tinggi badan kelas, buat tabel distribusi frekuensi, histogram, dan analisis.',
      task_type: 'group', target_archetype: 'ENGINEER',
      vark_adaptations: {V:"Buat infografis",A:"Presentasikan temuan",R:"Tulis laporan",K:"Ukur dan catat langsung"},
      due_date: '2026-04-20T23:59:00+07:00', xp_reward: 50, knowledge_field: 'ALAM' },
    { id: 'e0000002-0000-4000-a000-000000000003', teacher_id: t(2), class_id: CLASS['X-IPA-2'],
      title: 'Tugas Individu: Hukum Newton',
      description: 'Analisis 5 skenario kehidupan nyata menggunakan hukum Newton I, II, dan III.',
      task_type: 'individual', target_archetype: 'EXPLORER',
      vark_adaptations: {V:"Gambar diagram gaya",A:"Rekam penjelasan",R:"Tulis analisis",K:"Lakukan eksperimen mini"},
      due_date: '2026-04-10T23:59:00+07:00', xp_reward: 25, knowledge_field: 'ALAM' },
    { id: 'e0000002-0000-4000-a000-000000000004', teacher_id: t(2), class_id: CLASS['X-IPA-2'],
      title: 'Proyek Kelompok: Roket Air',
      description: 'Rancang dan bangun roket air sederhana. Dokumentasikan proses dan hasil peluncuran.',
      task_type: 'group', target_archetype: 'CREATOR',
      vark_adaptations: {V:"Buat video dokumentasi",A:"Narasi proses",R:"Tulis jurnal proyek",K:"Bangun prototipe"},
      due_date: '2026-05-01T23:59:00+07:00', xp_reward: 60, knowledge_field: 'ALAM' },
    { id: 'e0000002-0000-4000-a000-000000000005', teacher_id: t(1), class_id: CLASS['XI-IPA-1'],
      title: 'Tugas Individu: Integral Dasar',
      description: 'Selesaikan 15 soal integral tak tentu dan integral tentu beserta langkah penyelesaian.',
      task_type: 'individual', target_archetype: 'THINKER',
      vark_adaptations: {V:"Gambar area di bawah kurva",A:"Jelaskan konsep",R:"Tulis solusi lengkap",K:"Gunakan kalkulator grafik"},
      due_date: '2026-03-28T23:59:00+07:00', xp_reward: 35, knowledge_field: 'ALAM' },
    { id: 'e0000002-0000-4000-a000-000000000006', teacher_id: t(3), class_id: CLASS['X-Bahasa-1'],
      title: 'Tugas Individu: Resensi Novel',
      description: 'Baca novel "Laskar Pelangi" dan tulis resensi kritis minimal 500 kata.',
      task_type: 'individual', target_archetype: 'STORYTELLER',
      vark_adaptations: {V:"Buat mind map alur cerita",A:"Rekam review audio",R:"Tulis resensi lengkap",K:"Buat dramatisasi adegan"},
      due_date: '2026-04-25T23:59:00+07:00', xp_reward: 30, knowledge_field: 'HUMANIORA' },
  ]);

  // 5g. Peer group members (groups already exist from before)
  console.log('  5g. Peer group members...');
  await insertRows('peer_group_members', [
    { group_id: 'e0000004-0000-4000-a000-000000000001', student_id: s(1),  role_in_group: 'leader' },
    { group_id: 'e0000004-0000-4000-a000-000000000001', student_id: s(2),  role_in_group: 'creative' },
    { group_id: 'e0000004-0000-4000-a000-000000000001', student_id: s(3),  role_in_group: 'analyst' },
    { group_id: 'e0000004-0000-4000-a000-000000000002', student_id: s(6),  role_in_group: 'leader' },
    { group_id: 'e0000004-0000-4000-a000-000000000002', student_id: s(7),  role_in_group: 'explorer' },
    { group_id: 'e0000004-0000-4000-a000-000000000002', student_id: s(8),  role_in_group: 'creative' },
    { group_id: 'e0000004-0000-4000-a000-000000000003', student_id: s(10), role_in_group: 'leader' },
    { group_id: 'e0000004-0000-4000-a000-000000000003', student_id: s(11), role_in_group: 'presenter' },
    { group_id: 'e0000004-0000-4000-a000-000000000003', student_id: s(12), role_in_group: 'mentor' },
  ]);

  // 5h. Task submissions (8)
  console.log('  5h. Task submissions...');
  await insertRows('task_submissions', [
    { id: 'e0000005-0000-4000-a000-000000000001', task_id: 'e0000002-0000-4000-a000-000000000001', student_id: s(1), group_id: null,
      content: 'Berikut penyelesaian 10 soal deret aritmetika dan geometri saya...',
      score: 92, feedback: 'Sangat baik! Langkah penyelesaian rapi dan logis.', status: 'reviewed',
      submitted_at: '2026-04-14T20:30:00+07:00', reviewed_at: '2026-04-16T10:00:00+07:00' },
    { id: 'e0000005-0000-4000-a000-000000000002', task_id: 'e0000002-0000-4000-a000-000000000001', student_id: s(2), group_id: null,
      content: 'Saya menyelesaikan soal-soal deret dengan visualisasi diagram...',
      score: 85, feedback: 'Kreativitas dalam visualisasi sangat bagus.', status: 'reviewed',
      submitted_at: '2026-04-15T18:00:00+07:00', reviewed_at: '2026-04-16T11:30:00+07:00' },
    { id: 'e0000005-0000-4000-a000-000000000003', task_id: 'e0000002-0000-4000-a000-000000000001', student_id: s(3), group_id: null,
      content: 'Penyelesaian soal deret aritmetika dan geometri...',
      score: null, feedback: null, status: 'submitted',
      submitted_at: '2026-04-15T22:45:00+07:00', reviewed_at: null },
    { id: 'e0000005-0000-4000-a000-000000000004', task_id: 'e0000002-0000-4000-a000-000000000002', student_id: s(1), group_id: 'e0000004-0000-4000-a000-000000000001',
      content: 'Laporan proyek statistika Tim Alpha: Analisis tinggi badan kelas X-IPA-1...',
      score: 88, feedback: 'Analisis data baik. Histogram perlu label axis yang lebih jelas.', status: 'reviewed',
      submitted_at: '2026-04-19T16:00:00+07:00', reviewed_at: '2026-04-21T09:00:00+07:00' },
    { id: 'e0000005-0000-4000-a000-000000000005', task_id: 'e0000002-0000-4000-a000-000000000003', student_id: s(6), group_id: null,
      content: 'Analisis 5 skenario menggunakan hukum Newton...',
      score: 78, feedback: 'Analisis cukup baik, penerapan hukum III Newton perlu diperdalam.', status: 'reviewed',
      submitted_at: '2026-04-09T21:00:00+07:00', reviewed_at: '2026-04-11T08:30:00+07:00' },
    { id: 'e0000005-0000-4000-a000-000000000006', task_id: 'e0000002-0000-4000-a000-000000000003', student_id: s(7), group_id: null,
      content: 'Berikut pengamatan dan analisis saya tentang hukum Newton di kehidupan sehari-hari...',
      score: 95, feedback: 'Excellent! Pengamatan lapangan sangat detail dan analisis tajam.', status: 'reviewed',
      submitted_at: '2026-04-08T19:30:00+07:00', reviewed_at: '2026-04-11T09:00:00+07:00' },
    { id: 'e0000005-0000-4000-a000-000000000007', task_id: 'e0000002-0000-4000-a000-000000000005', student_id: s(10), group_id: null,
      content: 'Penyelesaian 15 soal integral tak tentu dan tentu...',
      score: 90, feedback: 'Pemahaman integral sangat baik. Terus pertahankan!', status: 'reviewed',
      submitted_at: '2026-03-27T20:00:00+07:00', reviewed_at: '2026-03-29T10:00:00+07:00' },
    { id: 'e0000005-0000-4000-a000-000000000008', task_id: 'e0000002-0000-4000-a000-000000000006', student_id: s(14), group_id: null,
      content: 'Resensi Laskar Pelangi: Novel karya Andrea Hirata ini mengisahkan perjuangan 10 anak...',
      score: null, feedback: null, status: 'submitted',
      submitted_at: '2026-04-10T14:00:00+07:00', reviewed_at: null },
  ]);

  // 5i. Daily missions (10)
  console.log('  5i. Daily missions...');
  await insertRows('daily_missions', [
    { id: 'e0000006-0000-4000-a000-000000000001', student_id: s(1),  content_id: 'e0000003-0000-4000-a000-000000000001', date: '2026-04-11', status: 'completed',   xp_earned: 15, completed_at: '2026-04-11T08:30:00+07:00' },
    { id: 'e0000006-0000-4000-a000-000000000002', student_id: s(1),  content_id: 'e0000003-0000-4000-a000-000000000004', date: '2026-04-11', status: 'in_progress', xp_earned: 0,  completed_at: null },
    { id: 'e0000006-0000-4000-a000-000000000003', student_id: s(2),  content_id: 'e0000003-0000-4000-a000-000000000005', date: '2026-04-11', status: 'completed',   xp_earned: 15, completed_at: '2026-04-11T09:15:00+07:00' },
    { id: 'e0000006-0000-4000-a000-000000000004', student_id: s(2),  content_id: 'e0000003-0000-4000-a000-000000000003', date: '2026-04-11', status: 'pending',      xp_earned: 0,  completed_at: null },
    { id: 'e0000006-0000-4000-a000-000000000005', student_id: s(5),  content_id: 'e0000003-0000-4000-a000-000000000008', date: '2026-04-11', status: 'completed',   xp_earned: 15, completed_at: '2026-04-11T07:45:00+07:00' },
    { id: 'e0000006-0000-4000-a000-000000000006', student_id: s(7),  content_id: 'e0000003-0000-4000-a000-000000000001', date: '2026-04-10', status: 'completed',   xp_earned: 15, completed_at: '2026-04-10T16:20:00+07:00' },
    { id: 'e0000006-0000-4000-a000-000000000007', student_id: s(7),  content_id: 'e0000003-0000-4000-a000-000000000009', date: '2026-04-11', status: 'in_progress', xp_earned: 0,  completed_at: null },
    { id: 'e0000006-0000-4000-a000-000000000008', student_id: s(10), content_id: 'e0000003-0000-4000-a000-000000000006', date: '2026-04-11', status: 'completed',   xp_earned: 20, completed_at: '2026-04-11T10:00:00+07:00' },
    { id: 'e0000006-0000-4000-a000-000000000009', student_id: s(12), content_id: 'e0000003-0000-4000-a000-00000000000a', date: '2026-04-11', status: 'pending',      xp_earned: 0,  completed_at: null },
    { id: 'e0000006-0000-4000-a000-00000000000a', student_id: s(14), content_id: 'e0000003-0000-4000-a000-000000000005', date: '2026-04-10', status: 'completed',   xp_earned: 15, completed_at: '2026-04-10T19:30:00+07:00' },
  ]);

  // 5j. High fives (5)
  console.log('  5j. High fives...');
  await insertRows('high_fives', [
    { id: 'e0000007-0000-4000-a000-000000000001', from_user_id: t(1), to_student_id: s(1), message: 'Kerja bagus di tugas deret! Langkah penyelesaianmu sangat rapi.' },
    { id: 'e0000007-0000-4000-a000-000000000002', from_user_id: t(2), to_student_id: s(7), message: 'Analisis hukum Newton-mu luar biasa! Terus pertahankan.' },
    { id: 'e0000007-0000-4000-a000-000000000003', from_user_id: p(1), to_student_id: s(1), message: 'Papa bangga dengan streak belajarmu! Semangat terus ya, Ahmad.' },
    { id: 'e0000007-0000-4000-a000-000000000004', from_user_id: p(2), to_student_id: s(2), message: 'Mama senang lihat kamu terus belajar. Keep it up, Putri!' },
    { id: 'e0000007-0000-4000-a000-000000000005', from_user_id: t(1), to_student_id: s(5), message: 'Dimas, kamu menunjukkan kepemimpinan yang hebat di proyek kelompok!' },
  ]);

  // 5k. Student badges (8)
  console.log('  5k. Student badges...');
  await insertRows('student_badges', [
    { id: 'e0000008-0000-4000-a000-000000000001', student_id: s(1),  badge_id: 'b0000001-0000-4000-a000-000000000001', earned_at: '2026-03-15T10:00:00+07:00' },
    { id: 'e0000008-0000-4000-a000-000000000002', student_id: s(1),  badge_id: 'b0000001-0000-4000-a000-000000000005', earned_at: '2026-03-20T08:00:00+07:00' },
    { id: 'e0000008-0000-4000-a000-000000000003', student_id: s(2),  badge_id: 'b0000001-0000-4000-a000-000000000004', earned_at: '2026-03-10T14:00:00+07:00' },
    { id: 'e0000008-0000-4000-a000-000000000004', student_id: s(2),  badge_id: 'b0000001-0000-4000-a000-000000000006', earned_at: '2026-03-25T08:00:00+07:00' },
    { id: 'e0000008-0000-4000-a000-000000000005', student_id: s(5),  badge_id: 'b0000001-0000-4000-a000-000000000007', earned_at: '2026-04-01T08:00:00+07:00' },
    { id: 'e0000008-0000-4000-a000-000000000006', student_id: s(5),  badge_id: 'b0000001-0000-4000-a000-000000000009', earned_at: '2026-03-28T16:00:00+07:00' },
    { id: 'e0000008-0000-4000-a000-000000000007', student_id: s(7),  badge_id: 'b0000001-0000-4000-a000-000000000005', earned_at: '2026-03-18T08:00:00+07:00' },
    { id: 'e0000008-0000-4000-a000-000000000008', student_id: s(10), badge_id: 'b0000001-0000-4000-a000-000000000003', earned_at: '2026-04-05T12:00:00+07:00' },
  ]);

  // 5l. XP transactions (15)
  console.log('  5l. XP transactions...');
  await insertRows('xp_transactions', [
    { id: 'e0000009-0000-4000-a000-000000000001', student_id: s(1),   amount: 15,  source: 'daily_mission', source_id: 'e0000006-0000-4000-a000-000000000001' },
    { id: 'e0000009-0000-4000-a000-000000000002', student_id: s(1),   amount: 30,  source: 'task',          source_id: 'e0000005-0000-4000-a000-000000000001' },
    { id: 'e0000009-0000-4000-a000-000000000003', student_id: s(1),   amount: 50,  source: 'badge',         source_id: 'b0000001-0000-4000-a000-000000000001' },
    { id: 'e0000009-0000-4000-a000-000000000004', student_id: s(2),   amount: 15,  source: 'daily_mission', source_id: 'e0000006-0000-4000-a000-000000000003' },
    { id: 'e0000009-0000-4000-a000-000000000005', student_id: s(2),   amount: 30,  source: 'task',          source_id: 'e0000005-0000-4000-a000-000000000002' },
    { id: 'e0000009-0000-4000-a000-000000000006', student_id: s(2),   amount: 50,  source: 'badge',         source_id: 'b0000001-0000-4000-a000-000000000004' },
    { id: 'e0000009-0000-4000-a000-000000000007', student_id: s(5),   amount: 15,  source: 'daily_mission', source_id: 'e0000006-0000-4000-a000-000000000005' },
    { id: 'e0000009-0000-4000-a000-000000000008', student_id: s(5),   amount: 100, source: 'badge',         source_id: 'b0000001-0000-4000-a000-000000000007' },
    { id: 'e0000009-0000-4000-a000-000000000009', student_id: s(5),   amount: 50,  source: 'badge',         source_id: 'b0000001-0000-4000-a000-000000000009' },
    { id: 'e0000009-0000-4000-a000-00000000000a', student_id: s(7),   amount: 15,  source: 'daily_mission', source_id: 'e0000006-0000-4000-a000-000000000006' },
    { id: 'e0000009-0000-4000-a000-00000000000b', student_id: s(7),   amount: 25,  source: 'task',          source_id: 'e0000005-0000-4000-a000-000000000006' },
    { id: 'e0000009-0000-4000-a000-00000000000c', student_id: s(7),   amount: 25,  source: 'badge',         source_id: 'b0000001-0000-4000-a000-000000000005' },
    { id: 'e0000009-0000-4000-a000-00000000000d', student_id: s(10),  amount: 20,  source: 'daily_mission', source_id: 'e0000006-0000-4000-a000-000000000008' },
    { id: 'e0000009-0000-4000-a000-00000000000e', student_id: s(10),  amount: 35,  source: 'task',          source_id: 'e0000005-0000-4000-a000-000000000007' },
    { id: 'e0000009-0000-4000-a000-00000000000f', student_id: s(10),  amount: 100, source: 'badge',         source_id: 'b0000001-0000-4000-a000-000000000003' },
  ]);

  // 5m. Assessment sessions (5) + results (5)
  console.log('  5m. Assessment sessions + results...');
  await insertRows('assessment_sessions', [
    { id: 'e000000a-0000-4000-a000-000000000001', student_id: s(1),  type: 'cognitive', status: 'completed', started_at: '2026-03-10T09:00:00+07:00', completed_at: '2026-03-10T10:30:00+07:00', current_module: 7 },
    { id: 'e000000a-0000-4000-a000-000000000002', student_id: s(1),  type: 'vark',      status: 'completed', started_at: '2026-03-11T09:00:00+07:00', completed_at: '2026-03-11T09:45:00+07:00', current_module: 1 },
    { id: 'e000000a-0000-4000-a000-000000000003', student_id: s(2),  type: 'vark',      status: 'completed', started_at: '2026-03-08T10:00:00+07:00', completed_at: '2026-03-08T10:40:00+07:00', current_module: 1 },
    { id: 'e000000a-0000-4000-a000-000000000004', student_id: s(5),  type: 'cognitive', status: 'completed', started_at: '2026-03-12T08:00:00+07:00', completed_at: '2026-03-12T09:45:00+07:00', current_module: 7 },
    { id: 'e000000a-0000-4000-a000-000000000005', student_id: s(10), type: 'cognitive', status: 'completed', started_at: '2026-03-20T09:00:00+07:00', completed_at: '2026-03-20T10:15:00+07:00', current_module: 7 },
  ]);

  await insertRows('assessment_results', [
    { id: 'e000000b-0000-4000-a000-000000000001', student_id: s(1),  session_id: 'e000000a-0000-4000-a000-000000000001', type: 'cognitive',
      results: {analytical:85,creative:45,linguistic:60,kinesthetic:50,social:55,observation:70,intuition:65,total_score:430},
      archetype_id: ARCH.THINKER },
    { id: 'e000000b-0000-4000-a000-000000000002', student_id: s(1),  session_id: 'e000000a-0000-4000-a000-000000000002', type: 'vark',
      results: {V:8,A:4,R:6,K:2,dominant:"V",description:"Visual learner"},
      archetype_id: null },
    { id: 'e000000b-0000-4000-a000-000000000003', student_id: s(2),  session_id: 'e000000a-0000-4000-a000-000000000003', type: 'vark',
      results: {V:10,A:3,R:4,K:3,dominant:"V",description:"Strong visual learner"},
      archetype_id: null },
    { id: 'e000000b-0000-4000-a000-000000000004', student_id: s(5),  session_id: 'e000000a-0000-4000-a000-000000000004', type: 'cognitive',
      results: {analytical:75,creative:50,linguistic:65,kinesthetic:40,social:80,observation:60,intuition:70,total_score:440},
      archetype_id: ARCH.STRATEGIST },
    { id: 'e000000b-0000-4000-a000-000000000005', student_id: s(10), session_id: 'e000000a-0000-4000-a000-000000000005', type: 'cognitive',
      results: {analytical:80,creative:35,linguistic:65,kinesthetic:40,social:85,observation:70,intuition:60,total_score:435},
      archetype_id: ARCH.GUARDIAN },
  ]);

  // 5n. Notifications (7 — #8 references admin user, already exists)
  console.log('  5n. Notifications...');
  await insertRows('notifications', [
    { id: 'e000000c-0000-4000-a000-000000000001', user_id: s(1), type: 'badge_earned',     title: 'Badge Baru!', body: 'Kamu mendapatkan badge "Deep Diver"!',
      data: {badge_id:"b0000001-0000-4000-a000-000000000001"}, read: true },
    { id: 'e000000c-0000-4000-a000-000000000002', user_id: s(1), type: 'task_reviewed',     title: 'Tugas Dinilai', body: 'Tugas "Deret Aritmetika" dinilai oleh Ibu Sari. Skor: 92',
      data: {task_id:"e0000002-0000-4000-a000-000000000001",score:92}, read: true },
    { id: 'e000000c-0000-4000-a000-000000000003', user_id: s(2), type: 'high_five',         title: 'High Five!', body: 'Mama memberikan high five: "Keep it up, Putri!"',
      data: {from_user_id: p(2)}, read: false },
    { id: 'e000000c-0000-4000-a000-000000000004', user_id: s(5), type: 'streak_milestone',  title: 'Streak 14 Hari!', body: 'Kamu sudah belajar 14 hari berturut-turut!',
      data: {streak:14}, read: true },
    { id: 'e000000c-0000-4000-a000-000000000005', user_id: t(1), type: 'task_submitted',    title: 'Tugas Baru Masuk', body: 'Rizky Pratama mengumpulkan tugas "Deret Aritmetika"',
      data: {task_id:"e0000002-0000-4000-a000-000000000001",student_id: s(3)}, read: false },
    { id: 'e000000c-0000-4000-a000-000000000006', user_id: p(1), type: 'child_progress',    title: 'Laporan Mingguan Ahmad', body: 'Ahmad menyelesaikan 5 misi dan mendapat 2 badge baru.',
      data: {student_id: s(1),missions_completed:5,badges_earned:2}, read: false },
    { id: 'e000000c-0000-4000-a000-000000000007', user_id: s(8), type: 'new_mission',       title: 'Misi Harian Tersedia', body: 'Misi baru untuk hari ini sudah siap. Ayo mulai belajar!',
      data: {}, read: false },
  ]);

  // 5o. Career roadmaps (3)
  console.log('  5o. Career roadmaps...');
  await insertRows('career_roadmaps', [
    { id: 'e000000d-0000-4000-a000-000000000001', student_id: s(1), archetype_id: ARCH.THINKER,
      recommended_fields: ['ALAM','SOSIAL'],
      recommended_majors: [{name:"Matematika",relevance:95},{name:"Fisika",relevance:88},{name:"Filsafat",relevance:72}],
      recommended_professions: [{name:"Research Scientist",relevance:92},{name:"Data Analyst",relevance:88},{name:"University Professor",relevance:80}],
      notes: 'Ahmad menunjukkan kemampuan analitis yang kuat.' },
    { id: 'e000000d-0000-4000-a000-000000000002', student_id: s(5), archetype_id: ARCH.STRATEGIST,
      recommended_fields: ['SOSIAL','HUMANIORA'],
      recommended_majors: [{name:"Manajemen",relevance:90},{name:"Hubungan Internasional",relevance:85},{name:"Ekonomi",relevance:82}],
      recommended_professions: [{name:"Business Strategist",relevance:92},{name:"Management Consultant",relevance:88},{name:"Diplomat",relevance:75}],
      notes: 'Dimas memiliki kombinasi unik kemampuan analitis dan sosial.' },
    { id: 'e000000d-0000-4000-a000-000000000003', student_id: s(10), archetype_id: ARCH.GUARDIAN,
      recommended_fields: ['SOSIAL','ALAM'],
      recommended_majors: [{name:"Hukum",relevance:88},{name:"Akuntansi",relevance:82},{name:"Perpajakan",relevance:78}],
      recommended_professions: [{name:"Lawyer",relevance:90},{name:"Auditor",relevance:85},{name:"Compliance Officer",relevance:80}],
      notes: 'Anisa menunjukkan rasa keadilan yang tinggi.' },
  ]);

  // 5p. Messages (5)
  console.log('  5p. Messages...');
  await insertRows('messages', [
    { id: 'e000000e-0000-4000-a000-000000000001', sender_id: t(1), receiver_id: p(1), student_id: s(1),
      content: 'Selamat siang Pak Hendra, Ahmad menunjukkan peningkatan signifikan di matematika.', read: true },
    { id: 'e000000e-0000-4000-a000-000000000002', sender_id: p(1), receiver_id: t(1), student_id: s(1),
      content: 'Terima kasih Bu Sari atas informasinya. Kami sangat senang mendengar perkembangan Ahmad.', read: true },
    { id: 'e000000e-0000-4000-a000-000000000003', sender_id: t(1), receiver_id: p(2), student_id: s(2),
      content: 'Bu Wati, Putri memiliki bakat kreatif yang luar biasa.', read: false },
    { id: 'e000000e-0000-4000-a000-000000000004', sender_id: t(2), receiver_id: p(5), student_id: s(7),
      content: 'Pak Agus, Bayu sangat aktif di kelas Fisika. Analisis hukum Newton-nya mendapat nilai tertinggi.', read: false },
    { id: 'e000000e-0000-4000-a000-000000000005', sender_id: p(4), receiver_id: t(1), student_id: s(4),
      content: 'Bu Sari, apakah ada program tambahan untuk Nadia? Dia sangat tertarik bidang kesehatan.', read: false },
  ]);

  console.log('  Domain data insertion complete.\n');

  // ── Print UUID Mapping ─────────────────────────────────────────────────
  console.log('=== New UUID Mapping ===');
  console.log('Key'.padEnd(14) + 'Email'.padEnd(32) + 'New UUID');
  console.log('-'.repeat(90));
  for (const user of ALL_USERS) {
    console.log(`${user.key.padEnd(14)}${user.email.padEnd(32)}${newUuids[user.key]}`);
  }
  console.log();

  // ── Step 6: Verify login ───────────────────────────────────────────────
  console.log('Step 6: Verifying login with student1@uniqcall.test / Student@123...');
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student1@uniqcall.test', password: 'Student@123' }),
    });
    const data = await res.json();
    if (data.access_token) {
      console.log('  LOGIN SUCCESS');
      console.log(`  User ID : ${data.user?.id}`);
      console.log(`  Email   : ${data.user?.email}`);
      console.log(`  Token   : ${data.access_token.slice(0, 40)}...`);
    } else {
      console.log(`  LOGIN FAILED: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    console.log(`  LOGIN ERROR: ${e.message}`);
  }

  console.log('\n=== Done! ===');
}

main().catch((err) => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
