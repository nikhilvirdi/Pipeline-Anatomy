# Pipeline Anatomy

## The Project

Pipeline Anatomy is a single-page web application that lets people explore a CI/CD pipeline by interacting with it instead of reading a static image. The diagram is the interface: hover a node to learn what that step does, click a phase to jump to the written explanation, drag nodes around, watch the pipeline build itself step by step if you want to.

The scope right now is CI/CD only. Other pipeline types get added later as they're learned, so the structure has to accommodate that without a rewrite. Nothing about the current build should assume CI/CD is the only pipeline that will ever exist.

## The Problem It Solves

A PNG, an SVG, or a `.drawio` file all give the reader the same thing: a picture they look at. The diagram already encodes phases, decision points, failure paths, and a feedback loop, but a static image can't show any of that as behavior. It shows the boxes and leaves the reader to reconstruct the logic themselves.

The webpage exists so the pipeline can be explored rather than deciphered. It also splits reading from exploring, so someone who just wants the prose isn't forced through an interactive experience to get it, and someone who wants to see the flow move isn't stuck squinting at a wide static image.

## Repository Layout

Two repositories, separated by reader intent.

**`CICD-pipeline-anatomy`** (exists, docs only)

Eight Markdown files, no code. This is for someone who wants to read and nothing else. The README links out to the visualizer for anyone who wants the interactive version.

Heading convention across all eight files: a single `#` H1 for the file's topic, then `###` H3 for every subtopic. `##` H2 is deliberately skipped. This applies uniformly across `00` through `06`.

```
CICD-pipeline-anatomy/
├── README.md
├── 00-what-is-ci-cd.md
├── 01-local-development.md
├── 02-continuous-integration.md
├── 03-continuous-delivery-deployment.md
├── 04-production-and-observability.md
├── 05-deployment-strategies.md
├── 06-tooling-landscape.md
```

**`pipeline-anatomy`** (new, codebase)

The web application. This is where all code lives. It reads from the docs repo's content but does not duplicate the docs repo's purpose.

The reader path is: docs repo → visualizer link in README → webpage.

The codebase repo also holds local folders that support the build but aren't themselves shipped as part of the deployed app: `diagram/` (the source `.drawio` XML and its HTML export), `icons/` (the icon assets referenced in Features → Icons), `node-cards/` (resolved, see below), and `cicd-pipeline-anatomy/` — a local copy of the docs repo's prose, kept so an agent has the full written explanations on hand as reference while writing any doc-derived content in the app, without needing to fetch the other repo. This local copy can drift from the live docs repo (it's already lost the numeric filename prefixes) and that's fine; it's reference material, not a synced mirror.

## Source of Truth

Order of authority when anything conflicts:

1. **The original draw.io diagram (XML).** Canonical for every node, edge, decision point, phase boundary, and the overall flow. Supplied and converted; see `diagram/diagram-data.json`, which is the resolved, corrected output any agent should build from directly rather than re-parsing the XML.
2. **This file.** Canonical for scope, features, design constraints, and what was deliberately rejected.
3. **The nine Markdown docs.** Canonical for the written explanation of each step. Content has been edited on GitHub since it was drafted; the current GitHub versions win.

An agent working on this project does not invent pipeline steps. If a step isn't in the XML or listed under "Diagram Structure" below, it doesn't go in.

## Diagram Structure

The XML is authoritative. What follows is the node list including the agreed additions, which expand single blocks into their logical sub-steps while keeping the original flow and structure intact.

### Local Development Phase

Four steps prepended ahead of the original flow:

- Ideation
- Architecture
- Tech Stack Locked In
- Development (Writing the Code)

Then the original flow continues unchanged:

- Local Testing, Linters, Formatters, Type Checks, Builds etc.
- Fail (decision)
- Debug & Fix the Code (loops back to Local Testing on `Yes`)
- Commit & Push the Code (on `No`)
- GitHub
- Open Pull Request

### Continuous Integration Phase

- Pull Request is Merged
- Checkout Source Code
- CI System: Jenkins, GitHub Actions, GitLab CI/CD
- Install Dependencies
- Build the Application
- Security Scan (SAST)
- Run Unit Tests (split from `Execute Tests`)
- Run Integration Tests (split from `Execute Tests`)
- Code Coverage Check
- Store Artifact in Registry
- Task Failed (decision)
- Pipeline Stops (on `Yes`)
- Developer fixes the issue and pushes new code & commit (loops back to Commit & Push)

### Continuous Delivery / Deployment Phase

- CD System: Jenkins, GitHub Actions, GitLab CI/CD
- Manual Approval Gate? (decision)
- Pipeline Stops (on `Rejected`)
- Fetch Build Artifacts (on `Approved`)
- Inject Config & Secrets
- Package into Container Image (split from `Docker Hub`)
- Push Image to Docker Hub (split from `Docker Hub`)
- Pull the image and deploy
- Staging Server
- Run Smoke Tests (split from `Run Smoke Tests / Health Check`)
- Run Health Check (split from `Run Smoke Tests / Health Check`)
- All Checks Pass (decision)
- Notify Developer Team (on `No`)
- Developer fixes (loops back to CD System)
- Deployment Strategy: Blue-Green / Canary / Rolling / Recreate (on `Yes`)

### Production Phase

No splits. The original nodes are already granular enough, and adding more would mean inventing steps the source doesn't have.

- Automated / Manual Deployment (Production)
- Post-Production Health Check
- Rollback (on fail, loops back to Notify Developer Team)
- End Users
- Notify Team: Success
- Monitoring & Observability (one-directional to End Users)

### Decision Points

Five confirmed decision points:

- Fail (Local Development)
- Task Failed (Continuous Integration)
- Manual Approval Gate? (Continuous Delivery)
- All Checks Pass (Continuous Delivery)
- Post-Production Health Check (Production) — drawn as a rectangle in the source, not a diamond, but resolved and locked as the fifth decision point, with the same fail-path-then-success-path treatment in the animation as the other four.

## Design Constraints

Black and white only. A light/dark theme toggle, and nothing else.

Explicitly out: cyberpunk, neon, modern color palettes, brutalism, gradients as decoration, and any other style that draws attention to itself. The visual register matches the docs: dry, structured, no ornament, no emoji.

Typeface: **Source Serif 4** (Google Fonts, SIL Open Font License), self-hosted in the repo. Locked in as a licensable, editorial-serif alternative in the same register as Anthropic's own brand typeface, without the licensing and affiliation problems of using that typeface directly.

Simplicity, usability, and clarity are the criteria any design decision gets judged against. If a proposed addition doesn't serve one of those, it doesn't belong.

## Application Scope

Single page. No authentication, no login, no user accounts, no backend requirement. It should be hostable as a static site.

## Features

### Diagram Interaction

Hovering a node shows a small information card explaining that step. Card content is two-tiered:

- **Nodes with an original floating note.** The source diagram has five freestanding annotations, each tied to a specific node rather than floating loosely: the explanation of a Git push (near Commit & Push the Code), the explanation of a pull request (near Open Pull Request), "Storing the Code in GitHub Repository" (near GitHub), "CI Pipeline Trigger" (near Pull Request is Merged), and "A Machine / Server" (near the CI System node). These are already written at the right length and register for a student reading the diagram, so the hover card for these nodes uses that note directly rather than pulling from the docs.
- **Every other node.** Content is hand-authored per node, one Markdown file per node, checked into the codebase repo, and read at build time. This is a locked decision, not the runtime-fetch alternative: the content is baked into the site when it's published, so it loads fast and has no dependency on GitHub being reachable. Editing a card later means editing its file and republishing, not something that updates automatically.

All node card content, including the five floating-note nodes, lives in one folder for consistency: `node-cards/`, one file per node, filename matching the node's slug (kebab-case, e.g. `checkout-source-code.md`, `manual-approval-gate.md`). The file's content is the card text as plain Markdown prose, no frontmatter, no heading, since the node's label is already known by the app and doesn't need to be repeated inside the card. An agent reading a node's data can resolve its card by loading `node-cards/{slug}.md`.

Nodes are draggable and can wobble. Connections between nodes stay attached no matter where a node is moved. A manual reset button returns every node to its default position. Positions do not persist and do not reset on refresh; the reset button is the only way back to default.

Pan and zoom are required, not optional. The diagram is wide enough that it won't fit a laptop screen at a readable size, let alone a phone, so the page doesn't function without them.

Touch support covers both dragging and panning. On narrow screens, portrait orientation is the default.

### Icons

Icons go only where they add value: Docker for containerization, GitHub where GitHub is involved, ESLint where linting happens, and similar. Not on every node. An icon that doesn't clarify anything is decoration, and decoration is out.

### Navigation and Docs

A classic navigation menu on the left side, linking to the documentation. Clicking a phase in the diagram jumps to that phase's documentation directly, so there are two routes into the same content.

Phases are deep-linkable. Clicking a phase updates the URL (`#continuous-integration` and so on) so a specific phase can be linked to from outside the page.

### Theme

Light and dark toggle. The choice persists across refreshes. The user can toggle at any time, before or after any other interaction.

### Keyboard Support

Escape closes an open information card. Tab and arrow keys move focus between nodes.

### Author Acknowledgment

A small button crediting the author. Small is the operative word.

### Animation

Opt-in only, triggered by a "Watch Animation" button. It never runs on load and is never forced on anyone. The diagram loads static by default.

When it runs, it goes fullscreen, presentation-style: blurred background, semi-transparent black glassmorphism overlay.

The first node appears in the center. An arrow animates out of it, then the next node appears, then the next arrow, continuing until the whole pipeline is built.

At each decision point, the animation shows both outcomes: the failure path first, then the success path. This is what makes the execution flow legible, so it isn't optional polish.

A control bar sits at the bottom center of the fullscreen view, with play/pause and step forward/back. A full build-up across thirty-odd nodes with four branching points runs long, and someone who cares about one specific step shouldn't have to sit through the rest to reach it.

### Orientation Toggle

The diagram switches between landscape (left to right) and portrait (top to bottom), in both directions.

The transition runs about six to seven seconds. Nodes don't teleport and don't slide directly into place. The animation shows them being picked up and set down in their new positions, the way you'd move a physical object. Connections and visual effects hold throughout the transition.

## On Hold

Not rejected, not scheduled. Revisit after the current scope ships.

- **Per-node deep links** (`#sast` rather than only `#continuous-integration`). A small extension of the phase-level anchors already planned.

## Rejected, With Reasons

Listed so they don't get proposed again.

- **Legend** explaining diamond versus rectangle. Declined.
- **Forced intro animation.** Replaced by the opt-in button. Nobody should have to watch an animation to see the diagram.
- **Reset on refresh** for node positions. Replaced by the manual reset button.
- **Search, filter, export, print view, minimap.** None of these are what a one-page interactive document needs.
- **Multi-diagram switcher.** Premature. Other pipeline types come later; the architecture should allow them, but the UI shouldn't anticipate them yet.

## Open Decisions

Monitoring & Observability directionality is resolved: one-directional (`monitoring-observability → end-users` only), matching the source XML and `diagram-data.json`. The earlier draft of this section describing it as bidirectional was wrong and has been corrected above.

`CI Pipeline Trigger` is not a node — first suspected from a cropped export showing it styled like "A Machine / Server" (no border, floating-text style), now confirmed definitively from the parsed XML: it has zero edges in or out, same as the other four floating notes, while every real node has at least one. It's the fifth floating note, tied to `Pull Request is Merged`. The original proposal to insert it as a boxed node was incorrect and is retracted.

`Post-Production Health Check` is resolved: it is treated as a fifth decision point, alongside `Fail`, `Task Failed`, `Manual Approval Gate?`, and `All Checks Pass`, and gets the same fail-path-then-success-path treatment in the animation.

Info card sourcing is resolved: see "Diagram Interaction" above.

## Working Constraints for Agents

The XML is the structure. This file is the scope. The Markdown docs are the content. Do not invent steps, features, or styling beyond what is written here.

When something in this file is ambiguous, ask rather than assume. A wrong assumption about node structure means redoing the layout, and layout drives the animation, the orientation transition, and the drag behavior.

Scope creep is a known failure mode on this project. Features listed under Rejected were rejected deliberately. Features under On Hold are held deliberately. Neither list is an invitation.

## Derived Files

This file is the reference the following get built from:

- `CLAUDE.md` for Claude Code
- `workplan.md` or equivalent phase-by-phase implementation plan
- Any agent-specific configuration for Antigravity or other tools

Those files interpret this one. They don't override it.