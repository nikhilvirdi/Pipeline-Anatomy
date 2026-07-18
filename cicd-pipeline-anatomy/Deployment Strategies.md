# Deployment Strategies

### 1. Blue-Green

Blue-green keeps two identical production environments running, only one of which is actually live at any time. The new version deploys fully into the idle one, gets checked there while receiving zero real traffic, and then a single switch, usually a load balancer or router change, sends all traffic to it at once. The old environment stays up and untouched during this whole process, which is what makes rollback close to instant: if something's wrong, the switch just flips back.

The tradeoff shows up in blast radius and cost. Before the switch, exposure is zero, since the new version isn't serving anyone yet. The moment the switch happens, exposure is total, every user hits the new version simultaneously, with nothing gradual about it. Running this setup also means paying for two full production environments at once, even though only one is ever serving traffic.

### 2. Canary

Canary deploys the new version alongside the old one, but routes only a small slice of real traffic to it at first, maybe five percent, and increases that slice gradually as long as things look healthy. The old version keeps serving the majority of traffic throughout, which means a problem in the new version only ever touches a fraction of users, not everyone at once.

What makes canary different from just a smaller blue-green is the rollback trigger. Instead of a single pass-or-fail check, canary deployments typically watch real-time metrics on that traffic slice, error rates, latency, and shift traffic back automatically if those numbers cross a threshold. Rollback here means reducing the canary's traffic share, not reversing a full instance swap, so it's fast without needing a second full environment sitting idle.

### 3. Rolling

Rolling deployments replace instances of the old version with the new one gradually, one instance or one small batch at a time, rather than switching everything at once. For a stretch during the rollout, old and new versions are both live and both serving real traffic simultaneously, side by side.

Rollback here means reversing the same process, replacing new instances back with old ones, instance by instance. That's slower than blue-green's single flip, since there's no complete idle copy of the previous state sitting ready; the previous version only exists in whatever instances haven't been replaced yet. Blast radius during rollout is partial, similar to canary, but it isn't controlled the way canary's traffic split is. It's just a side effect of how many instances happen to be on the new version at a given moment, not a deliberately limited exposure.

### Comparing the Three

| Aspect                | Blue-Green                                                                         | Canary                                                                             | Rolling                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Rollback speed**    | Fastest — a single switch flips back                                               | Close to immediate — traffic share shifts back                                     | Slowest — rollback happens instance by instance                                                                  |
| **Blast radius**      | Least controlled — zero exposure before cutover, everyone after                    | Most controlled — only a chosen traffic slice is exposed and can be capped low     | Partial, but incidental rather than deliberately bounded                                                         |
| **Cost & complexity** | Highest — a full second environment runs in parallel, though old and new never mix | No environment duplication, but requires tolerating two live versions at once      | Same as canary — no duplication, but requires the same coordination                                              |
| **Best fit**          | When instant, clean rollback is more important than fine-grained exposure control  | When sufficient traffic and monitoring exist to make a small live slice meaningful | When simplicity and lower operational complexity are the priority (the default in orchestrators like Kubernetes) |

Which one fits depends on what you're actually protecting against, not which is "best" in the abstract. Canary suits systems with enough traffic and monitoring to make a small live slice a meaningful signal. Blue-green suits cases where a clean, instant rollback matters more than the extra infrastructure cost. Rolling is common mainly because it's the easiest default, not because it's the strongest choice.