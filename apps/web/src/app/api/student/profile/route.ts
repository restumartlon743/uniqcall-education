import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Fetch student record
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('id', user!.id)
    .single()

  if (studentError || !student) {
    return NextResponse.json({ error: 'Student record not found' }, { status: 404 })
  }

  // Fetch archetype details if assigned
  let archetype = null
  if (student.archetype_id) {
    const { data } = await supabase
      .from('archetypes')
      .select('*')
      .eq('id', student.archetype_id)
      .single()
    archetype = data
  }

  return NextResponse.json({
    data: {
      profile,
      student,
      archetype,
    },
  })
}
