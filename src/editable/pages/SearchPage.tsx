import type { Metadata } from 'next'
import Link from 'next/link'
import { Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'
import { formatRichHtml } from '@/components/shared/rich-content'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images)
    ? (content.images.find((item) => typeof item === 'string') as string | undefined)
    : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const displayLabel = task ? getTaskTheme(task).kicker : 'Entry'
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]"
            loading={index < 4 ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Search className="h-8 w-8 text-[var(--slot4-muted-text)]" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="editable-mono text-[var(--slot4-muted-text)]">{displayLabel}</span>
        <span className="h-px flex-1 bg-[var(--editable-border)]" />
      </div>
      <h3 className="editable-serif mt-3 line-clamp-2 text-[1.375rem] leading-[1.2] tracking-[-0.005em]">
        {post.title}
      </h3>
      {summary ? <div className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]" dangerouslySetInnerHTML={{ __html: formatRichHtml(summary) }} /> : null}
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pb-16 pt-14 sm:pt-20`}>
          <EditableReveal index={0}>
            <span className="editable-mono text-[var(--slot4-muted-text)]">Search the index</span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-serif mt-6 max-w-4xl text-[2.5rem] leading-[1.1] tracking-[-0.015em] sm:text-[3.5rem] lg:text-[4.5rem]">
              {pagesContent.search.hero.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]">
              {pagesContent.search.hero.description}
            </p>
          </EditableReveal>

          <EditableReveal index={3}>
            <form action="/search" className="mt-10 rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 sm:p-6">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-5 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-[1rem] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-5 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Category"
                    className="min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-[var(--slot4-muted-text)]"
                  />
                </label>
                <select
                  name="task"
                  defaultValue={task}
                  className="rounded-full border border-[var(--editable-border-strong)] bg-transparent px-5 py-3 text-[0.9375rem] font-medium outline-none"
                >
                  <option value="">Any shelf</option>
                  {enabledTasks.map((item) => (
                    <option key={item.key} value={item.key}>
                      {getTaskTheme(item.key).kicker}
                    </option>
                  ))}
                </select>
                <button className={dc.button.primary} type="submit">
                  Search
                </button>
              </div>
            </form>
          </EditableReveal>

          <EditableReveal index={4}>
            <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--editable-border)] pb-6">
              <div>
                <span className="editable-mono text-[var(--slot4-muted-text)]">{results.length} results</span>
                <h2 className="editable-serif mt-2 text-[1.75rem] leading-[1.2] tracking-[-0.005em] sm:text-[2rem]">
                  {query ? `For &ldquo;${query}&rdquo;` : pagesContent.search.resultsTitle}
                </h2>
              </div>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={Math.min(index, 6)}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[16px] border border-dashed border-[var(--editable-border-strong)] p-14 text-center">
              <Search className="mx-auto h-6 w-6 text-[var(--slot4-muted-text)]" />
              <h3 className="editable-serif mt-4 text-[1.75rem] leading-[1.2] tracking-[-0.005em]">Nothing matched that query.</h3>
              <p className="mt-3 text-[1rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                Try a broader keyword, a different shelf, or reset the category filter.
              </p>
            </div>
          )}
        </section>
        <section className={`${dc.shell.section} pb-24`}>
          <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
        </section>
      </main>
    </EditableSiteShell>
  )
}
