---
title: "Atelier 8 : Reprise, récupération et nettoyage"
description: Reprenez une exécution interrompue à partir de son état sauvegardé, récupérez après l'échec d'une tâche, conservez les preuves dans le dépôt et faites le ménage.
---

# Atelier 8 : Reprise, récupération et nettoyage

<span class="chip phase-orch"><span aria-hidden="true">♻️</span> Toutes les phases</span> <span class="chip phase-idea">25 min</span> <span class="chip phase-build">Intermédiaire</span>

## Présentation

<div class="lab-meta" markdown>

| Élément | Détails |
|---------|---------|
| **Durée** | 25 minutes |
| **Niveau** | Intermédiaire |
| **Prérequis** | [Atelier 7 : Déploiement en production](lab-07-deploy.md) |
| **Point de contrôle** | Étiquette `lab-08-end` dans le dépôt de référence : l'instantané de l'exécution est validé sous `docs/run/` et l'environnement est nettoyé. |

</div>

## Objectifs d'apprentissage

À la fin de cet atelier, vous serez en mesure de :

* Arrêter une exécution et la reprendre à partir de `state.json` sans refaire le travail terminé.
* Remettre une seule tâche à l'état `pending` et ne relancer que celle-ci.
* Conserver `state.json`, `plan.md`, `tasks.md`, `changes.md` et `decisions.md` dans `docs/run/<run-id>/`.
* Démonter ce que les ateliers ont créé (déploiements, dépôts d'entraînement, dossiers locaux).

## État d'avancement

!!! wip "Contenu en cours de rédaction"
    Les étapes détaillées, les captures d'écran et le point de contrôle de cet atelier s'ajoutent à mesure que l'application de référence est construite. La présentation et les objectifs ci-dessus sont définitifs.

## Prochaines étapes

Vous avez parcouru tout le cycle de vie. Consultez le [glossaire](../glossary.md), puis recommencez avec votre propre idée.
