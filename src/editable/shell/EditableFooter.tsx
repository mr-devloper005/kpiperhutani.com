'use client'

import Link from 'next/link'
import { ArrowUpRight, Instagram, Linkedin, Twitter } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { getTaskTheme } from '@/editable/theme/task-themes'

/*
  Editorial footer — multi-column (brand + description + link columns + CTA
  strip). The footer is a discovery surface so the renamed task labels live
  here (Local Directory, Reference Library, etc.), pulled from taskThemes.
*/
export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks
    .filter((task) => task.enabled)
    .map((task) => ({ ...task, kicker: getTaskTheme(task.key).kicker }))
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-24 border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="border-b border-[var(--editable-border)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start gap-6 px-6 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="editable-mono text-[var(--slot4-muted-text)]">Have a resource to share?</p>
            <h2 className="editable-serif mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem] lg:text-[3rem]">
              Add your business, or contribute a{' '}
              <span className="editable-italic-emphasis">reference</span> the community will actually use.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-[0.9375rem] font-medium text-[var(--slot4-on-accent)] transition hover:opacity-90"
            >
              Submit an entry
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[var(--slot4-page-text)] bg-transparent px-7 py-3.5 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)]"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-page-text)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
            <span className="editable-serif text-[1.5rem] tracking-[-0.01em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-[1.6] text-[var(--slot4-muted-text)]">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
          
        </div>

        <div>
          <h3 className="editable-mono text-[var(--slot4-page-text)]">Discover</h3>
          <div className="mt-5 grid gap-3">
            {taskLinks.map((task) => (
              <Link
                key={task.key}
                href={task.route}
                className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]"
              >
                {task.kicker}
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[var(--slot4-page-text)]">Resources</h3>
          <div className="mt-5 grid gap-3">
            {[
              ['Reading list', '/search'],
              ['About', '/about'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-[0.9375rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[var(--slot4-page-text)]">Account</h3>
          <div className="mt-5 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-[0.9375rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Submit an entry
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-left text-[0.9375rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[0.9375rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Sign in
                </Link>
                <Link href="/signup" className="text-[0.9375rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--editable-border)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col gap-3 px-6 py-6 text-[0.8125rem] text-[var(--slot4-muted-text)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span className="editable-mono">{globalContent.footer?.bottomNote || 'Independent editorial index'}</span>
        </div>
      </div>
    </footer>
  )
}
