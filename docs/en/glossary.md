---
title: Glossary
description: Plain-language definitions of the AI-SDLC terms used in the labs, with the matching French term.
---

# Glossary

Each term has its French equivalent, so both language versions of the labs use the same words.

## Lifecycle

| Term | Definition | In French |
|------|------------|-----------|
| Brief | The short product description (`specs/idea.md`) that every agent follows: idea, users, scope, out-of-scope, run rules. | énoncé du produit |
| Prototype | A clickable mock-up used to check the user experience before any real code exists. | prototype |
| PRD | Product requirements document: what the product must do and how success is measured. | document d'exigences produit (PRD) |
| Technical specification | The architecture, data model and contracts that turn the PRD into buildable work. | spécification technique |
| ADR | Architecture decision record: one short note per important technical decision and why it was made. | fiche de décision d'architecture (ADR) |
| Slice | A small, independently testable part of the app that the agents build in one task. | tranche |
| Task | One atomic unit of work with an owner, dependencies and required gates. | tâche |
| Delivery | Shipping the approved artifact to users; in the lifecycle it is the Deploy phase. | livraison |

## Quality and governance

| Term | Definition | In French |
|------|------------|-----------|
| Quality gate | An automated or reviewed check that must pass before a task counts as done (build, lint, unit, acceptance, review, security). | passerelle de qualité |
| Human sign-off | The mandatory approval by people (product owner, security team, tech lead) before anything is deployed. | approbation humaine |
| Changes requested | A sign-off outcome that sends the work back to Build and resets the approval. | modifications demandées |
| Waiver | A recorded human decision to accept a check that no agent can verify, with name, criteria and reason. | dérogation |
| Critic review | An independent review of the code for blocking defects. | revue critique |
| Acceptance criteria | The testable statements that say when a feature is done. | critères d'acceptation |
| Smoke test | A very short check that the deployed app starts and works. | test de fumée |
| Rollback | Returning to the previous working version. | retour arrière |
| Retry | A counted new attempt after a failed gate, made by the owning agent. | reprise |

## Tooling and run state

| Term | Definition | In French |
|------|------------|-----------|
| Agent | An AI specialist (designer, architect, developer, tester, and so on) with one role in the team. | agent |
| Skill | A packaged set of instructions an agent loads for one job, such as `ait-init`. | compétence (skill) |
| Plugin | The installable package that brings the agents and skills into Copilot. | plugin (module d'extension) |
| Marketplace | The registry Copilot reads to find and install plugins. | marché (marketplace) |
| Orchestrator | The agent that splits the work, dispatches the others and enforces the gates. | orchestrateur |
| Scribe | The agent that merges what the others wrote into the decisions and change log. | scribe |
| Tracking store | The `.copilot-tracking/<run-id>/` folder that holds the state of a run. It is git-ignored. | registre de suivi |
| Run | One execution of the lifecycle, identified by a run id. | exécution |
| Checkpoint | A Git tag that marks the known-good state at the end of a lab. | point de contrôle |
| Inbox | The folder where each agent drops its own result file so parallel agents never overwrite each other. | boîte de réception |
| Credit | The unit of Copilot usage that a run consumes. | crédit |
