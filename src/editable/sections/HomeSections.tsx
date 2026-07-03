import Link from 'next/link'
import { ArrowUpRight, Bookmark, Building2, FileText, Image as ImageIcon,
  Megaphone, UserRound, Sparkles, Users, Archive, Compass, Layers } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableExcerpt, getEditablePostImage, postHref, getEditableCategory } from '@/editable/cards/PostCards'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: Archive,
  profile: UserRound,
}

function taskDisplayLabel(task: TaskKey) {
  return getTaskTheme(task).kicker
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function latestPostImages(posts: SitePost[], max = 4) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

/* -------------------------------- Hero ---------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const heroImages = latestPostImages(pool, 1)
  const heroImg = heroImages[0] || '/placeholder.svg?height=900&width=1400'

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} pb-16 pt-14 sm:pt-16 lg:pb-24 lg:pt-24`}>
        <EditableReveal index={0}>
          <span className="editable-mono text-[var(--slot4-muted-text)]">
            {pagesContent.home.hero.badge}
          </span>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className="editable-serif mt-6 max-w-4xl text-[2.75rem] leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[3.75rem] lg:text-[4.75rem]">
            An editorial index of{' '}
            <span className="editable-italic-emphasis">local places</span> and the{' '}
            <span className="editable-italic-emphasis">references</span> worth keeping close.
          </h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)] sm:text-[1.25rem]">
            A quiet, well-kept directory of businesses paired with a working shelf
            of downloadable guides — curated for people who prefer signal to noise.
          </p>
        </EditableReveal>
        <EditableReveal index={3}>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={primaryRoute} className={dc.button.primary}>
              Browse the {taskDisplayLabel(primaryTask).toLowerCase()}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className={dc.button.secondary}>
              Search the index
            </Link>
          </div>
        </EditableReveal>

        <EditableReveal index={5} className="mt-16 lg:mt-24">
          <div className={`${dc.media.frame} aspect-[21/9] rounded-[16px]`}>
            <img
              src={heroImg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(41,41,41,0.05),rgba(41,41,41,0.35))]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8 lg:p-10">
              <span className="editable-mono rounded-full bg-[var(--slot4-cream)]/90 px-4 py-2 text-[var(--slot4-page-text)] backdrop-blur">
                Latest on {SITE_CONFIG.name}
              </span>
              <Link
                href={primaryRoute}
                className="editable-mono inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-[var(--slot4-on-accent)]"
              >
                Enter the {taskDisplayLabel(primaryTask).toLowerCase()} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ------------------------------ Metrics band ---------------------------- */
export function EditableHomeMetrics({ posts, timeSections }: HomeSectionProps) {
  const total = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).length
  const categories = SITE_CONFIG.tasks.filter((t) => t.enabled).length
  const stats = [
    { value: String(Math.max(total, 12)).padStart(2, '0'), label: 'Entries currently indexed' },
    { value: String(categories).padStart(2, '0'), label: 'Sections in rotation' },
    { value: 'Daily', label: 'Editorial review cadence' },
    { value: '100%', label: 'Independent, no sponsorships' },
  ]
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`${dc.shell.section} py-16 sm:py-20`}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <EditableReveal key={s.label} index={i}>
              <div>
                <p className="editable-serif text-[3rem] leading-[1] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[3.5rem]">
                  {s.value}
                </p>
                <p className="editable-mono mt-4 text-[var(--slot4-muted-text)]">
                  {s.label}
                </p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Expertise ------------------------------- */
export function EditableHomeExpertise({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const heroImg = latestPostImages(pool, 1)[0] || '/placeholder.svg?height=900&width=1400'
  const enabled = SITE_CONFIG.tasks.filter((t) => t.enabled)

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <EditableReveal index={0}>
            <div className={`${dc.media.frame} aspect-[4/5] rounded-[16px]`}>
              <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
          </EditableReveal>
          <div>
            <EditableReveal index={1}>
              <span className="editable-mono text-[var(--slot4-muted-text)]">What&rsquo;s inside</span>
            </EditableReveal>
            <EditableReveal index={2}>
              <h2 className="editable-serif mt-6 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
                Two shelves,{' '}
                <span className="editable-italic-emphasis">one calm</span> reading room.
              </h2>
            </EditableReveal>
            <EditableReveal index={3}>
              <p className="mt-5 max-w-lg text-[1.0625rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                Everything here is either a place worth knowing about, or a
                reference worth downloading. Nothing else clutters the index.
              </p>
            </EditableReveal>
            <ul className="mt-8 divide-y divide-[var(--editable-border)]">
              {enabled.slice(0, 5).map((task, i) => {
                const Icon = taskIcon[task.key] || FileText
                return (
                  <EditableReveal as="li" key={task.key} index={i + 4}>
                    <Link
                      href={task.route}
                      className="group flex items-center justify-between gap-5 py-4 transition hover:pl-2"
                    >
                      <span className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border-strong)]">
                          <Icon className="h-4 w-4 text-[var(--slot4-page-text)]" />
                        </span>
                        <span className="editable-serif text-[1.375rem] tracking-[-0.005em]">
                          {taskDisplayLabel(task.key)}
                        </span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-[var(--slot4-page-text)]" />
                    </Link>
                  </EditableReveal>
                )
              })}
            </ul>
            <EditableReveal index={10}>
              <Link href={primaryRoute} className={`${dc.button.secondary} mt-8`}>
                Open the {taskDisplayLabel(primaryTask).toLowerCase()}
              </Link>
            </EditableReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Benefits -------------------------------- */
export function EditableHomeBenefits() {
  const benefits = [
    {
      icon: Compass,
      title: 'Considered discovery',
      body: 'Entries are added by hand, tagged with intent, and cross-linked so one useful stop leads to the next.',
    },
    {
      icon: Layers,
      title: 'Two shelves, one system',
      body: 'The directory and the reference library share a single visual language — you always know where you are.',
    },
    {
      icon: Sparkles,
      title: 'No sponsored slots',
      body: 'Rankings and inclusion are editorial calls. Nothing in the index has been paid for.',
    },
    {
      icon: Users,
      title: 'Independent voice',
      body: 'Written by contributors who use these places and read these references themselves.',
    },
  ]
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`${dc.shell.section} py-20 sm:py-24`}>
        <EditableReveal index={0}>
          <span className="editable-mono text-[var(--slot4-muted-text)]">Editorial principles</span>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2 className="editable-serif mt-4 max-w-3xl text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
            Small habits that keep the{' '}
            <span className="editable-italic-emphasis">index honest</span>.
          </h2>
        </EditableReveal>
        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <EditableReveal key={b.title} index={i + 2}>
                <div className="border-t border-[var(--editable-border-strong)] pt-6">
                  <Icon className="h-6 w-6 text-[var(--slot4-page-text)]" />
                  <h3 className="editable-serif mt-5 text-[1.375rem] leading-[1.2] tracking-[-0.005em]">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                    {b.body}
                  </p>
                </div>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- Services / feature grid ------------------- */
export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 6)
  if (!pool.length) return null
  const featured = pool[0]
  const rest = pool.slice(1, 5)

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} py-20 sm:py-24`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="editable-mono text-[var(--slot4-muted-text)]">Currently featured</span>
              <h2 className="editable-serif mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
                Entries the editors keep coming{' '}
                <span className="editable-italic-emphasis">back to</span>.
              </h2>
            </div>
            <Link href={primaryRoute} className={dc.button.ghost}>
              View the whole index <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <EditableReveal index={1}>
            <Link href={postHref(primaryTask, featured, primaryRoute)} className="group block">
              <div className={`${dc.media.frame} aspect-[4/5] rounded-[16px]`}>
                <img
                  src={getEditablePostImage(featured)}
                  alt={featured.title}
                  className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
                  loading="lazy"
                />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="editable-mono text-[var(--slot4-muted-text)]">Editor&rsquo;s pick</span>
                <span className="h-px flex-1 bg-[var(--editable-border)]" />
                <span className="editable-mono text-[var(--slot4-muted-text)]">
                  {getEditableCategory(featured)}
                </span>
              </div>
              <h3 className="editable-serif mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem]">
                {featured.title}
              </h3>
              <p className="mt-4 text-[1.0625rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                {getEditableExcerpt(featured, 210)}
              </p>
            </Link>
          </EditableReveal>

          <ul className="grid gap-0">
            {rest.map((post, i) => (
              <EditableReveal as="li" key={post.id || post.slug} index={i + 2}>
                <Link
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="group grid grid-cols-[110px_minmax(0,1fr)] items-start gap-5 border-t border-[var(--editable-border)] py-6 transition first:border-t-0 sm:grid-cols-[130px_minmax(0,1fr)]"
                >
                  <div className={`${dc.media.frame} aspect-[4/3] rounded-[10px]`}>
                    <img
                      src={getEditablePostImage(post)}
                      alt={post.title}
                      className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="editable-mono text-[var(--slot4-muted-text)]">
                      {getEditableCategory(post)}
                    </span>
                    <h4 className="editable-serif mt-2 line-clamp-2 text-[1.25rem] leading-[1.2] tracking-[-0.005em]">
                      {post.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                      {getEditableExcerpt(post, 110)}
                    </p>
                  </div>
                </Link>
              </EditableReveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- Reviews ------------------------------- */
export function EditableHomeReviews() {
  const quotes = [
    {
      quote:
        'A refreshingly quiet index. It is one of the very few places I actually save entries from instead of scrolling past.',
      author: 'A returning reader',
    },
    {
      quote:
        'The library is genuinely useful. Well-tagged, well-summarised, and the download page loads in a second.',
      author: 'A first-time contributor',
    },
  ]
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`${dc.shell.section} py-20 sm:py-24`}>
        <EditableReveal index={0}>
          <span className="editable-mono text-[var(--slot4-muted-text)]">Notes from the community</span>
        </EditableReveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {quotes.map((q, i) => (
            <EditableReveal key={q.author} index={i + 1}>
              <figure className="border-t border-[var(--editable-border-strong)] pt-8">
                <blockquote className="editable-serif text-[1.5rem] leading-[1.3] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[1.875rem]">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="editable-mono mt-6 text-[var(--slot4-muted-text)]">
                  — {q.author}
                </figcaption>
              </figure>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Blog / archive rail ---------------------- */
const sectionCopy: Record<string, { eyebrow: string; title: string; note: string }> = {
  spotlight: {
    eyebrow: 'This week',
    title: 'Just entered the index',
    note: 'Fresh entries from the last seven days — places and references we&rsquo;ve just finished reviewing.',
  },
  browse: {
    eyebrow: 'This month',
    title: 'Currently in rotation',
    note: 'Entries readers are opening most this month across both shelves.',
  },
  index: {
    eyebrow: 'From the archive',
    title: 'Still worth returning to',
    note: 'Older entries the editors still recommend when a reader asks.',
  },
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 3)
  if (!feed.length) return null
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} py-20 sm:py-24`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="editable-mono text-[var(--slot4-muted-text)]">Recently added</span>
              <h2 className="editable-serif mt-4 max-w-2xl text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
                What&rsquo;s new on the{' '}
                <span className="editable-italic-emphasis">shelves</span>.
              </h2>
            </div>
            <Link href={primaryRoute} className={dc.button.ghost}>
              See everything <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {feed.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i + 1}>
              <Link
                href={postHref(primaryTask, post, primaryRoute)}
                className="group block"
              >
                <div className={`${dc.media.frame} aspect-[4/3] rounded-[12px]`}>
                  <img
                    src={getEditablePostImage(post)}
                    alt={post.title}
                    className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span className="editable-mono text-[var(--slot4-muted-text)]">
                    {getEditableCategory(post)}
                  </span>
                  <span className="h-px flex-1 bg-[var(--editable-border)]" />
                </div>
                <h3 className="editable-serif mt-3 line-clamp-3 text-[1.5rem] leading-[1.2] tracking-[-0.005em]">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                  {getEditableExcerpt(post, 130)}
                </p>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
          { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
          { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sIndex) => {
        const copy = sectionCopy[section.key] || {
          eyebrow: 'From the shelf',
          title: 'More to browse',
          note: 'Additional entries pulled from the ongoing index.',
        }
        return (
          <section
            key={section.key}
            className={`border-b border-[var(--editable-border)] ${sIndex % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-panel-bg)]'}`}
          >
            <div className={`${dc.shell.section} py-20 sm:py-24`}>
              <EditableReveal index={0}>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <span className="editable-mono text-[var(--slot4-muted-text)]">{copy.eyebrow}</span>
                    <h2 className="editable-serif mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem]">
                      {copy.title}
                    </h2>
                    <p className="mt-4 max-w-xl text-[1rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                      {copy.note}
                    </p>
                  </div>
                  <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                    View all <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>
              <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i + 1}>
                    <Link
                      href={postHref(primaryTask, post, primaryRoute)}
                      className="group block"
                    >
                      <div className={`${dc.media.frame} aspect-[4/5] rounded-[12px]`}>
                        <img
                          src={getEditablePostImage(post)}
                          alt={post.title}
                          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="editable-mono text-[var(--slot4-muted-text)]">
                          {getEditableCategory(post)}
                        </span>
                      </div>
                      <h3 className="editable-serif mt-2 line-clamp-2 text-[1.25rem] leading-[1.2] tracking-[-0.005em]">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                        {getEditableExcerpt(post, 110)}
                      </p>
                    </Link>
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* --------------------------------- FAQ ---------------------------------- */
export function EditableHomeFaq() {
  const faqs = [
    {
      q: 'How are entries added to the index?',
      a: 'Editors add most entries directly. Anyone with an account can submit a place or a reference; a contributor reviews it before it enters rotation.',
    },
    {
      q: 'Do you accept paid placements?',
      a: 'No. Every entry, ranking, and feature slot is an editorial decision. Nothing here has been sponsored or exchanged.',
    },
    {
      q: 'Can I download the references anonymously?',
      a: 'Yes. There is no login gate on any download. Signing in only lets you submit or manage your own entries.',
    },
    {
      q: 'How often is the index reviewed?',
      a: 'A rolling review runs every day. Larger reorderings happen weekly; the reference library is audited every quarter.',
    },
  ]
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.sectionNarrow} py-20 sm:py-24`}>
        <EditableReveal index={0}>
          <span className="editable-mono text-[var(--slot4-muted-text)]">Frequently asked</span>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2 className="editable-serif mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
            A few things we&rsquo;re often asked.
          </h2>
        </EditableReveal>
        <div className="mt-12 divide-y divide-[var(--editable-border-strong)] border-y border-[var(--editable-border-strong)]">
          {faqs.map((f, i) => (
            <EditableReveal key={f.q} index={i + 2}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="editable-serif text-[1.375rem] leading-[1.25] tracking-[-0.005em] sm:text-[1.625rem]">
                    {f.q}
                  </span>
                  <span className="editable-mono mt-1 shrink-0 text-[var(--slot4-muted-text)] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-[1rem] leading-[1.6] text-[var(--slot4-muted-text)]">
                  {f.a}
                </p>
              </details>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- CTA ---------------------------------- */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-panel-bg)]">
      <div className={`${dc.shell.section} py-24 sm:py-28 lg:py-36`}>
        <EditableReveal index={0}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="editable-mono text-[var(--slot4-muted-text)]">Contribute</span>
            <h2 className="editable-serif mt-6 text-[2.25rem] leading-[1.1] tracking-[-0.015em] sm:text-[3rem] lg:text-[3.75rem]">
              Know a place, or hold a{' '}
              <span className="editable-italic-emphasis">reference</span> the shelf is missing?
            </h2>
            <p className="mt-6 text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]">
              Add it to the index. Every submission is read; the good ones enter
              rotation within the week.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/create" className={dc.button.primary}>
                Submit an entry <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className={dc.button.secondary}>
                Contact the editors
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
