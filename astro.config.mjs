// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import cloudflare from '@astrojs/cloudflare';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_PREVIEW_URL_SECRET, SANITY_STUDIO_URL } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'',
);

// Debug: log env vars at build time
console.log('[SANITY CONFIG] Build-time env check:');
console.log('  PUBLIC_SANITY_PROJECT_ID:', PUBLIC_SANITY_PROJECT_ID);
console.log('  PUBLIC_SANITY_DATASET:', PUBLIC_SANITY_DATASET);
console.log('  PUBLIC_SANITY_VISUAL_EDITING_ENABLED:', process.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED);
console.log('  SANITY_API_READ_TOKEN:', process.env.SANITY_API_READ_TOKEN ? '✅ present' : '❌ missing');
console.log('  SANITY_STUDIO_URL:', SANITY_STUDIO_URL || '❌ missing (using localhost fallback)');
console.log('  SANITY_PREVIEW_URL_SECRET:', SANITY_PREVIEW_URL_SECRET ? '✅ present' : '❌ missing');

export default defineConfig({
	output: 'server',
	adapter: cloudflare(),
	integrations: [
		react(),
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET || 'production',
			useCdn: false,
			apiVersion: '2025-01-01',
			studioBasePath: '/admin',
			studioRouterHistory: 'hash',
			stega: {
				studioUrl: SANITY_STUDIO_URL || 'http://localhost:4321/admin',
			},
			previewUrlSecret: SANITY_PREVIEW_URL_SECRET,
		}),
	],
	vite: {
		server: {
			cors: true,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		},
		optimizeDeps: {
			include: [
				'react/compiler-runtime',
				'humanize-list',
				'object-inspect',
			],
		},
	},
});
