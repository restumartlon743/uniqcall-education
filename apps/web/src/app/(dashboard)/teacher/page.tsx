import type { Metadata } from 'next'
import { TeacherOverview } from '@/components/teacher/teacher-overview'

export const metadata: Metadata = { title: 'Overview — Uniqcall Teacher' }

export default function TeacherPage() {
  return <TeacherOverview />
}
