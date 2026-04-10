import type { Metadata } from 'next'
import { GlowCard } from '@/components/effects/glow-card'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = { title: 'Learn — Uniqcall Student' }

export default function LearnPage() {
  return (
    <div className="flex items-center justify-center py-24">
      <GlowCard glowColor="cyan" className="max-w-md p-12 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
        <h2 className="mb-2 text-2xl font-bold text-white">Learning Modules</h2>
        <p className="text-slate-400">
          Personalized learning content based on your VARK profile is coming soon.
        </p>
      </GlowCard>
    </div>
  )
}
