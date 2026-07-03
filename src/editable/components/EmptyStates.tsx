import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing on this shelf yet',
  description = 'New entries will appear here automatically once this section has published content.',
  actionLabel = 'Back to the index',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[16px] border border-dashed border-[var(--editable-border-strong)] p-12 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--editable-border-strong)]">
        <SearchX className="h-5 w-5 text-[var(--slot4-page-text)]" />
      </div>
      <h2 className="editable-serif mt-6 text-[1.75rem] leading-[1.2] tracking-[-0.005em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[1rem] leading-[1.6] text-[var(--slot4-muted-text)]">{description}</p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)] px-6 py-3 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)]"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`New ${taskLabel} from the editorial workflow will appear here as soon as they enter rotation.`}
      actionLabel="Explore the index"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for writing. We&rsquo;ll come back to you inside a couple of working days."
      actionLabel="Return to the index"
      actionHref="/"
    />
  )
}
