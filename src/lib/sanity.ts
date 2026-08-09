import { createClient } from '@sanity/client';

export const client = createClient({
	projectId: 'vs8d5hbw',
	dataset: 'production',
	useCdn: false,
	apiVersion: '2025-01-01',
});

/**
 * Fetch the homepage singleton document.
 */
export async function getHomepage() {
	return client.fetch(`*[_type == 'homepage'][0] {
		_id,
		_type,
		headline,
		subheadline,
		bio,
		ctaLabel,
		ctaLink
	}`);
}

/**
 * Fetch all case studies sorted by year descending.
 */
export async function getAllCaseStudies() {
	return client.fetch(`*[_type == 'caseStudy'] | order(year desc) {
		_id,
		title,
		slug,
		summary,
		role,
		year,
		coverImage,
		client-> {
			_id,
			name,
			logo
		}
	}`);
}

/**
 * Fetch a single case study by slug.
 */
export async function getCaseStudyBySlug(slug: string) {
	return client.fetch(`*[_type == 'caseStudy' && slug.current == $slug][0] {
		_id,
		title,
		slug,
		summary,
		role,
		year,
		coverImage,
		body,
		client-> {
			_id,
			name,
			website
		}
	}`, { slug });
}

/**
 * Fetch all clients.
 */
export async function getAllClients() {
	return client.fetch(`*[_type == 'client'] | order(name asc) {
		_id,
		name,
		website,
		logo,
		description
	}`);
}

/**
 * Fetch all blog posts sorted by published date descending.
 */
export async function getAllBlogPosts() {
	return client.fetch(`*[_type == 'blogPost'] | order(publishedAt desc, _createdAt desc) {
		_id,
		title,
		slug,
		excerpt,
		publishedAt,
		coverImage
	}`);
}

/**
 * Fetch a single blog post by slug.
 */
export async function getBlogPostBySlug(slug: string) {
	return client.fetch(`*[_type == 'blogPost' && slug.current == $slug][0] {
		_id,
		title,
		slug,
		excerpt,
		publishedAt,
		coverImage,
		body
	}`, { slug });
}