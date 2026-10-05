---
title: Build an app from idea to production with AI agents
description: Hands-on labs that take you from an idea to a deployed app with the ai-team-sdlc Copilot plugin, quality gates and a human sign-off.
hide:
  - toc
---

<div class="hero" markdown>

<p class="eyebrow">Hands-on labs · EN / FR · Windows + PowerShell + VS Code</p>

# Idea to production, with an AI team and a human in charge

<p class="lead">
You will use the <code>ai-team-sdlc</code> GitHub Copilot plugin: an orchestrator and ten specialist agents that design, build, test and deploy an app, with quality gates at every step and one mandatory human sign-off.
</p>

[Start with Lab 0](labs/lab-00-setup.md){ .md-button .md-button--primary }
[See the lab map](labs/index.md){ .md-button }

</div>

## What you will build

In the recorded run, the agents build **Pinch**: a small, pretty and fully bilingual (EN/FR) recipe scaler with a cook mode. It has no backend and no secrets, so it is safe to build, review and deploy in a few hours.

* **Scale** a recipe to any number of servings, with sensible rounding.
* **Convert** between metric and imperial units.
* **Cook mode**: large text, tick off steps, build a shopping list.
* **Bilingual UI**: every string exists in English and French, enforced by a gate.

The app lives in its own repository, [ai-sdlc-labs-pinch](https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch), with a checkpoint tag at the end of every lab.

## The lifecycle at a glance

<ol class="flow-strip" aria-label="AI-SDLC lifecycle: Idea, Plan, Build, Test, Sign-off, Deploy, Production">
  <li class="phase-card phase-idea">
    <span class="ico" aria-hidden="true">💡</span>
    <span class="tag">Kickoff</span>
    <strong>Idea</strong>
    <span class="gate">product brief</span>
  </li>
  <li class="phase-card phase-plan">
    <span class="ico" aria-hidden="true">🧭</span>
    <span class="tag">Plan</span>
    <strong>Plan</strong>
    <span class="gate">design · prototype · spec review</span>
  </li>
  <li class="phase-card phase-build">
    <span class="ico" aria-hidden="true">🔨</span>
    <span class="tag">Build</span>
    <strong>Build</strong>
    <span class="gate">build · lint · unit</span>
  </li>
  <li class="phase-card phase-test">
    <span class="ico" aria-hidden="true">✅</span>
    <span class="tag">Test</span>
    <strong>Test</strong>
    <span class="gate">qa · review · security</span>
  </li>
  <li class="phase-card phase-sign">
    <span class="ico" aria-hidden="true">🔐</span>
    <span class="tag">Sign-off</span>
    <strong>Sign-off</strong>
    <span class="gate">mandatory human approval</span>
  </li>
  <li class="phase-card phase-deploy">
    <span class="ico" aria-hidden="true">🚀</span>
    <span class="tag">Deploy</span>
    <strong>Deploy</strong>
    <span class="gate">pre-deploy · smoke · rollback-ready</span>
  </li>
  <li class="phase-card phase-prod">
    <span class="ico" aria-hidden="true">📦</span>
    <span class="tag">Shipped</span>
    <strong>Production</strong>
    <span class="gate">DONE</span>
  </li>
</ol>

!!! loop "Two loops you will meet in the labs"
    **Gate fail:** when a quality gate fails, the work goes back to the Build phase and the owning agent fixes it.
    **Changes requested:** at sign-off, a human can send the work back to Build. Any change after approval resets the sign-off.

## Meet the team

Eleven `ait-` agents work as one team. Humans stay in the loop at every phase.

<ul class="agent-grid">
  <li class="agent-card phase-orch">
    <span class="agent-avatar" aria-hidden="true">🎯</span>
    <div><strong>Orchestrator</strong><code>ait-sdlc-orchestrator</code><span class="role">Splits the work into tasks, dispatches agents, enforces the gates.</span></div>
  </li>
  <li class="agent-card phase-plan">
    <span class="agent-avatar" aria-hidden="true">🎨</span>
    <div><strong>Product Designer</strong><code>ait-product-designer</code><span class="role">User journeys, wireframes, a clickable prototype.</span></div>
  </li>
  <li class="agent-card phase-plan">
    <span class="agent-avatar" aria-hidden="true">📋</span>
    <div><strong>Product Owner</strong><code>ait-product-owner</code><span class="role">Requirements, acceptance criteria, backlog.</span></div>
  </li>
  <li class="agent-card phase-plan">
    <span class="agent-avatar" aria-hidden="true">🏛️</span>
    <div><strong>Architect</strong><code>ait-architect</code><span class="role">Technical spec, data model, decisions (ADRs).</span></div>
  </li>
  <li class="agent-card phase-build">
    <span class="agent-avatar" aria-hidden="true">💻</span>
    <div><strong>Backend Dev</strong><code>ait-backend-dev</code><span class="role">Server logic, APIs, persistence, tests.</span></div>
  </li>
  <li class="agent-card phase-build">
    <span class="agent-avatar" aria-hidden="true">🖥️</span>
    <div><strong>Frontend Dev</strong><code>ait-frontend-dev</code><span class="role">UI, accessibility, client state, tests.</span></div>
  </li>
  <li class="agent-card phase-test">
    <span class="agent-avatar" aria-hidden="true">🧪</span>
    <div><strong>QA / Test</strong><code>ait-qa-test</code><span class="role">Test plan, acceptance checks, regressions.</span></div>
  </li>
  <li class="agent-card phase-test">
    <span class="agent-avatar" aria-hidden="true">🔎</span>
    <div><strong>Code Critic</strong><code>ait-code-reviewer</code><span class="role">Finds blocking defects before sign-off.</span></div>
  </li>
  <li class="agent-card phase-test">
    <span class="agent-avatar" aria-hidden="true">🛡️</span>
    <div><strong>Security / RAI</strong><code>ait-security-rai</code><span class="role">Secrets, dependencies, threats, responsible AI.</span></div>
  </li>
  <li class="agent-card phase-deploy">
    <span class="agent-avatar" aria-hidden="true">⚙️</span>
    <div><strong>DevOps</strong><code>ait-devops</code><span class="role">CI/CD, release checks, rollback plan.</span></div>
  </li>
  <li class="agent-card phase-human">
    <span class="agent-avatar" aria-hidden="true">📝</span>
    <div><strong>Scribe</strong><code>ait-scribe</code><span class="role">Keeps the decisions and the change log tidy.</span></div>
  </li>
</ul>

## The labs

| Lab | Title | Duration | Level |
|-----|-------|----------|-------|
| [0](labs/lab-00-setup.md) | Prerequisites and setup | 20 min | Beginner |
| [1](labs/lab-01-idea-to-brief.md) | From idea to brief | 25 min | Beginner |
| [2](labs/lab-02-design-prototype.md) | Design and prototype | 35 min | Beginner |
| [3](labs/lab-03-requirements-architecture.md) | Requirements and architecture | 35 min | Intermediate |
| [4](labs/lab-04-build-in-slices.md) | Build in slices | 60 min | Intermediate |
| [5](labs/lab-05-qa-critic-security.md) | QA, critic review and security | 45 min | Intermediate |
| [6](labs/lab-06-signoff-changes-requested.md) | Human sign-off and changes requested | 30 min | Intermediate |
| [7](labs/lab-07-deploy.md) | Deploy to production | 30 min | Intermediate |
| [8](labs/lab-08-resume-recover-teardown.md) | Resume, recover and tear down | 25 min | Intermediate |

## Two ways to learn

<div class="path-grid" markdown>

<div class="phase-card phase-prod" markdown>

### Follow the recorded run

Read each lab, then jump to its **checkpoint**: a Git tag in the Pinch repository that holds the exact result of the recorded run. Cheap, fast and repeatable. Use it to learn how the gates and artifacts look without spending credits.

</div>

<div class="phase-card phase-idea" markdown>

### Bring your own idea

Run every lab on **your own product idea** in your own repository. The agents' output will differ from the recorded run, and that is expected. A full lifecycle run can use about 2,000 credits and 2 to 3 hours.

</div>

</div>

!!! cost "Mind the budget"
    Agents run with broad permissions and real model credits. Read the cost note in [Lab 0](labs/lab-00-setup.md#cost-and-credits) before you start a long run.
