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
import { Zap, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacherId: string
  classes: { id: string; name: string }[]
  onCreated?: () => void
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

export function CreateTaskDialog({ open, onOpenChange, teacherId, classes, onCreated }: CreateTaskDialogProps) {
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
  const [classId, setClassId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !classId) return
    setSaving(true)
    setSaveError(null)

    const supabase = createClient()
    if (!supabase) {
      setSaveError('Cannot connect to server.')
      setSaving(false)
      return
    }

    const varkAdaptations = (varkV || varkA || varkR || varkK)
      ? { V: varkV, A: varkA, R: varkR, K: varkK }
      : null

    const { error } = await supabase.from('tasks').insert({
      teacher_id: teacherId,
      class_id: classId,
      title: title.trim(),
      description: description.trim() || null,
      task_type: taskType,
      target_archetype: targetArchetype || null,
      vark_adaptations: varkAdaptations,
      due_date: dueDate || null,
      xp_reward: parseInt(xpReward, 10) || 20,
      knowledge_field: knowledgeField || null,
    })

    if (error) {
      setSaveError('Failed to create task: ' + error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setTitle('')
    setDescription('')
    setTaskType('individual')
    setTargetArchetype('')
    setDueDate('')
    setXpReward('100')
    setKnowledgeField('ALAM')
    setVarkV('')
    setVarkA('')
    setVarkR('')
    setVarkK('')
    setClassId('')
    onOpenChange(false)
    onCreated?.()
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

        {/* Class */}
        <div className="space-y-2">
          <Label htmlFor="task-class">Class</Label>
          <Select
            id="task-class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <SelectOption value="">Select class</SelectOption>
            {classes.map((c) => (
              <SelectOption key={c.id} value={c.id}>
                {c.name}
              </SelectOption>
            ))}
          </Select>
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

        {saveError && (
          <p className="text-sm text-red-400">{saveError}</p>
        )}

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
            disabled={saving || !title.trim() || !classId}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
