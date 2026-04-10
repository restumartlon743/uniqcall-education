import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { profile, error: authError } = await requireRole(supabase, 'parent')
  if (authError) return authError

  const { id: studentId } = await params

  // Verify parent-child relationship
  const { data: link } = await supabase
    .from('parent_students')
    .select('student_id')
    .eq('parent_id', profile!.id)
    .eq('student_id', studentId)
    .maybeSingle()

  if (!link) {
    return NextResponse.json({ error: 'Child not found or not linked' }, { status: 403 })
  }

  // Fetch student with archetype
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single()

  if (studentError || !student) {
    return NextResponse.json({ error: 'Student record not found' }, { status: 404 })
  }

  // Fetch archetype, assessment history, badges in parallel
  const [archetypeRes, assessmentHistoryRes, badgesRes] = await Promise.all([
    student.archetype_id
      ? supabase.from('archetypes').select('*').eq('id', student.archetype_id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('assessment_results')
      .select('type, results, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true }),
    supabase
      .from('student_badges')
      .select('*, badges(*)')
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false }),
  ])

  // Build cognitive params history from assessment results
  const paramHistory = (assessmentHistoryRes.data ?? [])
    .filter((r) => r.type === 'cognitive')
    .map((r) => ({
      date: r.created_at,
      params: r.results,
    }))

  return NextResponse.json({
    data: {
      student_id: studentId,
      current_params: student.cognitive_params,
      vark_profile: student.vark_profile,
      param_history: paramHistory,
      mastery_level: student.mastery_level,
      total_xp: student.total_xp,
      current_streak: student.current_streak,
      best_streak: student.best_streak,
      archetype: archetypeRes.data,
      badges: badgesRes.data ?? [],
    },
  })
}
