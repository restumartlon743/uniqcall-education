-- =============================================================================
-- Uniqcall Education Platform — Fix RLS for Admin & Teacher CRUD
-- Migration: 00004_fix_rls_crud
-- Description: Broadens admin RLS policies for full CRUD, adds teacher class
--              management policies, and makes schools readable by all
--              authenticated users.
-- =============================================================================

-- =============================================================================
-- 1. SCHOOLS — Make readable by all authenticated, admin manages ALL schools
-- =============================================================================

-- Drop restrictive policies
DROP POLICY IF EXISTS "authenticated_read_own_school" ON schools;
DROP POLICY IF EXISTS "admin_manage_own_school" ON schools;

-- All authenticated users can read all schools
CREATE POLICY "authenticated_read_schools" ON schools
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can manage (INSERT/UPDATE/DELETE) any school
CREATE POLICY "admin_manage_all_schools" ON schools
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- 2. CLASSES — Admin manages ALL classes, teachers can INSERT/UPDATE/DELETE own
-- =============================================================================

-- Drop restrictive admin policy
DROP POLICY IF EXISTS "admin_manage_school_classes" ON classes;

-- Admin can manage any class
CREATE POLICY "admin_manage_all_classes" ON classes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Teachers can insert classes assigned to themselves
CREATE POLICY "teachers_insert_own_classes" ON classes
  FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

-- Teachers can update their own classes
CREATE POLICY "teachers_update_own_classes" ON classes
  FOR UPDATE
  USING (teacher_id = auth.uid());

-- Teachers can delete their own classes
CREATE POLICY "teachers_delete_own_classes" ON classes
  FOR DELETE
  USING (teacher_id = auth.uid());

-- =============================================================================
-- 3. TEACHERS — Admin manages ALL teachers
-- =============================================================================

-- Drop restrictive admin policy (SELECT only)
DROP POLICY IF EXISTS "admin_read_school_teachers" ON teachers;

-- Admin can manage any teacher record
CREATE POLICY "admin_manage_all_teachers" ON teachers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- 4. STUDENTS — Admin manages ALL students
-- =============================================================================

CREATE POLICY "admin_manage_all_students" ON students
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- 5. PARENTS — Admin manages ALL parents
-- =============================================================================

CREATE POLICY "admin_manage_all_parents" ON parents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- 6. PROFILES — Admin manages ALL profiles
-- =============================================================================

-- Drop restrictive school-scoped admin policy
DROP POLICY IF EXISTS "admin_read_school_profiles" ON profiles;

-- Admin can manage any profile
CREATE POLICY "admin_manage_all_profiles" ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS admin_p
      WHERE admin_p.id = auth.uid()
      AND admin_p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles AS admin_p
      WHERE admin_p.id = auth.uid()
      AND admin_p.role = 'admin'
    )
  );
