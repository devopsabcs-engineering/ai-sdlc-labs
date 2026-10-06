---
title: "Atelier 7 : Déploiement en production"
description: Lancez la phase de déploiement après l'approbation humaine, publiez l'application sur GitHub Pages et vérifiez les passerelles pre-deploy, smoke et rollback-ready.
---

# Atelier 7 : Déploiement en production

<span class="chip phase-deploy"><span aria-hidden="true">🚀</span> Déploiement</span> <span class="chip phase-idea">30 min</span> <span class="chip phase-build">Intermédiaire</span>

## Présentation

<div class="lab-meta" markdown>

| Élément | Détails |
|---------|---------|
| **Durée** | 30 minutes |
| **Niveau** | Intermédiaire |
| **Prérequis** | [Atelier 6 : Approbation humaine et modifications demandées](lab-06-signoff-changes-requested.md) |
| **Point de contrôle** | Étiquette `lab-07-end` dans le dépôt de référence : l'artefact approuvé est en ligne et le plan de retour arrière est rédigé. |
| **Atelier suivant** | [Atelier 8 : Reprise, récupération et nettoyage](lab-08-resume-recover-teardown.md) |

</div>

La phase de déploiement livre une seule chose : l'arbre exact que trois personnes ont approuvé. Vous le poussez, vous le fusionnez sans écrasement (squash), vous prouvez que `main` contient le même arbre, vous le publiez par un flux de travail contrôlé et vous vérifiez le site en ligne.

## Objectifs d'apprentissage

À la fin de cet atelier, vous serez en mesure de :

* Lancer la compétence `ait-deploy` uniquement après l'approbation, et vous arrêter si le code diffère de l'artefact approuvé.
* Pousser, ouvrir une demande de tirage (pull request) et fusionner **sans squash**, puis prouver que `main` contient l'arbre approuvé.
* Activer GitHub Pages avec un flux de travail GitHub Actions et le démarrer avec `governance_approved=true`.
* Expliquer et vérifier les passerelles `pre-deploy`, `smoke` et `rollback-ready`.
* Décrire comment revenir à la version précédente.

## Coûts et crédits { #cost-and-credits }

!!! cost "Une exécution de déploiement est courte et peu coûteuse"
    Dans l'exécution Pinch enregistrée, la consignation de l'approbation et le déploiement ont pris ensemble environ 8 minutes 52 secondes et 117,52 crédits d'IA. Le flux de travail GitHub Pages lui-même a duré environ 2 minutes. Consultez l'[atelier 0](lab-00-setup.md#cost-and-credits) pour le coût d'une exécution complète.

## Étapes

!!! warning "Utilisez votre propre dépôt"
    Toutes les commandes ci-dessous utilisent les paramètres fictifs `<owner>` et `<repo>`. Remplacez-les par **votre propre** dépôt d'entraînement. N'exécutez jamais ces commandes contre les dépôts de référence (`ai-sdlc-labs-pinch`, `ai-team-sdlc`, l'exemple Focus Garden) : cet atelier consiste à déployer votre propre copie.

Définissez les variables une seule fois dans votre session PowerShell, depuis la racine du dépôt :

```powershell
$Repo  = '<owner>/<repo>'
$RunId = '<run-id>'      # le nom du dossier sous .copilot-tracking, par exemple 2026-10-05-pinch
```

### Étape 1 : Vérifier l'artefact approuvé

Le déploiement ne livre que l'artefact approuvé. Lisez le dossier d'approbation, puis comparez-le à ce que vous avez extrait.

```powershell
git switch feature/pinch
$commit  = git rev-parse HEAD
$tree    = git rev-parse 'HEAD^{tree}'
$signoff = (Get-Content ".copilot-tracking\$RunId\state.json" -Raw | ConvertFrom-Json).signoff
$signoff.status
$signoff.artifact
"HEAD commit: $commit"
"HEAD tree:   $tree"
```

Arrêtez-vous ici si `signoff.status` n'est pas `approved`, ou si le commit ou l'arbre diffère de `signoff.artifact`. Toute modification après l'approbation remet l'approbation à `pending` et renvoie l'exécution en construction.

!!! success "Résultat attendu"
    `status` vaut `approved`, et le commit et l'arbre correspondent. Dans l'exécution Pinch enregistrée, l'artefact approuvé était le commit `5e56331` et l'arbre `9418e31b7ba315d15592ff1f12096d6f4bb76b31`.

!!! tip "Laisser l'agent exécuter la chaîne"
    Vous pouvez aussi demander toute la phase dans une seule invite bornée, depuis la racine du dépôt : `copilot -p "Use the ait-deploy skill. Run ONLY the deploy phase for run <run-id>. Stop if HEAD differs from the approved pin." --allow-all-tools --no-ask-user`. Les étapes ci-dessous sont ce que fait l'agent, ce qui vous permet de vérifier son travail.

### Étape 2 : Exécuter la passerelle d'audit pre-deploy

La passerelle `pre-deploy` revérifie les dépendances de production avant que quoi que ce soit quitte votre poste.

```powershell
npm ci
npm audit --omit=dev --audit-level=high
```

!!! success "Résultat attendu"
    Aucune vulnérabilité élevée ou critique dans les dépendances de production. Pinch ne livre aucune dépendance d'exécution : l'audit enregistré indique 0 vulnérabilité. C'est l'audit sur lequel repose la dérogation de l'atelier 6.

### Étape 3 : Pousser la branche

```powershell
git push -u origin feature/pinch
```

### Étape 4 : Ouvrir la demande de tirage

Indiquez le commit et l'arbre approuvés dans la description, afin qu'un réviseur voie ce qui est fusionné.

```powershell
gh pr create --repo $Repo --base main --head feature/pinch `
  --title "Ship <your app name>" `
  --body "Approved commit: $commit`nApproved tree: $tree`nApproval recorded in run $RunId."
```

<figure class="screenshot-frame" markdown>
![Demande de tirage 1 sur GitHub, Ship Pinch bilingual offline recipe app, fusionnée de feature/pinch vers main, avec une section Governance qui liste le commit et l'arbre approuvés](../../assets/img/lab-07/07-01-pull-request.png)
<figcaption>La demande de tirage fusionnée dans le dépôt de référence. Lisez la section Governance : elle nomme le commit approuvé, l'arbre approuvé, l'approbation consignée et la dérogation.</figcaption>
</figure>

### Étape 5 : Attendre les vérifications, puis fusionner sans squash

```powershell
gh pr checks 1 --repo $Repo --watch
gh pr merge 1 --repo $Repo --merge
```

Remplacez `1` par le numéro de votre propre demande de tirage. Dans l'exécution de référence, les vérifications de la demande étaient CodeQL et les tests multiplateformes.

!!! warning "Ni squash ni rebase ici"
    `--merge` conserve le commit approuvé dans l'historique de `main`. Un squash ou un rebase crée de nouveaux commits, et vous ne pouvez plus démontrer que le code fusionné est le code approuvé.

### Étape 6 : Prouver que l'arbre est l'arbre approuvé

Un commit de fusion a un nouvel identifiant : comparez donc l'**arbre**, qui est l'identifiant du contenu.

```powershell
git fetch origin
$mainTree = git rev-parse 'origin/main^{tree}'
if ($mainTree -eq $tree) { 'Tree equality: OK' } else { throw "main tree $mainTree differs from approved tree $tree" }
```

!!! success "Résultat attendu"
    La commande affiche `Tree equality: OK`. Dans l'exécution de référence, le commit de fusion était `50d2714` et son arbre était l'arbre approuvé `9418e31...`.

### Étape 7 : Activer GitHub Pages avec un flux de travail

```powershell
gh api --method POST "repos/$Repo/pages" -f build_type=workflow
```

!!! tip "Pages est déjà activé ?"
    Si l'appel échoue parce que Pages existe déjà, ouvrez **Settings > Pages** dans votre dépôt et réglez **Source** sur **GitHub Actions**. Tant que le premier déploiement n'est pas terminé, l'adresse du site affiche une page 404 : c'est normal.

### Étape 8 : Lancer le flux de travail contrôlé

Le flux de travail `.github/workflows/pages.yml` ne s'exécute que si une personne met l'entrée à vrai :

```yaml
on:
  workflow_dispatch:
    inputs:
      governance_approved:
        description: Confirm Product Owner, Security Team, and Tech Lead approval
        required: true
        default: false
        type: boolean
```

Il compte trois tâches : `quality` (build, lint, format, tests unitaires, `i18n-parity`, `portable-os`, Playwright, Lighthouse), `build-pages-artifact` (un artefact immuable construit avec `--base=/ai-sdlc-labs-pinch/`) et `deploy-pages`. Lancez-le depuis `main` :

```powershell
gh workflow run .github/workflows/pages.yml --repo $Repo --ref main -f governance_approved=true
$id = gh run list --repo $Repo --workflow pages.yml --limit 1 --json databaseId --jq '.[0].databaseId'
gh run watch $id --repo $Repo
```

<figure class="screenshot-frame" markdown>
![Le fichier pages.yml dans la vue de code de GitHub, avec le déclencheur workflow_dispatch et l'entrée booléenne governance_approved](../../assets/img/lab-07/07-02-pages-workflow.png)
<figcaption>Le fichier du flux de travail contrôlé sur GitHub. Regardez l'entrée `governance_approved` : sa valeur par défaut est false, personne ne déploie donc par accident.</figcaption>
</figure>

<figure class="screenshot-frame" markdown>
![L'exécution réussie de Deploy GitHub Pages avec trois tâches vertes : Quality checks, Build immutable Pages artifact et Deploy Pages, durée totale de 2 minutes 6 secondes](../../assets/img/lab-07/07-03-actions-run.png)
<figcaption>L'exécution réussie. Vérifiez les trois tâches dans l'ordre et la durée totale d'environ 2 minutes. L'identifiant de l'exécution de référence est 37465190164.</figcaption>
</figure>

!!! success "Résultat attendu"
    L'exécution se termine par `success` et la tâche `Deploy Pages` affiche l'adresse du site, `https://<owner>.github.io/<repo>/`.

### Étape 9 : Exécuter la passerelle smoke sur le site en ligne

La passerelle `smoke` teste l'adresse en ligne, pas le dossier de build. L'exécution enregistrée a utilisé un navigateur sans interface et a vérifié :

| Vérification | Pourquoi c'est important |
|--------------|--------------------------|
| HTTP 200 sur la page d'accueil | Le site existe. |
| `start_url` et `scope` du manifeste sous le chemin du dépôt | L'application s'installe depuis le bon chemin. |
| La portée du service worker correspond à l'adresse en ligne | Le mode hors ligne couvre toute l'application. |
| Toutes les ressources utilisent le préfixe du dépôt | Aucun fichier n'est demandé à la racine du domaine. |
| 0 requête vers d'autres origines | Rien ne quitte le site. |
| 0 erreur de console et 0 erreur de page | L'application démarre proprement. |
| Le rechargement hors ligne réussit | La promesse de la PWA tient. |

Faites la première vérification à la main, puis ouvrez la page et rechargez-la avec les outils de développement en mode hors ligne :

```powershell
(Invoke-WebRequest "https://<owner>.github.io/<repo>/" -Method Head -UseBasicParsing).StatusCode
```

<figure class="screenshot-frame" markdown>
![L'application Pinch en ligne montrant la recette Crêpes de tous les jours pour 4 portions avec des quantités métriques, un panneau de liste de courses et le livre de recettes](../../assets/img/lab-04/04-01-recipe.fr.png)
<figcaption>L'application Pinch en ligne après le déploiement. Vous devez voir la recette, le contrôle des portions, le bouton Métrique et Impérial et la liste de courses.</figcaption>
</figure>

!!! success "Résultat attendu"
    Le code d'état est `200`, l'application se charge et la page s'affiche encore après un rechargement hors ligne.

### Étape 10 : Rendre la livraison prête pour le retour arrière

La passerelle `rollback-ready` ne réussit que si le plan de retour arrière est écrit avant que vous en ayez besoin. Dans le dépôt de référence, il s'agit de `docs/deployment.md`.

<figure class="screenshot-frame" markdown>
![La page docs/deployment.md sur GitHub avec une liste Deploy de six étapes et le début d'une section Rollback](../../assets/img/lab-07/07-04-deployment-doc.png)
<figcaption>La page de déploiement et de retour arrière. Comparez les six étapes de Deploy avec ce que vous venez de faire, puis lisez la section Rollback.</figcaption>
</figure>

Le plan enregistré, en bref : revenir en arrière lorsque le site est indisponible, qu'un parcours essentiel est cassé, que le démarrage hors ligne régresse, qu'une requête tierce inattendue apparaît ou que des erreurs du navigateur ne peuvent pas être corrigées sur-le-champ. Ensuite :

1. Créer une branche de retour arrière à partir de `main`.
2. Restaurer le contenu du dernier commit antérieur à la livraison connu comme bon (pour Pinch : `2aa70d7db33767f50322d82495818de9ba83c24a`).
3. La fusionner par une demande de tirage révisée.
4. Lancer `pages.yml` avec `governance_approved=true`.
5. Répéter toutes les vérifications smoke.

Chaque déploiement Pages est un artefact immuable lié à une exécution de flux de travail. Ne revenez jamais en arrière avec une branche `gh-pages` ou un téléversement manuel.

### Étape 11 : Consigner la livraison

Ajoutez l'adresse en ligne à `README.md` et conservez l'instantané de l'exécution sous `docs/run/<run-id>/` (l'atelier 8 explique l'instantané). Dans le dépôt de référence, c'est le commit `e505217`, qui porte aussi l'étiquette `lab-07-end`.

## Point de contrôle

!!! checkpoint "Vérifiez votre travail"
    * [ ] `signoff.status` vaut `approved` et HEAD correspondait au commit et à l'arbre approuvés avant le push.
    * [ ] La demande de tirage a été fusionnée avec un commit de fusion (sans squash).
    * [ ] `Tree equality: OK` s'est affiché après la fusion.
    * [ ] Pages utilise le type de build par flux de travail, et l'exécution de `pages.yml` s'est terminée par `success`.
    * [ ] L'adresse en ligne a répondu `200` et fonctionne après un rechargement hors ligne.
    * [ ] Un plan de retour arrière est validé.

    Comparez avec le dépôt de référence à l'étiquette `lab-07-end` (commit `e505217`).

## Apportez votre propre idée

* **Chemin de base.** Sur GitHub Pages, l'application vit sous `/<repo>/`. La valeur Vite `--base` dans `pages.yml` doit être le nom de votre dépôt, tout comme `start_url` et `scope` du manifeste. Remplacez `--base=/ai-sdlc-labs-pinch/` dans le flux de travail, et dans votre énoncé s'il nomme le chemin.
* **Gardez l'entrée contrôlée.** Conservez `governance_approved` et la condition `if:` sur chaque tâche. N'ajoutez pas un second chemin de déploiement.
* **Passerelles du projet.** Tirez vos vérifications smoke de votre propre application : sa page de départ, sa promesse hors ligne, ses règles sur les tiers.
* **Écrivez d'abord le plan de retour arrière.** Notez le dernier commit connu comme bon avant de fusionner.
* **Visibilité.** Vérifiez que votre offre GitHub permet Pages pour la visibilité de votre dépôt.

## Ce qui a mal tourné dans les exécutions enregistrées

* **Pinch a été déployé dès le premier lancement** (exécution 37465190164, réussie, environ 2 minutes). L'artefact approuvé, l'égalité des arbres et la liste smoke ont tous été vérifiés autour du push.
* **Focus Garden a connu deux livraisons en échec pour des raisons extérieures.** La première exécution a été annulée avant qu'une étape s'exécute, pendant un incident de GitHub Actions, et relancée après le rétablissement. La deuxième s'est exécutée et a échoué à la passerelle de performance : `tests/lighthouse-audit.mjs` avait un chemin Chrome de Windows codé en dur, de sorte que sur l'exécuteur Ubuntu elle a planté avec `spawn ... chrome.exe ENOENT`. Toutes les passerelles locales avaient réussi sur un poste Windows.
* **Le correctif était une modification après l'approbation.** C'était un changement de deux lignes dans un test, dans sa propre demande de tirage : `main` n'était donc plus identique octet pour octet au commit approuvé `5d3c73f`. Le wiki le consigne et note qu'une équipe plus stricte demanderait une nouvelle approbation. Dans votre exécution, toute modification après l'approbation remet l'approbation à zéro.
* **La leçon est dans l'énoncé de Pinch :** aucun chemin propre à un système d'exploitation codé en dur, utiliser le Chromium de Playwright, et lancer tôt le flux de travail de déploiement.

Lisez toute l'histoire dans la [page de preuves de Focus Garden](https://github.com/devopsabcs-engineering/ai-team-sdlc-sample-focus-garden/wiki/Evidence-focus-garden) (en anglais).

## Dépannage

### Le site affiche une page 404 juste après la fusion

Pages ne sert rien tant que la première exécution du flux de travail ne se termine pas par `success`. Vérifiez avec `gh run list --repo $Repo --workflow pages.yml --limit 1`, attendez la fin de l'exécution, puis rechargez.

### La page s'affiche vide ou des fichiers renvoient 404

Le chemin de base ne correspond pas au nom du dépôt. Ouvrez les outils de développement et regardez les adresses en échec : si elles commencent par `/assets/...` au lieu de `/<repo>/assets/...`, reconstruisez avec `--base=/<repo>/` et relancez.

### Le flux de travail a été annulé, ou toutes les tâches ont été ignorées

Une exécution annulée sans aucune étape exécutée vient généralement d'un incident de la plateforme : relancez lorsque GitHub indique que Actions est rétabli. Si toutes les tâches apparaissent comme ignorées, `governance_approved` était false : passez `-f governance_approved=true`.

### La vérification de l'arbre échoue

Vous avez fusionné avec squash ou rebase, ou `main` a changé après le commit approuvé. Ne déployez pas. Trouvez la différence avec `git diff $tree origin/main` et retournez à l'approbation.

Plus d'aide : [Dépannage](../troubleshooting.md).

## Vérification des connaissances

??? question "Pourquoi comparer les arbres et non les commits ?"
    Un commit de fusion a toujours un nouvel identifiant : les identifiants de commit diffèrent donc. L'identifiant de l'arbre désigne le contenu : des arbres égaux prouvent que `main` contient exactement les fichiers approuvés.

??? question "Pourquoi le flux de travail demande-t-il `governance_approved` ?"
    Il fait de l'approbation humaine une entrée explicite de la livraison. La valeur par défaut est false : un lancement sans cette valeur ne déploie rien.

??? question "Quand la passerelle `rollback-ready` réussit-elle ?"
    Quand le plan de retour arrière est écrit et validé avant la livraison, pour que vous puissiez l'utiliser dans un mauvais moment sans improviser.

## Résumé

Vous avez vérifié l'artefact approuvé, poussé, fusionné sans squash, prouvé l'égalité des arbres, activé Pages, exécuté le flux de travail contrôlé, vérifié le site en ligne avec la liste smoke et rédigé le plan de retour arrière. Le code déployé est le code que des personnes ont approuvé.

## Prochaines étapes

Poursuivez avec l'[atelier 8 : Reprise, récupération et nettoyage](lab-08-resume-recover-teardown.md).
