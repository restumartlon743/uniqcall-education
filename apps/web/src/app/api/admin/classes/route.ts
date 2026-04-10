import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { createClassSchema } from '@uniqcall/shared/validators'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const querySchema = z.object({
  school_id: z.string().uuid().optional(),
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

  let query = supabase
    .from('classes')
    .select('*, schools(name), profiles!classes_teacher_id_fkey(full_name)')
    .order('name', { ascending: true })

  if (parsed.data.school_id) {
    query = query.eq('school_id', parsed.data.school_id)
  }

  const { data: classes, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: classes })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireRole(supabase, 'admin')
  if (authError) return authError

  const body = await request.json()
  const parsed = createClassSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data: newClass, error } = await supabase
    .from('classes')
    .insert({
      name: parsed.data.name,
      grade: parsed.data.grade,
      academic_year: parsed.data.academic_year,
      school_id: parsed.data.school_id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: newClass }, { status: 201 })
}
