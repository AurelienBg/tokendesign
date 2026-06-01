# Token Design — Spec produit & technique

> Document de référence pour Claude Code. À lire intégralement en début de session.
> App jumelle de la suite (7Powers, Regul8, PitchCraft, Tokenlab…) : **méthode atelier → modules → coach IA context-aware → export structuré**. Stack et conventions alignés sur `7powers` ; identité visuelle propre.

---

## 1. Vision produit

### 1.1 Problème résolu
Un fondateur web3 ne sait pas, avant de coder, **ce qu'il construit vraiment** (la nature de son token), **dans quelle case réglementaire** il tombe (UE — MiCA / MiFID II), **ce que ça lui impose**, ni **dans quel ordre lancer** sans franchir un point de non-retour. L'app cadre, éduque et signale — elle ne donne **ni avis juridique ni financier**.

### 1.2 Les 3 angles (entrées du hub)
Un hub, trois portes, **un moteur déterministe commun** :

1. **Create a token** — concevoir un nouveau token. Wizard intake → moteur → **dossier de lancement**.
2. **Build an app** — construire une app qui agit sur les actifs des utilisateurs (lire / proposer / autoriser / déposer). Échelle d'autorité → **profil de risque + checklist custody**, mappée XRPL. *(actuellement un cul-de-sac « page d'info » — à finir.)*
3. **Analyze a token** — diagnostiquer un token **existant**. Même moteur (grille → A → red flags), entrée en mode audit (saisie manuelle ; ingestion on-chain plus tard).

Les 3 partagent le moteur : la logique n'est codée **qu'une fois**.

### 1.3 Cibles
Fondateurs / CTO / ops web3 non-juristes, en phase de conception. Self-serve. FR + EN.

---

## 2. Méthodologie intégrée (le moteur = le cerveau)

Un token = un **vecteur morphologique** (substance, pas techno). On ne demande jamais le standard technique (MPT, IOU, NFT) : il n'entre pas dans la qualification.

**Axes de la grille** (valeurs MECE, clés stables) :
- `fongibilite`: fongible · semi · non-fongible
- `rapport`: natif · adosse · titre (+ `titre_type`: financier · reel · autre)
- `couverture`: aucune · mutualisee · dediee · na *(na si natif)*
- `debiteur`: aucun · identifie · diffus  ← **clé de voûte** (qui doit quoi à qui)
- `garant`: aucun · identifie · diffus
- `transfer`: libre · gelable · permissionnee · non-transferable
- `fonctions` (multi): paiement · reserve · placement · utility · gouvernance · collection · preuve
- `droits` (multi): revenus · votes · royalties · expiration · consommable
- *(à ajouter — trou identifié)* `mutabilite`: qui peut modifier/reprendre le token après émission (personne · émetteur sous conditions · émetteur librement) → couvre dynamic NFT + clawback.

**Les 4 couches** que le moteur applique au vecteur :
- **A — Qualification** (instance UE) : vecteur → classe → régime → obligations → red flags. *(détaillé §4)*
- **B — Autorité** (angle « Build an app ») : échelle lire → proposer → autoriser → déposer, croisée par périmètre × durée × révocabilité × consentement × détenteur ; mapping XRPL (pas d'`approve` ERC-20 ; Permission Delegation XLS-75, regular key, SignerList, objets natifs Escrow/AMM/Channel).
- **Business** (plus tard) : carte de flux de valeur (demande · source · maillons · captation · fuite) + test alignement/défendabilité.
- **D — Cycle de vie** : conception → émission → distribution → vie → fin ; cliquets (points de non-retour) ; poids des étapes piloté par `debiteur`.

Fil rouge : **`debiteur`** propage à travers A (classe), B (contrepartie), Business (captation), D (poids du cycle).

---

## 3. Modules de l'app

- **Module 0 — Hub / landing** : pitch + choix des 3 angles + sélecteur de langue + thème + (opt-in) connexion.
- **Module 1 — Create (wizard)** : fork des 2 chemins (peut cocher les deux) → bloc « Ce que c'est » → bloc « Comment tu le lances » → **Dossier**.
- **Module 2 — Configurateur & bibliothèque** : configurateur d'axes en direct + **17 cas de référence** + explications (porté depuis `grille-conception-token.html`). Utilisable seul **et** comme détail « identité » dans Create.
- **Module 3 — Analyze** : saisie d'un token existant → dossier en mode diagnostic.
- **Module 4 — Build an app (chemin B)** : questionnaire échelle d'autorité → profil de risque + checklist custody + mapping XRPL.
- **Module 5 — Dossier** : identité · classe + obligations + red flags · checklist avec cliquets ; export PDF ; (opt-in) sauvegarde.
- **Module 6 — Coach IA (optionnel, comme la suite)** : Anthropic SDK, context-aware sur le dossier, en garde-fou « pas un avis juridique ».

---

## 4. Le moteur déterministe (port-ready, à mettre en module TS pur `utils/engine.ts`)

Entrée = réponses ; on applique des **défauts prudents** sur les `?` et on marque « à confirmer ».

**Classe (règles ordonnées, premier match) :**
1. `droits∋revenus` **ou** (`rapport=titre` ∧ `titre_type=financier`) → **instrument** *(votes de gouvernance seuls ≠ instrument)*
2. `fongibilite∈{non-fongible, semi}` → **nft**
3. `stabilite=monnaie` → **emt** · `stabilite=panier` → **art**
4. sinon → **utility**

**Red flags (overlays cumulables) :**
- `stabilite≠aucune ∧ debiteur∈{diffus,aucun}` → **limbo**
- `rendement=oui ∧ classe∈{utility,nft}` → **security** (requalification)
- `stabilite≠aucune ∧ rapport=natif` → **algo** (stablecoin sans réserve)
- `classe=nft ∧ (fongibilite=semi ∨ fonctions∋placement)` → **nftserie**
- `distribution=retail ∧ classe∈{emt,art,instrument}` → **retail** (obligations max + cliquet)
- `custody=oui` → **custody** (couche B + risque de contrepartie)
- `juridiction≠ue` → **juridiction** (MiCA ne s'applique pas tel quel)
- incohérence grille (ex. `natif` + `debiteur≠aucun` ou + réserve) → **incoherence**

**Obligations** : lookup par classe (cf. contenu §7). **Checklist D** : étapes filtrées par classe + `retail`/`custody`/`juridiction`, cliquets = agrément-avant-émission · distribution-retail · prise-de-custody.

> La logique complète (intitulés, textes) est déjà rédigée FR/EN dans `index.html` existant (objets `QDEF`, `VMAP`, `CLS`, `RF`, `CK`, fonctions `eff/classify/redflags/buildDossier`). **Porter ce JS en TS typé**, c'est le raccourci.

---

## 5. Stack technique — non négociable (aligné 7powers)

- **Nuxt 3**, **TypeScript strict**, **Vue 3 `<script setup>` uniquement**.
- **TailwindCSS** via `@nuxtjs/tailwindcss` — primitives UI **codées à la main** (pas de lib de composants).
- **Pinia** (`@pinia/nuxt`) + `pinia-plugin-persistedstate` (local-first).
- **`@nuxtjs/i18n`** — FR + EN, **route-prefixée** (`/fr/*`, `/en/*`).
- **Supabase** (`@nuxtjs/supabase`, `redirect:false` = auth **opt-in**, local-first) — pour la sauvegarde/sync, pas obligatoire pour utiliser l'app.
- **xrpl + xrpl-connect** — connexion wallet (web component `<xrpl-wallet-connector>`).
- **Anthropic SDK** (`@anthropic-ai/sdk`) — coach IA optionnel (modèle Sonnet par défaut).
- **Export PDF** : `puppeteer-core` + `@sparticuz/chromium` via route serveur (comme 7powers).
- **Vercel** + `@vercel/analytics/nuxt`.

---

## 6. Auth & persistance — **réutiliser 7powers tel quel**

Lever directement de `7powers` (mêmes fichiers, adapter le branding) :
- `composables/useAuth.ts` — magic-link (`signInWithOtp`), Google OAuth, **sign-in XRPL wallet** (challenge → `signMessage` → `verifyOtp`).
- `composables/useXrplWallet.ts` + `plugins/xrplWallet.client.ts` + `plugins/supabase-pkce.client.ts`.
- `components/wallet/WalletConnectorModal.vue` + `WalletBadge.vue`.
- `composables/useCloudSync.ts` — local-first : l'app marche sans login ; au login, on synchronise le state Pinia vers Supabase.
- `middleware/auth.ts`, `composables/useTheme.ts`, le script anti-flash de thème dans `nuxt.config.ts`.

Philosophie : **rien ne quitte le navigateur tant qu'on ne se connecte pas** (argument privacy, déjà notre position). Login = pour sauver/partager un dossier seulement.

---

## 7. Contenu

- **Intake FR/EN** : déjà rédigé (cf. `QDEF` dans `index.html`). Questions en langage fondateur, exemples, option « je ne sais pas ».
- **Obligations / régimes / red flags / checklist** : déjà rédigés FR/EN (`CLS`, `RF`, `CK`).
- **17 cas de référence + explications + configurateur** : dans `grille-conception-token.html` — à porter en composants Vue.
- **Copy landing** (hero, how-it-works, disclaimer) : à itérer, ton de la suite.

---

## 8. Structure du repo (cible, conventions 7powers)

```
pages/            # routing fichier, i18n route-prefixée
components/
  landing/  hub/  create/  analyze/  authority/  dossier/  configurator/  coach/  wallet/  ui/  layout/
composables/      # useEngine, useDossier, useProject, useAuth*, useXrplWallet*, useTheme, useCloudSync*
utils/engine.ts   # LE moteur déterministe (pur, testé)
utils/content/    # intake, cls, rf, ck, refcases (FR/EN)
stores/           # project (Pinia + persist)
server/api/       # challenge wallet, verify, export-pdf
i18n/             # fr.json, en.json
assets/css/main.css   # tokens CSS light/dark (modèle 7powers)
tailwind.config.ts
```
*(\* = repris de 7powers)*

---

## 9. Trous ouverts / décisions

- Ajouter l'axe **`mutabilite`** (dynamic NFT / clawback) → red flag « contrôle centralisé post-émission ».
- **Analyze** : v1 saisie manuelle ; v2 ingestion on-chain (adresse XRPL/EVM → pré-remplir le vecteur).
- **Build an app (B)** : profondeur du mapping XRPL (Permission Delegation : vérifier le statut de l'amendement au build).
- **Business** et **profondeur techno** : post-MVP.
- Juridictions **hors UE** : l'arbre est paramétré par juridiction — UE d'abord.

---

## 10. Roadmap → sprints

- **Sprint 0 — Fondations** : scaffold Nuxt 3 (clone des configs 7powers) ; tokens de design (identité blueprint, §11) ; i18n FR/EN ; **port du moteur en `utils/engine.ts` typé + tests** ; hub avec les 3 angles en stubs.
- **Sprint 1 — Create** : wizard complet bilingue → dossier (port de `index.html`). MVP fonctionnel.
- **Sprint 2 — Configurateur & bibliothèque** : port du configurateur + 17 cas + explications ; branché aussi comme détail « identité » dans Create.
- **Sprint 3 — Analyze** : mode diagnostic (saisie manuelle).
- **Sprint 4 — Build an app (B)** : échelle d'autorité → profil + checklist custody + mapping XRPL.
- **Sprint 5 — Auth & persistance** : intégration 7powers (magic-link/Google/wallet, opt-in, cloud sync) + export PDF serveur.
- **Sprint 6 — Finition** : axe `mutabilite`, coach IA optionnel, analytics, polish a11y/responsive, landing copy.
- *(Backlog)* : Business, profondeur techno, hors-UE, ingestion on-chain pour Analyze.

---

## 11. Identité visuelle (propre à tokendesign)

Tes apps n'ont pas de modèle commun → tokendesign garde l'identité **« blueprint »** déjà conçue, sur **l'architecture de tokens de 7powers** (variables CSS light/dark + Tailwind).

- Accent : **ambre** `#e6a93c` (≈ `#a9741a` en clair). Sémantiques : teal (ok), danger (red flag), warn (à confirmer), blue (info).
- Surfaces via variables CSS `--bg-*`, `--border-*`, `--ink-*` (light = défaut, `.dark` = override), comme 7powers.
- Fonts : **Fraunces** (display), **IBM Plex Sans** (corps), **IBM Plex Mono** (labels/kicker).
- Motif fond « grille technique » + cartes/chips/callouts déjà définis dans `index.html` → à traduire en classes Tailwind (`.card`, `.btn-primary`, etc. sur le modèle de `main.css` de 7powers).

---

## 12. Ce que tu donnes à Claude Code pour démarrer

1. Ce fichier (`tokendesign-spec.md`) + un `CLAUDE.md` (fourni).
2. En référence dans le repo : **`index.html`** (le moteur + intake + dossier FR/EN à porter) et **`grille-conception-token.html`** (configurateur + 17 cas + explications à porter).
3. Accès aux fichiers d'auth de `7powers` à lever : `useAuth.ts`, `useXrplWallet.ts`, `useCloudSync.ts`, `plugins/*wallet*`, `plugins/supabase-pkce*`, `components/wallet/*`, `middleware/auth.ts`, `useTheme.ts`, le système de tokens Tailwind (`tailwind.config.ts` + `assets/css/main.css`).
4. Première consigne suggérée : « Exécute le Sprint 0 puis le Sprint 1 du `tokendesign-spec.md`. Porte le moteur de `index.html` en `utils/engine.ts` typé avec des tests, réutilise le système de design et l'auth de 7powers, garde l'identité blueprint du §11. »
