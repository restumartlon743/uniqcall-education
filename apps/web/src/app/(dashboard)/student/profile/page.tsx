import type { Metadata } from 'next'
import { StudentProfile } from '@/components/student/student-profile'

export const metadata: Metadata = { title: 'Profile — Uniqcall Student' }

export default function ProfilePage() {
  return <StudentProfile />
}
