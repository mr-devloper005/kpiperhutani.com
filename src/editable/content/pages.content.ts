import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'An editorial index of local places and references',
      description:
        'A calm, editorially maintained directory of businesses paired with a working shelf of references you can download.',
      openGraphTitle: 'An editorial index of local places and references',
      openGraphDescription:
        'Browse a hand-curated Local Directory and a Reference Library of downloadable guides, whitepapers, and reports.',
      keywords: ['local directory', 'reference library', 'independent editorial index'],
    },
    hero: {
      badge: 'Editorial index · 2026',
      title: [
        'An editorial index of local places',
        'and the references worth keeping close.',
      ],
      description:
        'A quiet, well-kept directory paired with a working shelf of downloadable references — curated for readers who prefer signal to noise.',
      primaryCta: { label: 'Enter the directory', href: '/listings' },
      secondaryCta: { label: 'Open the reference library', href: '/pdf' },
      searchPlaceholder: 'Search the index',
      focusLabel: 'This week',
      featureCardBadge: 'Recently added',
      featureCardTitle: 'A new entry joins the index each week.',
      featureCardDescription:
        'Every place and every reference is reviewed by an editor before it enters rotation.',
    },
    intro: {
      badge: 'What&rsquo;s inside',
      title: 'Two shelves, one calm reading room.',
      paragraphs: [
        'Everything here is either a place worth knowing about, or a reference worth downloading. Nothing else clutters the index.',
        'The directory is hand-curated and reviewed daily; the library is audited every quarter for accuracy and freshness.',
        'Whether you start with a place or a reference, the surrounding tags will lead you to the next useful stop.',
      ],
      sideBadge: 'Editorial principles',
      sidePoints: [
        'Every entry is reviewed by a contributor before it goes live.',
        'No sponsored placements — rankings are editorial calls.',
        'The library holds only references we&rsquo;d cite ourselves.',
        'Contact details on directory entries are re-verified quarterly.',
      ],
      primaryLink: { label: 'Enter the directory', href: '/listings' },
      secondaryLink: { label: 'Open the library', href: '/pdf' },
    },
    cta: {
      badge: 'Contribute',
      title: 'Know a place, or hold a reference the shelf is missing?',
      description:
        'Add it to the index. Every submission is read; the good ones enter rotation within the week.',
      primaryCta: { label: 'Submit an entry', href: '/create' },
      secondaryCta: { label: 'Contact the editors', href: '/contact' },
    },
    taskSection: {
      heading: 'Recently added to {label}',
      descriptionSuffix: 'New entries from the last review pass.',
    },
  },
  about: {
    badge: 'About',
    title: 'A calm, well-kept index in a crowded corner of the web.',
    description: `${slot4BrandConfig.siteName} maintains a hand-curated Local Directory and a working Reference Library — a quiet, editorially disciplined index for readers who prefer signal to noise.`,
    paragraphs: [
      'Every place on the shelves has been reviewed by an editor before it enters rotation, and every reference in the library is one we&rsquo;d cite ourselves.',
      'Nothing here is sponsored, ranked-for-pay, or algorithmically promoted. The index earns its place through the quality of what it lets you find.',
    ],
    values: [
      {
        title: 'Considered discovery',
        description:
          'Entries are added by hand, tagged with intent, and cross-linked so one useful stop leads to the next.',
      },
      {
        title: 'Independent voice',
        description:
          'Contributors use these places and read these references themselves. That&rsquo;s the only reason anything makes it in.',
      },
      {
        title: 'Long-term stewardship',
        description:
          'Directory listings are re-verified quarterly. The reference shelf is audited on the same cadence. Nothing rots quietly.',
      },
    ],
  },
  contact: {
    eyebrow: `Write to ${slot4BrandConfig.siteName}`,
    title: 'Reach the editors directly, not a support queue.',
    description:
      'Tell us what you want to add, correct, or ask about. We&rsquo;ll route it to the right lane — no ticket numbers, no autoresponders.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the index',
      description: 'Search across the Local Directory, the Reference Library, and the journal.',
    },
    hero: {
      badge: 'Search',
      title: 'Search across the whole index.',
      description:
        'Type a keyword, category, or shelf name. Results cover the Local Directory, the Reference Library, and everything else editorially in rotation.',
      placeholder: 'Search the index',
    },
    resultsTitle: 'Recently added',
  },
  create: {
    metadata: {
      title: 'Submit an entry',
      description: 'Submit a new place or reference to the index.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description:
        'A quick account lets you submit places to the directory, references to the library, and manage what you&rsquo;ve added.',
    },
    hero: {
      badge: 'Contribute',
      title: 'Add a place, or a reference, to the shelves.',
      description:
        'Choose the shelf, fill in the details, and hit send. Every submission is read by an editor before it enters rotation.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Submission received.',
  },
  auth: {
    login: {
      metadataDescription: `Sign in to ${slot4BrandConfig.siteName}.`,
      badge: 'Contributor access',
      title: 'Welcome back to the editors&rsquo; workshop.',
      description:
        'Sign in to manage the entries you&rsquo;ve submitted, review comments, and add new places or references.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then sign in.',
      success: 'Signed in. Taking you back to the workshop…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create an account on ${slot4BrandConfig.siteName}.`,
      badge: 'Contributor access',
      title: 'Get set up to contribute to the index.',
      description:
        'A quick account lets you submit places and references, save entries, and take part in the editorial workshop.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More from the journal',
      fallbackTitle: 'Journal entry',
    },
    listing: {
      relatedTitle: 'More from the Local Directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More visual entries',
      fallbackTitle: 'Visual entry',
    },
    profile: {
      relatedTitle: 'Suggested reading',
      fallbackDescription: 'Details will appear here once the profile is live.',
      visitButton: 'Visit the site',
    },
  },
} as const
