# UI/UX Specification — Locked Decisions

## Visual Style

- **Aesthetic**: modern, high-quality, glassmorphism-inspired. Transparent/translucent panels with subtle black accents.
- **Canvas background**: dark, with a subtle dot-grid pattern (not blank/flat).
- **Node cards**: dark, semi-transparent/glassy panels, soft border, rounded corners — not solid opaque blocks.
- **Accent color**: electric green (`#22c55e` or close equivalent). Used for active/interactive states — selected node border, active decision branch, active toolbar icon, highlighted path on hover.
- **Edges**: curved, with arrowheads styled appropriately per connection/node type.

## Theme Toggle

- Light and dark mode, user-switchable.
- Applies across canvas background, node cards, toolbar, and all UI chrome.
- Logo assets that are theme-dependent (e.g. GitHub logo) swap per theme:
  - Dark mode → light/white GitHub logo
  - Light mode → dark GitHub logo

## Floating Toolbar

- **Shape**: floating vertical pill/capsule, dark translucent background, icon-only buttons stacked vertically with generous spacing, subtle hover/active highlight (active state uses accent color).
- **Default position on load**: left edge, vertical orientation.
- **Reposition**: toolbar can be docked to any of the 4 edges — top, bottom, left, right.
  - Top/bottom docking → toolbar switches to horizontal layout.
  - Left/right docking → toolbar stays vertical layout.
- **Reposition methods** (both supported):
  1. Tap a dedicated reposition/dock button on the toolbar to cycle/snap to an edge.
  2. Drag the toolbar itself — it snaps to the nearest edge on release.
- **Contains**: search, theme toggle, reset view, phase filter, minimap toggle, and other diagram controls (one icon each).

## Interaction Features (Locked)

- **Click-to-focus**: clicking a node pans/zooms to center it and dims unrelated nodes, highlighting its direct connections.
- **Path highlighting**: hovering a node highlights its full upstream/downstream chain, not just immediate edges.
- **Phase filter/toggle**: show/hide a phase (Local Development / CI / CD-Deployment / Production) to reduce clutter.
- **Search/jump**: type a node name to jump/pan to it.
- **Minimap**: overview panel (React Flow's built-in minimap) for orientation when zoomed in.
- **Reset view button**: one click returns to default fit-to-view.
- **Keyboard nav**: arrow keys / tab to move between connected nodes, for accessibility.

## Layout Direction

- **Desktop/default**: left-to-right (LTR) flow.
- **Mobile/small screens**: flow direction switches to top-to-bottom (TTB).

## Mobile-Specific Behavior

- **Toolbar**: docks to the top of the screen automatically on small screens.
- **Diagram flow**: switches from horizontal (LTR) to vertical (TTB).
- **Tooltip trigger**: tap a node to show its tooltip/popup; tap elsewhere to dismiss. (Hover doesn't exist on touch, so tap replaces it — avoids conflicting with drag-to-reposition gestures.)
- **Zoom transition**: smooth, animated zoom where nodes outside the focal area gradually blur and fade in opacity as the user zooms in — creates a depth-of-field effect that draws focus to the area being explored. Not an instant snap zoom.

## Tooltip/Popup Content

- Source: `node-cards.json`, keyed by node id.
- Shown on hover (desktop) or tap (mobile).
- Content should be quick to read — the cards are short, tight-paragraph blurbs, not full documentation.
