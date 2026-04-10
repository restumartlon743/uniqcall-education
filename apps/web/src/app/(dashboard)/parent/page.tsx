import type { Metadata } from 'next'
import { ParentDashboard } from '@/components/parent/parent-dashboard'

export const metadata: Metadata = { title: 'Family Support Hub — Uniqcall' }

export default function ParentPage() {
  return <ParentDashboard />
}
