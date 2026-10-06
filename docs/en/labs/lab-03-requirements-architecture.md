---
title: "Lab 3: Requirements and architecture"
description: Produce a PRD, a technical specification and decision records, then see the spec-review gate fail on a spec that is not ready to build, and fix it.
---

# Lab 3: Requirements and architecture

<span class="chip phase-plan"><span aria-hidden="true">🧭</span> Plan</span> <span class="chip phase-idea">35 min</span> <span class="chip phase-build">Intermediate</span>

## Overview

<div class="lab-meta" markdown>

| Item | Details |
|------|---------|
| **Duration** | 35 minutes |
| **Level** | Intermediate |
| **Prerequisites** | [Lab 2: Design and prototype](lab-02-design-prototype.md) |
| **Checkpoint** | Tag `lab-03-end` in the reference repository: PRD, technical specification and ADRs are committed and `spec-review` has passed. |
| **Next lab** | [Lab 4: Build in slices](lab-04-build-in-slices.md) |

</div>

The brief says *what* you want. The design shows *how it feels*. This lab turns both into a spec that an agent can build from without guessing: a product requirements document (PRD), an architecture, two decision records and a backlog of build slices.

## Learning objectives

By the end of this lab, you will be able to:

* Run the product owner and architect agents with the `ait-tech-specs` skill to get a PRD and a technical specification.
* Read the architecture decision records (ADRs) and the numbered acceptance criteria.
* Recognize a `spec-review` failure, read its findings and check that the fix closes them.
* Trace every requirement to a build slice, and see how project-specific gates (`i18n-parity`, `portable-os`) enter the backlog.

## Cost and credits { #cost-and-credits }

!!! cost "About 88 credits and 3.5 minutes in the recorded run"
    This lab is cheap: the recorded run used **88.03 credits** in about **3.5 minutes**, including one failed and one passed `spec-review`. Reading and checking the artifacts takes most of the 35 minutes. See [Lab 0](lab-00-setup.md#cost-and-credits) for the full cost picture.

## Steps

### Step 1: Check the starting point

Work from the root of your practice repository, with the UTF-8 console from Lab 0. Labs 1 and 2 must be done: the brief is in `specs/idea.md`, the design is in `docs/design/` and the prototype is in `prototype/`.

```powershell
git status --short
git log --oneline -3
Get-ChildItem .copilot-tracking -Directory
Get-Content .copilot-tracking\<run-id>\plan.md
```

Replace `<run-id>` with the folder name from the previous command (the recorded run used `2026-10-05-pinch`).

!!! success "Expected result"
    `git status` is clean. In `plan.md`, T-001 (design) and T-002 (prototype) are checked `[x]`, and T-003 (specification) is still open.

!!! tip "Reference repository only"
    The tracking store is git-ignored, so a fresh clone of the reference repository has none. If you only want to read the results, skip the run and open the artifacts at tag `lab-03-end` (see [Checkpoint](#checkpoint)).

### Step 2: Run the specification phase

Run one bounded phase. The prompt names the skill, the task, the outputs, and where to stop.

```powershell
New-Item -ItemType Directory -Force evidence\logs | Out-Null
copilot -p "Use the ait-sdlc-orchestrate skill and resume the run. Run ONLY task T-003 with the ait-tech-specs skill: write docs/product/prd.md with numbered requirements R1.. and numbered acceptance criteria, docs/architecture/overview.md, and one ADR per binding decision. Then append the build backlog as tasks T-004 to T-010, one slice each, to state.json with requiredGates, adding the project gates i18n-parity and portable-os. Run the spec-review gate; if it fails, fix the findings and run it again. Commit with a Conventional Commit message on the current branch and stop. Do not push, do not deploy." --allow-all-tools --allow-all-paths --allow-all-urls --no-ask-user --share evidence\lab-03-requirements-architecture.md --log-dir evidence\logs
```

You can also run `copilot` interactively and paste the same prompt. In VS Code, the matching prompt is `/product-specs`.

<figure class="screenshot-frame" markdown>
![GitHub view of docs/product/prd.md on the main branch, showing the Pinch v1 PRD with the product outcome and the first requirement R1 with its numbered acceptance criteria](../../assets/img/lab-03/03-01-prd.png)
<figcaption>The PRD (113 lines in the recorded run). Look at the numbered criteria under R1: each one is a statement a tester can check.</figcaption>
</figure>

!!! success "Expected result"
    The agent ends with a result block and a commit. In the recorded run the commit was `c110eb3` "docs(plan): define Pinch requirements and architecture".

### Step 3: Read the PRD

Open `docs/product/prd.md`. It has a product outcome, requirements `R1` to `R8`, three acceptance criteria each (24 in total), a list of non-goals and a success statement. For example, requirement R2:

```markdown
### R2. Quantity scaling and unit conversion

**Acceptance criteria**

1. Integers, decimals, fractions, and mixed numbers scale by `target servings / base servings`.
2. Compatible mass and volume units use the documented conversion table; unknown or
   dimension-incompatible units remain as written.
```

Two habits to copy: each criterion is numbered (QA in Lab 5 verifies them one by one), and the non-goals (accounts, cloud sync, backend) say what the agents must **not** build.

### Step 4: Read the architecture and the ADRs

```powershell
Get-ChildItem docs\architecture
```

<figure class="screenshot-frame" markdown>
![GitHub view of the docs/architecture folder listing adr-001-i18n.md, adr-002-quantity-unit-parsing.md and overview.md](../../assets/img/lab-03/03-03-architecture-folder.png)
<figcaption>The architecture folder: one overview and two ADRs. Each ADR records one binding decision.</figcaption>
</figure>

`overview.md` describes the solution shape (a Vite and TypeScript single-page app with no framework, no backend and no runtime third-party call), the components, the data model, the key flows and a verification map that links each concern to its evidence.

The two ADRs are short and follow Context, Decision, Consequences:

* **ADR-001** keeps symmetric `en` and `fr` catalogs with the same key shape and adds the `i18n-parity` gate, which fails on missing, extra or empty keys.
* **ADR-002** parses only a recognized quantity prefix, converts only within the same dimension (mass or volume) and keeps unknown units and unparsed lines exactly as written.

<figure class="screenshot-frame" markdown>
![GitHub view of docs/architecture/adr-001-i18n.md showing the status, context and decision sections of ADR-001 about symmetric locale catalogs and Intl](../../assets/img/lab-03/03-02-adr-i18n.png)
<figcaption>ADR-001 on GitHub. Read the Decision paragraph: it names the gate (`i18n-parity`) that will enforce the decision in Lab 4.</figcaption>
</figure>

### Step 5: Look at the spec-review result

`spec-review` is the gate for this phase. In the recorded run it **failed first** and passed on the re-run. Search the shared transcript for the findings:

```powershell
Select-String -Path evidence\lab-03-requirements-architecture.md -Pattern 'spec-review' | Select-Object -First 10
```

The three findings were real and specific:

1. Conversion factors and rounding were not implementation-ready (now the conversion table and rounding rules in ADR-002).
2. The data model implied that user-entered recipes needed manual bilingual duplication (now modeled as localized content with a required fallback).
3. Requirements were not traceable to build slices (a traceability table was added).

!!! success "Expected result"
    The transcript shows a failed `spec-review`, the fixes, and a passed re-run. Your own run can fail on different findings, or pass at the first try: model output is not deterministic. What matters is that a failed gate leads to a fix, not a shrug.

### Step 6: Check the backlog and the traceability

The architect appended seven build slices to `state.json`. Print them with their required gates:

```powershell
$s = Get-Content .copilot-tracking\<run-id>\state.json -Raw | ConvertFrom-Json
$s.tasks | Where-Object { $_.id -match '^T-0(0[3-9]|10)$' } |
  ForEach-Object { '{0}  {1}  [{2}]' -f $_.id, $_.title, ($_.requiredGates -join ', ') }
```

The recorded backlog is T-004 scaffold the bilingual app shell, T-005 quantity scaling and conversion, T-006 local recipe and data management, T-007 responsive recipe scaler, T-008 persistent shopping list, T-009 accessible cook mode, T-010 offline PWA and browser coverage. The two project-specific gates, `i18n-parity` and `portable-os`, come from the brief and the ADRs. Now check the other direction, from requirement to slice:

| PRD requirements | Build slice |
|------------------|-------------|
| R6, R8 | T-004 portable bilingual shell and gates |
| R2 | T-005 parsing, scaling, conversion and formatting |
| R1, R7 | T-006 recipe library and local data control |
| R2, R3, R6 | T-007 responsive recipe scaler |
| R4 | T-008 persistent shopping list |
| R5 | T-009 accessible cook mode |
| R7, R8 | T-010 offline PWA and bundled-Chromium coverage |

!!! success "Expected result"
    `T-003` is `done` with `spec-review` passed, seven new tasks exist, and every requirement `R1` to `R8` appears in the table at least once.

## Checkpoint { #checkpoint }

The checkpoint is tag `lab-03-end` (commit `c110eb3`) in [ai-sdlc-labs-pinch](https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch).

```powershell
git diff lab-03-start lab-03-end --stat
git checkout lab-03-end
```

!!! checkpoint "What you should see"
    The diff lists four files and 308 insertions: `docs/product/prd.md`, `docs/architecture/overview.md` and the two ADRs. The backlog is not in the commit: `state.json` lives in the git-ignored tracking store. Return to your branch with `git switch -`.

## Bring your own idea

The flow is the same for any idea. Run the specification phase on your own brief and design.

* [ ] Your brief lists 3 or 4 features. Do not exceed that.
* [ ] The PRD has numbered requirements, and each has numbered acceptance criteria you could test.
* [ ] Non-goals are listed, so the agents do not add features.
* [ ] The backlog has 5 to 7 slices, each small enough to build and verify in one task.
* [ ] Every requirement maps to at least one slice in a traceability table.
* [ ] Any rule you care about (for example, bilingual parity or no hard-coded paths) became a named gate.

## What went wrong in the recorded run

* **`spec-review` failed at first.** It found unusable conversion rules, a data model that forced duplicate bilingual content, and no requirement-to-slice traceability. The agent fixed all three and the gate passed on the second run.
* **Nothing else.** There was no blocked task in this lab. The tracking store is git-ignored, so the backlog lives only in `state.json` until you snapshot it.

## Troubleshooting

### The PRD has criteria that cannot be tested

Ask for a narrower rewrite of the one requirement, for example: "Rewrite R4 so each acceptance criterion is observable in a browser or a unit test." Run `spec-review` again.

### `spec-review` keeps failing

After two failed retries the task becomes `blocked`, which is the designed behavior. Read the findings in the transcript, fix the root cause yourself or record a decision in `decisions.md`, then resume the run.

### T-004 to T-010 are missing from `state.json`

The agent stopped before it appended the backlog. Resume with: `Use the ait-sdlc-orchestrate skill and resume the run. T-003 is incomplete: append the build backlog T-004 to T-010 and run spec-review. Stop after that.`

## Knowledge check

??? question "Why does a requirement need a build slice?"
    A requirement with no slice is never built, and nothing notices. The traceability table makes that visible before any code exists.

??? question "Where does `i18n-parity` come from?"
    From ADR-001 and the brief. It is a project-specific gate that the architect added to the `requiredGates` of the slices that touch the catalogs.

## Summary

You turned a brief and a design into a PRD with 24 numbered acceptance criteria, an architecture overview, two ADRs and a backlog of seven slices, and you watched `spec-review` stop a spec that was not ready. The recorded run cost 88.03 credits.

## Next steps

Continue with [Lab 4: Build in slices](lab-04-build-in-slices.md), where the orchestrator builds the app one slice at a time.
