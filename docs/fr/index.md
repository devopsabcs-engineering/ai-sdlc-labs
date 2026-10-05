---
title: Créez une application de l'idée à la production avec des agents IA
description: Ateliers pratiques qui vous mènent de l'idée à une application déployée avec le plugin Copilot ai-team-sdlc, ses passerelles de qualité et une approbation humaine.
hide:
  - toc
---

<div class="hero" markdown>

<p class="eyebrow">Ateliers pratiques · EN / FR · Windows + PowerShell + VS Code</p>

# De l'idée à la production, avec une équipe d'IA et un humain aux commandes

<p class="lead">
Vous utiliserez le plugin GitHub Copilot <code>ai-team-sdlc</code> : un orchestrateur et dix agents spécialisés qui conçoivent, construisent, testent et déploient une application, avec des passerelles de qualité à chaque étape et une approbation humaine obligatoire.
</p>

[Commencer par l'atelier 0](labs/lab-00-setup.md){ .md-button .md-button--primary }
[Voir la carte des ateliers](labs/index.md){ .md-button }

</div>

## Ce que vous allez construire

Dans l'exécution enregistrée, les agents construisent **Pinch** : un petit outil élégant et entièrement bilingue (EN/FR) qui ajuste les quantités d'une recette, avec un mode cuisson. Il n'a ni serveur ni secret : on peut donc le construire, le réviser et le déployer en quelques heures sans risque.

* **Ajuster** une recette à n'importe quel nombre de portions, avec des arrondis sensés.
* **Convertir** entre les unités métriques et impériales.
* **Mode cuisson** : texte agrandi, étapes à cocher, liste d'épicerie.
* **Interface bilingue** : chaque texte existe en français et en anglais, ce que vérifie une passerelle.

L'application vit dans son propre dépôt, [ai-sdlc-labs-pinch](https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch), avec une étiquette Git (tag) de point de contrôle à la fin de chaque atelier.

## Le cycle de vie en un coup d'œil

<ol class="flow-strip" aria-label="Cycle de vie AI-SDLC : idée, planification, construction, tests, approbation, déploiement, production">
  <li class="phase-card phase-idea">
    <span class="ico" aria-hidden="true">💡</span>
    <span class="tag">Départ</span>
    <strong>Idée</strong>
    <span class="gate">énoncé du produit</span>
  </li>
  <li class="phase-card phase-plan">
    <span class="ico" aria-hidden="true">🧭</span>
    <span class="tag">Plan</span>
    <strong>Planification</strong>
    <span class="gate">conception · prototype · revue des specs</span>
  </li>
  <li class="phase-card phase-build">
    <span class="ico" aria-hidden="true">🔨</span>
    <span class="tag">Build</span>
    <strong>Construction</strong>
    <span class="gate">build · lint · unit</span>
  </li>
  <li class="phase-card phase-test">
    <span class="ico" aria-hidden="true">✅</span>
    <span class="tag">Test</span>
    <strong>Tests</strong>
    <span class="gate">qa · revue · sécurité</span>
  </li>
  <li class="phase-card phase-sign">
    <span class="ico" aria-hidden="true">🔐</span>
    <span class="tag">Approbation</span>
    <strong>Approbation</strong>
    <span class="gate">approbation humaine obligatoire</span>
  </li>
  <li class="phase-card phase-deploy">
    <span class="ico" aria-hidden="true">🚀</span>
    <span class="tag">Livraison</span>
    <strong>Déploiement</strong>
    <span class="gate">pre-deploy · smoke · rollback-ready</span>
  </li>
  <li class="phase-card phase-prod">
    <span class="ico" aria-hidden="true">📦</span>
    <span class="tag">Livré</span>
    <strong>Production</strong>
    <span class="gate">TERMINÉ</span>
  </li>
</ol>

!!! loop "Deux boucles que vous croiserez dans les ateliers"
    **Échec d'une passerelle :** quand une passerelle de qualité échoue, le travail retourne à la phase de construction et l'agent responsable le corrige.
    **Modifications demandées :** à l'approbation, un humain peut renvoyer le travail en construction. Toute modification après l'approbation la réinitialise.

## Faites connaissance avec l'équipe

Onze agents `ait-` forment une seule équipe. Les humains restent dans la boucle à chaque phase.

<ul class="agent-grid">
  <li class="agent-card phase-orch">
    <span class="agent-avatar" aria-hidden="true">🎯</span>
    <div><strong>Orchestrateur</strong><code>ait-sdlc-orchestrator</code><span class="role">Découpe le travail en tâches, répartit les agents, applique les passerelles.</span></div>
  </li>
  <li class="agent-card phase-plan">
    <span class="agent-avatar" aria-hidden="true">🎨</span>
    <div><strong>Concepteur de produit</strong><code>ait-product-designer</code><span class="role">Parcours utilisateur, maquettes, prototype cliquable.</span></div>
  </li>
  <li class="agent-card phase-plan">
    <span class="agent-avatar" aria-hidden="true">📋</span>
    <div><strong>Responsable produit</strong><code>ait-product-owner</code><span class="role">Exigences, critères d'acceptation, carnet de produit.</span></div>
  </li>
  <li class="agent-card phase-plan">
    <span class="agent-avatar" aria-hidden="true">🏛️</span>
    <div><strong>Architecte</strong><code>ait-architect</code><span class="role">Spécification technique, modèle de données, décisions (ADR).</span></div>
  </li>
  <li class="agent-card phase-build">
    <span class="agent-avatar" aria-hidden="true">💻</span>
    <div><strong>Développeur back-end</strong><code>ait-backend-dev</code><span class="role">Logique serveur, API, persistance, tests.</span></div>
  </li>
  <li class="agent-card phase-build">
    <span class="agent-avatar" aria-hidden="true">🖥️</span>
    <div><strong>Développeur front-end</strong><code>ait-frontend-dev</code><span class="role">Interface, accessibilité, état côté client, tests.</span></div>
  </li>
  <li class="agent-card phase-test">
    <span class="agent-avatar" aria-hidden="true">🧪</span>
    <div><strong>QA / Tests</strong><code>ait-qa-test</code><span class="role">Plan de test, vérifications d'acceptation, régressions.</span></div>
  </li>
  <li class="agent-card phase-test">
    <span class="agent-avatar" aria-hidden="true">🔎</span>
    <div><strong>Critique de code</strong><code>ait-code-reviewer</code><span class="role">Repère les défauts bloquants avant l'approbation.</span></div>
  </li>
  <li class="agent-card phase-test">
    <span class="agent-avatar" aria-hidden="true">🛡️</span>
    <div><strong>Sécurité / IA responsable</strong><code>ait-security-rai</code><span class="role">Secrets, dépendances, menaces, IA responsable.</span></div>
  </li>
  <li class="agent-card phase-deploy">
    <span class="agent-avatar" aria-hidden="true">⚙️</span>
    <div><strong>DevOps</strong><code>ait-devops</code><span class="role">CI/CD, vérifications de livraison, plan de retour arrière.</span></div>
  </li>
  <li class="agent-card phase-human">
    <span class="agent-avatar" aria-hidden="true">📝</span>
    <div><strong>Scribe</strong><code>ait-scribe</code><span class="role">Tient les décisions et le journal des changements en ordre.</span></div>
  </li>
</ul>

## Les ateliers

| Atelier | Titre | Durée | Niveau |
|---------|-------|-------|--------|
| [0](labs/lab-00-setup.md) | Prérequis et installation | 20 min | Débutant |
| [1](labs/lab-01-idea-to-brief.md) | De l'idée à l'énoncé | 25 min | Débutant |
| [2](labs/lab-02-design-prototype.md) | Conception et prototype | 35 min | Débutant |
| [3](labs/lab-03-requirements-architecture.md) | Exigences et architecture | 35 min | Intermédiaire |
| [4](labs/lab-04-build-in-slices.md) | Construction par tranches | 60 min | Intermédiaire |
| [5](labs/lab-05-qa-critic-security.md) | QA, revue critique et sécurité | 45 min | Intermédiaire |
| [6](labs/lab-06-signoff-changes-requested.md) | Approbation humaine et modifications demandées | 30 min | Intermédiaire |
| [7](labs/lab-07-deploy.md) | Déploiement en production | 30 min | Intermédiaire |
| [8](labs/lab-08-resume-recover-teardown.md) | Reprise, récupération et nettoyage | 25 min | Intermédiaire |

## Deux façons d'apprendre

<div class="path-grid" markdown>

<div class="phase-card phase-prod" markdown>

### Suivre l'exécution enregistrée

Lisez chaque atelier, puis passez à son **point de contrôle** : une étiquette Git (tag) du dépôt Pinch qui contient le résultat exact de l'exécution enregistrée. Économique, rapide et reproductible. Idéal pour voir à quoi ressemblent les passerelles et les artefacts sans dépenser de crédits.

</div>

<div class="phase-card phase-idea" markdown>

### Apporter votre propre idée

Réalisez chaque atelier avec **votre propre idée de produit**, dans votre propre dépôt. Le résultat des agents différera de l'exécution enregistrée, et c'est normal. Un cycle de vie complet peut consommer environ 2 000 crédits et durer de 2 à 3 heures.

</div>

</div>

!!! cost "Surveillez votre budget"
    Les agents s'exécutent avec de larges permissions et de vrais crédits de modèle. Lisez la note sur les coûts de l'[atelier 0](labs/lab-00-setup.md#cost-and-credits) avant de lancer une longue exécution.
