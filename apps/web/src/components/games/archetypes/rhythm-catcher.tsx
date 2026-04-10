'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Music,
  Star,
  Zap,
  Flame,
  Target,
  ThumbsUp,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface Beat {
  id: number
  lane: number // 0-3 for 4 lanes
  targetTime: number // ms from start
  color: string
}

type HitResult = 'perfect' | 'good' | 'miss'

interface RhythmCatcherProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Config ───────────────────────────────────────────────────

const LANE_COLORS = ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B']

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { bpm: 80, beatCount: 16, perfectWindow: 120, goodWindow: 250, duration: 30000, multiplier: 1, lanes: 2 }
    case 'medium':
      return { bpm: 120, beatCount: 24, perfectWindow: 100, goodWindow: 200, duration: 30000, multiplier: 1.5, lanes: 3 }
    case 'hard':
      return { bpm: 160, beatCount: 32, perfectWindow: 80, goodWindow: 160, duration: 30000, multiplier: 2, lanes: 4 }
    case 'extreme':
      return { bpm: 200, beatCount: 32, perfectWindow: 60, goodWindow: 130, duration: 30000, multiplier: 3, lanes: 4 }
  }
}

function generateBeats(config: ReturnType<typeof getConfig>): Beat[] {
  const interval = 60000 / config.bpm
  const beats: Beat[] = []
  for (let i = 0; i < config.beatCount; i++) {
    beats.push({
      id: i,
      lane: Math.floor(Math.random() * config.lanes),
      targetTime: 2000 + i * interval, // 2s lead-in
      color: LANE_COLORS[Math.floor(Math.random() * config.lanes)],
    })
  }
  return beats
}

// ─── Component ────────────────────────────────────────────────

export default function RhythmCatcher({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: RhythmCatcherProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const beats = useMemo(() => generateBeats(config), [config])

  const [phase, setPhase] = useState<'ready' | 'playing' | 'finished'>('ready')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [hitResults, setHitResults] = useState<Map<number, HitResult>>(new Map())
  const [particles, setParticles] = useState<{ id: number; lane: number; type: HitResult; x: number }[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [feedback, setFeedback] = useState<{ text: string; color: string; lane: number } | null>(null)

  const startTimeRef = useRef(0)
  const animFrameRef = useRef<number>(0)
  const particleIdRef = useRef(0)
  const processedBeatsRef = useRef(new Set<number>())

  const perfectCount = useMemo(() => [...hitResults.values()].filter((r) => r === 'perfect').length, [hitResults])
  const goodCount = useMemo(() => [...hitResults.values()].filter((r) => r === 'good').length, [hitResults])
  const missCount = useMemo(() => [...hitResults.values()].filter((r) => r === 'miss').length, [hitResults])

  const maxScore = Math.round(beats.length * 3 * config.multiplier * 2) // theoretical max with perfect combos

  const FALL_DURATION = 2500 // ms for beat to travel from top to hit zone
  const HIT_ZONE_Y = 85 // percentage from top

  // Game loop
  useEffect(() => {
    if (phase !== 'playing' || isPaused) return

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      setCurrentTime(elapsed)

      // Auto-miss beats that have passed
      beats.forEach((beat) => {
        if (
          !hitResults.has(beat.id) &&
          !processedBeatsRef.current.has(beat.id) &&
          elapsed > beat.targetTime + config.goodWindow + 100
        ) {
          processedBeatsRef.current.add(beat.id)
          setHitResults((prev) => new Map(prev).set(beat.id, 'miss'))
          setCombo(0)
          setFeedback({ text: 'MISS', color: 'text-red-400', lane: beat.lane })
        }
      })

      // Check if all beats processed
      const allDone = beats.every(
        (b) => hitResults.has(b.id) || processedBeatsRef.current.has(b.id) || elapsed > b.targetTime + config.goodWindow + 100,
      )
      if (allDone && elapsed > (beats[beats.length - 1]?.targetTime ?? 0) + 1000) {
        return // will be handled on next state update
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase, isPaused, beats, config.goodWindow, hitResults])

  // Check game over
  useEffect(() => {
    if (phase !== 'playing') return
    const allProcessed = beats.every(
      (b) => hitResults.has(b.id) || processedBeatsRef.current.has(b.id),
    )
    if (allProcessed && hitResults.size + processedBeatsRef.current.size >= beats.length) {
      const finalScore = Math.round(score * config.multiplier)
      setPhase('finished')
      onScoreUpdate(finalScore, maxScore)
      onGameOver(finalScore, maxScore)
    }
  }, [hitResults, beats, phase, score, config.multiplier, maxScore, onScoreUpdate, onGameOver])

  const startGame = useCallback(() => {
    startTimeRef.current = Date.now()
    processedBeatsRef.current = new Set()
    setPhase('playing')
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setHitResults(new Map())
  }, [])

  const handleLaneClick = useCallback((lane: number) => {
    if (phase !== 'playing' || isPaused) return
    const now = Date.now() - startTimeRef.current

    // Find the closest unresolved beat in this lane
    let closest: Beat | null = null
    let closestDiff = Infinity
    for (const beat of beats) {
      if (hitResults.has(beat.id) || processedBeatsRef.current.has(beat.id)) continue
      if (beat.lane !== lane) continue
      const diff = Math.abs(now - beat.targetTime)
      if (diff < closestDiff) {
        closestDiff = diff
        closest = beat
      }
    }

    if (!closest) return

    let result: HitResult
    let points = 0
    if (closestDiff <= config.perfectWindow) {
      result = 'perfect'
      points = 3
    } else if (closestDiff <= config.goodWindow) {
      result = 'good'
      points = 1
    } else {
      return // too far from any beat
    }

    const newCombo = combo + 1
    const comboMultiplier = 1 + Math.floor(newCombo / 5) * 0.5
    const totalPoints = Math.round(points * comboMultiplier)

    const hitId = closest.id
    processedBeatsRef.current.add(hitId)
    setHitResults((prev) => new Map(prev).set(hitId, result))
    setScore((s) => s + totalPoints)
    setCombo(newCombo)
    setMaxCombo((m) => Math.max(m, newCombo))

    // Particle effect
    const pid = particleIdRef.current++
    setParticles((p) => [...p, { id: pid, lane, type: result, x: (lane / config.lanes) * 100 + 50 / config.lanes }])
    setTimeout(() => setParticles((p) => p.filter((pp) => pp.id !== pid)), 600)

    // Feedback
    if (result === 'perfect') {
      setFeedback({ text: `PERFECT! x${newCombo}`, color: 'text-amber-400', lane })
    } else {
      setFeedback({ text: 'GOOD', color: 'text-cyan-400', lane })
    }
    setTimeout(() => setFeedback(null), 400)
  }, [phase, isPaused, beats, hitResults, combo, config])

  // Keyboard support
  useEffect(() => {
    const keys = ['d', 'f', 'j', 'k']
    const handler = (e: KeyboardEvent) => {
      const idx = keys.indexOf(e.key.toLowerCase())
      if (idx !== -1 && idx < config.lanes) {
        handleLaneClick(idx)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleLaneClick, config.lanes])

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
      {phase === 'ready' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8"
        >
          <Music className="h-16 w-16 text-violet-400" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">Rhythm Catcher</p>
            <p className="mt-2 text-sm text-white/60">
              Tap the lanes when beats reach the hit zone!
            </p>
            <p className="mt-1 text-xs text-white/40">
              Keyboard: {config.lanes >= 2 && 'D, F'}{config.lanes >= 3 && ', J'}{config.lanes >= 4 && ', K'} — or click the lanes
            </p>
          </div>
          <div className="flex gap-4 text-xs text-white/50">
            <span><Music className="mr-1 inline h-3 w-3" /> {config.bpm} BPM</span>
            <span><Target className="mr-1 inline h-3 w-3" /> {config.beatCount} beats</span>
            <span><Zap className="mr-1 inline h-3 w-3" /> {config.lanes} lanes</span>
          </div>
          <button
            onClick={startGame}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:bg-violet-500"
          >
            <Zap className="h-4 w-4" />
            Start!
          </button>
        </motion.div>
      )}

      {phase === 'playing' && (
        <>
          {/* HUD */}
          <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-amber-400 font-bold">Score: {score}</span>
              <span className={cn(
                'font-bold',
                combo >= 10 ? 'text-red-400' : combo >= 5 ? 'text-amber-400' : 'text-white/60',
              )}>
                {combo > 0 && (
                  <>
                    <Flame className="mr-0.5 inline h-3 w-3" />
                    Combo x{combo}
                  </>
                )}
              </span>
            </div>
            <div className="flex gap-2 text-[10px]">
              <span className="text-amber-400"><Star className="mr-0.5 inline h-3 w-3" /> {perfectCount}</span>
              <span className="text-cyan-400"><ThumbsUp className="mr-0.5 inline h-3 w-3" /> {goodCount}</span>
              <span className="text-red-400">✕ {missCount}</span>
            </div>
          </div>

          {/* Game area */}
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A0E27] to-[#151B3B]"
            style={{ height: 450 }}
          >
            {/* Lane dividers */}
            {Array.from({ length: config.lanes }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r border-white/5"
                style={{ left: `${((i + 1) / config.lanes) * 100}%` }}
              />
            ))}

            {/* Hit zone line */}
            <div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-violet-500/60 via-cyan-500/60 to-pink-500/60 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              style={{ top: `${HIT_ZONE_Y}%` }}
            />

            {/* Falling beats */}
            {beats.map((beat) => {
              if (hitResults.has(beat.id) || processedBeatsRef.current.has(beat.id)) return null
              const elapsed = currentTime - beat.targetTime + FALL_DURATION
              const progress = elapsed / FALL_DURATION
              if (progress < 0 || progress > 1.3) return null

              const yPercent = progress * HIT_ZONE_Y
              const laneWidth = 100 / config.lanes
              const left = beat.lane * laneWidth + laneWidth / 2

              return (
                <motion.div
                  key={beat.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    top: `${yPercent}%`,
                    left: `${left}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-full border-2 shadow-lg"
                    style={{
                      backgroundColor: `${LANE_COLORS[beat.lane]}20`,
                      borderColor: `${LANE_COLORS[beat.lane]}80`,
                      boxShadow: `0 0 15px ${LANE_COLORS[beat.lane]}40`,
                    }}
                  />
                </motion.div>
              )
            })}

            {/* Particle effects */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.5, y: -40 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute"
                  style={{ top: `${HIT_ZONE_Y}%`, left: `${p.x}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={cn(
                    'h-12 w-12 rounded-full',
                    p.type === 'perfect' ? 'bg-amber-400/30' : 'bg-cyan-400/30',
                  )} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Feedback text */}
            <AnimatePresence>
              {feedback && (
                <motion.p
                  key={feedback.text + Date.now()}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -30, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={cn('absolute text-center text-sm font-black', feedback.color)}
                  style={{
                    top: `${HIT_ZONE_Y - 8}%`,
                    left: `${(feedback.lane / config.lanes) * 100 + 50 / config.lanes}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {feedback.text}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Tap buttons at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: `${100 - HIT_ZONE_Y + 5}%` }}>
              {Array.from({ length: config.lanes }).map((_, lane) => (
                <button
                  key={lane}
                  onClick={() => handleLaneClick(lane)}
                  className="flex flex-1 items-center justify-center border-r border-white/5 transition-colors active:bg-white/10"
                  style={{ backgroundColor: `${LANE_COLORS[lane]}08` }}
                >
                  <Target
                    className="h-8 w-8 opacity-30"
                    style={{ color: LANE_COLORS[lane] }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Lane labels */}
          <div className="flex w-full justify-around text-[10px] text-white/30">
            {Array.from({ length: config.lanes }).map((_, i) => (
              <span key={i}>
                {['D', 'F', 'J', 'K'][i]}
              </span>
            ))}
          </div>
        </>
      )}

      {phase === 'finished' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Song Complete!</p>
          <p className="text-sm text-white/60">
            Score: {Math.round(score * config.multiplier)} / {maxScore}
          </p>
          <div className="grid w-full max-w-xs grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-white/40">Perfect</p>
              <p className="text-lg font-bold text-amber-400"><Star className="mr-1 inline h-5 w-5" /> {perfectCount}</p>
            </div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
              <p className="text-white/40">Good</p>
              <p className="text-lg font-bold text-cyan-300"><ThumbsUp className="mr-1 inline h-5 w-5" /> {goodCount}</p>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-white/40">Miss</p>
              <p className="text-lg font-bold text-red-400">✕ {missCount}</p>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
              <p className="text-white/40">Max Combo</p>
              <p className="text-lg font-bold text-violet-300"><Flame className="mr-1 inline h-5 w-5" /> {maxCombo}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
