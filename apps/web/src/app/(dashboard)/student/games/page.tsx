import type { Metadata } from 'next'
import { GameHub } from '@/components/games/game-hub'

export const metadata: Metadata = { title: 'Games — Uniqcall Student' }

export default function GamesPage() {
  return <GameHub />
}
