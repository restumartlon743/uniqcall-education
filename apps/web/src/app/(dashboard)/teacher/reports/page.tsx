import type { Metadata } from 'next'
import { TeacherReports } from '@/components/teacher/teacher-reports'

export const metadata: Metadata = { title: 'Reports — Uniqcall Teacher' }

export default function ReportsPage() {
  return <TeacherReports />
}
