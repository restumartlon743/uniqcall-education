import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { startAssessmentSchema } from '@uniqcall/shared/validators'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  const parsed = startAssessmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { type } = parsed.data

  // Check for existing in-progress session
  const { data: existing } = await supabase
    .from('assessment_sessions')
    .select('id')
    .eq('student_id', user!.id)
    .eq('type', type)
    .eq('status', 'in_progress')
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'An assessment session is already in progress' },
      { status: 409 }
    )
  }

  // Create session
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .insert({
      student_id: user!.id,
      type,
      status: 'in_progress',
      current_module: 1,
    })
    .select()
    .single()

  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 })
  }

  // Fetch first batch of questions
  const { data: questions, error: questionsError } = await supabase
    .from('assessment_questions')
    .select('id, question_text, question_media_url, options, difficulty, order_index')
    .eq('type', type)
    .eq('module', 1)
    .order('order_index', { ascending: true })

  if (questionsError) {
    return NextResponse.json({ error: questionsError.message }, { status: 500 })
  }

  // Get total question count
  const { count } = await supabase
    .from('assessment_questions')
    .select('id', { count: 'exact', head: true })
    .eq('type', type)

  return NextResponse.json({
    data: {
      session_id: session.id,
      type,
      total_questions: count ?? 0,
      questions,
    },
  })
}
