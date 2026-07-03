'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, CheckCircle2, FileText, Image as ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getTaskTheme } from '@/editable/theme/task-themes'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: Bookmark,
}

const fieldClass =
  'rounded-[10px] border border-[var(--editable-border-strong)] bg-transparent px-4 py-3 text-[0.9375rem] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? getTaskTheme(activeTask.key).kicker : 'entry'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-16 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24`}>
            <EditableReveal index={0}>
              <div className="flex aspect-[4/5] max-w-md items-center justify-center rounded-[16px] bg-[var(--slot4-page-text)] text-[var(--slot4-on-accent)]">
                <Lock className="h-16 w-16 opacity-80" />
              </div>
            </EditableReveal>
            <div>
              <EditableReveal index={1}>
                <span className="editable-mono text-[var(--slot4-muted-text)]">{pagesContent.create.locked.badge}</span>
              </EditableReveal>
              <EditableReveal index={2}>
                <h1 className="editable-serif mt-6 text-[3rem] leading-[1.05] tracking-[-0.015em] sm:text-[4rem] lg:text-[5rem]">
                  {pagesContent.create.locked.title}
                </h1>
              </EditableReveal>
              <EditableReveal index={3}>
                <p className="mt-6 max-w-xl text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.locked.description}
                </p>
              </EditableReveal>
              <EditableReveal index={4}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Get started
                  </Link>
                </div>
              </EditableReveal>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pb-16 pt-14 sm:pt-20`}>
          <EditableReveal index={0}>
            <span className="editable-mono text-[var(--slot4-muted-text)]">{pagesContent.create.hero.badge}</span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-serif mt-6 max-w-4xl text-[3rem] leading-[1.05] tracking-[-0.015em] sm:text-[4rem] lg:text-[5rem]">
              {pagesContent.create.hero.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]">
              {pagesContent.create.hero.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} grid gap-14 border-t border-[var(--editable-border)] pb-24 pt-16 lg:grid-cols-[0.85fr_1.15fr]`}>
          <aside>
            <EditableReveal index={0}>
              <span className="editable-mono text-[var(--slot4-muted-text)]">Choose a shelf</span>
            </EditableReveal>
            <div className="mt-6 grid gap-3">
              {enabledTasks.map((item, i) => {
                const Icon = taskIcon[item.key] || FileText
                const active = item.key === task
                const themeKicker = getTaskTheme(item.key).kicker
                return (
                  <EditableReveal key={item.key} index={i + 1}>
                    <button
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`flex w-full items-start gap-4 rounded-[12px] border p-5 text-left transition ${
                        active
                          ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-[var(--slot4-on-accent)]'
                          : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] hover:border-[var(--editable-border-strong)]'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                          active ? 'border-[var(--slot4-on-accent)]/40' : 'border-[var(--editable-border-strong)]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="editable-mono">{themeKicker}</span>
                        <p
                          className={`mt-2 text-[0.9375rem] leading-[1.5] ${
                            active ? 'text-[var(--slot4-on-accent)]/70' : 'text-[var(--slot4-muted-text)]'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </button>
                  </EditableReveal>
                )
              })}
            </div>
          </aside>

          <EditableReveal index={4}>
            <form onSubmit={submit} className="rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="editable-mono text-[var(--slot4-muted-text)]">
                    Submit a {activeLabel.toLowerCase()} entry
                  </span>
                  <h2 className="editable-serif mt-3 text-[1.75rem] leading-[1.2] tracking-[-0.005em] sm:text-[2rem]">
                    {pagesContent.create.formTitle}
                  </h2>
                </div>
                <span className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-3 py-1.5 text-[var(--slot4-muted-text)]">
                  {session.name}
                </span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-28`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-56`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Main content, details, or description" required />
              </div>

              {created ? (
                <div className="mt-6 rounded-[12px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-5">
                  <p className="editable-mono inline-flex items-center gap-2 text-[var(--slot4-page-text)]">
                    <CheckCircle2 className="h-4 w-4" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-[var(--slot4-muted-text)]">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className={`${dc.button.primary} mt-8 w-full`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
