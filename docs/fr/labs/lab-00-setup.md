---
title: "Atelier 0 : Prérequis et installation"
description: Installez les outils, ajoutez le plugin ai-team-sdlc à Copilot CLI, créez un dépôt d'entraînement et initialisez-le avec ait-init, sous Windows avec PowerShell.
---

# Atelier 0 : Prérequis et installation

<span class="chip phase-prod"><span aria-hidden="true">🧰</span> Installation</span> <span class="chip phase-idea">20 min</span> <span class="chip phase-plan">Débutant</span>

## Présentation

<div class="lab-meta" markdown>

| Élément | Détails |
|---------|---------|
| **Durée** | 20 minutes |
| **Niveau** | Débutant |
| **Plateforme** | Windows 10 ou 11, PowerShell 7 (Windows PowerShell 5.1 fonctionne aussi), VS Code facultatif |
| **Prérequis** | Un compte GitHub avec un accès à GitHub Copilot qui inclut Copilot CLI. Un accès Internet à `github.com` et à `registry.npmjs.org`. |
| **Point de contrôle** | Un dépôt d'entraînement où `copilot plugin list` affiche `ai-team-sdlc` et où `ait-init` a été exécuté. Étiquette `lab-00-end` dans le dépôt de référence, une fois publiée. |
| **Atelier suivant** | [Atelier 1 : De l'idée à l'énoncé](lab-01-idea-to-brief.md) |

</div>

Vous installez et vérifiez la chaîne d'outils une seule fois. Tous les ateliers suivants supposent que celui-ci est terminé.

## Objectifs d'apprentissage

À la fin de cet atelier, vous serez en mesure de :

* Préparer une session PowerShell qui affiche correctement la sortie des agents (UTF-8).
* Installer et vérifier Node.js, Git, GitHub CLI et Copilot CLI avec `winget`.
* Ajouter le marché (marketplace) `ai-team-sdlc` et installer le plugin dans Copilot CLI.
* Créer un dépôt d'entraînement et l'initialiser avec la compétence (skill) `ait-init`.
* Expliquer la différence entre les invites `/product-*` (VS Code) et les compétences (CLI).
* Estimer le temps et le coût en crédits d'un cycle de vie avant d'en lancer un.

## Coûts et crédits { #cost-and-credits }

!!! cost "Une exécution complète est longue et consomme de vrais crédits"
    Dans l'exemple enregistré Focus Garden, une exécution jusqu'au dossier d'approbation a duré environ 166 minutes et consommé environ 2 097 crédits d'IA. Une exécution de reprise a duré 19 minutes et consommé environ 392 crédits. **Un cycle de vie complet peut consommer environ 2 000 crédits ou plus et durer de 2 à 3 heures.**

    Pour réduire le coût : suivez les exécutions enregistrées et passez directement aux **points de contrôle**, gardez votre application petite (3 ou 4 fonctionnalités) et lancez une seule phase bornée à la fois. Vous pouvez arrêter une exécution avec `Ctrl+C` et la reprendre plus tard à partir de son état sauvegardé.

## Étapes

### Étape 1 : Utiliser une console UTF-8

La sortie des agents contient des accents et des symboles. Une console Windows par défaut peut les afficher en caractères illisibles (`ΓÇö`). Activez l'UTF-8 dans chaque nouvelle session :

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding.WebName
```

!!! success "Résultat attendu"
    La dernière commande affiche `utf-8`.

!!! tip "Rendre le réglage permanent"
    Ajoutez les deux premières lignes à votre profil PowerShell : `notepad $PROFILE` (créez le fichier s'il n'existe pas).

### Étape 2 : Installer et vérifier les outils

Installez ce qui manque. `winget` est livré avec les versions récentes de Windows 10 et 11 (il fait partie d'*App Installer*).

```powershell
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Git.Git -e
winget install --id GitHub.cli -e
winget install --id GitHub.Copilot -e
```

Fermez le terminal et ouvrez-en un nouveau pour charger le nouveau `PATH` (puis réactivez l'UTF-8, étape 1). Vérifiez ensuite :

```powershell
node --version; git --version; gh --version; copilot --version
```

<figure class="screenshot-frame" markdown>
![Fenêtre PowerShell montrant la commande qui affiche les versions de Node.js, Git, GitHub CLI et Copilot CLI, avec les quatre lignes de version en dessous](../../assets/img/lab-00/00-01-tool-versions.png)
<figcaption>Vérification des quatre versions d'outils dans PowerShell. Vos numéros de version peuvent être plus récents.</figcaption>
</figure>

!!! success "Résultat attendu"
    Quatre lignes de version s'affichent, sans erreur « non reconnu ». L'exécution enregistrée a utilisé Copilot CLI 1.0.91 et le plugin v1.0.2 ; des versions plus récentes conviennent.

### Étape 3 : Ouvrir une session GitHub et Copilot

```powershell
gh auth login
gh auth status
copilot
```

Suivez les invites du navigateur pour `gh auth login` (GitHub.com, HTTPS, navigateur Web). Dans `copilot`, terminez l'ouverture de session si elle est demandée (`/login`), puis quittez avec `Ctrl+C` deux fois ou `/exit`.

!!! success "Résultat attendu"
    `gh auth status` indique que vous êtes connecté à `github.com`, et `copilot` s'ouvre sans erreur d'authentification.

### Étape 4 : Ajouter le marché et installer le plugin

```powershell
copilot plugin marketplace add devopsabcs-engineering/ai-team-sdlc
copilot plugin install ai-team-sdlc@ai-team-sdlc
```

!!! success "Résultat attendu"
    Chaque commande se termine sans erreur et confirme l'ajout du marché et l'installation du plugin.

### Étape 5 : Vérifier le plugin

```powershell
copilot plugin list
```

<figure class="screenshot-frame" markdown>
![Fenêtre PowerShell montrant copilot plugin list avec ai-team-sdlc@ai-team-sdlc sous Installed plugins](../../assets/img/lab-00/00-02-plugin-list.png)
<figcaption>La liste doit inclure ai-team-sdlc. Les autres plugins de l'ordinateur de capture ne sont pas affichés.</figcaption>
</figure>

!!! success "Résultat attendu"
    La liste inclut `ai-team-sdlc` (version 1.0.2 au moment de la rédaction).

### Étape 6 : Créer le dépôt d'entraînement

Choisissez un chemin court, hors des dossiers synchronisés par OneDrive, pour éviter les problèmes de verrouillage de fichiers.

```powershell
New-Item -ItemType Directory -Force "$HOME\src\ai-sdlc-practice" | Out-Null
Set-Location -LiteralPath "$HOME\src\ai-sdlc-practice"
git init -b main
"# AI-SDLC practice`n" | Set-Content README.md -Encoding utf8
git add README.md
git commit -m "chore: initial commit"
(Get-Location).Path
```

!!! success "Résultat attendu"
    `git log --oneline` affiche un commit, et la dernière commande affiche le chemin du dossier d'entraînement.

!!! checkpoint "Parcours enregistré"
    Vous préférez partir de l'application de référence ? Clonez `https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch` et extrayez l'étiquette `lab-00-end` dès qu'elle est publiée. Votre propre idée ? Gardez ce dépôt d'entraînement et renommez-le plus tard.

### Étape 7 : Initialiser avec ait-init

Lancez toujours `copilot` **à la racine du dépôt** : l'outil shell de l'agent peut ignorer les commandes `cd`, de sorte que le dossier où vous démarrez est celui où il travaille.

```powershell
Set-Location -LiteralPath "$HOME\src\ai-sdlc-practice"
copilot -p "Use the ait-init skill to prepare this repository for the ai-team-sdlc plugin." --allow-all-tools --no-ask-user
git status --short
```

<figure class="screenshot-frame" markdown>
![Fenêtre PowerShell montrant la commande copilot qui exécute la compétence ait-init, puis git show qui liste les trois fichiers créés](../../assets/img/lab-00/00-03-ait-init.png)
<figcaption>Exécution de ait-init depuis la racine du dépôt : trois fichiers sont ajoutés dans un seul commit.</figcaption>
</figure>

!!! success "Résultat attendu"
    L'agent affiche un bloc de résultat. `git status --short` liste de nouveaux fichiers comme `.github/copilot/settings.json`, `AGENTS.md`, `.gitignore` et `.copilot-tracking/.gitkeep`. Le dossier de suivi `.copilot-tracking/` est ignoré par Git : il contient l'état des exécutions, jamais du code source.

Validez l'initialisation :

```powershell
git add -A
git commit -m "chore: bootstrap repo with the ai-team-sdlc plugin"
```

### Étape 8 : Faire un test de fumée peu coûteux

```powershell
copilot -p "Reply with the single word: ready" --no-ask-user
```

!!! success "Résultat attendu"
    La réponse est `ready` (ou très proche). L'appel coûte presque rien et prouve que l'ouverture de session, le réseau et l'accès au modèle fonctionnent.

## Invites et compétences dans la CLI et dans VS Code

Les commandes `/product-*` sont des **fichiers d'invite pour VS Code**. Dans Copilot CLI, vous demandez la compétence correspondante en langage simple. Les ateliers montrent les deux.

| Invite VS Code | Formulation dans Copilot CLI |
|----------------|------------------------------|
| `/product-run` | `Use the ait-sdlc-orchestrate skill. Specs: ./specs/idea.md ...` |
| `/product-design` | `Use the ait-product-design skill ...` |
| `/product-prototype` | `Use the ait-product-prototype skill ...` |
| `/product-specs` | `Use the ait-tech-specs skill ...` |
| `/product-implement` | `Use the ait-implementation skill ...` |
| `/product-qa` | `Use the ait-qa-validation skill ...` |
| `/product-review` | `Use the ait-review-critic skill ...` |
| `/product-security` | `Use the ait-security skill ...` |
| `/product-deploy` | `Use the ait-deploy skill ...` |

## Liste de validation

Exécutez ceci à la racine du dépôt d'entraînement. Chaque ligne doit afficher `OK`.

```powershell
$checks = [ordered]@{
  'PowerShell is UTF-8'    = [Console]::OutputEncoding.WebName -eq 'utf-8'
  'node on PATH'           = [bool](Get-Command node -ErrorAction SilentlyContinue)
  'git on PATH'            = [bool](Get-Command git -ErrorAction SilentlyContinue)
  'gh signed in'           = (gh auth status 2>&1 | Out-String) -match 'Logged in'
  'copilot on PATH'        = [bool](Get-Command copilot -ErrorAction SilentlyContinue)
  'plugin installed'       = (copilot plugin list 2>&1 | Out-String) -match 'ai-team-sdlc'
  'plugin enabled in repo' = Test-Path '.github/copilot/settings.json'
  'tracking store ignored' = [bool](Select-String -Path .gitignore -Pattern '.copilot-tracking/' -SimpleMatch -ErrorAction SilentlyContinue)
}
$checks.GetEnumerator() | ForEach-Object { '{0,-24} {1}' -f $_.Key, $(if ($_.Value) { 'OK' } else { 'MISSING' }) }
```

* [ ] La console utilise l'UTF-8.
* [ ] `node`, `git`, `gh` et `copilot` affichent une version.
* [ ] `gh auth status` indique que vous êtes connecté.
* [ ] `copilot plugin list` affiche `ai-team-sdlc`.
* [ ] Le dépôt d'entraînement contient `.github/copilot/settings.json` et `AGENTS.md`.
* [ ] `.copilot-tracking/` figure dans `.gitignore`.
* [ ] Vous savez à peu près ce que coûte une exécution complète et comment en arrêter une.

## Dépannage

### npm ou le registre d'entreprise échoue

Symptômes : `ERR_SSL_SSL/TLS_ALERT_HANDSHAKE_FAILURE`, `E401` ou des étapes d'installation qui se figent. Les ateliers exigent le registre public.

```powershell
npm config get registry
npm config set registry https://registry.npmjs.org/
```

Si votre réseau utilise un proxy qui inspecte le trafic TLS, demandez à votre administrateur les paramètres de proxy et d'autorité de certification, ou réalisez les ateliers depuis un réseau sans inspection. Ne validez jamais un fichier de verrouillage qui pointe vers un registre privé.

### L'agent ignore `cd`

Le shell de l'agent peut supprimer un `cd` en début de commande. Lancez `copilot` à la racine du dépôt et utilisez des chemins relatifs. Dans vos scripts, utilisez `Set-Location -LiteralPath <chemin absolu>` et affichez `(Get-Location).Path` pour confirmer.

### Le plugin n'apparaît pas dans la liste

Relancez `copilot plugin marketplace add devopsabcs-engineering/ai-team-sdlc`, puis `copilot plugin install ai-team-sdlc@ai-team-sdlc`. Vérifiez la version de Copilot CLI avec `copilot --version` ; exécutez `copilot update` si elle est ancienne. Ouvrez un nouveau terminal et réessayez `copilot plugin list`.

### `/product-run` ne fait rien dans la CLI

Ce sont des invites VS Code. Dans la CLI, écrivez `Use the ait-sdlc-orchestrate skill ...`. Consultez le tableau ci-dessus.

### `winget` ou une commande n'est pas reconnu

Installez ou mettez à jour *App Installer* depuis le Microsoft Store, puis ouvrez un **nouveau** terminal. Une commande tout juste installée ne se trouve pas dans le `PATH` d'une fenêtre déjà ouverte.

Plus d'aide : [Dépannage](../troubleshooting.md).

## Vérification des connaissances

??? question "Pourquoi lancer `copilot` à la racine du dépôt ?"
    L'outil shell de l'agent peut ignorer `cd` : le dossier où vous démarrez la CLI est donc celui où elle travaille. Démarrer à la racine garde toutes les opérations sur les fichiers à l'intérieur de votre dépôt.

??? question "`ait-init` est-il obligatoire ?"
    Non. L'orchestrateur crée le registre de suivi à sa première exécution. `ait-init` ne fait que rendre l'adoption explicite : il active le plugin dans le dépôt, ajoute un court pointeur `AGENTS.md` et fait ignorer `.copilot-tracking/` par Git.

??? question "Quels deux choix gardent une exécution d'atelier peu coûteuse ?"
    Suivre les points de contrôle enregistrés plutôt que tout relancer, et garder l'application petite avec une seule phase bornée par exécution.

??? question "Que change `--allow-all-tools`, et pourquoi est-ce risqué ?"
    Il permet à l'agent d'exécuter des commandes et de modifier des fichiers sans vous demander chaque fois. Ne l'utilisez que dans un dépôt d'entraînement ou jetable, jamais dans un dossier contenant du travail que vous ne pourriez pas recréer.

## Prochaines étapes

Vous êtes prêt pour l'[atelier 1 : De l'idée à l'énoncé](lab-01-idea-to-brief.md), où vous rédigez l'énoncé du produit que toutes les phases suivantes respecteront.
