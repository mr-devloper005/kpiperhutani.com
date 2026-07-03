import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* Editorial hero card — large 16:10 image with serif overtitle below. */
export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratioEditorial} rounded-[12px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
          loading="lazy"
        />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="editable-mono text-[var(--slot4-muted-text)]">{label}</span>
        <span className="h-px flex-1 bg-[var(--editable-border)]" />
        <span className="editable-mono text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</span>
      </div>
      <h3 className="editable-serif mt-4 text-[1.75rem] leading-[1.15] tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[2.25rem]">
        {post.title}
      </h3>
      <p className="mt-3 max-w-2xl text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]">
        {getEditableExcerpt(post, 190)}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] underline underline-offset-4 decoration-1 transition group-hover:decoration-2">
        Read the story <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

/* Compact rail card — used inside horizontal scrollers. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block ${dc.motion.lift}`}
    >
      <div className={`${dc.media.frame} aspect-[4/3] rounded-[12px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
          loading="lazy"
        />
        <span className="editable-mono absolute left-4 top-4 rounded-full bg-[var(--slot4-cream)]/90 px-3 py-1 text-[var(--slot4-page-text)] backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-4">
        <span className="editable-mono text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</span>
        <h3 className="editable-serif mt-2 line-clamp-3 text-[1.375rem] leading-[1.2] tracking-[-0.005em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 120)}
        </p>
      </div>
    </Link>
  )
}

/* Numbered index card — used inside process/list surfaces. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group block min-w-0 border-t border-[var(--editable-border)] py-6 transition duration-500 hover:pl-2"
    >
      <div className="flex items-start gap-6">
        <span className="editable-mono w-10 shrink-0 pt-1 text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <span className="editable-mono text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</span>
          <h3 className="editable-serif mt-2 line-clamp-2 text-[1.5rem] leading-[1.2] tracking-[-0.005em] text-[var(--slot4-page-text)]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">
            {getEditableExcerpt(post, 130)}
          </p>
        </div>
        <ArrowUpRight className="mt-2 h-5 w-5 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-[var(--slot4-page-text)]" />
      </div>
    </Link>
  )
}

/* Article list card — image left, editorial column right (used on archive lists). */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-8 ${dc.motion.lift} sm:grid-cols-[280px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[4/3] rounded-[12px] sm:aspect-auto sm:min-h-[220px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
          loading="lazy"
        />
      </div>
      <div className="min-w-0 py-2">
        <div className="flex items-center gap-3">
          <span className="editable-mono text-[var(--slot4-muted-text)]">
            No. {String(index + 1).padStart(2, '0')}
          </span>
          <span className="h-px flex-1 bg-[var(--editable-border)]" />
          <span className="editable-mono text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</span>
        </div>
        <h2 className="editable-serif mt-4 line-clamp-3 text-[1.75rem] leading-[1.15] tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[2rem]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-[1rem] leading-[1.6] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 200)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] underline underline-offset-4 decoration-1 transition group-hover:decoration-2">
          Open entry <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
