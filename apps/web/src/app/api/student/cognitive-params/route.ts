import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('cognitive_params')
    .eq('id', user!.id)
    .single()

  if (studentError || !student) {
    return NextResponse.json({ error: 'Student record not found' }, { status: 404 })
  }

  if (!student.cognitive_params) {
    return NextResponse.json(
      { error: 'Cognitive assessment not completed yet' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: student.cognitive_params })
}
