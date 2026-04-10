import type { Metadata } from 'next'
import { ParentSettings } from '@/components/parent/parent-settings'

export const metadata: Metadata = { title: 'Settings — Uniqcall' }

export default function ParentSettingsPage() {
  return <ParentSettings />
}
