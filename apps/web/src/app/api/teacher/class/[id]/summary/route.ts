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

  const { id: classId } = await params

  // Verify teacher owns this class
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('id, name, teacher_id')
    .eq('id', classId)
    .single()

  if (classError || !classData) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  }

  // Fetch students in this class
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, archetype_id, mastery_level, total_xp, current_streak, cognitive_params')
    .eq('class_id', classId)

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 })
  }

  const studentList = students ?? []
  const totalStudents = studentList.length
  const avgMastery = totalStudents > 0
    ? Math.round(studentList.reduce((s, st) => s + st.mastery_level, 0) / totalStudents)
    : 0
  const avgXp = totalStudents > 0
    ? Math.round(studentList.reduce((s, st) => s + st.total_xp, 0) / totalStudents)
    : 0

  // Count assessed students (those with cognitive_params)
  const assessedStudents = studentList.filter((s) => s.cognitive_params !== null).length

  // Archetype distribution
  const archetypeIds = studentList
    .map((s) => s.archetype_id)
    .filter((id): id is string => id !== null)

  let archetypeDistribution: Record<string, number> = {}
  if (archetypeIds.length > 0) {
    const { data: archetypes } = await supabase
      .from('archetypes')
      .select('id, code')
      .in('id', archetypeIds)

    const codeMap = new Map((archetypes ?? []).map((a) => [a.id, a.code]))
    for (const id of archetypeIds) {
      const code = codeMap.get(id) ?? 'UNKNOWN'
      archetypeDistribution[code] = (archetypeDistribution[code] ?? 0) + 1
    }
  }

  // Students needing attention (low streak or low mastery)
  const studentsNeedingAttention = studentList.filter(
    (s) => s.current_streak === 0 || s.mastery_level < 3
  ).length

  // Count active peer groups
  const { count: activeGroups } = await supabase
    .from('peer_groups')
    .select('id', { count: 'exact', head: true })
    .eq('class_id', classId)

  return NextResponse.json({
    data: {
      class_id: classId,
      class_name: classData.name,
      total_students: totalStudents,
      assessed_students: assessedStudents,
      avg_mastery_level: avgMastery,
      avg_xp: avgXp,
      archetype_distribution: archetypeDistribution,
      students_needing_attention: studentsNeedingAttention,
      active_groups: activeGroups ?? 0,
    },
  })
}
