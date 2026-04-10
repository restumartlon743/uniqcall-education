import type { Metadata } from 'next'
import { QuestMap } from '@/components/student/quest-map'

export const metadata: Metadata = { title: 'Quests — Uniqcall Student' }

export default function QuestsPage() {
  return <QuestMap />
}
