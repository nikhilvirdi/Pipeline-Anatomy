@PROJECT.md

# Workplan

Small phases, on purpose. Each one has a single deliverable and a clear stopping point, so quality gets checked before scope grows, not after. Do not start a phase before the previous one is verified done. Do not pull work from a later phase into an earlier one, even if it seems convenient at the time.

Reference: `PROJECT.md` for scope and constraints, `CLAUDE.md` for stack and conventions.

## Blocking Prerequisite — Resolved

The draw.io XML was provided and Phase 1 is complete. `diagram/diagram-data.json` exists, with all corrections, splits, and additions documented inline (see its own fields: `source`, `note`). Phase 2 can begin.

## Phase 0 — Repo Scaffold

**Goal:** an empty, correctly configured project. No diagram, no features.

- Vite + React project, plain JavaScript.
- Tailwind CSS configured.
- ESLint (strict: `eslint-plugin-react-hooks`, `no-unused-vars` as error, `eslint-plugin-jsx-a11y`) and Prettier configured.
- Vitest wired up, even with zero tests yet.
- Folder structure in place, including `node-cards/`.
- `package.json` scripts confirmed: `dev`, `build`, `lint`, `test`.

**Out of scope:** any diagram code, any dependency beyond what's needed to run an empty app (no xyflow, no Motion, no Zustand yet).

**Done when:** `npm run dev` shows a blank styled page, `npm run lint` and `npm run test` both run clean with nothing to report.

## Phase 1 — Diagram Data Conversion — DONE

**Goal:** a single clean JSON file representing the diagram, derived from the XML.

- Converted the draw.io XML into `diagram-data.json`: 45 nodes, 47 edges, 5 floating notes, 5 decision points, 4 phase groupings.
- Cross-checked node-for-node against `node-cards/`: exact match both directions, no orphans either side.
- Corrections applied and documented inline in the JSON rather than silently fixed: one label typo, one repaired dangling edge, two excluded artifacts (a self-loop and five decorative divider lines misparsed as edges), three added nodes (Ideation, Architecture, Tech Stack Locked In), three node splits (per the earlier agreed single-block breakdowns).
- One unresolved discrepancy flagged, not silently picked: source XML draws Monitoring & Observability → End Users as one-directional; `PROJECT.md` describes it as bidirectional. Needs a decision before Phase 2 builds the edge.

## Phase 2 — Static Diagram Render

**Goal:** the diagram appears on screen, correctly, with zero interaction.

- Install xyflow. Render nodes and edges from `diagram-data.json`.
- Correct shapes: rectangles for steps, diamonds for the five decision points.
- Phase groupings visible, matching the original four-phase layout.
- Black and white only. No hover, no drag, no click behavior, no animation.

**Out of scope:** literally every feature in `PROJECT.md`'s Features section. This phase only proves the data renders faithfully.

**Done when:** the diagram matches the source image node-for-node, and nothing responds to any interaction yet.

## Phase 3 — Hover Info Cards

**Goal:** hovering any node shows its card.

- Wire `node-cards/*.md` into the app via `react-markdown`.
- Hover triggers a small card near the node, sourced by matching the node's slug to its file.

**Out of scope:** icons, theme, keyboard support, anything else.

**Done when:** every node's hover card shows the correct, matching text, and no node shows another node's card.

## Phase 4 — Navigation and Doc Links

**Goal:** the left nav and phase-to-doc links exist and go somewhere real.

**Decision needed before this phase starts, not assumed:** does clicking a phase or a nav link open the written explanation inside this app, or take the reader out to the docs repo on GitHub? Nothing in `PROJECT.md` resolves this explicitly. The working assumption, consistent with the docs repo existing specifically for people who "just want to read" and with node-cards being the only doc content actually duplicated into this repo, is an external link out to the relevant file in `CICD-pipeline-anatomy`. Confirm before building rather than after.

- Classic left-side nav, listing the phases (and further sections, pending the decision above).
- Clicking a phase in the diagram routes to the same destination as its nav entry.

**Out of scope:** deep-linking via URL hash — that's Phase 10, kept separate since it's a distinct piece of routing logic.

**Done when:** every phase has a working link, reachable both from the nav and from the diagram, and the external-vs-internal decision above is confirmed rather than assumed.

## Phase 5 — Theme Toggle

**Goal:** light/dark toggle, persisted.

- Toggle switches the whole app between the two themes.
- Choice persists across refresh via localStorage.
- Togglable at any time, independent of any other state.

**Out of scope:** any other feature. This is a single, isolated piece of state.

**Done when:** refreshing the page keeps the last-chosen theme, and no visual element breaks in either mode.

## Phase 6 — Keyboard Support

**Goal:** the page is usable without a mouse.

- Escape closes an open info card.
- Tab and arrow keys move focus between nodes.

**Out of scope:** drag, pan/zoom — those are next.

**Done when:** every node is reachable by keyboard alone, and Escape reliably closes whatever card is open.

## Phase 7 — Drag and Reset

**Goal:** nodes can be moved without breaking the diagram.

- Nodes draggable, with the specified wobble.
- Edges stay attached to nodes regardless of position.
- Manual reset button restores every node to its default position.
- No reset on refresh — positions simply stay wherever they were left, until Reset is pressed.

**Out of scope:** persistence of dragged positions across sessions. `PROJECT.md` explicitly doesn't ask for that.

**Done when:** dragging any node never detaches an edge, and Reset reliably restores the original layout.

## Phase 8 — Pan, Zoom, and Touch

**Goal:** the diagram is usable on a real screen, not just a wide monitor.

- Pan and zoom both work, on both mouse and touch.
- Dragging nodes also works on touch, not just mouse.
- Portrait orientation is the default on narrow screens.

**Out of scope:** the landscape/portrait *toggle* itself, which is Phase 15's animated transition. This phase only makes the default orientation choice correct and makes the diagram navigable at all screen sizes.

**Done when:** the diagram is usable end to end on a phone-width screen without anything falling off-screen or becoming undraggable.

## Phase 9 — Icons

**Goal:** icons appear only where `PROJECT.md` says they add value.

- Docker, GitHub, ESLint, and similar, attached to their specific nodes.
- No icon added anywhere not called for.

**Out of scope:** icon-driven interactions (clicking an icon to do something extra) — not requested anywhere in scope.

**Done when:** the icon list matches exactly what's named in `PROJECT.md`, nothing more.

## Phase 10 — Deep Linking

**Goal:** a phase can be linked to directly from outside the page.

- Clicking a phase updates the URL (`#continuous-integration`, etc.).
- Loading the page with that hash already in the URL jumps straight to the phase.

**Out of scope:** per-node deep links (`#sast`) — that's explicitly On Hold in `PROJECT.md`, not part of this build.

**Done when:** a copied URL with a phase hash reopens directly at that phase, every time.

## Phase 11 — Author Acknowledgment

**Goal:** the credit button exists and is small.

**Out of scope:** anything beyond a simple, unobtrusive credit. This is intentionally the smallest phase in the plan.

**Done when:** it's visible, correct, and doesn't compete visually with anything else on the page.

## Phase 12 — Animation: Build-Up Sequence

**Goal:** the opt-in "Watch Animation" button plays the pipeline building itself, without the branch logic yet.

- Fullscreen on trigger. Blurred background, semi-transparent black glassmorphism overlay.
- First node appears center. Arrow animates out, next node appears, repeating until the full pipeline (minus branch handling) is built.
- Never runs on load. Only runs when the button is pressed.

**Out of scope:** the fail/success branch visualization at decision points (Phase 13) and playback controls (Phase 14). This phase proves the base build-up animation works end to end first.

**Done when:** pressing the button plays the full sequence start to finish, and the static diagram is completely unaffected when the animation isn't running.

## Phase 13 — Animation: Decision Branches

**Goal:** each of the five decision points shows both outcomes during the build-up.

- At `Fail`, `Task Failed`, `Manual Approval Gate?`, `All Checks Pass`, and `Post-Production Health Check`: animate the failure path first, then the success path, before the sequence continues forward.

**Out of scope:** playback controls, still Phase 14.

**Done when:** all five decision points show fail-then-success correctly, in the right order, without the sequence stalling or skipping ahead.

## Phase 14 — Animation: Playback Controls

**Goal:** the viewer isn't stuck watching the whole thing straight through.

- Control bar, bottom-center of the fullscreen view: play/pause, step forward, step back.

**Out of scope:** anything beyond these three controls. No speed control, no scrubber, unless later requested.

**Done when:** pause stops exactly where expected, and step forward/back moves one node or one branch at a time without desyncing from the visual state.

## Phase 15 — Orientation Toggle

**Goal:** landscape and portrait, both directions, with the specified transition.

- Toggle switches left-to-right layout to top-to-bottom and back.
- Transition runs roughly six to seven seconds.
- Nodes animate as picked up and set down, not slid or teleported directly to their new position.
- Connections and visual effects hold throughout.

**Out of scope:** nothing left after this — it's the last feature phase.

**Done when:** the toggle works in both directions repeatedly without nodes ending up in the wrong position or edges breaking mid-transition.

## Phase 16 — Full QA Pass

**Goal:** confirm the built app matches `PROJECT.md` exactly, nothing more and nothing less.

- Walk every item in `PROJECT.md`'s Features section and confirm it's present and correct.
- Walk the Rejected and On Hold lists and confirm none of them quietly made it into the build.
- Test across desktop and mobile, mouse and touch, both themes, both orientations.

**Out of scope:** fixing scope, not adding it. Anything discovered missing goes back to its own phase, not bolted on here.

**Done when:** every checklist item passes, with no exceptions carried forward silently.

## Phase 17 — Deploy

**Goal:** the site is live.

- GitHub Actions workflow: build with Vite, deploy to GitHub Pages.
- Update this repo's `README.md` with the live link.
- Confirm the docs repo's README link to the visualizer points at the correct live URL.

**Done when:** the live link works from a fresh, unauthenticated browser session, and both repos' READMEs point at it correctly.