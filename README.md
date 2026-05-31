# Assistant fondateur — cadrer son token

Outil web **self-serve** qui aide un fondateur web3 à cadrer son projet de token : à partir de quelques questions en langage clair, il déduit l'identité du token, sa **classe réglementaire probable** (cadre UE — MiCA / MiFID II), les **obligations-clés**, les **points de vigilance** et une **checklist de lancement** avec les points de non-retour.

Bilingue **FR / EN**, thème clair / sombre, 100 % côté client — aucune donnée ne quitte le navigateur.

## Fonctionnalités

- Wizard guidé : nature du projet → identité du token → conditions de lancement
- Moteur de qualification déterministe (vecteur → classe → red flags → checklist)
- Dossier de lancement généré, imprimable en PDF
- Mentions « à confirmer » sur les réponses incertaines
- Sélecteur de langue (FR / EN) et bascule de thème

## Utilisation

Ouvrir `index.html` dans un navigateur. Aucune dépendance, aucun build.

## Déploiement (GitHub Pages)

1. Pousser `index.html` à la racine du dépôt (public).
2. *Settings → Pages → Source : Deploy from a branch → `main` / `/ (root)` → Save*.
3. Le site est servi sur `https://<utilisateur>.github.io/<dépôt>/`.

Pour mettre à jour : committer une nouvelle version de `index.html`, le site se reconstruit automatiquement.

## Avertissement

Cet outil **structure, éduque et signale** — il ne constitue **ni un avis juridique ni un avis financier**. Il suit le cadre européen et reste non exhaustif. Toute décision doit être validée par un conseil.

## Périmètre

MVP centré sur la **création d'un token**. À venir : la couche autorité / custody (apps agissant sur les actifs des utilisateurs), le modèle de business, le choix de la techno (XRPL), et les juridictions hors UE.

## Licence

À définir (ex. MIT). © 2026 — tous droits réservés.
