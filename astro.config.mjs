import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import impeccable from 'impeccable';

export default defineConfig({
	adapter: cloudflare(),
	integrations: [
		sanity({
			projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
			dataset: import.meta.env.PUBLIC_SANITY_DATASET,
			stega: {
				studioUrl: 'http://localhost:3333',
			},
		}),
		impeccable(),
		react(),
	],
	vite: {
		optimizeDeps: {
			include: [
				'react/compiler-runtime',
				'lodash/isObject.js',
				'lodash/groupBy.js',
				'lodash/keyBy.js',
				'lodash/partition.js',
				'lodash/sortedIndex.js',
			],
		},
	},
});
