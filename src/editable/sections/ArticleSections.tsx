import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme } from '@/editable/theme/task-themes'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({
      ...(category && category !== 'all' ? { category } : {}),
      page: String(nextPage),
    }).toString()}`
  const theme = getTaskTheme('article')
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pb-16 pt-14 sm:pt-24`}>
        <EditableReveal index={0}>
          <span className="editable-mono text-[var(--slot4-muted-text)]">{theme.kicker}</span>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className="editable-serif mt-6 max-w-5xl text-[2.75rem] leading-[1.1] tracking-[-0.015em] sm:text-[3.75rem] lg:text-[4.5rem]">
            {voice.headline}
          </h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]">
            {voice.description}
          </p>
        </EditableReveal>
        <EditableReveal index={3}>
          <form action={basePath} className="mt-10 flex max-w-xl flex-wrap gap-3">
            <select
              name="category"
              defaultValue={category || 'all'}
              className="min-w-0 flex-1 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-5 py-3 text-[0.9375rem] font-medium outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <button className={dc.button.primary} type="submit">
              Apply filter
            </button>
          </form>
        </EditableReveal>
      </section>

      <section className={`${dc.shell.section} border-t border-[var(--editable-border)] py-20 sm:py-24`}>
        {posts.length ? (
          <div className="grid gap-16">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={Math.min(index, 6)}>
                <ArticleListCard
                  post={post}
                  href={postHref('article', post, basePath)}
                  index={index + (page - 1) * pagination.limit}
                />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-dashed border-[var(--editable-border-strong)] p-14 text-center">
            <h2 className="editable-serif text-[1.75rem] leading-[1.2] tracking-[-0.005em]">No articles yet</h2>
            <p className="mt-3 text-[1rem] leading-[1.55] text-[var(--slot4-muted-text)]">
              Try another category or head back to the full journal.
            </p>
          </div>
        )}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className={dc.button.secondary}>
              Previous
            </Link>
          ) : null}
          <span className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-[var(--slot4-muted-text)]">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link href={pageHref(page + 1)} className={dc.button.secondary}>
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.sectionBody} pb-16 pt-14 sm:pt-24`}>
        <Link
          href="/article"
          className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the journal
        </Link>
        <EditableReveal index={1}>
          <span className="editable-mono mt-10 block text-[var(--slot4-muted-text)]">{voice.eyebrow}</span>
        </EditableReveal>
        <EditableReveal index={2}>
          <h1 className="editable-serif mt-5 text-[2.75rem] leading-[1.1] tracking-[-0.015em] sm:text-[3.75rem] lg:text-[4.5rem]">
            {post?.title || pagesContent.detailPages.article.fallbackTitle}
          </h1>
        </EditableReveal>
        <div className="mt-12 rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8">
          <p className="text-[1rem] leading-[1.7] text-[var(--slot4-muted-text)]">
            {post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}
          </p>
          <Link href="/contact" className={`${dc.button.ghost} mt-6`}>
            Get in touch with the editors <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
