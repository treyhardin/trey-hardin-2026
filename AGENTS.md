## Development

When starting the dev server, use background mode with `--host` so it binds to all interfaces (not just IPv6 localhost):

```
astro dev --host --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Without `--host`, the server binds to `[::1]:4321` only, which is unreachable from other machines on the network.

### Dual Adapter Setup

- **Local dev (`astro dev`):** Uses `@astrojs/node` adapter — avoids Miniflare entirely, runs fine on the Pi.
- **Production builds (Cloudflare Pages):** Uses `@astrojs/cloudflare` adapter — `NODE_ENV=production` triggers the cloudflare adapter automatically.
- The adapter swap is handled in `astro.config.mjs` via `isProduction` check.

## Sanity CMS Integration

**Status:** All pages return HTTP 200. Studio loads at `/admin`. Presentation tool loads but shows "Unable to connect" in the preview iframe — **active blocker**.

### Architecture
- All GROQ queries route through `src/sanity/lib/load-query.ts` which accepts a `perspective` parameter (`'previewDrafts' | 'drafts' | 'published' | undefined`)
- `src/lib/sanity.ts` wraps `loadQuery` for each content type (homepage, caseStudy, blogPost, client)
- `src/layouts/base.astro` handles draft mode detection via `getDraftModeProps(Astro.cookies)` — pages should NOT pass perspective props to the layout
- `src/lib/resolve.ts` maps document types to frontend routes using `defineLocations` from `sanity/presentation`

### Key Configuration
- **Project ID:** `vs8d5hbw`, **Dataset:** `production`
- **API Version:** `2025-01-01`, **useCdn:** `false`
- **`SANITY_API_READ_TOKEN`** in `.env` — required for draft queries (read-only token)
- **`SANITY_PREVIEW_URL_SECRET`** in `.env` — secures draft mode toggle endpoints
- **`previewUrlSecret`** injected into Astro config via `loadEnv` + Sanity plugin config
- **Output:** `server` (required for draft mode cookie detection)

### Visual Editing Status
- **Confirmed working on staging** (`https://staging.treyhardin.com`)
- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` must be lowercase `'true'` at build time
- `load-query.ts` uses case-insensitive runtime check (`.toLowerCase() === 'true'`)
- `stega.studioUrl` reads from `SANITY_STUDIO_URL` env var with localhost fallback

### Import Path Rules
- From `src/pages/`: use `../lib/`, `../layouts/`, `../sanity/lib/`
- From `src/pages/work/` or `src/pages/blog/`: use `../../lib/`, `../../layouts/`, `../../sanity/lib/`

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
