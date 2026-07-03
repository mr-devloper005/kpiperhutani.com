import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Clock3, Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, Sparkles, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------ helpers --------------------------------- */
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')
const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) =>
    `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )
const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) =>
    `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

/* -------------------------------- entry --------------------------------- */
export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------------ shared bits ----------------------------- */
function BackLink({ task }: { task: TaskKey }) {
  const theme = getTaskTheme(task)
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to the {theme.kicker.toLowerCase()}
    </Link>
  )
}

function Kicker({ task, sub }: { task: TaskKey; sub?: string }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-3">
      <span className="editable-mono text-[var(--tk-muted)]">{theme.kicker}</span>
      {sub ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="editable-mono text-[var(--tk-muted)]">{sub}</span>
        </>
      ) : null}
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[1rem] leading-[1.65]' : 'text-[1.0625rem] leading-[1.75]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ tags }: { tags: string[] }) {
  const list = (tags || []).filter(Boolean).slice(0, 8)
  if (!list.length) return null
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {list.map((tag) => (
        <span key={tag} className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-3 py-1.5 text-[var(--tk-muted)]">
          {tag}
        </span>
      ))}
    </div>
  )
}

function TrustPanel({ items }: { items: string[] }) {
  const rows = items.filter(Boolean).slice(0, 3)
  if (!rows.length) return null
  return (
    <div className="rounded-[12px] border border-[var(--tk-line)] bg-transparent p-6">
      <span className="editable-mono text-[var(--tk-muted)]">Trust</span>
      <ul className="mt-4 grid gap-3">
        {rows.map((row) => (
          <li key={row} className="flex items-start gap-3 text-[0.9375rem] leading-[1.45] text-[var(--tk-text)]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {row}
          </li>
        ))}
      </ul>
    </div>
  )
}

function GalleryStrip({ images, label }: { images: string[]; label: string }) {
  if (!images.length) return null
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-3">
        <span className="editable-mono text-[var(--tk-muted)]">{label}</span>
        <span className="editable-mono text-[var(--tk-muted)]">
          {images.length.toString().padStart(2, '0')} images
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.slice(0, 6).map((image, i) => (
          <div key={`${image}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
            <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  )
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-3 py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-muted)]" />
      <div className="min-w-0 flex-1">
        <span className="editable-mono text-[var(--tk-muted)]">{label}</span>
        <p className="mt-1 truncate text-[0.9375rem] font-medium text-[var(--tk-text)]">{value}</p>
      </div>
      <ArrowUpRight className="mt-1 h-4 w-4 text-[var(--tk-muted)]" />
    </div>
  )
  if (href) {
    return (
      <a href={href} className="block border-t border-[var(--tk-line)] transition first:border-t-0 hover:pl-1">
        {inner}
      </a>
    )
  }
  return <div className="block border-t border-[var(--tk-line)] first:border-t-0">{inner}</div>
}

/* ============================== ARTICLE ================================ */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className={`${dc.shell.sectionBody} py-16 sm:py-24`}>
        <BackLink task="article" />
        <EditableReveal index={0}>
          <p className="editable-mono mt-10 text-[var(--tk-muted)]">{categoryOf(post, 'Journal')}</p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className="editable-serif mt-5 text-[2.5rem] leading-[1.1] tracking-[-0.015em] sm:text-[3.25rem] lg:text-[3.75rem]">
            {post.title}
          </h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className="editable-mono mt-6 text-[var(--tk-muted)]">Published by {SITE_CONFIG.name}</p>
        </EditableReveal>
        {images[0] ? (
          <EditableReveal index={3}>
            <div className="mt-12 aspect-[16/9] overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              <img src={images[0]} alt="" className="h-full w-full object-cover" loading="eager" />
            </div>
          </EditableReveal>
        ) : null}
        <BodyContent post={post} />
        <TagChips tags={post.tags || []} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ============================== LISTING ================================ */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('listing')
  const images = getImages(post)
  const hero = images[0]
  const secondary = images[1]
  const gallery = images.slice(2, 8)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'timings', 'schedule'])
  const category = getField(post, ['category']) || 'Directory entry'
  const mapSrc = mapSrcFor(post)
  const entryNo = String(Math.abs(hashPost(post.slug || post.title || 'x')) % 900 + 1).padStart(3, '0')

  // Ticker items — a single mono line of numbered facts.
  const ticker: Array<[string, string]> = [
    ['01', address || '—'],
    ['02', phone || '—'],
    ['03', hours || 'By appointment'],
    ['04', 'Editor reviewed'],
    ['05', category],
  ].filter(([, v]) => v && v !== '—') as Array<[string, string]>

  return (
    <>
      {/* ============ SPLIT COVER HERO ============ */}
      <section className={`${dc.shell.section} pt-14 sm:pt-16`}>
        <BackLink task="listing" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <EditableReveal index={0}>
            <div>
              <div className="flex items-center gap-4">
                <span className="editable-mono text-[var(--tk-muted)]">
                  {theme.kicker} · Nº {entryNo}
                </span>
                <span className="h-px flex-1 bg-[var(--tk-line)]" />
              </div>
              <h1 className="editable-serif mt-6 text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.75rem] lg:text-[4.75rem]">
                {post.title}
              </h1>
              {leadText(post) ? (
                <p className="mt-6 max-w-xl text-[1.125rem] leading-[1.6] text-[var(--tk-muted)]">
                  {leadText(post)}
                </p>
              ) : null}
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href={website || (phone ? `tel:${phone}` : '#contact-card')}
                  target={website ? '_blank' : undefined}
                  rel={website ? 'nofollow noopener noreferrer' : undefined}
                  className={dc.button.primary}
                >
                  {website ? 'Visit the entry' : phone ? 'Call this place' : 'Get in touch'}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a href="#contact-card" className={dc.button.secondary}>
                  See all contact details
                </a>
              </div>
              {/* Editorial credit bar — different from a stats row */}
              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--tk-line)] pt-8 sm:grid-cols-3">
                <div>
                  <dt className="editable-mono text-[var(--tk-muted)]">Region</dt>
                  <dd className="editable-serif mt-2 text-[1.125rem] tracking-[-0.005em]">
                    {address ? address.split(',').slice(-1)[0].trim() || address : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="editable-mono text-[var(--tk-muted)]">Category</dt>
                  <dd className="editable-serif mt-2 text-[1.125rem] tracking-[-0.005em]">{category}</dd>
                </div>
                <div>
                  <dt className="editable-mono text-[var(--tk-muted)]">Reviewed by</dt>
                  <dd className="editable-serif mt-2 text-[1.125rem] tracking-[-0.005em]">
                    {SITE_CONFIG.name}
                  </dd>
                </div>
              </dl>
            </div>
          </EditableReveal>

          {/* Portrait cover image (4:5) — different from previous 16:9 top hero */}
          <EditableReveal index={2}>
            {hero ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                <img src={hero} alt="" className="h-full w-full object-cover" loading="eager" />
                <span className="editable-mono absolute bottom-4 left-4 rounded-full bg-[var(--tk-bg)]/90 px-3 py-1.5 text-[var(--tk-text)] backdrop-blur">
                  Cover image
                </span>
              </div>
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                <Building2 className="h-16 w-16 text-[var(--tk-muted)]" />
              </div>
            )}
          </EditableReveal>
        </div>
      </section>

      {/* ============ MONO TICKER RIBBON ============ */}
      <section className="mt-16 border-y border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <div className={`${dc.shell.section} py-5`}>
          <div className="flex gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ticker.map(([n, v], i) => (
              <div key={`${n}-${i}`} className="flex shrink-0 items-center gap-3">
                <span className="editable-mono text-[var(--tk-muted)]">{n}</span>
                <span className="editable-serif truncate text-[1.125rem] tracking-[-0.005em] text-[var(--tk-text)]">
                  {v}
                </span>
                {i < ticker.length - 1 ? <span className="ml-8 h-4 w-px bg-[var(--tk-line)]" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BODY — LEFT STICKY SIDEBAR + FLOWING ARTICLE ============ */}
      <section className={`${dc.shell.section} py-20 sm:py-24`}>
        <div className="grid gap-14 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* LEFT sidebar — moved from right; distinct layout signal */}
          <aside id="contact-card" className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <div className="flex items-baseline justify-between gap-3 border-b border-[var(--tk-line)] pb-4">
                <span className="editable-mono text-[var(--tk-muted)]">Contact card</span>
                <span className="editable-serif text-[1.75rem] leading-none tracking-[-0.01em] text-[var(--tk-text)]">
                  Nº {entryNo}
                </span>
              </div>
              <div className="mt-4">
                {address ? <ContactRow icon={MapPin} label="Address" value={address} /> : null}
                {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? (
                  <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} />
                ) : null}
                {hours ? <ContactRow icon={Clock3} label="Hours" value={hours} /> : null}
              </div>
              <Link
                href={website || `tel:${phone}` || '#contact-card'}
                className={`${dc.button.primary} mt-6 w-full`}
                target={website ? '_blank' : undefined}
                rel={website ? 'nofollow noopener noreferrer' : undefined}
              >
                Contact this entry <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <TrustPanel
              items={[
                'Reviewed by the editorial team before listing',
                'No paid placements — every entry is independent',
                'Contact details verified within the last quarter',
              ]}
            />

            <div>
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="w-full" />
            </div>
          </aside>

          <article className="min-w-0">
            {/* Section h2 with numeric prefix — new pattern */}
            <EditableReveal index={0}>
              <div className="flex items-baseline gap-6 border-b border-[var(--tk-line)] pb-6">
                <span className="editable-mono text-[var(--tk-muted)]">§ 01</span>
                <h2 className="editable-serif text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.75rem]">
                  About this <span className="editable-italic-emphasis">entry</span>.
                </h2>
              </div>
            </EditableReveal>
            <BodyContent post={post} />
            <TagChips tags={post.tags || []} />

            {/* Asymmetric two-image lead — different from earlier 3-up grid */}
            {(secondary || gallery.length) ? (
              <div className="mt-14 grid gap-4 sm:grid-cols-[1.6fr_1fr]">
                {secondary ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                    <img src={secondary} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : null}
                {gallery[0] ? (
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                    <img src={gallery[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : null}
              </div>
            ) : null}

            <GalleryStrip images={gallery.slice(1)} label={theme.kicker + ' — additional photos'} />

            {mapSrc ? (
              <div className="mt-16">
                <div className="flex items-baseline gap-6 border-b border-[var(--tk-line)] pb-6">
                  <span className="editable-mono text-[var(--tk-muted)]">§ 02</span>
                  <h2 className="editable-serif text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.75rem]">
                    Where to find it.
                  </h2>
                </div>
                <div className="mt-6 overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-[420px] w-full border-0" />
                </div>
                {address ? (
                  <p className="editable-mono mt-4 text-[var(--tk-muted)]">{address}</p>
                ) : null}
              </div>
            ) : null}
          </article>
        </div>
      </section>

      {/* ============ RELATED — horizontal snap-scroll rail (new) ============ */}
      <ListingRelatedRail related={related} />
    </>
  )
}

// Deterministic entry-number hash so the Nº stays stable across renders.
function hashPost(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) | 0
  return h
}

function ListingRelatedRail({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('listing')
  const theme = getTaskTheme('listing')
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className={`${dc.shell.section} py-20 sm:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="editable-mono text-[var(--tk-muted)]">Also in the {theme.kicker.toLowerCase()}</span>
            <h2 className="editable-serif mt-4 text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.75rem]">
              Neighbouring <span className="editable-italic-emphasis">entries</span>.
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className={dc.button.ghost}>
            View the whole directory <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {related.map((item, i) => {
            const image = getImages(item)[0]
            const href = `${taskConfig?.route || '/listing'}/${item.slug}`
            return (
              <EditableReveal key={item.id || item.slug} index={i} className="snap-start">
                <Link
                  href={href}
                  className="group block w-[320px] shrink-0 sm:w-[380px]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2 className="h-10 w-10 text-[var(--tk-muted)]" />
                      </div>
                    )}
                    <span className="editable-mono absolute left-4 top-4 rounded-full bg-[var(--tk-bg)]/90 px-3 py-1 text-[var(--tk-text)] backdrop-blur">
                      Nº {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="editable-serif mt-5 line-clamp-2 text-[1.375rem] leading-[1.2] tracking-[-0.005em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.5] text-[var(--tk-muted)]">
                    {stripHtml(summaryText(item))}
                  </p>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================== CLASSIFIED ============================= */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${dc.shell.section} py-16 sm:py-24`}>
        <BackLink task="classified" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <Kicker task="classified" sub={getField(post, ['category'])} />
            <h1 className="editable-serif mt-5 text-[2.5rem] leading-[1.1] tracking-[-0.015em] sm:text-[3.25rem]">
              {post.title}
            </h1>
            {images[0] ? (
              <div className="mt-8 aspect-[16/10] overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                <img src={images[0]} alt="" className="h-full w-full object-cover" loading="eager" />
              </div>
            ) : null}
            <BodyContent post={post} />
            <TagChips tags={post.tags || []} />
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <span className="editable-mono text-[var(--tk-muted)]">Offer</span>
              <p className="editable-serif mt-4 text-[3rem] leading-[1] tracking-[-0.015em]">
                {price || 'Open notice'}
              </p>
              <div className="mt-6 grid gap-3 text-[0.9375rem]">
                {condition ? (
                  <div className="flex items-center justify-between border-t border-[var(--tk-line)] py-3">
                    <span className="editable-mono text-[var(--tk-muted)]">Condition</span>
                    <span className="font-medium">{condition}</span>
                  </div>
                ) : null}
                {location ? (
                  <div className="flex items-center justify-between border-t border-[var(--tk-line)] py-3">
                    <span className="editable-mono text-[var(--tk-muted)]">Location</span>
                    <span className="font-medium">{location}</span>
                  </div>
                ) : null}
              </div>
              <div className="mt-6 grid gap-3">
                {phone ? <a href={`tel:${phone}`} className={dc.button.primary}><Phone className="h-4 w-4" /> Call</a> : null}
                {email ? <a href={`mailto:${email}`} className={dc.button.secondary}><Mail className="h-4 w-4" /> Email</a> : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ================================ IMAGE ================================ */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className={`${dc.shell.section} py-16 sm:py-24`}>
        <BackLink task="image" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" loading="lazy" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <span className="editable-mono inline-flex items-center gap-2 text-[var(--tk-muted)]">
              <Camera className="h-3.5 w-3.5" /> Visual field
            </span>
            <h1 className="editable-serif mt-6 text-[2.5rem] leading-[1.1] tracking-[-0.015em] sm:text-[3rem]">
              {post.title}
            </h1>
            {leadText(post) ? (
              <p className="mt-6 text-[1.0625rem] leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p>
            ) : null}
            <BodyContent post={post} compact />
            <TagChips tags={post.tags || []} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ============================== BOOKMARK =============================== */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className={`${dc.shell.sectionBody} py-16 sm:py-24`}>
        <BackLink task="sbm" />
        <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--editable-border-strong)]">
          <Bookmark className="h-6 w-6 text-[var(--tk-text)]" />
        </div>
        <div className="mt-6">
          <Kicker task="sbm" />
        </div>
        <h1 className="editable-serif mt-4 text-[2.5rem] leading-[1.1] tracking-[-0.015em] sm:text-[3.25rem]">
          {post.title}
        </h1>
        {leadText(post) ? (
          <p className="mt-6 text-[1.125rem] leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p>
        ) : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} mt-8`}>
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
        <TagChips tags={post.tags || []} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ================================ PDF ================================== */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('pdf')
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const pages = getField(post, ['pages', 'pageCount'])
  const size = getField(post, ['fileSize', 'size'])
  const updated = getField(post, ['updatedAt', 'updated', 'modified']) || SITE_CONFIG.name
  const category = categoryOf(post, 'Reference')
  const uploadedBy = getField(post, ['author', 'uploader', 'owner']) || SITE_CONFIG.name
  const filename = (fileUrl && fileUrl.split('/').pop()) || `${post.slug}.pdf`
  const edition = String(Math.abs(hashPost(post.slug || post.title || 'x')) % 900 + 1).padStart(3, '0')
  const glyph = (post.title || 'Aa').replace(/[^A-Za-z]/g, '').slice(0, 2) || 'Aa'

  return (
    <>
      {/* ============ SPLIT COVER + PREVIEW READING ROOM ============ */}
      <section className={`${dc.shell.section} pt-14 sm:pt-16`}>
        <BackLink task="pdf" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-stretch">
          {/* LEFT — magazine cover: huge serif edition number, title, meta */}
          <EditableReveal index={0}>
            <div className="flex h-full flex-col justify-between rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 sm:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-3 py-1.5 text-[var(--tk-muted)]">
                    {theme.kicker}
                  </span>
                  <span className="editable-mono rounded-full bg-[var(--tk-text)] px-3 py-1.5 text-[var(--tk-on-accent)]">
                    PDF
                  </span>
                  <span className="editable-mono rounded-full border border-[var(--editable-border-strong)] px-3 py-1.5 text-[var(--tk-muted)]">
                    {category}
                  </span>
                </div>
                <p className="editable-mono mt-8 text-[var(--tk-muted)]">Edition</p>
                <p className="editable-serif mt-2 text-[6rem] leading-[0.9] tracking-[-0.03em] text-[var(--tk-text)] sm:text-[8rem] lg:text-[10rem]">
                  Nº {edition}
                </p>
                <h1 className="editable-serif mt-8 text-[2rem] leading-[1.1] tracking-[-0.015em] sm:text-[2.5rem] lg:text-[3rem]">
                  {post.title}
                </h1>
                {leadText(post) ? (
                  <p className="mt-5 max-w-md text-[1.0625rem] leading-[1.6] text-[var(--tk-muted)]">
                    {leadText(post)}
                  </p>
                ) : null}
              </div>
              {/* Colophon-style meta bar — replaces previous pull-quote */}
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--tk-line)] pt-6">
                <div>
                  <dt className="editable-mono text-[var(--tk-muted)]">Prepared by</dt>
                  <dd className="mt-1 truncate text-[0.9375rem] font-medium text-[var(--tk-text)]">{uploadedBy}</dd>
                </div>
                <div>
                  <dt className="editable-mono text-[var(--tk-muted)]">Filed</dt>
                  <dd className="mt-1 truncate text-[0.9375rem] font-medium text-[var(--tk-text)]">{updated}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                {fileUrl ? (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={dc.button.primary}>
                    Download PDF <Download className="h-4 w-4" />
                  </a>
                ) : null}
                {fileUrl ? (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={dc.button.secondary}>
                    Open in new tab <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </EditableReveal>

          {/* RIGHT — iframe preview visible immediately at the top of the fold */}
          <EditableReveal index={2}>
            <div className="overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] px-5 py-4">
                <span className="editable-mono text-[var(--tk-muted)]">Reference preview</span>
                {fileUrl ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editable-mono inline-flex items-center gap-2 text-[var(--tk-text)] underline underline-offset-4"
                  >
                    Download <Download className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
              {fileUrl ? (
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={post.title}
                  className="h-[68vh] w-full bg-[var(--tk-raised)] sm:h-[74vh]"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-[var(--tk-raised)]">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-[var(--tk-muted)]" />
                    <p className="editable-mono mt-4 text-[var(--tk-muted)]">
                      Preview will appear once the file is uploaded.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* ============ BIG-NUMERAL STAT ROW (replaces small quick-facts) ============ */}
      <section className="mt-16 border-y border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <div className={`${dc.shell.section} py-14 sm:py-16`}>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Pages', pages || '—'],
              ['File size', size || '—'],
              ['Format', 'PDF'],
              ['Updated', updated],
            ].map(([label, value], i) => (
              <EditableReveal key={label} index={i}>
                <div>
                  <span className="editable-mono text-[var(--tk-muted)]">{label}</span>
                  <p className="editable-serif mt-3 text-[2.5rem] leading-[1] tracking-[-0.015em] text-[var(--tk-text)] sm:text-[3rem]">
                    {value}
                  </p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TWO-COL READING BODY BELOW SPLIT ============ */}
      <section className={`${dc.shell.section} py-20 sm:py-24`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <EditableReveal index={0}>
              <div className="flex items-baseline gap-6 border-b border-[var(--tk-line)] pb-6">
                <span className="editable-mono text-[var(--tk-muted)]">§ Reading</span>
                <h2 className="editable-serif text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.75rem]">
                  What&rsquo;s <span className="editable-italic-emphasis">inside</span>.
                </h2>
              </div>
            </EditableReveal>
            <div className="mt-6 gap-10 lg:columns-2">
              <BodyContent post={post} />
            </div>
            <TagChips tags={post.tags || []} />

            <div className="mt-14">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>

            {/* Repeated CTA callout — restated at bottom */}
            <div className="mt-14 rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-10">
              <span className="editable-mono text-[var(--tk-muted)]">Take it with you</span>
              <h3 className="editable-serif mt-4 max-w-2xl text-[1.75rem] leading-[1.2] tracking-[-0.005em] sm:text-[2.25rem]">
                Save a copy for later, or send it to a colleague who&rsquo;d get more out of it than the algorithm.
              </h3>
              {fileUrl ? (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={`${dc.button.primary} mt-6`}>
                  Download PDF <Download className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </article>

          {/* Slimmer sticky sidebar — document identity + TOC */}
          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <div className="flex aspect-square items-center justify-center rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                <span className="editable-serif text-[5rem] leading-none tracking-[-0.02em] text-[var(--tk-text)]">
                  {glyph}
                </span>
              </div>
              <p className="editable-mono mt-5 truncate text-[var(--tk-muted)]" title={filename}>
                {filename}
              </p>
              <div className="mt-5">
                <ContactRow icon={Tag} label="Category" value={category} />
                <ContactRow icon={FileText} label="Pages" value={pages || '—'} />
                <ContactRow icon={Sparkles} label="File size" value={size || '—'} />
                <ContactRow icon={UserRound} label="Uploaded by" value={uploadedBy} />
                <ContactRow icon={Clock3} label="Updated" value={updated} />
              </div>
              {fileUrl ? (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={`${dc.button.primary} mt-6 w-full`}>
                  Download <Download className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            <div className="rounded-[16px] border border-[var(--tk-line)] bg-transparent p-6">
              <span className="editable-mono text-[var(--tk-muted)]">Table of contents</span>
              <ol className="mt-4 grid gap-3 text-[0.9375rem] leading-[1.5] text-[var(--tk-text)]">
                {['Executive summary', 'Key findings & context', 'Detailed sections', 'References and further reading'].map((row, i) => (
                  <li key={row} className="flex items-start gap-3">
                    <span className="editable-mono w-6 shrink-0 text-[var(--tk-muted)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{row}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <PdfRelatedShelf related={related} />
    </>
  )
}

// Library-shelf rail — book-spine style tall cards, horizontal scroll.
function PdfRelatedShelf({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  const theme = getTaskTheme('pdf')
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className={`${dc.shell.section} py-20 sm:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="editable-mono text-[var(--tk-muted)]">Also on the shelf</span>
            <h2 className="editable-serif mt-4 text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.75rem]">
              More in the {theme.kicker.toLowerCase()}.
            </h2>
          </div>
          <Link href={taskConfig?.route || '/pdf'} className={dc.button.ghost}>
            Browse the whole library <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {related.map((item, i) => {
            const size = getField(item, ['fileSize', 'size']) || 'PDF'
            const cat = categoryOf(item, 'Reference')
            const glyphB = (item.title || 'Aa').replace(/[^A-Za-z]/g, '').slice(0, 2) || 'Aa'
            const href = `${taskConfig?.route || '/pdf'}/${item.slug}`
            return (
              <EditableReveal key={item.id || item.slug} index={i} className="snap-start">
                <Link
                  href={href}
                  className="group flex h-full w-[220px] shrink-0 flex-col rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition-all duration-500 hover:-translate-y-[3px] hover:border-[var(--editable-border-strong)] sm:w-[240px]"
                >
                  <span className="editable-mono text-[var(--tk-muted)]">
                    Nº {String(i + 1).padStart(2, '0')} · {cat}
                  </span>
                  <div className="mt-4 flex aspect-[3/4] items-center justify-center rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                    <span className="editable-serif text-[3rem] leading-none tracking-[-0.02em] text-[var(--tk-text)]">
                      {glyphB}
                    </span>
                  </div>
                  <h3 className="editable-serif mt-5 line-clamp-3 text-[1.125rem] leading-[1.2] tracking-[-0.005em]">
                    {item.title}
                  </h3>
                  <span className="editable-mono mt-auto pt-4 text-[var(--tk-muted)]">{size}</span>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================== PROFILE ================================ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${dc.shell.section} py-16 sm:py-24`}>
        <BackLink task="profile" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? (
                  <img src={images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />
                )}
              </div>
              <h1 className="editable-serif mt-6 text-[1.75rem] leading-[1.15] tracking-[-0.01em]">{post.title}</h1>
              {role ? <p className="editable-mono mt-2 text-[var(--tk-muted)]">{role}</p> : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {website ? (
                  <a href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>
                    Visit
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className={dc.button.secondary}>
                    Email
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile" />
            <BodyContent post={post} />
            <TagChips tags={post.tags || []} />
            <GalleryStrip images={images.slice(1, 7)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ============================== related ================================ */
function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const theme = getTaskTheme(task)
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className={`${dc.shell.section} py-20 sm:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="editable-mono text-[var(--tk-muted)]">More from the shelf</span>
            <h2 className="editable-serif mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
              More in the {theme.kicker.toLowerCase()}.
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className={dc.button.ghost}>
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i}>
              <RelatedCard task={task} post={item} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-7 w-7 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="editable-mono text-[var(--tk-muted)]">{categoryOf(post, 'Entry')}</span>
        <h3 className="editable-serif mt-2 line-clamp-2 text-[1.125rem] leading-[1.2] tracking-[-0.005em]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.5] text-[var(--tk-muted)]">
          {stripHtml(summaryText(post))}
        </p>
      </div>
    </Link>
  )
}
