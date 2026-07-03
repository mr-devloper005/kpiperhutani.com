'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Editorial navbar — matches the reference's calm, monochrome bar.

  - Brand mark left.
  - Center-left: About and Contact only. No task-archive links.
  - Right: search glyph → /search, then auth actions.
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const staticLinks: { label: string; href: string }[] = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-8 px-6 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-page-text)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="editable-serif hidden max-w-[220px] truncate text-[1.35rem] leading-none tracking-[-0.01em] sm:block">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {staticLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[0.9375rem] font-medium transition ${
                isActive(item.href)
                  ? 'text-[var(--slot4-page-text)]'
                  : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[0.875rem] font-medium text-[var(--slot4-on-accent)] transition hover:opacity-90 sm:inline-flex"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden text-[0.875rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[0.875rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[0.875rem] font-medium text-[var(--slot4-on-accent)] transition hover:opacity-90 sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-2">
            {[
              { label: 'Home', href: '/' },
              ...staticLinks,
              { label: 'Search', href: '/search' },
              ...(session
                ? [{ label: 'Submit', href: '/create' }]
                : [
                    { label: 'Sign in', href: '/login' },
                    { label: 'Get started', href: '/signup' },
                  ]),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[12px] px-4 py-3 text-[0.9375rem] font-medium transition ${
                  isActive(item.href)
                    ? 'bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]'
                    : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-[12px] px-4 py-3 text-left text-[0.9375rem] font-medium text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
