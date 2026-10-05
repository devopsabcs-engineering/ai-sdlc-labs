---
title: Lab map
description: The nine AI-SDLC labs, their durations, levels and checkpoints, from setup to resume and teardown.
---

# Lab map

The labs follow the lifecycle: set up, shape the idea, plan, build, test, sign off, deploy, then learn to resume and clean up. Each lab is one sitting and ends on a **checkpoint** you can start the next lab from.

## Lab map

| Lab | Title | Phase | Duration | Level | Checkpoint |
|-----|-------|-------|----------|-------|------------|
| [0](lab-00-setup.md) | Prerequisites and setup | <span aria-hidden="true">🧰</span> Setup | 20 min | Beginner | `lab-00-end` |
| [1](lab-01-idea-to-brief.md) | From idea to brief | <span aria-hidden="true">💡</span> Idea | 25 min | Beginner | `lab-01-end` |
| [2](lab-02-design-prototype.md) | Design and prototype | <span aria-hidden="true">🧭</span> Plan | 35 min | Beginner | `lab-02-end` |
| [3](lab-03-requirements-architecture.md) | Requirements and architecture | <span aria-hidden="true">🧭</span> Plan | 35 min | Intermediate | `lab-03-end` |
| [4](lab-04-build-in-slices.md) | Build in slices | <span aria-hidden="true">🔨</span> Build | 60 min | Intermediate | `lab-04-end` |
| [5](lab-05-qa-critic-security.md) | QA, critic review and security | <span aria-hidden="true">✅</span> Test | 45 min | Intermediate | `lab-05-end` |
| [6](lab-06-signoff-changes-requested.md) | Human sign-off and changes requested | <span aria-hidden="true">🔐</span> Sign-off | 30 min | Intermediate | `lab-06-end` |
| [7](lab-07-deploy.md) | Deploy to production | <span aria-hidden="true">🚀</span> Deploy | 30 min | Intermediate | `lab-07-end` |
| [8](lab-08-resume-recover-teardown.md) | Resume, recover and tear down | <span aria-hidden="true">♻️</span> All | 25 min | Intermediate | `lab-08-end` |

Total hands-on time: about 5 hours, plus agent run time. Agent runs are bounded: each lab triggers one or two short runs instead of one marathon.

## How each lab is built

Every lab page has the same sections, so you always know where to look:

* An **overview table** with duration, level, prerequisites and the checkpoint.
* **Learning objectives**.
* **Steps** with an *Expected result* after each one.
* A **validation checklist**, often with a PowerShell snippet.
* **Troubleshooting**, a **cost note** and a short **knowledge check**.

<div class="lab-meta" markdown>

| Item | Where |
|------|-------|
| Words you do not know | [Glossary](../glossary.md) |
| Something broke | [Troubleshooting](../troubleshooting.md) |
| Who made this | [About](../about.md) |

</div>

## Checkpoints

A checkpoint is a Git tag in the [Pinch reference repository](https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch). The tag `lab-NN-end` is the state at the end of lab NN, and the start of lab NN+1 is the same commit.

!!! checkpoint "Follow along or bring your own idea"
    On the recorded path, check out the checkpoint tag of the previous lab to start from a known state. On your own path, your repository is your checkpoint: commit at the end of every lab.

!!! wip "Content in progress"
    Setup (Lab 0) is complete. Labs 1 to 8 show their overview and objectives today; the full steps, screenshots and checkpoints are added as the reference app is built.
