---
title: Glossaire
description: Définitions en langage simple des termes AI-SDLC utilisés dans les ateliers, avec le terme anglais correspondant.
---

# Glossaire

Chaque terme est accompagné de son équivalent anglais, afin que les deux versions des ateliers emploient les mêmes mots.

## Cycle de vie

| Terme | Définition | En anglais |
|-------|------------|------------|
| Énoncé du produit | La courte description du produit (`specs/idea.md`) que tous les agents respectent : idée, utilisateurs, portée, exclusions, règles d'exécution. | brief |
| Prototype | Une maquette cliquable servant à vérifier l'expérience utilisateur avant qu'il existe du vrai code. | prototype |
| Document d'exigences produit (PRD) | Ce que le produit doit faire et la façon de mesurer son succès. | PRD |
| Spécification technique | L'architecture, le modèle de données et les contrats qui transforment le PRD en travail réalisable. | technical specification |
| Fiche de décision d'architecture (ADR) | Une courte note par décision technique importante, qui explique pourquoi elle a été prise. | ADR |
| Tranche | Une petite partie de l'application, testable seule, que les agents construisent en une tâche. | slice |
| Tâche | Une unité de travail atomique avec un responsable, des dépendances et des passerelles obligatoires. | task |
| Livraison | La mise à disposition de l'artefact approuvé aux utilisateurs ; dans le cycle de vie, c'est la phase de déploiement. | delivery |

## Qualité et gouvernance

| Terme | Définition | En anglais |
|-------|------------|------------|
| Passerelle de qualité | Une vérification automatisée ou révisée qui doit réussir avant qu'une tâche soit considérée comme terminée (build, lint, unit, acceptation, revue, sécurité). | quality gate |
| Approbation humaine | L'approbation obligatoire par des personnes (responsable produit, équipe de sécurité, responsable technique) avant tout déploiement. | human sign-off |
| Modifications demandées | Un résultat d'approbation qui renvoie le travail en construction et réinitialise l'approbation. | changes requested |
| Dérogation | Une décision humaine consignée d'accepter une vérification qu'aucun agent ne peut effectuer, avec le nom, les critères et le motif. | waiver |
| Revue critique | Une révision indépendante du code à la recherche de défauts bloquants. | critic review |
| Critères d'acceptation | Les énoncés vérifiables qui disent quand une fonctionnalité est terminée. | acceptance criteria |
| Test de fumée | Une vérification très courte que l'application déployée démarre et fonctionne. | smoke test |
| Retour arrière | Le retour à la version précédente qui fonctionnait. | rollback |
| Reprise | Une nouvelle tentative comptabilisée après l'échec d'une passerelle, faite par l'agent responsable. | retry |

## Outils et état d'exécution

| Terme | Définition | En anglais |
|-------|------------|------------|
| Agent | Un spécialiste IA (concepteur, architecte, développeur, testeur, etc.) qui tient un rôle dans l'équipe. | agent |
| Compétence (skill) | Un ensemble packagé d'instructions qu'un agent charge pour une tâche précise, comme `ait-init`. | skill |
| Plugin (module d'extension) | Le paquet installable qui apporte les agents et les compétences dans Copilot. | plugin |
| Marché (marketplace) | Le registre que Copilot consulte pour trouver et installer des plugins. | marketplace |
| Orchestrateur | L'agent qui découpe le travail, répartit les autres agents et applique les passerelles. | orchestrator |
| Scribe | L'agent qui fusionne ce que les autres ont écrit dans les décisions et le journal des changements. | scribe |
| Registre de suivi | Le dossier `.copilot-tracking/<run-id>/` qui contient l'état d'une exécution. Il est ignoré par Git. | tracking store |
| Exécution | Un déroulement du cycle de vie, repéré par un identifiant d'exécution. | run |
| Point de contrôle | Une étiquette Git (tag) qui marque l'état valide à la fin d'un atelier. | checkpoint |
| Boîte de réception | Le dossier où chaque agent dépose son propre fichier de résultat, pour que des agents en parallèle n'écrasent jamais le travail des autres. | inbox |
| Crédit | L'unité d'utilisation de Copilot qu'une exécution consomme. | credit |
