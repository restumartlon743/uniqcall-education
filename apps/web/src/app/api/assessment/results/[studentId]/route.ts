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

  // Fetch cognitive results
  const { data: cognitiveResult } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('student_id', studentId)
    .eq('type', 'cognitive')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch VARK results
  const { data: varkResult } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('student_id', studentId)
    .eq('type', 'vark')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch archetype
  let archetype = null
  if (cognitiveResult?.archetype_id) {
    const { data } = await supabase
      .from('archetypes')
      .select('*')
      .eq('id', cognitiveResult.archetype_id)
      .single()
    archetype = data
  }

  return NextResponse.json({
    data: {
      cognitive: cognitiveResult,
      vark: varkResult,
      archetype,
    },
  })
}
