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
| **Atelier suivant** | Aucun. C'est le dernier atelier : consultez le [plan des ateliers](index.md), le [glossaire](../glossary.md) et le [dépannage](../troubleshooting.md). |

</div>

Dans la réalité, les exécutions s'arrêtent : une passerelle bloque, un terminal se ferme, une plateforme a un incident. Cet atelier montre comment continuer sans refaire le travail terminé, comment garder les preuves dans votre dépôt, ce que la construction complète a coûté, et comment supprimer ce que vous avez créé.

## Objectifs d'apprentissage

À la fin de cet atelier, vous serez en mesure de :

* Arrêter une exécution et la reprendre à partir de `state.json` sans refaire le travail terminé.
* Remettre une seule tâche à l'état `pending` et ne relancer que celle-ci.
* Associer un échec au bon modèle de récupération.
* Conserver `state.json`, `plan.md`, `tasks.md`, `changes.md` et `decisions.md` dans `docs/run/<run-id>/`.
* Lire le coût d'une construction complète et en planifier une moins coûteuse.
* Démonter ce que les ateliers ont créé (déploiements, dépôts d'entraînement, dossiers locaux) sans toucher aux dépôts de référence.

## Coûts et crédits { #cost-and-credits }

!!! cost "Reprendre coûte moins cher que recommencer"
    Une exécution de reprise de l'exemple Focus Garden a duré 19 minutes et consommé environ 392 crédits, contre environ 2 097 crédits pour sa première exécution. Toute la construction de Pinch a coûté environ 1 730 crédits (tableau à l'étape 6). Consultez l'[atelier 0](lab-00-setup.md#cost-and-credits) pour les règles qui gardent une exécution peu coûteuse.

## Étapes

!!! warning "Le nettoyage ne touche que votre propre dépôt"
    Les étapes 7 et 8 suppriment des éléments. Exécutez-les **uniquement** sur votre propre dépôt d'entraînement, et lisez chaque commande avant d'appuyer sur Entrée. N'exécutez jamais une commande de nettoyage contre `ai-sdlc-labs-pinch`, `ai-team-sdlc`, `ai-sdlc-labs` ou l'exemple Focus Garden. Si vous n'avez pas de dépôt d'entraînement, lisez ces étapes et sautez les commandes.

### Étape 1 : Lire l'état de l'exécution

`state.json` est le registre de référence d'une exécution. `plan.md` et `tasks.md` en sont des projections, et en cas de désaccord, `state.json` l'emporte. Lisez-le dans votre propre registre de suivi, ou dans l'instantané d'un clone en lecture seule du dépôt de référence.

```powershell
git clone https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch.git "$HOME\src\pinch-reference"
Set-Location -LiteralPath "$HOME\src\pinch-reference"
git switch --detach lab-08-end
$StatePath = 'docs\run\2026-10-05-pinch\state.json'   # votre exécution : .copilot-tracking\<run-id>\state.json
$state = Get-Content $StatePath -Raw | ConvertFrom-Json
$state.status; $state.currentPhase
$state.tasks | Select-Object id, owner, status, retries | Format-Table -AutoSize
```

!!! success "Résultat attendu"
    `status` vaut `done` et `currentPhase` vaut `deploy`. Le tableau liste T-001 à T-014, toutes à `done`. Regardez `retries` : T-012 (revue critique) indique 1 et T-013 (sécurité) indique 2. T-011 indique 0, car elle a été réinitialisée après une correction humaine (étape 3).

Ne poussez rien depuis ce clone : il sert uniquement à lire.

### Étape 2 : Arrêter une exécution et la reprendre

Arrêtez une exécution avec `Ctrl+C` dans le terminal où `copilot` s'exécute. L'état est écrit sur le disque à mesure que les tâches se terminent : peu de choses sont perdues. À la fin de chaque exécution, la CLI affiche un identifiant de session. Deux façons de continuer :

```powershell
# 1. Continuer la même session de la CLI
copilot --resume=<session-id>

# 2. Démarrer une nouvelle session et reprendre par identifiant d'exécution
copilot -p "Use the ait-sdlc-orchestrate skill. Resume run <run-id>. Run ONLY the next pending task. Do not push, do not deploy." --allow-all-tools --no-ask-user
```

L'orchestrateur applique ces règles à la reprise :

* Il lit `state.json`, puis réconcilie `plan.md`.
* Une tâche restée `in_progress` après une panne compte comme **non terminée** et est relancée.
* Il continue à la première tâche `pending` ou `in_progress` dont toutes les dépendances sont `done`.
* Les tâches `done` ne sont jamais refaites.
* Il ne reprend que si vous donnez un identifiant d'exécution existant. Sinon, il crée un nouvel identifiant.

!!! tip "Les exécutions bornées se reprennent bien"
    Demandez une phase ou quelques tâches par invite, et ajoutez `--share evidence\<name>.md --log-dir evidence\logs` pour que chaque exécution laisse une trace. L'exécution Focus Garden a été reprise à partir de `state.json` au fil de 4 appels.

### Étape 3 : Récupérer une tâche bloquée

Une passerelle en échec est retentée avec le contexte de l'échec, et `retries` augmente. Après 2 reprises, la tâche devient `blocked` et l'exécution s'arrête jusqu'à ce qu'une personne décide. Dans Pinch, T-011 (assurance qualité) a été bloquée parce que l'agent n'a pas pu installer Prettier : le registre d'entreprise a refusé le paquet avec `EALLOWREMOTE`.

La récupération a comporté quatre parties :

1. Une personne a corrigé la cause (commit `ddfd6fe` : Prettier ajouté à `package.json` et au fichier de verrouillage, et un script `format:check`).
2. La décision a été consignée dans `decisions.md`.
3. T-011 a été remise à `pending` avec `retries` à 0, pour repartir avec un nouveau budget.
4. L'exécution a été reprise en nommant l'identifiant d'exécution.

```powershell
copilot -p "Use the ait-sdlc-orchestrate skill. Resume run <run-id>. I fixed the cause of the T-011 failure. Record that decision in decisions.md, reset T-011 to pending with retries 0 and re-run only T-011. Do not push, do not deploy." --allow-all-tools --no-ask-user
```

!!! warning "N'affaiblissez pas une passerelle pour débloquer une tâche"
    Quand T-013 (sécurité) est restée bloquée à cause d'un avis visant uniquement le développement, l'agent a refusé le « correctif » qui aurait rétrogradé Vite et Vitest. Une **personne** a consigné une dérogation dans `decisions.md`, avec un déclencheur de réexamen. Seules les personnes accordent des dérogations.

### Étape 4 : Associer l'échec à un modèle de récupération

| Ce qui s'est passé | Ce que fait l'exécution | Ce que vous faites |
|--------------------|-------------------------|--------------------|
| Une tâche est `blocked` après 2 reprises (Pinch T-011, T-013) | L'exécution s'arrête | Corrigez la cause ou consignez une décision humaine, remettez la tâche à `pending` avec `retries` à 0, reprenez par identifiant d'exécution |
| Le terminal s'est fermé ou vous avez appuyé sur `Ctrl+C` | Une tâche restée `in_progress` compte comme non terminée | `copilot --resume=<session-id>`, ou reprise par identifiant d'exécution |
| Une passerelle ne peut pas s'exécuter (atelier 2 : le Playwright MCP manquait) | La tâche est `blocked`, pas ignorée | Fournissez l'outil à la passerelle, ou laissez l'agent en utiliser un existant, puis reprenez |
| Un flux de travail est annulé pendant un incident de la plateforme (Focus Garden) | Rien n'a été déployé | Relancez le flux de travail quand la plateforme est rétablie |
| L'arbre fusionné diffère de l'arbre approuvé | Le déploiement doit s'arrêter | Retournez à l'approbation |
| Vous voulez déployer plus vite | Interdit | Ne contournez jamais le flux de travail contrôlé, ne forcez jamais le push d'une branche `gh-pages` |

### Étape 5 : Conserver l'instantané de l'exécution dans le dépôt

`.copilot-tracking/` est ignoré par Git : les preuves de l'exécution restent donc sur votre poste, sauf si vous les copiez. Copiez les cinq fichiers sous `docs/run/<run-id>/` et validez-les.

```powershell
Set-Location -LiteralPath "$HOME\src\ai-sdlc-practice"   # votre propre dépôt
$RunId = '<run-id>'
$dest = "docs\run\$RunId"
New-Item -ItemType Directory -Force $dest | Out-Null
foreach ($f in 'state.json','plan.md','tasks.md','changes.md','decisions.md') { Copy-Item ".copilot-tracking\$RunId\$f" $dest }
git add docs/run
git commit -m "docs: record completed run"
```

<figure class="screenshot-frame" markdown>
![Le dossier docs/run/2026-10-05-pinch sur GitHub qui liste changes.md, decisions.md, plan.md, state.json et tasks.md, tous issus du commit docs: record completed Pinch run](../../assets/img/lab-08/08-01-run-record.png)
<figcaption>Le registre de l'exécution dans le dépôt de référence. Vérifiez que les cinq fichiers sont là : ils racontent toute l'exécution, de la première tâche jusqu'au déploiement.</figcaption>
</figure>

!!! success "Résultat attendu"
    `git show --stat HEAD` liste les cinq fichiers sous `docs/run/<run-id>/`.

### Étape 6 : Additionner le coût de toute la construction

Ce sont les chiffres réels de l'exécution Pinch enregistrée.

| Phase | Exécution | Crédits | Durée |
|-------|-----------|--------:|-------|
| Atelier 2 : conception et prototype | `lab-02-design-prototype` | 284,39 | environ 15 à 25 min (les 11 h 12 min affichées sont un artefact du minuteur) |
| Atelier 3 : exigences et architecture | `lab-03-requirements-architecture` | 88,03 | environ 3,5 min |
| Atelier 4 : construction, tranches 1 | `lab-04a-build-slices-1` | 394,17 | 28 min 39 s |
| Atelier 4 : construction, tranches 2 | `lab-04b-build-slices-2` | 368,57 | 19 min 23 s |
| Atelier 5 : QA, revue critique, sécurité | `lab-05-qa-critic-security` | 79,25 | non consignée |
| Atelier 5 : reprise | `lab-05b-qa-critic-security-retry` | 396,72 | 32 min 54 s |
| Ateliers 6 et 7 : approbation et déploiement | `lab-06-07-signoff-deploy` | 117,52 | 8 min 52 s |
| **Total** | | **1 728,65** | |

L'initialisation et l'énoncé sont petits et ne sont pas détaillés. Focus Garden, qui a eu une boucle de modifications demandées et aucune exécution bornée, a coûté environ 3 300 crédits (2 097 + 392 + 747 + 92).

!!! tip "Ce qui réduit la facture"
    Bornez chaque exécution à une phase, arrêtez-vous aux passerelles, gardez une portée petite (3 ou 4 fonctionnalités) et corrigez une tâche bloquée avant de reprendre.

### Étape 7 : Désactiver Pages et nettoyer les branches

Uniquement pour votre propre dépôt. Cela met votre site en ligne hors service.

```powershell
$Repo = '<owner>/<repo>'
gh api --method DELETE "repos/$Repo/pages"
git switch main
git pull
git branch -d feature/pinch
git push origin --delete feature/pinch
```

`git branch -d` refuse de supprimer une branche qui n'est pas fusionnée, ce qui est la protection recherchée : ne supprimez que les branches fusionnées. Gardez vos étiquettes : ce sont vos points de contrôle.

### Étape 8 : Supprimer le dépôt d'entraînement et les fichiers locaux

Faites-le seulement quand vous en avez fini avec le dépôt d'entraînement. Sauvegardez d'abord ce que vous voulez garder.

```powershell
gh repo view $Repo --json nameWithOwner,url
Copy-Item "$HOME\src\ai-sdlc-practice\.copilot-tracking" "$HOME\evidence-backup" -Recurse   # facultatif
gh repo delete $Repo --yes
Set-Location -LiteralPath $HOME
Remove-Item -LiteralPath "$HOME\src\ai-sdlc-practice" -Recurse -Force
copilot plugin uninstall ai-team-sdlc
```

!!! warning "Vérifiez le nom avant de supprimer"
    `gh repo delete --yes` ne demande aucune confirmation. Lisez d'abord le résultat de `gh repo view` : ce doit être votre propre dépôt d'entraînement. Si `gh repo delete` signale une portée manquante, exécutez `gh auth refresh -h github.com -s delete_repo`, puis réessayez.

Vous pouvez aussi retirer l'entrée du marché si vous n'en avez plus besoin (voir `copilot plugin marketplace --help`). Gardez `.copilot-tracking` si vous voulez conserver les preuves.

## Liste de vérification finale

* [ ] Je sais lire `state.json` et expliquer `status`, `retries` et `signoff`.
* [ ] Je connais deux façons de reprendre une exécution, et je sais que les tâches `done` ne sont jamais refaites.
* [ ] Je sais remettre à zéro une tâche bloquée et ne relancer que celle-ci.
* [ ] Le registre de l'exécution est validé sous `docs/run/<run-id>/`.
* [ ] Je connais le coût de ma propre construction et trois façons de le réduire.
* [ ] Pages est désactivé et les branches fusionnées sont supprimées dans mon dépôt d'entraînement, ou je l'ai supprimé.
* [ ] Je n'ai jamais exécuté une commande de nettoyage contre un dépôt de référence.

## Point de contrôle

!!! checkpoint "Vérifiez votre travail"
    Les étiquettes `lab-08-start` et `lab-08-end` pointent vers le même commit, `e505217` : cet atelier ne change aucun code. L'instantané de l'exécution est validé sous `docs/run/2026-10-05-pinch/`, et le nettoyage concerne votre propre dépôt d'entraînement.

<figure class="screenshot-frame" markdown>
![La page Tags du dépôt de référence sur GitHub, qui liste lab-08-start, lab-08-end, lab-07-start, lab-07-end, lab-06-start et lab-06-end avec leurs identifiants de commit](../../assets/img/lab-08/08-02-tags.png)
<figcaption>Les étiquettes des points de contrôle. Remarquez que lab-08-start et lab-08-end pointent tous deux vers e505217, et que lab-07-end pointe vers le même commit.</figcaption>
</figure>

## Apportez votre propre idée

* Nommez chaque exécution (`lab-NN-...`), bornez-la à une phase, et ajoutez `--share` et `--log-dir` pour pouvoir comparer le coût par exécution.
* Tenez votre propre tableau comme celui de l'étape 6. Après votre deuxième exécution, vous verrez quelle phase coûte le plus.
* Conservez l'instantané de l'exécution à chaque commit de point de contrôle, pas seulement à la fin.
* Commencez avec 3 ou 4 fonctionnalités. Une portée plus grande multiplie les tranches, les passerelles et les reprises.
* Notez la cause et la décision chaque fois que vous débloquez une tâche.

## Ce qui a mal tourné dans les exécutions enregistrées

* **Les tâches Pinch T-011 et T-013 ont été bloquées.** T-011 (QA) a échoué parce que la politique du registre a refusé un paquet. T-013 (sécurité) a échoué sur un avis visant seulement le développement et sans version corrigée. Les deux se sont arrêtées après deux tentatives, comme prévu.
* **La tâche Pinch T-012 (revue critique) a échoué une fois** avec deux constats bloquants. Deux commits de correction ont suivi et la nouvelle revue a réussi (T-012 indique `retries` à 1 dans l'état final).
* **Un test s'est figé une fois au démarrage à froid** (expiration d'un `beforeEach`). La reprise sans modification a réussi en 7,4 s.
* **Le sous-agent scribe n'a pas pu fusionner les fichiers de la boîte de réception**, car il n'a pas d'outil de lecture ; l'orchestrateur l'a fait. C'est une limite connue du plugin.
* **Focus Garden a été interrompu par un incident de la plateforme.** Sa première exécution de livraison a été annulée avant qu'une étape s'exécute, et un nouveau lancement a réglé le problème.

## Dépannage

### L'orchestrateur démarre une nouvelle exécution au lieu de reprendre

Il ne reprend que si vous donnez un identifiant d'exécution existant. Nommez-le dans l'invite : `Resume run <run-id>`. Le nom du dossier sous `.copilot-tracking` est l'identifiant d'exécution.

### J'ai perdu l'identifiant de session

Utilisez la deuxième façon : démarrez une nouvelle session et reprenez par identifiant d'exécution. L'état se trouve dans `.copilot-tracking/<run-id>/state.json`, pas dans la conversation.

### Le dossier de suivi est absent après un nouveau clonage

`.copilot-tracking/` est ignoré par Git et n'existe que sur le poste où l'exécution a eu lieu. L'instantané `docs/run/<run-id>/` est le registre validé de l'exécution.

### `gh repo delete` ou l'appel Pages échoue

Pour `gh repo delete`, ajoutez la portée avec `gh auth refresh -h github.com -s delete_repo`. Pour l'appel Pages, vérifiez que Pages est activé et que vous avez les droits d'administration sur le dépôt. Vérifiez `$Repo` avec `gh repo view $Repo`.

Plus d'aide : [Dépannage](../troubleshooting.md).

## Vérification des connaissances

??? question "Quel fichier l'emporte quand `plan.md` et `state.json` ne concordent pas ?"
    `state.json`. `plan.md` et `tasks.md` sont des projections que l'orchestrateur régénère à partir de lui.

??? question "Une tâche est `blocked`. Quelles sont les deux façons d'avancer ?"
    Corriger la cause et remettre la tâche à `pending` avec `retries` à 0, ou faire consigner une dérogation par une personne dans `decisions.md`. Un agent n'accorde jamais seul une dérogation à une passerelle.

??? question "Pourquoi `git branch -d` convient-il au nettoyage ?"
    Il refuse de supprimer une branche qui n'est pas fusionnée : vous ne supprimez donc que du travail déjà présent dans `main`.

## Résumé

Vous savez lire l'état d'une exécution, la reprendre de deux façons, récupérer une tâche bloquée sans affaiblir une passerelle, conserver les preuves dans `docs/run/`, lire le coût d'une construction complète (environ 1 730 crédits pour Pinch) et supprimer vos ressources d'entraînement en toute sécurité. Vous avez maintenant parcouru tout le cycle de vie, de l'idée à une application déployée et approuvée.

## Prochaines étapes

Vous avez terminé les ateliers. Pour aller plus loin :

* Refaites le cycle de vie avec votre propre idée, avec une petite portée.
* Lisez les [preuves de Focus Garden](https://github.com/devopsabcs-engineering/ai-team-sdlc-sample-focus-garden/wiki/Evidence-focus-garden) (en anglais) pour une exécution avec boucle de modifications demandées.
* Explorez le [dépôt du plugin](https://github.com/devopsabcs-engineering/ai-team-sdlc) et contribuez.
* Revenez au [plan des ateliers](index.md), au [glossaire](../glossary.md) ou au [dépannage](../troubleshooting.md).
