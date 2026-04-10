'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | ''
type Board = PieceType[][]

interface Puzzle {
  board: Board
  solution: [number, number, number, number][] // [fromRow, fromCol, toRow, toCol]
  theme: string
  description: string
}

interface ChessTacticsProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Chess Constants ──────────────────────────────────────────

const PIECE_SYMBOLS: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
}

const TOTAL_PUZZLES = 5
const TIME_PER_PUZZLE = 60 // seconds

function isWhite(piece: PieceType): boolean {
  return piece !== '' && piece === piece.toUpperCase()
}



// ─── Puzzle Data ──────────────────────────────────────────────

function parseFEN(rows: string[]): Board {
  return rows.map((row) => {
    const cells: PieceType[] = []
    for (const ch of row) {
      const num = parseInt(ch)
      if (!isNaN(num)) {
        for (let i = 0; i < num; i++) cells.push('')
      } else {
        cells.push(ch as PieceType)
      }
    }
    while (cells.length < 8) cells.push('')
    return cells
  })
}

const EASY_PUZZLES: Puzzle[] = [
  {
    board: parseFEN(['4k3', '8', '8', '8', '8', '8', '4R3', '4K3']),
    solution: [[6, 4, 0, 4]],
    theme: 'Back Rank Mate',
    description: 'Deliver checkmate in one move with the rook.',
  },
  {
    board: parseFEN(['6k1', '5ppp', '8', '8', '8', '8', '4Q3', '4K3']),
    solution: [[6, 4, 1, 7]],
    theme: 'Queen Mate',
    description: 'Find the mating move with the queen.',
  },
  {
    board: parseFEN(['5rk1', '5p1p', '8', '8', '8', '8', '6Q1', '6K1']),
    solution: [[6, 6, 1, 6]],
    theme: 'Corridor Mate',
    description: 'Use the queen to deliver mate along the 7th rank.',
  },
  {
    board: parseFEN(['r1b2k1r', 'pppp1Npp', '8', '8', '8', '8', 'PPPPPPPP', 'RNBQKB1R']),
    solution: [[1, 5, 0, 7]],
    theme: 'Smothered Mate',
    description: 'The knight delivers a smothered checkmate!',
  },
  {
    board: parseFEN(['rnb1k2r', 'pppp1ppp', '5n2', '4p3', '2B1P3', '8', 'PPPP1PPP', 'RNBQK2R']),
    solution: [[7, 3, 3, 7]],
    theme: "Scholar's Mate",
    description: 'Deliver checkmate with the queen on f7.',
  },
  {
    board: parseFEN(['3qk3', '8', '8', '8', '3Q4', '8', '8', '3QK3']),
    solution: [[4, 3, 0, 7]],
    theme: 'Queen Checkmate',
    description: 'Use the queen to deliver a swift checkmate.',
  },
  {
    board: parseFEN(['6k1', '8', '6K1', '8', '8', '8', '8', 'R7']),
    solution: [[7, 0, 0, 0]],
    theme: 'Rook Mate',
    description: 'Deliver checkmate with the rook.',
  },
  {
    board: parseFEN(['2k5', '8', '1QK5', '8', '8', '8', '8', '8']),
    solution: [[2, 1, 1, 1]],
    theme: 'Queen Ladder',
    description: 'Push the king to the edge and mate.',
  },
  {
    board: parseFEN(['4k3', '4P3', '4K3', '8', '8', '8', '8', '4R3']),
    solution: [[7, 4, 0, 4]],
    theme: 'Rook Support Mate',
    description: 'Use the rook to support the pawn and deliver mate.',
  },
  {
    board: parseFEN(['r3k3', 'pppp1p1p', '4p3', '8', '8', '5N2', 'PPPPPPPP', 'R1BQKB1R']),
    solution: [[5, 5, 3, 6]],
    theme: 'Knight Fork',
    description: 'Fork the king and rook with the knight!',
  },
]

const MEDIUM_PUZZLES: Puzzle[] = [
  {
    board: parseFEN(['r1bqk2r', 'pppp1ppp', '2n2n2', '2b1p3', '2B1P3', '5N2', 'PPPP1PPP', 'RNBQK2R']),
    solution: [[5, 5, 3, 4], [2, 4, 3, 4]],
    theme: 'Pin & Win',
    description: 'Use a two-move combination to win material.',
  },
  {
    board: parseFEN(['r2qk2r', 'ppp2ppp', '2np1n2', '2b1p1B1', '2B1P3', '2NP1N2', 'PPP2PPP', 'R2QK2R']),
    solution: [[3, 6, 2, 5], [2, 3, 3, 5]],
    theme: 'Bishop Pin',
    description: 'Pin the knight and win it in two moves.',
  },
  {
    board: parseFEN(['r1bq1rk1', 'ppppnppp', '8', '8', '8', '5N2', 'PPPPQPPP', 'RNB1KB1R']),
    solution: [[5, 5, 3, 6], [6, 4, 0, 4]],
    theme: 'Discovered Attack',
    description: 'Move the knight to reveal a queen attack.',
  },
  {
    board: parseFEN(['r3k2r', 'ppp2ppp', '2n5', '3pN3', '2B5', '8', 'PPP2PPP', 'R3K2R']),
    solution: [[4, 2, 2, 4], [3, 4, 1, 2]],
    theme: 'Double Attack',
    description: 'Create a double attack with bishop and knight.',
  },
  {
    board: parseFEN(['2kr4', 'ppp2ppp', '8', '3n4', '3N4', '8', 'PPP2PPP', '2KR4']),
    solution: [[4, 3, 2, 2], [7, 3, 0, 3]],
    theme: 'Knight Sacrifice',
    description: 'Sacrifice the knight to open the d-file for the rook.',
  },
  {
    board: parseFEN(['r1bqkbnr', 'pppp1ppp', '2n5', '4N3', '8', '8', 'PPPPPPPP', 'RNBQKB1R']),
    solution: [[3, 4, 1, 5], [7, 3, 3, 7]],
    theme: 'Royal Fork Setup',
    description: 'Set up and execute a devastating fork.',
  },
  {
    board: parseFEN(['rnbqkb1r', 'pppppppp', '5n2', '8', '4P3', '8', 'PPPP1PPP', 'RNBQKBNR']),
    solution: [[4, 4, 3, 4], [3, 4, 2, 5]],
    theme: 'Pawn Push Attack',
    description: 'Advance the pawn to attack the knight, then capture.',
  },
  {
    board: parseFEN(['r2q1rk1', 'ppp1bppp', '2np1n2', '4p3', '2B1P3', '2NP1N2', 'PPP2PPP', 'R1BQ1RK1']),
    solution: [[5, 5, 3, 4], [4, 2, 3, 4]],
    theme: 'Central Control',
    description: 'Gain central control with a knight sacrifice.',
  },
  {
    board: parseFEN(['r1bq1rk1', 'pppp1ppp', '2n2n2', '4p3', '1b2P3', '2N2N2', 'PPPP1PPP', 'R1BQKB1R']),
    solution: [[5, 2, 3, 1], [5, 5, 3, 4]],
    theme: 'Counter Play',
    description: 'Find the two-move counter attack.',
  },
  {
    board: parseFEN(['2rr2k1', 'pp3ppp', '8', '3N4', '8', '8', 'PP3PPP', '3RR1K1']),
    solution: [[3, 3, 1, 2], [7, 3, 0, 3]],
    theme: 'Knight & Rook Combo',
    description: 'Use the knight to clear the way for a rook invasion.',
  },
]

const HARD_PUZZLES: Puzzle[] = [
  {
    board: parseFEN(['r2qr1k1', '1b3ppp', 'p1n1p3', '1p6', '3P4', 'P1NBPN2', '1PQ2PPP', 'R4RK1']),
    solution: [[5, 3, 3, 4], [5, 5, 3, 6], [6, 2, 2, 6]],
    theme: 'Complex Combination',
    description: 'Find the 3-move combination to win material.',
  },
  {
    board: parseFEN(['r1b2rk1', 'pp3ppp', '2n1pn2', 'q1Bp4', '3PP3', '2N2N2', 'PP3PPP', 'R2Q1RK1']),
    solution: [[4, 4, 3, 4], [5, 5, 3, 4], [5, 2, 4, 4]],
    theme: 'Center Explosion',
    description: 'Break open the center with a 3-move tactical sequence.',
  },
  {
    board: parseFEN(['r3kb1r', 'pp1q1ppp', '2n1pn2', '3p2B1', '2PP4', '2N1PN2', 'PP3PPP', 'R2QKB1R']),
    solution: [[3, 6, 2, 5], [4, 3, 3, 4], [5, 2, 3, 4]],
    theme: 'Piece Coordination',
    description: 'Coordinate your pieces for a winning attack.',
  },
  {
    board: parseFEN(['r4rk1', 'pp2qppp', '2pbpn2', '8', '2BPP3', '2N2N2', 'PP2QPPP', 'R4RK1']),
    solution: [[4, 4, 3, 4], [4, 2, 2, 4], [5, 5, 3, 4]],
    theme: 'Positional Sacrifice',
    description: 'Sacrifice a pawn for a dominant position.',
  },
  {
    board: parseFEN(['2r1r1k1', 'pp1n1ppp', '2p1p3', '3pP3', '2PP1B2', '2N5', 'PP3PPP', 'R2R2K1']),
    solution: [[4, 3, 3, 4], [4, 4, 3, 5], [5, 2, 3, 4]],
    theme: 'Pawn Break',
    description: 'Execute the right pawn break sequence.',
  },
  {
    board: parseFEN(['r1bq1rk1', 'pp2ppbp', '2np1np1', '8', '2B1P3', '2NP1N2', 'PPP1BPPP', 'R2Q1RK1']),
    solution: [[5, 5, 3, 4], [4, 2, 2, 4], [5, 2, 3, 1]],
    theme: 'Giuoco Piano Attack',
    description: 'Launch a classical attacking combination.',
  },
  {
    board: parseFEN(['r2qkb1r', 'pp2pppp', '2n2n2', '3p1bB1', '3PP3', '2N5', 'PPP2PPP', 'R2QKBNR']),
    solution: [[3, 6, 2, 5], [4, 4, 3, 4], [5, 2, 3, 3]],
    theme: 'Exchange Combination',
    description: 'Win material through a series of exchanges.',
  },
  {
    board: parseFEN(['rnbqk2r', 'pppp1ppp', '5n2', '4p3', '1bB1P3', '2N2N2', 'PPPP1PPP', 'R1BQK2R']),
    solution: [[5, 5, 3, 4], [4, 2, 3, 5], [5, 2, 4, 4]],
    theme: 'Italian Game Tactic',
    description: 'Execute a winning combination from the Italian opening.',
  },
  {
    board: parseFEN(['r2q1rk1', 'pppbbppp', '2np1n2', '4p3', '2B1P3', '2NP1N2', 'PPP1BPPP', 'R2Q1RK1']),
    solution: [[5, 5, 3, 6], [4, 2, 3, 4], [6, 3, 2, 7]],
    theme: 'Spanish Attack',
    description: 'Find the sharp 3-move attacking plan.',
  },
  {
    board: parseFEN(['r1bqkbnr', 'pppp1ppp', '2n5', '4p3', '3PP3', '2N5', 'PPP2PPP', 'R1BQKBNR']),
    solution: [[4, 4, 3, 4], [4, 3, 3, 4], [5, 2, 3, 3]],
    theme: 'Scotch Opening Tactic',
    description: 'Execute the winning sequence from the Scotch opening.',
  },
]

function getPuzzles(difficulty: GameDifficulty): Puzzle[] {
  let pool: Puzzle[]
  switch (difficulty) {
    case 'easy':
      pool = EASY_PUZZLES
      break
    case 'medium':
      pool = MEDIUM_PUZZLES
      break
    case 'hard':
    case 'extreme':
      pool = HARD_PUZZLES
      break
  }
  // Shuffle and take TOTAL_PUZZLES
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, TOTAL_PUZZLES)
}

function getMultiplier(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 1
    case 'medium': return 1.5
    case 'hard': return 2
    case 'extreme': return 3
  }
}

// ─── Component ────────────────────────────────────────────────

export default function ChessTactics({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: ChessTacticsProps) {
  const puzzles = useMemo(() => getPuzzles(difficulty), [difficulty])
  const multiplier = getMultiplier(difficulty)

  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [board, setBoard] = useState<Board>(() => puzzles[0].board.map((r) => [...r]))
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [moveIndex, setMoveIndex] = useState(0)
  const [results, setResults] = useState<{ solved: boolean; timeBonus: number }[]>([])
  const [timer, setTimer] = useState(TIME_PER_PUZZLE)
  const [puzzleState, setPuzzleState] = useState<'playing' | 'correct' | 'wrong' | 'timeout'>('playing')
  const [gameFinished, setGameFinished] = useState(false)

  const puzzle = puzzles[puzzleIndex]
  const maxScorePerPuzzle = 20
  const maxScore = TOTAL_PUZZLES * maxScorePerPuzzle * multiplier

  // Timer
  useEffect(() => {
    if (isPaused || puzzleState !== 'playing') return
    if (timer <= 0) {
      setPuzzleState('timeout')
      setResults((prev) => [...prev, { solved: false, timeBonus: 0 }])
      return
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, isPaused, puzzleState])

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (isPaused || puzzleState !== 'playing') return

      if (!selectedSquare) {
        // Select a piece
        const piece = board[row][col]
        if (piece && isWhite(piece)) {
          setSelectedSquare([row, col])
        }
        return
      }

      const [fromRow, fromCol] = selectedSquare

      // Check if this move matches the expected solution step
      const expectedMove = puzzle.solution[moveIndex]
      if (
        expectedMove &&
        fromRow === expectedMove[0] &&
        fromCol === expectedMove[1] &&
        row === expectedMove[2] &&
        col === expectedMove[3]
      ) {
        // Correct move
        const newBoard = board.map((r) => [...r])
        newBoard[row][col] = newBoard[fromRow][fromCol]
        newBoard[fromRow][fromCol] = ''
        setBoard(newBoard)
        setSelectedSquare(null)

        const nextMoveIdx = moveIndex + 1
        if (nextMoveIdx >= puzzle.solution.length) {
          // Puzzle solved!
          const timeBonus = Math.round((timer / TIME_PER_PUZZLE) * 10)
          setPuzzleState('correct')
          setResults((prev) => [...prev, { solved: true, timeBonus }])
        } else {
          setMoveIndex(nextMoveIdx)
          // Auto-play opponent response if needed (for multi-move puzzles, the second move might be opponent's)
          // In our simplified model, all moves in solution are player's
        }
      } else {
        // Wrong move
        setPuzzleState('wrong')
        setResults((prev) => [...prev, { solved: false, timeBonus: 0 }])
        setSelectedSquare(null)
      }
    },
    [isPaused, puzzleState, selectedSquare, board, puzzle, moveIndex, timer],
  )

  // Update scores when results change
  useEffect(() => {
    if (results.length === 0) return
    const totalScore = results.reduce((sum, r) => {
      if (r.solved) return sum + (10 + r.timeBonus) * multiplier
      return sum
    }, 0)
    onScoreUpdate(Math.round(totalScore), maxScore)
  }, [results, multiplier, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (puzzleIndex + 1 >= TOTAL_PUZZLES) {
      setGameFinished(true)
      const finalScore = results.reduce((sum, r) => {
        if (r.solved) return sum + (10 + r.timeBonus) * multiplier
        return sum
      }, 0)
      onGameOver(Math.round(finalScore), maxScore)
    } else {
      const newIdx = puzzleIndex + 1
      setPuzzleIndex(newIdx)
      setBoard(puzzles[newIdx].board.map((r) => [...r]))
      setSelectedSquare(null)
      setMoveIndex(0)
      setTimer(TIME_PER_PUZZLE)
      setPuzzleState('playing')
    }
  }, [puzzleIndex, puzzles, results, multiplier, maxScore, onGameOver])

  const currentResult = results[puzzleIndex]
  const solved = results.filter((r) => r.solved).length

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
      {/* Puzzle indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_PUZZLES }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < results.length && results[i]?.solved && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i < results.length && !results[i]?.solved && 'border-red-500/40 bg-red-500/15 text-red-400',
              i === puzzleIndex && !gameFinished && puzzleState === 'playing' && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > puzzleIndex && i >= results.length && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i < results.length ? (
              results[i]?.solved ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>

      {!gameFinished && (
        <>
          {/* Puzzle info & timer */}
          <div className="flex w-full items-center justify-between">
            <div>
              <p className="text-sm font-bold text-violet-300">{puzzle.theme}</p>
              <p className="text-xs text-white/50">{puzzle.description}</p>
              <p className="mt-1 text-[10px] text-cyan-400/60">
                Move {moveIndex + 1} of {puzzle.solution.length}
              </p>
            </div>
            <div className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-bold',
              timer > 20 ? 'border-white/10 text-white/60' : timer > 10 ? 'border-amber-500/30 text-amber-400' : 'border-red-500/30 text-red-400',
            )}>
              <Clock className="h-3.5 w-3.5" />
              {timer}s
            </div>
          </div>

          {/* Chess board */}
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <div className="grid grid-cols-8">
              {board.map((row, r) =>
                row.map((piece, c) => {
                  const isLight = (r + c) % 2 === 0
                  const isSelected = selectedSquare?.[0] === r && selectedSquare?.[1] === c
                  const expectedMove = puzzleState === 'playing' ? puzzle.solution[moveIndex] : undefined
                  const isHintTo = expectedMove && expectedMove[2] === r && expectedMove[3] === c && selectedSquare !== null

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleSquareClick(r, c)}
                      disabled={puzzleState !== 'playing'}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center text-2xl transition-all sm:h-14 sm:w-14 sm:text-3xl',
                        isLight ? 'bg-[#B58863]' : 'bg-[#6D4C3B]',
                        isSelected && 'ring-2 ring-inset ring-yellow-400',
                        isHintTo && 'bg-yellow-500/30',
                      )}
                    >
                      {piece && (
                        <span className={cn(
                          'drop-shadow-sm',
                          isWhite(piece) ? 'text-white' : 'text-gray-900',
                        )}>
                          {PIECE_SYMBOLS[piece]}
                        </span>
                      )}
                    </button>
                  )
                }),
              )}
            </div>
          </div>

          {/* Board coordinates */}
          <div className="flex w-[320px] justify-between px-1 text-[10px] text-white/30 sm:w-[448px]">
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>

          {/* Result overlay */}
          <AnimatePresence>
            {puzzleState !== 'playing' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'w-full rounded-xl border p-4 text-center',
                  puzzleState === 'correct'
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-red-500/30 bg-red-500/10',
                )}
              >
                {puzzleState === 'correct' && (
                  <div>
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
                    <p className="text-sm font-bold text-emerald-300">Correct!</p>
                    <p className="text-xs text-white/50">
                      Time bonus: +{currentResult?.timeBonus ?? 0} pts
                    </p>
                  </div>
                )}
                {puzzleState === 'wrong' && (
                  <div>
                    <XCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
                    <p className="text-sm font-bold text-red-300">Wrong move!</p>
                    <p className="text-xs text-white/50">
                      The correct first move was {String.fromCharCode(97 + puzzle.solution[moveIndex]?.[1])}{8 - puzzle.solution[moveIndex]?.[0]} → {String.fromCharCode(97 + puzzle.solution[moveIndex]?.[2])}{8 - puzzle.solution[moveIndex]?.[3]}
                    </p>
                  </div>
                )}
                {puzzleState === 'timeout' && (
                  <div>
                    <Clock className="mx-auto mb-2 h-8 w-8 text-red-400" />
                    <p className="text-sm font-bold text-red-300">Time&apos;s up!</p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  {puzzleIndex + 1 >= TOTAL_PUZZLES ? 'See Results' : 'Next Puzzle'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solved counter */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Solved: {solved}/{results.length > 0 ? results.length : '—'}
          </div>
        </>
      )}
    </div>
  )
}
