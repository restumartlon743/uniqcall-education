import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const querySchema = z.object({
  role: z.enum(['student', 'teacher', 'parent', 'admin']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireRole(supabase, 'admin')
  if (authError) return authError

  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { role, search, page, limit } = parsed.data
  const offset = (page - 1) * limit

  let query = supabase
    .from('profiles')
    .select('*, schools(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (role) {
    query = query.eq('role', role)
  }

  if (search) {
    query = query.ilike('full_name', `%${search}%`)
  }

  const { data: users, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data: users,
    total: count ?? 0,
    page,
    page_size: limit,
  })
}
