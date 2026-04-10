'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  useCurrentUser,
  useParentMessages,
} from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageCircle,
  Send,
  ArrowLeft,
  User,
  Search,
} from 'lucide-react'

interface Conversation {
  id: string
  teacherName: string
  subject: string
  lastMessage: string
  timestamp: string
  unread: boolean
  thread: Array<{
    id: string
    sender: 'parent' | 'teacher'
    senderName: string
    content: string
    timestamp: string
  }>
}

export function ParentMessages() {
  const { user, profile, loading } = useCurrentUser()
  const { messages: rawMessages, loading: messagesLoading } = useParentMessages(user?.id ?? '')
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const conversations = useMemo<Conversation[]>(() => {
    if (!rawMessages.length || !user) return []
    const convMap = new Map<string, Conversation>()

    for (const msg of rawMessages) {
      const isFromParent = msg.sender_id === user.id
      const teacherId = isFromParent ? msg.receiver_id : msg.sender_id
      const teacherName = isFromParent
        ? msg.receiver?.full_name || 'Teacher'
        : msg.sender?.full_name || 'Teacher'

      if (!convMap.has(teacherId)) {
        convMap.set(teacherId, {
          id: teacherId,
          teacherName,
          subject: msg.subject || 'Conversation',
          lastMessage: msg.content || msg.body || '',
          timestamp: msg.created_at
            ? new Date(msg.created_at).toLocaleDateString()
            : '',
          unread: false,
          thread: [],
        })
      }

      convMap.get(teacherId)!.thread.push({
        id: msg.id,
        sender: isFromParent ? 'parent' : 'teacher',
        senderName: isFromParent
          ? profile?.full_name || 'Parent'
          : teacherName,
        content: msg.content || msg.body || '',
        timestamp: msg.created_at
          ? new Date(msg.created_at).toLocaleString()
          : '',
      })
    }

    for (const conv of convMap.values()) {
      conv.thread.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      const last = conv.thread[conv.thread.length - 1]
      if (last) {
        conv.lastMessage = last.content
        conv.timestamp = last.timestamp
      }
    }

    return Array.from(convMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [rawMessages, user, profile?.full_name])

  const isLoading = loading || messagesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const filteredMessages = conversations.filter(
    (m) =>
      m.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleSend() {
    if (!newMessage.trim()) return
    // In production this would send via Supabase
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text font-heading text-3xl font-bold text-transparent">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Communicate with your child&apos;s teachers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Conversations List */}
        <Card
          className={cn(
            'glass col-span-1 lg:col-span-4',
            selectedConvo && 'hidden lg:block'
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-400" />
              Conversations
            </CardTitle>
            {/* Search */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedConvo(msg)}
                  className={cn(
                    'w-full rounded-xl border border-transparent p-3 text-left transition-all hover:border-purple-500/20 hover:bg-purple-500/5',
                    selectedConvo?.id === msg.id && 'border-purple-500/30 bg-purple-500/10'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/15">
                      <User className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{msg.teacherName}</p>
                        {msg.unread && (
                          <Badge variant="default" className="h-5 text-[10px]">New</Badge>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-300">{msg.subject}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {msg.lastMessage}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{msg.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))}

              {filteredMessages.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No conversations found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Thread View */}
        <Card
          className={cn(
            'glass col-span-1 lg:col-span-8',
            !selectedConvo && 'hidden lg:block'
          )}
        >
          {selectedConvo ? (
            <>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConvo(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4 text-slate-400" />
                  </button>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/15">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>{selectedConvo.teacherName}</CardTitle>
                    <p className="text-xs text-muted-foreground">{selectedConvo.subject}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div className="mb-4 max-h-[400px] space-y-4 overflow-y-auto pr-2">
                  {selectedConvo.thread.map((msg) => {
                    const isParent = msg.sender === 'parent'
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex',
                          isParent ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] rounded-2xl px-4 py-3',
                            isParent
                              ? 'rounded-br-sm bg-purple-500/20 text-purple-100'
                              : 'rounded-bl-sm bg-white/5 text-slate-200'
                          )}
                        >
                          <p className="text-xs font-medium text-muted-foreground">
                            {msg.senderName}
                          </p>
                          <p className="mt-1 text-sm">{msg.content}</p>
                          <p className="mt-2 text-right text-[10px] text-muted-foreground">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Compose */}
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="min-h-[44px] resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white transition-all hover:bg-purple-600 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-full min-h-[400px] items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Select a conversation to view messages
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
