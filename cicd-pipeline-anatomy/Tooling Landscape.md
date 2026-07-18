# Tooling Landscape

### CI Platforms

GitHub Actions runs as a hosted service tied directly to a GitHub repository. Workflows live as YAML files committed alongside the code, there's no separate server to stand up or maintain, and public repositories get a generous free tier. The cost of that convenience is coupling: workflows are written against GitHub's specific syntax and event model, so moving the source elsewhere means rewriting the pipeline, not just relocating it.

Jenkins takes the opposite approach. It's self-hosted and open source, with a plugin ecosystem broad enough to integrate with almost anything, and it doesn't care where the source code actually lives. That flexibility comes with a real, ongoing cost: Jenkins itself becomes a piece of infrastructure someone has to operate, patch, and keep compatible with its own plugins as they update. The software is free; running it isn't.

GitLab CI sits closer to GitHub Actions in model, hosted and tightly integrated, but built around GitLab instead. It's a strong choice specifically when the source already lives on GitLab, since the registry, environments, and pipeline all connect without extra setup. As a tool bolted onto a project hosted somewhere else, it loses most of that advantage.

| | GitHub Actions | Jenkins | GitLab CI |
|---|---|---|---|
| **Setup cost** | Low — hosted, no server to run | High — self-hosted, needs ongoing maintenance | Low — hosted, if already on GitLab |
| **Vendor lock-in** | Tied to GitHub's syntax and events | Minimal — portable across any source host | Tied to GitLab |
| **Control** | Limited unless self-hosted runners are added | Full — runs on infrastructure you own | Limited unless self-hosted runners are added |

### Container Registries

Docker Hub is the simplest starting point: platform-agnostic, a usable free tier, and no cloud provider account required to push or pull an image. At scale, its rate limits on pulls become a real constraint, especially for a pipeline that's deploying frequently.

A cloud provider's own registry, ECR on AWS or GCR on GCP, trades that portability for integration. Permissions run through the same IAM system as the rest of the provider's services, so there's one less external account and one less set of credentials to manage, as long as the rest of the project already lives in that provider's ecosystem. The tradeoff is depth of lock-in: moving off that provider later means re-pointing every reference to the registry, not just swapping a URL.

### Making the Choice

The decision underneath both comparisons is the same one: how much infrastructure you're willing to own directly, versus how much platform lock-in you're willing to accept in exchange for not owning it. A hosted CI platform and a cloud-native registry minimize maintenance but tie the project closely to one ecosystem. Jenkins and a platform-agnostic registry keep things portable but shift real operational work onto whoever's running them. Neither side is universally correct; it depends on whether the project already lives inside one platform's ecosystem, or needs to stay able to move.