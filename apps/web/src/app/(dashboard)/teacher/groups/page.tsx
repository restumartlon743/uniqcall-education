import type { Metadata } from 'next'
import { GroupsOverview } from '@/components/teacher/groups-overview'

export const metadata: Metadata = { title: 'Groups — Uniqcall Teacher' }

export default function GroupsPage() {
  return <GroupsOverview />
}
