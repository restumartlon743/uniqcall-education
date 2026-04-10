'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser, useTeacherClasses } from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  Copy,
  Check,
  Plus,
  Users,
  Loader2,
  RefreshCw,
  GraduationCap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ClassRow {
  id: string
  name: string
  grade: number | null
  academic_year: string | null
  class_code: string
  schools: { name: string } | null
}

interface CopiedState {
  [key: string]: boolean
}

export function ClassesManager() {
  const { user, loading: userLoading } = useCurrentUser()
  const { classes, loading: classesLoading } = useTeacherClasses(user?.id ?? '')
  const loading = userLoading || classesLoading

  const [copied, setCopied] = useState<CopiedState>({})
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    grade: '',
    academic_year: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
  })

  function copyCode(classId: string, code: string) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied((prev) => ({ ...prev, [classId]: true }))
    setTimeout(() => setCopied((prev) => ({ ...prev, [classId]: false })), 2000)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !user) return

    setCreating(true)
    setCreateError(null)

    const supabase = createClient()
    if (!supabase) {
      setCreateError('Tidak dapat terhubung ke server.')
      setCreating(false)
      return
    }

    // Get teacher's school_id via profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', user.id)
      .single()

    if (!profile?.school_id) {
      setCreateError('Akun guru tidak terhubung ke sekolah. Hubungi admin.')
      setCreating(false)
      return
    }

    const { error } = await supabase.from('classes').insert({
      name: form.name.trim(),
      grade: form.grade ? parseInt(form.grade, 10) : null,
      academic_year: form.academic_year.trim() || null,
      school_id: profile.school_id,
      teacher_id: user.id,
    })

    if (error) {
      setCreateError('Gagal membuat kelas: ' + error.message)
      setCreating(false)
      return
    }

    setForm({ name: '', grade: '', academic_year: form.academic_year })
    setShowCreate(false)
    setCreating(false)
    // Reload page to refresh the list
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelas Saya</h1>
          <p className="text-sm text-white/50 mt-1">
            Bagikan <strong className="text-purple-400">Kode Kelas</strong> ke
            siswa agar mereka bisa bergabung saat registrasi.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Buat Kelas
        </Button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border border-purple-500/30 bg-[#0D1333]">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-400" />
                  Buat Kelas Baru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs text-white/50 mb-1">
                        Nama Kelas <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="cth: 12 IPA 1"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">
                        Tingkat (opsional)
                      </label>
                      <Input
                        type="number"
                        placeholder="cth: 12"
                        min={1}
                        max={12}
                        value={form.grade}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, grade: e.target.value }))
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">
                        Tahun Ajaran
                      </label>
                      <Input
                        placeholder="cth: 2025/2026"
                        value={form.academic_year}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            academic_year: e.target.value,
                          }))
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {createError && (
                    <p className="text-red-400 text-sm">{createError}</p>
                  )}

                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreate(false)}
                      className="text-white/60 hover:text-white"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={creating || !form.name.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {creating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Buat Kelas'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class list */}
      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <BookOpen className="h-12 w-12 text-white/20" />
          <p className="text-white/40 text-sm">
            Belum ada kelas. Buat kelas pertama dan bagikan kode ke siswa.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(classes as ClassRow[]).map((cls) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-white/10 bg-[#0D1333] hover:border-purple-500/40 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-white text-base font-semibold">
                        {cls.name}
                      </CardTitle>
                      <p className="text-xs text-white/40 mt-0.5">
                        {cls.schools?.name ?? '—'}
                        {cls.grade ? ` · Kelas ${cls.grade}` : ''}
                        {cls.academic_year ? ` · ${cls.academic_year}` : ''}
                      </p>
                    </div>
                    <BookOpen className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Class code highlight */}
                  <div className="rounded-lg bg-white/5 border border-purple-500/30 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                      Kode Kelas
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xl font-mono font-bold text-purple-300 tracking-widest">
                        {cls.class_code ?? '——'}
                      </span>
                      <button
                        onClick={() => copyCode(cls.id, cls.class_code)}
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors rounded-md px-2 py-1 bg-white/5 hover:bg-white/10"
                        title="Salin kode"
                      >
                        {copied[cls.id] ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-400" />
                            <span className="text-green-400">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Salin
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-xs text-white/30 flex items-center gap-1.5">
        <RefreshCw className="h-3 w-3" />
        Kode kelas dibuat otomatis saat kelas baru dibuat. Kode hanya bisa
        digunakan saat siswa mendaftar.
      </p>
    </div>
  )
}
