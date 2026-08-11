## Development

When starting the dev server, use background mode with `--host` so it binds to all interfaces (not just IPv6 localhost):

```
astro dev --host --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Without `--host`, the server binds to `[::1]:4321` only, which is unreachable from other machines on the network.

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

### Draft Mode Endpoints
- `src/pages/api/draft-mode/enable.ts` — validates secret, sets `sanity-preview-perspective` cookie, redirects
- `src/pages/api/draft-mode/disable.ts` — clears cookie, redirects
- Cookie config: `httpOnly: false, sameSite: 'lax', secure: false` (HTTP localhost)

### Presentation Tool Config (`sanity.config.ts`)
```ts
presentationTool({
  resolve, // from ./src/lib/resolve.ts
  previewUrl: {
    origin: 'http://localhost:4321',
    preview: '/',
    previewMode: {
      enable: '/api/draft-mode/enable',
      disable: '/api/draft-mode/disable',
    },
  },
})
```

### Active Blocker: "Unable to connect" in Presentation iframe
- Studio loads, Presentation tab appears, but preview iframe shows connection error
- All routes return 200, including `/api/draft-mode/enable` (401 without secret — expected)
- Possible causes: embedded Studio at `/admin` on same origin causes iframe handshake failure; may need `previewUrl.origin` to point to a different host or the Studio to run on a separate port
- Next step: Investigate whether running Studio on a separate dev port or adjusting `previewUrl` config resolves the iframe connection

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
