import type { Metadata } from 'next'
import { StudentRoster } from '@/components/teacher/student-roster'

export const metadata: Metadata = { title: 'Students — Uniqcall Teacher' }

export default function StudentsPage() {
  return <StudentRoster />
}
