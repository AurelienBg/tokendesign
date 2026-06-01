# CLAUDE.md

Contexte persistant pour le projet **Token Design**. À lire entièrement en début de chaque session.

---

## Project identity

**Name:** Token Design
**One-liner:** Assistant self-serve qui aide un fondateur web3 à cadrer son token — identité, classe réglementaire (UE), obligations, red flags, checklist de lancement.
**Live (target):** `aurelienbg.github.io/tokendesign` (dev) → Vercel ensuite.
**Status:** Greenfield. On construit depuis `tokendesign-spec.md` (racine du repo).

App de la suite post-atelier (7Powers, Regul8, PitchCraft, Tokenlab…). Même philosophie : **méthode → modules → coach IA context-aware → export structuré**, **local-first, auth opt-in**. Identité visuelle **propre** (blueprint ambre, cf. spec §11) — pas de modèle commun imposé.

---

## Stack — non négociable

- **Nuxt 3** (comme 7powers — PAS Next.js)
- **TypeScript strict**, **Vue 3 Composition API `<script setup>` only**
- **TailwindCSS** (`@nuxtjs/tailwindcss`) — primitives UI codées à la main, pas de lib de composants
- **Pinia** (`@pinia/nuxt`) + `pinia-plugin-persistedstate`
- **Supabase** (`@nuxtjs/supabase`, `redirect:false` → auth opt-in)
- **`@nuxtjs/i18n`** — FR + EN, route-prefixée (`/fr/*`, `/en/*`)
- **xrpl + xrpl-connect** — connexion wallet
- **Anthropic SDK** (`@anthropic-ai/sdk`) — coach IA optionnel, Sonnet par défaut
- **puppeteer-core + @sparticuz/chromium** — export PDF (route serveur)
- **Vercel** + `@vercel/analytics/nuxt`

Pas d'autre lib majeure sans demander.

---

## Règles de build

- **Le moteur est déterministe et vit dans `utils/engine.ts`** (TS pur, testé) — la logique n'est codée qu'une fois et partagée par les 3 angles (Create / Analyze / Build an app). Source à porter : `index.html` (objets `QDEF/VMAP/CLS/RF/CK`, fonctions `eff/classify/redflags`).
- **Réutiliser l'auth de 7powers** telle quelle (magic-link / Google / wallet XRPL), adapter le branding seulement.
- **Local-first** : l'app marche sans login ; le login ne sert qu'à sauvegarder/partager.
- **Ce n'est pas un avis juridique** : chaque sortie le rappelle ; la couche A renvoie à un conseil. Cadre UE (MiCA / MiFID II) par défaut.
- **Substance over form** : ne jamais demander le standard technique (MPT/IOU/NFT) dans la qualification.
- Suivre la structure de repo de la spec §8. Ne pas inventer d'autre organisation.

---

## Source de vérité

`tokendesign-spec.md` (racine). Fichiers de référence à porter : `index.html` (moteur + intake + dossier FR/EN), `grille-conception-token.html` (configurateur + 17 cas + explications).

Ordre de travail : Sprints 0 → 6 de la spec §10.
