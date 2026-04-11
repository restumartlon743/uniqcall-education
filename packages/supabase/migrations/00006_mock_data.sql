-- =============================================================================
-- Uniqcall Education Platform — Mock/Seed Data for Testing
-- Migration: 00006_mock_data
-- Description: Comprehensive mock data for all features testing
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. SCHOOLS (2)
-- =============================================================================

INSERT INTO schools (id, name, address, logo_url) VALUES
  ('f0000001-0000-4000-a000-000000000001', 'SMAN 1 Bandung', 'Jl. Ir. H. Juanda No.93, Bandung', NULL),
  ('f0000001-0000-4000-a000-000000000002', 'SMAN 2 Bandung', 'Jl. Cihampelas No.173, Bandung', NULL)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. AUTH USERS (teachers, students, parents)
-- =============================================================================

-- ─── Teachers (3) ────────────────────────────────────────────────────────────

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('f0000002-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000',
   'teacher1@uniqcall.test', crypt('Teacher@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Sari Rahayu"}', 'authenticated', 'authenticated'),
  ('f0000002-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000',
   'teacher2@uniqcall.test', crypt('Teacher@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Denny Kurniawan"}', 'authenticated', 'authenticated'),
  ('f0000002-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000',
   'teacher3@uniqcall.test', crypt('Teacher@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Rina Wijaya"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- ─── Students (15) ───────────────────────────────────────────────────────────

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('f0000003-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000',
   'student1@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ahmad Fauzan"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000',
   'student2@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Putri Amelia Sari"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000',
   'student3@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Rizky Pratama"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000',
   'student4@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Nadia Fitriani"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000',
   'student5@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Dimas Aditya"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000006', '00000000-0000-0000-0000-000000000000',
   'student6@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Siti Aisyah"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000007', '00000000-0000-0000-0000-000000000000',
   'student7@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Bayu Setiawan"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000008', '00000000-0000-0000-0000-000000000000',
   'student8@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Maya Anggraini"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-000000000009', '00000000-0000-0000-0000-000000000000',
   'student9@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Fajar Nugroho"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-00000000000a', '00000000-0000-0000-0000-000000000000',
   'student10@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Anisa Rahma"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-00000000000b', '00000000-0000-0000-0000-000000000000',
   'student11@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Galih Prasetyo"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-00000000000c', '00000000-0000-0000-0000-000000000000',
   'student12@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Dewi Lestari"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-00000000000d', '00000000-0000-0000-0000-000000000000',
   'student13@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Rendi Saputra"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-00000000000e', '00000000-0000-0000-0000-000000000000',
   'student14@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Laila Nur"}', 'authenticated', 'authenticated'),
  ('f0000003-0000-4000-a000-00000000000f', '00000000-0000-0000-0000-000000000000',
   'student15@uniqcall.test', crypt('Student@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Arka Maulana"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- ─── Parents (5) ─────────────────────────────────────────────────────────────

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('f0000004-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000',
   'parent1@uniqcall.test', crypt('Parent@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Hendra Fauzan"}', 'authenticated', 'authenticated'),
  ('f0000004-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000',
   'parent2@uniqcall.test', crypt('Parent@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Lina Amelia"}', 'authenticated', 'authenticated'),
  ('f0000004-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000',
   'parent3@uniqcall.test', crypt('Parent@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Budi Pratama"}', 'authenticated', 'authenticated'),
  ('f0000004-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000',
   'parent4@uniqcall.test', crypt('Parent@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Sri Fitriani"}', 'authenticated', 'authenticated'),
  ('f0000004-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000',
   'parent5@uniqcall.test', crypt('Parent@123', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Agus Setiawan"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2b. AUTH IDENTITIES (required for email/password login)
-- =============================================================================

INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
VALUES
  -- Teachers
  (gen_random_uuid(), 'f0000002-0000-4000-a000-000000000001', 'teacher1@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000002-0000-4000-a000-000000000001', 'email', 'teacher1@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000002-0000-4000-a000-000000000002', 'teacher2@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000002-0000-4000-a000-000000000002', 'email', 'teacher2@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000002-0000-4000-a000-000000000003', 'teacher3@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000002-0000-4000-a000-000000000003', 'email', 'teacher3@uniqcall.test'), now(), now(), now()),
  -- Students
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000001', 'student1@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000001', 'email', 'student1@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000002', 'student2@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000002', 'email', 'student2@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000003', 'student3@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000003', 'email', 'student3@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000004', 'student4@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000004', 'email', 'student4@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000005', 'student5@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000005', 'email', 'student5@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000006', 'student6@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000006', 'email', 'student6@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000007', 'student7@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000007', 'email', 'student7@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000008', 'student8@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000008', 'email', 'student8@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-000000000009', 'student9@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-000000000009', 'email', 'student9@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-00000000000a', 'student10@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-00000000000a', 'email', 'student10@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-00000000000b', 'student11@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-00000000000b', 'email', 'student11@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-00000000000c', 'student12@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-00000000000c', 'email', 'student12@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-00000000000d', 'student13@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-00000000000d', 'email', 'student13@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-00000000000e', 'student14@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-00000000000e', 'email', 'student14@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000003-0000-4000-a000-00000000000f', 'student15@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000003-0000-4000-a000-00000000000f', 'email', 'student15@uniqcall.test'), now(), now(), now()),
  -- Parents
  (gen_random_uuid(), 'f0000004-0000-4000-a000-000000000001', 'parent1@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000004-0000-4000-a000-000000000001', 'email', 'parent1@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000004-0000-4000-a000-000000000002', 'parent2@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000004-0000-4000-a000-000000000002', 'email', 'parent2@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000004-0000-4000-a000-000000000003', 'parent3@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000004-0000-4000-a000-000000000003', 'email', 'parent3@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000004-0000-4000-a000-000000000004', 'parent4@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000004-0000-4000-a000-000000000004', 'email', 'parent4@uniqcall.test'), now(), now(), now()),
  (gen_random_uuid(), 'f0000004-0000-4000-a000-000000000005', 'parent5@uniqcall.test', 'email',
   jsonb_build_object('sub', 'f0000004-0000-4000-a000-000000000005', 'email', 'parent5@uniqcall.test'), now(), now(), now())
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 3. PROFILES
-- =============================================================================

-- Update existing admin profile with school
UPDATE profiles
SET school_id = 'f0000001-0000-4000-a000-000000000001'
WHERE id = 'e33af991-0106-4c10-a177-2bd87e58c0b2';

-- Teacher profiles
INSERT INTO profiles (id, role, full_name, avatar_url, school_id) VALUES
  ('f0000002-0000-4000-a000-000000000001', 'teacher', 'Sari Rahayu', NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000002-0000-4000-a000-000000000002', 'teacher', 'Denny Kurniawan', NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000002-0000-4000-a000-000000000003', 'teacher', 'Rina Wijaya', NULL, 'f0000001-0000-4000-a000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Student profiles
INSERT INTO profiles (id, role, full_name, avatar_url, school_id) VALUES
  ('f0000003-0000-4000-a000-000000000001', 'student', 'Ahmad Fauzan',     NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000002', 'student', 'Putri Amelia Sari', NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000003', 'student', 'Rizky Pratama',    NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000004', 'student', 'Nadia Fitriani',   NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000005', 'student', 'Dimas Aditya',     NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000006', 'student', 'Siti Aisyah',      NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000007', 'student', 'Bayu Setiawan',    NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000008', 'student', 'Maya Anggraini',   NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-000000000009', 'student', 'Fajar Nugroho',    NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-00000000000a', 'student', 'Anisa Rahma',      NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-00000000000b', 'student', 'Galih Prasetyo',   NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000003-0000-4000-a000-00000000000c', 'student', 'Dewi Lestari',     NULL, 'f0000001-0000-4000-a000-000000000002'),
  ('f0000003-0000-4000-a000-00000000000d', 'student', 'Rendi Saputra',    NULL, 'f0000001-0000-4000-a000-000000000002'),
  ('f0000003-0000-4000-a000-00000000000e', 'student', 'Laila Nur',        NULL, 'f0000001-0000-4000-a000-000000000002'),
  ('f0000003-0000-4000-a000-00000000000f', 'student', 'Arka Maulana',     NULL, 'f0000001-0000-4000-a000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Parent profiles
INSERT INTO profiles (id, role, full_name, avatar_url, school_id) VALUES
  ('f0000004-0000-4000-a000-000000000001', 'parent', 'Hendra Fauzan',  NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000004-0000-4000-a000-000000000002', 'parent', 'Lina Amelia',    NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000004-0000-4000-a000-000000000003', 'parent', 'Budi Pratama',   NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000004-0000-4000-a000-000000000004', 'parent', 'Sri Fitriani',   NULL, 'f0000001-0000-4000-a000-000000000001'),
  ('f0000004-0000-4000-a000-000000000005', 'parent', 'Agus Setiawan',  NULL, 'f0000001-0000-4000-a000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 4. TEACHERS
-- =============================================================================

INSERT INTO teachers (id, specialization, employee_id) VALUES
  ('f0000002-0000-4000-a000-000000000001', 'Matematika',       'NIP-198501012010'),
  ('f0000002-0000-4000-a000-000000000002', 'Fisika',           'NIP-198703152011'),
  ('f0000002-0000-4000-a000-000000000003', 'Bahasa Indonesia', 'NIP-199002202012')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 5. CLASSES (4)
-- =============================================================================

INSERT INTO classes (id, school_id, name, grade, academic_year, teacher_id) VALUES
  ('e0000001-0000-4000-a000-000000000001', 'f0000001-0000-4000-a000-000000000001', 'X-IPA-1',      10, '2025/2026', 'f0000002-0000-4000-a000-000000000001'),
  ('e0000001-0000-4000-a000-000000000002', 'f0000001-0000-4000-a000-000000000001', 'X-IPA-2',      10, '2025/2026', 'f0000002-0000-4000-a000-000000000002'),
  ('e0000001-0000-4000-a000-000000000003', 'f0000001-0000-4000-a000-000000000001', 'XI-IPA-1',     11, '2025/2026', 'f0000002-0000-4000-a000-000000000001'),
  ('e0000001-0000-4000-a000-000000000004', 'f0000001-0000-4000-a000-000000000002', 'X-Bahasa-1',   10, '2025/2026', 'f0000002-0000-4000-a000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 6. STUDENTS (15) — varied archetypes, VARK profiles, XP, streaks
-- =============================================================================

INSERT INTO students (id, class_id, archetype_id, vark_profile, cognitive_params, mastery_level, total_xp, current_streak, best_streak, onboarding_completed) VALUES
  -- Class X-IPA-1 (5 students)
  ('f0000003-0000-4000-a000-000000000001', 'e0000001-0000-4000-a000-000000000001',
   'a0000001-0000-4000-a000-000000000001', -- THINKER
   '{"V":8,"A":4,"R":6,"K":2}',
   '{"analytical":22,"creative":8,"linguistic":12,"kinesthetic":10,"social":14,"observation":18,"intuition":16}',
   3, 2450, 7, 14, true),
  ('f0000003-0000-4000-a000-000000000002', 'e0000001-0000-4000-a000-000000000001',
   'a0000001-0000-4000-a000-000000000005', -- CREATOR
   '{"V":10,"A":3,"R":4,"K":3}',
   '{"analytical":10,"creative":25,"linguistic":12,"kinesthetic":14,"social":12,"observation":15,"intuition":12}',
   4, 3800, 12, 20, true),
  ('f0000003-0000-4000-a000-000000000003', 'e0000001-0000-4000-a000-000000000001',
   'a0000001-0000-4000-a000-000000000002', -- ENGINEER
   '{"V":5,"A":5,"R":7,"K":3}',
   '{"analytical":20,"creative":14,"linguistic":8,"kinesthetic":18,"social":10,"observation":16,"intuition":14}',
   2, 1200, 3, 10, true),
  ('f0000003-0000-4000-a000-000000000004', 'e0000001-0000-4000-a000-000000000001',
   'a0000001-0000-4000-a000-000000000009', -- HEALER
   '{"V":4,"A":8,"R":5,"K":3}',
   '{"analytical":12,"creative":8,"linguistic":14,"kinesthetic":10,"social":22,"observation":20,"intuition":14}',
   3, 2100, 5, 12, true),
  ('f0000003-0000-4000-a000-000000000005', 'e0000001-0000-4000-a000-000000000001',
   'a0000001-0000-4000-a000-000000000004', -- STRATEGIST
   '{"V":6,"A":6,"R":4,"K":4}',
   '{"analytical":18,"creative":10,"linguistic":14,"kinesthetic":8,"social":20,"observation":14,"intuition":16}',
   5, 4750, 14, 30, true),

  -- Class X-IPA-2 (4 students)
  ('f0000003-0000-4000-a000-000000000006', 'e0000001-0000-4000-a000-000000000002',
   'a0000001-0000-4000-a000-000000000007', -- STORYTELLER
   '{"V":3,"A":9,"R":6,"K":2}',
   '{"analytical":8,"creative":12,"linguistic":24,"kinesthetic":6,"social":20,"observation":14,"intuition":16}',
   2, 950, 2, 7, true),
  ('f0000003-0000-4000-a000-000000000007', 'e0000001-0000-4000-a000-000000000002',
   'a0000001-0000-4000-a000-00000000000b', -- EXPLORER
   '{"V":5,"A":3,"R":4,"K":8}',
   '{"analytical":14,"creative":12,"linguistic":8,"kinesthetic":18,"social":10,"observation":22,"intuition":16}',
   3, 2800, 8, 15, true),
  ('f0000003-0000-4000-a000-000000000008', 'e0000001-0000-4000-a000-000000000002',
   'a0000001-0000-4000-a000-000000000006', -- SHAPER
   '{"V":9,"A":2,"R":5,"K":4}',
   '{"analytical":16,"creative":22,"linguistic":6,"kinesthetic":16,"social":8,"observation":18,"intuition":14}',
   1, 350, 0, 3, false),
  ('f0000003-0000-4000-a000-000000000009', 'e0000001-0000-4000-a000-000000000002',
   'a0000001-0000-4000-a000-00000000000d', -- VISIONARY
   '{"V":6,"A":5,"R":3,"K":6}',
   '{"analytical":16,"creative":18,"linguistic":8,"kinesthetic":8,"social":12,"observation":16,"intuition":22}',
   2, 1600, 4, 9, true),

  -- Class XI-IPA-1 (3 students)
  ('f0000003-0000-4000-a000-00000000000a', 'e0000001-0000-4000-a000-000000000003',
   'a0000001-0000-4000-a000-000000000003', -- GUARDIAN
   '{"V":5,"A":6,"R":7,"K":2}',
   '{"analytical":20,"creative":6,"linguistic":14,"kinesthetic":8,"social":22,"observation":16,"intuition":14}',
   4, 3200, 10, 22, true),
  ('f0000003-0000-4000-a000-00000000000b', 'e0000001-0000-4000-a000-000000000003',
   'a0000001-0000-4000-a000-000000000008', -- PERFORMER
   '{"V":4,"A":8,"R":3,"K":5}',
   '{"analytical":8,"creative":22,"linguistic":12,"kinesthetic":14,"social":14,"observation":16,"intuition":14}',
   3, 2650, 6, 18, true),
  ('f0000003-0000-4000-a000-00000000000c', 'e0000001-0000-4000-a000-000000000003',
   'a0000001-0000-4000-a000-00000000000c', -- MENTOR
   '{"V":3,"A":7,"R":6,"K":4}',
   '{"analytical":14,"creative":8,"linguistic":18,"kinesthetic":8,"social":24,"observation":16,"intuition":12}',
   4, 3500, 9, 25, true),

  -- Class X-Bahasa-1 (3 students)
  ('f0000003-0000-4000-a000-00000000000d', 'e0000001-0000-4000-a000-000000000004',
   'a0000001-0000-4000-a000-00000000000a', -- DIPLOMAT
   '{"V":4,"A":7,"R":5,"K":4}',
   '{"analytical":12,"creative":8,"linguistic":18,"kinesthetic":8,"social":24,"observation":12,"intuition":18}',
   2, 1100, 1, 5, false),
  ('f0000003-0000-4000-a000-00000000000e', 'e0000001-0000-4000-a000-000000000004',
   'a0000001-0000-4000-a000-000000000007', -- STORYTELLER
   '{"V":3,"A":8,"R":6,"K":3}',
   '{"analytical":6,"creative":14,"linguistic":26,"kinesthetic":6,"social":22,"observation":12,"intuition":14}',
   3, 2000, 5, 11, true),
  ('f0000003-0000-4000-a000-00000000000f', 'e0000001-0000-4000-a000-000000000004',
   'a0000001-0000-4000-a000-000000000002', -- ENGINEER
   '{"V":6,"A":4,"R":3,"K":7}',
   '{"analytical":22,"creative":12,"linguistic":6,"kinesthetic":20,"social":8,"observation":18,"intuition":14}',
   1, 200, 0, 2, false)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 7. PARENTS + parent_student links
-- =============================================================================

INSERT INTO parents (id, phone) VALUES
  ('f0000004-0000-4000-a000-000000000001', '+6281234567001'),
  ('f0000004-0000-4000-a000-000000000002', '+6281234567002'),
  ('f0000004-0000-4000-a000-000000000003', '+6281234567003'),
  ('f0000004-0000-4000-a000-000000000004', '+6281234567004'),
  ('f0000004-0000-4000-a000-000000000005', '+6281234567005')
ON CONFLICT (id) DO NOTHING;

-- Link parents to students
INSERT INTO parent_student (parent_id, student_id) VALUES
  ('f0000004-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000001'), -- Hendra -> Ahmad
  ('f0000004-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000002'), -- Lina -> Putri
  ('f0000004-0000-4000-a000-000000000003', 'f0000003-0000-4000-a000-000000000003'), -- Budi -> Rizky
  ('f0000004-0000-4000-a000-000000000004', 'f0000003-0000-4000-a000-000000000004'), -- Sri -> Nadia
  ('f0000004-0000-4000-a000-000000000004', 'f0000003-0000-4000-a000-000000000006'), -- Sri -> Siti (2 children)
  ('f0000004-0000-4000-a000-000000000005', 'f0000003-0000-4000-a000-000000000007')  -- Agus -> Bayu
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 8. LEARNING CONTENT (10 items)
-- =============================================================================

INSERT INTO learning_content (id, title, description, subject, content_type, vark_tag, content_url, content_body, knowledge_field, difficulty, xp_reward) VALUES
  ('e0000003-0000-4000-a000-000000000001',
   'Pengantar Hukum Newton', 'Video animasi tentang 3 hukum Newton dengan contoh kehidupan sehari-hari',
   'Fisika', 'video', 'V', 'https://example.com/video/newton', NULL, 'ALAM', 1, 15),
  ('e0000003-0000-4000-a000-000000000002',
   'Podcast: Sejarah Matematika', 'Cerita menarik tentang penemuan-penemuan matematika',
   'Matematika', 'audio', 'A', 'https://example.com/audio/math-history', NULL, 'ALAM', 1, 10),
  ('e0000003-0000-4000-a000-000000000003',
   'Rangkuman Struktur Atom', 'Bacaan lengkap tentang model atom dari Dalton hingga mekanika kuantum',
   'Kimia', 'text', 'R', NULL,
   'Atom adalah unit dasar materi yang terdiri dari inti (proton + neutron) dan elektron. Model atom berkembang dari model Dalton (bola pejal), Thomson (roti kismis), Rutherford (inti atom), Bohr (lintasan elektron), hingga model mekanika kuantum (orbital).', 'ALAM', 2, 15),
  ('e0000003-0000-4000-a000-000000000004',
   'Latihan Persamaan Kuadrat', 'Kumpulan soal interaktif persamaan kuadrat dengan pembahasan',
   'Matematika', 'practice', 'K', 'https://example.com/practice/quadratic', NULL, 'ALAM', 2, 20),
  ('e0000003-0000-4000-a000-000000000005',
   'Video: Teknik Menulis Esai Argumentatif', 'Panduan langkah demi langkah menulis esai yang baik',
   'Bahasa Indonesia', 'video', 'V', 'https://example.com/video/essay-writing', NULL, 'HUMANIORA', 2, 15),
  ('e0000003-0000-4000-a000-000000000006',
   'Diskusi Audio: Perubahan Iklim', 'Panel diskusi ahli tentang dampak perubahan iklim di Indonesia',
   'Geografi', 'audio', 'A', 'https://example.com/audio/climate-change', NULL, 'SOSIAL', 3, 20),
  ('e0000003-0000-4000-a000-000000000007',
   'Panduan Eksperimen Elektrolisis', 'Petunjuk praktikum elektrolisis larutan CuSO4',
   'Kimia', 'practice', 'K', NULL,
   'Alat: baterai 9V, kabel, elektroda karbon, gelas kimia, larutan CuSO4. Langkah: 1) Siapkan larutan CuSO4 0.1M. 2) Hubungkan elektroda ke baterai. 3) Amati perubahan pada katoda dan anoda selama 15 menit.', 'ALAM', 3, 25),
  ('e0000003-0000-4000-a000-000000000008',
   'Artikel: Revolusi Industri 4.0', 'Bacaan tentang transformasi digital dan dampaknya pada dunia kerja',
   'Ekonomi', 'text', 'R', NULL,
   'Revolusi Industri 4.0 ditandai dengan integrasi teknologi digital seperti AI, IoT, dan big data ke dalam proses produksi dan kehidupan sehari-hari. Dampaknya meliputi otomasi pekerjaan, munculnya profesi baru, dan kebutuhan reskilling tenaga kerja.', 'SOSIAL', 2, 15),
  ('e0000003-0000-4000-a000-000000000009',
   'Simulasi Gerak Parabola', 'Simulasi interaktif untuk memahami gerak proyektil',
   'Fisika', 'practice', 'K', 'https://example.com/sim/parabola', NULL, 'ALAM', 2, 20),
  ('e0000003-0000-4000-a000-00000000000a',
   'Video: Pengantar Psikologi Remaja', 'Memahami perkembangan psikologis masa remaja',
   'Psikologi', 'video', 'V', 'https://example.com/video/teen-psychology', NULL, 'SOSIAL', 1, 10)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 9. TASKS (6)
-- =============================================================================

INSERT INTO tasks (id, teacher_id, class_id, title, description, task_type, target_archetype, vark_adaptations, due_date, xp_reward, knowledge_field) VALUES
  ('e0000002-0000-4000-a000-000000000001',
   'f0000002-0000-4000-a000-000000000001', 'e0000001-0000-4000-a000-000000000001',
   'Tugas Individu: Deret Aritmetika',
   'Selesaikan 10 soal deret aritmetika dan geometri. Tunjukkan langkah penyelesaian lengkap.',
   'individual', 'THINKER',
   '{"V":"Buat diagram visual deret","A":"Jelaskan pola secara lisan","R":"Tulis rumus dan langkah","K":"Gunakan manipulatif fisik"}',
   '2026-04-15 23:59:00+07', 30, 'ALAM'),
  ('e0000002-0000-4000-a000-000000000002',
   'f0000002-0000-4000-a000-000000000001', 'e0000001-0000-4000-a000-000000000001',
   'Proyek Kelompok: Statistika Kelas',
   'Kumpulkan data tinggi badan kelas, buat tabel distribusi frekuensi, histogram, dan analisis.',
   'group', 'ENGINEER',
   '{"V":"Buat infografis","A":"Presentasikan temuan","R":"Tulis laporan","K":"Ukur dan catat langsung"}',
   '2026-04-20 23:59:00+07', 50, 'ALAM'),
  ('e0000002-0000-4000-a000-000000000003',
   'f0000002-0000-4000-a000-000000000002', 'e0000001-0000-4000-a000-000000000002',
   'Tugas Individu: Hukum Newton',
   'Analisis 5 skenario kehidupan nyata menggunakan hukum Newton I, II, dan III.',
   'individual', 'EXPLORER',
   '{"V":"Gambar diagram gaya","A":"Rekam penjelasan","R":"Tulis analisis","K":"Lakukan eksperimen mini"}',
   '2026-04-10 23:59:00+07', 25, 'ALAM'),
  ('e0000002-0000-4000-a000-000000000004',
   'f0000002-0000-4000-a000-000000000002', 'e0000001-0000-4000-a000-000000000002',
   'Proyek Kelompok: Roket Air',
   'Rancang dan bangun roket air sederhana. Dokumentasikan proses dan hasil peluncuran.',
   'group', 'CREATOR',
   '{"V":"Buat video dokumentasi","A":"Narasi proses","R":"Tulis jurnal proyek","K":"Bangun prototipe"}',
   '2026-05-01 23:59:00+07', 60, 'ALAM'),
  ('e0000002-0000-4000-a000-000000000005',
   'f0000002-0000-4000-a000-000000000001', 'e0000001-0000-4000-a000-000000000003',
   'Tugas Individu: Integral Dasar',
   'Selesaikan 15 soal integral tak tentu dan integral tentu beserta langkah penyelesaian.',
   'individual', 'THINKER',
   '{"V":"Gambar area di bawah kurva","A":"Jelaskan konsep","R":"Tulis solusi lengkap","K":"Gunakan kalkulator grafik"}',
   '2026-03-28 23:59:00+07', 35, 'ALAM'),
  ('e0000002-0000-4000-a000-000000000006',
   'f0000002-0000-4000-a000-000000000003', 'e0000001-0000-4000-a000-000000000004',
   'Tugas Individu: Resensi Novel',
   'Baca novel "Laskar Pelangi" dan tulis resensi kritis minimal 500 kata.',
   'individual', 'STORYTELLER',
   '{"V":"Buat mind map alur cerita","A":"Rekam review audio","R":"Tulis resensi lengkap","K":"Buat dramatisasi adegan"}',
   '2026-04-25 23:59:00+07', 30, 'HUMANIORA')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 10. PEER GROUPS (3)
-- =============================================================================

INSERT INTO peer_groups (id, class_id, name, synergy_score) VALUES
  ('e0000004-0000-4000-a000-000000000001', 'e0000001-0000-4000-a000-000000000001', 'Tim Alpha',     85.5),
  ('e0000004-0000-4000-a000-000000000002', 'e0000001-0000-4000-a000-000000000002', 'Tim Quantum',   72.3),
  ('e0000004-0000-4000-a000-000000000003', 'e0000001-0000-4000-a000-000000000003', 'Tim Inovator',  90.1)
ON CONFLICT (id) DO NOTHING;

-- Peer group members
INSERT INTO peer_group_members (group_id, student_id, role_in_group) VALUES
  -- Tim Alpha (class X-IPA-1)
  ('e0000004-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000001', 'leader'),
  ('e0000004-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000002', 'creative'),
  ('e0000004-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000003', 'analyst'),
  -- Tim Quantum (class X-IPA-2)
  ('e0000004-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000006', 'leader'),
  ('e0000004-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000007', 'explorer'),
  ('e0000004-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000008', 'creative'),
  -- Tim Inovator (class XI-IPA-1)
  ('e0000004-0000-4000-a000-000000000003', 'f0000003-0000-4000-a000-00000000000a', 'leader'),
  ('e0000004-0000-4000-a000-000000000003', 'f0000003-0000-4000-a000-00000000000b', 'presenter'),
  ('e0000004-0000-4000-a000-000000000003', 'f0000003-0000-4000-a000-00000000000c', 'mentor')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 11. TASK SUBMISSIONS (8)
-- =============================================================================

INSERT INTO task_submissions (id, task_id, student_id, group_id, content, score, feedback, status, submitted_at, reviewed_at) VALUES
  -- Task 1 (Deret Aritmetika) submissions
  ('e0000005-0000-4000-a000-000000000001',
   'e0000002-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000001', NULL,
   'Berikut penyelesaian 10 soal deret aritmetika dan geometri saya...',
   92, 'Sangat baik! Langkah penyelesaian rapi dan logis. Perhatikan penulisan notasi sigma.', 'reviewed',
   '2026-04-14 20:30:00+07', '2026-04-16 10:00:00+07'),
  ('e0000005-0000-4000-a000-000000000002',
   'e0000002-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000002', NULL,
   'Saya menyelesaikan soal-soal deret dengan visualisasi diagram...',
   85, 'Kreativitas dalam visualisasi sangat bagus. Ada 2 soal yang perlu diperbaiki.', 'reviewed',
   '2026-04-15 18:00:00+07', '2026-04-16 11:30:00+07'),
  ('e0000005-0000-4000-a000-000000000003',
   'e0000002-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000003', NULL,
   'Penyelesaian soal deret aritmetika dan geometri...',
   NULL, NULL, 'submitted',
   '2026-04-15 22:45:00+07', NULL),

  -- Task 2 (Proyek Statistika) group submission
  ('e0000005-0000-4000-a000-000000000004',
   'e0000002-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000001', 'e0000004-0000-4000-a000-000000000001',
   'Laporan proyek statistika Tim Alpha: Analisis tinggi badan kelas X-IPA-1...',
   88, 'Analisis data baik. Histogram perlu label axis yang lebih jelas.', 'reviewed',
   '2026-04-19 16:00:00+07', '2026-04-21 09:00:00+07'),

  -- Task 3 (Hukum Newton) submissions
  ('e0000005-0000-4000-a000-000000000005',
   'e0000002-0000-4000-a000-000000000003', 'f0000003-0000-4000-a000-000000000006', NULL,
   'Analisis 5 skenario menggunakan hukum Newton...',
   78, 'Analisis cukup baik, tapi penerapan hukum III Newton masih perlu diperdalam.', 'reviewed',
   '2026-04-09 21:00:00+07', '2026-04-11 08:30:00+07'),
  ('e0000005-0000-4000-a000-000000000006',
   'e0000002-0000-4000-a000-000000000003', 'f0000003-0000-4000-a000-000000000007', NULL,
   'Berikut pengamatan dan analisis saya tentang hukum Newton di kehidupan sehari-hari...',
   95, 'Excellent! Pengamatan lapangan yang sangat detail dan analisis yang tajam.', 'reviewed',
   '2026-04-08 19:30:00+07', '2026-04-11 09:00:00+07'),

  -- Task 5 (Integral) - past due
  ('e0000005-0000-4000-a000-000000000007',
   'e0000002-0000-4000-a000-000000000005', 'f0000003-0000-4000-a000-00000000000a', NULL,
   'Penyelesaian 15 soal integral tak tentu dan tentu...',
   90, 'Pemahaman integral sangat baik untuk level XI. Terus pertahankan!', 'reviewed',
   '2026-03-27 20:00:00+07', '2026-03-29 10:00:00+07'),

  -- Task 6 (Resensi Novel) - submitted, not yet reviewed
  ('e0000005-0000-4000-a000-000000000008',
   'e0000002-0000-4000-a000-000000000006', 'f0000003-0000-4000-a000-00000000000e', NULL,
   'Resensi Laskar Pelangi: Novel karya Andrea Hirata ini mengisahkan perjuangan 10 anak...',
   NULL, NULL, 'submitted',
   '2026-04-10 14:00:00+07', NULL)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 12. DAILY MISSIONS (10)
-- =============================================================================

INSERT INTO daily_missions (id, student_id, content_id, date, status, xp_earned, completed_at) VALUES
  ('e0000006-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001', 'e0000003-0000-4000-a000-000000000001',
   '2026-04-11', 'completed', 15, '2026-04-11 08:30:00+07'),
  ('e0000006-0000-4000-a000-000000000002',
   'f0000003-0000-4000-a000-000000000001', 'e0000003-0000-4000-a000-000000000004',
   '2026-04-11', 'in_progress', 0, NULL),
  ('e0000006-0000-4000-a000-000000000003',
   'f0000003-0000-4000-a000-000000000002', 'e0000003-0000-4000-a000-000000000005',
   '2026-04-11', 'completed', 15, '2026-04-11 09:15:00+07'),
  ('e0000006-0000-4000-a000-000000000004',
   'f0000003-0000-4000-a000-000000000002', 'e0000003-0000-4000-a000-000000000003',
   '2026-04-11', 'pending', 0, NULL),
  ('e0000006-0000-4000-a000-000000000005',
   'f0000003-0000-4000-a000-000000000005', 'e0000003-0000-4000-a000-000000000008',
   '2026-04-11', 'completed', 15, '2026-04-11 07:45:00+07'),
  ('e0000006-0000-4000-a000-000000000006',
   'f0000003-0000-4000-a000-000000000007', 'e0000003-0000-4000-a000-000000000001',
   '2026-04-10', 'completed', 15, '2026-04-10 16:20:00+07'),
  ('e0000006-0000-4000-a000-000000000007',
   'f0000003-0000-4000-a000-000000000007', 'e0000003-0000-4000-a000-000000000009',
   '2026-04-11', 'in_progress', 0, NULL),
  ('e0000006-0000-4000-a000-000000000008',
   'f0000003-0000-4000-a000-00000000000a', 'e0000003-0000-4000-a000-000000000006',
   '2026-04-11', 'completed', 20, '2026-04-11 10:00:00+07'),
  ('e0000006-0000-4000-a000-000000000009',
   'f0000003-0000-4000-a000-00000000000c', 'e0000003-0000-4000-a000-00000000000a',
   '2026-04-11', 'pending', 0, NULL),
  ('e0000006-0000-4000-a000-00000000000a',
   'f0000003-0000-4000-a000-00000000000e', 'e0000003-0000-4000-a000-000000000005',
   '2026-04-10', 'completed', 15, '2026-04-10 19:30:00+07')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 13. HIGH FIVES (5)
-- =============================================================================

INSERT INTO high_fives (id, from_user_id, to_student_id, message) VALUES
  ('e0000007-0000-4000-a000-000000000001',
   'f0000002-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000001',
   'Kerja bagus di tugas deret! Langkah penyelesaianmu sangat rapi.'),
  ('e0000007-0000-4000-a000-000000000002',
   'f0000002-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000007',
   'Analisis hukum Newton-mu luar biasa! Terus pertahankan observasi lapanganmu.'),
  ('e0000007-0000-4000-a000-000000000003',
   'f0000004-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000001',
   'Papa bangga dengan streak belajarmu! Semangat terus ya, Ahmad.'),
  ('e0000007-0000-4000-a000-000000000004',
   'f0000004-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000002',
   'Mama senang lihat kamu terus belajar. Keep it up, Putri!'),
  ('e0000007-0000-4000-a000-000000000005',
   'f0000002-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000005',
   'Dimas, kamu menunjukkan kepemimpinan yang hebat di proyek kelompok!')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 14. STUDENT BADGES (8)
-- =============================================================================

INSERT INTO student_badges (id, student_id, badge_id, earned_at) VALUES
  ('e0000008-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001', 'b0000001-0000-4000-a000-000000000001', -- Deep Diver
   '2026-03-15 10:00:00+07'),
  ('e0000008-0000-4000-a000-000000000002',
   'f0000003-0000-4000-a000-000000000001', 'b0000001-0000-4000-a000-000000000005', -- First Flame (3-day streak)
   '2026-03-20 08:00:00+07'),
  ('e0000008-0000-4000-a000-000000000003',
   'f0000003-0000-4000-a000-000000000002', 'b0000001-0000-4000-a000-000000000004', -- VARK Explorer
   '2026-03-10 14:00:00+07'),
  ('e0000008-0000-4000-a000-000000000004',
   'f0000003-0000-4000-a000-000000000002', 'b0000001-0000-4000-a000-000000000006', -- 7-Day Warrior
   '2026-03-25 08:00:00+07'),
  ('e0000008-0000-4000-a000-000000000005',
   'f0000003-0000-4000-a000-000000000005', 'b0000001-0000-4000-a000-000000000007', -- Fortnight Hero (14-day)
   '2026-04-01 08:00:00+07'),
  ('e0000008-0000-4000-a000-000000000006',
   'f0000003-0000-4000-a000-000000000005', 'b0000001-0000-4000-a000-000000000009', -- Builder
   '2026-03-28 16:00:00+07'),
  ('e0000008-0000-4000-a000-000000000007',
   'f0000003-0000-4000-a000-000000000007', 'b0000001-0000-4000-a000-000000000005', -- First Flame
   '2026-03-18 08:00:00+07'),
  ('e0000008-0000-4000-a000-000000000008',
   'f0000003-0000-4000-a000-00000000000a', 'b0000001-0000-4000-a000-000000000003', -- Pattern Seeker
   '2026-04-05 12:00:00+07')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 15. XP TRANSACTIONS (15)
-- =============================================================================

INSERT INTO xp_transactions (id, student_id, amount, source, source_id) VALUES
  -- Ahmad Fauzan
  ('e0000009-0000-4000-a000-000000000001', 'f0000003-0000-4000-a000-000000000001', 15,  'daily_mission', 'e0000006-0000-4000-a000-000000000001'),
  ('e0000009-0000-4000-a000-000000000002', 'f0000003-0000-4000-a000-000000000001', 30,  'task', 'e0000005-0000-4000-a000-000000000001'),
  ('e0000009-0000-4000-a000-000000000003', 'f0000003-0000-4000-a000-000000000001', 50,  'badge', 'b0000001-0000-4000-a000-000000000001'),
  -- Putri Amelia
  ('e0000009-0000-4000-a000-000000000004', 'f0000003-0000-4000-a000-000000000002', 15,  'daily_mission', 'e0000006-0000-4000-a000-000000000003'),
  ('e0000009-0000-4000-a000-000000000005', 'f0000003-0000-4000-a000-000000000002', 30,  'task', 'e0000005-0000-4000-a000-000000000002'),
  ('e0000009-0000-4000-a000-000000000006', 'f0000003-0000-4000-a000-000000000002', 50,  'badge', 'b0000001-0000-4000-a000-000000000004'),
  -- Dimas Aditya
  ('e0000009-0000-4000-a000-000000000007', 'f0000003-0000-4000-a000-000000000005', 15,  'daily_mission', 'e0000006-0000-4000-a000-000000000005'),
  ('e0000009-0000-4000-a000-000000000008', 'f0000003-0000-4000-a000-000000000005', 100, 'badge', 'b0000001-0000-4000-a000-000000000007'),
  ('e0000009-0000-4000-a000-000000000009', 'f0000003-0000-4000-a000-000000000005', 50,  'badge', 'b0000001-0000-4000-a000-000000000009'),
  -- Bayu Setiawan
  ('e0000009-0000-4000-a000-00000000000a', 'f0000003-0000-4000-a000-000000000007', 15,  'daily_mission', 'e0000006-0000-4000-a000-000000000006'),
  ('e0000009-0000-4000-a000-00000000000b', 'f0000003-0000-4000-a000-000000000007', 25,  'task', 'e0000005-0000-4000-a000-000000000006'),
  ('e0000009-0000-4000-a000-00000000000c', 'f0000003-0000-4000-a000-000000000007', 25,  'badge', 'b0000001-0000-4000-a000-000000000005'),
  -- Anisa Rahma
  ('e0000009-0000-4000-a000-00000000000d', 'f0000003-0000-4000-a000-00000000000a', 20,  'daily_mission', 'e0000006-0000-4000-a000-000000000008'),
  ('e0000009-0000-4000-a000-00000000000e', 'f0000003-0000-4000-a000-00000000000a', 35,  'task', 'e0000005-0000-4000-a000-000000000007'),
  ('e0000009-0000-4000-a000-00000000000f', 'f0000003-0000-4000-a000-00000000000a', 100, 'badge', 'b0000001-0000-4000-a000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 16. ASSESSMENT SESSIONS & RESULTS (5)
-- =============================================================================

-- Assessment sessions
INSERT INTO assessment_sessions (id, student_id, type, status, started_at, completed_at, current_module) VALUES
  ('e000000a-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001', 'cognitive', 'completed',
   '2026-03-10 09:00:00+07', '2026-03-10 10:30:00+07', 7),
  ('e000000a-0000-4000-a000-000000000002',
   'f0000003-0000-4000-a000-000000000001', 'vark', 'completed',
   '2026-03-11 09:00:00+07', '2026-03-11 09:45:00+07', 1),
  ('e000000a-0000-4000-a000-000000000003',
   'f0000003-0000-4000-a000-000000000002', 'vark', 'completed',
   '2026-03-08 10:00:00+07', '2026-03-08 10:40:00+07', 1),
  ('e000000a-0000-4000-a000-000000000004',
   'f0000003-0000-4000-a000-000000000005', 'cognitive', 'completed',
   '2026-03-12 08:00:00+07', '2026-03-12 09:45:00+07', 7),
  ('e000000a-0000-4000-a000-000000000005',
   'f0000003-0000-4000-a000-00000000000a', 'cognitive', 'completed',
   '2026-03-20 09:00:00+07', '2026-03-20 10:15:00+07', 7)
ON CONFLICT (id) DO NOTHING;

-- Assessment results
INSERT INTO assessment_results (id, student_id, session_id, type, results, archetype_id) VALUES
  ('e000000b-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001', 'e000000a-0000-4000-a000-000000000001', 'cognitive',
   '{"analytical":85,"creative":45,"linguistic":60,"kinesthetic":50,"social":55,"observation":70,"intuition":65,"total_score":430}',
   'a0000001-0000-4000-a000-000000000001'),
  ('e000000b-0000-4000-a000-000000000002',
   'f0000003-0000-4000-a000-000000000001', 'e000000a-0000-4000-a000-000000000002', 'vark',
   '{"V":8,"A":4,"R":6,"K":2,"dominant":"V","description":"Visual learner — prefers diagrams, charts, and spatial understanding"}',
   NULL),
  ('e000000b-0000-4000-a000-000000000003',
   'f0000003-0000-4000-a000-000000000002', 'e000000a-0000-4000-a000-000000000003', 'vark',
   '{"V":10,"A":3,"R":4,"K":3,"dominant":"V","description":"Strong visual learner — excels with images, videos, and visual representations"}',
   NULL),
  ('e000000b-0000-4000-a000-000000000004',
   'f0000003-0000-4000-a000-000000000005', 'e000000a-0000-4000-a000-000000000004', 'cognitive',
   '{"analytical":75,"creative":50,"linguistic":65,"kinesthetic":40,"social":80,"observation":60,"intuition":70,"total_score":440}',
   'a0000001-0000-4000-a000-000000000004'),
  ('e000000b-0000-4000-a000-000000000005',
   'f0000003-0000-4000-a000-00000000000a', 'e000000a-0000-4000-a000-000000000005', 'cognitive',
   '{"analytical":80,"creative":35,"linguistic":65,"kinesthetic":40,"social":85,"observation":70,"intuition":60,"total_score":435}',
   'a0000001-0000-4000-a000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 17. NOTIFICATIONS (8)
-- =============================================================================

INSERT INTO notifications (id, user_id, type, title, body, data, read) VALUES
  ('e000000c-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001', 'badge_earned', 'Badge Baru! 🏆',
   'Kamu mendapatkan badge "Deep Diver"!',
   '{"badge_id":"b0000001-0000-4000-a000-000000000001"}', true),
  ('e000000c-0000-4000-a000-000000000002',
   'f0000003-0000-4000-a000-000000000001', 'task_reviewed', 'Tugas Dinilai',
   'Tugas "Deret Aritmetika" telah dinilai oleh Ibu Sari. Skor: 92',
   '{"task_id":"e0000002-0000-4000-a000-000000000001","score":92}', true),
  ('e000000c-0000-4000-a000-000000000003',
   'f0000003-0000-4000-a000-000000000002', 'high_five', 'High Five! ✋',
   'Mama Lina memberikan high five: "Keep it up, Putri!"',
   '{"from_user_id":"f0000004-0000-4000-a000-000000000002"}', false),
  ('e000000c-0000-4000-a000-000000000004',
   'f0000003-0000-4000-a000-000000000005', 'streak_milestone', 'Streak 14 Hari! 🔥',
   'Kamu sudah belajar 14 hari berturut-turut! Luar biasa!',
   '{"streak":14}', true),
  ('e000000c-0000-4000-a000-000000000005',
   'f0000002-0000-4000-a000-000000000001', 'task_submitted', 'Tugas Baru Masuk',
   'Rizky Pratama mengumpulkan tugas "Deret Aritmetika"',
   '{"task_id":"e0000002-0000-4000-a000-000000000001","student_id":"f0000003-0000-4000-a000-000000000003"}', false),
  ('e000000c-0000-4000-a000-000000000006',
   'f0000004-0000-4000-a000-000000000001', 'child_progress', 'Laporan Mingguan Ahmad',
   'Ahmad menyelesaikan 5 misi minggu ini dan mendapat 2 badge baru.',
   '{"student_id":"f0000003-0000-4000-a000-000000000001","missions_completed":5,"badges_earned":2}', false),
  ('e000000c-0000-4000-a000-000000000007',
   'f0000003-0000-4000-a000-000000000008', 'new_mission', 'Misi Harian Tersedia',
   'Misi baru untuk hari ini sudah siap. Ayo mulai belajar!',
   '{}', false),
  ('e000000c-0000-4000-a000-000000000008',
   'e33af991-0106-4c10-a177-2bd87e58c0b2', 'system', 'Selamat Datang Admin',
   'Mock data berhasil dimuat. Platform siap untuk testing.',
   '{}', false)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 18. CAREER ROADMAPS (3)
-- =============================================================================

INSERT INTO career_roadmaps (id, student_id, archetype_id, recommended_fields, recommended_majors, recommended_professions, notes) VALUES
  ('e000000d-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001', 'a0000001-0000-4000-a000-000000000001',
   ARRAY['ALAM', 'SOSIAL'],
   '[{"name":"Matematika","relevance":95},{"name":"Fisika","relevance":88},{"name":"Filsafat","relevance":72}]',
   '[{"name":"Research Scientist","relevance":92},{"name":"Data Analyst","relevance":88},{"name":"University Professor","relevance":80}]',
   'Ahmad menunjukkan kemampuan analitis yang kuat. Direkomendasikan untuk mendalami riset dan sains murni.'),
  ('e000000d-0000-4000-a000-000000000002',
   'f0000003-0000-4000-a000-000000000005', 'a0000001-0000-4000-a000-000000000004',
   ARRAY['SOSIAL', 'HUMANIORA'],
   '[{"name":"Manajemen","relevance":90},{"name":"Hubungan Internasional","relevance":85},{"name":"Ekonomi","relevance":82}]',
   '[{"name":"Business Strategist","relevance":92},{"name":"Management Consultant","relevance":88},{"name":"Diplomat","relevance":75}]',
   'Dimas memiliki kombinasi unik antara kemampuan analitis dan sosial. Cocok untuk bidang kepemimpinan dan manajemen.'),
  ('e000000d-0000-4000-a000-000000000003',
   'f0000003-0000-4000-a000-00000000000a', 'a0000001-0000-4000-a000-000000000003',
   ARRAY['SOSIAL', 'ALAM'],
   '[{"name":"Hukum","relevance":88},{"name":"Akuntansi","relevance":82},{"name":"Perpajakan","relevance":78}]',
   '[{"name":"Lawyer","relevance":90},{"name":"Auditor","relevance":85},{"name":"Compliance Officer","relevance":80}]',
   'Anisa menunjukkan rasa keadilan yang tinggi dan kemampuan analitis yang baik. Bidang hukum sangat cocok.')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 19. MESSAGES (5) — between teachers and parents
-- =============================================================================

INSERT INTO messages (id, sender_id, receiver_id, student_id, content, read) VALUES
  ('e000000e-0000-4000-a000-000000000001',
   'f0000002-0000-4000-a000-000000000001', 'f0000004-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001',
   'Selamat siang Pak Hendra, Ahmad menunjukkan peningkatan yang signifikan di matematika. Nilai tugas terakhirnya 92.',
   true),
  ('e000000e-0000-4000-a000-000000000002',
   'f0000004-0000-4000-a000-000000000001', 'f0000002-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000001',
   'Terima kasih Bu Sari atas informasinya. Kami sangat senang mendengar perkembangan Ahmad.',
   true),
  ('e000000e-0000-4000-a000-000000000003',
   'f0000002-0000-4000-a000-000000000001', 'f0000004-0000-4000-a000-000000000002',
   'f0000003-0000-4000-a000-000000000002',
   'Bu Lina, Putri memiliki bakat kreatif yang luar biasa. Saya sarankan untuk mendukung minatnya di bidang seni dan desain.',
   false),
  ('e000000e-0000-4000-a000-000000000004',
   'f0000002-0000-4000-a000-000000000002', 'f0000004-0000-4000-a000-000000000005',
   'f0000003-0000-4000-a000-000000000007',
   'Pak Agus, Bayu sangat aktif di kelas Fisika. Analisis hukum Newton-nya mendapat nilai tertinggi di kelas.',
   false),
  ('e000000e-0000-4000-a000-000000000005',
   'f0000004-0000-4000-a000-000000000004', 'f0000002-0000-4000-a000-000000000001',
   'f0000003-0000-4000-a000-000000000004',
   'Bu Sari, apakah ada program tambahan untuk Nadia? Dia sangat tertarik dengan bidang kesehatan.',
   false)
ON CONFLICT (id) DO NOTHING;

COMMIT;
