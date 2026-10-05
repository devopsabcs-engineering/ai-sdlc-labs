---
title: "Lab 7: Deploy to production"
description: Run the deploy phase after human approval, publish the app to GitHub Pages, and check pre-deploy, smoke and rollback-ready gates.
---

# Lab 7: Deploy to production

<span class="chip phase-deploy"><span aria-hidden="true">🚀</span> Deploy</span> <span class="chip phase-idea">30 min</span> <span class="chip phase-build">Intermediate</span>

## Overview

<div class="lab-meta" markdown>

| Item | Details |
|------|---------|
| **Duration** | 30 minutes |
| **Level** | Intermediate |
| **Prerequisites** | [Lab 6: Human sign-off and changes requested](lab-06-signoff-changes-requested.md) |
| **Checkpoint** | Tag `lab-07-end` in the reference repository: the approved artifact is live and the rollback plan is written. |

</div>

## Learning objectives

By the end of this lab, you will be able to:

* Run the `ait-deploy` skill only after sign-off is approved.
* Configure GitHub Pages with a GitHub Actions workflow and an environment.
* Explain and verify the `pre-deploy`, `smoke` and `rollback-ready` gates.
* Roll back to the previous version.

## Status

!!! wip "Content in progress"
    The full steps, screenshots and checkpoint for this lab are added as the reference app is built. The overview and objectives above are final.

## Next steps

Continue with [Lab 8: Resume, recover and tear down](lab-08-resume-recover-teardown.md).
