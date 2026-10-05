---
title: Dépannage
description: Problèmes courants des ateliers AI-SDLC sous Windows et PowerShell, avec des solutions rapides pour l'installation, l'exécution des agents, les consoles et les coûts.
---

# Dépannage

Commencez ici quand quelque chose ne fonctionne pas. L'atelier 0 détaille les solutions d'installation ; cette page rassemble les problèmes que vous pouvez rencontrer dans tous les ateliers.

## Installation et ouverture de session

* **Un outil est « non reconnu » juste après son installation.** Ouvrez un nouveau terminal ; l'ancienne fenêtre garde l'ancien `PATH`.
* **`copilot plugin list` n'affiche pas `ai-team-sdlc`.** Relancez les commandes d'ajout du marché et d'installation de l'[atelier 0](labs/lab-00-setup.md#etape-4-ajouter-le-marche-et-installer-le-plugin), puis vérifiez `copilot --version`.
* **npm échoue avec des erreurs SSL ou 401.** Les ateliers exigent `https://registry.npmjs.org/`. Consultez le [dépannage de l'atelier 0](labs/lab-00-setup.md#npm-ou-le-registre-dentreprise-echoue).

## Exécution des agents

* **L'agent travaille dans le mauvais dossier.** Son outil shell peut ignorer `cd`. Lancez `copilot` à la racine du dépôt.
* **`/product-run` ne fait rien dans la CLI.** Ce sont des invites VS Code. Écrivez plutôt `Use the ait-sdlc-orchestrate skill ...`.
* **Une tâche indique `blocked`.** Lisez le motif avant d'agir. Souvent, un seuil de passerelle défini dans votre énoncé tranche déjà, ou une dérogation humaine est nécessaire.
* **Une exécution est trop lente ou trop coûteuse.** Arrêtez-la avec `Ctrl+C`, gardez la portée petite et reprenez plus tard à partir de `state.json`.
* **Un agent auxiliaire dit ne pas pouvoir lire les fichiers.** Les sous-agents n'ont parfois pas d'outil de lecture. L'orchestrateur doit faire le travail lui-même ; demandez-lui de continuer.

## Consoles et fichiers

* **Caractères illisibles comme `ΓÇö`.** Activez l'UTF-8 dans la session, voir l'[atelier 0, étape 1](labs/lab-00-setup.md#etape-1-utiliser-une-console-utf-8).
* **Dossiers de journaux énormes.** Faites ignorer par Git les journaux d'exécution et les profils de navigateur avant la première exécution.
* **Avertissements `EPERM` pendant `npm install`.** Un fichier est verrouillé par l'antivirus ou un autre processus. Ne lancez pas deux installations en même temps et gardez le dépôt hors des dossiers synchronisés.

## Toujours bloqué ?

Ouvrez un ticket dans le [dépôt ai-sdlc-labs](https://github.com/devopsabcs-engineering/ai-sdlc-labs/issues) en indiquant l'atelier et l'étape, votre version de Copilot CLI et le texte exact de l'erreur.
