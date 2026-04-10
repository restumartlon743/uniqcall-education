import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { createTaskSchema } from '@uniqcall/shared/validators'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, error: authError } = await requireRole(supabase, 'teacher')
  if (authError) return authError

  const body = await request.json()
  const parsed = createTaskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert({
      teacher_id: user!.id,
      class_id: parsed.data.class_id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      task_type: parsed.data.task_type,
      target_archetype: parsed.data.target_archetype ?? null,
      vark_adaptations: parsed.data.vark_adaptations ?? null,
      due_date: parsed.data.due_date ?? null,
      xp_reward: parsed.data.xp_reward,
      knowledge_field: parsed.data.knowledge_field ?? null,
    })
    .select()
    .single()

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 })
  }

  return NextResponse.json({ data: task }, { status: 201 })
}
