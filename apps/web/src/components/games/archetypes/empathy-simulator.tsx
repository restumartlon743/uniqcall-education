'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Heart,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star,
  MessageCircle,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface ResponseOption {
  text: string
  isEmpathetic: boolean
  feedback: string
}

interface Scenario {
  id: string
  title: string
  perspective: string
  paragraph: string
  options: ResponseOption[]
  difficulty: 'easy' | 'medium' | 'hard'
}

interface EmpathySimulatorProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const ALL_SCENARIOS: Scenario[] = [
  // ── Easy: clear emotional cues ──
  {
    id: 'e1',
    title: 'The New Student',
    perspective: 'You are observing Rania, a new student at school.',
    paragraph:
      'Rania just moved to a new city and started at your school today. At lunch she sits alone, staring at her tray. When someone walks by she looks up hopefully, then looks down again. Her eyes are red and she keeps rubbing them.',
    options: [
      { text: 'She should just talk to people — it\'s not that hard.', isEmpathetic: false, feedback: 'This dismisses the difficulty of being in a completely new environment.' },
      { text: 'Go sit with her and introduce yourself, sharing how you also felt nervous at some point.', isEmpathetic: true, feedback: 'Great! You acknowledged her feelings and offered connection through shared experience.' },
      { text: 'She looks fine, she\'ll figure it out eventually.', isEmpathetic: false, feedback: 'Ignoring visible signs of distress misses an opportunity to help.' },
      { text: 'Tell a teacher to deal with it.', isEmpathetic: false, feedback: 'While involving adults can help, passing responsibility without personal connection lacks empathy.' },
    ],
    difficulty: 'easy',
  },
  {
    id: 'e2',
    title: 'The Failed Test',
    perspective: 'Your friend Arjun just got his math test back.',
    paragraph:
      'Arjun studied all weekend for the math test but got a 45%. He\'s sitting with his head in his hands. When you ask if he\'s okay, he says "I don\'t care" in a shaky voice and stuffs the paper into his bag quickly.',
    options: [
      { text: '"Don\'t worry, it\'s just one test. You\'ll do better next time."', isEmpathetic: false, feedback: 'Minimizing feelings with a quick fix doesn\'t acknowledge his pain.' },
      { text: '"I can see you\'re really upset. Studying so hard and getting that result must feel terrible. Want to talk about it?"', isEmpathetic: true, feedback: 'Excellent — you validated his emotions and offered support without judgment.' },
      { text: '"You probably didn\'t study the right way. I can show you how."', isEmpathetic: false, feedback: 'Jumping to solutions implies he did something wrong.' },
      { text: '"45%? That\'s rough. At least you passed… oh wait."', isEmpathetic: false, feedback: 'Making light of someone\'s distress is hurtful, not helpful.' },
    ],
    difficulty: 'easy',
  },
  {
    id: 'e3',
    title: 'The Injured Athlete',
    perspective: 'You see your teammate Mina after she twisted her ankle.',
    paragraph:
      'Mina was the star runner on your track team. During practice, she slipped and twisted her ankle badly. The doctor says no running for 8 weeks. Mina is sitting on the bench, not talking to anyone, clenching her fists.',
    options: [
      { text: '"At least it\'s not broken! You\'ll be back in no time."', isEmpathetic: false, feedback: 'Comparing to worse outcomes invalidates her current pain.' },
      { text: '"This must be so frustrating for you. Running means a lot to you, and 8 weeks feels like forever. I\'m here for you."', isEmpathetic: true, feedback: 'You acknowledged what running means to her and validated the frustration without trying to fix it.' },
      { text: '"Well, now you have time to focus on schoolwork."', isEmpathetic: false, feedback: 'Redirecting to a silver lining dismisses her grief about something she loves.' },
      { text: 'Avoid her because you don\'t know what to say.', isEmpathetic: false, feedback: 'Avoidance can make someone feel even more isolated.' },
    ],
    difficulty: 'easy',
  },
  {
    id: 'e4',
    title: 'Grandmother\'s Illness',
    perspective: 'Your classmate Daniel just heard about his grandmother.',
    paragraph:
      'Daniel\'s grandmother was just diagnosed with a serious illness. He seems distracted in class, forgetting assignments and staring out the window. When the teacher scolds him for not paying attention, his lip trembles.',
    options: [
      { text: '"Hey, I noticed you seem distracted lately. If something\'s going on, I\'m happy to listen — no pressure."', isEmpathetic: true, feedback: 'Perfect — you opened a door without forcing him to share.' },
      { text: '"You should really pay more attention. The teacher\'s getting annoyed."', isEmpathetic: false, feedback: 'Adding more pressure on someone already struggling is unkind.' },
      { text: '"What\'s your problem lately?"', isEmpathetic: false, feedback: 'This confrontational approach would make anyone shut down.' },
      { text: 'Say nothing and hope he figures it out.', isEmpathetic: false, feedback: 'Sometimes people need someone to notice and care.' },
    ],
    difficulty: 'easy',
  },
  {
    id: 'e5',
    title: 'The Left-Out Friend',
    perspective: 'You notice your friend Chloe at the park.',
    paragraph:
      'Your group of friends planned a hangout at the park. You arrive and see everyone laughing together — except Chloe, who\'s sitting slightly apart, scrolling her phone. She keeps glancing at the group and then quickly looking away.',
    options: [
      { text: 'Walk over to Chloe and invite her to join: "Hey, come join us! We were just about to start a game."', isEmpathetic: true, feedback: 'Actively including someone who feels left out is a powerful empathetic action.' },
      { text: '"She\'ll join when she wants to — she\'s probably just on her phone."', isEmpathetic: false, feedback: 'Assuming someone is fine while they show signs of exclusion misses the cue.' },
      { text: 'Yell from across the park: "Chloe, get over here!"', isEmpathetic: false, feedback: 'Drawing public attention to someone who already feels awkward could embarrass them.' },
      { text: 'Ignore it and join the laughing group.', isEmpathetic: false, feedback: 'Choosing the fun group over someone who\'s struggling deepens their isolation.' },
    ],
    difficulty: 'easy',
  },
  // ── Medium: subtle cues ──
  {
    id: 'm1',
    title: 'The Quiet Overachiever',
    perspective: 'You overhear a conversation with Priya.',
    paragraph:
      'Priya always gets perfect grades and everyone says she\'s lucky. Today she snapped at a classmate who asked to copy her homework, saying "You think this is easy for me?" She immediately apologized and went silent. Later you notice dark circles under her eyes.',
    options: [
      { text: '"Priya, it seems like you\'ve been under a lot of pressure. It\'s okay to not be okay, even when everyone thinks you have it all together."', isEmpathetic: true, feedback: 'You saw past the "perfect" exterior to acknowledge the hidden struggle.' },
      { text: '"Why did you snap at him? That was rude."', isEmpathetic: false, feedback: 'Focusing on the outburst misses the underlying stress.' },
      { text: '"You do make it look easy though!"', isEmpathetic: false, feedback: 'This reinforces the pressure she\'s trying to escape from.' },
      { text: '"Everyone has bad days, don\'t worry about it."', isEmpathetic: false, feedback: 'Generic dismissal doesn\'t address the chronic pressure she feels.' },
    ],
    difficulty: 'medium',
  },
  {
    id: 'm2',
    title: 'The Bully\'s Side',
    perspective: 'You learn more about Marcus, who bullies other kids.',
    paragraph:
      'Marcus has been aggressive at school — pushing kids and making mean comments. You find out his parents are going through a bitter divorce and he\'s been sleeping at his aunt\'s house. Today he\'s sitting alone, throwing rocks at a wall.',
    options: [
      { text: '"He\'s a bully, he deserves to feel bad."', isEmpathetic: false, feedback: 'This fails to recognize that hurt people often hurt people.' },
      { text: '"His behavior is wrong, but he\'s clearly going through a rough time. I could try talking to him — or suggest he talk to the school counselor."', isEmpathetic: true, feedback: 'You held both truths: his behavior is wrong AND he\'s in pain. That\'s mature empathy.' },
      { text: '"That explains it but doesn\'t excuse it."', isEmpathetic: false, feedback: 'While true, this response lacks the compassion step of wanting to help.' },
      { text: 'Report him to get suspended.', isEmpathetic: false, feedback: 'Punishment without understanding the root cause won\'t help anyone.' },
    ],
    difficulty: 'medium',
  },
  {
    id: 'm3',
    title: 'The Reluctant Leader',
    perspective: 'You\'re observing Kai during a group project.',
    paragraph:
      'Kai was chosen as group leader for the science project, but they didn\'t volunteer. During meetings, Kai speaks softly and often pauses mid-sentence. When someone challenges their idea, Kai says "Yeah, you\'re probably right" even when they had a better plan. After the meeting, Kai stays behind, staring at the whiteboard.',
    options: [
      { text: '"Kai, I noticed your idea earlier was actually really good. It can be tough when you\'re put in charge unexpectedly. Want to work through the plan together?"', isEmpathetic: true, feedback: 'You affirmed their value and acknowledged the difficulty of the role without being pushy.' },
      { text: '"You need to be more assertive if you\'re going to lead."', isEmpathetic: false, feedback: 'Telling someone to change their personality isn\'t supportive.' },
      { text: '"If you don\'t want to lead, just say so."', isEmpathetic: false, feedback: 'This puts all the burden on Kai without offering support.' },
      { text: '"Don\'t let people walk over you."', isEmpathetic: false, feedback: 'This sounds like blame rather than support.' },
    ],
    difficulty: 'medium',
  },
  {
    id: 'm4',
    title: 'The Family Expectations',
    perspective: 'Your friend Yuki shares something personal.',
    paragraph:
      'Yuki tells you she wants to study art, but her parents insist she pursue medicine. She laughs and says "Guess I\'ll just be miserable for 10 years, haha." Her smile doesn\'t reach her eyes. She quickly changes the subject to homework.',
    options: [
      { text: '"That sounds really painful — loving art but feeling like you can\'t pursue it. Your feelings about your future matter, Yuki."', isEmpathetic: true, feedback: 'You saw through the humor shield and validated her genuine conflict.' },
      { text: '"Your parents probably know what\'s best for you financially."', isEmpathetic: false, feedback: 'Siding with the pressure source ignores her emotional experience.' },
      { text: '"Just do both! Art as a hobby."', isEmpathetic: false, feedback: 'Oversimplifying her dilemma dismisses how torn she feels.' },
      { text: '"Haha yeah, parents are like that."', isEmpathetic: false, feedback: 'Matching her deflection means nobody addresses the real pain.' },
    ],
    difficulty: 'medium',
  },
  {
    id: 'm5',
    title: 'The Social Media Incident',
    perspective: 'You hear about what happened to Liam online.',
    paragraph:
      'Someone posted an embarrassing photo of Liam at the school dance. It\'s been shared hundreds of times. At school, Liam acts like he doesn\'t care, making jokes about it himself. But you notice he\'s deleted all his social media and keeps checking his phone nervously.',
    options: [
      { text: '"Liam, I know you\'re joking about it, but that must really hurt. If you want to talk — or even just sit together at lunch — I\'m here."', isEmpathetic: true, feedback: 'You saw past the brave face and offered genuine support.' },
      { text: '"It\'s not that bad, everyone will forget about it."', isEmpathetic: false, feedback: 'Minimizing when someone is clearly hurting doesn\'t help.' },
      { text: '"You should report whoever posted it."', isEmpathetic: false, feedback: 'Jumping to action without first acknowledging the emotion misses the empathy step.' },
      { text: 'Share the photo with the caption "LOL he doesn\'t even care."', isEmpathetic: false, feedback: 'This actively harms someone who\'s already vulnerable.' },
    ],
    difficulty: 'medium',
  },
  // ── Hard: conflicting emotions ──
  {
    id: 'h1',
    title: 'The Scholarship Dilemma',
    perspective: 'Your best friend Tomas just got life-changing news.',
    paragraph:
      'Tomas got a full scholarship to a prestigious school — in another country. He\'s excited but also terrified. He says he wants to go but starts crying when talking about leaving his sick mother behind. His dad says he should stay. Tomas asks what you think he should do.',
    options: [
      { text: '"You must feel so torn — this is an amazing opportunity, but leaving your mom must feel impossible. Whatever you decide, it sounds like there\'s no easy answer, and that\'s okay."', isEmpathetic: true, feedback: 'You acknowledged the complexity without pushing him toward either choice. That\'s deep empathy.' },
      { text: '"You have to go! This is a once-in-a-lifetime chance."', isEmpathetic: false, feedback: 'Dismissing his concern about his mother ignores half of his emotional conflict.' },
      { text: '"Stay with your mom. Family comes first."', isEmpathetic: false, feedback: 'This dismisses his excitement and ambition.' },
      { text: '"I don\'t know, that\'s a hard one. Good luck though."', isEmpathetic: false, feedback: 'This avoids engaging with his emotional vulnerability when he reached out for support.' },
    ],
    difficulty: 'hard',
  },
  {
    id: 'h2',
    title: 'The Teacher\'s Grief',
    perspective: 'You notice something different about Ms. Rivera.',
    paragraph:
      'Ms. Rivera, your usually cheerful biology teacher, has been short-tempered for weeks. She gave unfair detention to a student for a minor thing. You overhear another teacher mention Ms. Rivera recently lost her brother. Today she\'s sitting in the empty classroom after school, staring at her desk.',
    options: [
      { text: '"Ms. Rivera, I don\'t know what you\'re going through, but I wanted you to know that your class matters to us. We appreciate you even on hard days."', isEmpathetic: true, feedback: 'You showed care without overstepping boundaries, acknowledging she\'s human too.' },
      { text: '"She shouldn\'t take her personal problems out on us."', isEmpathetic: false, feedback: 'While boundaries matter, this response lacks any compassion for someone grieving.' },
      { text: '"I heard about your brother. Are you okay?"', isEmpathetic: false, feedback: 'Bringing up something overheard is invasive and could make her feel exposed.' },
      { text: '"Maybe she needs to take time off if she can\'t handle it."', isEmpathetic: true, feedback: 'Acknowledging she may need space shows some understanding, though it could come across as dismissive.' },
    ],
    difficulty: 'hard',
  },
  {
    id: 'h3',
    title: 'The Friend\'s Secret',
    perspective: 'Your friend Nadia confides in you.',
    paragraph:
      'Nadia tells you she\'s been feeling hopeless and sometimes doesn\'t want to wake up. She begs you not to tell anyone because "they\'ll make a big deal out of nothing." She seems both relieved to tell you and terrified of what you\'ll do with the information.',
    options: [
      { text: '"Thank you for trusting me with this. I hear how much pain you\'re in, and I care about you too much to keep this to myself. Can we talk to the counselor together? I\'ll be right there with you."', isEmpathetic: true, feedback: 'You honored her trust while prioritizing her safety — the hardest and most empathetic choice.' },
      { text: '"You\'re just stressed, it\'ll pass."', isEmpathetic: false, feedback: 'Dismissing someone\'s mental health crisis is dangerous.' },
      { text: '"I promise I won\'t tell anyone." (and keep the secret)', isEmpathetic: false, feedback: 'Keeping a secret when someone\'s safety is at risk is not empathy — it\'s enabling.' },
      { text: 'Immediately tell everyone to "help."', isEmpathetic: false, feedback: 'Breaking trust without care or plan could make things worse.' },
    ],
    difficulty: 'hard',
  },
  {
    id: 'h4',
    title: 'The Cultural Misunderstanding',
    perspective: 'You witness an incident in the hallway.',
    paragraph:
      'Your friend Amir fasts during Ramadan. A classmate offers him food during lunch, and when Amir declines, the classmate says "What, you think you\'re better than us?" Amir looks hurt but calmly explains his fast. The classmate rolls their eyes and walks away. Both parties seem upset — Amir feels disrespected, and the classmate feels rejected.',
    options: [
      { text: '"I can see both of you are upset. Amir, I\'m sorry that felt disrespectful — your practice matters. And Alex, Amir wasn\'t rejecting you personally. It\'s a religious observance."', isEmpathetic: true, feedback: 'You bridged both perspectives without taking sides — showing empathy for everyone involved.' },
      { text: '"Alex was just trying to be nice. Amir\'s overreacting."', isEmpathetic: false, feedback: 'Invalidating cultural/religious feelings is not empathetic.' },
      { text: '"People need to learn about other cultures."', isEmpathetic: false, feedback: 'While true, lecturing doesn\'t address the immediate emotions.' },
      { text: '"Just forget about it, it\'s not a big deal."', isEmpathetic: false, feedback: 'Cultural misunderstandings are a big deal when they affect someone\'s dignity.' },
    ],
    difficulty: 'hard',
  },
  {
    id: 'h5',
    title: 'The Jealous Best Friend',
    perspective: 'Your best friend Suki reacts to your good news.',
    paragraph:
      'You got the lead role in the school play — the role Suki also auditioned for. Suki says "Congratulations" with a tight smile, then makes an excuse to leave. Over the next few days, she cancels plans and gives short replies. You feel happy about the role but heartbroken about potentially losing your friendship.',
    options: [
      { text: '"I know this is awkward and I can tell it\'s affecting us. I\'d feel hurt too if the roles were reversed. Our friendship means more to me than any play. Can we talk about it honestly?"', isEmpathetic: true, feedback: 'You acknowledged both your own and Suki\'s conflicting emotions, putting the relationship first.' },
      { text: '"She should be happy for me. That\'s what friends do."', isEmpathetic: false, feedback: 'Expecting perfect emotional responses ignores the reality of disappointment.' },
      { text: '"I\'ll just not mention the play around her."', isEmpathetic: false, feedback: 'Avoidance doesn\'t address the growing distance.' },
      { text: '"Maybe I should give up the role so she\'s not upset."', isEmpathetic: false, feedback: 'Self-sacrifice isn\'t empathy — it\'s people-pleasing that helps nobody.' },
    ],
    difficulty: 'hard',
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { count: 5, pool: ['easy'] as const }
    case 'medium':
      return { count: 5, pool: ['easy', 'medium'] as const }
    case 'hard':
    case 'extreme':
      return { count: 6, pool: ['easy', 'medium', 'hard'] as const }
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Component ────────────────────────────────────────────────

export default function EmpathySimulator({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: EmpathySimulatorProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const scenarios = useMemo(() => {
    const pool = ALL_SCENARIOS.filter((s) => (config.pool as readonly string[]).includes(s.difficulty))
    return shuffle(pool).slice(0, config.count)
  }, [config])

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const current = scenarios[index]
  const maxScore = scenarios.length

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (isPaused || selected !== null) return
      setSelected(optIdx)
      const isCorrect = current.options[optIdx].isEmpathetic
      const newResults = [...results, isCorrect]
      setResults(newResults)
      const score = newResults.filter(Boolean).length
      onScoreUpdate(score, maxScore)
    },
    [isPaused, selected, current, results, maxScore, onScoreUpdate],
  )

  const handleNext = useCallback(() => {
    if (index + 1 >= scenarios.length) {
      setFinished(true)
      const final = results.filter(Boolean).length
      onGameOver(final, maxScore)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }, [index, scenarios.length, results, maxScore, onGameOver])

  const empathyCount = results.filter(Boolean).length

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Progress indicators */}
      <div className="flex items-center gap-2">
        {scenarios.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < index && results[i] && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i < index && !results[i] && 'border-red-500/40 bg-red-500/15 text-red-400',
              i === index && !finished && 'border-pink-500/50 bg-pink-500/15 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
              i > index && 'border-white/10 bg-white/5 text-white/20',
              i === index && finished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < results.length ? (
              results[i] ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>

      {/* Empathy accuracy bar */}
      <div className="flex w-full items-center gap-3 rounded-lg border border-pink-500/20 bg-pink-500/5 px-4 py-2">
        <Heart className="h-4 w-4 text-pink-400" />
        <span className="text-xs text-white/60">Empathy Accuracy:</span>
        <div className="flex-1 rounded-full bg-white/10 h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400"
            initial={{ width: 0 }}
            animate={{ width: results.length > 0 ? `${(empathyCount / results.length) * 100}%` : '0%' }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs font-bold text-pink-300">
          {results.length > 0 ? Math.round((empathyCount / results.length) * 100) : 0}%
        </span>
      </div>

      {finished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Session Complete!</p>
          <p className="text-sm text-white/60">
            Empathetic responses: {empathyCount} / {maxScore}
          </p>
          <p className="text-xs text-white/40">
            Accuracy: {Math.round((empathyCount / maxScore) * 100)}%
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Scenario card */}
            <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-pink-300">
                <MessageCircle className="h-4 w-4" />
                {current.title}
              </div>
              <p className="mt-1 text-xs italic text-white/40">{current.perspective}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{current.paragraph}</p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                How would you respond?
              </p>
              {current.options.map((opt, oi) => {
                const isChosen = selected === oi
                const revealed = selected !== null
                const isCorrect = opt.isEmpathetic
                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(oi)}
                    disabled={revealed}
                    className={cn(
                      'rounded-xl border p-4 text-left text-sm transition-all',
                      !revealed && 'border-white/10 bg-white/5 hover:border-pink-500/30 hover:bg-pink-500/5',
                      revealed && isChosen && isCorrect && 'border-emerald-500/40 bg-emerald-500/10',
                      revealed && isChosen && !isCorrect && 'border-red-500/40 bg-red-500/10',
                      revealed && !isChosen && isCorrect && 'border-emerald-500/20 bg-emerald-500/5',
                      revealed && !isChosen && !isCorrect && 'border-white/5 bg-white/3 opacity-50',
                    )}
                  >
                    <span className="text-white/80">{opt.text}</span>
                    {revealed && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={cn(
                          'mt-2 text-xs',
                          isCorrect ? 'text-emerald-300' : 'text-white/40',
                        )}
                      >
                        {isChosen || isCorrect ? opt.feedback : ''}
                      </motion.p>
                    )}
                  </button>
                )
              })}
            </div>

            {selected !== null && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all hover:bg-pink-500"
              >
                {index + 1 >= scenarios.length ? 'Finish' : 'Next Scenario'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
