import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { levelProgress } from '@uniqcall/shared/utils'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const userId = user!.id

  // Fetch profile + student + archetype in parallel
  const [profileRes, studentRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('students').select('*').eq('id', userId).single(),
  ])

  if (profileRes.error || !profileRes.data) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }
  if (studentRes.error || !studentRes.data) {
    return NextResponse.json({ error: 'Student record not found' }, { status: 404 })
  }

  const student = studentRes.data

  // Fetch archetype, today's missions, recent badges, today's XP in parallel
  const today = new Date().toISOString().split('T')[0]

  const [archetypeRes, missionsRes, badgesRes, xpRes] = await Promise.all([
    student.archetype_id
      ? supabase.from('archetypes').select('*').eq('id', student.archetype_id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('daily_missions')
      .select('*')
      .eq('student_id', userId)
      .eq('date', today)
      .order('status', { ascending: true }),
    supabase
      .from('student_badges')
      .select('*, badges(*)')
      .eq('student_id', userId)
      .order('earned_at', { ascending: false })
      .limit(5),
    supabase
      .from('xp_transactions')
      .select('amount')
      .eq('student_id', userId)
      .gte('created_at', `${today}T00:00:00Z`),
  ])

  const xpToday = (xpRes.data ?? []).reduce((sum, t) => sum + t.amount, 0)
  const progress = levelProgress(student.total_xp)

  return NextResponse.json({
    data: {
      profile: profileRes.data,
      student,
      archetype: archetypeRes.data,
      today_missions: missionsRes.data ?? [],
      recent_badges: badgesRes.data ?? [],
      xp_today: xpToday,
      level_progress: {
        current_level: progress.level,
        current_xp: progress.total_xp,
        xp_for_next_level: progress.xp_for_next,
        title: progress.title,
        percentage: progress.percentage,
      },
    },
  })
}
