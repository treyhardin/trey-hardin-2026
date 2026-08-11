// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import node from '@astrojs/node';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_PREVIEW_URL_SECRET } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'',
);

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
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
				studioUrl: 'http://localhost:4321/admin',
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
