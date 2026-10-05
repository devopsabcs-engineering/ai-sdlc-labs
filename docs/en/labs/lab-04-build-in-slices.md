---
title: "Lab 4: Build in slices"
description: Let the orchestrator split the work into tasks, build the app in small slices and watch the build, lint, unit and i18n gates keep every slice honest.
---

# Lab 4: Build in slices

<span class="chip phase-build"><span aria-hidden="true">🔨</span> Build</span> <span class="chip phase-idea">60 min</span> <span class="chip phase-build">Intermediate</span>

## Overview

<div class="lab-meta" markdown>

| Item | Details |
|------|---------|
| **Duration** | 60 minutes |
| **Level** | Intermediate |
| **Prerequisites** | [Lab 3: Requirements and architecture](lab-03-requirements-architecture.md) |
| **Checkpoint** | Tag `lab-04-end` in the reference repository: all build tasks are done, every build gate has passed, one commit per task. |

</div>

## Learning objectives

By the end of this lab, you will be able to:

* Read how the orchestrator decomposes the spec into atomic tasks in `state.json` and `tasks.md`.
* Run a bounded build phase and stop it at a gate.
* Explain the `build`, `lint` and `unit` gates and the bilingual (i18n) gate.
* Follow the inbox and the Scribe: how agents report without editing shared files.
* Commit once per task so a bad task is easy to roll back.

## Status

!!! wip "Content in progress"
    The full steps, screenshots and checkpoint for this lab are added as the reference app is built. The overview and objectives above are final.

## Next steps

Continue with [Lab 5: QA, critic review and security](lab-05-qa-critic-security.md).
