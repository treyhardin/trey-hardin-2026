# Design

<!-- impeccable:design-schema 1 -->

## Visual World

Understated and restrained. Almost mysterious — the kind of site that feels like a door left slightly open. Text-first, minimal UI chrome. Images and video appear only through interaction, never as decoration on the landing page. Confident without being loud. The work proves the craft; the frame stays quiet.

## Palette

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#fafafa` | Off-white ground, warm neutral |
| `--color-text` | `#1a1a1a` | Near-black body text |
| `--color-text-muted` | `#6b6b6b` | Secondary text, metadata |
| `--color-accent` | `#000000` | Links, interactive states |
| `--color-border` | `#e5e5e5` | Subtle dividers |

## Type

| Token | Stack | Role |
|---|---|---|
| `--font-body` | `Inter, system-ui, sans-serif` | Body, headings — single typeface throughout |
| `--font-mono` | `IBM Plex Mono, monospace` | Timestamps, metadata, small labels |

**Scale:** Single size for body copy (16px). Heading is one step up (20px, medium weight). No more than two sizes total. The hierarchy comes from spacing and position, not scale.

## Spacing

| Token | Value | Role |
|---|---|---|
| `--space-xs` | `0.5rem` | Inline gaps |
| `--space-sm` | `1rem` | Paragraph spacing |
| `--space-md` | `2rem` | Section gaps |
| `--space-lg` | `4rem` | Major sections |
| `--space-xl` | `8rem` | Hero breathing room |

## Layout

- Single column, max-width 640px, centered
- No grid, no cards, no containers with borders
- Generous whitespace — the page breathes
- Content sits in the upper-middle portion of the viewport, not flush top

## Components

### Heading Statement

A single line or two. The name, the role, or a statement. Nothing more. Centered vertically in the upper portion of the viewport. Medium weight. No tagline. No subtitle gradient. Just the words.

### Contact Links

Simple text links, stacked vertically or inline with spacing tokens. No buttons. No icons. No social media badges. Just the link text — "Email", "Twitter", "LinkedIn" — in the muted color, turning to accent on hover.

### Work Teaser (optional, below fold)

A minimal list. Year, project name, one line. No thumbnails. Hovering reveals the image in a subtle way — a lightbox, an expand, or a cursor-follow. The default state is text only.

## Motion

- No entrance animations on page load — content is simply there
- Hover states: underline appears, color shifts. Nothing bounces or slides
- Image reveals: fade in over 300ms, no transform
- Respect `prefers-reduced-motion` — disable all transitions

## Interaction

- Images/video appear on hover or click, never by default
- Cursor changes to indicate interactive elements
- No modals, no drawers, no carousels
- Navigation is implicit — the landing page IS the navigation

## States

- **Default:** Text only, minimal, quiet
- **Hover:** Subtle underline or color shift on links
- **Active:** Image/video reveal with fade
- **Loading:** Skeleton text lines (no spinners)
- **Empty:** Just whitespace — the page is comfortable being empty

## Accessibility

- WCAG AA contrast ratios throughout
- Focus states visible on all interactive elements (outline, not color-only)
- Semantic HTML — `<main>`, `<nav>`, `<a>`, no `<div>` soup
- Page title and meta description for search/social sharing
- No auto-playing media

## Principles

1. **Less is the point** — every element earns its place
2. **Text first** — images support, never lead
3. **Quiet confidence** — no exclamation marks, no gradients, no "hero" sections
4. **Reveal, don't display** — interaction unlocks depth
5. **Fast is the feature** — minimal assets, instant load
