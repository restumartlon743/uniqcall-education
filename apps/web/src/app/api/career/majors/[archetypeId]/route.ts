import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ archetypeId: string }> }
) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const { archetypeId } = await params

  // Verify archetype exists
  const { data: archetype, error: archetypeError } = await supabase
    .from('archetypes')
    .select('id, code, name_en, name_id, cluster, knowledge_field')
    .eq('id', archetypeId)
    .single()

  if (archetypeError || !archetype) {
    return NextResponse.json({ error: 'Archetype not found' }, { status: 404 })
  }

  // Fetch majors via junction table
  const { data: archetypeMajors, error: majorsError } = await supabase
    .from('archetype_majors')
    .select('relevance_score, majors(*)')
    .eq('archetype_id', archetypeId)
    .order('relevance_score', { ascending: false })

  if (majorsError) {
    return NextResponse.json({ error: majorsError.message }, { status: 500 })
  }

  const majors = (archetypeMajors ?? []).map((am) => ({
    ...(am.majors as unknown as Record<string, unknown>),
    relevance_score: am.relevance_score,
  }))

  return NextResponse.json({
    data: {
      archetype,
      majors,
    },
  })
}
