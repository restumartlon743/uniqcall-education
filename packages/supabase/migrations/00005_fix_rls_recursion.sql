-- =============================================================================
-- Uniqcall Education Platform — Fix RLS Infinite Recursion
-- Migration: 00005_fix_rls_recursion
-- Description: Replaces inline profiles subqueries in admin/teacher RLS
--              policies with SECURITY DEFINER helper functions to break
--              the infinite recursion on the profiles table.
-- =============================================================================

-- =============================================================================
-- 1. SECURITY DEFINER helper functions (bypass RLS on profiles)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'teacher'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin()  TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher() TO authenticated;

-- =============================================================================
-- 2. Drop old admin policies (created in 00004)
-- =============================================================================

DROP POLICY IF EXISTS "admin_manage_all_schools"   ON schools;
DROP POLICY IF EXISTS "admin_manage_all_classes"    ON classes;
DROP POLICY IF EXISTS "admin_manage_all_teachers"   ON teachers;
DROP POLICY IF EXISTS "admin_manage_all_students"   ON students;
DROP POLICY IF EXISTS "admin_manage_all_parents"    ON parents;
DROP POLICY IF EXISTS "admin_manage_all_profiles"   ON profiles;

-- =============================================================================
-- 3. Drop old teacher class policies (created in 00004)
-- =============================================================================

DROP POLICY IF EXISTS "teachers_insert_own_classes" ON classes;
DROP POLICY IF EXISTS "teachers_update_own_classes" ON classes;
DROP POLICY IF EXISTS "teachers_delete_own_classes" ON classes;

-- =============================================================================
-- 4. Recreate admin policies using public.is_admin()
-- =============================================================================

CREATE POLICY "admin_manage_all_schools" ON schools
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_manage_all_classes" ON classes
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_manage_all_teachers" ON teachers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_manage_all_students" ON students
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_manage_all_parents" ON parents
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_manage_all_profiles" ON profiles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- 5. Recreate teacher class policies using public.is_teacher()
-- =============================================================================

CREATE POLICY "teachers_insert_own_classes" ON classes
  FOR INSERT
  WITH CHECK (public.is_teacher() AND teacher_id = auth.uid());

CREATE POLICY "teachers_update_own_classes" ON classes
  FOR UPDATE
  USING (public.is_teacher() AND teacher_id = auth.uid());

CREATE POLICY "teachers_delete_own_classes" ON classes
  FOR DELETE
  USING (public.is_teacher() AND teacher_id = auth.uid());
