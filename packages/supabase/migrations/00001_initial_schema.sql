-- =============================================================================
-- Uniqcall Education Platform — Initial Schema
-- Migration: 00001_initial_schema
-- Description: Complete database schema per PRD Section 12.1
-- =============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABLES (in dependency order)
-- =============================================================================

-- ─── 1. schools ──────────────────────────────────────────────────────────────

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. archetypes (seed data) ───────────────────────────────────────────────

CREATE TABLE archetypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL,
  cluster TEXT NOT NULL,
  dominant_params JSONB NOT NULL,
  description TEXT,
  behavior_traits TEXT[],
  recommended_majors TEXT[],
  recommended_professions TEXT[],
  knowledge_field TEXT,
  avatar_config JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. profiles (references auth.users) ─────────────────────────────────────

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. classes (references schools) — teacher_id FK added later ─────────────

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL,
  grade INTEGER,
  academic_year TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 5. teachers (references profiles) ───────────────────────────────────────

CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT,
  employee_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 6. students (references profiles, classes, archetypes) ──────────────────

CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  archetype_id UUID REFERENCES archetypes(id),
  vark_profile JSONB,
  cognitive_params JSONB,
  mastery_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 7. parents (references profiles) ────────────────────────────────────────

CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 8. parent_student (references parents, students) ────────────────────────

CREATE TABLE parent_student (
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (parent_id, student_id)
);

-- ─── 9. assessment_questions (seed data) ─────────────────────────────────────

CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('cognitive', 'vark')),
  module INTEGER,
  parameter TEXT,
  question_text TEXT NOT NULL,
  question_media_url TEXT,
  options JSONB NOT NULL,
  correct_answer JSONB,
  difficulty INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 10. assessment_sessions (references students) ───────────────────────────

CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cognitive', 'vark')),
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'expired')) DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  current_module INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 11. assessment_responses (references sessions, questions) ───────────────

CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES assessment_questions(id),
  answer JSONB NOT NULL,
  score NUMERIC,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 12. assessment_results (references students, sessions, archetypes) ──────

CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cognitive', 'vark')),
  results JSONB NOT NULL,
  archetype_id UUID REFERENCES archetypes(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 13. learning_content ────────────────────────────────────────────────────

CREATE TABLE learning_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'audio', 'text', 'practice')),
  vark_tag TEXT CHECK (vark_tag IN ('V', 'A', 'R', 'K')),
  content_url TEXT,
  content_body TEXT,
  knowledge_field TEXT,
  difficulty INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 14. daily_missions (references students, learning_content) ──────────────

CREATE TABLE daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content_id UUID REFERENCES learning_content(id),
  date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 15. tasks (references teachers, classes) ────────────────────────────────

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('individual', 'group')) DEFAULT 'individual',
  target_archetype TEXT,
  vark_adaptations JSONB,
  due_date TIMESTAMPTZ,
  xp_reward INTEGER DEFAULT 20,
  knowledge_field TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 16. peer_groups (references classes) ────────────────────────────────────

CREATE TABLE peer_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id),
  name TEXT NOT NULL,
  synergy_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 17. peer_group_members (references peer_groups, students) ───────────────

CREATE TABLE peer_group_members (
  group_id UUID NOT NULL REFERENCES peer_groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  role_in_group TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (group_id, student_id)
);

-- ─── 18. task_submissions (references tasks, students, peer_groups) ──────────

CREATE TABLE task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  group_id UUID REFERENCES peer_groups(id),
  content TEXT,
  attachment_urls TEXT[],
  score NUMERIC,
  feedback TEXT,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'reviewed', 'revision_needed')) DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 19. high_fives (references profiles, students) ─────────────────────────

CREATE TABLE high_fives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 20. group_messages (references peer_groups, profiles) ───────────────────

CREATE TABLE group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES peer_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 21. badges (seed data) ─────────────────────────────────────────────────

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('cognitive', 'streak', 'project', 'peer', 'career')),
  xp_reward INTEGER DEFAULT 50,
  trigger_condition JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 22. student_badges (references students, badges) ────────────────────────

CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, badge_id)
);

-- ─── 23. xp_transactions (references students) ──────────────────────────────

CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 24. career_quest_nodes ──────────────────────────────────────────────────

CREATE TABLE career_quest_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_field TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  unlock_level INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 25. student_quest_progress (references students, career_quest_nodes) ────

CREATE TABLE student_quest_progress (
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES career_quest_nodes(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')) DEFAULT 'locked',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (student_id, node_id)
);

-- ─── 26. majors ──────────────────────────────────────────────────────────────

CREATE TABLE majors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  knowledge_field TEXT NOT NULL,
  universities TEXT[],
  career_prospects TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 27. archetype_majors (references archetypes, majors) ────────────────────

CREATE TABLE archetype_majors (
  archetype_id UUID NOT NULL REFERENCES archetypes(id) ON DELETE CASCADE,
  major_id UUID NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  relevance_score NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (archetype_id, major_id)
);

-- ─── 28. career_roadmaps (references students, archetypes) ──────────────────

CREATE TABLE career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  archetype_id UUID REFERENCES archetypes(id),
  recommended_fields TEXT[],
  recommended_majors JSONB,
  recommended_professions JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 29. notifications (references profiles) ─────────────────────────────────

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 30. messages (references profiles, students) ────────────────────────────

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- DEFERRED FOREIGN KEY: classes.teacher_id → teachers(id)
-- =============================================================================

ALTER TABLE classes ADD COLUMN teacher_id UUID REFERENCES teachers(id);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- profiles
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- students
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_archetype_id ON students(archetype_id);

-- assessment_sessions
CREATE INDEX idx_assessment_sessions_student_id ON assessment_sessions(student_id);

-- assessment_responses
CREATE INDEX idx_assessment_responses_session_id ON assessment_responses(session_id);

-- daily_missions
CREATE INDEX idx_daily_missions_student_date ON daily_missions(student_id, date);

-- tasks
CREATE INDEX idx_tasks_class_id ON tasks(class_id);
CREATE INDEX idx_tasks_teacher_id ON tasks(teacher_id);

-- task_submissions
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_task_submissions_student_id ON task_submissions(student_id);

-- peer_group_members
CREATE INDEX idx_peer_group_members_student_id ON peer_group_members(student_id);

-- student_badges
CREATE INDEX idx_student_badges_student_id ON student_badges(student_id);

-- xp_transactions
CREATE INDEX idx_xp_transactions_student_id ON xp_transactions(student_id);

-- notifications
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- messages
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- ─── Enable RLS on ALL tables ────────────────────────────────────────────────

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE high_fives ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_quest_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetype_majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- ─── schools ─────────────────────────────────────────────────────────────────

CREATE POLICY "authenticated_read_own_school" ON schools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.school_id = schools.id
    )
  );

CREATE POLICY "admin_manage_own_school" ON schools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.school_id = schools.id
    )
  );

-- ─── archetypes (public seed data — everyone can read) ───────────────────────

CREATE POLICY "anyone_read_archetypes" ON archetypes
  FOR SELECT USING (true);

-- ─── profiles ────────────────────────────────────────────────────────────────

CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_read_school_profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles AS admin_p
      WHERE admin_p.id = auth.uid()
      AND admin_p.role = 'admin'
      AND admin_p.school_id = profiles.school_id
    )
  );

CREATE POLICY "teachers_read_class_student_profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = profiles.id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── classes ─────────────────────────────────────────────────────────────────

CREATE POLICY "teachers_read_own_classes" ON classes
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "students_read_own_class" ON classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.class_id = classes.id
      AND s.id = auth.uid()
    )
  );

CREATE POLICY "admin_manage_school_classes" ON classes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
      AND p.school_id = classes.school_id
    )
  );

-- ─── teachers ────────────────────────────────────────────────────────────────

CREATE POLICY "teachers_read_own" ON teachers
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "teachers_update_own" ON teachers
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "admin_read_school_teachers" ON teachers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles tp
      JOIN profiles admin_p ON admin_p.id = auth.uid()
      WHERE tp.id = teachers.id
      AND admin_p.role = 'admin'
      AND tp.school_id = admin_p.school_id
    )
  );

-- ─── students ────────────────────────────────────────────────────────────────

CREATE POLICY "students_read_own" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "students_update_own" ON students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "teachers_read_class_students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = students.class_id
      AND classes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "parents_read_linked_children" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_student ps
      WHERE ps.student_id = students.id
      AND ps.parent_id = auth.uid()
    )
  );

-- ─── parents ─────────────────────────────────────────────────────────────────

CREATE POLICY "parents_read_own" ON parents
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "parents_update_own" ON parents
  FOR UPDATE USING (id = auth.uid());

-- ─── parent_student ──────────────────────────────────────────────────────────

CREATE POLICY "parents_read_own_links" ON parent_student
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "admin_manage_parent_student" ON parent_student
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- ─── assessment_questions (public — everyone can read) ───────────────────────

CREATE POLICY "anyone_read_assessment_questions" ON assessment_questions
  FOR SELECT USING (true);

-- ─── assessment_sessions ─────────────────────────────────────────────────────

CREATE POLICY "students_own_sessions" ON assessment_sessions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_insert_sessions" ON assessment_sessions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "students_update_own_sessions" ON assessment_sessions
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "teachers_read_class_sessions" ON assessment_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = assessment_sessions.student_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── assessment_responses ────────────────────────────────────────────────────

CREATE POLICY "students_own_responses" ON assessment_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_sessions sess
      WHERE sess.id = assessment_responses.session_id
      AND sess.student_id = auth.uid()
    )
  );

CREATE POLICY "students_insert_responses" ON assessment_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessment_sessions sess
      WHERE sess.id = assessment_responses.session_id
      AND sess.student_id = auth.uid()
    )
  );

CREATE POLICY "teachers_read_class_responses" ON assessment_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_sessions sess
      JOIN students s ON s.id = sess.student_id
      JOIN classes c ON c.id = s.class_id
      WHERE sess.id = assessment_responses.session_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── assessment_results ──────────────────────────────────────────────────────

CREATE POLICY "students_own_results" ON assessment_results
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "teachers_read_class_results" ON assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = assessment_results.student_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── learning_content (public read) ──────────────────────────────────────────

CREATE POLICY "authenticated_read_content" ON learning_content
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── daily_missions ──────────────────────────────────────────────────────────

CREATE POLICY "students_own_missions" ON daily_missions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_update_own_missions" ON daily_missions
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "teachers_read_class_missions" ON daily_missions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = daily_missions.student_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── tasks ───────────────────────────────────────────────────────────────────

CREATE POLICY "teachers_manage_own_tasks" ON tasks
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "students_read_class_tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = auth.uid()
      AND s.class_id = tasks.class_id
    )
  );

-- ─── task_submissions ────────────────────────────────────────────────────────

CREATE POLICY "students_read_own_submissions" ON task_submissions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_insert_submissions" ON task_submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "students_update_own_submissions" ON task_submissions
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "teachers_manage_class_submissions" ON task_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_submissions.task_id
      AND t.teacher_id = auth.uid()
    )
  );

-- ─── peer_groups ─────────────────────────────────────────────────────────────

CREATE POLICY "members_read_own_group" ON peer_groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM peer_group_members pgm
      WHERE pgm.group_id = peer_groups.id
      AND pgm.student_id = auth.uid()
    )
  );

CREATE POLICY "teachers_manage_class_groups" ON peer_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = peer_groups.class_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── peer_group_members ──────────────────────────────────────────────────────

CREATE POLICY "members_read_own_membership" ON peer_group_members
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "members_read_group_peers" ON peer_group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM peer_group_members my_pgm
      WHERE my_pgm.group_id = peer_group_members.group_id
      AND my_pgm.student_id = auth.uid()
    )
  );

CREATE POLICY "teachers_manage_class_members" ON peer_group_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM peer_groups pg
      JOIN classes c ON c.id = pg.class_id
      WHERE pg.id = peer_group_members.group_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── high_fives ──────────────────────────────────────────────────────────────

CREATE POLICY "authenticated_insert_high_fives" ON high_fives
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "students_read_received_high_fives" ON high_fives
  FOR SELECT USING (to_student_id = auth.uid());

CREATE POLICY "senders_read_own_high_fives" ON high_fives
  FOR SELECT USING (from_user_id = auth.uid());

CREATE POLICY "parents_read_children_high_fives" ON high_fives
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_student ps
      WHERE ps.student_id = high_fives.to_student_id
      AND ps.parent_id = auth.uid()
    )
  );

-- ─── group_messages ──────────────────────────────────────────────────────────

CREATE POLICY "group_members_read_messages" ON group_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM peer_group_members pgm
      WHERE pgm.group_id = group_messages.group_id
      AND pgm.student_id = auth.uid()
    )
  );

CREATE POLICY "group_members_insert_messages" ON group_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM peer_group_members pgm
      WHERE pgm.group_id = group_messages.group_id
      AND pgm.student_id = auth.uid()
    )
  );

CREATE POLICY "teachers_read_class_group_messages" ON group_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM peer_groups pg
      JOIN classes c ON c.id = pg.class_id
      WHERE pg.id = group_messages.group_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── badges (public seed data — everyone can read) ──────────────────────────

CREATE POLICY "anyone_read_badges" ON badges
  FOR SELECT USING (true);

-- ─── student_badges ──────────────────────────────────────────────────────────

CREATE POLICY "students_read_own_badges" ON student_badges
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "teachers_read_class_student_badges" ON student_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = student_badges.student_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── xp_transactions ────────────────────────────────────────────────────────

CREATE POLICY "students_read_own_xp" ON xp_transactions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "teachers_read_class_student_xp" ON xp_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = xp_transactions.student_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── career_quest_nodes (public read) ────────────────────────────────────────

CREATE POLICY "authenticated_read_quest_nodes" ON career_quest_nodes
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── student_quest_progress ──────────────────────────────────────────────────

CREATE POLICY "students_read_own_quest_progress" ON student_quest_progress
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_update_own_quest_progress" ON student_quest_progress
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "teachers_read_class_quest_progress" ON student_quest_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = student_quest_progress.student_id
      AND c.teacher_id = auth.uid()
    )
  );

-- ─── majors (public read) ───────────────────────────────────────────────────

CREATE POLICY "authenticated_read_majors" ON majors
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── archetype_majors (public read) ──────────────────────────────────────────

CREATE POLICY "authenticated_read_archetype_majors" ON archetype_majors
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── career_roadmaps ─────────────────────────────────────────────────────────

CREATE POLICY "students_read_own_roadmap" ON career_roadmaps
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "teachers_read_class_roadmaps" ON career_roadmaps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = career_roadmaps.student_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "parents_read_children_roadmaps" ON career_roadmaps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_student ps
      WHERE ps.student_id = career_roadmaps.student_id
      AND ps.parent_id = auth.uid()
    )
  );

-- ─── notifications ───────────────────────────────────────────────────────────

CREATE POLICY "users_read_own_notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ─── messages ────────────────────────────────────────────────────────────────

CREATE POLICY "sender_receiver_read_messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "authenticated_insert_messages" ON messages
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND sender_id = auth.uid()
  );
