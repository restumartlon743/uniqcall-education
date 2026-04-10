import type { Metadata } from 'next'
import { ParentGrowth } from '@/components/parent/parent-growth'

export const metadata: Metadata = { title: 'Growth Detail — Uniqcall' }

export default function ParentGrowthPage() {
  return <ParentGrowth />
}
