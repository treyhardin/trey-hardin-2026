# Impeccable Critique — `src/pages/index.astro`

**Generated:** 2026-08-08
**Target:** Portfolio landing page (`index.astro` + `base.astro`)
**Specs:** `DESIGN.md` (visual), `PRODUCT.md` (product goals)
**Status:** 5 findings — 3 critical, 2 major

---

## Finding 1: Tweak System & Component Library Ship to Production

**Severity:** 🔴 Critical
**Category:** Design — "Less is the point"
**Impact:** ~400 lines of CSS + JS for features that contradict the design spec

### What's wrong

The site ships a full "tweak system" (FAB gear button → popup menu → slide-out drawers with color pickers and typography sliders) and a complete component library (buttons ×3 variants, cards, badges, accordions, inputs, checkboxes). DESIGN.md specifies:

> "No modals, no drawers, no carousels" (line 70)
> "No buttons. No icons. No social media badges." (line 53)
> "Less is the point — every element earns its place" (line 91)

This reads like a design-system starter kit, not a minimal portfolio.

### Evidence

- `.tweak-toggle`, `.tweak-menu`, `.tweak-drawer`, `.tweak-overlay` — ~200 lines CSS
- Inline JS for drawer open/close, escape key, click-outside — ~150 lines
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` — never used on landing page
- `.card`, `.badge`, `.accordion` — never used on landing page

### Fix

Remove the entire tweak system and unused component styles. If design-time controls are needed, move them to a dev-only script gated by `import.meta.env.DEV`.

**Accept this finding?** [Yes / No]

---

## Finding 2: Typography Deviates from Spec

**Severity:** 🔴 Critical
**Category:** Design — Type system
**Impact:** Wrong fonts, 7+ sizes vs max 2, body too small

### What's wrong

DESIGN.md specifies Inter/system-ui for body and headings, IBM Plex Mono for metadata, max 2 sizes (16px body, 20px/medium heading). The implementation uses:

- **MD Nichrome** for headings (loaded as web font, not in spec)
- **Helvetica Neue** for body (close to Inter but not the specified stack)
- **7+ type sizes** via exponential cascade (`--sg-font-scale: 1.3`): h1 through h6, body, caption, utility, meta
- **Body at 14px** (0.875rem) instead of 16px (1rem)
- **Hero heading at ~2.86rem** (calc-based) instead of 20px/medium

### Evidence

```css
/* base.astro — actual */
--font-body: "Helvetica Neue", sans-serif;
--font-heading: "MD Nichrome", serif;
--font-size-body: 0.875rem;  /* 14px */
--sg-font-scale: 1.3;  /* exponential cascade */

/* DESIGN.md — spec */
--font-body: Inter, system-ui, sans-serif;
--font-mono: IBM Plex Mono, monospace;
/* Body: 16px, Heading: 20px medium, max 2 sizes */
```

### Fix

1. Replace font stacks: `Inter, system-ui, sans-serif` for body+headings; `IBM Plex Mono, monospace` for metadata
2. Remove MD Nichrome font import
3. Collapse type scale to two sizes: `1rem` (body) and `1.25rem/500` (heading)
4. Remove `--sg-font-scale` exponential cascade

**Accept this finding?** [Yes / No]

---

## Finding 3: Layout Width Nearly 2× Spec

**Severity:** 🔴 Critical
**Category:** Design — Layout
**Impact:** Content spreads too wide, undermines "single column, centered" spec

### What's wrong

DESIGN.md specifies max-width 640px, centered. The implementation uses `--max-page-width: 75rem` (1200px), which is nearly double the intended width. Combined with a 1rem page margin, this creates a wide reading experience that contradicts "generous whitespace" and "the page breathes."

### Evidence

```css
/* base.astro — actual */
--max-page-width: 75rem;  /* 1200px */
--page-margin: var(--space-4);  /* 1rem */

/* DESIGN.md — spec */
/* Single column, max-width 640px, centered */
```

### Fix

Set `--max-page-width: 40rem` (640px) and increase page margin for breathing room.

**Accept this finding?** [Yes / No]

---

## Finding 4: Accessibility Violations — Motion & Heading Hierarchy

**Severity:** 🟡 Major
**Category:** Accessibility — WCAG 2.x AA
**Impact:** Users with reduced-motion preferences affected; screen reader confusion from duplicate h1

### What's wrong

Two WCAG violations:

1. **No `prefers-reduced-motion` support** (2.3.3 Animation from Interactions, Level A) — CSS includes smooth scroll, spring transitions, card hover transforms, accordion animations, and drawer slide-in. Users who set OS-level reduced motion still experience all animations.

2. **Two `<h1>` elements on the page** (1.3.1 Info and Relationships) — one in the header ("Trey Hardin") and one in main content (hero statement). Screen readers use heading order for navigation; duplicate top-level headings create confusion.

### Evidence

```html
<!-- index.astro — two h1s -->
<header><nav><a href="/"><h1>Trey Hardin</h1></a></nav></header>
<main>
  <h1 class="hero-heading">Design lead. 10+ years...</h1>
</main>
```

No `@media (prefers-reduced-motion: reduce)` query exists in the CSS.

### Fix

1. Add reduced-motion media query that disables all transitions/animations
2. Demote header name to `<span class="site-name">` — it's a nav link, not a page heading

**Accept this finding?** [Yes / No]

---

## Finding 5: Links Indistinguishable & Contrast Risk

**Severity:** 🟡 Major
**Category:** Accessibility — WCAG 2.x AA
**Impact:** Visually impaired users cannot identify interactive elements; secondary text on card backgrounds fails contrast

### What's wrong

1. **Links use `color: inherit` with `text-decoration: none`** — they only show underline on hover. Users who cannot perceive hover states (motor impairment, screen magnification) cannot distinguish links from body text. Violates 1.4.1 Use of Color.

2. **Secondary text (#6b6b6b) on secondary backgrounds (#f0f0f0)** yields ~4.32:1 contrast, below the 4.5:1 AA threshold for normal text. Badge text inside tweak drawers triggers this failure.

### Fix

1. Add persistent visual indicator to links (subtle default underline or distinct color)
2. Darken `--color-fg-secondary` from `#6b6b6b` to `#636363` on light theme

**Accept this finding?** [Yes / No]

---

## Summary

| # | Finding | Severity | Category | Status |
|---|---------|----------|----------|--------|
| 1 | Tweak system & component library in production | 🔴 Critical | Design | Pending |
| 2 | Typography deviates from spec (fonts, sizes, scale) | 🔴 Critical | Design | Pending |
| 3 | Layout width 2× spec (1200px vs 640px) | 🔴 Critical | Design | Pending |
| 4 | Missing prefers-reduced-motion + duplicate h1 | 🟡 Major | Accessibility | Pending |
| 5 | Links indistinguishable + contrast risk | 🟡 Major | Accessibility | Pending |

**Overall:** The implementation has a solid semantic foundation (landmarks, focus-visible, ARIA on accordions) but is overbuilt by ~3–4× what DESIGN.md calls for. The site reads like a design-system starter kit rather than a minimal, text-first portfolio. The three critical findings all relate to stripping excess and aligning with the "less is the point" principle.

---

*Critique saved to `.impeccable/critiques/src-pages-index-astro.md`*
