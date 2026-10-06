---
title: "Atelier 2 : Conception et prototype"
description: Utilisez les compétences de conception et de prototype pour obtenir des parcours UX et un prototype cliquable, testez-le dans un vrai navigateur et franchissez les revues de conception et de prototype.
---

# Atelier 2 : Conception et prototype

<span class="chip phase-plan"><span aria-hidden="true">🧭</span> Planification</span> <span class="chip phase-idea">35 min</span> <span class="chip phase-plan">Débutant</span>

## Présentation

<div class="lab-meta" markdown>

| Élément | Détails |
|---------|---------|
| **Durée** | 35 minutes |
| **Niveau** | Débutant |
| **Prérequis** | [Atelier 1 : De l'idée à l'énoncé](lab-01-idea-to-brief.md) |
| **Point de contrôle** | Étiquette `lab-02-end` dans le dépôt de référence : les documents de conception et un prototype vérifié sont validés. |
| **Atelier suivant** | [Atelier 3 : Exigences et architecture](lab-03-requirements-architecture.md) |

</div>

C'est le premier atelier où des agents travaillent. Vous lancez **une seule phase bornée** : le concepteur de produit transforme l'énoncé en parcours, en maquettes filaires et en jetons de conception, puis un prototype est construit et vérifié dans un vrai navigateur. Le prototype sera jeté plus tard : le code de production est construit à l'atelier 4. Son rôle est de révéler les problèmes d'expérience utilisateur tant qu'ils coûtent peu.

## Objectifs d'apprentissage

À la fin de cet atelier, vous serez en mesure de :

* Exécuter la compétence `ait-product-design` et lire ses parcours, ses flux et ses jetons de conception.
* Exécuter la compétence `ait-product-prototype` pour obtenir un prototype cliquable.
* Vérifier le prototype dans un vrai navigateur avec Playwright grâce à `ait-prototype-testing`.
* Franchir les passerelles `design-review` et `prototype-review`, et expliquer ce que chacune vérifie.

## Coûts et crédits

!!! cost "Environ 284 crédits pour cet atelier dans l'exécution enregistrée"
    L'exécution enregistrée de l'atelier 2 a consommé 284,39 crédits. La tâche de conception a duré environ 3 minutes. La durée affichée à la fin (11 h 12 min) est un artefact du minuteur : le temps réel était d'environ 15 à 25 minutes. Consultez [Coûts et crédits](lab-00-setup.md#cost-and-credits), à l'atelier 0, pour les conseils généraux.

    Pour réduire le coût : demandez un prototype en HTML statique seulement, un seul exemple et une phase bornée, comme le fait l'invite ci-dessous.

## Étapes

### Étape 1 : Partir d'une racine de dépôt propre

Lancez toujours `copilot` à la racine du dépôt. Assurez-vous que l'énoncé est validé et gardez les transcriptions des exécutions hors de Git. Le dépôt de référence fait de même : son commit `lab-01-end` est `22d3f4e` (« chore: ignore console transcripts »).

```powershell
Set-Location -LiteralPath "$HOME\src\ai-sdlc-practice"
Add-Content .gitignore "evidence/logs/"
git status --short
```

!!! success "Résultat attendu"
    `git status --short` affiche au plus la modification de `.gitignore`. `specs/idea.md` est déjà validé.

### Étape 2 : Lancer la phase de conception et de prototype

L'exécution enregistrée a demandé à l'orchestrateur la première partie de la planification seulement : la conception, puis le prototype avec test dans un navigateur. L'invite ci-dessous reprend cette exécution :

```powershell
New-Item -ItemType Directory -Force evidence\logs | Out-Null
copilot -p "Use the ait-sdlc-orchestrate skill. Specs: ./specs/idea.md. Run ONLY the first part of the Plan phase: ait-product-design, then ait-product-prototype with ait-prototype-testing. Build a static HTML prototype only (no web-artifacts-builder), with EN and FR strings and light and dark themes. Commit with Conventional Commits and stop. Do not push, do not deploy." --allow-all-tools --allow-all-paths --allow-all-urls --no-ask-user --share evidence\lab-02-design-prototype.md --log-dir evidence\logs
```

**Variante interactive.** Lancez `copilot` à la racine du dépôt, puis collez le même texte d'invite. Vous pouvez répondre aux questions et arrêter l'exécution avec `Ctrl+C`. Dans VS Code, utilisez plutôt les invites `/product-design` et `/product-prototype`.

!!! warning "Ces options suppriment les questions de sécurité"
    `--allow-all-tools --allow-all-paths --allow-all-urls --no-ask-user` permettent à l'agent d'exécuter des commandes et d'écrire des fichiers sans rien demander. Ne les utilisez que dans votre dépôt d'entraînement, comme à l'atelier 0.

!!! success "Résultat attendu"
    L'exécution se termine par un résumé et un identifiant de session, et l'orchestrateur signale les tâches `T-001` et `T-002`. Le dossier de suivi `.copilot-tracking/<run-id>/` contient maintenant `state.json`, `plan.md`, `tasks.md`, `decisions.md` et `changes.md`.

### Étape 3 : Lire la conception

La tâche `T-001`, « Design the Pinch experience », appartient à `ait-product-designer` et doit franchir la passerelle `design-review`. Son résultat est `docs/design/pinch-experience.md` (342 lignes dans l'exécution enregistrée, validé dans `8fa6d89`, « docs(design): define Pinch prototype experience »). Il contient des parcours en français et en anglais, des maquettes filaires adaptatives, les états d'interaction, les exigences d'accessibilité et des jetons pour les thèmes clair et sombre.

```powershell
Get-Content docs\design\pinch-experience.md | Select-Object -First 30
Select-String -Path docs\design\pinch-experience.md -Pattern '^## ' | ForEach-Object { $_.Line }
```

<figure class="screenshot-frame" markdown>
![Aperçu GitHub de docs/design/pinch-experience.md avec la section Experience target : les personnes, la tâche à accomplir et les signaux de réussite pour le test du prototype](../../assets/img/lab-02/02-01-design-doc.png)
<figcaption>La première section du document de conception. Regardez les signaux de réussite : chacun est une vérification que le test du prototype pourra réussir ou échouer.</figcaption>
</figure>

Lisez ces décisions dans le document, car elles limitent le prototype :

* Une seule recette d'exemple bilingue, **Crêpes / Crepes**, avec quatre ingrédients et trois étapes.
* Un mode cuisine en trois étapes.
* Le verrouillage de l'écran (wake lock), le balayage et l'animation sont des améliorations progressives, pas des obligations.

Les signaux de réussite montrent comment une conception devient vérifiable :

```markdown
- A first-time user can change `4 servings` to `6` and recognize that every parsed amount changed.
- They can enter cook mode, advance a step, and leave without losing the current step or servings.
```

L'orientation visuelle s'appelle **Measured enamel** et comprend un contrat de jetons sémantiques, comme `--color-action: #165b4a` pour le thème clair et `#78d6b0` pour le thème sombre.

### Étape 4 : Ouvrir le prototype et ses preuves

La tâche `T-002`, « Build and verify the prototype », doit franchir la passerelle `prototype-review`. Elle a créé trois fichiers dans `prototype/` : `index.html`, `styles.css` et `app.js`, avec mise à l'échelle cliquable, conversion d'unités, liste de courses, mode cuisine, changement de thème et localisation. Elle a été validée dans `f1e66bb` (« feat(prototype): add bilingual Pinch flow »).

```powershell
Start-Process prototype\index.html
Get-ChildItem prototype, prototype\evidence | Select-Object Name, Length
```

Essayez le parcours à la main : faites passer les portions de 4 à 6, ajoutez les ingrédients à la liste et cochez-en un, démarrez le mode cuisine, passez à l'étape suivante, puis changez de langue (FR/EN) et de thème (clair/sombre).

<figure class="screenshot-frame" markdown>
![Vue GitHub du dossier prototype qui liste app.js, index.html, styles.css et un dossier evidence](../../assets/img/lab-02/02-02-prototype-evidence.png)
<figcaption>Le dossier du prototype : trois fichiers simples que vous ouvrez sans étape de construction, et un dossier evidence qui contient les captures d'écran du navigateur. Repérez le dossier evidence : c'est la preuve que la passerelle de revue exige.</figcaption>
</figure>

!!! success "Résultat attendu"
    La page s'ouvre hors ligne dans votre navigateur et les cinq interactions fonctionnent. `prototype\evidence` contient des captures d'écran ; dans l'exécution enregistrée, ce sont `desktop-cook-dark-fr.png` et `mobile-recipe-dark-fr.png`.

!!! tip "Un prototype est jetable"
    Ne le peaufinez pas et ne construisez pas dessus. L'atelier 4 construit la vraie application avec Vite et TypeScript à partir des exigences et de l'architecture de l'atelier 3.

### Étape 5 : Vérifier les deux passerelles

Comparez ce que chaque passerelle demande avec ce que vous avez vu :

| Passerelle | Ce qu'elle vérifie | Preuve dans l'exécution enregistrée |
|------------|--------------------|-------------------------------------|
| `design-review` | La conception est complète, prête pour les états, adaptative, accessible, réalisable et cohérente. | Les notes de revue à la fin de `docs/design/pinch-experience.md`. |
| `prototype-review` | Le prototype a été piloté dans un vrai navigateur : parcours, états d'interaction, erreurs de console, mise en page adaptative. | Un test Chromium sans interface à 1024x768 et à 360x800, avec mouvement réduit et aucune erreur de console. |

Vérifiez l'état de suivi et les validations :

```powershell
Get-Content .copilot-tracking\*\tasks.md
git log --oneline -n 5
```

!!! success "Résultat attendu"
    Les deux tâches sont `done`, avec leurs passerelles franchies. Votre liste de commits contient un commit `docs(design)` et un commit `feat(prototype)`. L'exécution de référence a produit `8fa6d89` et `f1e66bb`.

## Point de contrôle

!!! checkpoint "Étiquette lab-02-end"
    Dans le dépôt de référence, `lab-02-end` est le commit `f1e66bb`. Il suit `lab-01-end` (`22d3f4e`).

```powershell
git clone https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch "$HOME\src\ai-sdlc-labs-pinch"
Set-Location -LiteralPath "$HOME\src\ai-sdlc-labs-pinch"
git diff lab-01-end lab-02-end --stat
git checkout lab-02-end
Start-Process prototype\index.html
```

Le diff liste 6 fichiers et 1 242 insertions : le document de conception, les trois fichiers du prototype et les deux captures d'écran de preuve. Revenez à l'état le plus récent avec `git checkout main`.

## Apportez votre propre idée { #bring-your-own-idea }

Exécutez le même parcours avec votre propre énoncé :

* [ ] Votre `specs/idea.md` est validé et compte 3 ou 4 fonctionnalités.
* [ ] Votre invite dit « Run ONLY » pour la partie conception et prototype, et se termine par « Do not push, do not deploy ».
* [ ] Vous avez demandé un prototype en HTML statique seulement, sans `web-artifacts-builder`.
* [ ] Vous avez limité l'exemple à un seul élément avec quelques lignes de données, dans les deux langues si votre application est bilingue.
* [ ] Après l'exécution, vous vérifiez les deux passerelles et le fichier `.copilot-tracking/<run-id>/tasks.md` avant de continuer.

!!! tip "Portée économique"
    Ne prototypez que les deux ou trois interactions les plus risquées. La conception de Pinch valide volontairement une seule recette d'exemple et cinq interactions liées, pas toute la portée de la v1.

## Ce qui n'a pas fonctionné dans l'exécution enregistrée

La première tentative de `T-002` a été **bloquée** : le Playwright MCP n'était pas disponible, donc la passerelle de vérification dans le navigateur ne pouvait pas se fermer. L'orchestrateur n'a pas ignoré la passerelle. Il a trouvé `playwright-core` dans le cache sans rien installer, a écrit un test Chromium sans interface et l'a exécuté. Une assertion a échoué (l'annonce d'état pour un article coché) ; l'orchestrateur l'a corrigée, puis le test a réussi à 1024x768 et à 360x800, avec mouvement réduit et aucune erreur de console.

La leçon est la règle du contrat commun : une passerelle qui ne peut pas s'exécuter est **bloquée**, pas ignorée.

## Dépannage

### T-002 est bloquée parce que le test dans le navigateur ne peut pas s'exécuter

N'accordez pas de dérogation à la passerelle. Demandez à l'orchestrateur d'exécuter le test avec le Chromium sans interface de Playwright, comme dans l'exécution enregistrée. Si aucun navigateur n'est installé, `npx playwright install chromium` en télécharge un depuis le registre public. Reprenez ensuite l'exécution.

### L'exécution s'est arrêtée ou le terminal s'est fermé

L'état est sauvegardé dans `.copilot-tracking/<run-id>/state.json`. Reprenez avec `copilot --resume=<session-id>` (l'identifiant s'affiche à la fin de chaque exécution), ou relancez `copilot` et demandez à l'orchestrateur de reprendre l'identifiant d'exécution. Les tâches terminées ne sont pas refaites, et une tâche restée `in_progress` est relancée.

### Mon prototype ne ressemble pas aux captures d'écran

C'est normal. Les modèles varient, et l'orientation Measured enamel est le choix de cette exécution. Jugez votre résultat d'après les passerelles et les signaux de réussite de votre propre document de conception, pas d'après les pixels.

### L'exécution a consommé plus de crédits que prévu

Vérifiez que l'invite dit « Run ONLY » pour la première partie de la planification. Une invite qui demande tout le cycle de vie lance les phases suivantes. Arrêtez avec `Ctrl+C`, puis reprenez avec une invite bornée.

## Vérification des connaissances

??? question "Quelle est la différence entre `design-review` et `prototype-review` ?"
    `design-review` vérifie le document de conception : parcours complets, états, maquettes filaires adaptatives, accessibilité et cohérence. `prototype-review` vérifie le prototype en fonctionnement, piloté dans un vrai navigateur.

??? question "Une passerelle ne peut pas s'exécuter. L'agent peut-il la marquer comme ignorée ?"
    Non. Une passerelle obligatoire qui ne peut pas s'exécuter bloque la tâche. Seule une dérogation humaine consignée dans `decisions.md` peut changer cela.

??? question "Pourquoi ne pas garder le prototype comme première version de l'application ?"
    C'est une ébauche faite de fichiers simples pour tester l'expérience. La vraie application est construite par tranches à l'atelier 4, à partir des exigences et de l'architecture produites à l'atelier 3.

## Résumé

Vous avez lancé la phase de conception et de prototype en une seule exécution bornée, lu le document de conception, essayé le prototype cliquable et vérifié les deux passerelles. Vous avez vu que la passerelle du navigateur a d'abord été bloquée, et que l'agent l'a fermée avec un vrai test sans interface au lieu de l'ignorer.

## Prochaines étapes

Poursuivez avec l'[atelier 3 : Exigences et architecture](lab-03-requirements-architecture.md), où la conception devient un PRD, des décisions d'architecture et un carnet de tranches de construction.
