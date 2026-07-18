# Continuous Delivery / Deployment

### Delivery vs. Deployment

CD gets used loosely to mean two different things, and the difference actually matters. Continuous delivery means every change that passes CI is packaged and ready to release, but a person still decides when that release actually goes out. Continuous deployment removes that decision entirely: anything that passes the pipeline goes to production on its own, with no one in the loop.

The distinction isn't just terminology. It changes where risk sits. With delivery, a human absorbs the judgment call about timing and readiness. With deployment, that judgment has to already be encoded into the pipeline itself, through tests and checks good enough that nobody needs to double-check the outcome by hand.

### From Artifact to Registry

Once CI passes, the build output gets packaged into a single artifact, usually a container image, and pushed to a registry like Docker Hub or a cloud provider's equivalent. This step matters because it fixes the exact thing that gets deployed. Everything downstream, staging, approval, production, deploys this one artifact unchanged. Nothing gets rebuilt at each stage. That's what makes staging a meaningful test of production behavior: it's not running a similar build, it's running the literal same one.

### Staging Deployment and Smoke Tests

The artifact deploys to staging first, an environment meant to resemble production closely enough that problems show up here instead of later. Once it's running, smoke tests check that the deployment actually came up correctly, that basic endpoints respond, that the service didn't crash on startup. These are shallow, fast checks, not a repeat of the full test suite. Their job is narrower: confirm the deployment itself worked, separate from whether the code's logic is correct, which CI already checked.

### The Manual Approval Gate

Before production, many pipelines stop and wait for a person to approve the release. This isn't a failure to automate something that could be automated; it's a deliberate gate for a decision that isn't really about correctness. The code already passed every automated check. What a human is actually weighing at this point is timing and business context, whether now is a safe moment to release, whether a coordinated announcement needs to line up with the deploy, whether the blast radius of this particular change warrants a second look. None of that is something a test suite can decide.

### Why Secrets and Config Are Injected at Deploy Time

The artifact that moves from staging to production doesn't contain environment-specific secrets or configuration baked into it. Those get injected at deploy time instead, pulled from the target environment. This is what makes it possible for staging and production to run the exact same image while still connecting to different databases, using different API keys, and behaving according to different settings. Baking configuration into the image would mean rebuilding it for every environment, which defeats the entire point of testing one artifact and trusting that result all the way to production. It also keeps credentials out of the image itself, which matters because images get stored, scanned, and sometimes shared in ways a running environment's injected secrets never are.