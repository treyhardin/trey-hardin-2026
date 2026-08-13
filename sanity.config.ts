import { defineConfig } from 'sanity';
import { defineType, defineField, defineArrayMember } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { DocumentIcon } from '@sanity/icons/Document';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { UsersIcon } from '@sanity/icons/Users';
import { EditIcon } from '@sanity/icons/Edit';
import { LinkIcon } from '@sanity/icons/Link';
import { structure } from './sanity.structure';
import { resolve } from './src/lib/resolve';

const previewUrlSecret = import.meta.env.SANITY_PREVIEW_URL_SECRET;

// Project ID and dataset — hardcoded because the embedded Studio's Vite build
// does not inherit Astro's import.meta.env vars.
const PROJECT_ID = 'vs8d5hbw';
const DATASET = 'production';

// ── Reusable: Link Object ──
// A single link with text, URL (relative or absolute), and optional new-tab behavior.
const linkObject = defineType({
	name: 'link',
	title: 'Link',
	type: 'object',
	fields: [
		defineField({
			name: 'text',
			title: 'Text',
			type: 'string',
			description: 'Label shown to the user',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'url',
			title: 'URL',
			type: 'string',
			description: 'Link destination — relative (/work) or absolute (https://…)',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'openInNewTab',
			title: 'Open in new tab',
			type: 'boolean',
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: 'text',
			subtitle: 'url',
		},
		prepare({ title, subtitle }) {
			return { title, subtitle };
		},
	},
});

// ── Reusable: Link List ──
// An orderable array of link objects. At least one link is required.
const linkList = defineType({
	name: 'linkList',
	title: 'Link List',
	type: 'array',
	of: [defineArrayMember({ type: 'link' })],
	validation: (rule) => rule.min(1).error('At least one link is required'),
});

// Portable Text block styles — all headings, blockquote, and code blocks.
const blockStyles = [
	{ title: 'Normal', value: 'normal' },
	{ title: 'H1', value: 'h1' },
	{ title: 'H2', value: 'h2' },
	{ title: 'H3', value: 'h3' },
	{ title: 'H4', value: 'h4' },
	{ title: 'H5', value: 'h5' },
	{ title: 'H6', value: 'h6' },
	{ title: 'Blockquote', value: 'blockquote' },
	{ title: 'Code', value: 'code' },
];

// ── Reusable: Sanity Image Object ──
// Wraps a Sanity image asset with an alt-text field (and future fields like
// aspect ratio, caption, etc.). Used everywhere we need an image on the site.
const sanityImageObject = defineType({
	name: 'sanityImage',
	title: 'Image',
	type: 'object',
	fields: [
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
			description: 'Upload or select an image asset',
		}),
		defineField({
			name: 'alt',
			title: 'Alt Text',
			type: 'string',
			description: 'Descriptive text for accessibility — what is shown, not what it means',
			validation: (rule) => rule.required(),
		}),
	],
});

// ── Reusable: Sanity Media Object ──
// A flexible media block that can hold an image, a video, or both.
// When both are present, the image serves as an optimized poster/placeholder
// for the video. Alt text is only required when no video is attached.
const sanityMediaObject = defineType({
	name: 'sanityMedia',
	title: 'Media',
	type: 'object',
	fields: [
		defineField({
			name: 'video',
			title: 'Video',
			type: 'file',
			options: {
				accept: 'video/*',
			},
			description: 'Upload a video file (MP4 recommended)',
		}),
		defineField({
			name: 'image',
			title: 'Image / Poster',
			type: 'sanityImage',
			description: 'When paired with a video, this serves as the poster frame. Without a video, it renders as a standalone image.',
		}),
	],
	preview: {
		select: {
			title: 'video',
			media: 'image.image',
		},
		prepare({ title, media }) {
			return {
				title: title ? 'Video' : (media ? 'Image' : 'Empty media'),
				media,
			};
		},
	},
});

// ── Reusable: SEO Object ──
// Per-page SEO meta controls: title, description, Open Graph image, and noindex flag.
// When a page omits this field, the layout falls back to site-wide defaults.
const seoObject = defineType({
	name: 'seoObject',
	title: 'SEO Settings',
	type: 'object',
	fields: [
		defineField({
			name: 'metaTitle',
			title: 'Meta Title',
			type: 'string',
			description: 'Title shown in search results and browser tabs (leave blank for default)',
			validation: (rule) => rule.max(60).warning('Keep under 60 characters for best results'),
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta Description',
			type: 'text',
			rows: 3,
			description: 'Description shown in search results (leave blank for default)',
			validation: (rule) => rule.max(160).warning('Keep under 160 characters for best results'),
		}),
		defineField({
			name: 'ogImage',
			title: 'Social Preview Image',
			type: 'sanityImage',
			description: 'Image shown when this page is shared on social media',
		}),
		defineField({
			name: 'noindex',
			title: 'Hide from Search Engines',
			type: 'boolean',
			initialValue: false,
			description: 'When enabled, search engines will not index this page',
		}),
	],
	preview: {
		select: {
			title: 'metaTitle',
			subtitle: 'metaDescription',
		},
		prepare({ title, subtitle }) {
			return {
				title: title || 'SEO Settings',
				subtitle: subtitle || 'Using defaults',
			};
		},
	},
});

export default defineConfig({
	name: 'portfolio-2026',
	title: 'Portfolio CMS',

	projectId: PROJECT_ID,
	dataset: DATASET,

	plugins: [
		structureTool({ structure }),
		presentationTool({
			resolve,
			previewUrl: {
				origin: typeof location === 'undefined'
					? 'http://localhost:4321'
					: location.origin,
				preview: '/',
				previewMode: {
					enable: '/api/draft-mode/enable',
					disable: '/api/draft-mode/disable',
				},
			},
			allowOrigins: [
				'http://localhost:4321',
				'http://100.88.85.21:4321',
				'https://trey-hardin-2026.pages.dev',
				'https://staging.treyhardin.com',
			],
		}),
	],

	schema: {
		types: [
			// ── Header (Singleton) ──
			defineType({
				name: 'header',
				title: 'Header',
				type: 'document',
				icon: LinkIcon,
				fields: [
					defineField({
						name: 'links',
						title: 'Navigation Links',
						type: 'linkList',
						description: 'Orderable list of header navigation links',
					}),
				],
				preview: {
					select: {
						title: 'links.text',
					},
					prepare({ title }) {
						return {
							title: 'Header Settings',
							subtitle: Array.isArray(title) ? `${title.length} link${title.length !== 1 ? 's' : ''}` : 'No links',
						};
					},
				},
			}),

			// ── Footer (Singleton) ──
			defineType({
				name: 'footer',
				title: 'Footer',
				type: 'document',
				icon: LinkIcon,
				fields: [
					defineField({
						name: 'links',
						title: 'Footer Links',
						type: 'linkList',
						description: 'Orderable list of footer links',
					}),
					defineField({
						name: 'copyright',
						title: 'Copyright Text',
						type: 'text',
						rows: 2,
						description: 'Copyright notice shown at the bottom of every page',
					}),
				],
				preview: {
					select: {
						title: 'links.text',
						subtitle: 'copyright',
					},
					prepare({ title, subtitle }) {
						return {
							title: 'Footer Settings',
							subtitle: subtitle || (Array.isArray(title) ? `${title.length} link${title.length !== 1 ? 's' : ''}` : 'No links'),
						};
					},
				},
			}),

			// ── Homepage (Singleton) ──
			defineType({
				name: 'homepage',
				title: 'Homepage',
				type: 'document',
				icon: DocumentIcon,
				fields: [
					defineField({
						name: 'heroHeading',
						title: 'Hero Heading',
						type: 'string',
						description: 'Main heading shown in the hero section',
						validation: (rule) => rule.required(),
					}),
					defineField({
						name: 'heroImages',
						title: 'Hero Images',
						type: 'array',
						of: [defineArrayMember({ type: 'sanityImage' })],
						description: 'Images that cycle in the hero gallery. Add multiple for rotation.',
						validation: (rule) => rule.min(1),
						}),
					defineField({
						name: 'seo',
						title: 'SEO Settings',
						type: 'seoObject',
					}),
				],
				preview: {
				select: {
					title: 'heroHeading',
					},
					prepare({ title }) {
						return {
							title: title || 'Homepage',
						};
					},
				},
			}),

			// ── Case Study ──
			defineType({
				name: 'caseStudy',
				title: 'Case Study',
				type: 'document',
				icon: DocumentTextIcon,
				fields: [
					defineField({
						name: 'title',
						title: 'Title',
						type: 'string',
						validation: (rule) => rule.required(),
					}),
					defineField({
						name: 'slug',
						title: 'Slug',
						type: 'slug',
						options: {
							source: 'title',
							maxLength: 96,
						},
						validation: (rule) => rule.required(),
					}),
					defineField({
						name: 'client',
						title: 'Client',
						type: 'reference',
						to: [{ type: 'client' }],
					}),
					defineField({
						name: 'coverImage',
						title: 'Cover Image',
						type: 'sanityImage',
					}),
					defineField({
						name: 'summary',
						title: 'Summary',
						type: 'text',
						rows: 3,
						description: 'Short description shown on the listing page',
						validation: (rule) => rule.max(300).warning('Keep it under 300 characters'),
					}),
					defineField({
						name: 'role',
						title: 'Your Role',
						type: 'string',
						description: 'e.g. "Lead Designer", "Brand Strategy"',
					}),
					defineField({
						name: 'year',
						title: 'Year',
						type: 'number',
						validation: (rule) => rule.integer().min(1900).max(2100),
					}),
					defineField({
						name: 'body',
						title: 'Body',
						type: 'array',
						of: [
							defineArrayMember({
								type: 'block',
								styles: blockStyles,
							}),
							defineArrayMember({
								type: 'sanityImage',
							}),
						],
					}),
					defineField({
						name: 'seo',
						title: 'SEO Settings',
						type: 'seoObject',
					}),
				],
				preview: {
					select: {
						title: 'title',
						client: 'client->name',
						year: 'year',
						media: 'coverImage',
					},
					prepare({ title, client, year, media }) {
						return {
							title,
							subtitle: [client, year].filter(Boolean).join(' · '),
							media,
						};
					},
				},
			}),

			// ── Client ──
			defineType({
				name: 'client',
				title: 'Client',
				type: 'document',
				icon: UsersIcon,
				fields: [
					defineField({
						name: 'name',
						title: 'Name',
						type: 'string',
						validation: (rule) => rule.required(),
					}),
					defineField({
						name: 'website',
						title: 'Website',
						type: 'url',
						validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
					}),
					defineField({
						name: 'logo',
						title: 'Logo',
						type: 'sanityImage',
						description: 'Client logo — preferably on a transparent background',
					}),
					defineField({
						name: 'description',
						title: 'Description',
						type: 'text',
						rows: 2,
						description: 'Brief description of the client or company',
					}),
				],
				preview: {
					select: {
						title: 'name',
						subtitle: 'description',
						media: 'logo',
					},
					prepare({ title, subtitle, media }) {
						return { title, subtitle, media };
					},
				},
			}),

			// ── Blog Post ──
			defineType({
				name: 'blogPost',
				title: 'Blog Post',
				type: 'document',
				icon: EditIcon,
				fields: [
					defineField({
						name: 'title',
						title: 'Title',
						type: 'string',
						validation: (rule) => rule.required(),
					}),
					defineField({
						name: 'slug',
						title: 'Slug',
						type: 'slug',
						options: {
							source: 'title',
							maxLength: 96,
						},
						validation: (rule) => rule.required(),
					}),
					defineField({
						name: 'coverImage',
						title: 'Cover Image',
						type: 'sanityImage',
					}),
					defineField({
						name: 'excerpt',
						title: 'Excerpt',
						type: 'text',
						rows: 3,
						description: 'Short summary shown on the listing page',
						validation: (rule) => rule.max(300).warning('Keep it under 300 characters'),
					}),
					defineField({
						name: 'publishedAt',
						title: 'Published Date',
						type: 'datetime',
					}),
					defineField({
						name: 'body',
						title: 'Body',
						type: 'array',
						of: [
							defineArrayMember({
								type: 'block',
								styles: blockStyles,
							}),
							defineArrayMember({
								type: 'sanityImage',
							}),
						],
					}),
				defineField({
					name: 'seo',
					title: 'SEO Settings',
					type: 'seoObject',
				}),
				],
				preview: {
					select: {
						title: 'title',
						date: 'publishedAt',
						media: 'coverImage',
					},
					prepare({ title, date, media }) {
						return {
							title,
							subtitle: date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unpublished',
							media,
						};
					},
				},
			}),

			// ── Reusable types ──
			sanityImageObject,
			sanityMediaObject,
			linkObject,
			linkList,
			seoObject,
		],
	},
});