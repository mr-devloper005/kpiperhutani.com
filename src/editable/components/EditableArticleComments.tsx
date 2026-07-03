'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-16 border-t border-[var(--tk-line)] pt-12">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-5 w-5 text-[var(--tk-text)]" />
        <span className="editable-mono text-[var(--tk-muted)]">Comments · {all.length}</span>
      </div>

      <form onSubmit={submit} className="mt-6 rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="h-12 w-full rounded-[10px] border border-[var(--editable-border-strong)] bg-transparent px-4 text-[0.9375rem] text-[var(--tk-text)] outline-none transition placeholder:text-[var(--tk-muted)] focus:border-[var(--tk-text)]"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share your thoughts…"
          rows={3}
          maxLength={1500}
          className="mt-3 w-full resize-y rounded-[10px] border border-[var(--editable-border-strong)] bg-transparent px-4 py-3 text-[0.9375rem] leading-[1.55] text-[var(--tk-text)] outline-none transition placeholder:text-[var(--tk-muted)] focus:border-[var(--tk-text)]"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-[0.9375rem] font-medium text-[var(--tk-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Post comment
          </button>
        </div>
      </form>

      <div className="mt-6 divide-y divide-[var(--tk-line)] border-y border-[var(--tk-line)]">
        {all.map((comment) => (
          <div key={comment.id} className="py-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[0.9375rem] font-medium">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="editable-serif truncate text-[1.125rem] leading-[1.2] tracking-[-0.005em]">
                  {comment.name || 'Guest'}
                </p>
                {comment.createdAt ? (
                  <p className="editable-mono text-[var(--tk-muted)]">{timeAgo(comment.createdAt)}</p>
                ) : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-[1rem] leading-[1.6] text-[var(--tk-text)]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? (
          <p className="py-6 text-[0.9375rem] text-[var(--tk-muted)]">Be the first to comment.</p>
        ) : null}
      </div>
    </section>
  )
}
