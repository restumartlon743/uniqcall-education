import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/api-utils'
import { sendHighFiveSchema } from '@uniqcall/shared/validators'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 })
  const { user, profile, error: authError } = await requireRole(supabase, 'parent')
  if (authError) return authError

  const body = await request.json()
  const parsed = sendHighFiveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { to_student_id, message } = parsed.data

  // Verify parent-child relationship
  const { data: link } = await supabase
    .from('parent_students')
    .select('student_id')
    .eq('parent_id', profile!.id)
    .eq('student_id', to_student_id)
    .maybeSingle()

  if (!link) {
    return NextResponse.json({ error: 'Child not found or not linked' }, { status: 403 })
  }

  // Create high five record
  const { data: highFive, error: highFiveError } = await supabase
    .from('high_fives')
    .insert({
      from_user_id: user!.id,
      to_student_id,
      message: message ?? null,
    })
    .select()
    .single()

  if (highFiveError) {
    return NextResponse.json({ error: highFiveError.message }, { status: 500 })
  }

  // Create notification for the student
  const { error: notifError } = await supabase
    .from('notifications')
    .insert({
      user_id: to_student_id,
      type: 'high_five',
      title: 'High Five!',
      body: message || `${profile!.full_name} sent you a high five!`,
      data: { entity_type: 'high_five', entity_id: highFive.id },
    })

  if (notifError) {
    // Non-critical — log but don't fail
    console.error('Failed to create notification:', notifError.message)
  }

  return NextResponse.json({ data: highFive }, { status: 201 })
}
