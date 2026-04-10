import type { Metadata } from 'next'
import { TeacherSettings } from '@/components/teacher/teacher-settings'

export const metadata: Metadata = { title: 'Settings — Uniqcall Teacher' }

export default function SettingsPage() {
  return <TeacherSettings />
}
