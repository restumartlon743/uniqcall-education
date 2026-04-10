import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const { studentId } = await params

  // Fetch student's archetype
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('archetype_id')
    .eq('id', studentId)
    .single()

  if (studentError || !student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  }

  if (!student.archetype_id) {
    return NextResponse.json(
      { error: 'Student has not completed cognitive assessment yet' },
      { status: 404 }
    )
  }

  // Fetch existing roadmap or build one
  const { data: roadmap } = await supabase
    .from('career_roadmaps')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch archetype details
  const { data: archetype } = await supabase
    .from('archetypes')
    .select('*')
    .eq('id', student.archetype_id)
    .single()

  // Fetch recommended majors via archetype_majors junction
  const { data: archetypeMajors } = await supabase
    .from('archetype_majors')
    .select('relevance_score, majors(*)')
    .eq('archetype_id', student.archetype_id)
    .order('relevance_score', { ascending: false })

  const majors = (archetypeMajors ?? []).map((am) => ({
    ...(am.majors as unknown as Record<string, unknown>),
    relevance_score: am.relevance_score,
  }))

  // Fetch quest progress
  const { count: totalNodes } = await supabase
    .from('career_quest_nodes')
    .select('id', { count: 'exact', head: true })

  const { count: completedNodes } = await supabase
    .from('student_quest_progress')
    .select('node_id', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('status', 'completed')

  return NextResponse.json({
    data: {
      roadmap,
      archetype,
      majors,
      quest_progress: completedNodes ?? 0,
      total_quest_nodes: totalNodes ?? 0,
    },
  })
}
