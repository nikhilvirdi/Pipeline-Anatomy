# Local Development

### Writing Code

This phase happens entirely on the developer's own machine, before any change touches a shared system. Work is usually done on a separate branch rather than directly on the main branch, which keeps the shared history clean: main stays in a state that's always safe to build on, while a branch can hold half-finished, broken, or experimental work without affecting anyone else. The branch is also what makes the next few steps possible, since it gives the change a clear boundary before it's merged back in.

### Local Testing and Checks

Before a change leaves the developer's machine, it typically goes through several kinds of checks:

- **Unit tests** — verifying that individual functions or components behave as expected.
- **Linters** (ESLint, Pylint, and similar) — catching style issues and common mistakes without running the code.
- **Formatters** (Prettier and similar) — enforcing consistent code style automatically.
- **Type checks** (TypeScript, mypy, and similar) — catching type mismatches before runtime.
- **Local builds** — confirming the project actually compiles or bundles successfully.

Running these locally, instead of waiting for CI to catch them, matters for a simple reason: this is the cheapest point at which a mistake can be caught. A typo or an unused import found by a linter on your own machine costs seconds. The same mistake found later in CI costs a full pipeline run, and if it's found even later, after review or in production, it costs far more. Local checks exist to catch what's catchable immediately, so CI is left to verify things that genuinely require a clean, shared environment.

### Handling Failures Locally

When a local check fails, the expectation is to debug and fix it before moving forward, not to push the change anyway and let CI catch it. This keeps the feedback loop tight: the developer who introduced the issue is also the one fixing it, with full context still fresh, rather than context-switching back into it after a CI notification arrives minutes or hours later.

### Committing and Pushing

A commit saves a snapshot of the current changes locally, along with a message describing what changed and why. The message matters beyond documentation: it's what makes the project's history usable later, whether that's tracing when a bug was introduced, understanding why a particular decision was made, or generating a changelog.

A push is a separate step: it takes commits that exist only on the local machine and uploads them to the remote repository. Nothing is shared with anyone else, and no pipeline is triggered, until this happens.

### Opening a Pull Request

A pull request is a request to merge one branch into another, most commonly a feature branch into main. Structurally, it's the point where a change stops being private work and becomes something proposed for the shared codebase. It hasn't merged yet, and it isn't part of main's history yet; it exists as a distinct, reviewable unit.

This is also the trigger boundary for everything that follows. Opening or updating a pull request is what kicks off the CI pipeline, and it's the point at which a human review gate sits alongside the automated one. Tests and linters catch what can be checked mechanically; review catches what requires judgment, like whether the change is even the right approach, which no automated check is positioned to evaluate. Both gates need to pass before the code moves into the next phase.