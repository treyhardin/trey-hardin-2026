// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	''
);

export default defineConfig({
	adapter: cloudflare(),
	integrations: [
		...(PUBLIC_SANITY_PROJECT_ID ? [sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET || 'production',
			useCdn: false,
			studioBasePath: '/admin',
			logClientRequests: 'dev',
		})] : []),
		react(),
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
			],
		},
	},
});
