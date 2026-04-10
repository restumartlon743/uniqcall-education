import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const querySchema = z.object({
  archetype: z.string().optional(),
  status: z.enum(['active', 'inactive', 'needs_attention']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireRole(supabase, 'teacher')
  if (authError) return authError

  const { id: classId } = await params
  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { archetype, status, search, page, limit } = parsed.data
  const offset = (page - 1) * limit

  // Build student query with joined profile and archetype
  let query = supabase
    .from('students')
    .select(
      `
      id,
      mastery_level,
      total_xp,
      current_streak,
      vark_profile,
      archetype_id,
      profiles!inner(full_name, avatar_url),
      archetypes(code, name_id)
    `,
      { count: 'exact' }
    )
    .eq('class_id', classId)

  // Filter by archetype code
  if (archetype) {
    // First get archetype_id from code
    const { data: archetypeRecord } = await supabase
      .from('archetypes')
      .select('id')
      .eq('code', archetype)
      .single()

    if (archetypeRecord) {
      query = query.eq('archetype_id', archetypeRecord.id)
    } else {
      return NextResponse.json({ data: [], total: 0, page, page_size: limit })
    }
  }

  // Search by name
  if (search) {
    query = query.ilike('profiles.full_name', `%${search}%`)
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1).order('total_xp', { ascending: false })

  const { data: students, error: studentsError, count } = await query

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 })
  }

  // Map to roster items
  const roster = (students ?? []).map((s) => {
    const profile = s.profiles as unknown as { full_name: string; avatar_url: string | null }
    const arch = s.archetypes as unknown as { code: string; name_id: string } | null
    const vark = s.vark_profile as { V: number; A: number; R: number; K: number } | null

    // Determine dominant VARK
    let varkDominant: string | null = null
    if (vark) {
      const entries = Object.entries(vark) as [string, number][]
      const max = Math.max(...entries.map(([, v]) => v))
      varkDominant = entries.find(([, v]) => v === max)?.[0] ?? null
    }

    const needsAttention = s.current_streak === 0 || s.mastery_level < 3

    return {
      id: s.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      archetype_code: arch?.code ?? null,
      archetype_name: arch?.name_id ?? null,
      mastery_level: s.mastery_level,
      total_xp: s.total_xp,
      current_streak: s.current_streak,
      vark_dominant: varkDominant,
      needs_attention: needsAttention,
    }
  })

  // Filter by status post-query (since it's a computed field)
  let filteredRoster = roster
  if (status === 'needs_attention') {
    filteredRoster = roster.filter((s) => s.needs_attention)
  } else if (status === 'active') {
    filteredRoster = roster.filter((s) => s.current_streak > 0)
  } else if (status === 'inactive') {
    filteredRoster = roster.filter((s) => s.current_streak === 0)
  }

  return NextResponse.json({
    data: filteredRoster,
    total: count ?? 0,
    page,
    page_size: limit,
  })
}
