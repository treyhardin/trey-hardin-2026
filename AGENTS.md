## Development

When starting the dev server, use background mode with `--host` so it binds to all interfaces (not just IPv6 localhost):

```
astro dev --host --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Without `--host`, the server binds to `[::1]:4321` only, which is unreachable from other machines on the network.

Node 22+ is required. Use `~/.local/bin/node` on the Pi (nvm has v20 which is too old):
```
PATH="/home/trumancreative/.local/bin:$PATH" npx astro build
```

## Hybrid Rendering

**Strategy:** Static by default, SSR only when `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true`.

**Deployment target:** Cloudflare Workers (Pages deprecated). `@astrojs/cloudflare` adapter always used in production.

### How it works (`astro.config.mjs`)
- Reads `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` at build time via `loadEnv`
- When `'true'` (case-insensitive): `output: 'server'` + cloudflare adapter → SSR on Workers
- When unset or anything else: `output: 'static'` + cloudflare adapter → static files served through Worker
- Local dev always uses `@astrojs/node` (avoids Miniflare OOM on Pi)

### Production (static)
- All pages prerendered at build time from published Sanity content
- Cloudflare adapter still present (Workers always needs it) — serves static assets
- Sanity Studio at `/admin` is NOT available (not needed on production)
- Draft mode endpoints at `/api/draft-mode/*` do not exist (no server routes)
- Stega data bakes into HTML at build time (harmless when no Studio is reachable)

### Staging (SSR + visual editing)
- Set `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` in Workers env vars
- `output: 'server'` with `@astrojs/cloudflare` adapter
- `/admin` Studio served by the adapter
- Draft mode cookies, perspective switching, visual editing overlays all work
- `getStaticPaths()` is ignored in SSR mode — pages render on each request

### Build notes
- SSR builds on Pi: OOM crash from Miniflare (expected — builds run on Cloudflare infra)
- `Astro.request.headers` warnings in static mode are from Sanity stega — harmless

## Sanity CMS Integration

**Status:** ✅ All systems operational. Visual editing + Presentation tool working on staging. Header singleton published with navigation links (Work, About, Writing, Clients).

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

### Draft Mode Endpoints
- `src/pages/api/draft-mode/enable.ts` — validates secret, sets `sanity-preview-perspective` cookie, redirects
- `src/pages/api/draft-mode/disable.ts` — clears cookie, redirects
- Only exist in SSR mode (staging with visual editing enabled)

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
