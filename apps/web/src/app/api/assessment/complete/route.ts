import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { completeAssessmentSchema } from '@uniqcall/shared/validators'
import { classifyArchetype } from '@uniqcall/shared/utils'
import { scoreVark } from '@uniqcall/shared/utils'
import type { CognitiveParams, VarkProfile } from '@uniqcall/shared/types'
import type { VarkTag } from '@uniqcall/shared/types'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  const parsed = completeAssessmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { session_id } = parsed.data

  // Verify session
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('id, student_id, type, status')
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

  // Fetch all responses with question data
  const { data: responses, error: responsesError } = await supabase
    .from('assessment_responses')
    .select('question_id, answer, score, assessment_questions(parameter, correct_answer)')
    .eq('session_id', session_id)

  if (responsesError) {
    return NextResponse.json({ error: responsesError.message }, { status: 500 })
  }

  let results: CognitiveParams | VarkProfile
  let archetypeId: string | null = null

  if (session.type === 'cognitive') {
    // Aggregate scores per cognitive parameter
    const paramScores: CognitiveParams = {
      analytical: 0,
      creative: 0,
      linguistic: 0,
      kinesthetic: 0,
      social: 0,
      observation: 0,
      intuition: 0,
    }
    const paramCounts: Record<string, number> = {}

    for (const resp of responses ?? []) {
      const question = resp.assessment_questions as unknown as {
        parameter: string | null
        correct_answer: unknown
      }
      if (question?.parameter && question.parameter in paramScores) {
        const param = question.parameter as keyof CognitiveParams
        paramScores[param] += resp.score ?? 0
        paramCounts[param] = (paramCounts[param] ?? 0) + 1
      }
    }

    // Average scores per parameter, scale to 0-100
    for (const key of Object.keys(paramScores) as (keyof CognitiveParams)[]) {
      const count = paramCounts[key] ?? 1
      paramScores[key] = Math.round((paramScores[key] / count) * 100)
    }

    results = paramScores

    // Classify archetype
    const archetypeCode = classifyArchetype(paramScores)

    // Look up archetype record
    const { data: archetype } = await supabase
      .from('archetypes')
      .select('id')
      .eq('code', archetypeCode)
      .single()

    archetypeId = archetype?.id ?? null

    // Update student record
    await supabase
      .from('students')
      .update({
        cognitive_params: paramScores,
        archetype_id: archetypeId,
      })
      .eq('id', user!.id)
  } else {
    // VARK scoring
    const varkAnswers = (responses ?? []).map((r) => ({
      question_id: r.question_id,
      selected_tags: (r.answer as string).split(',') as VarkTag[],
    }))

    results = scoreVark(varkAnswers)

    // Update student record
    await supabase
      .from('students')
      .update({ vark_profile: results })
      .eq('id', user!.id)
  }

  // Store assessment result
  const { data: resultRecord, error: resultError } = await supabase
    .from('assessment_results')
    .insert({
      student_id: user!.id,
      session_id,
      type: session.type,
      results,
      archetype_id: archetypeId,
    })
    .select()
    .single()

  if (resultError) {
    return NextResponse.json({ error: resultError.message }, { status: 500 })
  }

  // Mark session as completed
  await supabase
    .from('assessment_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', session_id)

  // Fetch archetype details if applicable
  let archetype = null
  if (archetypeId) {
    const { data } = await supabase
      .from('archetypes')
      .select('*')
      .eq('id', archetypeId)
      .single()
    archetype = data
  }

  return NextResponse.json({
    data: {
      result_id: resultRecord.id,
      type: session.type,
      results,
      archetype,
    },
  })
}
