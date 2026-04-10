import type { Metadata } from 'next'
import { GlowCard } from '@/components/effects/glow-card'
import { Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Groups — Uniqcall Student' }

export default function GroupsPage() {
  return (
    <div className="flex items-center justify-center py-24">
      <GlowCard glowColor="purple" className="max-w-md p-12 text-center">
        <Users className="mx-auto mb-4 h-12 w-12 text-purple-400" />
        <h2 className="mb-2 text-2xl font-bold text-white">Peer Groups</h2>
        <p className="text-slate-400">
          Your synergy-matched peer groups and collaborative projects are coming soon.
        </p>
      </GlowCard>
    </div>
  )
}
