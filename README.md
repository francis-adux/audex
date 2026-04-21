# Astro Netlify Starter

Starter pour landing pages et blogue propulsés par Astro, hébergés sur Netlify, avec Sveltia CMS pour l'édition et Netlify Forms pour la collecte de formulaires.

## Stack

Astro 5 pour le générateur statique, Tailwind CSS pour le style, Netlify pour l'hébergement et les formulaires, Sveltia CMS pour l'édition de contenu par les clients.

## Installation locale

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:4321

## Déploiement sur Netlify (première fois)

### 1. Pousser sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ton-compte/ton-repo.git
git push -u origin main
```

### 2. Connecter Netlify

Sur app.netlify.com, cliquer Add new site, Import an existing project, choisir GitHub, sélectionner le repo. Netlify détecte Astro automatiquement. Laisser les valeurs par défaut (build command npm run build, publish directory dist) et cliquer Deploy.

### 3. Configurer le domaine

Dans Site settings, Domain management, ajouter ton domaine custom et suivre les instructions DNS.

### 4. Activer Netlify Identity pour le CMS

Dans Site settings, Identity, cliquer Enable Identity. Sous Registration preferences, choisir Invite only (sinon n'importe qui peut s'inscrire). Sous External providers, activer Google si tu veux que les utilisateurs se connectent via Google.

Sous Services, Git Gateway, cliquer Enable Git Gateway. Ça permet au CMS de committer dans le repo sans que les utilisateurs aient un accès GitHub.

### 5. Ajouter le script Identity dans le site

Ajouter ces deux balises script dans `src/layouts/BaseLayout.astro` juste avant la fermeture du `</body>`:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script is:inline>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

### 6. Inviter le premier utilisateur

Dans l'onglet Identity de Netlify, cliquer Invite users, entrer ton courriel. Tu vas recevoir un courriel avec un lien pour créer ton mot de passe. Une fois connecté, tu accèdes au CMS via ton-site.netlify.app/admin.

## Ajouter une nouvelle landing page

### Méthode 1: via Claude Code

Demander à Claude Code de créer un fichier dans `src/content/landings/` avec le nom désiré. Exemple: `src/content/landings/avocat-droit-famille.md`. La page devient accessible à `/landing/avocat-droit-famille`.

### Méthode 2: via le CMS à /admin

Dans l'interface Sveltia, section Landing pages, cliquer New. Remplir les champs, publier.

### IMPORTANT: déclarer le formulaire dans __forms.html

Pour que Netlify détecte le formulaire de chaque nouvelle landing, il faut l'ajouter dans `src/pages/__forms.html`. Sans cette étape, les soumissions ne sont pas reçues.

Exemple pour une landing nommée `avocat-droit-famille`:

```html
<form name="landing-avocat-droit-famille" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="text" name="nom" />
  <input type="email" name="email" />
  <input type="tel" name="telephone" />
  <input type="hidden" name="landing-source" />
  <textarea name="message"></textarea>
</form>
```

Le nom du formulaire doit être `landing-{slug}` où slug correspond au nom du fichier markdown de la landing.

## Ajouter un article de blogue

Via le CMS à /admin, section Articles de blogue, cliquer New. Ou créer manuellement un fichier dans `src/content/blog/YYYY-MM-DD-titre.md` avec le frontmatter approprié (voir l'exemple existant).

## Gérer les soumissions de formulaires

Dans Netlify, onglet Forms. Chaque formulaire apparaît avec ses soumissions. Pour recevoir les soumissions par courriel, aller dans Forms, Settings & usage, Form notifications, ajouter une notification email.

Plan gratuit: 100 soumissions par mois. Plan Pro: 1000 par mois pour 19$ USD.

## Structure du projet

```
src/
  content/
    blog/           Articles de blogue en markdown
    landings/       Landing pages en markdown
    pages/          Pages éditables via CMS (accueil, etc.)
    config.ts       Schémas de validation des collections
  layouts/
    BaseLayout.astro   Layout principal (header, footer, SEO)
  pages/
    index.astro        Page d'accueil
    contact.astro      Page contact avec formulaire
    merci.astro        Page de remerciement après soumission
    __forms.html       Déclaration des formulaires pour Netlify
    blog/
      index.astro      Liste des articles
      [slug].astro     Page d'article dynamique
    landing/
      [slug].astro     Template de landing dynamique
public/
  admin/
    index.html         Interface Sveltia CMS
    config.yml         Configuration des collections du CMS
  images/              Médias uploadés via le CMS
  favicon.svg
netlify.toml           Config build et redirections
astro.config.mjs       Config Astro
tailwind.config.mjs    Config Tailwind (couleurs de marque)
```

## Personnalisation

### Couleurs de marque

Modifier `tailwind.config.mjs`, section `theme.extend.colors.brand`.

### Navigation

Modifier `src/layouts/BaseLayout.astro`, section `<header>`.

### Nom du site

Remplacer "Mon Site" dans `BaseLayout.astro`, les pages, et `public/admin/index.html` (title). Modifier aussi l'URL dans `astro.config.mjs`.

## Workflow recommandé avec Claude Code

Tu ouvres Claude Code dans le projet, tu demandes par exemple: ajoute une landing pour le service de droit corporatif avec un hero axé sur les PME québécoises, trois sections d'avantages, et un formulaire. Claude crée le markdown dans `src/content/landings/` et ajoute la déclaration du formulaire dans `__forms.html`. Tu push, Netlify déploie, la landing est en ligne en 30 secondes.

Pour les clients qui veulent éditer le contenu eux-mêmes, tu leur donnes accès via /admin (après les avoir invités dans Netlify Identity).

## Ressources

- Documentation Astro: https://docs.astro.build
- Documentation Sveltia CMS: https://github.com/sveltia/sveltia-cms
- Documentation Netlify Forms: https://docs.netlify.com/forms/setup/
- Documentation Netlify Identity: https://docs.netlify.com/visitor-access/identity/
