import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { generateGroupsSchema } from '@uniqcall/shared/validators'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireRole(supabase, 'teacher')
  if (authError) return authError

  const body = await request.json()
  const parsed = generateGroupsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { class_id, group_size, strategy } = parsed.data

  // Fetch students with archetypes
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, archetype_id, archetypes(code, cluster)')
    .eq('class_id', class_id)

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 })
  }

  if (!students || students.length < group_size) {
    return NextResponse.json(
      { error: `Not enough students to form groups of ${group_size}` },
      { status: 400 }
    )
  }

  // Group students based on strategy
  const groups = generateGroupsByStrategy(students, group_size, strategy)

  // Store groups in database
  const createdGroups = []
  for (let i = 0; i < groups.length; i++) {
    const groupStudents = groups[i]

    const { data: group, error: groupError } = await supabase
      .from('peer_groups')
      .insert({
        class_id,
        name: `Group ${i + 1}`,
        synergy_score: null,
      })
      .select()
      .single()

    if (groupError) {
      return NextResponse.json({ error: groupError.message }, { status: 500 })
    }

    // Assign roles and add members
    const roles = ['leader', 'executor', 'creative', 'presenter']
    const members = groupStudents.map((s, idx) => ({
      group_id: group.id,
      student_id: s.id,
      role_in_group: roles[idx % roles.length],
    }))

    const { error: membersError } = await supabase
      .from('peer_group_members')
      .insert(members)

    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 })
    }

    createdGroups.push({
      ...group,
      members: members.map((m) => ({
        student_id: m.student_id,
        role: m.role_in_group,
      })),
    })
  }

  return NextResponse.json({ data: createdGroups }, { status: 201 })
}

interface StudentWithArchetype {
  id: string
  archetype_id: string | null
  archetypes: unknown
}

function generateGroupsByStrategy(
  students: StudentWithArchetype[],
  groupSize: number,
  strategy: string
): StudentWithArchetype[][] {
  const shuffled = [...students]

  if (strategy === 'random') {
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return chunkArray(shuffled, groupSize)
  }

  if (strategy === 'similar') {
    // Group by same archetype cluster
    const byCluster = new Map<string, StudentWithArchetype[]>()
    for (const s of shuffled) {
      const arch = s.archetypes as { code: string; cluster: string } | null
      const cluster = arch?.cluster ?? 'unassigned'
      const list = byCluster.get(cluster) ?? []
      list.push(s)
      byCluster.set(cluster, list)
    }
    const sorted = [...byCluster.values()].flat()
    return chunkArray(sorted, groupSize)
  }

  // 'balanced' — mix different clusters
  const clusters = new Map<string, StudentWithArchetype[]>()
  for (const s of shuffled) {
    const arch = s.archetypes as { code: string; cluster: string } | null
    const cluster = arch?.cluster ?? 'unassigned'
    const list = clusters.get(cluster) ?? []
    list.push(s)
    clusters.set(cluster, list)
  }

  // Round-robin across clusters
  const clusterQueues = [...clusters.values()]
  const balanced: StudentWithArchetype[] = []
  let qi = 0
  while (balanced.length < students.length) {
    const queue = clusterQueues[qi % clusterQueues.length]
    if (queue.length > 0) {
      balanced.push(queue.shift()!)
    }
    qi++
    // Safety: break if we've cycled through all empty queues
    if (clusterQueues.every((q) => q.length === 0)) break
  }

  return chunkArray(balanced, groupSize)
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const groups: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    groups.push(arr.slice(i, i + size))
  }
  return groups
}
