'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'h-12 rounded-[10px] border border-[var(--editable-border-strong)] bg-transparent px-4 text-[0.9375rem] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks — your message reached us.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="What&rsquo;s this about?" />
      </div>
      <label className="grid gap-2">
        <span className="editable-mono text-[var(--slot4-muted-text)]">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you&rsquo;re trying to publish, fix, or ask about…"
          className={`${inputClass} h-auto py-3`}
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div
          className={`flex items-start gap-3 rounded-[10px] border px-4 py-3 text-[0.9375rem] ${
            status === 'success'
              ? 'border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]'
              : 'border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 text-[0.9375rem] font-medium text-[var(--slot4-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-2">
      <span className="editable-mono text-[var(--slot4-muted-text)]">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className={inputClass} />
    </label>
  )
}
