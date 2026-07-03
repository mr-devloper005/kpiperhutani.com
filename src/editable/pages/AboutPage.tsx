import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pb-16 pt-14 sm:pt-24`}>
          <EditableReveal index={0}>
            <span className="editable-mono text-[var(--slot4-muted-text)]">{pagesContent.about.badge}</span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-serif mt-6 max-w-4xl text-[3rem] leading-[1.05] tracking-[-0.015em] sm:text-[4.5rem] lg:text-[5.5rem]">
              About{' '}
              <span className="editable-italic-emphasis">{SITE_CONFIG.name}</span>.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-3xl text-[1.25rem] leading-[1.55] text-[var(--slot4-muted-text)]">
              {pagesContent.about.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} border-t border-[var(--editable-border)] py-20 sm:py-24`}>
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <EditableReveal index={0}>
                <span className="editable-mono text-[var(--slot4-muted-text)]">The idea</span>
              </EditableReveal>
              <EditableReveal index={1}>
                <h2 className="editable-serif mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
                  A calm, well-kept index in a{' '}
                  <span className="editable-italic-emphasis">crowded</span> corner of the web.
                </h2>
              </EditableReveal>
            </div>
            <div className="space-y-6 text-[1.0625rem] leading-[1.7] text-[var(--slot4-muted-text)]">
              {pagesContent.about.paragraphs.map((paragraph, i) => (
                <EditableReveal key={paragraph} index={i + 2}>
                  <p>{paragraph}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        <section className={`${dc.shell.section} border-t border-[var(--editable-border)] py-20 sm:py-24`}>
          <EditableReveal index={0}>
            <span className="editable-mono text-[var(--slot4-muted-text)]">How the index is run</span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h2 className="editable-serif mt-4 max-w-3xl text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
              Three habits that keep the shelves honest.
            </h2>
          </EditableReveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {pagesContent.about.values.map((value, i) => (
              <EditableReveal key={value.title} index={i + 2}>
                <div className="border-t border-[var(--editable-border-strong)] pt-6">
                  <span className="editable-mono text-[var(--slot4-muted-text)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="editable-serif mt-3 text-[1.5rem] leading-[1.2] tracking-[-0.005em]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-[1rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                    {value.description}
                  </p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
