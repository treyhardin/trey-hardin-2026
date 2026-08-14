import { createClient } from '@sanity/client';
import { loadQuery } from '../sanity/lib/load-query';
import { HOMEPAGE_QUERY, CASE_STUDIES_QUERY, CASE_STUDY_QUERY, CLIENTS_QUERY, BLOG_POSTS_QUERY, BLOG_POST_QUERY, EXPERIMENTS_QUERY, EXPERIMENT_QUERY, HEADER_QUERY, FOOTER_QUERY } from '../sanity/lib/queries';

/**
 * Plain Sanity client for image URL building (urlFor helper).
 * Uses CDN endpoint for published documents only.
 */
export const client = createClient({
	projectId: 'vs8d5hbw',
	dataset: 'production',
	apiVersion: '2025-01-01',
	useCdn: true,
});

/**
 * Fetch the homepage singleton document.
 */
export async function getHomepage(perspectiveCookie?: string) {
	return (await loadQuery({ query: HOMEPAGE_QUERY, perspectiveCookie })).data;
}

/**
 * Fetch all case studies sorted by year descending.
 */
export async function getAllCaseStudies(perspectiveCookie?: string) {
	return (await loadQuery({ query: CASE_STUDIES_QUERY, perspectiveCookie })).data;
}

/**
 * Fetch a single case study by slug.
 */
export async function getCaseStudyBySlug(slug: string, perspectiveCookie?: string) {
	return (await loadQuery({ query: CASE_STUDY_QUERY, params: { slug }, perspectiveCookie })).data;
}

/**
 * Fetch all clients.
 */
export async function getAllClients(perspectiveCookie?: string) {
	return (await loadQuery({ query: CLIENTS_QUERY, perspectiveCookie })).data;
}

/**
 * Fetch all blog posts sorted by published date descending.
 */
export async function getAllBlogPosts(perspectiveCookie?: string) {
	return (await loadQuery({ query: BLOG_POSTS_QUERY, perspectiveCookie })).data;
}

/**
 * Fetch a single blog post by slug.
 */
export async function getBlogPostBySlug(slug: string, perspectiveCookie?: string) {
	return (await loadQuery({ query: BLOG_POST_QUERY, params: { slug }, perspectiveCookie })).data;
}

/**
 * Fetch all experiments sorted by year descending.
 */
export async function getAllExperiments(perspectiveCookie?: string) {
	return (await loadQuery({ query: EXPERIMENTS_QUERY, perspectiveCookie })).data;
}

/**
 * Fetch a single experiment by slug.
 */
export async function getExperimentBySlug(slug: string, perspectiveCookie?: string) {
	return (await loadQuery({ query: EXPERIMENT_QUERY, params: { slug }, perspectiveCookie })).data;
}

/**
 * Fetch the header singleton document containing navigation links.
 */
export async function getHeader(perspectiveCookie?: string) {
	return (await loadQuery({ query: HEADER_QUERY, perspectiveCookie })).data;
}

/**
 * Fetch the footer singleton document containing links and copyright text.
 */
export async function getFooter(perspectiveCookie?: string) {
	return (await loadQuery({ query: FOOTER_QUERY, perspectiveCookie })).data;
}
