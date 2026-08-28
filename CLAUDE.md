# AUDEX Avocats — avoc.ca

Cabinet juridique à Québec et Portneuf. Site statique Astro 5 déployé sur Netlify.

## Stack technique

- **Framework** : Astro 5.1 (SSG — rendu statique, aucun serveur)
- **CSS** : Tailwind CSS + styles globaux dans `src/styles/global.css`
- **CMS** : Decap CMS (interface : avoc.ca/admin, auth via GitHub OAuth)
- **Déploiement** : Netlify — auto-deploy à chaque `git push` sur `main`
- **Dépôt** : GitHub → `francis-adux/audex` (branche principale : `main`)
- **Langue** : Français québécois partout

## Commandes utiles

```bash
npm run dev      # serveur local http://localhost:4321
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

Toujours faire un `npm run build` avant de committer pour vérifier qu'il n'y a pas d'erreurs.

## Architecture des fichiers

```
src/
  content/          # Données gérées par le CMS
    blog/           # Articles (.md) — publishDate, tags, draft
    services/       # Pages de services (.md) — 9 domaines de pratique
    team/           # Fiches membres (.json) — nom, rôle, bio, practiceAreas, photo
    pages/          # Contenu des pages statiques (.md)
    settings/       # analytics.json (GTM ID)
  pages/
    index.astro           # Accueil
    notre-equipe/
      index.astro         # Liste de l'équipe
      [slug].astro        # Fiche individuelle — rendu bio markdown via marked
    services/[slug].astro # Pages de pratique (générées depuis src/content/services/)
    blog/
      index.astro         # Liste des articles
      [slug].astro        # Article individuel
    nous-joindre.astro
    le-cabinet.astro
    politique-confidentialite.astro
    merci.astro           # Page de confirmation formulaire (exclue du sitemap)
  layouts/
    BaseLayout.astro      # Layout principal — canonical, GTM, header, footer
    ServiceLayout.astro   # Layout pages de services — inclut ServiceTeam
  components/
    cards/TeamCard.astro           # Carte membre (grille /notre-equipe/)
    sections/ServiceTeam.astro     # Avocats liés à un domaine (services + blog)
    sections/ArticleRelatedServices.astro
  data/
    company.ts            # Coordonnées, téléphone, réseaux sociaux
    tag-to-service.ts     # Mapping tags blog → slugs de service (pour ServiceTeam)
public/
  admin/config.yml  # Configuration Decap CMS — MODIFIER ICI pour champs CMS
  robots.txt        # User-agent *, Sitemap: https://avoc.ca/sitemap-index.xml
netlify.toml        # Redirections 301/302, headers Content-Type, build config
astro.config.mjs    # Config Astro — sitemap (filter + priorities), integrations
```

## Domaines de pratique (slugs)

Utilisés dans `src/content/team/*.json` → champ `practiceAreas[]`  
et dans `src/data/tag-to-service.ts` → mapping pour les articles de blog.

| Slug | Label affiché |
|------|---------------|
| `droit-familial` | Droit familial |
| `mediation-familiale` | Médiation familiale |
| `droit-civil-general` | Droit civil général |
| `droit-commercial` | Droit commercial |
| `droit-criminel-penal` | Droit criminel et pénal |
| `droit-emploi-travail` | Droit de l'emploi et du travail |
| `droit-jeunesse` | Droit de la jeunesse |
| `droit-administratif` | Droit administratif |
| `droit-municipal` | Droit municipal |

## CMS Decap — comment ça fonctionne

- URL : **avoc.ca/admin**
- Authentification : compte **GitHub** qui a accès au dépôt `francis-adux/audex`
- Chaque sauvegarde dans le CMS = un commit automatique sur la branche `main`
- Le commit déclenche un déploiement automatique sur Netlify (~2 min)
- Configuration du CMS : `public/admin/config.yml`

## Déploiement Netlify

- Tout `git push` sur `main` déclenche un build automatique
- Build command : `npm run build`
- Publish directory : `dist`
- Node version : 20 (configuré dans `netlify.toml`)
- Domaine : avoc.ca (DNS géré par Netlify ou registraire externe)
- Les fichiers statiques ont priorité sur les redirections `netlify.toml`

## Redirections (netlify.toml)

- 37 redirections 301 permanentes (anciennes URL WordPress → nouvelle structure)
- 1 redirection 301 pour `audrey-castonguay` (ex-membre sans fiche)
- `/sitemap.xml` → `/sitemap-index.xml` (301)
- Voir commentaires dans `netlify.toml` pour le détail par groupe

## Sitemap

Généré automatiquement par `@astrojs/sitemap` à chaque build.
- `https://avoc.ca/sitemap-index.xml` → index pointant vers `sitemap-0.xml`
- Pages exclues : `/merci/` et `/landing/`
- Soumis à Google Search Console : les deux URL ci-dessus

## Google Tag Manager

- GTM ID géré via `src/content/settings/analytics.json`
- Modifiable dans Decap CMS → Paramètres → Analytics
- Chargé dans `BaseLayout.astro` uniquement si `gtmId` est défini

## Phase 2 — à compléter

- [ ] Biographies des avocats à saisir dans Decap CMS (widget markdown WYSIWYG)
- [ ] Photos haute résolution manquantes pour certains membres
- [ ] Redirections 302 équipe → convertir en 301 quand les fiches sont complètes
  (pour l'instant toutes les fiches existent, les 302 ont été supprimées)
- [ ] Consentement cookies / Loi 25 (CMP à choisir : Axeptio ou CookieYes)
- [ ] Pages géolocalisées à enrichir (avocat-quebec-ville, portneuf, donnacona)

## Membres de l'équipe avec champs de pratique configurés

| Fichier JSON | Domaines |
|---|---|
| `kevin-plamondon.json` | Tous (9 domaines) |
| `yannick-drapeau.json` | Familial, Emploi-travail, Civil général |
| `mireille-moreau.json` | Familial, Jeunesse, Commercial, Administratif, Civil général |
| `audrey-auclair.json` | Familial, Civil général |
| `audrey-michaud-roy.json` | Familial, Jeunesse |
| `frederique-drolet.json` | Criminel, Jeunesse |

Les autres membres (étudiants, personnel admin) ont `practiceAreas: []`.
