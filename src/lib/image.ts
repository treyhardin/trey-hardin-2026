import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';

const builder = imageUrlBuilder(client);

/**
 * Helper to build optimized image URLs from Sanity image references.
 *
 * @example
 *   urlFor(image).width(800).auto('format').url()
 */
export function urlFor(source: any) {
	return builder.image(source);
}