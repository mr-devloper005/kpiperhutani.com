import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-16 py-16 lg:grid-cols-[0.9fr_1fr] lg:gap-24`}>
          <EditableReveal index={0}>
            <div className="rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <span className="editable-mono text-[var(--slot4-muted-text)]">Create account</span>
              <h1 className="editable-serif mt-3 text-[1.75rem] leading-[1.2] tracking-[-0.005em] sm:text-[2rem]">
                {pagesContent.auth.signup.formTitle}
              </h1>
              <div className="mt-6">
                <EditableLocalSignupForm />
              </div>
              <p className="mt-8 text-[0.9375rem] text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[var(--slot4-page-text)] underline underline-offset-4">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
          <div>
            <EditableReveal index={1}>
              <span className="editable-mono text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.badge}</span>
            </EditableReveal>
            <EditableReveal index={2}>
              <h2 className="editable-serif mt-6 max-w-xl text-[2.75rem] leading-[1.1] tracking-[-0.015em] sm:text-[3.75rem] lg:text-[4.5rem]">
                {pagesContent.auth.signup.title}
              </h2>
            </EditableReveal>
            <EditableReveal index={3}>
              <p className="mt-6 max-w-lg text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                {pagesContent.auth.signup.description}
              </p>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
