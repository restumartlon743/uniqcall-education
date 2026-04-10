import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireRole(supabase, 'teacher')
  if (authError) return authError

  const { id: studentId } = await params

  // Fetch profile, student, archetype
  const [profileRes, studentRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', studentId).single(),
    supabase.from('students').select('*').eq('id', studentId).single(),
  ])

  if (profileRes.error || !profileRes.data) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  }
  if (studentRes.error || !studentRes.data) {
    return NextResponse.json({ error: 'Student record not found' }, { status: 404 })
  }

  const student = studentRes.data

  // Fetch archetype, recent badges, recent missions, XP history in parallel
  const [archetypeRes, badgesRes, missionsRes, xpRes, streakRes] = await Promise.all([
    student.archetype_id
      ? supabase.from('archetypes').select('*').eq('id', student.archetype_id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('student_badges')
      .select('*, badges(*)')
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false })
      .limit(10),
    supabase
      .from('daily_missions')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .limit(14),
    supabase
      .from('xp_transactions')
      .select('amount, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('daily_missions')
      .select('date, status')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .limit(30),
  ])

  // Build XP history (group by date)
  const xpHistory: Array<{ date: string; amount: number }> = []
  const xpByDate = new Map<string, number>()
  for (const tx of xpRes.data ?? []) {
    const date = tx.created_at.split('T')[0]
    xpByDate.set(date, (xpByDate.get(date) ?? 0) + tx.amount)
  }
  for (const [date, amount] of xpByDate) {
    xpHistory.push({ date, amount })
  }

  // Build streak history
  const streakHistory = (streakRes.data ?? []).map((m) => ({
    date: m.date,
    active: m.status === 'completed',
  }))

  // Suggested interventions based on student data
  const interventions: string[] = []
  if (student.current_streak === 0) {
    interventions.push('Student has lost their streak — consider a motivational check-in')
  }
  if (student.mastery_level < 3) {
    interventions.push('Mastery level is low — recommend additional practice activities')
  }
  if (student.cognitive_params) {
    const params = student.cognitive_params as Record<string, number>
    const low = Object.entries(params).filter(([, v]) => v < 30)
    for (const [param] of low) {
      interventions.push(`Low ${param} score — consider targeted ${param} exercises`)
    }
  }

  return NextResponse.json({
    data: {
      profile: profileRes.data,
      student,
      archetype: archetypeRes.data,
      cognitive_params: student.cognitive_params,
      vark_profile: student.vark_profile,
      recent_badges: badgesRes.data ?? [],
      recent_missions: missionsRes.data ?? [],
      xp_history: xpHistory,
      streak_history: streakHistory,
      suggested_interventions: interventions,
    },
  })
}
