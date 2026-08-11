import { defineConfig } from 'sanity';
import { defineType, defineField, defineArrayMember } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { DocumentIcon } from '@sanity/icons/Document';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { UsersIcon } from '@sanity/icons/Users';
import { EditIcon } from '@sanity/icons/Edit';
import { structure } from './sanity.structure';
import { resolve } from './src/lib/resolve';

const previewUrlSecret = import.meta.env.SANITY_PREVIEW_URL_SECRET;

// Project ID and dataset — hardcoded because the embedded Studio's Vite build
// does not inherit Astro's import.meta.env vars.
const PROJECT_ID = 'vs8d5hbw';
const DATASET = 'production';

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
		}, { previewUrlSecret }),
	],

	schema: {
		types: [
			// ── Homepage (Singleton) ──
			defineType({
				name: 'homepage',
				title: 'Homepage',
				type: 'document',
				icon: DocumentIcon,
				fields: [
					defineField({
						name: 'headline',
						title: 'Headline',
						type: 'string',
						description: 'Main headline on the homepage',
						validation: (rule) => rule.required(),
					}),
					defineField({
						name: 'subheadline',
						title: 'Subheadline',
						type: 'text',
						rows: 3,
						description: 'Supporting text below the headline',
					}),
					defineField({
						name: 'bio',
						title: 'Bio',
						type: 'array',
						of: [defineArrayMember({ type: 'block' })],
						description: 'About section — rich text',
					}),
					defineField({
						name: 'ctaLabel',
						title: 'CTA Label',
						type: 'string',
						description: 'Call-to-action button text',
					}),
					defineField({
						name: 'ctaLink',
						title: 'CTA Link',
						type: 'url',
						description: 'Where the CTA points to',
						validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
					}),
				],
				preview: {
					select: {
						title: 'headline',
						subtitle: 'subheadline',
					},
					prepare({ title, subtitle }) {
						return {
							title: title || 'Homepage',
							subtitle,
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
							isUnique: true,
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
						type: 'image',
						options: { hotspot: true },
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
							defineArrayMember({ type: 'block' }),
							defineArrayMember({
								type: 'image',
								options: { hotspot: true },
							}),
						],
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
						type: 'image',
						options: { hotspot: true },
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
								isUnique: true,
							},
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'coverImage',
							title: 'Cover Image',
							type: 'image',
							options: { hotspot: true },
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
							type: 'date',
						}),
						defineField({
							name: 'body',
							title: 'Body',
							type: 'array',
							of: [
								defineArrayMember({ type: 'block' }),
								defineArrayMember({
									type: 'image',
									options: { hotspot: true },
								}),
							],
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
					],
					},
					});
