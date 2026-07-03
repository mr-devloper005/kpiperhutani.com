import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'An editorial index of places and references',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'An editorial index of places and references',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'Two shelves, one calm reading room',
    description:
      'A quiet, editorially maintained directory of businesses and a working shelf of downloadable references — hand-curated for readers who prefer signal to noise.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listings' },
          { label: 'Reference Library', href: '/pdf' },
          { label: 'Journal', href: '/articles' },
          { label: 'Visual field', href: '/image-sharing' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Independent · editorially maintained',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Browse the index',
    latest: 'Recently added',
    related: 'More from the shelf',
    published: 'Published',
  },
} as const
