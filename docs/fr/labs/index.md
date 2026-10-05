---
title: Carte des ateliers
description: Les neuf ateliers AI-SDLC, avec leur durée, leur niveau et leurs points de contrôle, de l'installation à la reprise et au nettoyage.
---

# Carte des ateliers

Les ateliers suivent le cycle de vie : installer, préciser l'idée, planifier, construire, tester, approuver, déployer, puis apprendre à reprendre et à nettoyer. Chaque atelier tient en une séance et se termine sur un **point de contrôle** à partir duquel vous pouvez commencer le suivant.

## Carte des ateliers

| Atelier | Titre | Phase | Durée | Niveau | Point de contrôle |
|---------|-------|-------|-------|--------|-------------------|
| [0](lab-00-setup.md) | Prérequis et installation | <span aria-hidden="true">🧰</span> Installation | 20 min | Débutant | `lab-00-end` |
| [1](lab-01-idea-to-brief.md) | De l'idée à l'énoncé | <span aria-hidden="true">💡</span> Idée | 25 min | Débutant | `lab-01-end` |
| [2](lab-02-design-prototype.md) | Conception et prototype | <span aria-hidden="true">🧭</span> Planification | 35 min | Débutant | `lab-02-end` |
| [3](lab-03-requirements-architecture.md) | Exigences et architecture | <span aria-hidden="true">🧭</span> Planification | 35 min | Intermédiaire | `lab-03-end` |
| [4](lab-04-build-in-slices.md) | Construction par tranches | <span aria-hidden="true">🔨</span> Construction | 60 min | Intermédiaire | `lab-04-end` |
| [5](lab-05-qa-critic-security.md) | QA, revue critique et sécurité | <span aria-hidden="true">✅</span> Tests | 45 min | Intermédiaire | `lab-05-end` |
| [6](lab-06-signoff-changes-requested.md) | Approbation humaine et modifications demandées | <span aria-hidden="true">🔐</span> Approbation | 30 min | Intermédiaire | `lab-06-end` |
| [7](lab-07-deploy.md) | Déploiement en production | <span aria-hidden="true">🚀</span> Déploiement | 30 min | Intermédiaire | `lab-07-end` |
| [8](lab-08-resume-recover-teardown.md) | Reprise, récupération et nettoyage | <span aria-hidden="true">♻️</span> Toutes | 25 min | Intermédiaire | `lab-08-end` |

Temps de manipulation total : environ 5 heures, plus la durée d'exécution des agents. Les exécutions sont bornées : chaque atelier lance une ou deux courtes exécutions plutôt qu'un marathon.

## Structure de chaque atelier

Chaque page d'atelier a les mêmes sections, pour que vous sachiez toujours où chercher :

* Un **tableau de présentation** avec la durée, le niveau, les prérequis et le point de contrôle.
* Les **objectifs d'apprentissage**.
* Des **étapes** suivies chacune d'un *Résultat attendu*.
* Une **liste de validation**, souvent accompagnée d'un extrait PowerShell.
* Du **dépannage**, une **note sur les coûts** et une courte **vérification des connaissances**.

<div class="lab-meta" markdown>

| Élément | Où |
|---------|----|
| Des mots que vous ne connaissez pas | [Glossaire](../glossary.md) |
| Quelque chose ne fonctionne pas | [Dépannage](../troubleshooting.md) |
| Qui a fait ceci | [À propos](../about.md) |

</div>

## Points de contrôle

Un point de contrôle est une étiquette Git (tag) du [dépôt de référence Pinch](https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch). L'étiquette `lab-NN-end` correspond à l'état à la fin de l'atelier NN, et le début de l'atelier NN+1 est le même commit.

!!! checkpoint "Suivre l'exécution ou apporter votre idée"
    Sur le parcours enregistré, extrayez l'étiquette de point de contrôle de l'atelier précédent pour partir d'un état connu. Sur votre propre parcours, votre dépôt est votre point de contrôle : faites un commit à la fin de chaque atelier.

!!! wip "Contenu en cours de rédaction"
    L'installation (atelier 0) est complète. Les ateliers 1 à 8 présentent aujourd'hui leur aperçu et leurs objectifs ; les étapes détaillées, les captures d'écran et les points de contrôle s'ajoutent à mesure que l'application de référence est construite.
