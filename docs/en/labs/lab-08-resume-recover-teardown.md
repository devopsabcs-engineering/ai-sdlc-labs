---
title: "Lab 8: Resume, recover and tear down"
description: Resume an interrupted run from its saved state, recover from a failed task, snapshot the evidence into the repository and clean up.
---

# Lab 8: Resume, recover and tear down

<span class="chip phase-orch"><span aria-hidden="true">♻️</span> All phases</span> <span class="chip phase-idea">25 min</span> <span class="chip phase-build">Intermediate</span>

## Overview

<div class="lab-meta" markdown>

| Item | Details |
|------|---------|
| **Duration** | 25 minutes |
| **Level** | Intermediate |
| **Prerequisites** | [Lab 7: Deploy to production](lab-07-deploy.md) |
| **Checkpoint** | Tag `lab-08-end` in the reference repository: the run snapshot is committed under `docs/run/` and the environment is cleaned up. |

</div>

## Learning objectives

By the end of this lab, you will be able to:

* Stop a run and resume it from `state.json` without redoing finished work.
* Reset a single task to `pending` and re-run only that task.
* Snapshot `state.json`, `plan.md`, `tasks.md`, `changes.md` and `decisions.md` to `docs/run/<run-id>/`.
* Tear down what the labs created (deployments, practice repositories, local folders).

## Status

!!! wip "Content in progress"
    The full steps, screenshots and checkpoint for this lab are added as the reference app is built. The overview and objectives above are final.

## Next steps

You have completed the lifecycle. Review the [Glossary](../glossary.md), then run it again on your own idea.
