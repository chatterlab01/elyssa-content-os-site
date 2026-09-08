# Elyssa Content OS — Legal Website

Mini site officiel premium pour Elyssa Content OS. Sert de vitrine légère et
de page légale de référence pour les revues d'app (TikTok Developer, Meta/
Instagram, YouTube plus tard) et pour l'image de marque.

Aucun framework : HTML / CSS / JS natifs uniquement. Prêt à déployer tel
quel sur Vercel.

## Arborescence

```
elyssa-legal-site/
├── index.html      Landing page (hero, 3 cards, Why Elyssa, footer)
├── privacy.html     Privacy Policy
├── terms.html       Terms of Service
├── style.css        Design system (dark, Inter, accent violet)
├── script.js        Scroll-reveal + année du footer (progressive enhancement)
├── vercel.json       cleanUrls -> /privacy et /terms sans .html
├── favicon.svg        Favicon vectoriel
├── og-image.svg         Image de partage (1200x630)
└── README.md
```

## Design

- Palette : fond `#09090B`, cartes `#18181B`, texte `#FAFAFA`, texte
  secondaire `#A1A1AA`, accent `#8B5CF6`.
- Police : Inter (Google Fonts), fallback système.
- Coins arrondis, ombres légères, animations discrètes (apparition au
  scroll, hover cartes/boutons) — respecte `prefers-reduced-motion`.
- 100% responsive (breakpoints 860px / 560px), zéro dépendance JS externe.

## Déploiement Vercel

1. Pousser ce dossier tel quel sur un repo Git (ou glisser-déposer sur
   [vercel.com/new](https://vercel.com/new)).
2. Import Project sur Vercel → **Framework Preset : Other** (site statique,
   aucun build command, aucun output directory à préciser).
3. Deploy.

`vercel.json` active `cleanUrls`, donc une fois déployé :

- `/` → `index.html`
- `/privacy` → `privacy.html`
- `/terms` → `terms.html`

… fonctionnent nativement, sans configuration supplémentaire.

## Contenu à personnaliser avant mise en production

- **Domaine réel** : les balises `og:url`/`canonical` utilisent des chemins
  relatifs (`/`, `/privacy`, `/terms`), qui se résolvent automatiquement une
  fois le site en ligne sur son vrai domaine — rien à modifier.
- **og-image.svg** : certains crawlers (Twitter/Facebook) ont un support
  inégal du SVG pour les previews de lien. Le placeholder est soigné et
  fonctionnera pour beaucoup de contextes, mais pour une compatibilité
  maximale sur toutes les plateformes, prévoir une conversion en PNG
  1200×630 (`og-image.png`) et mettre à jour les balises `og:image`/
  `twitter:image` dans les 3 pages HTML avant le lancement public.
- **Contenu légal** : Privacy Policy et Terms sont rédigés en anglais,
  professionnels et complets (aucun lorem ipsum), mais restent un point de
  départ — à faire relire par un juriste avant usage en production réelle,
  notamment pour la conformité TikTok Developer / Meta App Review.

## Vérifications effectuées

- Aucun lien cassé (navigation interne `/`, `/privacy`, `/terms` + ancres de
  section vérifiées via serveur local).
- Responsive mobile (< 560px) et desktop testés dans le CSS (grilles
  flexibles, pas de débordement horizontal).
- Footer avec liens Privacy Policy / Terms of Service présent sur les 3
  pages, accessible sans menu.
- Favicon (`favicon.svg`) référencé sur les 3 pages.
- SEO : title, meta description, Open Graph et Twitter Card uniques par
  page.
- `vercel.json` prêt pour un déploiement statique sans configuration
  additionnelle.
