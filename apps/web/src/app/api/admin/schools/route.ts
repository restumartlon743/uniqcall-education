import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const createSchoolSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  address: z.string().max(500).trim().optional(),
  logo_url: z.string().url().optional(),
})

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireRole(supabase, 'admin')
  if (authError) return authError

  const { data: schools, error } = await supabase
    .from('schools')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: schools })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { error: authError } = await requireRole(supabase, 'admin')
  if (authError) return authError

  const body = await request.json()
  const parsed = createSchoolSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data: school, error } = await supabase
    .from('schools')
    .insert({
      name: parsed.data.name,
      address: parsed.data.address ?? null,
      logo_url: parsed.data.logo_url ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: school }, { status: 201 })
}
