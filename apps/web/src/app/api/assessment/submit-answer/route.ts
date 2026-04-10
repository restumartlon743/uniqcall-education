import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { submitAnswerSchema } from '@uniqcall/shared/validators'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  const parsed = submitAnswerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { session_id, question_id, answer, time_spent_seconds } = parsed.data

  // Verify session belongs to user and is in progress
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('id, student_id, type, status, current_module')
    .eq('id', session_id)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (session.student_id !== user!.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (session.status !== 'in_progress') {
    return NextResponse.json({ error: 'Session is not in progress' }, { status: 400 })
  }

  // Fetch the question to check the correct answer
  const { data: question, error: questionError } = await supabase
    .from('assessment_questions')
    .select('id, correct_answer, parameter, module')
    .eq('id', question_id)
    .single()

  if (questionError || !question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  // Check for duplicate answer
  const { data: existingAnswer } = await supabase
    .from('assessment_responses')
    .select('id')
    .eq('session_id', session_id)
    .eq('question_id', question_id)
    .maybeSingle()

  if (existingAnswer) {
    return NextResponse.json({ error: 'Answer already submitted for this question' }, { status: 409 })
  }

  // Compute score (simple match for now)
  let score: number | null = null
  if (question.correct_answer !== null) {
    score = String(question.correct_answer) === answer ? 1 : 0
  }

  // Store the response
  const { data: responseData, error: responseError } = await supabase
    .from('assessment_responses')
    .insert({
      session_id,
      question_id,
      answer,
      score,
      time_spent_seconds,
    })
    .select()
    .single()

  if (responseError) {
    return NextResponse.json({ error: responseError.message }, { status: 500 })
  }

  // Determine progress and next question
  const { count: answeredCount } = await supabase
    .from('assessment_responses')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', session_id)

  const { count: totalCount } = await supabase
    .from('assessment_questions')
    .select('id', { count: 'exact', head: true })
    .eq('type', session.type)

  const total = totalCount ?? 0
  const answered = answeredCount ?? 0
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0

  // Find next unanswered question
  const { data: answeredIds } = await supabase
    .from('assessment_responses')
    .select('question_id')
    .eq('session_id', session_id)

  const answeredQuestionIds = (answeredIds ?? []).map((r) => r.question_id)

  const { data: nextQuestion } = await supabase
    .from('assessment_questions')
    .select('id')
    .eq('type', session.type)
    .not('id', 'in', `(${answeredQuestionIds.join(',')})`)
    .order('module', { ascending: true })
    .order('order_index', { ascending: true })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({
    data: {
      response_id: responseData.id,
      score,
      progress,
      next_question_id: nextQuestion?.id ?? null,
      is_last: !nextQuestion,
    },
  })
}
