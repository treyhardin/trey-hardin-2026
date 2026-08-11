import type { AstroCookies } from 'astro';
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';

export function getDraftModeProps(cookies: AstroCookies) {
	const perspectiveCookie = cookies.get(perspectiveCookieName)?.value ?? undefined;
	return {
		perspectiveCookie,
		stega: !!perspectiveCookie,
	};
}
