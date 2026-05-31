# Founder's assistant — frame your token

A **self-serve** web tool that helps a web3 founder frame their token project: starting from a few plain-language questions, it infers the token's identity, its **likely regulatory class** (EU framework — MiCA / MiFID II), the **key obligations**, the **points to watch**, and a **launch checklist** including the points of no return.

Bilingual **EN / FR**, light / dark theme, 100% client-side — no data ever leaves the browser.

## Features

- Guided wizard: project nature → token identity → launch conditions
- Deterministic qualification engine (vector → class → red flags → checklist)
- Generated launch dossier, printable to PDF
- "To confirm" tags on uncertain answers
- Language selector (EN / FR) and theme toggle

## Usage

Open `index.html` in a browser. No dependencies, no build step.

## Deployment (GitHub Pages)

1. Push `index.html` to the root of the (public) repository.
2. *Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save*.
3. The site is served at `https://<user>.github.io/<repo>/`.

To update: commit a new version of `index.html`; the site rebuilds automatically.

## Disclaimer

This tool **structures, educates, and flags** — it does **not constitute legal or financial advice**. It follows the European framework and is not exhaustive. Any decision must be validated by professional counsel.

## Scope

MVP focused on **token creation**. Coming next: the authority / custody layer (apps acting on users' assets), the business model, the technology choice (XRPL), and non-EU jurisdictions.

## License

To be defined (e.g. MIT). © 2026 — all rights reserved.
