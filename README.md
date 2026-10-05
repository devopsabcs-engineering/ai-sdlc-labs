# ai-sdlc-labs

Bilingual (EN/FR) hands-on labs: build an app from idea to production with the [ai-team-sdlc](https://github.com/devopsabcs-engineering/ai-team-sdlc) Copilot plugin.

Site: <https://devopsabcs-engineering.github.io/ai-sdlc-labs/> (English at `/en/`, French at `/fr/`).

## English

The labs follow the AI-SDLC lifecycle: idea, plan, build, test, human sign-off, deploy. You can follow the **recorded run** of the reference app [Pinch](https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch) (checkpoint tags `lab-NN-end`) or **bring your own idea**. The audience is Windows, PowerShell and VS Code users.

| Lab | Title | Duration |
|-----|-------|----------|
| 0 | Prerequisites and setup | 20 min |
| 1 | From idea to brief | 25 min |
| 2 | Design and prototype | 35 min |
| 3 | Requirements and architecture | 35 min |
| 4 | Build in slices | 60 min |
| 5 | QA, critic review and security | 45 min |
| 6 | Human sign-off and changes requested | 30 min |
| 7 | Deploy to production | 30 min |
| 8 | Resume, recover and tear down | 25 min |

### Preview locally

```powershell
python -m pip install --user -r requirements.txt
python -m mkdocs serve
```

Open <http://127.0.0.1:8000/>. To run the same checks as CI:

```powershell
python scripts/check_parity.py
python scripts/check_images.py
python -m mkdocs build --strict
```

### Contribute and translate

* **Parity.** Every page exists under `docs/en/` and `docs/fr/` with the same file name, the same number of H2 and H3 headings, the same images and non-empty `title` and `description` front matter. `scripts/check_parity.py` enforces it.
* **Glossary.** Use the terms of the glossary page in both languages (for example *quality gate* = *passerelle de qualité*, *human sign-off* = *approbation humaine*, *checkpoint* = *point de contrôle*). French is Canadian French, written by a person, not machine-translated.
* **Screenshots.** Name them `docs/assets/img/lab-NN/NN-NN-name.png`, and `NN-NN-name.fr.png` when the capture shows a localized UI. See `docs/assets/img/README.md`.
* **Alt text.** Every image needs non-empty alt text in the English and the French page. `scripts/check_images.py` enforces it.
* **Icons.** Emoji only. Put `aria-hidden="true"` on an emoji that sits next to visible text, and `role="img"` with an `aria-label` on one that stands alone.
* **Commits.** Conventional Commits, for example `docs(docs): add lab 1 steps`.

### How the language folders are built

`mkdocs-static-i18n` builds its default language at the site root. To publish `/en/` and `/fr/` side by side, the root belongs to a hidden `eo` locale that only holds the language picker (`docs/index.md` with `overrides/redirect.html`) and the 404 page. English and French pages live in `docs/en/` and `docs/fr/`. The picker sends visitors to the language they chose last (stored in the browser) or to their browser language, with English as the default.

## Français

Ces ateliers suivent le cycle de vie AI-SDLC : idée, planification, construction, tests, approbation humaine, déploiement. Vous pouvez suivre l'**exécution enregistrée** de l'application de référence [Pinch](https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch) (étiquettes de point de contrôle `lab-NN-end`) ou **apporter votre propre idée**. Le public cible utilise Windows, PowerShell et VS Code.

### Aperçu local

```powershell
python -m pip install --user -r requirements.txt
python -m mkdocs serve
```

Ouvrez <http://127.0.0.1:8000/>. Pour lancer les mêmes vérifications que l'intégration continue :

```powershell
python scripts/check_parity.py
python scripts/check_images.py
python -m mkdocs build --strict
```

### Contribuer et traduire

* **Parité.** Chaque page existe dans `docs/en/` et `docs/fr/` avec le même nom de fichier, le même nombre de titres H2 et H3, les mêmes images et des champs `title` et `description` non vides. `scripts/check_parity.py` le vérifie.
* **Glossaire.** Employez les termes du glossaire dans les deux langues (par exemple *quality gate* = *passerelle de qualité*, *human sign-off* = *approbation humaine*, *checkpoint* = *point de contrôle*). Le français est du français canadien rédigé par une personne, pas une traduction automatique.
* **Captures d'écran.** Nommez-les `docs/assets/img/lab-NN/NN-NN-nom.png`, et `NN-NN-nom.fr.png` quand la capture montre une interface localisée. Voir `docs/assets/img/README.md`.
* **Texte de remplacement.** Chaque image a un texte de remplacement non vide dans la page anglaise et dans la page française. `scripts/check_images.py` le vérifie.
* **Icônes.** Émojis seulement. Ajoutez `aria-hidden="true"` à un émoji placé à côté d'un texte visible, et `role="img"` avec un `aria-label` à un émoji isolé.
* **Commits.** Conventional Commits, par exemple `docs(docs): add lab 1 steps`.

## License

[Apache-2.0](LICENSE)
