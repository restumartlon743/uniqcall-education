import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // Verify the caller is an admin
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.split('Bearer ')[1]
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse request
  const body = await req.json()
  const { fullName, email, schoolId } = body as {
    fullName?: string
    email?: string
    schoolId?: string
  }

  if (!fullName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  // Create auth user with a temporary password
  const tempPassword = 'Uniqcall@' + crypto.randomUUID().substring(0, 8)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email.trim(),
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName.trim() },
  })
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  // Create profile
  await supabaseAdmin.from('profiles').upsert({
    id: userId,
    role: 'teacher',
    full_name: fullName.trim(),
    school_id: schoolId || null,
  })

  // Create teacher record
  await supabaseAdmin.from('teachers').upsert({
    id: userId,
  })

  return NextResponse.json({
    success: true,
    userId,
    tempPassword,
    message: `Teacher created. Temporary password: ${tempPassword}`,
  })
}
