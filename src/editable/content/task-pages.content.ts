import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Journal',
    headline: 'Long-form entries, essays, and reference dispatches.',
    description:
      'The journal is where the editors write in their own voice — essays, guides, and the reasoning behind decisions on the shelves.',
    filterLabel: 'Filter journal topic',
    secondaryNote: 'Read one, and follow its tags into the rest of the index.',
    chips: ['Editorial voice', 'Reasoned takes', 'Cross-linked'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Short, timely notices from the community.',
    description:
      'Short-form posts, offers, and asks. Fast to read, easy to act on, and stripped of the usual noise.',
    filterLabel: 'Filter notice category',
    secondaryNote: 'For time-sensitive posts that still deserve editorial review.',
    chips: ['Fast to scan', 'Time-sensitive', 'Editor reviewed'],
  },
  sbm: {
    eyebrow: 'Saved links',
    headline: 'A shelf of resources worth returning to.',
    description:
      'Working tools, references, and reads the editors have already sifted through so you don&rsquo;t have to.',
    filterLabel: 'Filter shelf',
    secondaryNote: 'Curated shelves — not an infinite feed.',
    chips: ['Curated', 'Reference-grade', 'Reader-ready'],
  },
  profile: {
    eyebrow: 'People & practices',
    headline: 'Independent voices and practices worth following.',
    description:
      'Profiles of contributors, teams, and practitioners whose work informs the rest of the index.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Identity first — no follower counts, no vanity metrics.',
    chips: ['Independent', 'Contributor-led', 'Trust-forward'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A working shelf of downloadable references.',
    description:
      'Guides, whitepapers, and reports the editors would cite themselves. Every file is stored locally, freely downloadable, and audited quarterly.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'The library is quiet on purpose. Nothing here has been paid for.',
    chips: ['Downloadable', 'Editor-vetted', 'Quarterly audit'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'A hand-curated directory of places worth knowing.',
    description:
      'Every entry has been reviewed and cross-checked before it enters rotation. Contact details are re-verified each quarter.',
    filterLabel: 'Filter directory category',
    secondaryNote: 'The directory is quiet by design — signal over volume.',
    chips: ['Hand-curated', 'Verified quarterly', 'Independent'],
  },
  image: {
    eyebrow: 'Visual field',
    headline: 'A quieter, image-first surface.',
    description:
      'Photographs and visual entries from contributors and community members. Composition and craft over feed velocity.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Nothing algorithmically boosted — just what the editors liked this month.',
    chips: ['Visual-first', 'Craft-forward', 'Editor selected'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
