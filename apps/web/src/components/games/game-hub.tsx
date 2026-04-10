'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  GAME_REGISTRY,
  CLUSTERS,
  ARCHETYPE_LABELS,
  getGamesByCluster,
  type ArchetypeCode,
  type ClusterNumber,
  type GameDefinition,
} from '@/lib/game-data'
import { GlowCard } from '@/components/effects/glow-card'
import { DifficultyBadge } from './shared/difficulty-badge'
import {
  Grid3x3, BookCheck, ScanSearch, CircuitBoard, Construction, Code2, Scale,
  ShieldCheck, Swords, Rocket, Crown, Lightbulb, Palette, FlaskConical,
  Grid2x2, FlipHorizontal2, Type, BookOpen, MessageSquareWarning, SpellCheck,
  Music, Clapperboard, Smile, Heart, Stethoscope, Flower2, Handshake, Globe,
  Languages, Notebook, Map, Search, GraduationCap, CalendarCheck, Building2,
  TrendingUp, Presentation, Gamepad2, Filter,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Icon map ─────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Grid3x3, BookCheck, ScanSearch, CircuitBoard, Construction, Code2, Scale,
  ShieldCheck, Swords, Rocket, Crown, Lightbulb, Palette, FlaskConical,
  Grid2x2, FlipHorizontal2, Type, BookOpen, MessageSquareWarning, SpellCheck,
  Music, Clapperboard, Smile, Heart, Stethoscope, Flower2, Handshake, Globe,
  Languages, Notebook, Map, Search, GraduationCap, CalendarCheck, Building2,
  TrendingUp, Presentation,
}
const CLUSTER_GLOW: Record<ClusterNumber, 'purple' | 'pink' | 'cyan'> = {
  1: 'purple',
  2: 'pink',
  3: 'cyan',
}

const CLUSTER_ACCENT: Record<ClusterNumber, string> = {
  1: 'text-purple-400',
  2: 'text-pink-400',
  3: 'text-cyan-400',
}

const CLUSTER_ICON_BG: Record<ClusterNumber, string> = {
  1: 'bg-purple-500/15 text-purple-400',
  2: 'bg-pink-500/15 text-pink-400',
  3: 'bg-cyan-500/15 text-cyan-400',
}

// ─── Component ────────────────────────────────────────────────

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function GameHub() {
  const [filterArchetype, setFilterArchetype] = useState<ArchetypeCode | null>(null)

  const allArchetypes = useMemo(() => {
    const codes = new Set<ArchetypeCode>()
    for (const g of GAME_REGISTRY) codes.add(g.archetype)
    return Array.from(codes)
  }, [])

  const filteredByCluster = (cluster: ClusterNumber): GameDefinition[] => {
    const games = getGamesByCluster(cluster)
    if (!filterArchetype) return games
    return games.filter((g) => g.archetype === filterArchetype)
  }

  return (
    <div className="space-y-10">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <Gamepad2 className="mr-2 inline-block h-6 w-6 text-purple-400" />
            Game Hub
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {GAME_REGISTRY.length} mini-games across 3 clusters — play to earn XP
          </p>
        </div>

        {/* Archetype filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="mr-1 h-4 w-4 text-white/40" />
          <button
            onClick={() => setFilterArchetype(null)}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-all',
              !filterArchetype
                ? 'bg-white/10 text-white ring-1 ring-white/20'
                : 'text-white/40 hover:text-white/70',
            )}
          >
            All
          </button>
          {allArchetypes.map((a) => (
            <button
              key={a}
              onClick={() => setFilterArchetype(filterArchetype === a ? null : a)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                filterArchetype === a
                  ? 'bg-white/10 text-white ring-1 ring-white/20'
                  : 'text-white/40 hover:text-white/70',
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Clusters */}
      {CLUSTERS.map((cluster) => {
        const games = filteredByCluster(cluster.id)
        if (games.length === 0) return null

        return (
          <section key={cluster.id}>
            <div className="mb-4 flex items-center gap-3">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', CLUSTER_ICON_BG[cluster.id])}>
                <span className="text-sm font-bold">{cluster.id}</span>
              </div>
              <div>
                <h2 className={cn('text-lg font-bold', CLUSTER_ACCENT[cluster.id])}>
                  {cluster.name}
                </h2>
                <p className="text-xs text-white/40">{cluster.description}</p>
              </div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {games.map((game) => (
                <GameCard key={game.slug} game={game} cluster={cluster.id} />
              ))}
            </motion.div>
          </section>
        )
      })}
    </div>
  )
}

// ─── Game Card ────────────────────────────────────────────────

function GameCard({ game, cluster }: { game: GameDefinition; cluster: ClusterNumber }) {
  const Icon = ICON_MAP[game.icon] ?? Gamepad2

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/student/games/${game.slug}`}>
        <GlowCard glowColor={CLUSTER_GLOW[cluster]} className="h-full p-4">
          <div className="flex items-start gap-3">
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', CLUSTER_ICON_BG[cluster])}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-white">{game.name}</h3>
              <span className="text-xs text-white/40">
                {ARCHETYPE_LABELS[game.archetype]}
              </span>
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/50">
            {game.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              {game.difficulty.slice(0, 3).map((d) => (
                <DifficultyBadge key={d} difficulty={d} className="scale-90" />
              ))}
              {game.difficulty.length > 3 && (
                <span className="text-xs text-white/30">+{game.difficulty.length - 3}</span>
              )}
            </div>
            <span className="text-xs font-medium text-amber-400">
              {game.xpRange[0]}–{game.xpRange[1]} XP
            </span>
          </div>
        </GlowCard>
      </Link>
    </motion.div>
  )
}
