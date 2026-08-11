/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
	PUBLIC_SANITY_PROJECT_ID: string;
	PUBLIC_SANITY_DATASET: string;
	PUBLIC_SANITY_VISUAL_EDITING_ENABLED: string;
	SANITY_API_READ_TOKEN: string;
	SANITY_PREVIEW_URL_SECRET: string;
}
