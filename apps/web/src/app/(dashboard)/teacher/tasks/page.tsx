import type { Metadata } from 'next'
import { TaskManager } from '@/components/teacher/task-manager'

export const metadata: Metadata = { title: 'Tasks — Uniqcall Teacher' }

export default function TasksPage() {
  return <TaskManager />
}
