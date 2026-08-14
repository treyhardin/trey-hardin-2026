import { defineLocations } from 'sanity/presentation';

/**
 * Maps Sanity document types to their frontend routes.
 * Used by the Presentation Tool to navigate the iframe when an editor
 * selects a document in the Studio.
 */
export const resolve = {
  locations: {
    header: defineLocations({
      select: { title: 'links.text' },
      resolve: (doc) => ({
        locations: [{ title: 'Header Settings', href: '/' }],
      }),
    }),
    homepage: defineLocations({
      select: { title: 'headline' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Homepage', href: '/' }],
      }),
    }),
    caseStudy: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/work/${doc?.slug || ''}` },
          { title: 'All Work', href: '/work' },
        ],
      }),
    }),
    blogPost: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/blog/${doc?.slug || ''}` },
          { title: 'All Posts', href: '/blog' },
        ],
      }),
    }),
    experiment: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/experiments/${doc?.slug || ''}` },
          { title: 'All Experiments', href: '/experiments' },
        ],
      }),
    }),
    client: defineLocations({
      select: { title: 'name' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Client', href: '/' }],
      }),
    }),
  },
};
