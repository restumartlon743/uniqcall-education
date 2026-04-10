---
description: "Use when writing SQL migrations, Supabase schemas, or database-related files. Covers naming conventions, RLS policy patterns, and migration best practices."
applyTo: "packages/supabase/**/*.sql"
---

# Supabase SQL Guidelines

- Table names: snake_case, plural (`students`, `assessment_results`)
- Column names: snake_case (`created_at`, `student_id`)
- Primary keys: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- Timestamps: `created_at TIMESTAMPTZ DEFAULT now()`
- Foreign keys: `REFERENCES table_name(id)` with explicit names
- Always `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on new tables
- Always create at least SELECT policies for each role (student, teacher, parent, admin)
- Use `auth.uid()` in RLS policies to get current user
- Indexes on frequently filtered columns (`student_id`, `class_id`, `school_id`)
