// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import node from '@astrojs/node';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_PREVIEW_URL_SECRET, SANITY_STUDIO_URL, PUBLIC_SANITY_VISUAL_EDITING_ENABLED } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'',
);

// Hybrid rendering: static by default, SSR only when visual editing is enabled.
const enableVisualEditing = PUBLIC_SANITY_VISUAL_EDITING_ENABLED?.toLowerCase() === 'true';

// Adapter selection:
// - Static mode: no adapter needed (pure static files)
// - SSR + local dev: @astrojs/node (avoids Miniflare OOM on Pi)
// - SSR + production/staging: @astrojs/cloudflare
const isProduction = process.env.NODE_ENV === 'production';
const adapter = enableVisualEditing
	? isProduction
		? (await import('@astrojs/cloudflare')).default()
		: node({ mode: 'standalone' })
	: undefined;

export default defineConfig({
	output: enableVisualEditing ? 'server' : 'static',
	adapter,
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
