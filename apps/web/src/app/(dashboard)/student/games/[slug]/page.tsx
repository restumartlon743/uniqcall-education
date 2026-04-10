import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGameBySlug, GAME_REGISTRY } from '@/lib/game-data'
import { GameLoader } from '@/components/games/game-loader'

interface GamePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params
  const game = getGameBySlug(slug)
  if (!game) return { title: 'Game Not Found — Uniqcall' }
  return { title: `${game.name} — Uniqcall Games` }
}

export function generateStaticParams() {
  return GAME_REGISTRY.map((g) => ({ slug: g.slug }))
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params
  const game = getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  return <GameLoader game={game} />
}
