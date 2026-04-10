'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Swords,
  ArrowRight,
  Flag,
  Shield,
  Target,
  Mountain,
  Waves,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type Terrain = 'plain' | 'mountain' | 'river'
type UnitType = 'infantry' | 'cavalry' | 'archer'
type Team = 'player' | 'enemy'

interface Unit {
  id: string
  type: UnitType
  team: Team
  hp: number
  maxHp: number
  attack: number
  range: number
  speed: number
  row: number
  col: number
}

interface Cell {
  terrain: Terrain
  hasFlag: boolean
  flagTeam?: Team
}

interface WarRoomProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Constants ────────────────────────────────────────────────

const UNIT_STATS: Record<UnitType, { hp: number; attack: number; range: number; speed: number; symbol: string }> = {
  infantry: { hp: 10, attack: 3, range: 1, speed: 1, symbol: '⚔' },
  cavalry:  { hp: 8,  attack: 4, range: 1, speed: 2, symbol: '🐴' },
  archer:   { hp: 6,  attack: 3, range: 2, speed: 1, symbol: '🏹' },
}

function getGridSize(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 8
    case 'medium': return 8
    case 'hard': return 10
    case 'extreme': return 10
  }
}

function getMaxTurns(): number {
  return 10
}

function getMultiplier(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 1
    case 'medium': return 1.5
    case 'hard': return 2
    case 'extreme': return 3
  }
}

// ─── Map Generation ───────────────────────────────────────────

function generateGrid(size: number): Cell[][] {
  const grid: Cell[][] = []
  for (let r = 0; r < size; r++) {
    const row: Cell[] = []
    for (let c = 0; c < size; c++) {
      let terrain: Terrain = 'plain'
      const rand = Math.random()
      if (rand < 0.1) terrain = 'mountain'
      else if (rand < 0.17) terrain = 'river'
      row.push({ terrain, hasFlag: false })
    }
    grid.push(row)
  }

  // Place flags
  const mid = Math.floor(size / 2)
  grid[1][mid].hasFlag = true
  grid[1][mid].flagTeam = 'enemy'
  grid[1][mid].terrain = 'plain'
  grid[size - 2][mid].hasFlag = true
  grid[size - 2][mid].flagTeam = 'player'
  grid[size - 2][mid].terrain = 'plain'
  // Neutral flag in center
  grid[mid][mid].hasFlag = true
  grid[mid][mid].terrain = 'plain'

  return grid
}

function generateUnits(size: number, difficulty: GameDifficulty): Unit[] {
  const units: Unit[] = []
  let id = 0

  // Player units (bottom rows)
  const playerRow = size - 1
  const playerTypes: UnitType[] = ['infantry', 'cavalry', 'archer', 'infantry']
  const start = Math.floor(size / 2) - 2
  for (let i = 0; i < playerTypes.length; i++) {
    const type = playerTypes[i]
    const s = UNIT_STATS[type]
    units.push({
      id: `p${id++}`,
      type,
      team: 'player',
      hp: s.hp,
      maxHp: s.hp,
      attack: s.attack,
      range: s.range,
      speed: s.speed,
      row: playerRow,
      col: start + i,
    })
  }

  // Enemy units (top rows)
  const enemyRow = 0
  const enemyCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  const enemyTypes: UnitType[] = ['infantry', 'archer', 'cavalry', 'infantry', 'archer']
  for (let i = 0; i < enemyCount; i++) {
    const type = enemyTypes[i % enemyTypes.length]
    const s = UNIT_STATS[type]
    units.push({
      id: `e${id++}`,
      type,
      team: 'enemy',
      hp: s.hp,
      maxHp: s.hp,
      attack: s.attack,
      range: s.range,
      speed: s.speed,
      row: enemyRow,
      col: start + i,
    })
  }

  return units
}

function dist(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2)
}

// ─── Component ────────────────────────────────────────────────

export default function WarRoom({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: WarRoomProps) {
  const gridSize = getGridSize(difficulty)
  const multiplier = getMultiplier(difficulty)
  const maxTurns = getMaxTurns()

  const [grid] = useState(() => generateGrid(gridSize))
  const [units, setUnits] = useState(() => generateUnits(gridSize, difficulty))
  const [turn, setTurn] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [phase, setPhase] = useState<'select' | 'move' | 'attack' | 'enemyTurn' | 'done'>('select')
  const [movedUnits, setMovedUnits] = useState<Set<string>>(new Set())
  const [_attackedUnits, setAttackedUnits] = useState<Set<string>>(new Set())
  const [log, setLog] = useState<string[]>(['Your turn! Select a unit to move.'])
  const [capturedFlags, setCapturedFlags] = useState(0)
  const [enemiesDefeated, setEnemiesDefeated] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [msg, ...prev].slice(0, 8))
  }, [])

  const playerUnits = units.filter((u) => u.team === 'player' && u.hp > 0)
  const enemyUnits = units.filter((u) => u.team === 'enemy' && u.hp > 0)
  const selectedUnitData = selectedUnit ? units.find((u) => u.id === selectedUnit) : null

  const maxScore = 100 * multiplier

  // Get valid moves for selected unit
  const getValidMoves = useCallback(
    (unit: Unit): { row: number; col: number }[] => {
      const moves: { row: number; col: number }[] = []
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (dist(unit.row, unit.col, r, c) <= unit.speed) {
            if (grid[r][c].terrain === 'mountain') continue
            if (grid[r][c].terrain === 'river' && unit.type !== 'cavalry') continue
            if (units.some((u) => u.hp > 0 && u.row === r && u.col === c && u.id !== unit.id)) continue
            moves.push({ row: r, col: c })
          }
        }
      }
      return moves
    },
    [gridSize, grid, units],
  )

  // Get valid attacks for selected unit
  const getValidAttacks = useCallback(
    (unit: Unit): Unit[] => {
      return enemyUnits.filter(
        (e) => dist(unit.row, unit.col, e.row, e.col) <= unit.range,
      )
    },
    [enemyUnits],
  )

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isPaused || gameOver || phase === 'enemyTurn' || phase === 'done') return

      if (phase === 'select') {
        // Select a player unit
        const unit = playerUnits.find((u) => u.row === row && u.col === col && !movedUnits.has(u.id))
        if (unit) {
          setSelectedUnit(unit.id)
          setPhase('move')
          addLog(`Selected ${unit.type} at (${row},${col})`)
        }
        return
      }

      if (phase === 'move' && selectedUnitData) {
        const validMoves = getValidMoves(selectedUnitData)
        const isValidMove = validMoves.some((m) => m.row === row && m.col === col)

        if (isValidMove) {
          setUnits((prev) =>
            prev.map((u) =>
              u.id === selectedUnitData.id ? { ...u, row, col } : u,
            ),
          )
          setMovedUnits((prev) => new Set([...prev, selectedUnitData.id]))
          addLog(`Moved ${selectedUnitData.type} to (${row},${col})`)

          // Check flag capture
          if (grid[row][col].hasFlag && grid[row][col].flagTeam !== 'player') {
            setCapturedFlags((f) => f + 1)
            grid[row][col].flagTeam = 'player'
            addLog('🚩 Flag captured!')
          }

          setPhase('attack')
        } else {
          // Deselect
          setSelectedUnit(null)
          setPhase('select')
        }
        return
      }

      if (phase === 'attack' && selectedUnitData) {
        const target = enemyUnits.find((e) => e.row === row && e.col === col)
        const updatedUnit = units.find((u) => u.id === selectedUnitData.id)!
        if (target && dist(updatedUnit.row, updatedUnit.col, target.row, target.col) <= updatedUnit.range) {
          // Attack
          const damage = updatedUnit.attack + Math.floor(Math.random() * 2)
          const newHp = Math.max(0, target.hp - damage)
          setUnits((prev) =>
            prev.map((u) => (u.id === target.id ? { ...u, hp: newHp } : u)),
          )
          setAttackedUnits((prev) => new Set([...prev, updatedUnit.id]))
          addLog(`${updatedUnit.type} attacks ${target.type} for ${damage} dmg!`)
          if (newHp <= 0) {
            setEnemiesDefeated((d) => d + 1)
            addLog(`💀 Enemy ${target.type} defeated!`)
          }
        }
        // End unit's turn
        setSelectedUnit(null)
        setPhase('select')
      }
    },
    [isPaused, gameOver, phase, playerUnits, selectedUnitData, movedUnits, getValidMoves, enemyUnits, units, grid, addLog],
  )

  const handleEndTurn = useCallback(() => {
    if (isPaused || gameOver) return
    setPhase('enemyTurn')

    // Simple AI
    const newUnits = [...units]
    const liveEnemies = newUnits.filter((u) => u.team === 'enemy' && u.hp > 0)
    const livePlayers = newUnits.filter((u) => u.team === 'player' && u.hp > 0)

    for (const enemy of liveEnemies) {
      // Try to attack first
      const targetsInRange = livePlayers.filter(
        (p) => dist(enemy.row, enemy.col, p.row, p.col) <= enemy.range && p.hp > 0,
      )
      if (targetsInRange.length > 0) {
        const target = targetsInRange[0]
        const damage = enemy.attack + Math.floor(Math.random() * 2)
        target.hp = Math.max(0, target.hp - damage)
        addLog(`Enemy ${enemy.type} attacks your ${target.type} for ${damage} dmg!`)
        if (target.hp <= 0) addLog(`💀 Your ${target.type} was defeated!`)
        continue
      }

      // Move toward closest player
      if (livePlayers.length > 0) {
        let closest = livePlayers[0]
        let closestDist = dist(enemy.row, enemy.col, closest.row, closest.col)
        for (const p of livePlayers) {
          const d = dist(enemy.row, enemy.col, p.row, p.col)
          if (d < closestDist) {
            closest = p
            closestDist = d
          }
        }

        // Move one step toward closest
        let bestR = enemy.row
        let bestC = enemy.col
        let bestD = closestDist
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = enemy.row + dr
          const nc = enemy.col + dc
          if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) continue
          if (grid[nr][nc].terrain === 'mountain') continue
          if (newUnits.some((u) => u.hp > 0 && u.row === nr && u.col === nc && u.id !== enemy.id)) continue
          const d = dist(nr, nc, closest.row, closest.col)
          if (d < bestD) {
            bestD = d
            bestR = nr
            bestC = nc
          }
        }
        enemy.row = bestR
        enemy.col = bestC
      }
    }

    setUnits([...newUnits])

    // Check end conditions
    const remainingPlayers = newUnits.filter((u) => u.team === 'player' && u.hp > 0)
    const remainingEnemies = newUnits.filter((u) => u.team === 'enemy' && u.hp > 0)
    const newTurn = turn + 1

    if (remainingPlayers.length === 0 || newTurn > maxTurns || remainingEnemies.length === 0) {
      // Game over
      const objScore = capturedFlags * 20
      const killScore = enemiesDefeated * 10
      const surviveScore = remainingPlayers.length * 5
      const finalScore = Math.min(100, objScore + killScore + surviveScore) * multiplier
      setGameOver(true)
      setPhase('done')
      onScoreUpdate(Math.round(finalScore), maxScore)
      onGameOver(Math.round(finalScore), maxScore)
      addLog(remainingEnemies.length === 0 ? '🏆 Victory!' : newTurn > maxTurns ? '⏰ Time\'s up!' : '💀 Defeat!')
    } else {
      setTurn(newTurn)
      setMovedUnits(new Set())
      setAttackedUnits(new Set())
      setPhase('select')
      addLog(`Turn ${newTurn} — Your move!`)
    }
  }, [isPaused, gameOver, units, turn, maxTurns, capturedFlags, enemiesDefeated, multiplier, maxScore, onScoreUpdate, onGameOver, gridSize, grid, addLog])

  const handleSkipAttack = useCallback(() => {
    setSelectedUnit(null)
    setPhase('select')
  }, [])

  // Compute highlights
  const validMoves = selectedUnitData && phase === 'move' ? getValidMoves(selectedUnitData) : []
  const validAttacks = selectedUnitData && phase === 'attack'
    ? getValidAttacks(units.find((u) => u.id === selectedUnitData.id)!)
    : []

  const getCellBg = (terrain: Terrain) => {
    switch (terrain) {
      case 'plain': return 'bg-emerald-900/20'
      case 'mountain': return 'bg-stone-700/40'
      case 'river': return 'bg-blue-700/30'
    }
  }

  const getTerrainIcon = (terrain: Terrain) => {
    switch (terrain) {
      case 'mountain': return <Mountain className="h-3 w-3 text-stone-400/50" />
      case 'river': return <Waves className="h-3 w-3 text-blue-400/50" />
      default: return null
    }
  }

  const cellSize = gridSize <= 8 ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-8 w-8 sm:h-10 sm:w-10'

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
      {/* HUD */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <Target className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-white/60">Turn: <span className="font-bold text-white">{turn}/{maxTurns}</span></span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <Flag className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-white/60">Flags: <span className="font-bold text-cyan-300">{capturedFlags}</span></span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <Swords className="h-3.5 w-3.5 text-red-400" />
          <span className="text-white/60">Kills: <span className="font-bold text-red-300">{enemiesDefeated}</span></span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <Shield className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-white/60">Alive: <span className="font-bold text-emerald-300">{playerUnits.length}</span></span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-auto rounded-xl border border-white/10 bg-black/30 p-2">
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const unitHere = units.find((u) => u.hp > 0 && u.row === r && u.col === c)
              const isHighlightMove = validMoves.some((m) => m.row === r && m.col === c)
              const isHighlightAttack = validAttacks.some((u) => u.row === r && u.col === c)
              const isSelected = selectedUnitData && selectedUnitData.row === r && selectedUnitData.col === c

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={cn(
                    cellSize,
                    'relative flex items-center justify-center rounded border text-xs font-bold transition-all',
                    getCellBg(cell.terrain),
                    isSelected && 'border-yellow-400/60 ring-1 ring-yellow-400/40',
                    isHighlightMove && !unitHere && 'border-cyan-400/40 bg-cyan-500/15',
                    isHighlightAttack && 'border-red-400/40 bg-red-500/20',
                    !isSelected && !isHighlightMove && !isHighlightAttack && 'border-white/5',
                  )}
                >
                  {getTerrainIcon(cell.terrain)}
                  {cell.hasFlag && !unitHere && (
                    <Flag className={cn('h-3.5 w-3.5', cell.flagTeam === 'player' ? 'text-cyan-400' : cell.flagTeam === 'enemy' ? 'text-red-400' : 'text-amber-400')} />
                  )}
                  {unitHere && (
                    <span
                      className={cn(
                        'text-sm',
                        unitHere.team === 'player' ? 'drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]' : 'drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]',
                      )}
                    >
                      {UNIT_STATS[unitHere.type].symbol}
                    </span>
                  )}
                  {unitHere && unitHere.hp < unitHere.maxHp && (
                    <div className="absolute -bottom-0.5 left-0.5 right-0.5 h-1 overflow-hidden rounded-full bg-black/50">
                      <div
                        className={cn('h-full rounded-full', unitHere.team === 'player' ? 'bg-cyan-400' : 'bg-red-400')}
                        style={{ width: `${(unitHere.hp / unitHere.maxHp) * 100}%` }}
                      />
                    </div>
                  )}
                </button>
              )
            }),
          )}
        </div>
      </div>

      {/* Controls */}
      {!gameOver && (
        <div className="flex gap-3">
          {phase === 'attack' && (
            <button
              onClick={handleSkipAttack}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition-all hover:bg-white/10"
            >
              Skip Attack
            </button>
          )}
          <button
            onClick={handleEndTurn}
            disabled={phase === 'enemyTurn'}
            className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-xs font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            End Turn
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Log */}
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/30">Battle Log</p>
        <div className="flex flex-col gap-0.5">
          {log.map((msg, i) => (
            <p key={i} className={cn('text-xs', i === 0 ? 'text-white/70' : 'text-white/30')}>
              {msg}
            </p>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] text-white/30">
        <span>⚔ Infantry</span>
        <span>🐴 Cavalry</span>
        <span>🏹 Archer</span>
        <span className="flex items-center gap-1"><Mountain className="h-3 w-3" /> Mountain</span>
        <span className="flex items-center gap-1"><Waves className="h-3 w-3" /> River</span>
        <span className="flex items-center gap-1"><Flag className="h-3 w-3" /> Flag</span>
      </div>
    </div>
  )
}
