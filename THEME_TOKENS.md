# Theme Tokens

Concrete values for the locked visual spec in `UI_SPEC.md`, so components use consistent numbers instead of guessed ones.

## Colors

```js
// tailwind.config.js — extend.colors
colors: {
  accent: {
    DEFAULT: '#22c55e',   // electric green — active states, highlighted paths, active toolbar icon
    hover:   '#16a34a',   // slightly darker, for hover on accent elements
    muted:   '#86efac',   // light tint, for subtle accent backgrounds
  },
  loopback: {
    DEFAULT: '#f87171',   // muted/red-tinted — loop-back edge color
  },
  surface: {
    dark:  'rgba(15, 15, 15, 0.6)',   // node card / toolbar background, dark mode
    light: 'rgba(255, 255, 255, 0.6)', // node card / toolbar background, light mode
  },
  border: {
    dark:  'rgba(255, 255, 255, 0.08)',
    light: 'rgba(0, 0, 0, 0.08)',
  },
  canvasBg: {
    dark:  '#0a0a0a',
    light: '#f5f5f5',
  },
  dot: {
    dark:  'rgba(255, 255, 255, 0.06)',
    light: 'rgba(0, 0, 0, 0.06)',
  },
}
```

## Glassmorphism

```css
/* applied to node cards, toolbar, tooltips */
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid var(--border-color);
border-radius: 12px;
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
```

## Dot-Grid Background

```css
background-image: radial-gradient(var(--dot-color) 1px, transparent 1px);
background-size: 24px 24px;
```

## Typography

```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],   // UI chrome, labels
  mono: ['JetBrains Mono', 'monospace'],        // node ids, technical labels if shown
}
```

- Node label: `text-sm font-medium`
- Phase label: `text-xs font-semibold uppercase tracking-wide`
- Tooltip body: `text-sm leading-relaxed`

## Spacing / Sizing

- Node default (compact/fit-to-view): `~140px × 60px` (rect), scale up on zoom-in
- Toolbar pill: `48px` width (vertical) / `48px` height (horizontal), `8px` gap between icon buttons
- Toolbar icon button: `36px × 36px` hit target
- Edge stroke width: `2px` default, `2px dashed` for loop-back
- Border radius: `12px` (cards/toolbar), `8px` (buttons), `9999px` (toolbar pill container itself)

## Edge Styling

```js
// default edge
{
  stroke: 'var(--edge-default)',       // theme-dependent neutral (e.g. #6b7280)
  strokeWidth: 2,
  type: 'smoothstep',                  // curved
}

// loop-back edge
{
  stroke: '#f87171',                   // loopback.DEFAULT
  strokeWidth: 2,
  strokeDasharray: '6 4',
  type: 'smoothstep',
}

// highlighted path (on hover/click-focus)
{
  stroke: '#22c55e',                   // accent.DEFAULT
  strokeWidth: 2.5,
}
```

## Animation / Transitions

- Zoom transition: `300–400ms ease-out`
- Blur/fade on non-focal nodes during zoom: `opacity 0.3–1`, `blur 0–4px`, tied to zoom level, not a fixed delay
- Toolbar dock snap: `200ms ease-in-out`
- Node drag: no transition (instant follow), edges re-render every frame during drag

## Accent Color Usage Reference

Use `accent.DEFAULT` (`#22c55e`) consistently for:
- Selected/focused node border
- Active toolbar icon background
- Active decision branch highlight
- Search match highlight
- Highlighted upstream/downstream path on hover

Do not use accent green for error/failure states — loop-back/failure paths use `loopback.DEFAULT` (`#f87171`) instead, to keep "active/success" and "failure/retry" visually distinct.
