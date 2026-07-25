# Production and Observability

### The Production Deploy

Once an artifact clears staging and any approval gate, it deploys to production using whichever strategy the team has chosen, blue-green, canary, or rolling. The mechanics of those strategies get their own file; what matters here is that this is the same artifact that ran in staging, deployed into the environment that actual users depend on.

### Post-Deploy Health Checks

Right after the deploy, automated health checks confirm the new version actually came up correctly in production specifically, not just in staging. This sounds redundant with the smoke tests from the previous phase, but it isn't: production runs at a different scale, under real traffic, against the real versions of whatever third-party services the system depends on. A deploy can pass every staging check and still fail its first production health check, because staging is an approximation of production, not a copy of it.

### Monitoring and Observability

Health checks run once, right after deploy, and then stop. Monitoring doesn't. Tools like Prometheus, Grafana, or Datadog continuously collect metrics, logs, and traces for as long as the system is running, which is a different job than confirming a deploy succeeded. A deploy can pass its health check and still develop problems hours or days later, as traffic patterns shift, a dependency degrades, or load grows past what the system was tested against. Observability exists to catch exactly that, the failures that only show up once the system has been running for a while under real conditions.

### When Something Goes Wrong: Rollback

If a health check fails, or monitoring surfaces a serious problem after the fact, the response is to roll back to the last known-good version rather than trying to patch forward under pressure. Some pipelines trigger this automatically based on a failed health check; others require a person to make the call once monitoring flags something. Either way, the decision to roll back is meant to be fast and close to automatic, since diagnosing a production issue in depth is a much slower process than simply reverting to a version that was already confirmed to work.

### Why a Green Pipeline Isn't the Same as a Healthy System

Every stage passing doesn't mean production is fine. It means the code met its criteria at the moment it was tested, against the conditions that testing could simulate. It says nothing about what happens under real load, with real data, against a third-party API that starts behaving differently next week, none of which a pipeline run can fully anticipate in advance. This is exactly the gap observability closes. The pipeline's job ends at deploy; observability's job is telling you the truth about the system for as long as it keeps running afterward.

### Closing the Loop

None of this ends at deploy. An incident caught by monitoring becomes the next commit, often with a new test added specifically so the same failure can't slip through again. A performance issue discovered under real traffic becomes the next thing worked on. The pipeline isn't a straight line that terminates in production; what happens there feeds directly back into what gets built and tested next.