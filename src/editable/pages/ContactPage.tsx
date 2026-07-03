'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Add an entry', body: 'Bring a new place onto the shelf. We&rsquo;ll verify the details and route it to the right editor.' },
      { icon: Phone, title: 'Partnership questions', body: 'Bulk publishing, category coverage, and operational questions from teams.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Ask for a new geography, category, or lane — we&rsquo;ll consider it for the next audit.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Reference submissions', body: 'Suggest guides, whitepapers, and references worth adding to the shelf.' },
    { icon: Mail, title: 'Editorial partnerships', body: 'Coordinate curation projects, joint reference releases, and index programs.' },
    { icon: Sparkles, title: 'Contributor support', body: 'Need help organising the shelves, submissions, or profile-linked collections?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pb-16 pt-14 sm:pt-24`}>
          <EditableReveal index={0}>
            <span className="editable-mono text-[var(--slot4-muted-text)]">{pagesContent.contact.eyebrow}</span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-serif mt-6 max-w-4xl text-[3rem] leading-[1.05] tracking-[-0.015em] sm:text-[4.5rem] lg:text-[5rem]">
              {pagesContent.contact.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]">
              {pagesContent.contact.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} border-t border-[var(--editable-border)] pb-24 pt-16`}>
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <EditableReveal index={0}>
                <span className="editable-mono text-[var(--slot4-muted-text)]">Where to write</span>
              </EditableReveal>
              <EditableReveal index={1}>
                <h2 className="editable-serif mt-4 text-[1.75rem] leading-[1.2] tracking-[-0.005em] sm:text-[2.25rem]">
                  Pick the closest lane so it{' '}
                  <span className="editable-italic-emphasis">reaches</span> the right editor.
                </h2>
              </EditableReveal>
              <div className="mt-10">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i + 2}>
                    <div className="border-t border-[var(--editable-border-strong)] py-6 first:border-t-0">
                      <div className="flex items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border-strong)]">
                          <lane.icon className="h-4 w-4 text-[var(--slot4-page-text)]" />
                        </span>
                        <div>
                          <h3 className="editable-serif text-[1.375rem] leading-[1.2] tracking-[-0.005em]">
                            {lane.title}
                          </h3>
                          <p className="mt-2 text-[0.9375rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                            {lane.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal index={2}>
              <div className="rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
                <span className="editable-mono text-[var(--slot4-muted-text)]">Message</span>
                <h2 className="editable-serif mt-4 text-[1.75rem] leading-[1.2] tracking-[-0.005em] sm:text-[2rem]">
                  {pagesContent.contact.formTitle}
                </h2>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
