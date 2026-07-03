import type { CSSProperties } from 'react'

/*
  Design contract — warm off-white monochrome editorial system.

  Reference: thinkwise-consulting-template.webflow.io/home-v3
  Language: Instrument Serif display + DM Sans body + Geist Mono labels,
  pill buttons, 12px cards on a #F5EBEB dusty-rose canvas, #867070 is the ink and accent.

  Every downstream component reads these CSS vars so a single palette swap
  changes the whole site.
*/

/*
  Dusty rose palette (user-supplied):
    #867070  rgb(134,112,112)  — deepest, used as ink + accent
    #D5B4B4  rgb(213,180,180)  — mid-tone rose (raised panel / strong hairline)
    #E4D0D0  rgb(228,208,208)  — light rose (soft panel / hairline)
    #F5EBEB  rgb(245,235,235)  — lightest (page canvas)
*/
export const editableRootStyle = {
  '--slot4-page-bg': '#F5EBEB',
  '--slot4-page-text': '#3d2e2e',
  '--slot4-panel-bg': '#E4D0D0',
  '--slot4-panel-raised': '#D5B4B4',
  '--slot4-surface-bg': '#F5EBEB',
  '--slot4-muted-text': '#867070',
  '--slot4-soft-muted-text': '#867070',
  '--slot4-accent': '#3d2e2e',
  '--slot4-accent-fill': '#3d2e2e',
  '--slot4-accent-soft': '#E4D0D0',
  '--slot4-on-accent': '#F5EBEB',
  '--slot4-dark-bg': '#3d2e2e',
  '--slot4-dark-text': '#F5EBEB',
  '--slot4-media-bg': '#E4D0D0',
  '--slot4-cream': '#F5EBEB',
  '--slot4-warm': '#E4D0D0',
  '--slot4-lavender': '#D5B4B4',
  '--slot4-gray': '#E4D0D0',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#F5EBEB',
  '--editable-page-text': '#3d2e2e',
  '--editable-container': '1400px',
  '--editable-container-wide': '1138px',
  '--editable-container-body': '896px',
  '--editable-container-narrow': '654px',
  '--editable-border': '#E4D0D0',
  '--editable-border-strong': '#D5B4B4',
  '--editable-nav-bg': '#F5EBEB',
  '--editable-nav-text': '#3d2e2e',
  '--editable-nav-active': '#3d2e2e',
  '--editable-nav-active-text': '#F5EBEB',
  '--editable-cta-bg': '#3d2e2e',
  '--editable-cta-text': '#F5EBEB',
  '--editable-search-bg': '#F5EBEB',
  '--editable-footer-bg': '#E4D0D0',
  '--editable-footer-text': '#3d2e2e',
  '--editable-radius-btn': '50px',
  '--editable-radius-card': '12px',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-[0_1px_2px_rgba(61,46,46,0.08)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(61,46,46,0.05),rgba(61,46,46,0.55))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10',
    sectionNarrow: 'mx-auto w-full max-w-[var(--editable-container-wide)] px-6 sm:px-8 lg:px-10',
    sectionBody: 'mx-auto w-full max-w-[var(--editable-container-body)] px-6 sm:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
    sectionYSmall: 'py-10 sm:py-12',
    sectionYLarge: 'py-24 sm:py-28 lg:py-36',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    // Small mono label — the reference uses this a lot. All caps, tracked.
    eyebrow: 'editable-mono text-[0.8125rem] text-[var(--slot4-muted-text)]',
    heroTitle:
      'editable-serif text-[2.625rem] leading-[1.1] tracking-[-0.01em] sm:text-[3rem] lg:text-[3.5rem]',
    sectionTitle:
      'editable-serif text-[1.875rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.25rem] lg:text-[2.5rem]',
    subTitle:
      'editable-serif text-[1.5rem] leading-[1.2] tracking-[-0.005em] sm:text-[1.75rem] lg:text-[2rem]',
    body: 'text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]',
    bodyLarge: 'text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)] sm:text-[1.25rem]',
    emphasis: 'editable-italic-emphasis',
  },
  surface: {
    card: `rounded-[12px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[12px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[12px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    flat: `rounded-[12px] ${editablePalette.warmBg}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-[14px] text-[0.9375rem] font-medium text-[var(--slot4-on-accent)] transition-all duration-300 hover:bg-[var(--slot4-page-text)] hover:opacity-90 active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--slot4-page-text)] bg-transparent px-7 py-[14px] text-[0.9375rem] font-medium text-[var(--slot4-page-text)] transition-all duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)] active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-[14px] text-[0.9375rem] font-medium text-[var(--slot4-on-accent)] transition-all duration-300 hover:opacity-90 active:scale-[0.98]',
    ghost:
      'inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] underline underline-offset-4 decoration-1 transition-all duration-300 hover:decoration-2',
  },
  badge: {
    pill: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-3.5 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    accentPill: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-3.5 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-on-accent)]',
    mono: 'editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-3 py-1 text-[0.75rem] text-[var(--slot4-muted-text)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[12px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[12px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    ratioEditorial: 'aspect-[16/10]',
    ratioPortrait: 'aspect-[3/4]',
  },
  motion: {
    lift: 'transition-all duration-500 hover:-translate-y-[3px] hover:border-[var(--editable-border-strong)]',
    fade: 'transition-opacity duration-500 hover:opacity-80',
    zoom: 'transition-transform duration-[600ms] group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'Warm off-white monochrome — accent is the base ink, not a colored brand hue.',
  'Every heading uses Instrument Serif via editable-serif; every mono chip uses Geist Mono via editable-mono.',
  'Buttons are pills (rounded-full). Cards are 12px radius with hairline borders — no shadows.',
  'Section rhythm follows sectionY (medium) / sectionYLarge; use editorial spacing, not dense grids.',
  'Wrap section headers and grid items in EditableReveal with index={i} for stagger.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
] as const
