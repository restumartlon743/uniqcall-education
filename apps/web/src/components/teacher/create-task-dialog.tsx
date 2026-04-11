'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ARCHETYPE_OPTIONS = [
  { value: '', label: 'All Students' },
  { value: 'THINKER', label: 'The Thinker' },
  { value: 'ENGINEER', label: 'The Engineer' },
  { value: 'GUARDIAN', label: 'The Guardian' },
  { value: 'STRATEGIST', label: 'The Strategist' },
  { value: 'CREATOR', label: 'The Creator' },
  { value: 'SHAPER', label: 'The Shaper' },
  { value: 'STORYTELLER', label: 'The Storyteller' },
  { value: 'PERFORMER', label: 'The Performer' },
  { value: 'HEALER', label: 'The Healer' },
  { value: 'DIPLOMAT', label: 'The Diplomat' },
  { value: 'EXPLORER', label: 'The Explorer' },
  { value: 'MENTOR', label: 'The Mentor' },
  { value: 'VISIONARY', label: 'The Visionary' },
]

const KNOWLEDGE_FIELDS = [
  { value: 'ALAM', label: 'Ilmu Alam' },
  { value: 'SOSIAL', label: 'Ilmu Sosial' },
  { value: 'HUMANIORA', label: 'Humaniora' },
  { value: 'AGAMA', label: 'Agama' },
  { value: 'SENI', label: 'Seni' },
]

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskType, setTaskType] = useState('individual')
  const [targetArchetype, setTargetArchetype] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [xpReward, setXpReward] = useState('100')
  const [knowledgeField, setKnowledgeField] = useState('ALAM')
  const [varkV, setVarkV] = useState('')
  const [varkA, setVarkA] = useState('')
  const [varkR, setVarkR] = useState('')
  const [varkK, setVarkK] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: will wire to API later
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <DialogClose onClose={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogDescription>
          Create a personalized task for your students. VARK adaptations allow
          the task to be presented differently based on learning styles.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            placeholder="e.g., Research Essay: Scientific Method"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the task objectives and requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Row: Type + Archetype */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="type">Task Type</Label>
            <Select
              id="type"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <SelectOption value="individual">Individual</SelectOption>
              <SelectOption value="group">Group</SelectOption>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="archetype">Target Archetype</Label>
            <Select
              id="archetype"
              value={targetArchetype}
              onChange={(e) => setTargetArchetype(e.target.value)}
            >
              {ARCHETYPE_OPTIONS.map((opt) => (
                <SelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>

        {/* Row: Due Date + XP + Knowledge Field */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="[color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="xp">
              <span className="flex items-center gap-1">
                XP Reward
                <Zap className="h-3 w-3 text-amber-400" />
              </span>
            </Label>
            <Input
              id="xp"
              type="number"
              min="0"
              value={xpReward}
              onChange={(e) => setXpReward(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field">Knowledge Field</Label>
            <Select
              id="field"
              value={knowledgeField}
              onChange={(e) => setKnowledgeField(e.target.value)}
            >
              {KNOWLEDGE_FIELDS.map((f) => (
                <SelectOption key={f.value} value={f.value}>
                  {f.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>

        {/* VARK Adaptations */}
        <div className="space-y-3">
          <Label>VARK Adaptations</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Provide alternative instructions for each learning style.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vark-v" className="text-xs flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-pink-500/20 text-[10px] font-bold text-pink-300">
                  V
                </span>
                Visual
              </Label>
              <Textarea
                id="vark-v"
                placeholder="Instructions for visual learners..."
                value={varkV}
                onChange={(e) => setVarkV(e.target.value)}
                rows={2}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vark-a" className="text-xs flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-[10px] font-bold text-blue-300">
                  A
                </span>
                Auditory
              </Label>
              <Textarea
                id="vark-a"
                placeholder="Instructions for auditory learners..."
                value={varkA}
                onChange={(e) => setVarkA(e.target.value)}
                rows={2}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vark-r" className="text-xs flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                  R
                </span>
                Read/Write
              </Label>
              <Textarea
                id="vark-r"
                placeholder="Instructions for reading/writing learners..."
                value={varkR}
                onChange={(e) => setVarkR(e.target.value)}
                rows={2}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vark-k" className="text-xs flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/20 text-[10px] font-bold text-amber-300">
                  K
                </span>
                Kinesthetic
              </Label>
              <Textarea
                id="vark-k"
                placeholder="Instructions for kinesthetic learners..."
                value={varkK}
                onChange={(e) => setVarkK(e.target.value)}
                rows={2}
                className="min-h-[60px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Create Task
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
