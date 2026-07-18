# Continuous Integration

### What Triggers CI

A CI pipeline doesn't run continuously in the literal sense; it runs in response to specific events, almost always a commit pushed to a branch or a pull request being opened or updated. Once a pull request exists, every new commit pushed to it re-triggers the same pipeline, so the check always reflects the latest version of the change, not the version that existed when the PR was first opened.

### Why CI Runs on a Remote, Clean Machine

CI does not run on the developer's own machine. It runs on a fresh, disposable environment, provisioned specifically for that run and torn down afterward. This matters because a local machine accumulates state over time: cached dependencies, stray environment variables, globally installed tools, versions of things that quietly drift from what the project actually declares. Code that works locally can fail outright on a clean machine, and exposing that gap before it becomes someone else's problem is a large part of what CI is for. Running on a clean environment also means the result doesn't depend on whose machine it happened to run on; the same commit produces the same outcome no matter who pushed it.

### The Stage Sequence

A typical CI run moves through a fixed sequence of stages:

- **Checkout** — pulling the exact commit being tested from version control.
- **Dependency installation** — installing exactly what the project declares, not whatever happens to be cached.
- **Build** — compiling or bundling the project into a runnable form.
- **Static analysis (SAST)** — scanning the source code for security issues and unsafe patterns, without executing it.
- **Tests** — running unit and integration tests against the built project.
- **Coverage check** — verifying that enough of the codebase is actually exercised by the tests that just ran.

### Why the Order Is Fixed

None of this order is arbitrary, and reversing any of it loses something. Checkout has to come first, since nothing else can happen without the code. Dependencies install before the build because the build needs them present to compile against. The build itself comes before static analysis and tests for a practical reason: if the code doesn't compile, there's nothing meaningful left to scan or test, so failing here first saves the later stages from wasting time on something already broken.

Static analysis usually runs before the test suite because it's fast and cheap compared to a full test run, and it catches things tests aren't built to catch at all, like hardcoded secrets or unsafe patterns in the code itself. Running it early means a bad commit can get rejected before the pipeline spends time on the more expensive stages.

Coverage checks come last because they depend on the test run that just happened. There's nothing to measure until the tests have actually executed.

A failure at any stage stops the pipeline immediately rather than letting it run through the rest. This is deliberate: a build that fails but somehow "passes" its tests anyway, because they ran against a stale artifact or got skipped, doesn't tell you anything trustworthy. Stopping at the first failure keeps every later result meaningful. If a stage ran at all, it means everything before it actually passed.