---
title: "Lab 5: QA, critic review and security"
description: Validate acceptance criteria, run the critic and security reviews, and learn what to do when a gate blocks the run - unblock it as the operator, fix real findings, and never weaken a gate.
---

# Lab 5: QA, critic review and security

<span class="chip phase-test"><span aria-hidden="true">✅</span> Test</span> <span class="chip phase-idea">45 min</span> <span class="chip phase-build">Intermediate</span>

## Overview

<div class="lab-meta" markdown>

| Item | Details |
|------|---------|
| **Duration** | 45 minutes |
| **Level** | Intermediate |
| **Prerequisites** | [Lab 4: Build in slices](lab-04-build-in-slices.md) |
| **Checkpoint** | Tag `lab-05-end` in the reference repository: acceptance and critic review have passed, and the security gate is blocked on one finding that only a human can decide (the waiver comes in Lab 6). |
| **Next lab** | [Lab 6: Human sign-off and changes requested](lab-06-signoff-changes-requested.md) |

</div>

The build is finished and green. Now three test-phase tasks check it from the outside: QA (`T-011`), critic review (`T-012`) and security (`T-013`). In the recorded run, **every one of them found something real**, and two of them stopped the run. That is the lesson of this lab.

## Learning objectives

By the end of this lab, you will be able to:

* Run acceptance validation with `ait-qa-validation` and read the evidence.
* Run `ait-review-critic` and `ait-security`, and read a blocking finding.
* See a gate fail, then be fixed by the owning agent with a counted retry.
* Explain why a task that is `blocked` after two retries is correct behaviour, not a bug.
* Unblock a task as the operator, with a small reviewed commit and a recorded decision.
* Recognize a "fix" that weakens a gate, and refuse it.

## Cost and credits { #cost-and-credits }

!!! cost "Two runs, about 476 credits"
    The recorded work was split in two runs. The first (`lab-05-qa-critic-security`) used **79.25 credits** and stopped at the first blocked gate. After the operator unblock, the second (`lab-05b-qa-critic-security-retry`) used **396.72 credits** and took 32 minutes 54 seconds. **Total: about 476 credits.**

    You do not need to re-run everything to learn this lab. Read the committed evidence in `evidence/qa/` and use the tags `lab-05-start` and `lab-05-end`. See [Lab 0](lab-00-setup.md#cost-and-credits) for the general cost advice.

## Steps

### Step 1: Start from the checkpoint

Use your own repository from Lab 4, or the reference repository at the tag `lab-05-start` (the same commit as `lab-04-end`, `5eeeda4`).

```powershell
git clone https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch
Set-Location -LiteralPath ai-sdlc-labs-pinch
git checkout lab-05-start
npm ci
```

!!! success "Expected result"
    `npm ci` finishes without an error. `git log --oneline -n 1` shows `5eeeda4 feat: add offline PWA browser coverage`.

### Step 2: Run the test phase

Run **only** the test phase, and tell the orchestrator not to push or deploy. Start `copilot` from the repository root. Replace the run id with your own if it differs.

```powershell
copilot -p "Use the ait-sdlc-orchestrate skill to resume run 2026-10-05-pinch. Run ONLY the Test phase: add tasks for QA (ait-qa-validation), critic review (ait-review-critic) and security (ait-security). Also write .github/workflows/pages.yml as a manual workflow_dispatch with a governance_approved input, but do not run it. Stop at any blocked gate. Do not push, do not deploy." --allow-all-tools --allow-all-paths --allow-all-urls --no-ask-user --share evidence\lab-05-qa-critic-security.md --log-dir evidence\logs
```

The interactive alternative: run `copilot`, paste the same text without the flags, and answer each permission prompt yourself.

The run adds `T-011` (QA), `T-012` (critic) and `T-013` (security) to `state.json`. It also writes the Pages workflow: a manual `workflow_dispatch` with a `governance_approved` boolean input, a quality-checks job, an immutable Pages artifact built with `--base=/ai-sdlc-labs-pinch/`, and `deploy-pages`. It does **not** run the workflow.

!!! success "Expected result"
    The workflow file exists, and the run ends with a stop at the QA task. In the recorded run, `T-011` was marked `blocked` (next step).

### Step 3: Read a blocked task

QA found one real acceptance gap: PRD requirement R8.1 requires Prettier, but the repository had **no format gate**. The agent tried to add it:

```powershell
npm install --save-dev prettier
```

The corporate registry policy refused it:

```text
npm error EALLOWREMOTE "Fetching packages of type remote have been disabled"
```

The proxy tarball URL differs from `registry.npmjs.org`, so npm refused the package. After two failed attempts, the orchestrator marked the task blocked and stopped. Check the state:

```powershell
# Your own run: .copilot-tracking\<run-id>\state.json (git-ignored)
$s = Get-Content .copilot-tracking\2026-10-05-pinch\state.json -Raw | ConvertFrom-Json
$s.tasks | Where-Object { $_.id -in 'T-011','T-012','T-013' } | Select-Object id, owner, status, retries
```

!!! success "Expected result"
    In your run, `T-011` shows `blocked` with `retries` at 2. This is **correct**: the retry rule allows two counted retries, then the task stops and a human decides.

!!! tip "Only reading the reference repository?"
    The tracking store is git-ignored, so a clone does not contain it. The final snapshot is committed on `main`: `git show main:docs/run/2026-10-05-pinch/state.json`. It shows the end of the run (all tasks `done`), with retries `T-011` 0, `T-012` 1 and `T-013` 2.

!!! warning "The agent must not weaken the gate"
    The easy way out is to delete the Prettier requirement, skip the gate, or point npm at another source. A gate whose tooling cannot run is **blocked**, never silently skipped. Here no waiver was needed: the fix was to supply the package properly.

### Step 4: Unblock it as the operator

This step is a human action, not an agent prompt. The goal is to add `prettier@3.9.9` with a **canonical** registry URL and the real integrity hash, without going through the blocked proxy path.

1. Ask the registry for the integrity hash of the exact version:

    ```powershell
    npm view prettier@3.9.9 dist.integrity
    ```

2. In `package.json`, add `"prettier": "3.9.9"` to `devDependencies` (exact version, like every other dependency).
3. In `package-lock.json`, add `"prettier": "3.9.9"` to the `devDependencies` of the root package, and add a `node_modules/prettier` entry with `"version": "3.9.9"`, a `resolved` value of `https://registry.npmjs.org/prettier/-/prettier-3.9.9.tgz` and the `sha512-...` value from step 1 as `integrity`.
4. Prove that the lockfile and `package.json` agree:

    ```powershell
    npm ci
    ```

5. Add the format scripts, the configuration and the pipeline checks:
    * `package.json` scripts: `"format": "prettier --write ."` and `"format:check": "prettier --check ."`.
    * `.prettierrc.json`: `{ "endOfLine": "auto" }`.
    * `.prettierignore`: generated and evidence folders such as `dist`, `node_modules`, `package-lock.json`, `evidence` and `.copilot-tracking`.
    * `.gitattributes`: `* text=auto eol=lf`, so Windows runners do not fail the format check on CRLF line endings.
    * Both workflows (`pages.yml` and `cross-platform-tests.yml`): a step that runs `npm run format:check`.
6. Format the whole repository once, check, and commit:

    ```powershell
    npm run format
    npm ci
    npm run format:check
    git add -A
    git commit -m "build: add Prettier format gate and format the repository"
    ```

!!! tip "If your registry works"
    On a network without the policy, `npm install --save-dev --save-exact prettier@3.9.9` does steps 1 to 4 for you. The manual route is for locked-down registries.

!!! success "Expected result"
    `npm ci` and `npm run format:check` both end without an error. The recorded commit is `ddfd6fe`, and it is included in tag `lab-05-end`.

!!! checkpoint "Record the unblock"
    An operator unblock is not a silent edit. The second run recorded it in `decisions.md` as ADR-013 "Accept the operator Prettier unblock", reset `T-011` to `pending` with zero retries, and gave it a fresh two-retry budget.

### Step 5: Resume and read the QA result

```powershell
copilot -p "Use the ait-sdlc-orchestrate skill to resume run 2026-10-05-pinch. The operator unblocked T-011 with commit ddfd6fe: record that decision, reset T-011 to pending with retries 0, then run T-011, T-012 and T-013 in order. Stop at any blocked gate. Do not push, do not deploy." --allow-all-tools --allow-all-paths --allow-all-urls --no-ask-user --share evidence\lab-05b-qa-critic-security-retry.md --log-dir evidence\logs
```

`T-011` re-runs the full acceptance suite and writes `evidence/qa/T-011-qa.md`. To read it without running anything, use `git checkout lab-05-end` first.

```powershell
Get-Content evidence\qa\T-011-qa.md | Select-Object -First 25
```

<figure class="screenshot-frame" markdown>
![GitHub page of evidence/qa/T-011-qa.md in the Pinch repository, with a table that lists each required gate command and its Pass result](../../assets/img/lab-05/05-01-qa-evidence.png)
<figcaption>The QA evidence file. Look at the table of required gates: format, build, lint, unit tests, i18n parity, portable-os and Playwright all pass once the Prettier gate exists.</figcaption>
</figure>

!!! success "Expected result"
    The file says `Acceptance gate: passed`. All 24 numbered PRD criteria are traced to tests: format, build, lint, 73 unit tests in 5 files, i18n parity (78 keys in each locale), `portable-os`, 2 Playwright tests and the Lighthouse-style check.

One Playwright test hung once during cold start and was stopped after more than 270 seconds. The unchanged re-run passed in 7.4 seconds. The agent changed neither the test nor the timeout, and wrote the incident in the evidence.

### Step 6: Read the critic's blockers

`T-012` is a different agent (`ait-code-reviewer`). It reads the code and the evidence, not only the test output. It **failed first**, with two blocking defects that all tests had missed:

1. An unsupported multi-token unit line, such as `2 quarts milk`, was guessed to be a count, then scaled and merged. It must stay unchanged and unmerged. A unitless count such as `3 eggs` must still scale.
2. `test:lighthouse` did not apply a reproducible throttle and did not enforce the PRD's performance score (at least 0.9).

The developer agent fixed them in two commits: `dfdf3a5` ("fix: preserve unsupported ingredient units") and `3693d41` ("test: enforce throttled performance score"). The re-review ran only the failed gate and the smallest relevant tests.

<figure class="screenshot-frame" markdown>
![GitHub page of evidence/qa/T-012-critic.md showing the original review with two blocking defects, then the remediation verification](../../assets/img/lab-05/05-02-critic-evidence.png)
<figcaption>The critic evidence. Read the "Original review" section: two blocking defects, and the sentence that the critic-review gate failed although build, lint, format and 73 unit tests passed.</figcaption>
</figure>

!!! success "Expected result"
    The file ends with "The T-012 critic-review gate passes". The throttled performance score is 1.000 against a minimum of 0.900. In `state.json`, `T-012` shows `retries: 1`.

### Step 7: Read the security result

`T-013` (`ait-security-rai`) ran the online dependency audit and **failed**: 1 critical and 6 high findings. Upgrading Vite to 7.3.6 and Vitest to 4.1.11 (commit `7cc6975`) removed the critical one and several high ones. Five high findings remained, all in one chain:

```text
vite -> postcss -> source-map-js 1.2.1   (GHSA-68fv-2mgg-jv7q, fixed in 1.2.2, not yet published)
```

The audit's suggested fix would downgrade Vite to 2.7.3 and Vitest to 0.0.122. The agent **refused**, because that would break the supported toolchain just to quiet one report. Other checks passed: 0 secret matches in 50 tracked files, 236 of 236 lockfile URLs on `registry.npmjs.org`, no cross-origin requests, and Responsible AI not applicable (no model or generated content). After two retries, `T-013` was blocked.

<figure class="screenshot-frame" markdown>
![GitHub page of evidence/qa/T-013-security.md with the table of security checks and a first line saying the security gate is blocked after two remediation attempts](../../assets/img/lab-05/05-03-security-evidence.png)
<figcaption>The security evidence. Look at the first line (blocked after two remediation attempts) and at the one failed row, the dependency audit, next to the passed secret scan and lockfile checks.</figcaption>
</figure>

!!! success "Expected result"
    `T-013` is `blocked` with `retries: 2`, and the run stops. No agent waives it. The decision belongs to a person: see [Lab 6](lab-06-signoff-changes-requested.md).

## Checkpoint

Compare your result with the reference repository.

```powershell
git fetch --tags
git log --oneline lab-05-start..lab-05-end
```

* Tag `lab-05-end` is commit `5e56331` ("docs: record blocked security gate").
* The history between the tags includes the workflow `95c8cee`, the Prettier gate `ddfd6fe`, the critic fixes `dfdf3a5` and `3693d41`, and the dependency upgrade `7cc6975`.
* `evidence/qa/` holds `T-011-qa.md`, `T-012-critic.md` and `T-013-security.md`.
* In your tracking store, `T-011` and `T-012` are `done` and `T-013` is `blocked`.

## Bring your own idea

The test phase works the same way for any app. Run it on your own repository and check that:

* [ ] Your brief has measurable acceptance criteria (the PRD from Lab 3), so QA has something to trace.
* [ ] You run QA, critic and security in one bounded run, with "stop at any blocked gate, do not push, do not deploy".
* [ ] You read `evidence/` yourself before trusting a green result.
* [ ] You never accept a fix that deletes a check, skips a gate or downgrades a tool to an unsupported version.
* [ ] Every operator unblock is a small commit plus a decision, and the task is reset to `pending` with zero retries.

## What went wrong in the recorded run

Nothing here is a mistake in the lab. This is what a real gated run looks like.

### The first blocker was the environment, not the code

The Prettier gap was real, but the install failed because of the registry policy (`EALLOWREMOTE`). Two attempts later, `T-011` was blocked and the run stopped. The operator fixed the root cause by hand (Step 4) and recorded it.

### Tests were green and the critic still failed

73 unit tests passed, but none asserted "unknown units stay unchanged", and no check enforced the performance score. The critic found both by reading the code against the brief and the ADRs. Green tests prove only what the tests assert.

### A flaky test was reported, not hidden

One Playwright test hung on a cold start. The agent did not raise the timeout. It stopped the run, re-ran the identical command, got a pass in 7.4 seconds and wrote both facts in the evidence.

### The last blocker had no fix

The remaining high findings had no published fix, and a forced downgrade was refused. `T-013` stayed blocked and was escalated to a human. In the final run state, retries are 0 for `T-011`, 1 for `T-012` and 2 for `T-013`.

## Troubleshooting

### `npm install` fails with `EALLOWREMOTE`

Your registry or proxy rewrites tarball URLs. Use the manual route in Step 4 with the canonical `https://registry.npmjs.org/` URL, and check it with `npm ci`. Do not commit a lockfile that points to a private feed.

### The agent keeps retrying the same failed command

Stop it with `Ctrl+C`. The rule is two counted retries, then `blocked`. If a task is left `in_progress` after a crash, a resume treats it as not done and runs it again.

### `format:check` fails on Windows but not on Linux

Line endings. Check that `.gitattributes` contains `* text=auto eol=lf`, then run `git add --renormalize .` and `npm run format`.

### `npm audit fix --force` is suggested

Read what it changes before you do anything. If it downgrades a major tool (here Vite 7 to 2.7.3), do not apply it. Record the finding and let a human decide.

## Knowledge check

??? question "Why is `blocked` after two retries the right outcome?"
    The retry rule gives an agent two counted attempts. If a gate still cannot pass, the cause is outside what the agent should change on its own, such as a registry policy or a missing upstream fix. Stopping hands the decision to a person. Continuing would mean weakening a gate.

??? question "What must an operator do after unblocking a task?"
    Record the unblock as a decision (here ADR-013), and reset the task to `pending` with `retries` at 0 so it gets a fresh budget.

??? question "The critic failed although all tests passed. Is the critic wrong?"
    No. The tests did not assert the missing behaviour. The critic compared the code with the brief and found two defects, which were then fixed and covered by regression tests.

## Summary

* QA, critic review and security each found something real: a missing format gate, wrong handling of unknown units, a missing performance assertion and a vulnerable dependency chain.
* A gate that cannot run or pass is `blocked`. An agent never skips, relaxes or deletes it.
* The operator unblocks with a small, reviewable commit (`ddfd6fe`) and a recorded decision.
* The security gate stays blocked because no fix exists. A human, not an agent, decides what to do.

## Next steps

Continue with [Lab 6: Human sign-off and changes requested](lab-06-signoff-changes-requested.md), where you answer the waiver question and approve the exact commit.
