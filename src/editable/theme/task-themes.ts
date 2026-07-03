import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Shared warm off-white editorial palette — every task inherits the same visual
  system (matching the reference), only the kicker + note copy varies.

  Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT =
  "'Instrument Serif', 'Cormorant Garamond', 'Times New Roman', ui-serif, Georgia, serif"
const BODY_FONT =
  "'DM Sans', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#F5EBEB',
  surface: '#F5EBEB',
  raised: '#E4D0D0',
  text: '#3d2e2e',
  muted: '#867070',
  line: '#E4D0D0',
  accent: '#3d2e2e',
  accentSoft: '#E4D0D0',
  onAccent: '#F5EBEB',
  glow: 'rgba(61,46,46,0.08)',
  radius: '12px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Journal',
    note: 'Long-form reads, essays, and reference dispatches.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'A curated directory of places to visit, book, and get in touch with.',
  },
  classified: {
    ...base,
    kicker: 'Notice board',
    note: 'Timely notices, offers, and short-form posts worth acting on.',
  },
  image: {
    ...base,
    kicker: 'Visual field',
    note: 'A quieter, image-first look at what the community is publishing.',
  },
  sbm: {
    ...base,
    kicker: 'Saved links',
    note: 'A shelf of resources, tools, and references worth returning to.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Guides, whitepapers, and downloadable references you can carry with you.',
  },
  profile: {
    ...base,
    kicker: 'People & practices',
    note: 'Independent voices, teams, and practices worth following.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
