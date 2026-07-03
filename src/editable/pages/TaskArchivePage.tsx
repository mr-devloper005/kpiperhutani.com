import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-10 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 md:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-all duration-500 hover:-translate-y-[3px] hover:border-[var(--editable-border-strong)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const displayLabel = theme.kicker
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="border-b border-[var(--tk-line)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
            <EditableReveal index={0}>
              <span className="editable-mono text-[var(--tk-muted)]">{displayLabel}</span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-serif mt-6 max-w-4xl text-[2.5rem] leading-[1.1] tracking-[-0.015em] text-[var(--tk-text)] sm:text-[3.25rem] lg:text-[4rem]">
                {voice?.headline || `Browse the ${displayLabel.toLowerCase()}`}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.55] text-[var(--tk-muted)]">
                {voice?.description || theme.note}
              </p>
            </EditableReveal>

            {task === 'pdf' ? (
              <EditableReveal index={3}>
                <div className="mt-10">
                  <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={4}>
              <div className="mt-12 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="editable-mono text-[var(--tk-muted)]">
                  {posts.length} {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-11 appearance-none rounded-full border border-[var(--editable-border-strong)] bg-transparent pl-5 pr-11 text-[0.9375rem] font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
                      aria-label={voice?.filterLabel || 'Filter category'}
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className={dc.button.primary} type="submit">
                    Apply
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        <section className={`${dc.shell.section} py-20 sm:py-24`}>
          {posts.length ? (
            <>
              <div className={taskGrid[task]}>
                {posts.map((post, index) => (
                  <EditableReveal key={post.id || post.slug} index={Math.min(index, 6)}>
                    <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                  </EditableReveal>
                ))}
              </div>
              {task === 'listing' && posts.length > 4 ? (
                <div className="mt-14">
                  <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel className="mx-auto w-full" />
                </div>
              ) : null}
            </>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--editable-border-strong)] bg-transparent px-10 py-20 text-center">
              <Search className="mx-auto h-6 w-6 text-[var(--tk-muted)]" />
              <h2 className="editable-serif mt-5 text-[1.75rem] leading-[1.2] tracking-[-0.005em]">Nothing here yet</h2>
              <p className="mt-3 text-[1rem] leading-[1.55] text-[var(--tk-muted)]">
                Try another category, or check back after new entries are published.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className={dc.button.secondary}>
                  Previous
                </Link>
              ) : null}
              <span className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className={dc.button.secondary}>
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[var(--tk-text)] underline underline-offset-4 decoration-1 transition group-hover:decoration-2">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Journal')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" loading="lazy" />
      </div>
      <div className="p-7">
        <div className="flex items-center gap-3">
          <span className="editable-mono text-[var(--tk-muted)]">{category}</span>
          <span className="h-px flex-1 bg-[var(--tk-line)]" />
          <span className="editable-mono text-[var(--tk-muted)]">No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-serif mt-4 text-[1.5rem] leading-[1.2] tracking-[-0.005em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-[1rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Read the entry" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} grid gap-0 overflow-hidden sm:grid-cols-[220px_minmax(0,1fr)]`}>
      <div className="aspect-[4/3] overflow-hidden bg-[var(--tk-raised)] sm:aspect-auto sm:min-h-[220px]">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="p-6">
        <span className="editable-mono text-[var(--tk-muted)]">Directory entry</span>
        <h2 className="editable-serif mt-3 text-[1.5rem] leading-[1.2] tracking-[-0.005em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-4 grid gap-1.5 text-[0.875rem] text-[var(--tk-muted)]">
          {location ? (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" /> {cleanDomain(website)}
            </span>
          ) : null}
        </div>
        <CardArrow label="See entry" />
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-serif text-[2rem] leading-[1] tracking-[-0.01em] text-[var(--tk-text)]">
          {price || 'Open notice'}
        </span>
        {condition ? (
          <span className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-3 py-1 text-[var(--tk-muted)]">
            {condition}
          </span>
        ) : null}
      </div>
      <h2 className="editable-serif mt-6 text-[1.375rem] leading-[1.2] tracking-[-0.005em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[0.875rem] text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-2">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link
      href={href}
      className="group mb-6 block break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-[3px]"
    >
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" loading="lazy" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(41,41,41,0.7))]" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="editable-serif line-clamp-2 text-[1.25rem] leading-[1.2] tracking-[-0.005em] text-white">{post.title}</h2>
          <span className="editable-mono mt-2 inline-flex items-center gap-2 text-white/80">
            View <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col gap-4 p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border-strong)]">
          <Globe className="h-4 w-4 text-[var(--tk-text)]" />
        </span>
        <span className="editable-mono text-[var(--tk-muted)]">Saved · {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className="editable-serif mt-2 text-[1.375rem] leading-[1.2] tracking-[-0.005em]">{post.title}</h2>
      <p className="line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
      {website ? <p className="editable-mono truncate text-[var(--tk-muted)]">{cleanDomain(website)}</p> : null}
      <CardArrow label="Open link" />
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--editable-border-strong)]">
          <FileText className="h-6 w-6 text-[var(--tk-text)]" />
        </span>
        <span className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-3 py-1 text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-serif mt-6 text-[1.375rem] leading-[1.2] tracking-[-0.005em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[var(--tk-text)] underline underline-offset-4 decoration-1 transition group-hover:decoration-2">
        Open reference <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-8 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border-strong)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-serif mt-6 text-[1.25rem] leading-[1.2] tracking-[-0.005em]">{post.title}</h2>
      {role ? <p className="editable-mono mt-2 text-[var(--tk-muted)]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
