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
  const { data: link, error: linkError } = await supabase
    .from('parent_students')
    .select('student_id')
    .eq('parent_id', profile!.id)
    .eq('student_id', studentId)
    .maybeSingle()

  if (linkError || !link) {
    return NextResponse.json({ error: 'Child not found or not linked' }, { status: 403 })
  }

  // Get student name
  const { data: studentProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', studentId)
    .single()

  // Get week boundaries
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const weekStartStr = weekStart.toISOString()
  const weekEndStr = weekEnd.toISOString()

  // Fetch recent badges, completed missions, XP milestones this week
  const [badgesRes, missionsRes, xpRes] = await Promise.all([
    supabase
      .from('student_badges')
      .select('*, badges(name, description, icon_url)')
      .eq('student_id', studentId)
      .gte('earned_at', weekStartStr)
      .lte('earned_at', weekEndStr)
      .order('earned_at', { ascending: false }),
    supabase
      .from('daily_missions')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'completed')
      .gte('date', weekStart.toISOString().split('T')[0])
      .lte('date', weekEnd.toISOString().split('T')[0]),
    supabase
      .from('xp_transactions')
      .select('amount, source, created_at')
      .eq('student_id', studentId)
      .gte('created_at', weekStartStr)
      .lte('created_at', weekEndStr),
  ])

  const highlights: Array<{
    type: 'badge' | 'streak' | 'mission' | 'xp_milestone'
    title: string
    description: string
    earned_at: string
  }> = []

  // Badge highlights
  for (const sb of badgesRes.data ?? []) {
    const badge = sb.badges as unknown as { name: string; description: string | null }
    highlights.push({
      type: 'badge',
      title: `Earned badge: ${badge?.name}`,
      description: badge?.description ?? '',
      earned_at: sb.earned_at,
    })
  }

  // Mission highlights
  const completedMissions = missionsRes.data ?? []
  if (completedMissions.length > 0) {
    highlights.push({
      type: 'mission',
      title: `Completed ${completedMissions.length} missions this week`,
      description: 'Keep up the great work!',
      earned_at: completedMissions[0]?.completed_at ?? now.toISOString(),
    })
  }

  // XP milestone
  const weeklyXp = (xpRes.data ?? []).reduce((sum, tx) => sum + tx.amount, 0)
  if (weeklyXp >= 100) {
    highlights.push({
      type: 'xp_milestone',
      title: `Earned ${weeklyXp} XP this week!`,
      description: 'An impressive week of learning',
      earned_at: now.toISOString(),
    })
  }

  return NextResponse.json({
    data: {
      student_id: studentId,
      student_name: studentProfile?.full_name ?? '',
      highlights,
      week_start: weekStartStr,
      week_end: weekEndStr,
    },
  })
}
