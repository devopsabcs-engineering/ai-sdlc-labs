---
title: "Atelier 4 : Construction par tranches"
description: Laissez l'orchestrateur découper le travail en tâches, construisez l'application par petites tranches et voyez les passerelles build, lint, unit et i18n garder chaque tranche rigoureuse.
---

# Atelier 4 : Construction par tranches

<span class="chip phase-build"><span aria-hidden="true">🔨</span> Construction</span> <span class="chip phase-idea">60 min</span> <span class="chip phase-build">Intermédiaire</span>

## Présentation

<div class="lab-meta" markdown>

| Élément | Détails |
|---------|---------|
| **Durée** | 60 minutes |
| **Niveau** | Intermédiaire |
| **Prérequis** | [Atelier 3 : Exigences et architecture](lab-03-requirements-architecture.md) |
| **Point de contrôle** | Étiquette `lab-04-end` dans le dépôt de référence : toutes les tâches de construction sont terminées, chaque passerelle de construction a réussi, un commit par tâche. |

</div>

## Objectifs d'apprentissage

À la fin de cet atelier, vous serez en mesure de :

* Lire comment l'orchestrateur découpe la spécification en tâches atomiques dans `state.json` et `tasks.md`.
* Lancer une phase de construction bornée et l'arrêter à une passerelle.
* Expliquer les passerelles `build`, `lint` et `unit` ainsi que la passerelle bilingue (i18n).
* Suivre la boîte de réception (inbox) et le scribe : comment les agents rendent compte sans modifier les fichiers partagés.
* Faire un commit par tâche pour qu'une mauvaise tâche soit facile à annuler.

## État d'avancement

!!! wip "Contenu en cours de rédaction"
    Les étapes détaillées, les captures d'écran et le point de contrôle de cet atelier s'ajoutent à mesure que l'application de référence est construite. La présentation et les objectifs ci-dessus sont définitifs.

## Prochaines étapes

Poursuivez avec l'[atelier 5 : QA, revue critique et sécurité](lab-05-qa-critic-security.md).
