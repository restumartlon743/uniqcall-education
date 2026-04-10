import type { Metadata } from 'next'
import { ClassesManager } from '@/components/teacher/classes-manager'

export const metadata: Metadata = { title: 'Kelas — Uniqcall Teacher' }

export default function ClassesPage() {
  return <ClassesManager />
}
