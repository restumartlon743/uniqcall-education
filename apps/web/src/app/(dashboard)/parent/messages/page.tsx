import type { Metadata } from 'next'
import { ParentMessages } from '@/components/parent/parent-messages'

export const metadata: Metadata = { title: 'Messages — Uniqcall' }

export default function ParentMessagesPage() {
  return <ParentMessages />
}
