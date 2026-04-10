-- =============================================================================
-- Migration: 00003_add_codes
-- Description: Add school_code to schools, class_code to classes,
--              invite_code to parents. Used for onboarding role selection.
-- =============================================================================

-- ─── schools: add school_code ─────────────────────────────────────────────────

ALTER TABLE schools ADD COLUMN IF NOT EXISTS school_code TEXT UNIQUE;

-- Generate codes for existing schools that don't have one
UPDATE schools
SET school_code = UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 8))
WHERE school_code IS NULL;

ALTER TABLE schools ALTER COLUMN school_code SET NOT NULL;

-- Auto-generate school_code on insert
CREATE OR REPLACE FUNCTION generate_school_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.school_code IS NULL OR NEW.school_code = '' THEN
    LOOP
      NEW.school_code := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 8));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM schools WHERE school_code = NEW.school_code);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS schools_generate_code ON schools;
CREATE TRIGGER schools_generate_code
  BEFORE INSERT ON schools
  FOR EACH ROW EXECUTE FUNCTION generate_school_code();

-- ─── classes: add class_code ──────────────────────────────────────────────────

ALTER TABLE classes ADD COLUMN IF NOT EXISTS class_code TEXT UNIQUE;

-- Generate codes for existing classes that don't have one
UPDATE classes
SET class_code = UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 6))
WHERE class_code IS NULL;

ALTER TABLE classes ALTER COLUMN class_code SET NOT NULL;

-- Auto-generate class_code on insert
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.class_code IS NULL OR NEW.class_code = '' THEN
    LOOP
      NEW.class_code := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 6));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM classes WHERE class_code = NEW.class_code);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS classes_generate_code ON classes;
CREATE TRIGGER classes_generate_code
  BEFORE INSERT ON classes
  FOR EACH ROW EXECUTE FUNCTION generate_class_code();

-- ─── parents: add invite_code ─────────────────────────────────────────────────

-- invite_code is a one-time code an admin generates for a parent to register
ALTER TABLE parents ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;
