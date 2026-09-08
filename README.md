# Elyssa Content OS — Legal Website

Mini site officiel premium pour Elyssa Content OS. Sert de vitrine légère et
de page légale de référence pour les revues d'app (TikTok Developer, Meta/
Instagram, YouTube plus tard), pour l'image de marque, et de point d'entrée
public pour la connexion des comptes sociaux (OAuth TikTok).

Aucun framework : HTML / CSS / JS natifs uniquement. Prêt à déployer tel
quel sur Vercel.

## Arborescence

```
elyssa-legal-site/
├── index.html            Landing page (hero, 3 cards, Why Elyssa, footer)
├── privacy.html           Privacy Policy
├── terms.html              Terms of Service
├── tiktok-connect.html      Connect TikTok — proxyé vers le backend FastAPI
├── style.css              Design system (dark, Inter, accent violet)
├── script.js               Scroll-reveal + année du footer (progressive enhancement)
├── vercel.json              cleanUrls (/privacy, /terms) + rewrite /social/* -> backend
├── favicon.svg               Favicon vectoriel
├── og-image.svg                Image de partage (1200x630)
└── README.md
```

## Design

- Palette : fond `#09090B`, cartes `#18181B`, texte `#FAFAFA`, texte
  secondaire `#A1A1AA`, accent `#8B5CF6`.
- Police : Inter (Google Fonts), fallback système.
- Coins arrondis, ombres légères, animations discrètes (apparition au
  scroll, hover cartes/boutons) — respecte `prefers-reduced-motion`.
- 100% responsive (breakpoints 860px / 560px), zéro dépendance JS externe.

## Connect TikTok (OAuth) — ce site est le point d'entrée public

`tiktok-connect.html` est la page vers laquelle le backend FastAPI
(`elyssa-content-os`) redirige une fois la connexion TikTok traitée. Elle
appelle l'API en chemins **relatifs** (`/social/tiktok/login`,
`/social/accounts/{creator_id}`) : grâce au rewrite Vercel ci-dessous, ces
appels restent same-origin du point de vue du navigateur — **aucun CORS
requis**.

### Comment ça marche bout-en-bout

```
1. Utilisateur ouvre  https://<ce-site>/tiktok-connect?creator_id=...
2. Clic "Connect TikTok" -> GET /social/tiktok/login?creator_id=...
   (proxyé par Vercel vers l'API FastAPI)
3. L'API redirige vers TikTok (state signé HMAC, voir repo elyssa-content-os)
4. L'utilisateur autorise sur TikTok
5. TikTok redirige vers https://<ce-site>/social/tiktok/callback?code=...&state=...
   (c'est l'URL enregistrée comme TIKTOK_REDIRECT_URI côté TikTok Developer)
6. Vercel proxy cette requête vers l'API FastAPI (même chemin, transparent)
7. L'API échange le code (client_secret jamais exposé au navigateur),
   enregistre le compte dans social_accounts, puis redirige le navigateur
   vers https://<ce-site>/tiktok-connect?tiktok=connected&creator_id=...
8. La page affiche l'avatar + le nom du compte connecté (nouvel appel
   relatif à /social/accounts/{creator_id}, toujours same-origin)
```

`client_secret` ne quitte jamais le backend : ce site ne le connaît pas, ne
le stocke pas, et ne pourrait techniquement pas l'exposer même par erreur —
il ne fait que proxyer des requêtes HTTP vers l'API qui, elle, le détient.

## Déploiement Vercel

1. Pousser ce dossier tel quel sur un repo Git (ou glisser-déposer sur
   [vercel.com/new](https://vercel.com/new)).
2. Import Project sur Vercel → **Framework Preset : Other** (site statique,
   aucun build command, aucun output directory à préciser).
3. **Avant de déployer en production**, éditer `vercel.json` : remplacer
   `REPLACE_WITH_YOUR_FASTAPI_BACKEND_URL` par l'URL publique réelle du
   backend FastAPI (ex: `api.elyssa-content-os.com`, ou l'URL fournie par
   votre hébergeur — Railway/Render/Fly.io/VPS). Tant que ce placeholder
   n'est pas remplacé, `/social/*` échouera (416/502 ou "not found") — ce
   qui est volontaire : rien ne pointe silencieusement vers un mauvais
   serveur.
4. Deploy.

`vercel.json` combine :

- `cleanUrls: true` → `/`, `/privacy`, `/terms`, `/tiktok-connect`
  fonctionnent nativement, sans configuration supplémentaire ;
- `rewrites` → tout ce qui commence par `/social/` (et uniquement ça) est
  transparently proxyé vers le backend FastAPI. Le pattern `/social/:path*`
  ne peut par construction matcher aucune des routes statiques ci-dessus
  (aucune ne commence par `/social`) — vérifié explicitement (voir
  "Vérifications effectuées").

## Contenu à personnaliser avant mise en production

- **URL du backend** (`vercel.json`) — voir « Déploiement Vercel » ci-dessus.
  C'est le seul réglage strictement nécessaire au fonctionnement de la
  connexion TikTok.
- **Domaine réel** : les balises `og:url`/`canonical` utilisent des chemins
  relatifs (`/`, `/privacy`, `/terms`), qui se résolvent automatiquement une
  fois le site en ligne sur son vrai domaine — rien à modifier.
- **og-image.svg** : certains crawlers (Twitter/Facebook) ont un support
  inégal du SVG pour les previews de lien. Le placeholder est soigné et
  fonctionnera pour beaucoup de contextes, mais pour une compatibilité
  maximale sur toutes les plateformes, prévoir une conversion en PNG
  1200×630 (`og-image.png`) et mettre à jour les balises `og:image`/
  `twitter:image` dans les pages HTML avant le lancement public.
- **Contenu légal** : Privacy Policy et Terms sont rédigés en anglais,
  professionnels et complets (aucun lorem ipsum), mais restent un point de
  départ — à faire relire par un juriste avant usage en production réelle,
  notamment pour la conformité TikTok Developer / Meta App Review.

## Vérifications effectuées

- Aucun lien cassé (navigation interne `/`, `/privacy`, `/terms`,
  `/tiktok-connect` + assets vérifiés via serveur local, chaque fichier
  testé individuellement).
- HTML bien formé (balises équilibrées) sur les 4 pages — vérifié par un
  parseur dédié, pas seulement une relecture visuelle.
- **Isolation du rewrite** : vérifié explicitement que le pattern
  `/social/:path*` ne peut intercepter aucune route statique existante
  (`/`, `/privacy`, `/terms`, `/tiktok-connect`, tous les assets) — aucune
  ne commence par `/social`, donc aucun conflit possible par construction.
  Confirmé contre la documentation Vercel officielle (rewrites vers une
  origine externe) : le pattern utilisé est exactement l'exemple documenté
  par Vercel pour ce cas d'usage.
- Responsive mobile (< 560px) et desktop testés dans le CSS (grilles
  flexibles, pas de débordement horizontal).
- Footer avec liens Privacy Policy / Terms of Service présent sur toutes
  les pages, accessible sans menu.
- Favicon (`favicon.svg`) référencé sur toutes les pages.
- SEO : title, meta description, Open Graph et Twitter Card uniques par
  page (`tiktok-connect.html` est volontairement `noindex` : ce n'est pas
  une page de contenu public).
- `vercel.json` prêt pour un déploiement statique + proxy, sans
  configuration additionnelle au-delà de l'URL du backend.

## Ce qu'il reste avant la mise en production réelle

- Remplacer le placeholder d'URL backend dans `vercel.json`.
- Déployer réellement l'API FastAPI (`elyssa-content-os`) quelque part de
  public, et renseigner `TIKTOK_CLIENT_KEY`/`SECRET`/`TIKTOK_REDIRECT_URI`/
  `OAUTH_STATE_SECRET`/`TOKEN_ENCRYPTION_KEY` côté backend.
- Tester le flux complet en conditions réelles (compte TikTok Developer
  avec ce domaine + ce redirect_uri enregistrés).
- Conversion `og-image.svg` → PNG (voir ci-dessus).
- Relecture juridique du contenu légal.
